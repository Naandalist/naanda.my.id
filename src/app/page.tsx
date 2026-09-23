"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  GitHubIcon,
  LinkedInIcon,
} from "@/components/sites/un.ms-9e73fc9e/pile-7b2b2b3f/icons";

const SITE_BASE = "/sites/un.ms-9e73fc9e/pile-7b2b2b3f";
const LINKEDIN_URL = "https://www.linkedin.com/";
const GITHUB_URL = "https://github.com/";
const LOOP_FADE_SECONDS = 0.6;
const SKELETON_CAP_MS = 2500;
const VIDEO_FALLBACK_MS = 60_000;

function removeBrochureClass() {
  document.documentElement.classList.remove("is-pile-brochure");
  document.body.classList.remove("is-pile-brochure");
}

// iOS leaves a clip stuck on its last frame when currentTime is set to 0
// from the `ended` state. Seek off that frame, then play again.
function replayFromStart(video: HTMLVideoElement) {
  let settled = false;
  const play = () => {
    if (settled) return;
    settled = true;
    video.removeEventListener("seeked", play);
    void video.play().catch(() => {});
  };
  if (video.currentTime <= 0.05) {
    play();
    return () => {};
  }
  video.addEventListener("seeked", play);
  try {
    video.currentTime = 0.01;
  } catch {
    play();
  }
  const timer = window.setTimeout(play, 400);
  return () => {
    settled = true;
    video.removeEventListener("seeked", play);
    window.clearTimeout(timer);
  };
}

function atEnd(video: HTMLVideoElement) {
  return (
    Number.isFinite(video.duration) &&
    video.duration > 0 &&
    video.duration - video.currentTime <= 0.08
  );
}

