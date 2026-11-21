"use client";

import { useRef, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, Car, Clock3, Coffee, Users } from "lucide-react";
import { churchProfile } from "@/config/church-profile";
import { useTwoBeatScrub } from "@/hooks/useTwoBeatScrub";

const SERVICE_CHAPTERS = [
  { id: "horarios", num: "01", label: "Horarios", targetProgress: 0.04 },
  { id: "bienvenida", num: "02", label: "Primera visita", targetProgress: 0.88 },
] as const;

export function ServicesHeroOverlay() {
  const band0Ref = useRef<HTMLElement>(null);
  const band1Ref = useRef<HTMLElement>(null);
  const { activeChapter, scrollToChapter } = useTwoBeatScrub(band0Ref, band1Ref);

  const current = SERVICE_CHAPTERS[activeChapter] ?? SERVICE_CHAPTERS[0];

  return (
    <div className="scrub-narrative">
      {/* BEAT 01: Services Welcome over electric blue & amber silk wave */}
      <section
        ref={band0Ref}
        aria-labelledby="services-hero-title"
        aria-hidden="false"
        className="scrub-band scrub-band--welcome"
        data-active="true"
      >
        <div className="scrub-band-inner scrub-split">
          <div className="scrub-copy-col">
            <p className="scrub-eyebrow">
              <span aria-hidden="true" className="scrub-eyebrow-mark" />
              Reuniones semanales · Ambato
            </p>
            <h1 id="services-hero-title" className="scrub-title scrub-title--mega" data-choreo="rise">
              <span className="sr-only">Domingos que renuevan.</span>
              <span aria-hidden="true" className="scrub-word-line">
                <span className="scrub-word" style={{ "--w-th": "0" } as CSSProperties}>
                  Domingos
                </span>
                <span className="scrub-word" style={{ "--w-th": "0.18" } as CSSProperties}>
                  que
                </span>
                <span className="scrub-word scrub-word--em" style={{ "--w-th": "0.34" } as CSSProperties}>
                  <em className="magic-gradient-text">renuevan.</em>
                </span>
              </span>
            </h1>
            <p className="scrub-phrase">
              Ven tal como eres. Adoración viva, palabra clara y un ambiente cálido para toda tu familia.
            </p>

            <ul className="scrub-mini-schedule" aria-label="Horarios principales">
              {churchProfile.schedule.map((item, idx) => (
                <li
                  key={item.days}
                  className="scrub-chip"
                  style={{ "--chip-i": idx } as CSSProperties}
                >
                  <Clock3 aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-amber-300" />
                  <span>
                    <strong className="!text-amber-200">{item.days}</strong> {item.time}
                  </span>
                </li>
              ))}
            </ul>

            <div className="scrub-actions">
              <a
                href="#contenido-servicios"
                className="scrub-button scrub-button--primary magic-shimmer-btn"
              >
                <span>Ver guía completa</span>
                <ArrowDown aria-hidden="true" className="h-4 w-4" />
              </a>
              <Link className="scrub-button scrub-button--quiet" href="/contacto">
                Cómo llegar
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="scrub-visual-col" aria-hidden="true" />
        </div>
      </section>

      {/* BEAT 02: First-time visitor guide */}
      <section
        ref={band1Ref}
        aria-labelledby="services-first-title"
        aria-hidden="true"
        inert
        className="scrub-band scrub-band--closing"
        data-active="false"
      >
        <div className="scrub-band-inner scrub-split">
          <div className="scrub-copy-col">
            <p className="scrub-eyebrow">
              <span aria-hidden="true" className="scrub-eyebrow-mark" />
              Tu primera visita
            </p>
            <h2 id="services-first-title" className="scrub-title" data-choreo="weave">
              <span className="sr-only">Llegar sin prisa.</span>
              <span aria-hidden="true" className="scrub-word-line">
                <span className="scrub-word" style={{ "--w-th": "0", "--w-dir": "-1" } as CSSProperties}>
                  Llegar
                </span>
                <span className="scrub-word" style={{ "--w-th": "0.18", "--w-dir": "1" } as CSSProperties}>
                  sin
                </span>
                <span className="scrub-word scrub-word--em" style={{ "--w-th": "0.34", "--w-dir": "-1" } as CSSProperties}>
                  <em className="magic-gradient-text">prisa.</em>
                </span>
              </span>
            </h2>
            <p className="scrub-phrase">
              Desde que cruzas la puerta en Ficoa, nuestro equipo te acompaña para que te sientas en casa.
            </p>
            <div className="scrub-actions">
              <a
                href="#contenido-servicios"
                className="scrub-button scrub-button--primary magic-shimmer-btn"
              >
                <span>Preguntas frecuentes</span>
                <ArrowDown aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="scrub-visual-col">
            <div className="scrub-sub-cards">
              <article className="scrub-sub-card magic-border-beam" style={{ "--card-i": 0 } as CSSProperties}>
                <span className="scrub-sub-card-icon">
                  <Car aria-hidden="true" className="h-4 w-4 text-sky-300" />
                </span>
                <div>
                  <h3>Acceso y estacionamiento</h3>
                  <p>Llegada cómoda en Av. Miraflores y Los Arrayanes con orientación desde 15 minutos antes.</p>
                </div>
              </article>

              <article className="scrub-sub-card magic-border-beam" style={{ "--card-i": 1 } as CSSProperties}>
                <span className="scrub-sub-card-icon">
                  <Users aria-hidden="true" className="h-4 w-4 text-amber-300" />
                </span>
                <div>
                  <h3>Exploradores para niños</h3>
                  <p>Salas seguras por edades durante ambos servicios dominicales con maestras capacitadas.</p>
                </div>
              </article>

              <article className="scrub-sub-card magic-border-beam" style={{ "--card-i": 2 } as CSSProperties}>
                <span className="scrub-sub-card-icon">
                  <Coffee aria-hidden="true" className="h-4 w-4 text-orange-300" />
                </span>
                <div>
                  <h3>Café y bienvenida</h3>
                  <p>Al terminar nos quedamos conversando un momento para conocerte sin compromiso.</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="Capítulos de servicios" className="scrub-chapter-rail">
        {SERVICE_CHAPTERS.map((chapter, index) => (
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

      <nav aria-label="Progreso de servicios" className="scrub-mobile-dock">
        <span className="scrub-mobile-dock-label">
          <strong>{current.num}</strong>
          <span aria-hidden="true">/ 02 ·</span>
          {current.label}
        </span>
        <div className="scrub-mobile-dock-dots">
          {SERVICE_CHAPTERS.map((chapter, index) => (
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
