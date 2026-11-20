import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetailPage } from "@/components/shared/ContentDetailPage";
import { eventDetails } from "@/config/content-details";
import { churchProfile } from "@/config/church-profile";

type DetailProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(eventDetails).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: DetailProps): Promise<Metadata> {
  const { slug } = await params;
  const content = eventDetails[slug as keyof typeof eventDetails];
  if (!content) return {};

  return {
    title: `${content.title} | Eventos | ${churchProfile.name}`,
    description: content.intro,
  };
}

export default async function EventDetailPage({ params }: DetailProps) {
  const { slug } = await params;
  const content = eventDetails[slug as keyof typeof eventDetails];
  if (!content) notFound();

  return (
    <ContentDetailPage
      content={content}
      backHref="/eventos"
      backLabel="Eventos"
    />
  );
}
