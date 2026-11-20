import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetailPage } from "@/components/shared/ContentDetailPage";
import { blogDetails } from "@/config/content-details";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/page-metadata";
import { churchProfile } from "@/config/church-profile";
import { getCanonicalUrl } from "@/lib/site-url";

type DetailProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(blogDetails).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: DetailProps): Promise<Metadata> {
  const { slug } = await params;
  const content = blogDetails[slug as keyof typeof blogDetails];
  if (!content) return {};

  return createPageMetadata({
    title: `${content.title} | Blog`,
    description: content.intro,
    pathname: `/blog/${slug}`,
    openGraphType: "article",
  });
}

export default async function BlogDetailPage({ params }: DetailProps) {
  const { slug } = await params;
  const content = blogDetails[slug as keyof typeof blogDetails];
  if (!content) notFound();
  const canonical = getCanonicalUrl(`/blog/${slug}`);
  const articleStructuredData = content.datePublished ? {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: content.title,
    description: content.intro,
    datePublished: content.datePublished,
    author: {
      "@type": "Person",
      name: content.author,
    },
    publisher: {
      "@type": "Organization",
      name: churchProfile.name,
    },
    ...(canonical ? { mainEntityOfPage: canonical, url: canonical } : {}),
  } : null;

  return (
    <>
      {articleStructuredData ? <JsonLd data={articleStructuredData} /> : null}
      <ContentDetailPage
        content={content}
        backHref="/blog"
        backLabel="Blog"
      />
    </>
  );
}
