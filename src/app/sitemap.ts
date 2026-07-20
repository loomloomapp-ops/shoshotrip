import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/config";
import { localePath, locales } from "@/lib/i18n";
import { getAllTours } from "@/content/tours";
import { legalDocs } from "@/content/legal";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  const entries: MetadataRoute.Sitemap = [];

  const paths = [
    "",
    "tours",
    ...getAllTours().map((t) => `tours/${t.slug}`),
    ...legalDocs.map((d) => `legal/${d.slug}`),
  ];

  locales.forEach((locale) => {
    paths.forEach((path) => {
      entries.push({
        url: base + localePath(locale, path),
        lastModified: new Date(),
        changeFrequency: path.startsWith("legal") ? "yearly" : "weekly",
        priority: path === "" ? 1 : path === "tours" ? 0.9 : 0.7,
      });
    });
  });

  return entries;
}
