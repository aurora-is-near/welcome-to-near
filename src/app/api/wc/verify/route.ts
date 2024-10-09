export async function GET() {
  try {
    const code = process.env.WC_DOMAIN_VERIFICATION_CODE;
    if (code === undefined)
      throw new Error("WC domain verification code not set");

    return new Response(code, {
      status: 200,
      headers: {
        "Content-type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("WC verification code not set not set", {
      status: 500,
    });
  }
}
