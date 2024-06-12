import supabase from "@/supabase/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { coinId: string } }
) {
  const authorization = request.headers.get("authorization");

  if (
    !process.env["CRON_SECRET"] ||
    authorization !== `Bearer ${process.env["CRON_SECRET"]}`
  ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { coinId } = params;

  // In seconds
  const now = Math.floor(Date.now() / 1000);
  const twoDaysAgo = now - 2 * 24 * 60 * 60;

  try {
    const chartRes = await fetch(
      `https://pro-api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=usd&from=${twoDaysAgo}&to=${now}`,
      {
        headers: {
          accept: "application/json",
          "x-cg-pro-api-key": process.env.COINGECKO_API_KEY,
        },
        cache: "no-store",
      }
    );

    if (!chartRes.ok) {
      throw new Error(`Error getting historical prices: ${chartRes.status}`);
    }

    const historicalData = await chartRes.json();

    const prices = historicalData?.prices;

    if (!prices || prices.length === 0) {
      throw new Error("Historical price data not found.");
    }

    const lastDaysPrices = prices.slice(Math.max(prices.length - 24, 0));

    const historicalPrices = lastDaysPrices.map((item: any) => ({
      timestamp: item[0],
      price: item[1],
    }));

    const latestRes = await fetch(
      `https://pro-api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`,
      {
        headers: {
          accept: "application/json",
          "x-cg-pro-api-key": process.env.COINGECKO_API_KEY,
        },
        cache: "no-store",
      }
    );

    if (!latestRes.ok) {
      throw new Error(`Error getting latest price: ${latestRes.status}`);
    }

    const latestData = await latestRes.json();

    const latestPrice = latestData[coinId]?.usd;
    const oneDayChange = latestData[coinId]?.usd_24h_change;

    if (!latestPrice || oneDayChange === undefined) {
      throw new Error("Latest price data not found.");
    }

    const newData = {
      price: latestPrice,
      oneDayChange,
      historicalPrices,
    };

    const { data: existingData, error } = await supabase
      .from("coingecko")
      .select("id")
      .eq("token", coinId)
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);

    const { id } = existingData || {};

    if (id) {
      const { error: updateError } = await supabase
        .from("coingecko")
        .update({
          data: newData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (updateError) throw new Error(updateError.message);
    } else {
      const { error: createError } = await supabase.from("coingecko").insert({
        token: coinId,
        updated_at: new Date().toISOString(),
        data: newData,
      });

      if (createError) throw new Error(createError.message);
    }

    return NextResponse.json({ result: "OK" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500 });
  }
}
