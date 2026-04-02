/**
 * TiendaNube → Picky Product Mapper
 *
 * TiendaNube's API returns multilingual objects, variant-based pricing/stock,
 * and category trees. This module normalizes that into Picky's flat Product shape.
 *
 * Full TiendaNube API reference:
 * https://tiendanube.github.io/api-documentation/resources/product
 */

import type { Product } from './data';

// ─── TiendaNube API Types ─────────────────────────────────────────────────────

/** Multilingual text field (TiendaNube uses {es, pt, en} per locale). */
type LocalizedField = { es?: string | null; pt?: string | null; en?: string | null } | null;

export interface TiendaNubeImage {
  id: number;
  src: string;
  position: number;
  alt: string | null;
  created_at: string;
  updated_at: string;
}

export interface TiendaNubeVariant {
  id: number;
  image_id: number | null;
  promotional_price: string | null;
  created_at: string;
  depth: string | null;
  height: string | null;
  values: Array<{ es?: string; pt?: string; en?: string }>;
  price: string;             // String representation of numeric price
  compare_at_price: string | null; // Original/crossed-out price
  weight: string | null;
  width: string | null;
  updated_at: string;
  stock_management: boolean; // false = unlimited
  stock: number | null;
  sku: string | null;
  attributes: Array<{ es?: string; pt?: string; en?: string }>;
}

export interface TiendaNubeCategory {
  id: number;
  name: LocalizedField;
  description: LocalizedField;
  handle: LocalizedField;
  parent: number | null;
  subcategories: number[];
  created_at: string;
  updated_at: string;
}

export interface TiendaNubeProduct {
  id: number;
  name: LocalizedField;
  description: LocalizedField;
  handle: LocalizedField;
  attributes: Array<{ es?: string; pt?: string; en?: string }>;
  published: boolean;
  free_shipping: boolean;
  requires_shipping: boolean;
  canonical_url: string;
  video_url: string | null;
  seo_title: LocalizedField;
  seo_description: LocalizedField;
  brand: string | null;
  created_at: string;
  updated_at: string;
  variants: TiendaNubeVariant[];
  images: TiendaNubeImage[];
  categories: TiendaNubeCategory[];
}

// ─── Mapping Helpers ──────────────────────────────────────────────────────────

/** Extract localized text, preferring es → en → pt → first available value. */
function localized(field: LocalizedField, locale = 'es'): string {
  if (!field) return '';
  return (
    (locale === 'es' ? field.es : null) ??
    field.en ??
    field.pt ??
    ''
  );
}

/** Strip HTML tags and normalize whitespace from TiendaNube's rich-text descriptions. */
function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Determine the lowest active price across all variants.
 * Uses `promotional_price` when available, otherwise `price`.
 */
function getLowestPrice(variants: TiendaNubeVariant[]): number {
  const effective = variants.map((v) => {
    const promo = v.promotional_price ? parseFloat(v.promotional_price) : null;
    const base = parseFloat(v.price);
    return promo && promo < base ? promo : base;
  });
  return Math.min(...effective.filter((p) => !isNaN(p)));
}

/**
 * Get the highest compare_at_price (the "original" price to cross out).
 * Only returned when it's meaningfully greater than the current price.
 */
function getOriginalPrice(
  variants: TiendaNubeVariant[],
  currentPrice: number
): number | undefined {
  const comparePrices = variants
    .map((v) => (v.compare_at_price ? parseFloat(v.compare_at_price) : null))
    .filter((p): p is number => p !== null && !isNaN(p));

  if (comparePrices.length === 0) return undefined;
  const highest = Math.max(...comparePrices);
  return highest > currentPrice ? highest : undefined;
}

/**
 * Aggregate stock across all variants.
 * If any variant has stock_management = false, it's treated as unlimited (999).
 */
function aggregateStock(variants: TiendaNubeVariant[]): number {
  return variants.reduce((total, v) => {
    if (!v.stock_management) return total + 999;
    return total + (v.stock ?? 0);
  }, 0);
}

/**
 * Map TiendaNube variant attributes + values to Picky's variant structure.
 *
 * TiendaNube model:
 *   product.attributes = [{ es: "Color" }, { es: "Talle" }]
 *   variant.values     = [{ es: "Rojo" }, { es: "M" }]
 *
 * Picky model:
 *   variants = [{ label: "Color", type: "color", options: ["Rojo", "Azul"] }]
 */
