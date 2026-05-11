
"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const FLAVORS = [
  { id: "chocolate", title: "CHOCOLATE", bg: "#F2C94C", textHex: "#4A2311" },
  { id: "strawberry", title: "STRAWBERRY", bg: "#00FFFF", textHex: "#E91E63" },
  { id: "vanilla", title: "VANILLA", bg: "#3E2723", textHex: "#FFFFFF" },
  { id: "pistachio", title: "PISTACHIO", bg: "#A5D6A7", textHex: "#1B5E20" },
];

export default function HeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const floatTweensRef = useRef<gsap.core.Tween[]>([]);

  /* ─── helpers ─────────────────────────────────────────── */

  const showFlavor = useCallback(
    (next: number, direction: 1 | -1 = 1) => {
      if (isAnimatingRef.current || next === currentRef.current) return;
      if (next < 0 || next >= FLAVORS.length) return;

      isAnimatingRef.current = true;
      const prev = currentRef.current;
      currentRef.current = next;

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });

      /* background shutter wipe */
      tl.fromTo(
        `.shutter-bg-${next}`,
        { clipPath: direction === 1 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power3.inOut" },
        0
      );

      /* exit: prev group */
      tl.to(
        `.flavor-group-${prev} .hs-text`,
        { opacity: 0, y: direction === 1 ? -60 : 60, duration: 0.35, ease: "power2.in" },
        0
      );
      tl.to(
        `.flavor-group-${prev} .hs-pop`,
        {
          yPercent: direction === 1 ? -110 : 110,
          rotationY: direction === 1 ? -25 : 25,
          rotationX: direction === 1 ? 10 : -10,
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
        },
        0
      );
      tl.to(
        `.flavor-group-${prev} .hs-splash`,
        { opacity: 0, yPercent: direction === 1 ? 40 : -40, duration: 0.35, ease: "power2.in" },
        0
      );
      tl.to(
        `.flavor-group-${prev}`,
        { autoAlpha: 0, rotationY: direction === 1 ? -12 : 12, duration: 0.5 },
        0
      );

      /* enter: next group */
      tl.fromTo(
        `.flavor-group-${next}`,
        {
          autoAlpha: 0,
          rotationY: direction === 1 ? 18 : -18,
          z: -200,
          xPercent: direction === 1 ? 20 : -20,
        },
        { autoAlpha: 1, rotationY: 0, z: 0, xPercent: 0, duration: 0.65, ease: "power3.out" },
        0.3
      );
      tl.fromTo(
        `.flavor-group-${next} .hs-text`,
        { opacity: 0, y: direction === 1 ? 70 : -70 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
        0.4
      );
      tl.fromTo(
        `.flavor-group-${next} .hs-pop`,
        {
          yPercent: direction === 1 ? 110 : -110,
          rotationY: direction === 1 ? 30 : -30,
          rotationX: direction === 1 ? -12 : 12,
          opacity: 0,
        },
        { yPercent: 0, rotationY: 0, rotationX: 0, opacity: 1, duration: 0.9, ease: "expo.out" },
        0.35
      );
      tl.fromTo(
        `.flavor-group-${next} .hs-splash`,
        { opacity: 0, yPercent: direction === 1 ? 50 : -50 },
        { opacity: 1, yPercent: 0, duration: 0.65, ease: "power2.out" },
        0.4
      );
    },
    []
  );

  /* ─── wheel / touch snap ───────────────────────────────── */

  useEffect(() => {
    let touchStartY = 0;
    const THRESHOLD = 30; // px threshold for touch

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimatingRef.current) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      showFlavor(currentRef.current + dir, dir as 1 | -1);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (isAnimatingRef.current) return;
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < THRESHOLD) return;
      const dir = delta > 0 ? 1 : -1;
      showFlavor(currentRef.current + dir, dir as 1 | -1);
    };

    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [showFlavor]);

  /* ─── keyboard snap ───────────────────────────────────── */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isAnimatingRef.current) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        showFlavor(currentRef.current + 1, 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        showFlavor(currentRef.current - 1, -1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showFlavor]);

  /* ─── GSAP setup ──────────────────────────────────────── */

  useGSAP(
    () => {
      /* initial states */
      FLAVORS.forEach((_, i) => {
        if (i === 0) {
          gsap.set(`.shutter-bg-0`, { clipPath: "inset(0% 0% 0% 0%)" });
          gsap.set(`.flavor-group-0`, { autoAlpha: 1, rotationY: 0, xPercent: 0, z: 0 });
          gsap.set(`.flavor-group-0 .hs-text`, { opacity: 1, y: 0 });
          gsap.set(`.flavor-group-0 .hs-pop`, { yPercent: 0, rotationY: 0, rotationX: 0, opacity: 1 });
          gsap.set(`.flavor-group-0 .hs-splash`, { opacity: 1, yPercent: 0 });
        } else {
          gsap.set(`.shutter-bg-${i}`, { clipPath: "inset(0% 0% 0% 100%)" });
          gsap.set(`.flavor-group-${i}`, {
            autoAlpha: 0,
            rotationY: 18,
            xPercent: 20,
            z: -200,
          });
          gsap.set(`.flavor-group-${i} .hs-text`, { opacity: 0, y: 70 });
          gsap.set(`.flavor-group-${i} .hs-pop`, {
            yPercent: 110,
            rotationY: 30,
            rotationX: -12,
            opacity: 0,
          });
          gsap.set(`.flavor-group-${i} .hs-splash`, { opacity: 0, yPercent: 50 });
        }
      });

      /* loader reveal */
      const initTl = gsap.timeline();
      initTl
        .fromTo(
          ".loader-bar",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: "power2.inOut", transformOrigin: "left center" }
        )
        .to(".loader-wrapper", { yPercent: -100, duration: 0.9, ease: "expo.inOut" })
        .fromTo(
          ".flavor-group-0 .hs-text",
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(
          ".flavor-group-0 .hs-pop",
          { yPercent: 110, rotationY: 30, rotationX: -12, opacity: 0 },
          { yPercent: 0, rotationY: 0, rotationX: 0, opacity: 1, duration: 0.9, ease: "expo.out" },
          "-=0.6"
        )
        .fromTo(
          ".flavor-group-0 .hs-splash",
          { opacity: 0, yPercent: 50 },
          { opacity: 1, yPercent: 0, duration: 0.7, ease: "power2.out" },
          "-=0.7"
        );

      /* ambient float loops */
      floatTweensRef.current.forEach((t) => t.kill());
      floatTweensRef.current = [
        gsap.to(".float-pop", {
          y: -22,
          rotationX: 10,
          rotationY: 5,
          duration: 3.2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          stagger: 0.25,
          force3D: true,
        }),
        gsap.to(".float-splash", {
          y: 14,
          scale: 1.04,
          rotationX: -8,
          duration: 4.1,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          stagger: 0.3,
          force3D: true,
        }),
      ];
    },
    { scope: containerRef }
  );

  /* ─── dot indicator nav ───────────────────────────────── */

  const goTo = (i: number) => {
    if (i === currentRef.current || isAnimatingRef.current) return;
    const dir = i > currentRef.current ? 1 : -1;
    showFlavor(i, dir);
  };

  /* ─── render ──────────────────────────────────────────── */

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden select-none"
      style={{
        perspective: "1400px",
        perspectiveOrigin: "50% 40%",
        backgroundColor: FLAVORS[0].bg,
        touchAction: "none",
      }}
    >
      {/* ── loader ── */}
      <div className="loader-wrapper absolute inset-0 z-[200] bg-black flex flex-col items-center justify-center">
        <p
          className="text-white/60 mb-5 tracking-[0.5em] uppercase"
          style={{ fontFamily: "monospace", fontSize: "10px" }}
        >
          Initiating...
        </p>
        <div className="w-48 h-px bg-white/10 overflow-hidden">
          <div className="loader-bar w-full h-full bg-white origin-left" />
        </div>
      </div>

      {/* ── background layers ── */}
      <div className="absolute inset-0 z-0" style={{ transformStyle: "preserve-3d" }}>
        {FLAVORS.map((flavor, i) => (
          <div
            key={`bg-${flavor.id}`}
            className={`shutter-bg shutter-bg-${i} absolute inset-0 w-full h-full`}
            style={{ backgroundColor: flavor.bg, zIndex: i }}
          />
        ))}
      </div>

      {/* ── flavor groups ── */}
      {FLAVORS.map((flavor, i) => (
        <div
          key={`group-${flavor.id}`}
          className={`flavor-group flavor-group-${i} absolute inset-0 z-10 flex flex-col items-center justify-center`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* title */}
          <div className="hs-text absolute top-[7%] w-full flex justify-center z-10 pointer-events-none">
            <h1
              className="text-[14vw] md:text-[13vw] font-black tracking-tighter uppercase leading-none"
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                background: `linear-gradient(to bottom, ${flavor.textHex}00 0%, ${flavor.textHex} 80%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textAlign: "center",
                transform: "translateZ(60px)",
              }}
            >
              {flavor.title}
            </h1>
          </div>

          {/* popsicle */}
          <div
            className="hs-pop absolute top-[10%] z-30 w-full flex items-center justify-center pointer-events-none"
            style={{ transform: "translateZ(120px)" }}
          >
            <div
              className="float-pop relative w-[260px] h-[520px] md:w-[360px] md:h-[720px] will-change-transform"
              style={{
                filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.4))",
                transformStyle: "preserve-3d",
              }}
            >
              <Image
                src={`/images/${flavor.id}-pop.png`}
                alt={flavor.title}
                fill
                className="object-contain object-center"
                priority={i === 0}
              />
            </div>
          </div>

          {/* splash */}
          <div
            className="hs-splash absolute bottom-0 z-20 w-full h-[38vh] md:h-[44vh] pointer-events-none flex items-end justify-center"
            style={{ transform: "translateZ(40px)" }}
          >
            <div className="float-splash relative w-full h-full will-change-transform">
              <Image
                src={`/images/${flavor.id}-splash.png`}
                alt={`${flavor.title} Splash`}
                fill
                className="object-cover object-bottom"
                priority={i === 0}
              />
            </div>
          </div>

          {/* flavor index number */}
          <div
            className="absolute bottom-8 left-8 z-40 pointer-events-none"
            style={{ transform: "translateZ(80px)" }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                letterSpacing: "0.4em",
                color: flavor.textHex,
                opacity: 0.5,
                textTransform: "uppercase",
              }}
            >
              {String(i + 1).padStart(2, "0")} / {String(FLAVORS.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      ))}

      {/* ── dot nav ── */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {FLAVORS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to ${FLAVORS[i].title}`}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: "white",
              opacity: currentRef.current === i ? 1 : 0.3,
              transform: currentRef.current === i ? "scale(1.5)" : "scale(1)",
              mixBlendMode: "difference",
            }}
          />
        ))}
      </div>

      {/* ── brand watermark ── */}
      <div className="absolute bottom-6 right-8 z-50 pointer-events-none">
        <p
          style={{
            fontFamily: "monospace",
            fontSize: "10px",
            letterSpacing: "0.3em",
            color: "white",
            opacity: 0.5,
            textTransform: "uppercase",
            mixBlendMode: "difference",
          }}
        >
          Lickers
        </p>
      </div>
    </div>
  );
    }
    
