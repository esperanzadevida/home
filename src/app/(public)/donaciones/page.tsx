import { PublicPageRenderer, getPublicPageMetadata } from "@/components/shared/PublicPageRenderer";

export const metadata = getPublicPageMetadata("donaciones");

export default function DonacionesPage() {
  return <PublicPageRenderer slug="donaciones" />;
}
