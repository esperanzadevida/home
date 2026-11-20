import { PublicPageRenderer, getPublicPageMetadata } from "@/components/shared/PublicPageRenderer";

export const metadata = getPublicPageMetadata("tienda");

export default function TiendaPage() {
  return <PublicPageRenderer slug="tienda" />;
}
