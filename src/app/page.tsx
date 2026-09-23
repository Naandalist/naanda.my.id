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

function BackgroundVideo({ src, onReady }: { src: string; onReady: () => void }) {
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    document.documentElement.classList.add("is-pile-brochure");
    document.body.classList.add("is-pile-brochure");

    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) {
      return () => {
        document.documentElement.classList.remove("is-pile-brochure");
        document.body.classList.remove("is-pile-brochure");
      };
    }

    let active = a;
    let idle = b;
    let fading = false;
    let idleReady = false;
    let cancelled = false;
    let disarm = () => {};

    const arm = (video: HTMLVideoElement) => {
      disarm();
      idleReady = false;
      const markReady = () => {
        if (
          video === idle &&
          video.readyState >= 2 &&
          video.currentTime < 0.05
        ) {
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
        video.currentTime = 0;
      };
      if (video.readyState >= 1) seekToStart();
      else
        video.addEventListener("loadedmetadata", seekToStart, { once: true });
    };

    const beginFade = () => {
      if (cancelled || fading || !idleReady) return;
      fading = true;
      idle.play().catch(() => {});
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
    };

    arm(idle);
    const markVideoReady = () => onReadyRef.current();
    if (a.readyState >= 2) markVideoReady();
    else {
      a.addEventListener("loadeddata", markVideoReady, { once: true });
      a.addEventListener("error", markVideoReady, { once: true });
    }
    a.play().catch(() => {});

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (cancelled || fading || !Number.isFinite(active.duration)) return;
      const remaining = active.duration - active.currentTime;
      if (remaining <= LOOP_FADE_SECONDS + 0.2 && idle.paused && idleReady) {
        idle.play().catch(() => {});
      }
      if (remaining <= LOOP_FADE_SECONDS) beginFade();
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      disarm();
      a.removeEventListener("loadeddata", markVideoReady);
      a.removeEventListener("error", markVideoReady);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("is-pile-brochure");
      document.body.classList.remove("is-pile-brochure");
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <video
        ref={aRef}
        src={src}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 1 }}
      />
      <video
        ref={bRef}
        src={src}
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
  const [showSkeleton, setShowSkeleton] = useState(true);
  const ready = videoReady && logoReady;

  useEffect(() => {
    if (!ready) return;
    const hide = window.setTimeout(() => setShowSkeleton(false), 500);
    return () => window.clearTimeout(hide);
  }, [ready]);

  useEffect(() => {
    const giveUp = window.setTimeout(() => {
      setVideoReady(true);
      setLogoReady(true);
    }, 12000);
    return () => window.clearTimeout(giveUp);
  }, []);

  return (
    <>
      {/* Fixed video background - z-index 0 */}
      <BackgroundVideo src={`${SITE_BASE}/sky.mp4`} onReady={() => setVideoReady(true)} />

      {/* Fixed cover overlay - bottom landscape */}
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

      {/* Fixed gradient overlay */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "linear-gradient(rgba(247,250,251,0.9) 20%, rgba(0,0,0,0) 70%)",
        }}
      />

      {/* Scrollable content */}
      <div className="relative z-10 min-h-screen">
        {/* Navigation */}
        {/* Hero */}
        <section
          className="relative z-[70] mx-auto flex min-h-dvh max-w-[250px] flex-col items-center justify-center pb-[18vh] text-center"
          style={{ scrollSnapAlign: "start" }}
        >
          <Image
            src={`${SITE_BASE}/pile-logo.png`}
            alt="Naanda"
            width={70}
            height={70}
            className="mx-auto block"
            priority
            onLoad={() => setLogoReady(true)}
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

        {showSkeleton ? <HeroSkeleton fading={ready} /> : null}

        {/* Big Text Section */}
        <section
          className="relative flex items-center justify-center"
          style={{ scrollSnapAlign: "start" }}
        >
          <p
            className="text-center font-extrabold text-white"
            style={{
              fontSize: "7em",
              mixBlendMode: "overlay",
              margin: "500px 0 350px",
            }}
          >
            Naanda
          </p>
        </section>

        {/* Footer */}
        <section
          className="relative"
          style={{
            height: "calc(100vh - 40px)",
            backgroundImage: `url(${SITE_BASE}/bg-sq.jpg)`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          }}
        />
      </div>
    </>
  );
}
