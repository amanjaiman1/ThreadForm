import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { useCaseSlugs } from "@/lib/use-cases";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes = [
    { path: "/", priority: 1, freq: "weekly" as const },
    { path: "/pricing", priority: 0.9, freq: "monthly" as const },
    { path: "/about", priority: 0.6, freq: "monthly" as const },
  ];

  const useCaseRoutes = useCaseSlugs.map((slug) => ({
    path: `/${slug}`,
    priority: 0.8,
    freq: "monthly" as const,
  }));

  return [...staticRoutes, ...useCaseRoutes].map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
