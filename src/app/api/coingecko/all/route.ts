import supabase from "@/supabase/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("coingecko")
      .select("data")
      .eq("token", "all")
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);

    const priceData = data?.data;

    if (!priceData) throw new Error("Data not found.");

    return NextResponse.json(priceData);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
