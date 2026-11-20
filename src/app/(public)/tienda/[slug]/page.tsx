import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetailPage } from "@/components/shared/ContentDetailPage";
import { ProductCartActions } from "@/components/shared/ProductCartActions";
import { productDetails } from "@/config/content-details";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/page-metadata";
import { getCanonicalUrl } from "@/lib/site-url";

type DetailProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

const productOffers = {
  "biblia-de-estudio": {
    price: 28,
    coverImage: "/images/hero/bible-study.jpg",
    category: "Biblias",
  },
  "cuaderno-de-reflexion": {
    price: 9,
    coverImage: "/images/hero/christian-books-bible-store.jpg",
    category: "Accesorios",
  },
  "camiseta-domenica": {
    price: 18,
    coverImage: "/images/hero/merch-tshirt-hoodie-minimal.jpg",
    category: "Ropa",
    variants: ["S", "M", "L", "XL"],
  },
} as const;

export function generateStaticParams() {
  return Object.keys(productDetails).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: DetailProps): Promise<Metadata> {
  const { slug } = await params;
  const content = productDetails[slug as keyof typeof productDetails];
  if (!content) return {};

  return createPageMetadata({
    title: `${content.title} | Recursos`,
    description: content.intro,
    pathname: `/tienda/${slug}`,
  });
}

export default async function ProductDetailPage({ params }: DetailProps) {
  const { slug } = await params;
  const content = productDetails[slug as keyof typeof productDetails];
  if (!content) notFound();
  const offer = productOffers[slug as keyof typeof productOffers];
  const canonical = getCanonicalUrl(`/tienda/${slug}`);
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: content.title,
    description: content.intro,
    category: content.eyebrow.replace("Recurso · ", ""),
    ...(canonical ? { url: canonical } : {}),
  };

  return (
    <>
      <JsonLd data={productStructuredData} />
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
              coverImage={offer.coverImage}
              category={offer.category}
              variants={"variants" in offer ? [...offer.variants] : undefined}
            />
          ) : null
        }
      />
    </>
  );
}
