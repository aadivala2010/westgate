import type { MetadataRoute } from "next";
import { site, towns } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    ...towns.map((t) => ({
      url: `${site.url}/service-area/${t.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
