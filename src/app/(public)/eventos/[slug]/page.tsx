import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetailPage } from "@/components/shared/ContentDetailPage";
import { eventDetails } from "@/config/content-details";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/page-metadata";
import { churchProfile } from "@/config/church-profile";
import { getCanonicalUrl } from "@/lib/site-url";

type DetailProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(eventDetails).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: DetailProps): Promise<Metadata> {
  const { slug } = await params;
  const content = eventDetails[slug as keyof typeof eventDetails];
  if (!content) return {};

  return createPageMetadata({
    title: `${content.title} | Eventos`,
    description: content.intro,
    pathname: `/eventos/${slug}`,
  });
}

export default async function EventDetailPage({ params }: DetailProps) {
  const { slug } = await params;
  const content = eventDetails[slug as keyof typeof eventDetails];
  if (!content) notFound();
  const canonical = getCanonicalUrl(`/eventos/${slug}`);
  const startDates = content.startDates ?? [];

  const eventStructuredData = startDates.map((startDate) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: content.title,
    description: content.intro,
    startDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    ...(canonical ? { url: canonical } : {}),
    location: {
      "@type": "Place",
      name: churchProfile.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: churchProfile.address,
        addressLocality: "Ambato",
        addressRegion: "Tungurahua",
        addressCountry: "EC",
      },
    },
    organizer: {
      "@type": "Church",
      name: churchProfile.name,
      ...(getCanonicalUrl("/") ? { url: getCanonicalUrl("/") } : {}),
    },
  }));

  return (
    <>
      {eventStructuredData.map((data, index) => (
        <JsonLd key={`${slug}-${index}`} data={data} />
      ))}
      <ContentDetailPage
        content={content}
        backHref="/eventos"
        backLabel="Eventos"
      />
    </>
  );
}
