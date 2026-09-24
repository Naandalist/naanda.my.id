"use client";

import { useEffect, useRef } from "react";

import { heroConfig } from "@/lib/site-config";

function replayFromStart(video: HTMLVideoElement) {
  let settled = false;
  const play = () => {
    if (!settled) {
      settled = true;
      video.removeEventListener("seeked", play);
      void video.play().catch(() => {});
    }
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

function prefersSingleVideoLoop() {
  const ios =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return ios || window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

function startSingleLoop(video: HTMLVideoElement) {
  let cancelled = false,
    replaying = false,
    cancelReplay = () => {};
  const replay = () => {
    if (!cancelled && !replaying) {
      replaying = true;
      cancelReplay = replayFromStart(video);
      window.setTimeout(() => {
        replaying = false;
      }, 500);
    }
  };
  const onEnded = () => replay();
  const onPause = () => {
    if (!cancelled && !document.hidden && !replaying && atEnd(video)) replay();
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
    if (!cancelled && !replaying && !document.hidden && atEnd(video)) replay();
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
  let active = a,
    idle = b,
    fading = false,
    idleReady = false,
    cancelled = false,
    replaying = false,
    cancelReplay = () => {},
    disarm = () => {};
  const arm = (video: HTMLVideoElement) => {
    disarm();
    idleReady = false;
    const markReady = () => {
      if (video === idle && video.readyState >= 2 && video.currentTime < 0.05) idleReady = true;
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
      } catch {}
    };
    if (video.readyState >= 1) seekToStart();
    else video.addEventListener("loadedmetadata", seekToStart, { once: true });
  };
  const replayActive = () => {
    if (!cancelled && !fading && !replaying) {
      replaying = true;
      cancelReplay = replayFromStart(active);
      window.setTimeout(() => {
        replaying = false;
      }, 500);
    }
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
        idle.style.transition = `opacity ${heroConfig.loopFadeSeconds}s linear`;
        active.style.transition = `opacity ${heroConfig.loopFadeSeconds}s linear`;
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
        }, heroConfig.loopFadeSeconds * 1_000);
      })
      .catch(() => {
        if (!cancelled) {
          fading = false;
          replayActive();
        }
      });
  };
  const onEnded = (event: Event) => {
    if (event.target === active) replayActive();
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
    if (active.duration - active.currentTime <= heroConfig.loopFadeSeconds) beginFade();
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

type BackgroundVideoProps = { src: string; onReady: () => void; onUnavailable: () => void };

export function BackgroundVideo({ src, onReady, onUnavailable }: BackgroundVideoProps) {
  const aRef = useRef<HTMLVideoElement>(null),
    bRef = useRef<HTMLVideoElement>(null),
    onReadyRef = useRef(onReady),
    onUnavailableRef = useRef(onUnavailable);
  useEffect(() => {
    onReadyRef.current = onReady;
    onUnavailableRef.current = onUnavailable;
  });
  useEffect(() => {
    const a = aRef.current,
      b = bRef.current;
    if (!a || !b) return;
    const markReady = () => onReadyRef.current(),
      markUnavailable = () => onUnavailableRef.current();
    if (a.readyState >= 2) markReady();
    else a.addEventListener("loadeddata", markReady, { once: true });
    a.addEventListener("playing", markReady, { once: true });
    a.addEventListener("error", markUnavailable, { once: true });
    const single = prefersSingleVideoLoop();
    if (!single && !b.getAttribute("src")) b.src = src;
    const stop = single ? startSingleLoop(a) : startCrossfade(a, b);
    return () => {
      stop();
      a.removeEventListener("loadeddata", markReady);
      a.removeEventListener("playing", markReady);
      a.removeEventListener("error", markUnavailable);
    };
  }, [src]);
  return (
    <div className="hero-video">
      <video ref={aRef} src={src} muted playsInline autoPlay loop preload="auto" />
      <video ref={bRef} muted playsInline preload="auto" />
    </div>
  );
}