// Phones get one looping element. A second copy of the same file often never
// buffers there (WebKit skips opacity:0 media and may share one decoder), so
// the crossfade never starts and the visible clip freezes on the last frame.
function prefersSingleVideoLoop() {
  const ios =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  // iOS shares one media resource across two elements with the same URL, and
  // it will not decode a clip painted at opacity 0. Either one freezes the
  // crossfade. Android phones have the same one-decoder limit in practice.
  return ios || window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

function startSingleLoop(video: HTMLVideoElement) {
  let cancelled = false;
  let replaying = false;
  let cancelReplay = () => {};

  const replay = () => {
    if (cancelled || replaying) return;
    replaying = true;
    cancelReplay = replayFromStart(video);
    window.setTimeout(() => {
      replaying = false;
    }, 500);
  };

  const onEnded = () => replay();
  const onPause = () => {
    if (cancelled || document.hidden || replaying) return;
    if (atEnd(video)) replay();
  };
  const onVisibility = () => {
    if (!document.hidden && !cancelled) void video.play().catch(() => {});
  };

  video.loop = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.addEventListener("ended", onEnded);
  video.addEventListener("pause", onPause);
  document.addEventListener("visibilitychange", onVisibility);
  void video.play().catch(() => {});

  let raf = 0;
  const watch = () => {
    raf = requestAnimationFrame(watch);
    if (cancelled || replaying || document.hidden) return;
    // `ended` does not fire when `loop` is set, and iOS sometimes paints the
    // last frame forever without pausing. Restart from the playhead itself.
    if (atEnd(video)) replay();
  };
  raf = requestAnimationFrame(watch);

  return () => {
    cancelled = true;
    cancelReplay();
    cancelAnimationFrame(raf);
    video.removeEventListener("ended", onEnded);
    video.removeEventListener("pause", onPause);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}

function startCrossfade(a: HTMLVideoElement, b: HTMLVideoElement) {
  let active = a;
  let idle = b;
  let fading = false;
  let idleReady = false;
  let cancelled = false;
  let replaying = false;
  let cancelReplay = () => {};
  let disarm = () => {};

  const arm = (video: HTMLVideoElement) => {
    disarm();
    idleReady = false;
    const markReady = () => {
      if (video === idle && video.readyState >= 2 && video.currentTime < 0.05) {
        idleReady = true;
      }
    };
    video.addEventListener("seeked", markReady);
    video.addEventListener("loadeddata", markReady);
    disarm = () => {
      video.removeEventListener("seeked", markReady);
      video.removeEventListener("loadeddata", markReady);
    };
    const seekToStart = () => {
      if (video.currentTime < 0.05 && video.readyState >= 2) {
        markReady();
        return;
      }
      try {
        video.currentTime = 0.01;
      } catch {
        // Metadata can be ready before the element accepts a seek.
      }
    };
    if (video.readyState >= 1) seekToStart();
    else video.addEventListener("loadedmetadata", seekToStart, { once: true });
  };

  const replayActive = () => {
    if (cancelled || fading || replaying) return;
    replaying = true;
    cancelReplay = replayFromStart(active);
    window.setTimeout(() => {
      replaying = false;
    }, 500);
  };

  const beginFade = () => {
    if (cancelled || fading || replaying || !idleReady) return;
    fading = true;
    idle
      .play()
      .then(() => {
        if (cancelled) return;
        if (idle.paused) {
          fading = false;
          replayActive();
          return;
        }
        idle.style.transition = `opacity ${LOOP_FADE_SECONDS}s linear`;
        active.style.transition = `opacity ${LOOP_FADE_SECONDS}s linear`;
        idle.style.opacity = "1";
        active.style.opacity = "0";
        window.setTimeout(() => {
          if (cancelled) return;
          active.pause();
          active.style.transition = "none";
          active.style.opacity = "0";
          const finished = active;
          active = idle;
          idle = finished;
          fading = false;
          arm(idle);
        }, LOOP_FADE_SECONDS * 1000);
      })
      .catch(() => {
        if (cancelled) return;
        fading = false;
        replayActive();
      });
  };

  const onEnded = (event: Event) => {
    if (event.target !== active) return;
    replayActive();
  };

  a.loop = false;
  b.loop = false;
  arm(idle);
  a.addEventListener("ended", onEnded);
  b.addEventListener("ended", onEnded);
  void a.play().catch(() => {});

  let raf = 0;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    if (cancelled || fading || replaying || !Number.isFinite(active.duration)) return;
    const remaining = active.duration - active.currentTime;
    if (remaining <= LOOP_FADE_SECONDS) beginFade();
    if (!fading && atEnd(active)) replayActive();
  };
  raf = requestAnimationFrame(tick);

  return () => {
    cancelled = true;
    cancelReplay();
    disarm();
    a.removeEventListener("ended", onEnded);
    b.removeEventListener("ended", onEnded);
    cancelAnimationFrame(raf);
  };
}

function BackgroundVideo({
  src,
  onReady,
  onUnavailable,
}: {
  src: string;
  onReady: () => void;
  onUnavailable: () => void;
}) {
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const onReadyRef = useRef(onReady);
  const onUnavailableRef = useRef(onUnavailable);
  useEffect(() => {
    onReadyRef.current = onReady;
    onUnavailableRef.current = onUnavailable;
  });

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;

    const markVideoReady = () => onReadyRef.current();
    const markUnavailable = () => onUnavailableRef.current();
    if (a.readyState >= 2) markVideoReady();
    else a.addEventListener("loadeddata", markVideoReady, { once: true });
    a.addEventListener("playing", markVideoReady, { once: true });
    a.addEventListener("error", markUnavailable, { once: true });

    const single = prefersSingleVideoLoop();
    if (!single && !b.getAttribute("src")) b.src = src;
    const stop = single ? startSingleLoop(a) : startCrossfade(a, b);

    return () => {
      stop();
      a.removeEventListener("loadeddata", markVideoReady);
      a.removeEventListener("playing", markVideoReady);
      a.removeEventListener("error", markUnavailable);
    };
  }, [src]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <video
        ref={aRef}
        src={src}
        muted
        playsInline
        autoPlay
        loop
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 1 }}
      />
      <video
        ref={bRef}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 0 }}
      />
    </div>
  );
}

