"use client";

import { useEffect, useState, type RefObject } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

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

export function useTwoBeatScrub(
  band0Ref: RefObject<HTMLElement | null>,
  band1Ref: RefObject<HTMLElement | null>
) {
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    const hero = band0Ref.current?.closest<HTMLElement>(".scrub-hero");
    const b0 = band0Ref.current;
    const b1 = band1Ref.current;
    if (!hero || !b0 || !b1) return;

    const elements = [b0, b1];
    const caches: BandCache[] = elements.map(() => ({
      op: -1,
      k: -1,
      exit: -1,
      active: null,
    }));

    const reducedMotionMql = window.matchMedia(REDUCED_MOTION_QUERY);
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

      // Beat 0: 0.00 -> 0.52 (starts settled on load, exits 0.40 -> 0.54)
      const b0Exit = smoothstep(0.40, 0.54, p);
      const b0Op = 1 - b0Exit;
      const b0K = Math.max(loadK, clamp01(p / 0.12));
      writeBandState(elements[0], caches[0], b0Op, b0K, b0Exit);

      // Beat 1: 0.46 -> 1.00 (enters 0.46 -> 0.60, stays settled at progress = 1.0)
      const b1Enter = smoothstep(0.46, 0.60, p);
      const b1K = clamp01((p - 0.46) / 0.18);
      writeBandState(elements[1], caches[1], b1Enter, b1K, 0);

      const chapterIdx = p < 0.50 ? 0 : 1;
      if (chapterIdx !== lastChapterIdx) {
        lastChapterIdx = chapterIdx;
        setActiveChapter(chapterIdx);
      }
    };

    const runLoadRamp = (now: number) => {
      if (!loadStart) loadStart = now;
      const elapsed = now - loadStart;
      const t = clamp01(elapsed / 740);
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
      if (reducedMotionMql.matches) loadK = 1;
      applyProgress();
    };

    reducedMotionMql.addEventListener("change", onMotionChange);

    return () => {
      if (loadRafId !== null) window.cancelAnimationFrame(loadRafId);
      observer.disconnect();
      reducedMotionMql.removeEventListener("change", onMotionChange);
    };
  }, [band0Ref, band1Ref]);

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

  return { activeChapter, scrollToChapter };
}
