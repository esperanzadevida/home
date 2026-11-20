import { PublicPageRenderer, getPublicPageMetadata } from "@/components/shared/PublicPageRenderer";

export const metadata = getPublicPageMetadata("ministerios");

export default function MinisteriosPage() {
  return <PublicPageRenderer slug="ministerios" />;
}
