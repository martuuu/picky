import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Unsplash — used for mock product images in prototype
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // TiendaNube CDN — product images synced from store
      {
        protocol: "https",
        hostname: "*.tiendanube.com",
      },
      {
        protocol: "https",
        hostname: "*.nuvemshop.com.br", // TiendaNube's Brazilian CDN
      },
      // Supabase Storage — for future user avatars, custom product images
      // TODO (Supabase): Replace placeholder with your actual Supabase project ref
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      // External picker/user avatars (used in prototype)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // TODO (Production): Enable when deploying to Vercel or Docker
  // output: "standalone",

  // TODO (Performance): Enable when TiendaNube product sync is implemented
  // experimental: {
  //   ppr: true, // Partial Pre-rendering for hybrid static/dynamic pages
  // },
};

export default nextConfig;
