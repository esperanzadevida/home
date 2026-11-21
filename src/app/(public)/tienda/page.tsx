import { ScrollScrubHero } from "@/components/shared/ScrollScrubHero";
import { StoreHeroOverlay } from "@/components/store/StoreHeroOverlay";
import { StorefrontExperience } from "@/components/store/StorefrontExperience";
import { getPublicPageMetadata } from "@/components/shared/PublicPageRenderer";

export const metadata = getPublicPageMetadata("tienda");

export default function TiendaPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollScrubHero
        videoSrc="/videos/store-scrub.mp4"
        posterSrc="/videos/store-poster.webp"
        estimatedBytes={1_120_916}
        scrollHeightVh={300}
        accentTheme="violet"
        cueLabel="Desliza para abrir la colección"
      >
        <StoreHeroOverlay />
      </ScrollScrubHero>

      <StorefrontExperience />
    </div>
  );
}
