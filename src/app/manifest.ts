import type { MetadataRoute } from "next";
import { brand } from "@/config/brand.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.productName,
    short_name: brand.productName.slice(0, 12),
    description: brand.metadata.description,
    start_url: "/dashboard",
    display: "standalone",
    background_color: brand.colors.page,
    theme_color: brand.colors.page,
    icons: [
      {
        src: brand.logo.type === "image" ? brand.logo.src : "/favicon.ico",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
