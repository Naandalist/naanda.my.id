"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { GitHubIcon, LinkedInIcon } from "@/components/sites/un.ms-9e73fc9e/pile-7b2b2b3f/icons";

const SITE_BASE = "/sites/un.ms-9e73fc9e/pile-7b2b2b3f";
const LINKEDIN_URL = "https://www.linkedin.com/";
const GITHUB_URL = "https://github.com/";
const LOOP_FADE_SECONDS = 0.6;

function BackgroundVideo({ src }: { src: string }) {
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);

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
        video.currentTime = 0;
      };
      if (video.readyState >= 1) seekToStart();
      else video.addEventListener("loadedmetadata", seekToStart, { once: true });
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

export default function Home() {

  return (
    <>
      {/* Fixed video background - z-index 0 */}
      <BackgroundVideo src={`${SITE_BASE}/sky.mp4`} />

      {/* Fixed cover overlay - bottom landscape */}
      <div
        className="pointer-events-none fixed bottom-0 left-0 z-[60]"
        style={{
          backgroundImage: `url(${SITE_BASE}/bg-clear.png)`,
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
                style={{ backgroundColor: "#e75900", paddingLeft: 12, paddingRight: 15 }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b14400")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e75900")}
              >
                <LinkedInIcon className="h-[18px] w-[18px]" />
                LinkedIn
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[34px] items-center gap-2.5 rounded-full px-3 text-[0.9em] text-white no-underline transition-colors"
                style={{ backgroundColor: "#e75900", paddingLeft: 12, paddingRight: 15 }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b14400")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e75900")}
              >
                <GitHubIcon className="h-[18px] w-[18px]" />
                GitHub
              </a>
            </div>
          </div>
        </section>

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
