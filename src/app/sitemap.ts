import { MetadataRoute } from "next";
import {
  sermonDetails,
  eventDetails,
  blogDetails,
  productDetails,
} from "@/config/content-details";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://domenica-iglesia-aog.vercel.app";
  const currentDate = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/nosotros",
    "/servicios",
    "/sermones",
    "/eventos",
    "/ministerios",
    "/blog",
    "/tienda",
    "/oracion",
    "/donaciones",
    "/en-vivo",
    "/contacto",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const sermonRoutes: MetadataRoute.Sitemap = Object.keys(sermonDetails).map(
    (slug) => ({
      url: `${baseUrl}/sermones/${slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );

  const eventRoutes: MetadataRoute.Sitemap = Object.keys(eventDetails).map(
    (slug) => ({
      url: `${baseUrl}/eventos/${slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
  );

  const blogRoutes: MetadataRoute.Sitemap = Object.keys(blogDetails).map(
    (slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })
  );

  const productRoutes: MetadataRoute.Sitemap = Object.keys(productDetails).map(
    (slug) => ({
      url: `${baseUrl}/tienda/${slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
  );

  return [
    ...staticRoutes,
    ...sermonRoutes,
    ...eventRoutes,
    ...blogRoutes,
    ...productRoutes,
  ];
}
