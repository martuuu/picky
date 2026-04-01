/**
 * TiendaNube API Client
 *
 * Setup steps:
 * 1. Register at https://partners.tiendanube.com/
 * 2. Create a new Application → get CLIENT_ID + CLIENT_SECRET
 * 3. Create a free demo store from the partner portal
 * 4. Set your callback URL to: http://localhost:3000/api/tiendanube/auth
 * 5. Add to your .env:
 *    TIENDANUBE_CLIENT_ID=your_client_id
 *    TIENDANUBE_CLIENT_SECRET=your_client_secret
 *    TIENDANUBE_ACCESS_TOKEN=your_access_token   (once obtained via OAuth)
 *    TIENDANUBE_STORE_ID=your_store_id           (once obtained via OAuth)
 */

const TIENDANUBE_API_URL = "https://api.tiendanube.com/v1";

interface TiendaNubeProduct {
  id: number;
  name: { es: string };
  description: { es: string };
  price: string;
  compare_at_price?: string;
  images: Array<{ src: string }>;
  variants: Array<{
    id: number;
    price: string;
    stock_management: boolean;
    stock: number;
    attributes: Array<{ en: string; es: string }>;
  }>;
  categories: Array<{ id: number; name: { es: string } }>;
}

function getHeaders() {
  const token = process.env.TIENDANUBE_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "TIENDANUBE_ACCESS_TOKEN not set. Complete the OAuth flow first."
    );
  }
  return {
    Authentication: `bearer ${token}`,
    "Content-Type": "application/json",
    "User-Agent": "Picky-App/1.0 (martin@picky.com)",
  };
}

function getStoreId() {
  const storeId = process.env.TIENDANUBE_STORE_ID;
  if (!storeId) {
    throw new Error(
      "TIENDANUBE_STORE_ID not set. Complete the OAuth flow first."
    );
  }
  return storeId;
}

/**
 * Fetch all products from TiendaNube store
 */
export async function getTiendaNubeProducts(
  page = 1,
  perPage = 50
): Promise<TiendaNubeProduct[]> {
  const storeId = getStoreId();
  const response = await fetch(
    `${TIENDANUBE_API_URL}/${storeId}/products?page=${page}&per_page=${perPage}`,
    { headers: getHeaders() }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`TiendaNube API error ${response.status}: ${error}`);
  }

  return response.json();
}

/**
 * Fetch a single product by ID
 */
export async function getTiendaNubeProduct(
  productId: number
): Promise<TiendaNubeProduct> {
  const storeId = getStoreId();
  const response = await fetch(
    `${TIENDANUBE_API_URL}/${storeId}/products/${productId}`,
    { headers: getHeaders() }
  );

  if (!response.ok) {
    throw new Error(`TiendaNube API error ${response.status}`);
  }

  return response.json();
}

/**
 * Create a new product in TiendaNube
 */
export async function createTiendaNubeProduct(data: {
  name: string;
  description: string;
  price: number;
  stock?: number;
  imageUrl?: string;
  categoryId?: number;
}): Promise<TiendaNubeProduct> {
  const storeId = getStoreId();

  const payload = {
    name: { es: data.name },
    description: { es: data.description },
    variants: [
      {
        price: data.price.toString(),
        ...(data.stock !== undefined && { stock: data.stock }),
      },
    ],
    ...(data.imageUrl && { images: [{ src: data.imageUrl }] }),
    ...(data.categoryId && { categories: [{ id: data.categoryId }] }),
  };

  const response = await fetch(
    `${TIENDANUBE_API_URL}/${storeId}/products`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`TiendaNube API error ${response.status}: ${error}`);
  }

  return response.json();
}

/**
 * Exchange OAuth code for access token.
 * Call this from your /api/tiendanube/auth route after redirect.
 */
export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  token_type: string;
  scope: string;
  user_id: number;
}> {
  const clientId = process.env.TIENDANUBE_CLIENT_ID;
  const clientSecret = process.env.TIENDANUBE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "TIENDANUBE_CLIENT_ID and TIENDANUBE_CLIENT_SECRET must be set in .env"
    );
  }

  const response = await fetch(
    "https://www.tiendanube.com/apps/authorize/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange error ${response.status}: ${error}`);
  }

  return response.json();
}
