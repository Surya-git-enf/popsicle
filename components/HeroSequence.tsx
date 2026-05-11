
"use client";

import { useRef, useEffect, useCallback, useState } from "react";
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
  const outerRef = useRef<HTMLDivElement>(null);  // tall scroll wrapper
  const stickyRef = useRef<HTMLDivElement>(null); // sticky viewport panel
  const currentRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const floatTweensRef = useRef<gsap.core.Tween[]>([]);
  const [dotActive, setDotActive] = useState(0);

  /* ─── flavor transition ───────────────────────────────── */

  const showFlavor = useCallback((next: number, direction: 1 | -1 = 1) => {
    if (isAnimatingRef.current || next === currentRef.current) return;
    if (next < 0 || next >= FLAVORS.length) return;

    isAnimatingRef.current = true;
    const prev = currentRef.current;
    currentRef.current = next;
    setDotActive(next);

    const tl = gsap.timeline({
      onComplete: () => { isAnimatingRef.current = false; },
    });

    tl.fromTo(
      `.shutter-bg-${next}`,
      { clipPath: direction === 1 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power3.inOut" },
      0
    );

    tl.to(`.flavor-group-${prev} .hs-text`,
      { opacity: 0, y: direction === 1 ? -60 : 60, duration: 0.35, ease: "power2.in" }, 0);
    tl.to(`.flavor-group-${prev} .hs-pop`,
      { yPercent: direction === 1 ? -110 : 110, rotationY: direction === 1 ? -25 : 25,
        rotationX: direction === 1 ? 10 : -10, opacity: 0, duration: 0.4, ease: "power2.in" }, 0);
    tl.to(`.flavor-group-${prev} .hs-splash`,
      { opacity: 0, yPercent: direction === 1 ? 40 : -40, duration: 0.35, ease: "power2.in" }, 0);
    tl.to(`.flavor-group-${prev}`,
      { autoAlpha: 0, rotationY: direction === 1 ? -12 : 12, duration: 0.5 }, 0);

    tl.fromTo(`.flavor-group-${next}`,
      { autoAlpha: 0, rotationY: direction === 1 ? 18 : -18, z: -200, xPercent: direction === 1 ? 20 : -20 },
      { autoAlpha: 1, rotationY: 0, z: 0, xPercent: 0, duration: 0.65, ease: "power3.out" }, 0.3);
    tl.fromTo(`.flavor-group-${next} .hs-text`,
      { opacity: 0, y: direction === 1 ? 70 : -70 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, 0.4);
    tl.fromTo(`.flavor-group-${next} .hs-pop`,
      { yPercent: direction === 1 ? 110 : -110, rotationY: direction === 1 ? 30 : -30,
        rotationX: direction === 1 ? -12 : 12, opacity: 0 },
      { yPercent: 0, rotationY: 0, rotationX: 0, opacity: 1, duration: 0.9, ease: "expo.out" }, 0.35);
    tl.fromTo(`.flavor-group-${next} .hs-splash`,
      { opacity: 0, yPercent: direction === 1 ? 50 : -50 },
      { opacity: 1, yPercent: 0, duration: 0.65, ease: "power2.out" }, 0.4);
  }, []);

  /* ─── scroll interception ─────────────────────────────── */

  useEffect(() => {
    let touchStartY = 0;
    const TOUCH_THRESHOLD = 30;

    // The sticky panel is "active" only while the outer wrapper
    // straddles the viewport — top <= 0 AND bottom >= window.innerHeight.
    const isPanelStuck = (): boolean => {
      const outer = outerRef.current;
      if (!outer) return false;
      const { top, bottom } = outer.getBoundingClientRect();
      return top <= 1 && bottom >= window.innerHeight - 1;
    };

    const onWheel = (e: WheelEvent) => {
      if (!isPanelStuck()) return; // not in our zone → normal scroll

      const dir = e.deltaY > 0 ? 1 : -1;
      const next = currentRef.current + dir;

      // At boundaries → release scroll so page continues
      if (next < 0 || next >= FLAVORS.length) return;

      // Inside sequence → capture & snap one flavor
      e.preventDefault();
      if (!isAnimatingRef.current) showFlavor(next, dir as 1 | -1);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!isPanelStuck() || isAnimatingRef.current) return;
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < TOUCH_THRESHOLD) return;
      const dir = delta > 0 ? 1 : -1;
      const next = currentRef.current + dir;
      if (next < 0 || next >= FLAVORS.length) return;
      showFlavor(next, dir as 1 | -1);
    };

    // Must be on window (not the element) so we catch all scroll events
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [showFlavor]);

  /* ─── keyboard nav ────────────────────────────────────── */

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

  /* ─── GSAP init ───────────────────────────────────────── */

  useGSAP(() => {
    FLAVORS.forEach((_, i) => {
      if (i === 0) {
        gsap.set(`.shutter-bg-0`, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(`.flavor-group-0`, { autoAlpha: 1, rotationY: 0, xPercent: 0, z: 0 });
        gsap.set(`.flavor-group-0 .hs-text`, { opacity: 1, y: 0 });
        gsap.set(`.flavor-group-0 .hs-pop`, { yPercent: 0, rotationY: 0, rotationX: 0, opacity: 1 });
        gsap.set(`.flavor-group-0 .hs-splash`, { opacity: 1, yPercent: 0 });
      } else {
        gsap.set(`.shutter-bg-${i}`, { clipPath: "inset(0% 0% 0% 100%)" });
        gsap.set(`.flavor-group-${i}`, { autoAlpha: 0, rotationY: 18, xPercent: 20, z: -200 });
        gsap.set(`.flavor-group-${i} .hs-text`, { opacity: 0, y: 70 });
        gsap.set(`.flavor-group-${i} .hs-pop`, { yPercent: 110, rotationY: 30, rotationX: -12, opacity: 0 });
        gsap.set(`.flavor-group-${i} .hs-splash`, { opacity: 0, yPercent: 50 });
      }
    });

    const initTl = gsap.timeline();
    initTl
      .fromTo(".loader-bar", { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: "power2.inOut", transformOrigin: "left center" })
      .to(".loader-wrapper", { yPercent: -100, duration: 0.9, ease: "expo.inOut" })
      .fromTo(".flavor-group-0 .hs-text", { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.5")
      .fromTo(".flavor-group-0 .hs-pop",
        { yPercent: 110, rotationY: 30, rotationX: -12, opacity: 0 },
        { yPercent: 0, rotationY: 0, rotationX: 0, opacity: 1, duration: 0.9, ease: "expo.out" }, "-=0.6")
      .fromTo(".flavor-group-0 .hs-splash", { opacity: 0, yPercent: 50 },
        { opacity: 1, yPercent: 0, duration: 0.7, ease: "power2.out" }, "-=0.7");

    floatTweensRef.current.forEach((t) => t.kill());
    floatTweensRef.current = [
      gsap.to(".float-pop", {
        y: -22, rotationX: 10, rotationY: 5, duration: 3.2,
        yoyo: true, repeat: -1, ease: "sine.inOut", stagger: 0.25, force3D: true,
      }),
      gsap.to(".float-splash", {
        y: 14, scale: 1.04, rotationX: -8, duration: 4.1,
        yoyo: true, repeat: -1, ease: "sine.inOut", stagger: 0.3, force3D: true,
      }),
    ];
  }, { scope: stickyRef });

  const goTo = (i: number) => {
    if (i === currentRef.current || isAnimatingRef.current) return;
    showFlavor(i, i > currentRef.current ? 1 : -1);
  };

  /* ─── render ──────────────────────────────────────────── */

  return (
    /**
     * OUTER: tall wrapper — gives the page real scroll height.
     * Height = flavors × 100vh so the browser has room to scroll
     * through the sticky section and then naturally continue past it.
     */
    <div
      ref={outerRef}
      style={{ height: `${FLAVORS.length * 100}vh`, position: "relative" }}
    >
      {/**
       * INNER: sticky panel locked to the viewport.
       * position:sticky + top:0 means it stays pinned while the
       * outer wrapper scrolls past — no ScrollTrigger needed.
       * Once the outer wrapper's bottom leaves the viewport the
       * sticky panel unsticks and the page flows to the next section.
       */}
      <div
        ref={stickyRef}
        className="select-none"
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          perspective: "1400px",
          perspectiveOrigin: "50% 40%",
          backgroundColor: FLAVORS[0].bg,
        }}
      >
        {/* loader */}
        <div
          className="loader-wrapper absolute inset-0 z-[200] bg-black flex flex-col items-center justify-center"
        >
          <p style={{
            fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.5em",
            color: "rgba(255,255,255,0.6)", textTransform: "uppercase", marginBottom: "20px",
          }}>
            Initiating...
          </p>
          <div style={{ width: "192px", height: "1px", background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
            <div
              className="loader-bar"
              style={{ width: "100%", height: "100%", background: "white", transformOrigin: "left center" }}
            />
          </div>
        </div>

        {/* backgrounds */}
        <div className="absolute inset-0 z-0" style={{ transformStyle: "preserve-3d" }}>
          {FLAVORS.map((flavor, i) => (
            <div
              key={`bg-${flavor.id}`}
              className={`shutter-bg shutter-bg-${i} absolute inset-0 w-full h-full`}
              style={{ backgroundColor: flavor.bg, zIndex: i }}
            />
          ))}
        </div>

        {/* flavor groups */}
        {FLAVORS.map((flavor, i) => (
          <div
            key={`group-${flavor.id}`}
            className={`flavor-group flavor-group-${i} absolute inset-0 z-10 flex flex-col items-center justify-center`}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* title */}
            <div className="hs-text absolute top-[7%] w-full flex justify-center z-10 pointer-events-none">
              <h1
                className="font-black tracking-tighter uppercase leading-none"
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize: "clamp(60px, 14vw, 180px)",
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
                className="float-pop will-change-transform"
                style={{
                  position: "relative",
                  width: "clamp(220px, 25vw, 360px)",
                  height: "clamp(440px, 50vw, 720px)",
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
              className="hs-splash absolute bottom-0 z-20 w-full pointer-events-none"
              style={{ height: "clamp(200px, 44vh, 500px)", transform: "translateZ(40px)" }}
            >
              <div className="float-splash will-change-transform" style={{ position: "relative", width: "100%", height: "100%" }}>
                <Image
                  src={`/images/${flavor.id}-splash.png`}
                  alt={`${flavor.title} Splash`}
                  fill
                  className="object-cover object-bottom"
                  priority={i === 0}
                />
              </div>
            </div>

            {/* counter */}
            <div className="absolute bottom-8 left-8 z-40 pointer-events-none" style={{ transform: "translateZ(80px)" }}>
              <span style={{
                fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.4em",
                color: flavor.textHex, opacity: 0.5, textTransform: "uppercase",
              }}>
                {String(i + 1).padStart(2, "0")} / {String(FLAVORS.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        ))}

        {/* dot nav */}
        <div
          className="absolute right-6 z-50 flex flex-col gap-3"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          {FLAVORS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to ${FLAVORS[i].title}`}
              style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: "white", border: "none", cursor: "pointer", padding: 0,
                opacity: dotActive === i ? 1 : 0.3,
                transform: dotActive === i ? "scale(1.5)" : "scale(1)",
                transition: "opacity 0.3s, transform 0.3s",
                mixBlendMode: "difference",
              }}
            />
          ))}
        </div>

        {/* brand */}
        <div className="absolute bottom-6 right-8 z-50 pointer-events-none">
          <p style={{
            fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.3em",
            color: "white", opacity: 0.5, textTransform: "uppercase",
            mixBlendMode: "difference",
          }}>
            Lickers
          </p>
        </div>
      </div>
    </div>
  );
    }
                  
