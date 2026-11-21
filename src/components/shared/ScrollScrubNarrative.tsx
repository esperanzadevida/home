"use client";

import { useEffect, useRef, useState } from "react";
import Image from "@/components/shared/SiteImage";
import Link from "next/link";
import { ArrowRight, Clock3, MapPin } from "lucide-react";

type Meeting = {
  readonly days: string;
  readonly time: string;
  readonly title: string;
};

type ScrollScrubNarrativeProps = {
  name: string;
  city: string;
  address: string;
  schedule: readonly Meeting[];
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const CHAPTERS = [
  { id: "bienvenida", num: "01", label: "Bienvenida", targetProgress: 0.03 },
  { id: "comunidad", num: "02", label: "Comunidad", targetProgress: 0.37 },
  { id: "servicio", num: "03", label: "Servicio", targetProgress: 0.62 },
  { id: "visita", num: "04", label: "Tu visita", targetProgress: 0.93 },
] as const;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(start: number, end: number, value: number) {
  const t = clamp01((value - start) / (end - start));
  return t * t * (3 - 2 * t);
}

type BandCache = {
  op: number;
  k: number;
  exit: number;
  active: boolean | null;
};

function writeBandState(
  element: HTMLElement,
  cache: BandCache,
  opacity: number,
  k: number,
  exit: number
) {
  const isActive = opacity >= 0.42;

  if (Math.abs(opacity - cache.op) >= 0.004) {
    cache.op = opacity;
    element.style.setProperty("--band-op", opacity.toFixed(3));
  }
  if (Math.abs(k - cache.k) >= 0.004) {
    cache.k = k;
    element.style.setProperty("--k", k.toFixed(3));
  }
  if (Math.abs(exit - cache.exit) >= 0.004) {
    cache.exit = exit;
    element.style.setProperty("--band-exit", exit.toFixed(3));
  }
  if (cache.active !== isActive) {
    cache.active = isActive;
    element.toggleAttribute("inert", !isActive);
    element.setAttribute("aria-hidden", isActive ? "false" : "true");
    element.dataset.active = isActive ? "true" : "false";
  }
}

function SplitHeading({
  id,
  as: Tag,
  words,
  emphasisIndex,
  choreo = "rise",
  className,
}: {
  id: string;
  as: "h1" | "h2";
  words: readonly string[];
  emphasisIndex: number;
  choreo?: "rise" | "punch" | "weave";
  className?: string;
}) {
  const fullText = words.join(" ");
  const total = Math.max(1, words.length - 1);

  return (
    <Tag id={id} className={className} data-choreo={choreo}>
      <span className="sr-only">{fullText}</span>
      <span aria-hidden="true" className="scrub-word-line">
        {words.map((word, idx) => {
          const threshold = ((idx / total) * 0.4).toFixed(3);
          const isEm = idx === emphasisIndex;
          const weaveDir = idx % 2 === 0 ? "-1" : "1";
          return (
            <span
              key={`${word}-${idx}`}
              className={isEm ? "scrub-word scrub-word--em" : "scrub-word"}
              style={
                {
                  "--w-th": threshold,
                  "--w-dir": weaveDir,
                } as React.CSSProperties
              }
            >
              {isEm ? <em className="magic-gradient-text">{word}</em> : word}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}

/**
 * Four-beat cinematic church introduction synced to ScrollScrubHero's `--scrub-progress`
 * on BOTH desktop and mobile viewports, styled with Magic UI & OriginKit animation patterns.
 */
export function ScrollScrubNarrative({
  name,
  city,
  address,
  schedule,
}: ScrollScrubNarrativeProps) {
  const band0Ref = useRef<HTMLElement>(null);
  const band1Ref = useRef<HTMLElement>(null);
  const band2Ref = useRef<HTMLElement>(null);
  const band3Ref = useRef<HTMLElement>(null);

  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    const hero = band0Ref.current?.closest<HTMLElement>(".scrub-hero");
    const refs = [band0Ref.current, band1Ref.current, band2Ref.current, band3Ref.current];
    if (!hero || refs.some((band) => !band)) return;

    const elements = refs as HTMLElement[];
    const caches: BandCache[] = elements.map(() => ({
      op: -1,
      k: -1,
      exit: -1,
      active: null,
    }));

    const reducedMotionMql = window.matchMedia(REDUCED_MOTION_QUERY);

    // One-time opening load ramp so Band 0 settles smoothly on first paint
    let loadK = 0;
    let loadRafId: number | null = null;
    let loadStart = 0;
    let lastChapterIdx = -1;

    const applyProgress = () => {
      if (reducedMotionMql.matches) {
        elements.forEach((el, idx) => writeBandState(el, caches[idx], 1, 1, 0));
        if (lastChapterIdx !== 0) {
          lastChapterIdx = 0;
          setActiveChapter(0);
        }
        return;
      }

      const p = Number.parseFloat(hero.style.getPropertyValue("--scrub-progress")) || 0;

      // Band 0: 0.00 -> 0.26 (starts settled with loadK, fades out 0.20 -> 0.27)
      const b0Exit = smoothstep(0.20, 0.27, p);
      const b0Op = 1 - b0Exit;
      const b0K = Math.max(loadK, clamp01(p / 0.08));
      writeBandState(elements[0], caches[0], b0Op, b0K, b0Exit);

      // Band 1: 0.24 -> 0.51
      const b1Enter = smoothstep(0.24, 0.30, p);
      const b1Exit = smoothstep(0.45, 0.51, p);
      const b1Op = b1Enter * (1 - b1Exit);
      const b1K = clamp01((p - 0.24) / 0.09);
      writeBandState(elements[1], caches[1], b1Op, b1K, b1Exit);

      // Band 2: 0.49 -> 0.76
      const b2Enter = smoothstep(0.49, 0.55, p);
      const b2Exit = smoothstep(0.70, 0.76, p);
      const b2Op = b2Enter * (1 - b2Exit);
      const b2K = clamp01((p - 0.49) / 0.09);
      writeBandState(elements[2], caches[2], b2Op, b2K, b2Exit);

      // Band 3: 0.74 -> 1.00 (stays settled at progress = 1.0)
      const b3Enter = smoothstep(0.74, 0.81, p);
      const b3K = clamp01((p - 0.74) / 0.10);
      writeBandState(elements[3], caches[3], b3Enter, b3K, 0);

      const chapterIdx = p < 0.25 ? 0 : p < 0.50 ? 1 : p < 0.75 ? 2 : 3;
      if (chapterIdx !== lastChapterIdx) {
        lastChapterIdx = chapterIdx;
        setActiveChapter(chapterIdx);
      }
    };

    const runLoadRamp = (now: number) => {
      if (!loadStart) loadStart = now;
      const elapsed = now - loadStart;
      const t = clamp01(elapsed / 780);
      loadK = 1 - Math.pow(1 - t, 3);
      applyProgress();
      if (t < 1) {
        loadRafId = window.requestAnimationFrame(runLoadRamp);
      } else {
        loadRafId = null;
      }
    };

    if (reducedMotionMql.matches) {
      loadK = 1;
      applyProgress();
    } else {
      loadRafId = window.requestAnimationFrame(runLoadRamp);
    }

    const observer = new MutationObserver(applyProgress);
    observer.observe(hero, { attributes: true, attributeFilter: ["style"] });

    const onMotionChange = () => {
      caches.forEach((c) => {
        c.op = -1;
        c.k = -1;
        c.exit = -1;
        c.active = null;
      });
      if (reducedMotionMql.matches) {
        loadK = 1;
      }
      applyProgress();
    };

    reducedMotionMql.addEventListener("change", onMotionChange);

    return () => {
      if (loadRafId !== null) window.cancelAnimationFrame(loadRafId);
      observer.disconnect();
      reducedMotionMql.removeEventListener("change", onMotionChange);
    };
  }, []);

  function scrollToChapter(targetProgress: number) {
    const hero = band0Ref.current?.closest<HTMLElement>(".scrub-hero");
    if (!hero) return;
    const heroTop = hero.getBoundingClientRect().top + window.scrollY;
    const scrollRange = Math.max(0, hero.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: heroTop + scrollRange * targetProgress,
      behavior: "smooth",
    });
  }

  const cityName = city.split(",")[0];
  const currentChapter = CHAPTERS[activeChapter] ?? CHAPTERS[0];

  return (
    <div className="scrub-narrative">
      {/* =====================================================================
          BEAT 01: APERTURA — Identidad + Llama 3D PNG con anillos orbitales
          ===================================================================== */}
      <section
        ref={band0Ref}
        aria-labelledby="scrub-beat-welcome"
        aria-hidden="false"
        className="scrub-band scrub-band--welcome"
        data-scrub-band="welcome"
        data-active="true"
      >
        <div className="scrub-band-inner scrub-split">
          <div className="scrub-copy-col">
            <p className="scrub-eyebrow">
              <span aria-hidden="true" className="scrub-eyebrow-mark" />
              {name} <span aria-hidden="true">·</span> {cityName}
            </p>
            <SplitHeading
              id="scrub-beat-welcome"
              as="h1"
              words={["Esperanza", "viva."]}
              emphasisIndex={1}
              choreo="rise"
              className="scrub-title scrub-title--mega"
            />
            <p className="scrub-phrase">
              Una casa abierta en el corazón de {cityName}.
            </p>
            <div className="scrub-actions">
              <Link className="scrub-button scrub-button--primary magic-shimmer-btn" href="/servicios">
                <span>Planifica tu visita</span>
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link className="scrub-button scrub-button--quiet" href="/nosotros">
                Nuestra historia
              </Link>
            </div>
          </div>

          <div className="scrub-visual-col scrub-visual-col--flame" aria-hidden="true">
            <div className="scrub-flame-stage">
              <span className="scrub-flame-aura" />
              <span className="scrub-orbit-ring scrub-orbit-ring--outer" />
              <span className="scrub-orbit-ring scrub-orbit-ring--inner" />
              <Image
                src="/images/brand/esperanza-de-vida-flame.png"
                alt=""
                width={520}
                height={520}
                priority
                sizes="(max-width: 720px) 44vw, 34vw"
                className="scrub-flame-png"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          BEAT 02: COMUNIDAD Y ADORACIÓN — Weave + Border Beam PNG Collage
          ===================================================================== */}
      <section
        ref={band1Ref}
        aria-labelledby="scrub-beat-community"
        aria-hidden="true"
        inert
        className="scrub-band scrub-band--community"
        data-scrub-band="community"
        data-active="false"
      >
        <div className="scrub-band-inner scrub-split">
          <div className="scrub-copy-col">
            <p className="scrub-eyebrow">
              <span aria-hidden="true" className="scrub-eyebrow-mark" />
              Encuentros semanales
            </p>
            <SplitHeading
              id="scrub-beat-community"
              as="h2"
              words={["Fe", "que", "se", "comparte."]}
              emphasisIndex={3}
              choreo="weave"
              className="scrub-title"
            />
            <p className="scrub-phrase">
              Alabanza viva, enseñanza clara y lugar para cada generación.
            </p>

            <ul className="scrub-mini-schedule" aria-label="Horarios de reunión">
              {schedule.map((item, idx) => (
                <li
                  key={item.days}
                  className="scrub-chip"
                  style={{ "--chip-i": idx } as React.CSSProperties}
                >
                  <Clock3 aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#b9f675]" />
                  <span>
                    <strong>{item.days}</strong> {item.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="scrub-visual-col scrub-visual-col--weave">
            <figure className="scrub-png-frame scrub-png-frame--primary magic-border-beam">
              <Image
                src="/images/esperanza-de-vida/culto-dominical.webp"
                alt="Congregación reunida en el culto dominical en Ambato."
                width={720}
                height={405}
                sizes="(max-width: 720px) 88vw, (max-width: 1200px) 48vw, 480px"
                className="scrub-png-photo"
              />
              <figcaption className="scrub-png-tag">Celebración dominical</figcaption>
            </figure>

            <figure className="scrub-png-frame scrub-png-frame--floating magic-border-beam">
              <Image
                src="/images/esperanza-de-vida/exploradores.webp"
                alt="Niños aprendiendo y compartiendo en el espacio de Exploradores."
                width={420}
                height={315}
                sizes="(max-width: 720px) 46vw, 260px"
                className="scrub-png-photo"
              />
              <figcaption className="scrub-png-tag">Niños y familias</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* =====================================================================
          BEAT 03: GENERACIONES Y SERVICIO — Word-Punch + 3D Depth Collage
          ===================================================================== */}
      <section
        ref={band2Ref}
        aria-labelledby="scrub-beat-service"
        aria-hidden="true"
        inert
        className="scrub-band scrub-band--service"
        data-scrub-band="service"
        data-active="false"
      >
        <div className="scrub-band-inner scrub-split scrub-split--reversed">
          <div className="scrub-visual-col scrub-visual-col--depth">
            <figure className="scrub-png-frame scrub-png-frame--primary magic-border-beam">
              <Image
                src="/images/esperanza-de-vida/embajadores-jovenes.webp"
                alt="Jóvenes conversando con guitarras y biblias en la reunión de Embajadores."
                width={720}
                height={540}
                sizes="(max-width: 720px) 88vw, (max-width: 1200px) 48vw, 480px"
                className="scrub-png-photo"
              />
              <figcaption className="scrub-png-tag">Embajadores · Jóvenes</figcaption>
            </figure>

            <figure className="scrub-png-frame scrub-png-frame--floating-alt magic-border-beam">
              <Image
                src="/images/esperanza-de-vida/servicio-comunitario.webp"
                alt="Voluntarios de la iglesia compartiendo alimentos con familias de Ambato."
                width={420}
                height={315}
                sizes="(max-width: 720px) 46vw, 260px"
                className="scrub-png-photo"
              />
              <figcaption className="scrub-png-tag">Servicio en la ciudad</figcaption>
            </figure>
          </div>

          <div className="scrub-copy-col">
            <p className="scrub-eyebrow">
              <span aria-hidden="true" className="scrub-eyebrow-mark" />
              Comunidad activa
            </p>
            <SplitHeading
              id="scrub-beat-service"
              as="h2"
              words={["Jóvenes.", "Ciudad.", "Propósito."]}
              emphasisIndex={2}
              choreo="punch"
              className="scrub-title"
            />
            <p className="scrub-phrase">
              Amistad real entre semana y servicio concreto en cada barrio.
            </p>
            <div className="scrub-actions">
              <Link className="scrub-button scrub-button--quiet" href="/ministerios">
                Explorar ministerios
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          BEAT 04: CIERRE ASENTADO — Puerta abierta + Retrato pastoral Border Beam
          ===================================================================== */}
      <section
        ref={band3Ref}
        aria-labelledby="scrub-beat-closing"
        aria-hidden="true"
        inert
        className="scrub-band scrub-band--closing"
        data-scrub-band="closing"
        data-active="false"
      >
        <div className="scrub-band-inner scrub-split">
          <div className="scrub-copy-col">
            <p className="scrub-eyebrow">
              <span aria-hidden="true" className="scrub-eyebrow-mark" />
              Sector Ficoa · {cityName}
            </p>
            <SplitHeading
              id="scrub-beat-closing"
              as="h2"
              words={["La", "puerta", "está", "abierta."]}
              emphasisIndex={3}
              choreo="rise"
              className="scrub-title"
            />
            <p className="scrub-phrase">
              Ven tal como eres. Te esperamos este domingo.
            </p>

            <p className="scrub-address-chip">
              <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-[#b9f675]" />
              <span>{address}</span>
            </p>

            <div className="scrub-actions">
              <Link className="scrub-button scrub-button--primary magic-shimmer-btn" href="/servicios">
                <span>Planifica tu visita</span>
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link className="scrub-button scrub-button--quiet" href="/contacto">
                Dirección y contacto
              </Link>
            </div>
          </div>

          <div className="scrub-visual-col scrub-visual-col--closing">
            <figure className="scrub-png-frame scrub-png-frame--portrait magic-border-beam">
              <Image
                src="/images/esperanza-de-vida/equipo-pastoral.webp"
                alt="Equipo pastoral de Iglesia Esperanza de Vida dando la bienvenida."
                width={640}
                height={480}
                sizes="(max-width: 720px) 88vw, (max-width: 1200px) 48vw, 464px"
                className="scrub-png-photo"
              />
              <figcaption className="scrub-png-tag">
                <Image
                  src="/images/brand/esperanza-de-vida-flame.png"
                  alt=""
                  width={18}
                  height={18}
                  sizes="18px"
                  aria-hidden="true"
                  className="h-4 w-4 object-contain"
                />
                <span>Equipo de bienvenida · {name}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Desktop right-side chapter rail */}
      <nav aria-label="Capítulos de presentación" className="scrub-chapter-rail">
        {CHAPTERS.map((chapter, index) => (
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

      {/* Mobile bottom floating OriginKit chapter dock */}
      <nav aria-label="Progreso de capítulos" className="scrub-mobile-dock">
        <span className="scrub-mobile-dock-label">
          <strong>{currentChapter.num}</strong>
          <span aria-hidden="true">/ 04 ·</span>
          {currentChapter.label}
        </span>
        <div className="scrub-mobile-dock-dots">
          {CHAPTERS.map((chapter, index) => (
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