function HeroSkeleton({ fading }: { fading: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-[80] flex min-h-dvh items-center justify-center pb-[18vh] transition-opacity duration-500 ${fading ? "pointer-events-none opacity-0" : "opacity-100"}`}
      style={{
        background:
          "linear-gradient(180deg, #e8f2f8 0%, #c5dced 55%, #9ec3db 100%)",
      }}
      aria-hidden="true"
    >
      <div className="flex w-[250px] flex-col items-center">
        <div className="size-[70px] animate-pulse rounded-[22px] bg-black/10" />
        <div className="mt-2.5 mb-5 h-9 w-32 animate-pulse rounded-md bg-black/10" />
        <div className="mb-2 h-4 w-[220px] animate-pulse rounded bg-black/10" />
        <div className="mb-5 h-4 w-40 animate-pulse rounded bg-black/10" />
        <div className="mt-5 flex items-center gap-2.5">
          <div className="h-[34px] w-[112px] animate-pulse rounded-full bg-[#e75900]/80" />
          <div className="h-[34px] w-[104px] animate-pulse rounded-full bg-[#e75900]/80" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [videoReady, setVideoReady] = useState(false);
  const [logoReady, setLogoReady] = useState(false);
  const [useStill, setUseStill] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add("is-pile-brochure");
    document.body.classList.add("is-pile-brochure");
    return removeBrochureClass;
  }, []);

  useEffect(() => {
    const img = document.querySelector('img[alt="Naanda"]');
    const already =
      img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0;
    // Next/Image often skips onLoad when the file is already decoded, which
    // left this overlay up on phones. Cap it so the hero cannot stay hidden.
    const cap = window.setTimeout(
      () => setLogoReady(true),
      already ? 0 : SKELETON_CAP_MS,
    );
    return () => window.clearTimeout(cap);
  }, []);

  useEffect(() => {
    if (!logoReady) return;
    const hide = window.setTimeout(() => setShowSkeleton(false), 500);
    return () => window.clearTimeout(hide);
  }, [logoReady]);

  useEffect(() => {
    if (videoReady || useStill) return;
    const giveUp = window.setTimeout(() => setUseStill(true), VIDEO_FALLBACK_MS);
    return () => window.clearTimeout(giveUp);
  }, [videoReady, useStill]);

  return (
    <>
      {useStill ? (
        <div
          className="fixed inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${SITE_BASE}/bg-sq.jpg)` }}
        />
      ) : (
        <BackgroundVideo
          src={`${SITE_BASE}/sky.mp4`}
          onReady={() => setVideoReady(true)}
          onUnavailable={() => setUseStill(true)}
        />
      )}

      {useStill ? null : (
        <>
          <div
            className="pointer-events-none fixed bottom-0 left-0 z-[60]"
            style={{
              backgroundImage: `url(${SITE_BASE}/bg-clear.webp)`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center top",
              height: "42%",
              width: "100%",
            }}
          />
          <div
            className="pointer-events-none fixed inset-0"
            style={{
              background:
                "linear-gradient(rgba(247,250,251,0.9) 20%, rgba(0,0,0,0) 70%)",
            }}
          />
        </>
      )}

      <div className="relative z-10 h-dvh overflow-hidden">
        <section className="relative z-[70] mx-auto flex h-full max-w-[250px] flex-col items-center justify-center pb-[18vh] text-center">
          <Image
            src={`${SITE_BASE}/pile-logo.png`}
            alt="Naanda"
            width={70}
            height={70}
            className="mx-auto block"
            priority
            onLoad={(event) => {
              if (event.currentTarget.naturalWidth > 0) setLogoReady(true);
            }}
            onError={() => setLogoReady(true)}
          />
          <h1
            className="mt-2.5 mb-5 text-center font-medium"
            style={{
              fontSize: "1.5em",
              lineHeight: "36px",
              color: "rgba(0,0,0,0.85)",
            }}
          >
            Naanda
          </h1>
          <h2
            className="mx-auto mb-5 max-w-[250px] font-normal opacity-80"
            style={{
              fontSize: "1rem",
              lineHeight: 1.5,
              color: "rgb(11,11,11)",
            }}
          >
            A personal page. This sentence is a placeholder.
          </h2>
          <div className="mx-auto mt-5 max-w-[300px]">
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[34px] items-center gap-2.5 rounded-full px-3 text-[0.9em] text-white no-underline transition-colors"
                style={{
                  backgroundColor: "#e75900",
                  paddingLeft: 12,
                  paddingRight: 15,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#b14400")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e75900")
                }
              >
                <LinkedInIcon className="h-[18px] w-[18px]" />
                LinkedIn
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[34px] items-center gap-2.5 rounded-full px-3 text-[0.9em] text-white no-underline transition-colors"
                style={{
                  backgroundColor: "#e75900",
                  paddingLeft: 12,
                  paddingRight: 15,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#b14400")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e75900")
                }
              >
                <GitHubIcon className="h-[18px] w-[18px]" />
                GitHub
              </a>
            </div>
          </div>
        </section>
      </div>

      {showSkeleton ? <HeroSkeleton fading={logoReady} /> : null}
    </>
  );
}