function mapVariants(tnProduct: TiendaNubeProduct): Product['variants'] {
  if (!tnProduct.attributes || tnProduct.attributes.length === 0) return undefined;

  return tnProduct.attributes.map((attr, attrIdx) => {
    const label = localized(attr as LocalizedField) || `Variante ${attrIdx + 1}`;

    // Collect unique non-empty values for this attribute position
    const options = [
      ...new Set(
        tnProduct.variants
          .map((v) => localized(v.values[attrIdx] as LocalizedField))
          .filter(Boolean)
      ),
    ];

    // Heuristic: if all values look like hex colors → 'color'; if many → 'list'; else 'chip'
    const isColor = options.length > 0 && options.every((o) => /^#[0-9A-Fa-f]{3,6}$/.test(o));
    const type: 'chip' | 'color' | 'list' = isColor ? 'color' : options.length > 6 ? 'list' : 'chip';

    return { label, type, options };
  });
}

/**
 * Build a specs array from available TiendaNube fields.
 * In a production integration, additional specs could come from
 * product.attributes (metafields) or the product description parsing.
 */
function buildSpecs(tnProduct: TiendaNubeProduct): Product['specs'] {
  const specs: Product['specs'] = [];
  const primary = tnProduct.variants[0];

  if (tnProduct.brand) specs.push({ label: 'Marca', value: tnProduct.brand });
  if (primary?.weight) specs.push({ label: 'Peso', value: `${primary.weight} kg` });
  if (primary?.depth)  specs.push({ label: 'Profundidad', value: `${primary.depth} cm` });
  if (primary?.height) specs.push({ label: 'Alto', value: `${primary.height} cm` });
  if (primary?.width)  specs.push({ label: 'Ancho', value: `${primary.width} cm` });

  // Always include SKU as last spec for scanning reference
  const sku = primary?.sku || `TN-${tnProduct.id}`;
  specs.push({ label: 'SKU', value: sku });

  return specs;
}

// ─── Main Mapper ──────────────────────────────────────────────────────────────

/**
 * Maps a single TiendaNube product to Picky's internal Product format.
 *
 * Extended return type includes `tiendaNubeId` for reverse-sync operations.
 * TODO (Supabase): Persist this mapping to a `products` table with a
 *   `tiendanube_id` column to enable two-way stock and price sync.
 */
export function mapTiendaNubeToPickyProduct(
  tnProduct: TiendaNubeProduct
): Product & { tiendaNubeId: number } {
  const name = localized(tnProduct.name);
  const rawDescription = localized(tnProduct.description);
  const description = rawDescription ? stripHtml(rawDescription) : name;

  const price = getLowestPrice(tnProduct.variants);
  const originalPrice = getOriginalPrice(tnProduct.variants, price);
  const stock = Math.min(aggregateStock(tnProduct.variants), 9999);

  // Use first variant SKU, fall back to TN product ID
  const sku = tnProduct.variants[0]?.sku || `TN-${tnProduct.id}`;

  // Primary image; additional images stored as extra_images spec comment
  // TODO: When Product interface supports multiple images, store full array here
  const primaryImage =
    tnProduct.images.sort((a, b) => a.position - b.position)[0]?.src ||
    '/picky-scan.png';

  // Map first category; deeper category hierarchy can be handled later
  const categoryName = tnProduct.categories[0]
    ? localized(tnProduct.categories[0].name)
    : 'General';

  return {
    id: `tn-${tnProduct.id}`,
    tiendaNubeId: tnProduct.id,
    sku,
    name,
    brand: tnProduct.brand || undefined,
    category: categoryName,
    price,
    originalPrice,
    image: primaryImage,
    description,
    stock,
    // zone is not a TiendaNube concept; store managers set it manually
    // TODO (Admin): Add a UI in /store/[id] to set zone per product
    zone: undefined,
    specs: buildSpecs(tnProduct),
    variants: mapVariants(tnProduct),
  };
}

/**
 * Maps an array of TiendaNube products to Picky format.
 * Filters out unpublished products automatically.
 */
export function mapTiendaNubeProducts(
  tnProducts: TiendaNubeProduct[]
): Array<Product & { tiendaNubeId: number }> {
  return tnProducts
    .filter((p) => p.published)
    .map(mapTiendaNubeToPickyProduct);
}
