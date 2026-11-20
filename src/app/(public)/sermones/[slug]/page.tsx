import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetailPage } from "@/components/shared/ContentDetailPage";
import { sermonDetails } from "@/config/content-details";
import { createPageMetadata } from "@/lib/page-metadata";

type DetailProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(sermonDetails).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: DetailProps): Promise<Metadata> {
  const { slug } = await params;
  const content = sermonDetails[slug as keyof typeof sermonDetails];
  if (!content) return {};

  return createPageMetadata({
    title: `${content.title} | Sermones`,
    description: content.intro,
    pathname: `/sermones/${slug}`,
  });
}

export default async function SermonDetailPage({ params }: DetailProps) {
  const { slug } = await params;
  const content = sermonDetails[slug as keyof typeof sermonDetails];
  if (!content) notFound();

  return (
    <ContentDetailPage
      content={content}
      backHref="/sermones"
      backLabel="Sermones"
    />
  );
}
