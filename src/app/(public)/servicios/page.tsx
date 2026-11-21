import { ScrollScrubHero } from "@/components/shared/ScrollScrubHero";
import { ServicesHeroOverlay } from "@/components/shared/ServicesHeroOverlay";
import { PublicPageRenderer, getPublicPageMetadata } from "@/components/shared/PublicPageRenderer";

export const metadata = getPublicPageMetadata("servicios");

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollScrubHero
        videoSrc="/videos/services-scrub.mp4"
        posterSrc="/videos/services-poster.webp"
        estimatedBytes={3_006_961}
        scrollHeightVh={300}
        accentTheme="amber"
        cueLabel="Desliza para conocer los horarios"
      >
        <ServicesHeroOverlay />
      </ScrollScrubHero>

      <div id="contenido-servicios">
        <PublicPageRenderer slug="servicios" hideHero />
      </div>
    </div>
  );
}
