import type { MetadataRoute } from "next";
import { brand } from "@/config/brand.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.productName,
    short_name: "BlackBox Cash",
    description: brand.metadata.description,
    start_url: "/dashboard",
    display: "standalone",
    background_color: brand.colors.page,
    theme_color: brand.colors.page,
    icons: [
      {
        src: "/favicon.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/logo-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
