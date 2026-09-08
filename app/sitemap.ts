import type { MetadataRoute } from "next";
import { site, townPages } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    ...townPages.map((t) => ({
      url: `${site.url}/service-area/${t.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
