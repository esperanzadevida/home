import { PublicPageRenderer, getPublicPageMetadata } from "@/components/shared/PublicPageRenderer";

export const metadata = getPublicPageMetadata("contacto");

export default function ContactoPage() {
  return <PublicPageRenderer slug="contacto" />;
}
