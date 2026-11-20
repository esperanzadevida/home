import { PublicPageRenderer, getPublicPageMetadata } from "@/components/shared/PublicPageRenderer";

export const metadata = getPublicPageMetadata("oracion");

export default function OracionPage() {
  return <PublicPageRenderer slug="oracion" />;
}
