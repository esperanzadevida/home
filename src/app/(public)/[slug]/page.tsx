import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPageRenderer } from "@/components/shared/PublicPageRenderer";
import { churchProfile } from "@/config/church-profile";
import { createPageMetadata } from "@/lib/page-metadata";
import {
  publicPageBlueprints,
  type PublicPageSlug,
} from "@/config/public-pages";

type PublicPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return (["blog", "galeria"] as const).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PublicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = publicPageBlueprints[slug as PublicPageSlug];

  if (!page) return {};

  return createPageMetadata({
    title: `${page.title} | ${churchProfile.name}`,
    description: page.intro,
    pathname: `/${slug}`,
    titleAbsolute: true,
  });
}

export default async function PublicSectionPage({ params }: PublicPageProps) {
  const { slug } = await params;
  if (!(slug in publicPageBlueprints)) notFound();

  return <PublicPageRenderer slug={slug as PublicPageSlug} />;
}
