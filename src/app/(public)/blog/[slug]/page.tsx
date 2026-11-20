import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetailPage } from "@/components/shared/ContentDetailPage";
import { blogDetails } from "@/config/content-details";
import { churchProfile } from "@/config/church-profile";

type DetailProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(blogDetails).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: DetailProps): Promise<Metadata> {
  const { slug } = await params;
  const content = blogDetails[slug as keyof typeof blogDetails];
  if (!content) return {};

  return {
    title: `${content.title} | Blog | ${churchProfile.name}`,
    description: content.intro,
  };
}

export default async function BlogDetailPage({ params }: DetailProps) {
  const { slug } = await params;
  const content = blogDetails[slug as keyof typeof blogDetails];
  if (!content) notFound();

  return (
    <ContentDetailPage
      content={content}
      backHref="/blog"
      backLabel="Blog"
    />
  );
}
