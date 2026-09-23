"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { AppleIcon, WindowsIcon, GitHubIcon } from "@/components/sites/un.ms-9e73fc9e/pile-7b2b2b3f/icons";

const SITE_BASE = "/sites/un.ms-9e73fc9e/pile-7b2b2b3f";

function SmoothVideo({ src }: { src: string }) {
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    document.documentElement.classList.add("is-pile-brochure");
    document.body.classList.add("is-pile-brochure");

    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;

    let active: "a" | "b" = "a";
    const fadeDuration = 0.3;

    a.play().catch(() => {});

    const handleTimeUpdate = () => {
      const current = active === "a" ? a : b;
      const next = active === "a" ? b : a;
      const remaining = current.duration - current.currentTime;

      if (remaining < fadeDuration && next.paused) {
        next.currentTime = 0;
        next.play().catch(() => {});

        current.style.transition = `opacity ${fadeDuration}s ease-in`;
        next.style.transition = "none";
        next.style.opacity = "1";
        current.style.opacity = "0";

        setTimeout(() => {
          current.pause();
          active = active === "a" ? "b" : "a";
        }, fadeDuration * 1000);
      }
    };

    a.addEventListener("timeupdate", handleTimeUpdate);
    b.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      document.documentElement.classList.remove("is-pile-brochure");
      document.body.classList.remove("is-pile-brochure");
      a.removeEventListener("timeupdate", handleTimeUpdate);
      b.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <video
        ref={aRef}
        src={src}
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 1 }}
      />
      <video
        ref={bRef}
        src={src}
        muted
        playsInline
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
      <SmoothVideo src={`${SITE_BASE}/sky.mp4`} />

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
        <nav
          className="relative flex items-center justify-between px-[17px] py-3"
          style={{ height: 49, color: "rgb(160,172,185)" }}
        >
          <div
            className="bg-black/15"
            style={{ width: 36, height: 22, borderRadius: "0 90px 90px 0" }}
          />
          <a
            href="https://github.com/UdaraJay/Pile"
            target="_blank"
            rel="noopener noreferrer"
            className="block opacity-95 transition-colors hover:text-[#e75900]"
            style={{ color: "rgba(0,0,0,0.2)" }}
          >
            <GitHubIcon className="h-[25px] w-[25px]" />
          </a>
        </nav>

        {/* Hero */}
        <section
          className="relative mx-auto max-w-[250px] text-center"
          style={{ scrollSnapAlign: "start", marginTop: 144, marginBottom: 144 }}
        >
          <Image
            src={`${SITE_BASE}/pile-logo.png`}
            alt="Pile"
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
            Pile
          </h1>
          <h2
            className="mx-auto mb-5 max-w-[250px] font-normal opacity-80"
            style={{
              fontSize: "1rem",
              lineHeight: 1.5,
              color: "rgb(11,11,11)",
            }}
          >
            Desktop app for reflective journaling. It&apos;s private, integrates with
            AI, and free.
          </h2>
          <div className="mx-auto mt-5 max-w-[300px]">
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <a
                href="https://github.com/UdaraJay/Pile/releases/latest"
                className="inline-flex h-[34px] items-center gap-2.5 rounded-full px-3 text-[0.9em] text-white no-underline transition-colors"
                style={{ backgroundColor: "#e75900", paddingLeft: 12, paddingRight: 15 }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b14400")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e75900")}
              >
                <AppleIcon className="mt-[-2px] h-[18px] w-[18px]" />
                macOS
              </a>
              <a
                href="https://github.com/UdaraJay/Pile/releases/latest"
                className="inline-flex h-[34px] items-center gap-2.5 rounded-full px-3 text-[0.9em] text-white no-underline transition-colors"
                style={{ backgroundColor: "#e75900", paddingLeft: 12, paddingRight: 15 }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b14400")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e75900")}
              >
                <WindowsIcon className="h-[18px] w-[18px]" />
                Windows
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
            Pile
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
