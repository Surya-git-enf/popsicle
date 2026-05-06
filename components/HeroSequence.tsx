
"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────
const FLAVORS = [
  { id: "chocolate",  label: "Chocolate",  bg: "#F2C94C", ink: "#4A2311" },
  { id: "strawberry", label: "Strawberry", bg: "#00FFFF", ink: "#E91E63" },
  { id: "vanilla",    label: "VANILLA",    bg: "#3E2723", ink: "#FFF3E0" },
  { id: "pistachio",  label: "Pistachio",  bg: "#A5D6A7", ink: "#1B5E20" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Kill all tweens on a selector before starting new ones */
const killAndSet = (sel: string, props: gsap.TweenVars) => {
  gsap.killTweensOf(sel);
  gsap.set(sel, props);
};

export default function HeroSequence() {
  const wrapRef    = useRef<HTMLDivElement>(null); // 400vh scroll track
  const bgRef      = useRef<HTMLDivElement>(null); // background color div
  const trigRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const current    = useRef(0);
  const breathTLs  = useRef<gsap.core.Tween[]>([]);

  // ─── startBreathing: gentle rise-and-fall loop once a flavor is settled ────
  const startBreathing = (i: number) => {
    breathTLs.current.forEach((t) => t.kill());
    breathTLs.current = [
      // Popsicle: slow vertical breath + faint rock
      gsap.to(`#pop-${i}`, {
        y:        -18,
        rotation: 1.8,
        duration: 3.2,
        ease:     "sine.inOut",
        yoyo:     true,
        repeat:   -1,
      }),
      // Splash: subtle swell beneath
      gsap.to(`#splash-${i}`, {
        scaleX:   1.03,
        y:        8,
        duration: 3.8,
        ease:     "sine.inOut",
        yoyo:     true,
        repeat:   -1,
      }),
    ];
  };

  // ─── animateIn: crossfade + rise-from-splash entrance ───────────────────────
  const animateIn = (next: number) => {
    if (current.current === next) return;
    const prev = current.current;
    current.current = next;

    const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

    // 1. Background crossfade
    tl.to(bgRef.current, {
      backgroundColor: FLAVORS[next].bg,
      duration: 0.75,
      ease: "power2.inOut",
    }, 0);

    // 2. OUT — previous elements vanish upward
    tl.to(`#text-${prev}`,   { y: -60, opacity: 0, duration: 0.35, ease: "power3.in" }, 0);
    tl.to(`#pop-${prev}`,    { y: -80, opacity: 0, duration: 0.35, ease: "power3.in" }, 0);
    tl.to(`#splash-${prev}`, { y: -30, opacity: 0, duration: 0.28, ease: "power2.in" }, 0);

    // 3. Reset next elements to "submerged" start position
    //    — pop starts inside the splash zone (bottom of screen), tilted
    killAndSet(`#text-${next}`,   { opacity: 0, y: 70 });
    killAndSet(`#pop-${next}`,    { opacity: 0, y: "55vh", rotation: 18, scale: 0.88 });
    killAndSet(`#splash-${next}`, { opacity: 0, y: 60, scale: 0.92 });

    // 4. IN — splash rises first, then pop emerges through it
    tl.to(`#splash-${next}`, {
      opacity: 1, y: 0, scale: 1,
      duration: 0.65, ease: "power3.out",
    }, 0.28);

    // The popsicle RISES from behind / through the splash — the hero moment
    tl.to(`#pop-${next}`, {
      opacity: 1, y: 0, rotation: 0, scale: 1,
      duration: 1.05, ease: "expo.out",
    }, 0.42);                                // starts while splash is still animating

    // Text fades in last, from below
    tl.to(`#text-${next}`, {
      opacity: 1, y: 0,
      duration: 0.8, ease: "power4.out",
    }, 0.55);

    // 5. Once the entrance settles, hand off to the breathing loop
    tl.call(() => startBreathing(next), [], 1.4);
  };

  useGSAP(() => {
    // ── Initial state: first flavor visible, rest hidden ──────────────────────
    gsap.set(bgRef.current, { backgroundColor: FLAVORS[0].bg });
    FLAVORS.forEach((_, i) => {
      const hidden = i !== 0;
      gsap.set(`#text-${i}`,   { opacity: hidden ? 0 : 1, y: hidden ? 70  : 0 });
      gsap.set(`#pop-${i}`,    { opacity: hidden ? 0 : 1, y: hidden ? "55vh" : 0, rotation: hidden ? 18 : 0, scale: hidden ? 0.88 : 1 });
      gsap.set(`#splash-${i}`, { opacity: hidden ? 0 : 1, y: hidden ? 60  : 0, scale: hidden ? 0.92 : 1 });
    });
    startBreathing(0); // kick off breathing on first flavor immediately

    // ── Invisible sentinel ScrollTriggers ──────────────────────────────────────
    trigRefs.current.forEach((el, i) => {
      if (!el) return;
      ScrollTrigger.create({
        trigger:     el,
        start:       "top 55%",
        end:         "bottom 45%",
        onEnter:     () => animateIn(i),
        onEnterBack: () => animateIn(i),
      });
    });

    // ── Snap: 1 scroll = 1 flavor, CSS sticky handles the visual pin ──────────
    ScrollTrigger.create({
      trigger: wrapRef.current,
      start:   "top top",
      end:     "bottom bottom",
      snap: {
        snapTo:   1 / 3,
        duration: { min: 0.4, max: 0.85 },
        delay:    0.04,
        ease:     "power2.inOut",
      },
    });
  }, { scope: wrapRef });

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div ref={wrapRef} style={{ position: "relative", height: "400vh" }}>

      {/* 4 invisible scroll sentinels — one per flavor slot */}
      {FLAVORS.map((_, i) => (
        <div
          key={i}
          ref={(el) => { trigRefs.current[i] = el; }}
          style={{ position: "absolute", top: `${i * 100}vh`, left: 0, width: "100%", height: "100vh", pointerEvents: "none" }}
        />
      ))}

      {/* CSS sticky viewport — no ScrollTrigger pin, no layout gaps */}
      <div style={{ position: "sticky", top: 0, width: "100%", height: "100vh", overflow: "hidden" }}>

        {/* Background */}
        <div ref={bgRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />

        {/* Grain texture — premium tactile feel */}
        <svg aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, opacity: 0.35, pointerEvents: "none" }}>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" opacity="0.08" />
        </svg>

        {/* All 4 flavor layers */}
        {FLAVORS.map((f, i) => (
          <div key={f.id} style={{ position: "absolute", inset: 0, zIndex: 2 }}>

            {/* ── Large gradient text — top 7% ───────────────────────────────── */}
            <div
              id={`text-${i}`}
              style={{
                position: "absolute", top: "7%", left: 0, right: 0,
                display: "flex", flexDirection: "column", alignItems: "center",
                pointerEvents: "none", zIndex: 10,
              }}
            >
              <h1 style={{
                margin: 0,
                fontSize: "clamp(58px, 12vw, 148px)",
                fontWeight: 900,
                fontFamily: "Georgia, 'Times New Roman', serif",
                letterSpacing: "-0.045em",
                lineHeight: 1,
                textAlign: "center",
                // Gradient: transparent top → solid color — creates the "emerging" feel
                background: `linear-gradient(to bottom, transparent 0%, ${f.ink} 60%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                userSelect: "none",
              }}>
                {f.label.toUpperCase()}
              </h1>
              <span style={{
                marginTop: 10,
                fontFamily: "monospace",
                fontSize: 10,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: f.ink,
                opacity: 0.5,
              }}>
                Artisan · {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            {/* ── Popsicle — rises from splash, center stage ─────────────────── */}
            <div
              id={`pop-${i}`}
              style={{
                position: "absolute",
                top: "10%",
                left: "50%",
                transform: "translateX(-50%)",
                width: 280,
                height: "64vh",
                zIndex: 30,
              }}
            >
              <Image
                src={`/images/${f.id}-pop.png`}
                alt={f.label}
                fill
                className="object-contain object-center"
                priority={i === 0}
                style={{ filter: "drop-shadow(0 32px 64px rgba(0,0,0,0.30))" }}
              />
            </div>

            {/* ── Splash — anchored to bottom, popsicle rises through it ─────── */}
            <div
              id={`splash-${i}`}
              style={{
                position: "absolute",
                bottom: 0, left: 0, right: 0,
                height: "38vh",
                zIndex: 20,
                transformOrigin: "bottom center",
              }}
            >
              <Image
                src={`/images/${f.id}-splash.png`}
                alt=""
                fill
                className="object-cover object-bottom"
                priority={i === 0}
              />
            </div>

          </div>
        ))}

        {/* ── Flavor index dots — right edge ─────────────────────────────────── */}
        <div style={{
          position: "absolute", right: 22, top: "50%",
          transform: "translateY(-50%)",
          display: "flex", flexDirection: "column", gap: 9, zIndex: 50,
        }}>
          {FLAVORS.map((f, i) => (
            <div key={i} style={{
              width: 6, height: 6,
              borderRadius: "50%",
              backgroundColor: i === 0 ? f.ink : "transparent",
              border: `1.5px solid ${FLAVORS[current.current]?.ink ?? "rgba(0,0,0,0.4)"}`,
              transition: "all 0.3s",
            }} />
          ))}
        </div>

        {/* ── ORDER NOW glassmorphism pill ────────────────────────────────────── */}
        <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 50 }}>
          <button
            style={{
              padding: "13px 36px",
              borderRadius: 999,
              border: "1.5px solid rgba(255,255,255,0.5)",
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              color: "#111",
              fontFamily: "monospace",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              cursor: "pointer",
              boxShadow: "0 8px 28px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.transform = "translateY(-3px)";
              b.style.background = "rgba(255,255,255,0.34)";
              b.style.boxShadow = "0 14px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.7)";
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.transform = "translateY(0)";
              b.style.background = "rgba(255,255,255,0.18)";
              b.style.boxShadow = "0 8px 28px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)";
            }}
          >
            Order Now
          </button>
        </div>

      </div>
    </div>
  );
}
