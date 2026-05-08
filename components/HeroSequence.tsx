
"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────
// FLAVOR DATA
// ─────────────────────────────────────────────
interface Flavor {
  id: string;
  title: string;
  subtitle: string;
  popImage: string;
  splashImage: string;
  bg: string;          // main background color
  bgEnd: string;       // gradient end color
  dotColor: string;    // nav dot accent
  titleColor: string;
  subtitleColor: string;
}

const FLAVORS: Flavor[] = [
  {
    id: "chocolate",
    title: "CHOCOLATE",
    subtitle: "dark · roasted · indulgent",
    popImage: "/images/chocolate-pop.png",
    splashImage: "/images/chocolate-splash.png",
    bg: "#2C1A0E",
    bgEnd: "#4A2C17",
    dotColor: "#D2691E",
    titleColor: "#F5DEB3",
    subtitleColor: "#C4A882",
  },
  {
    id: "strawberry",
    title: "STRAWBERRY",
    subtitle: "ripe · bright · sun-kissed",
    popImage: "/images/strawberry-pop.png",
    splashImage: "/images/strawberry-splash.png",
    bg: "#3D0B1A",
    bgEnd: "#7B2042",
    dotColor: "#FF6B8A",
    titleColor: "#FFD6E0",
    subtitleColor: "#F0A0B5",
  },
  {
    id: "vanilla",
    title: "VANILLA",
    subtitle: "soft · creamy · timeless",
    popImage: "/images/vanilla-pop.png",
    splashImage: "/images/vanilla-splash.png",
    bg: "#2A2014",
    bgEnd: "#4A3820",
    dotColor: "#F5E6C8",
    titleColor: "#FFF8EC",
    subtitleColor: "#D4C4A0",
  },
  {
    id: "pistachio",
    title: "PISTACHIO",
    subtitle: "earthy · aromatic · rare",
    popImage: "/images/pistachio-pop.png",
    splashImage: "/images/pistachio-splash.png",
    bg: "#0D1E14",
    bgEnd: "#1E3D28",
    dotColor: "#7EC89A",
    titleColor: "#D4EAD8",
    subtitleColor: "#9DC4A8",
  },
];

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export default function IceCreamHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Per-flavor refs
  const layerRefs = useRef<HTMLDivElement[]>([]);
  const popRefs = useRef<HTMLDivElement[]>([]);
  const splashRefs = useRef<HTMLDivElement[]>([]);
  const titleRefs = useRef<HTMLDivElement[]>([]);
  const subtitleRefs = useRef<HTMLDivElement[]>([]);

  const [activeFlavor, setActiveFlavor] = useState(0);

  // Assign ref arrays
  const setLayerRef = (el: HTMLDivElement | null, i: number) => {
    if (el) layerRefs.current[i] = el;
  };
  const setPopRef = (el: HTMLDivElement | null, i: number) => {
    if (el) popRefs.current[i] = el;
  };
  const setSplashRef = (el: HTMLDivElement | null, i: number) => {
    if (el) splashRefs.current[i] = el;
  };
  const setTitleRef = (el: HTMLDivElement | null, i: number) => {
    if (el) titleRefs.current[i] = el;
  };
  const setSubtitleRef = (el: HTMLDivElement | null, i: number) => {
    if (el) subtitleRefs.current[i] = el;
  };

  useGSAP(
    () => {
      const container = containerRef.current;
      const pinner = pinnerRef.current;
      const bg = bgRef.current;
      if (!container || !pinner || !bg) return;

      const total = FLAVORS.length;

      // ── Initial state for all layers ──────────────────────────────────
      FLAVORS.forEach((flavor, i) => {
        const isFirst = i === 0;

        // Layer visibility
        gsap.set(layerRefs.current[i], {
          autoAlpha: isFirst ? 1 : 0,
          position: "absolute",
          inset: 0,
        });

        // Popsicle: 3D entry state
        gsap.set(popRefs.current[i], {
          scale: 0.68,
          y: 90,
          x: -12,
          rotateX: 18,
          rotateZ: -8,
          opacity: isFirst ? 0 : 0,
          transformOrigin: "center bottom",
          transformPerspective: 900,
        });

        // Splash: waiting below
        gsap.set(splashRefs.current[i], {
          scale: 0.85,
          scaleX: 0.75,
          y: 40,
          opacity: isFirst ? 0 : 0,
          filter: "blur(4px)",
          transformOrigin: "center bottom",
        });

        // Title/Subtitle hidden
        gsap.set([titleRefs.current[i], subtitleRefs.current[i]], {
          opacity: 0,
          y: isFirst ? 14 : 14,
        });
      });

      // ── Background gradient color ──────────────────────────────────────
      gsap.set(bg, { backgroundColor: FLAVORS[0].bg });

      // ── Build master timeline for each flavor ─────────────────────────
      const scrollHeight = pinner.scrollHeight || window.innerHeight * (total + 1);

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: `+=${window.innerHeight * (total - 1)}`,
          pin: pinner,
          scrub: 0.45,
          snap: {
            snapTo: 1 / (total - 1),
            duration: { min: 0.25, max: 0.6 },
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            const rawIndex = self.progress * (total - 1);
            const newActive = Math.round(rawIndex);
            if (newActive !== activeFlavor) {
              setActiveFlavor(newActive);
            }
          },
        },
      });

      // ── Animate flavor 0 intro (happens at scroll start) ──────────────
      const introTl = gsap.timeline();
      introTl
        .to(popRefs.current[0], {
          scale: 1,
          y: 0,
          x: 0,
          rotateX: 0,
          rotateZ: 0,
          opacity: 1,
          duration: 1.1,
          ease: "back.out(1.3)",
        })
        .to(
          splashRefs.current[0],
          {
            scale: 1,
            scaleX: 1,
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.7"
        )
        .to(
          [titleRefs.current[0], subtitleRefs.current[0]],
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.5"
        );

      // Run intro once on mount
      introTl.play();

      // ── Float loop for active popsicle ────────────────────────────────
      // We'll apply this post-reveal via ScrollTrigger callbacks
      const floatLoops: gsap.core.Tween[] = [];

      FLAVORS.forEach((_, i) => {
        const floatTween = gsap.to(popRefs.current[i], {
          y: "-=10",
          duration: 2.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          paused: true,
        });
        floatLoops.push(floatTween);
      });

      // Start float for first flavor
      floatLoops[0].play();

      // ── Transition between flavors ────────────────────────────────────
      for (let i = 0; i < total - 1; i++) {
        const segDur = 1 / (total - 1); // each segment = fraction of timeline

        const exitTl = gsap.timeline();

        // EXIT: current flavor
        exitTl
          .to(
            [titleRefs.current[i], subtitleRefs.current[i]],
            { opacity: 0, y: -10, duration: 0.25, ease: "power2.in" },
            0
          )
          .to(
            popRefs.current[i],
            {
              scale: 0.82,
              y: -30,
              opacity: 0,
              rotateZ: 4,
              duration: 0.35,
              ease: "power2.in",
            },
            0.05
          )
          .to(
            splashRefs.current[i],
            {
              scaleX: 0.7,
              y: 25,
              opacity: 0,
              filter: "blur(5px)",
              duration: 0.3,
              ease: "power2.in",
            },
            0.05
          )
          .to(
            layerRefs.current[i],
            { autoAlpha: 0, duration: 0.2, ease: "none" },
            0.3
          );

        // ENTER: next flavor
        const enterTl = gsap.timeline();
        enterTl
          .set(layerRefs.current[i + 1], { autoAlpha: 1 })
          .fromTo(
            popRefs.current[i + 1],
            { scale: 0.68, y: 90, x: -12, rotateX: 18, rotateZ: -8, opacity: 0 },
            {
              scale: 1,
              y: 0,
              x: 0,
              rotateX: 0,
              rotateZ: 0,
              opacity: 1,
              duration: 0.55,
              ease: "back.out(1.4)",
            }
          )
          .fromTo(
            splashRefs.current[i + 1],
            { scale: 0.82, scaleX: 0.72, y: 35, opacity: 0, filter: "blur(5px)" },
            {
              scale: 1,
              scaleX: 1,
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.45,
              ease: "power3.out",
            },
            "-=0.35"
          )
          .fromTo(
            [titleRefs.current[i + 1], subtitleRefs.current[i + 1]],
            { opacity: 0, y: 14 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.1,
              duration: 0.35,
              ease: "power2.out",
            },
            "-=0.25"
          );

        // Background color transition
        const bgTransTl = gsap.timeline();
        bgTransTl.to(bg, {
          backgroundColor: FLAVORS[i + 1].bg,
          duration: 0.5,
          ease: "power1.inOut",
        });

        // Stop float on exit, start on enter
        const stopIdx = i;
        const startIdx = i + 1;

        // Add to master with position
        masterTl.add(exitTl, i * segDur);
        masterTl.add(bgTransTl, i * segDur + segDur * 0.25);
        masterTl.add(enterTl, i * segDur + segDur * 0.35);

        // Float management via callbacks
        ScrollTrigger.create({
          trigger: container,
          start: `top+=${window.innerHeight * (i + 0.6)} top`,
          end: `top+=${window.innerHeight * (i + 1.1)} top`,
          onEnter: () => {
            floatLoops[stopIdx].pause();
            floatLoops[startIdx].play();
          },
          onLeaveBack: () => {
            floatLoops[startIdx].pause();
            gsap.set(popRefs.current[startIdx], { y: 0 });
            floatLoops[stopIdx].play();
          },
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <>
      {/* ── Google Fonts ─────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Space+Mono:wght@400&display=swap');

        .ice-hero * { box-sizing: border-box; margin: 0; padding: 0; }

        .ice-hero {
          position: relative;
          width: 100%;
        }

        .ice-hero__pinner {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        /* Background */
        .ice-hero__bg {
          position: absolute;
          inset: 0;
          transition: none;
        }

        /* Gradient radial glow */
        .ice-hero__bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 70%, rgba(255,255,255,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Grain texture overlay */
        .ice-hero__grain {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          opacity: 0.045;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 180px 180px;
          mix-blend-mode: overlay;
        }

        /* Flavor layer — full viewport, absolute stacked */
        .ice-hero__layer {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          z-index: 3;
        }

        /* Title */
        .ice-hero__title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(3rem, 9vw, 8rem);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          line-height: 1;
          margin-top: clamp(28px, 6vh, 60px);
          text-align: center;
          will-change: opacity, transform;
          padding: 0 1rem;
        }

        /* Subtitle */
        .ice-hero__subtitle {
          font-family: 'Space Mono', monospace;
          font-weight: 400;
          font-size: clamp(0.55rem, 1.1vw, 0.78rem);
          letter-spacing: 0.38em;
          text-transform: lowercase;
          margin-top: 10px;
          text-align: center;
          will-change: opacity, transform;
          opacity: 0.7;
        }

        /* Popsicle wrapper */
        .ice-hero__pop-wrap {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -54%);
          width: clamp(180px, 26vw, 340px);
          z-index: 10;
          will-change: transform, opacity;
        }

        .ice-hero__pop-wrap img {
          width: 100%;
          height: auto;
          display: block;
          filter: drop-shadow(0 24px 48px rgba(0,0,0,0.55)) drop-shadow(0 6px 16px rgba(0,0,0,0.3));
        }

        /* Splash wrapper */
        .ice-hero__splash-wrap {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: clamp(280px, 72vw, 820px);
          z-index: 8;
          will-change: transform, opacity, filter;
        }

        .ice-hero__splash-wrap img {
          width: 100%;
          height: auto;
          display: block;
        }

        /* Glossy highlight sweep on splash */
        .ice-hero__splash-wrap::after {
          content: '';
          position: absolute;
          top: 0; left: -40%;
          width: 30%;
          height: 100%;
          background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.09) 50%, transparent 100%);
          animation: splashGloss 4.5s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes splashGloss {
          0%   { left: -40%; opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { left: 110%; opacity: 0; }
        }

        /* Navigation dots */
        .ice-hero__dots {
          position: absolute;
          right: clamp(14px, 3vw, 36px);
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
        }

        .ice-hero__dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255,255,255,0.25);
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255,255,255,0.15);
        }

        .ice-hero__dot.is-active {
          transform: scale(1.55);
          background: rgba(255,255,255,0.9);
          border-color: rgba(255,255,255,0.6);
          box-shadow: 0 0 10px rgba(255,255,255,0.35);
        }

        /* Bottom fade vignette */
        .ice-hero__vignette {
          position: absolute;
          inset: 0;
          z-index: 6;
          pointer-events: none;
          background:
            radial-gradient(ellipse 100% 50% at 50% 100%, rgba(0,0,0,0.45) 0%, transparent 70%),
            radial-gradient(ellipse 120% 30% at 50% 0%, rgba(0,0,0,0.18) 0%, transparent 60%);
        }

        @media (max-width: 640px) {
          .ice-hero__pop-wrap {
            top: 48%;
          }
          .ice-hero__splash-wrap {
            width: 92vw;
          }
          .ice-hero__subtitle {
            letter-spacing: 0.22em;
            font-size: 0.6rem;
          }
        }
      `}</style>

      {/* ── Scroll Container ──────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="ice-hero"
        style={{ height: `${FLAVORS.length * 100}vh` }}
      >
        {/* ── Pinned Viewport ───────────────────────────────────── */}
        <div ref={pinnerRef} className="ice-hero__pinner">

          {/* Background color layer */}
          <div ref={bgRef} className="ice-hero__bg" />

          {/* Grain texture */}
          <div className="ice-hero__grain" />

          {/* Vignette depth */}
          <div className="ice-hero__vignette" />

          {/* ── Flavor Layers ─────────────────────────────────── */}
          {FLAVORS.map((flavor, i) => (
            <div
              key={flavor.id}
              ref={(el) => setLayerRef(el, i)}
              className="ice-hero__layer"
            >
              {/* Title */}
              <div
                ref={(el) => setTitleRef(el, i)}
                className="ice-hero__title"
                style={{ color: flavor.titleColor }}
              >
                {flavor.title}
              </div>

              {/* Subtitle */}
              <div
                ref={(el) => setSubtitleRef(el, i)}
                className="ice-hero__subtitle"
                style={{ color: flavor.subtitleColor }}
              >
                {flavor.subtitle}
              </div>

              {/* Splash (behind pop) */}
              <div
                ref={(el) => setSplashRef(el, i)}
                className="ice-hero__splash-wrap"
              >
                <Image
                  src={flavor.splashImage}
                  alt={`${flavor.title} cream splash`}
                  width={820}
                  height={460}
                  priority={i === 0}
                  style={{ objectFit: "contain" }}
                />
              </div>

              {/* Popsicle (in front) */}
              <div
                ref={(el) => setPopRef(el, i)}
                className="ice-hero__pop-wrap"
              >
                <Image
                  src={flavor.popImage}
                  alt={`${flavor.title} popsicle`}
                  width={340}
                  height={520}
                  priority={i === 0}
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          ))}

          {/* ── Nav Dots ──────────────────────────────────────── */}
          <div className="ice-hero__dots">
            {FLAVORS.map((_, i) => (
              <div
                key={i}
                className={`ice-hero__dot${activeFlavor === i ? " is-active" : ""}`}
                onClick={() => {
                  const container = containerRef.current;
                  if (!container) return;
                  const target =
                    container.getBoundingClientRect().top +
                    window.scrollY +
                    window.innerHeight * i;
                  window.scrollTo({ top: target, behavior: "smooth" });
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
                       }
                
