import { PublicPageRenderer, getPublicPageMetadata } from "@/components/shared/PublicPageRenderer";

export const metadata = getPublicPageMetadata("eventos");

export default function EventosPage() {
  return <PublicPageRenderer slug="eventos" />;
}
