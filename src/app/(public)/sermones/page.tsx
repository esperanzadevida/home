import { PublicPageRenderer, getPublicPageMetadata } from "@/components/shared/PublicPageRenderer";

export const metadata = getPublicPageMetadata("sermones");

export default function SermonesPage() {
  return <PublicPageRenderer slug="sermones" />;
}
