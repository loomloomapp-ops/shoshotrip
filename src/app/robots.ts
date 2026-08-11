import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/config";

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  return {
    // /admin is the content panel: a tool, not a page of the site. It also
    // carries a noindex tag, this is the belt to that pair of braces.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
