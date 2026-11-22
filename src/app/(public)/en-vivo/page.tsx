import { ScrollScrubHero } from "@/components/shared/ScrollScrubHero";
import { LiveHeroOverlay } from "@/components/shared/LiveHeroOverlay";
import { PublicPageRenderer, getPublicPageMetadata } from "@/components/shared/PublicPageRenderer";

export const metadata = getPublicPageMetadata("en-vivo");

export default function EnVivoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollScrubHero
        videoSrc="/videos/live-scrub.mp4"
        posterSrc="/videos/live-poster.webp"
        scrollHeightVh={280}
        accentTheme="aurora"
        cueLabel="Desliza para entrar"
      >
        <LiveHeroOverlay />
      </ScrollScrubHero>

      <div id="contenido-en-vivo">
        <PublicPageRenderer slug="en-vivo" hideHero />
      </div>
    </div>
  );
}
