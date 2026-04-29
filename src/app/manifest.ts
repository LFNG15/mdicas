import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.fullName,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: SITE.background,
    theme_color: SITE.themeColor,
    lang: SITE.language,
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
