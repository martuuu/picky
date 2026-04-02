import { NextResponse } from "next/server";
import { getTiendaNubeProducts } from "@/lib/tiendanube";
import { mapTiendaNubeProducts } from "@/lib/tiendanubeMapper";

/**
 * GET /api/tiendanube/products
 *
 * Fetches all products from the configured TiendaNube store and maps them
 * to Picky's internal Product format. Used by the /store admin page toggle.
 *
 * Query params:
 *   page     = page number (default 1)
 *   per_page = products per page (default 50, max 200)
 *
 * TODO (Supabase): Replace direct API calls with a cached version:
 *   - Sync TiendaNube products to the Supabase `products` table on a schedule
 *   - Serve from DB here for lower latency and offline resilience
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const perPage = Math.min(parseInt(searchParams.get("per_page") ?? "50", 10), 200);

  try {
    const tnProducts = await getTiendaNubeProducts(page, perPage);
    const mapped = mapTiendaNubeProducts(tnProducts);

    return NextResponse.json(mapped, {
      headers: {
        // Short cache: stale data is acceptable for a minute in the admin
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    // Return structured error so the client can show a useful fallback
    return NextResponse.json(
      {
        error: "Failed to fetch TiendaNube products",
        details: message,
        // Hint: helps the admin UI decide whether to show a credential warning
        credentialsMissing:
          message.includes("TIENDANUBE_ACCESS_TOKEN") ||
          message.includes("TIENDANUBE_STORE_ID"),
      },
      { status: 500 }
    );
  }
}
