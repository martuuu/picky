import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken } from "@/lib/tiendanube";

/**
 * OAuth Callback route for TiendaNube
 *
 * Flow:
 * 1. User installs your app from TiendaNube admin
 * 2. TiendaNube redirects to this URL with ?code=xxx
 * 3. We exchange the code for an access_token + store_id
 * 4. Save both in your DB or .env for subsequent API calls
 *
 * Configure redirect URL in Partner Portal as:
 * Development: http://localhost:3000/api/tiendanube/auth
 * Production:  https://your-domain.com/api/tiendanube/auth
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "No authorization code received from TiendaNube" },
      { status: 400 }
    );
  }

  try {
    const tokenData = await exchangeCodeForToken(code);

    // In production: save tokenData.access_token and tokenData.user_id to DB
    // For prototype: log them so you can paste into .env
    console.log("🎉 TiendaNube OAuth successful!");
    console.log(`TIENDANUBE_ACCESS_TOKEN=${tokenData.access_token}`);
    console.log(`TIENDANUBE_STORE_ID=${tokenData.user_id}`);

    return NextResponse.json({
      success: true,
      message: "Authentication successful! Copy the values from server console to your .env file.",
      storeId: tokenData.user_id,
      scope: tokenData.scope,
      // Never expose access_token in response in production
    });
  } catch (error) {
    console.error("TiendaNube auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed", details: String(error) },
      { status: 500 }
    );
  }
}
