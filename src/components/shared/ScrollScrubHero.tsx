"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { withBasePath } from "@/lib/site-url";

/**
 * Static-hero gate matching src/styles/scroll-scrub-hero.css.
 * Scroll-scrubbing runs on desktop and mobile when motion and connection hints allow it.
 */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const LOW_BANDWIDTH_CONNECTION_TYPES = new Set(["slow-2g", "2g"]);

const DESKTOP_LERP_STRENGTH = 0.22;
const TOUCH_LERP_STRENGTH = 0.32;
const VERY_SLOW_DOWNLINK_MBPS = 0.5;

export interface ScrollScrubHeroProps {
  /** Local MP4 path under /public; the component applies the configured deployment base path. */
  videoSrc?: string;
  /** Local poster path under /public; the component applies the deployment base path. */
  posterSrc?: string;
  /** Scroll track height in vh for desktop scrub mode (default 520vh for 4 paced beats) */
  scrollHeightVh?: number;
  /** Scroll track height in vh for narrow mobile screens (default 280vh) */
  mobileScrollHeightVh?: number;
  /** Visual world theme matching the video palette */
  accentTheme?: "emerald" | "violet" | "amber" | "aurora";
  /** Text inside the bottom scroll cue pill */
  cueLabel?: string;
  /** Optional direct path to the first section after a long scroll presentation. */
  skipLink?: { href: string; label: string };
  /** Overlay narrative slot (titles, phrases, PNG visuals, CTAs) */
  children?: ReactNode;
}

type NavigatorWithNetworkInformation = Navigator & {
  connection?: {
    downlink?: number;
    effectiveType?: string;
    saveData?: boolean;
  };
};

