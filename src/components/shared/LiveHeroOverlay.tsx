"use client";

import { useRef, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, BookOpen, Heart, Radio } from "lucide-react";
import { useTwoBeatScrub } from "@/hooks/useTwoBeatScrub";

const LIVE_CHAPTERS = [
  { id: "transmision", num: "01", label: "En vivo", targetProgress: 0.04 },
  { id: "comunidad-online", num: "02", label: "En casa", targetProgress: 0.88 },
] as const;

export function LiveHeroOverlay() {
  const band0Ref = useRef<HTMLElement>(null);
  const band1Ref = useRef<HTMLElement>(null);
  const { activeChapter, scrollToChapter } = useTwoBeatScrub(band0Ref, band1Ref);

  const current = LIVE_CHAPTERS[activeChapter] ?? LIVE_CHAPTERS[0];

  return (
    <div className="scrub-narrative">
      {/* BEAT 01: Live Worship Aurora */}
      <section
        ref={band0Ref}
        aria-labelledby="live-hero-title"
        aria-hidden="false"
        className="scrub-band scrub-band--welcome"
        data-active="true"
      >
        <div className="scrub-band-inner scrub-split">
          <div className="scrub-copy-col">
            <p className="scrub-eyebrow">
              <span aria-hidden="true" className="scrub-eyebrow-mark" />
              Iglesia en línea · Domingos 09:00 y 11:30
            </p>
            <h1 id="live-hero-title" className="scrub-title scrub-title--mega" data-choreo="rise">
              <span className="sr-only">Adoración sin fronteras.</span>
              <span aria-hidden="true" className="scrub-word-line">
                <span className="scrub-word" style={{ "--w-th": "0" } as CSSProperties}>
                  Adoración
                </span>
                <span className="scrub-word" style={{ "--w-th": "0.18" } as CSSProperties}>
                  sin
                </span>
                <span className="scrub-word scrub-word--em" style={{ "--w-th": "0.34" } as CSSProperties}>
                  <em className="magic-gradient-text">fronteras.</em>
                </span>
              </span>
            </h1>
            <p className="scrub-phrase">
              Si estás de viaje, en casa o nos conoces por primera vez, acompaña nuestras reuniones y mensajes desde cualquier lugar.
            </p>

            <div className="scrub-actions">
              <a
                href="#contenido-en-vivo"
                className="scrub-button scrub-button--primary magic-shimmer-btn"
              >
                <Radio aria-hidden="true" className="h-4 w-4" />
                <span>Ver agenda de emisión</span>
                <ArrowDown aria-hidden="true" className="h-4 w-4" />
              </a>
              <Link className="scrub-button scrub-button--quiet" href="/sermones">
                Archivo de mensajes
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="scrub-visual-col" aria-hidden="true" />
        </div>
      </section>

      {/* BEAT 02: Participate from home */}
      <section
        ref={band1Ref}
        aria-labelledby="live-home-title"
        aria-hidden="true"
        inert
        className="scrub-band scrub-band--closing"
        data-active="false"
      >
        <div className="scrub-band-inner scrub-split">
          <div className="scrub-copy-col">
            <p className="scrub-eyebrow">
              <span aria-hidden="true" className="scrub-eyebrow-mark" />
              Comunidad cercana
            </p>
            <h2 id="live-home-title" className="scrub-title" data-choreo="punch">
              <span className="sr-only">Unidos en cada hogar.</span>
              <span aria-hidden="true" className="scrub-word-line">
                <span className="scrub-word" style={{ "--w-th": "0" } as CSSProperties}>
                  Unidos
                </span>
                <span className="scrub-word" style={{ "--w-th": "0.14" } as CSSProperties}>
                  en
                </span>
                <span className="scrub-word" style={{ "--w-th": "0.26" } as CSSProperties}>
                  cada
                </span>
                <span className="scrub-word scrub-word--em" style={{ "--w-th": "0.38" } as CSSProperties}>
                  <em className="magic-gradient-text">hogar.</em>
                </span>
              </span>
            </h2>
            <p className="scrub-phrase">
              Oramos contigo durante la semana y compartimos guías de lectura para continuar en familia.
            </p>
            <div className="scrub-actions">
              <a
                href="#contenido-en-vivo"
                className="scrub-button scrub-button--primary magic-shimmer-btn"
              >
                <span>Ver horarios y recursos</span>
                <ArrowDown aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="scrub-visual-col">
            <div className="scrub-sub-cards">
              <Link href="/oracion" className="scrub-sub-card magic-border-beam block no-underline" style={{ "--card-i": 0 } as CSSProperties}>
                <span className="scrub-sub-card-icon">
                  <Heart aria-hidden="true" className="h-4 w-4 text-rose-300" />
                </span>
                <div>
                  <h3>Acompañamiento en oración</h3>
                  <p>Comparte un motivo con nuestro equipo pastoral y recibe apoyo cercano.</p>
                </div>
              </Link>

              <Link href="/sermones" className="scrub-sub-card magic-border-beam block no-underline" style={{ "--card-i": 1 } as CSSProperties}>
                <span className="scrub-sub-card-icon">
                  <BookOpen aria-hidden="true" className="h-4 w-4 text-amber-200" />
                </span>
                <div>
                  <h3>Mensajes recientes</h3>
                  <p>Explora las series anteriores con pasajes bíblicos y notas para reflexionar.</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="Capítulos en vivo" className="scrub-chapter-rail">
        {LIVE_CHAPTERS.map((chapter, index) => (
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

      <nav aria-label="Progreso en vivo" className="scrub-mobile-dock">
        <span className="scrub-mobile-dock-label">
          <strong>{current.num}</strong>
          <span aria-hidden="true">/ 02 ·</span>
          {current.label}
        </span>
        <div className="scrub-mobile-dock-dots">
          {LIVE_CHAPTERS.map((chapter, index) => (
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
