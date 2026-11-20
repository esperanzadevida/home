import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetailPage } from "@/components/shared/ContentDetailPage";
import { ProductCartActions } from "@/components/shared/ProductCartActions";
import { productDetails } from "@/config/content-details";
import { churchProfile } from "@/config/church-profile";

type DetailProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

const productOffers = {
  "biblia-de-estudio": { price: 28 },
  "cuaderno-de-reflexion": { price: 9 },
  "camiseta-domenica": { price: 18, variants: ["S", "M", "L", "XL"] },
} as const;

export function generateStaticParams() {
  return Object.keys(productDetails).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: DetailProps): Promise<Metadata> {
  const { slug } = await params;
  const content = productDetails[slug as keyof typeof productDetails];
  if (!content) return {};

  return {
    title: `${content.title} | Recursos | ${churchProfile.name}`,
    description: content.intro,
  };
}

export default async function ProductDetailPage({ params }: DetailProps) {
  const { slug } = await params;
  const content = productDetails[slug as keyof typeof productDetails];
  if (!content) notFound();
  const offer = productOffers[slug as keyof typeof productOffers];

  return (
    <ContentDetailPage
      content={content}
      backHref="/tienda"
      backLabel="Recursos"
      actions={
        offer ? (
          <ProductCartActions
            productId={slug}
            title={content.title}
            price={offer.price}
            variants={"variants" in offer ? [...offer.variants] : undefined}
          />
        ) : null
      }
    />
  );
}
