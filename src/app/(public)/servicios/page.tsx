import { PublicPageRenderer, getPublicPageMetadata } from "@/components/shared/PublicPageRenderer";

export const metadata = getPublicPageMetadata("servicios");

export default function ServiciosPage() {
  return <PublicPageRenderer slug="servicios" />;
}
