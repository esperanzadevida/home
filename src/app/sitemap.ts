import { MetadataRoute } from "next";
import {
  sermonDetails,
  eventDetails,
  blogDetails,
  productDetails,
} from "@/config/content-details";
import { getCanonicalUrl, isIndexableDeployment } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexableDeployment()) return [];

  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
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
    "/galeria",
  ].map((route) => ({
    url: getCanonicalUrl(route)!,
    priority: route === "/" ? 1 : 0.8,
  }));

  const sermonRoutes: MetadataRoute.Sitemap = Object.keys(sermonDetails).map(
    (slug) => ({
      url: getCanonicalUrl(`/sermones/${slug}`)!,
      priority: 0.7,
    })
  );

  const eventRoutes: MetadataRoute.Sitemap = Object.keys(eventDetails).map(
    (slug) => ({
      url: getCanonicalUrl(`/eventos/${slug}`)!,
      priority: 0.6,
    })
  );

  const blogRoutes: MetadataRoute.Sitemap = Object.keys(blogDetails).map(
    (slug) => ({
      url: getCanonicalUrl(`/blog/${slug}`)!,
      priority: 0.6,
    })
  );

  const productRoutes: MetadataRoute.Sitemap = Object.keys(productDetails).map(
    (slug) => ({
      url: getCanonicalUrl(`/tienda/${slug}`)!,
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
