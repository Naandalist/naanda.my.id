"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { BackgroundVideo } from "@/components/hero/background-video";
import { HeroSkeleton } from "@/components/hero/hero-skeleton";
import { SocialLinks } from "@/components/hero/social-links";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { heroConfig, siteConfig } from "@/lib/site-config";

export default function Home() {
  const [videoReady, setVideoReady] = useState(false);
  const [logoReady, setLogoReady] = useState(false);
  const [useStill, setUseStill] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const reducedMotion = useReducedMotion();
  const showStill = useStill || reducedMotion;
  const { basePath } = siteConfig.assets;

  useEffect(() => {
    document.documentElement.classList.add("is-pile-brochure");
    document.body.classList.add("is-pile-brochure");
    return () => {
      document.documentElement.classList.remove("is-pile-brochure");
      document.body.classList.remove("is-pile-brochure");
    };
  }, []);

  useEffect(() => {
    const image = document.querySelector('img[alt="Naanda"]');
    const loaded = image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0;
    const timer = window.setTimeout(() => setLogoReady(true), loaded ? 0 : heroConfig.skeletonCapMs);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!logoReady) return;
    const timer = window.setTimeout(() => setShowSkeleton(false), 500);
    return () => window.clearTimeout(timer);
  }, [logoReady]);

  useEffect(() => {
    if (videoReady || showStill) return;
    const timer = window.setTimeout(() => setUseStill(true), heroConfig.videoFallbackMs);
    return () => window.clearTimeout(timer);
  }, [videoReady, showStill]);

  return (
    <>
      {showStill ? (
        <div className="hero-still" style={{ backgroundImage: `url(${basePath}/bg-sq.jpg)` }} />
      ) : (
        <BackgroundVideo src={`${basePath}/sky.mp4`} onReady={() => setVideoReady(true)} onUnavailable={() => setUseStill(true)} />
      )}
      {!showStill && <><div className="hero-foreground" style={{ backgroundImage: `url(${basePath}/bg-clear.webp)` }} /><div className="hero-gradient" /></>}
      <main className="hero-page"><section className="hero-content" aria-labelledby="hero-title">
        <Image src={`${basePath}/pile-logo.png`} alt="Naanda" width={70} height={70} priority onLoad={(event) => { if (event.currentTarget.naturalWidth > 0) setLogoReady(true); }} onError={() => setLogoReady(true)} />
        <h1 id="hero-title">{siteConfig.name}</h1>
        <p>{siteConfig.description}</p>
        <SocialLinks />
      </section></main>
      {showSkeleton && <HeroSkeleton fading={logoReady} />}
    </>
  );
}
