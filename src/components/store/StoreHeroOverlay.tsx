"use client";

import { useRef, type CSSProperties } from "react";
import Image from "@/components/shared/SiteImage";
import { ArrowDown, HeartHandshake, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import { useTwoBeatScrub } from "@/hooks/useTwoBeatScrub";

const STORE_CHAPTERS = [
  { id: "coleccion", num: "01", label: "Colección", targetProgress: 0.04 },
  { id: "proposito", num: "02", label: "Calidad y misión", targetProgress: 0.88 },
] as const;

export function StoreHeroOverlay() {
  const band0Ref = useRef<HTMLElement>(null);
  const band1Ref = useRef<HTMLElement>(null);
  const { openCart, totalItems } = useCart();
  const { activeChapter, scrollToChapter } = useTwoBeatScrub(band0Ref, band1Ref);

  const current = STORE_CHAPTERS[activeChapter] ?? STORE_CHAPTERS[0];

  return (
    <div className="scrub-narrative">
      {/* BEAT 01: Boutique Opening over the iridescent 3D obsidian glass orb */}
      <section
        ref={band0Ref}
        aria-labelledby="store-hero-title"
        aria-hidden="false"
        className="scrub-band scrub-band--welcome"
        data-active="true"
      >
        <div className="scrub-band-inner scrub-split">
          <div className="scrub-copy-col">
            <p className="scrub-eyebrow">
              <span aria-hidden="true" className="scrub-eyebrow-mark" />
              Propuesta de tienda · Catálogo en preparación
            </p>
            <h1 id="store-hero-title" className="scrub-title scrub-title--mega" data-choreo="rise">
              <span className="sr-only">Recursos con propósito.</span>
              <span aria-hidden="true" className="scrub-word-line">
                <span className="scrub-word" style={{ "--w-th": "0" } as CSSProperties}>
                  Recursos
                </span>
                <span className="scrub-word" style={{ "--w-th": "0.18" } as CSSProperties}>
                  con
                </span>
                <span className="scrub-word scrub-word--em" style={{ "--w-th": "0.34" } as CSSProperties}>
                  <em className="magic-gradient-text">propósito.</em>
                </span>
              </span>
            </h1>
            <p className="scrub-phrase">
              Una propuesta de ropa, biblias y papelería para la comunidad. Precios y disponibilidad se confirmarán antes de activar ventas.
            </p>
            <div className="scrub-actions">
              <a
                href="#catalogo-tienda"
                className="scrub-button scrub-button--primary magic-shimmer-btn"
              >
                <span>Explorar catálogo</span>
                <ArrowDown aria-hidden="true" className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={openCart}
                className="scrub-button scrub-button--quiet cursor-pointer"
              >
                <ShoppingBag aria-hidden="true" className="h-4 w-4" />
                <span>Carrito{totalItems > 0 ? ` (${totalItems})` : ""}</span>
              </button>
            </div>
          </div>

          <div className="scrub-visual-col">
            <div className="scrub-store-showcase">
              <a
                href="#catalogo-tienda"
                className="scrub-store-mini magic-border-beam block"
                style={{ "--mini-i": 0 } as CSSProperties}
              >
                <Image
                  src="/images/store/hoodie-esperanza.jpg"
                  alt="Hoodie Heavyweight Esperanza Viva en verde bosque."
                  width={360}
                  height={360}
                  priority
                  sizes="(max-width: 900px) 44vw, 220px"
                  className="scrub-store-mini-photo"
                />
                <div className="scrub-store-mini-meta">
                  <span>Hoodie 380 GSM</span>
                  <strong>$42</strong>
                </div>
              </a>

              <a
                href="#catalogo-tienda"
                className="scrub-store-mini scrub-store-mini--stagger magic-border-beam block"
                style={{ "--mini-i": 1 } as CSSProperties}
              >
                <Image
                  src="/images/store/biblia-estudio.jpg"
                  alt="Biblia de Estudio RVR 1960 en piel vegana espresso."
                  width={360}
                  height={360}
                  priority
                  sizes="(max-width: 900px) 44vw, 220px"
                  className="scrub-store-mini-photo"
                />
                <div className="scrub-store-mini-meta">
                  <span>Biblia RVR 1960</span>
                  <strong>$34</strong>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BEAT 02: Quality, Craft & Mission Settle */}
      <section
        ref={band1Ref}
        aria-labelledby="store-craft-title"
        aria-hidden="true"
        inert
        className="scrub-band scrub-band--closing"
        data-active="false"
      >
        <div className="scrub-band-inner scrub-split">
          <div className="scrub-copy-col">
            <p className="scrub-eyebrow">
              <span aria-hidden="true" className="scrub-eyebrow-mark" />
              Detalles comerciales por confirmar
            </p>
            <h2 id="store-craft-title" className="scrub-title" data-choreo="punch">
              <span className="sr-only">Calidad hecha para durar.</span>
              <span aria-hidden="true" className="scrub-word-line">
                <span className="scrub-word" style={{ "--w-th": "0" } as CSSProperties}>
                  Calidad
                </span>
                <span className="scrub-word" style={{ "--w-th": "0.14" } as CSSProperties}>
                  hecha
                </span>
                <span className="scrub-word" style={{ "--w-th": "0.26" } as CSSProperties}>
                  para
                </span>
                <span className="scrub-word scrub-word--em" style={{ "--w-th": "0.38" } as CSSProperties}>
                  <em className="magic-gradient-text">durar.</em>
                </span>
              </span>
            </h2>
            <p className="scrub-phrase">
              Las fichas muestran opciones de ejemplo. Tallas, materiales, existencias, cambios y retiro se confirmarán antes de recibir pedidos.
            </p>
            <div className="scrub-actions">
              <a
                href="#catalogo-tienda"
                className="scrub-button scrub-button--primary magic-shimmer-btn"
              >
                <span>Ver todos los productos</span>
                <ArrowDown aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="scrub-visual-col">
            <div className="scrub-sub-cards">
              <article className="scrub-sub-card magic-border-beam" style={{ "--card-i": 0 } as CSSProperties}>
                <span className="scrub-sub-card-icon">
                  <Sparkles aria-hidden="true" className="h-4 w-4 text-purple-300" />
                </span>
                <div>
                  <h3>Materiales por confirmar</h3>
                  <p>Las especificaciones se publicarán cuando se confirmen las fichas de cada proveedor.</p>
                </div>
              </article>

              <article className="scrub-sub-card magic-border-beam" style={{ "--card-i": 1 } as CSSProperties}>
                <span className="scrub-sub-card-icon">
                  <ShieldCheck aria-hidden="true" className="h-4 w-4 text-cyan-300" />
                </span>
                <div>
                  <h3>Tallas y cambios por definir</h3>
                  <p>La guía de medidas y las condiciones de cambio se indicarán antes de habilitar pedidos.</p>
                </div>
              </article>

              <article className="scrub-sub-card magic-border-beam" style={{ "--card-i": 2 } as CSSProperties}>
                <span className="scrub-sub-card-icon">
                  <HeartHandshake aria-hidden="true" className="h-4 w-4 text-emerald-300" />
                </span>
                <div>
                  <h3>Destino comunitario pendiente</h3>
                  <p>La página comunicará el destino de cualquier aporte cuando esa información esté aprobada.</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop right rail */}
      <nav aria-label="Capítulos de tienda" className="scrub-chapter-rail">
        {STORE_CHAPTERS.map((chapter, index) => (
          <button
            key={chapter.id}
            type="button"
            onClick={() => scrollToChapter(chapter.targetProgress)}
            className="scrub-chapter-btn"
            data-current={activeChapter === index ? "true" : "false"}
            aria-label={`Ir a ${chapter.label}`}
            aria-current={activeChapter === index ? "step" : undefined}
          >
            <span className="scrub-chapter-label">{chapter.label}</span>
            <span className="scrub-chapter-dot" aria-hidden="true" />
          </button>
        ))}
      </nav>

      {/* Mobile bottom floating OriginKit dock */}
      <nav aria-label="Progreso de tienda" className="scrub-mobile-dock">
        <span className="scrub-mobile-dock-label">
          <strong>{current.num}</strong>
          <span aria-hidden="true">/ 02 ·</span>
          {current.label}
        </span>
        <div className="scrub-mobile-dock-dots">
          {STORE_CHAPTERS.map((chapter, index) => (
            <button
              key={chapter.id}
              type="button"
              onClick={() => scrollToChapter(chapter.targetProgress)}
              className="scrub-mobile-dot"
              data-current={activeChapter === index ? "true" : "false"}
              aria-label={`Ir a ${chapter.label}`}
              aria-current={activeChapter === index ? "step" : undefined}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}
