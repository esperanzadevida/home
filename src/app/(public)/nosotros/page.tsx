import { PublicPageRenderer, getPublicPageMetadata } from "@/components/shared/PublicPageRenderer";
import { JsonLd } from "@/components/seo/JsonLd";
import { churchProfile } from "@/config/church-profile";
import { getCanonicalUrl } from "@/lib/site-url";

export const metadata = getPublicPageMetadata("nosotros");

export default function NosotrosPage() {
  const canonical = getCanonicalUrl("/");
  const churchStructuredData = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: churchProfile.name,
    description: "Una comunidad de fe en Ambato que celebra, aprende y sirve junto a cada generación.",
    telephone: churchProfile.phone,
    email: churchProfile.email,
    foundingDate: String(churchProfile.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: churchProfile.address,
      addressLocality: "Ambato",
      addressRegion: "Tungurahua",
      addressCountry: "EC",
    },
    ...(canonical ? { url: canonical, "@id": `${canonical}#church` } : {}),
  };

  return (
    <>
      <JsonLd data={churchStructuredData} />
      <PublicPageRenderer slug="nosotros" />
    </>
  );
}
