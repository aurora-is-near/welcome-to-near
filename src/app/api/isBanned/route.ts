import { isBannedNearAddress } from "@aurora-is-near/is-banned-near-address";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get("address");
    if (address === null) {
      return new Response(`No address provided`, {
        status: 400,
      });
    }
    return NextResponse.json({
      isBanned: isBannedNearAddress(address),
    });
  } catch (error) {
    console.error(error);
    return new Response(`Failed to verify address`, {
      status: 500,
    });
  }
}
