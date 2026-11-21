import type { Metadata } from "next";
import { churchProfile } from "@/config/church-profile";
import {
  getCanonicalUrl,
  getSiteOrigin,
  isIndexableDeployment,
} from "@/lib/site-url";

type PageMetadataInput = {
  title: string;
  description: string;
  pathname: string;
  openGraphType?: "website" | "article";
  titleAbsolute?: boolean;
};

export function createPageMetadata({
  title,
  description,
  pathname,
  openGraphType = "website",
  titleAbsolute = false,
}: PageMetadataInput): Metadata {
  const canonical = getCanonicalUrl(pathname);
  const origin = getSiteOrigin();
  const socialImage = origin ? getCanonicalUrl("/og.png") : undefined;

  return {
    title: titleAbsolute ? { absolute: title } : title,
    description,
    robots: {
      index: isIndexableDeployment(),
      follow: isIndexableDeployment(),
    },
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title,
      description,
      type: openGraphType,
      locale: "es_EC",
      siteName: churchProfile.name,
      ...(canonical ? { url: canonical } : {}),
      ...(socialImage ? { images: [{ url: socialImage, width: 1200, height: 630, alt: `${churchProfile.name} · ${churchProfile.signature}` }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(socialImage ? { images: [socialImage] } : {}),
    },
  };
}