export function ScrollScrubHero({
  videoSrc = "/videos/hero-scrub.mp4",
  posterSrc = "/videos/hero-poster.webp",
  scrollHeightVh = 520,
  mobileScrollHeightVh = 280,
  accentTheme = "emerald",
  cueLabel = "Desliza para descubrir",
  skipLink,
  children,
}: ScrollScrubHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [loadState, setLoadState] = useState<"idle" | "loading" | "ready" | "fallback">("idle");
  const resolvedVideoSrc = withBasePath(videoSrc);
  const resolvedPosterSrc = posterSrc ? withBasePath(posterSrc) : "";

  useEffect(() => {
    const heroEl = heroRef.current;
    const stageEl = stageRef.current;
    const posterEl = posterRef.current;
    const videoEl = videoRef.current;
    if (!heroEl || !stageEl || !posterEl || !videoEl) return;

    let disposed = false;
    let scrubOn = false;
    let heroInitialized = false;
    let heroOnScreen = true;
    let posterTimeoutId: number | null = null;
    let revealFallbackId: number | null = null;
    let initialSeekPending = false;
    let videoFailed = false;

    // Lerp & resting rAF state
    let targetProgress = 0;
    let shownProgress = 0;
    let rafId: number | null = null;
    let lastTick = 0;
    const isTouchViewport =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 900px)").matches;
    const lerpStrength = isTouchViewport ? TOUCH_LERP_STRENGTH : DESKTOP_LERP_STRENGTH;

    // Delta-gated DOM write caches
    let lastWrittenProgress = -1;
    let lastScrolledState: boolean | null = null;

    // Deadlock-safe seek gating state
    let seekBusy = false;
    let pendingTime: number | null = null;

    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

    function getHeroProgress(): number {
      if (!heroEl) return 0;
      const rect = heroEl.getBoundingClientRect();
      const scrollRange = heroEl.offsetHeight - window.innerHeight;
      if (scrollRange <= 0) return 0;
      return clamp01(-rect.top / scrollRange);
    }

    function applyVisualProgress(progress: number) {
      if (!heroEl || !stageEl) return;
      if (Math.abs(progress - lastWrittenProgress) >= 0.0015) {
        lastWrittenProgress = progress;
        heroEl.style.setProperty("--scrub-progress", progress.toFixed(4));
      }
      const hasScrolled = progress > 0.03;
      if (hasScrolled !== lastScrolledState) {
        lastScrolledState = hasScrolled;
        stageEl.dataset.scrolled = hasScrolled ? "true" : "false";
      }
    }

    function revealVideo() {
      if (disposed || videoFailed || !stageEl) return;
      if (revealFallbackId !== null) {
        window.clearTimeout(revealFallbackId);
        revealFallbackId = null;
      }
      stageEl.classList.remove("video-failed");
      stageEl.classList.add("video-ready");
      setLoadState("ready");
    }

    function requestSeek(timeSeconds: number) {
      if (!videoEl || !Number.isFinite(videoEl.duration) || videoEl.duration <= 0) return;
      const safeTime = Math.min(Math.max(0, timeSeconds), Math.max(0, videoEl.duration - 0.01));
      if (seekBusy) {
        pendingTime = safeTime;
        return;
      }
      seekBusy = true;
      try {
        videoEl.currentTime = safeTime;
      } catch {
        seekBusy = false;
        pendingTime = null;
        initialSeekPending = false;
        failVideo();
      }
    }

    function handleSeeked() {
      seekBusy = false;
      if (pendingTime !== null) {
        const nextTime = pendingTime;
        pendingTime = null;
        requestSeek(nextTime);
        return;
      }
      if (initialSeekPending) {
        initialSeekPending = false;
        revealVideo();
      }
    }

    function handleVideoError() {
      seekBusy = false;
      pendingTime = null;
      initialSeekPending = false;
      failVideo();
    }

    function failVideo() {
      if (disposed || !stageEl || videoFailed) return;
      videoFailed = true;
      if (revealFallbackId !== null) {
        window.clearTimeout(revealFallbackId);
        revealFallbackId = null;
      }
      stageEl.classList.remove("video-ready");
      stageEl.classList.add("video-failed");
      setLoadState("fallback");
    }

    function tick(now: number) {
      const dt = Math.min(100, now - (lastTick || now));
      lastTick = now;

      shownProgress +=
        (targetProgress - shownProgress) * (1 - Math.pow(1 - lerpStrength, dt / 16.667));

      if (Math.abs(targetProgress - shownProgress) < 0.0005) {
        shownProgress = targetProgress;
        rafId = null;
        lastTick = 0;
      } else {
        rafId = window.requestAnimationFrame(tick);
      }

      if (videoEl && Number.isFinite(videoEl.duration) && videoEl.duration > 0) {
        requestSeek(shownProgress * videoEl.duration);
      }
      applyVisualProgress(shownProgress);
    }

    function onScroll() {
      targetProgress = getHeroProgress();
      if (rafId === null && heroOnScreen) {
        rafId = window.requestAnimationFrame(tick);
      }
    }

    function handleMediaReady() {
      if (disposed || videoFailed || !videoEl || !Number.isFinite(videoEl.duration) || videoEl.duration <= 0) {
        return;
      }
      const progress = getHeroProgress();
      const targetTime = progress * videoEl.duration;
      targetProgress = progress;
      shownProgress = progress;
      applyVisualProgress(progress);

      if (Math.abs(videoEl.currentTime - targetTime) > 0.03) {
        initialSeekPending = true;
        requestSeek(targetTime);
        // Safety fallback for mobile browsers where initial seeked can lag
        revealFallbackId = window.setTimeout(() => {
          if (initialSeekPending && videoEl.readyState >= 2) {
            initialSeekPending = false;
            revealVideo();
          }
        }, 900);
        return;
      }
      revealVideo();
    }

    function loadVideoSource() {
      if (disposed || !videoEl) return;
      videoFailed = false;
      setLoadState("loading");
      videoEl.src = resolvedVideoSrc;
      videoEl.load();
    }

    function initHeroOnce() {
      if (heroInitialized || disposed || !posterEl) return;
      heroInitialized = true;

      let videoLoadStarted = false;
      const startVideoLoad = () => {
        if (videoLoadStarted || disposed || reducedMotionMql.matches) return;
        videoLoadStarted = true;
        if (posterTimeoutId !== null) {
          window.clearTimeout(posterTimeoutId);
          posterTimeoutId = null;
        }
        loadVideoSource();
      };

      if (resolvedPosterSrc) {
        posterEl.style.backgroundImage = `url('${resolvedPosterSrc}')`;
        const posterProbe = new window.Image();
        posterProbe.onload = startVideoLoad;
        posterProbe.onerror = startVideoLoad;
        posterProbe.src = resolvedPosterSrc;
        posterTimeoutId = window.setTimeout(startVideoLoad, 3500);
      } else {
        startVideoLoad();
      }
    }

    function enableScrub() {
      if (scrubOn || disposed) return;
      scrubOn = true;
      initHeroOnce();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      lastWrittenProgress = -1;
      lastScrolledState = null;
      const p = getHeroProgress();
      targetProgress = p;
      shownProgress = p;
      applyVisualProgress(p);
      onScroll();
    }

    function disableScrub() {
      if (!scrubOn) return;
      scrubOn = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
        lastTick = 0;
      }
    }

    function pinStaticPoster() {
      disableScrub();
      if (posterTimeoutId !== null) {
        window.clearTimeout(posterTimeoutId);
        posterTimeoutId = null;
      }
      if (revealFallbackId !== null) {
        window.clearTimeout(revealFallbackId);
        revealFallbackId = null;
      }
      if (videoEl && videoEl.hasAttribute("src")) {
        videoEl.pause();
        videoEl.removeAttribute("src");
        videoEl.load();
      }
      heroInitialized = false;
      videoFailed = false;
      initialSeekPending = false;
      seekBusy = false;
      pendingTime = null;
      stageEl?.classList.remove("video-ready", "video-failed");
      if (posterEl && resolvedPosterSrc) {
        posterEl.style.backgroundImage = `url('${resolvedPosterSrc}')`;
      }
      if (heroEl) {
        heroEl.style.setProperty("--scrub-progress", "0");
      }
      setLoadState("fallback");
    }

    const reducedMotionMql = window.matchMedia(REDUCED_MOTION_QUERY);
    const applyHeroMode = () => {
      const connection = (navigator as NavigatorWithNetworkInformation).connection;
      const hasVerySlowDownlink =
        typeof connection?.downlink === "number" &&
        Number.isFinite(connection.downlink) &&
        connection.downlink > 0 &&
        connection.downlink <= VERY_SLOW_DOWNLINK_MBPS;
      const conserveData =
        connection?.saveData === true ||
        LOW_BANDWIDTH_CONNECTION_TYPES.has(connection?.effectiveType ?? "") ||
        hasVerySlowDownlink;

      if (reducedMotionMql.matches || conserveData) {
        pinStaticPoster();
      } else {
        enableScrub();
      }
    };

    // Pause rAF loop & ambient motes whenever hero is off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        heroOnScreen = entry.isIntersecting;
        stageEl.dataset.inview = heroOnScreen ? "true" : "false";
        if (!heroOnScreen && rafId !== null) {
          window.cancelAnimationFrame(rafId);
          rafId = null;
          lastTick = 0;
        } else if (heroOnScreen && scrubOn) {
          onScroll();
        }
      },
      { threshold: 0 }
    );
    observer.observe(heroEl);

    // Pause ambient animations when tab is hidden
    const onVisibilityChange = () => {
      stageEl.dataset.paused = document.hidden ? "true" : "false";
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    videoEl.addEventListener("seeked", handleSeeked);
    videoEl.addEventListener("error", handleVideoError);
    videoEl.addEventListener("loadeddata", handleMediaReady);
    videoEl.addEventListener("canplay", handleMediaReady);
    reducedMotionMql.addEventListener("change", applyHeroMode);
    applyHeroMode();

    return () => {
      disposed = true;
      disableScrub();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (posterTimeoutId !== null) window.clearTimeout(posterTimeoutId);
      if (revealFallbackId !== null) window.clearTimeout(revealFallbackId);
      videoEl.removeEventListener("seeked", handleSeeked);
      videoEl.removeEventListener("error", handleVideoError);
      videoEl.removeEventListener("loadeddata", handleMediaReady);
      videoEl.removeEventListener("canplay", handleMediaReady);
      reducedMotionMql.removeEventListener("change", applyHeroMode);
      videoEl.pause();
      videoEl.removeAttribute("src");
      videoEl.load();
    };
  }, [resolvedVideoSrc, resolvedPosterSrc]);

  return (
    <section
      ref={heroRef}
      aria-label="Presentación visual interactiva"
      className="scrub-hero"
      data-scrub-theme={accentTheme}
      style={
        {
          "--scrub-height": `${scrollHeightVh}vh`,
          "--scrub-height-mobile": `${mobileScrollHeightVh}vh`,
        } as CSSProperties
      }
    >
      <div
        ref={stageRef}
        className="scrub-stage"
        data-scrolled="false"
        data-inview="true"
        data-paused="false"
      >
        {/* Layer 1: Poster fallback (paints first, remains active on reduced-motion/fallback) */}
        <div ref={posterRef} className="scrub-poster" aria-hidden="true" />

        {/* Layer 2: Scroll-scrubbed decorative video (desktop + mobile) */}
        <video
          ref={videoRef}
          className="scrub-video"
          preload="metadata"
          muted
          playsInline
          aria-hidden="true"
          tabIndex={-1}
        />

        {/* Layer 3: Global directional & radial scrim for contrast over luminous green ribbons */}
        <div className="scrub-scrim" aria-hidden="true" />

        {/* Layer 3b: Whisper-level Magic UI ambient light motes */}
        <div className="scrub-motes" aria-hidden="true">
          <span className="scrub-mote scrub-mote--1" />
          <span className="scrub-mote scrub-mote--2" />
          <span className="scrub-mote scrub-mote--3" />
          <span className="scrub-mote scrub-mote--4" />
          <span className="scrub-mote scrub-mote--5" />
          <span className="scrub-mote scrub-mote--6" />
        </div>

        {/* Layer 4: Narrative overlay slot (titles, short phrases, PNG showcases, CTAs) */}
        <div className="scrub-overlay-slot" data-scrub-overlay="true">
          {children}
        </div>

        {skipLink ? (
          <a className="scrub-skip-link" href={skipLink.href}>
            {skipLink.label}
          </a>
        ) : null}

        {/* Layer 5: Minimal loading ring while streaming -> subtle scroll cue */}
        <div className="scrub-indicator" aria-hidden="true">
          {loadState === "loading" ? (
            <svg className="scrub-ring" viewBox="0 0 48 48">
              <circle
                className="scrub-ring-track"
                cx="24"
                cy="24"
                r="20"
                fill="none"
                strokeWidth="2.5"
              />
              <circle
                className="scrub-ring-fill"
                cx="24"
                cy="24"
                r="20"
                fill="none"
                strokeWidth="2.5"
                strokeDasharray="32 94"
                strokeDashoffset="0"
              />
            </svg>
          ) : (
            <span className="scrub-cue">
              <span>{cueLabel}</span>
              <ChevronDown className="scrub-cue-arrow" />
            </span>
          )}
        </div>

        {/* Whisper-level glowing progress rail */}
        <div className="scrub-progress-bar" aria-hidden="true">
          <div className="scrub-progress-fill" />
        </div>
      </div>
    </section>
  );
}
