import { PublicPageRenderer, getPublicPageMetadata } from "@/components/shared/PublicPageRenderer";

export const metadata = getPublicPageMetadata("nosotros");

export default function NosotrosPage() {
  return <PublicPageRenderer slug="nosotros" />;
}
