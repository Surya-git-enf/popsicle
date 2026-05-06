
"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const FLAVORS = [
  {
    id: "chocolate",
    label: "Chocolate",
    bgHex: "#F2C94C",
    textHex: "#4A2311",
    popImage: "/images/pop-chocolate.png",
    splashImage: "/images/splash-chocolate.png",
  },
  {
    id: "strawberry",
    label: "Strawberry",
    bgHex: "#00FFFF",
    textHex: "#E91E63",
    popImage: "/images/pop-strawberry.png",
    splashImage: "/images/splash-strawberry.png",
  },
  {
    id: "vanilla",
    label: "Vanilla",
    bgHex: "#3E2723",
    textHex: "#FFF3E0",
    popImage: "/images/pop-vanilla.png",
    splashImage: "/images/splash-vanilla.png",
  },
  {
    id: "pistachio",
    label: "Pistachio",
    bgHex: "#A5D6A7",
    textHex: "#1B5E20",
    popImage: "/images/pop-pistachio.png",
    splashImage: "/images/splash-pistachio.png",
  },
];

export default function HeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeIndexRef = useRef<number>(0);

  useGSAP(
    () => {
      // ─── Continuous ambient motion ────────────────────────────────────────
      gsap.to(".pop-image", {
        y: -25,
        rotation: 3,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.4,
      });

      gsap.to(".splash-image", {
        scale: 1.04,
        y: 15,
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.6,
      });

      // ─── animateIn helper ─────────────────────────────────────────────────
      function animateIn(index: number) {
        if (activeIndexRef.current === index) return;
        const prev = activeIndexRef.current;
        activeIndexRef.current = index;

        const prevFlavor = FLAVORS[prev];
        const nextFlavor = FLAVORS[index];

        // Crossfade background color
        gsap.to(bgRef.current, {
          backgroundColor: nextFlavor.bgHex,
          duration: 0.8,
          ease: "power2.inOut",
        });

        // ── Fade OUT previous elements ──────────────────────────────────────
        const prevSel = `[data-flavor="${prevFlavor.id}"]`;
        gsap.to(`${prevSel} .flavor-text`, {
          opacity: 0,
          y: -50,
          duration: 0.5,
          ease: "power2.in",
        });
        gsap.to(`${prevSel} .pop-image`, {
          opacity: 0,
          y: -50,
          duration: 0.5,
          ease: "power2.in",
        });
        gsap.to(`${prevSel} .splash-image`, {
          opacity: 0,
          y: -50,
          duration: 0.5,
          ease: "power2.in",
        });

        // ── Fade IN next elements ───────────────────────────────────────────
        const nextSel = `[data-flavor="${nextFlavor.id}"]`;
        gsap.fromTo(
          `${nextSel} .flavor-text`,
          { opacity: 0, y: 80 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power4.out", delay: 0.15 }
        );
        gsap.fromTo(
          `${nextSel} .pop-image`,
          { opacity: 0, y: 100, rotation: 35 },
          {
            opacity: 1,
            y: 0,
            rotation: 0,
            duration: 1.1,
            ease: "expo.out",
            delay: 0.1,
          }
        );
        gsap.fromTo(
          `${nextSel} .splash-image`,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.2 }
        );
      }

      // ─── Invisible trigger ScrollTriggers ─────────────────────────────────
      triggerRefs.current.forEach((trigger, i) => {
        if (!trigger) return;
        ScrollTrigger.create({
          trigger,
          start: "top center",
          end: "bottom center",
          onEnter: () => animateIn(i),
          onEnterBack: () => animateIn(i),
        });
      });

      // ─── Snapping ScrollTrigger pinned to the 400vh container ────────────
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: false,
        snap: {
          snapTo: 1 / 3,
          duration: { min: 0.5, max: 1 },
          ease: "power2.inOut",
        },
      });

      // Initialize first flavor visible, others hidden
      FLAVORS.forEach((flavor, i) => {
        const sel = `[data-flavor="${flavor.id}"]`;
        if (i === 0) {
          gsap.set(`${sel} .flavor-text`, { opacity: 1, y: 0 });
          gsap.set(`${sel} .pop-image`, { opacity: 1, y: 0, rotation: 0 });
          gsap.set(`${sel} .splash-image`, { opacity: 1, y: 0 });
        } else {
          gsap.set(`${sel} .flavor-text`, { opacity: 0, y: 80 });
          gsap.set(`${sel} .pop-image`, { opacity: 0, y: 100, rotation: 35 });
          gsap.set(`${sel} .splash-image`, { opacity: 0, y: 40 });
        }
      });

      // Set initial background
      gsap.set(bgRef.current, { backgroundColor: FLAVORS[0].bgHex });
    },
    { scope: containerRef }
  );

  return (
    <>
      {/* ── 400vh scroll container ── */}
      <div ref={containerRef} className="relative" style={{ height: "400vh" }}>
        {/* Invisible trigger divs spaced 100vh apart */}
        {FLAVORS.map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              triggerRefs.current[i] = el;
            }}
            style={{
              position: "absolute",
              top: `${i * 100}vh`,
              left: 0,
              width: "100%",
              height: "100vh",
              pointerEvents: "none",
            }}
          />
        ))}

        {/* ── Sticky visual wrapper ── */}
        <div
          ref={stickyRef}
          className="sticky top-0 w-full overflow-hidden"
          style={{ height: "100vh" }}
        >
          {/* Dynamic background */}
          <div
            ref={bgRef}
            className="absolute inset-0 transition-none"
            style={{ backgroundColor: FLAVORS[0].bgHex }}
          />

          {/* Noise grain overlay for premium texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
              backgroundSize: "200px 200px",
              mixBlendMode: "overlay",
              opacity: 0.35,
            }}
          />

          {/* Layer all 4 flavors on top of each other (absolute stacked) */}
          {FLAVORS.map((flavor) => (
            <div
              key={flavor.id}
              data-flavor={flavor.id}
              className="absolute inset-0"
            >
              {/* Text — top 8% */}
              <div
                className="flavor-text absolute left-0 right-0 flex flex-col items-center"
                style={{ top: "8%" }}
              >
                <span
                  className="font-serif select-none"
                  style={{
                    fontSize: "clamp(64px, 12vw, 140px)",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    backgroundImage: `linear-gradient(to bottom, transparent 0%, ${flavor.textHex} 70%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "transparent",
                    textAlign: "center",
                  }}
                >
                  {flavor.label.toUpperCase()}
                </span>
                <p
                  className="mt-3 font-sans tracking-widest uppercase text-sm"
                  style={{ color: flavor.textHex, opacity: 0.7 }}
                >
                  Premium Artisan Popsicle
                </p>
              </div>

              {/* Popsicle — top 12%, dead center */}
              <div
                className="pop-image absolute left-1/2 -translate-x-1/2"
                style={{ top: "12%", width: 280, height: "65vh" }}
              >
                <Image
                  src={flavor.popImage}
                  alt={flavor.label}
                  fill
                  className="object-contain object-center"
                  priority={flavor.id === "chocolate"}
                />
              </div>

              {/* Splash — bottom 0, dead center */}
              <div
                className="splash-image absolute bottom-0 left-1/2 -translate-x-1/2"
                style={{ width: "100%", height: "35vh" }}
              >
                <Image
                  src={flavor.splashImage}
                  alt={`${flavor.label} splash`}
                  fill
                  className="object-contain object-center"
                />
              </div>
            </div>
          ))}

          {/* Flavor indicator dots */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
            {FLAVORS.map((flavor, i) => (
              <div
                key={flavor.id}
                className="w-2 h-2 rounded-full border border-black/30"
                style={{
                  backgroundColor:
                    i === activeIndexRef.current ? "#000" : "transparent",
                }}
              />
            ))}
          </div>

          {/* ── ORDER NOW glassmorphism button (fixed bottom center) ── */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
            <button
              className="group relative border-none rounded-full font-sans font-bold tracking-widest uppercase text-sm px-8 py-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.35)",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.4)",
                color: "#111",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(-2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 14px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.4)";
              }}
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
