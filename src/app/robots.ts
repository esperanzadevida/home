import { MetadataRoute } from "next";
import { getCanonicalUrl, isIndexableDeployment, withBasePath } from "@/lib/site-url";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = getCanonicalUrl("/sitemap.xml");

  if (!isIndexableDeployment() || !sitemapUrl) {
    return {
      rules: { userAgent: "*", disallow: withBasePath("/") },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: withBasePath("/"),
      disallow: [withBasePath("/admin/"), withBasePath("/api/")],
    },
    sitemap: sitemapUrl,
  };
}
