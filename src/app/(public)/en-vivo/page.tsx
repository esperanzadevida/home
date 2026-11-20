import { PublicPageRenderer, getPublicPageMetadata } from "@/components/shared/PublicPageRenderer";

export const metadata = getPublicPageMetadata("en-vivo");

export default function EnVivoPage() {
  return <PublicPageRenderer slug="en-vivo" />;
}
