import supabase from "@/supabase/client";
import { coingeckoSymbolMap } from "@/utils/getCoingeckoSymbol";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const prepareCoingeckoRequestPayload = (
  record: Record<string, string>
): string => {
  const map: Record<string, boolean> = {};
  const result = [];
  for (const key in record) {
    const value = record[key];
    if (value === "") continue;
    if (map[value]) continue;
    map[value] = true;
    result.push(value);
  }
  return result.join(",");
};

export async function GET(req: NextRequest) {
  try {
    const authorization = req.headers.get("authorization");

    if (
      !process.env["CRON_SECRET"] ||
      authorization !== `Bearer ${process.env["CRON_SECRET"]}`
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const baseUrl = "https://pro-api.coingecko.com/api/v3/simple/price";
    const ids = prepareCoingeckoRequestPayload(coingeckoSymbolMap);

    const url = `${baseUrl}?ids=${encodeURIComponent(ids)}&vs_currencies=usd`;

    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        "x-cg-pro-api-key": process.env.COINGECKO_API_KEY,
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Error: ${res.status}`);

    const data = await res.json();

    const { data: existingData, error } = await supabase
      .from("coingecko")
      .select("id")
      .eq("token", "all")
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);

    const { id } = existingData || {};

    if (id) {
      const { error: updateError } = await supabase
        .from("coingecko")
        .update({
          data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (updateError) throw new Error(updateError.message);
    } else {
      const { error: createError } = await supabase.from("coingecko").insert({
        token: "all",
        updated_at: new Date().toISOString(),
        data,
      });

      if (createError) throw new Error(createError.message);
    }

    return NextResponse.json({ result: "OK" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500 });
  }
}
