
"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type Flavor = {
  id: string;
  title: string;
  subtitle: string;
  bg: string;
  textHex: string;
  pop: string;
  splash: string;
};

const FLAVORS: Flavor[] = [
  {
    id: "chocolate",
    title: "CHOCOLATE",
    subtitle: "Rich · Smooth · Bold",
    bg: "#F2C94C",
    textHex: "#4A2311",
    pop: "/images/chocolate-pop.png",
    splash: "/images/chocolate-splash.png",
  },
  {
    id: "strawberry",
    title: "STRAWBERRY",
    subtitle: "Fresh · Sweet · Bright",
    bg: "#00FFFF",
    textHex: "#E91E63",
    pop: "/images/strawberry-pop.png",
    splash: "/images/strawberry-splash.png",
  },
  {
    id: "vanilla",
    title: "VANILLA",
    subtitle: "Soft · Creamy · Classic",
    bg: "#3E2723",
    textHex: "#FFF3E0",
    pop: "/images/vanilla-pop.png",
    splash: "/images/vanilla-splash.png",
  },
  {
    id: "pistachio",
    title: "PISTACHIO",
    subtitle: "Nutty · Fresh · Smooth",
    bg: "#A5D6A7",
    textHex: "#1B5E20",
    pop: "/images/pistachio-pop.png",
    splash: "/images/pistachio-splash.png",
  },
];

export default function HeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);

  useGSAP(
    () => {
      const total = FLAVORS.length - 1;

      gsap.set(bgRef.current, { backgroundColor: FLAVORS[0].bg });

      FLAVORS.forEach((_, i) => {
        gsap.set(`.hs-text-${i}`, {
          opacity: i === 0 ? 1 : 0,
          y: i === 0 ? 0 : 42,
        });

        gsap.set(`.hs-pop-${i}`, {
          opacity: i === 0 ? 1 : 0,
          y: i === 0 ? 0 : 80,
          x: i === 0 ? 0 : -10,
          scale: i === 0 ? 1 : 0.7,
          rotateX: i === 0 ? 0 : 18,
          rotateZ: i === 0 ? 0 : -8,
          transformPerspective: 1400,
          transformOrigin: "50% 50%",
        });

        gsap.set(`.hs-splash-${i}`, {
          opacity: i === 0 ? 1 : 0,
          y: i === 0 ? 0 : 72,
          scaleX: i === 0 ? 1 : 0.95,
          scaleY: i === 0 ? 1 : 0.94,
        });

        gsap.set(`.hs-wave-${i}`, {
          opacity: i === 0 ? 1 : 0,
          y: i === 0 ? 0 : 80,
          scaleX: i === 0 ? 1 : 0.92,
          scaleY: i === 0 ? 1 : 0.9,
        });

        gsap.set(`.hs-shadow-${i}`, {
          opacity: i === 0 ? 0.2 : 0,
          scale: i === 0 ? 1 : 0.82,
          y: i === 0 ? 0 : 24,
        });
      });

      gsap.to(".hs-pop-float", {
        y: -12,
        x: 6,
        rotation: 1.1,
        duration: 3.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.14,
      });

      gsap.to(".hs-splash-float", {
        y: -8,
        scaleX: 1.02,
        scaleY: 1.01,
        duration: 4.4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.14,
      });

      gsap.to(".hs-wave-float", {
        y: -6,
        scaleX: 1.02,
        scaleY: 1.01,
        duration: 4.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.14,
      });

      gsap.to(".hs-sheen", {
        xPercent: 260,
        duration: 4.8,
        repeat: -1,
        ease: "none",
        stagger: 0.15,
      });

      gsap.to(".hs-particle", {
        y: -8,
        opacity: 0.9,
        duration: 2.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.08,
      });

      function animateIn(index: number) {
        if (activeRef.current === index) return;

        const prev = activeRef.current;
        activeRef.current = index;

        const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

        tl.to(
          bgRef.current,
          {
            backgroundColor: FLAVORS[index].bg,
            duration: 0.9,
            ease: "power2.inOut",
          },
          0
        );

        tl.to(
          `.hs-text-${prev}`,
          { opacity: 0, y: -18, duration: 0.24, ease: "power2.out" },
          0
        );
        tl.to(
          `.hs-pop-${prev}`,
          { opacity: 0, y: -24, scale: 0.9, rotateX: 14, rotateZ: -6, duration: 0.24, ease: "power2.out" },
          0
        );
        tl.to(
          `.hs-splash-${prev}`,
          { opacity: 0, y: -12, scaleX: 0.96, scaleY: 0.94, duration: 0.22, ease: "power2.out" },
          0
        );
        tl.to(
          `.hs-wave-${prev}`,
          { opacity: 0, y: -14, scaleX: 0.96, scaleY: 0.94, duration: 0.22, ease: "power2.out" },
          0
        );

        tl.fromTo(
          `.hs-text-${index}`,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.52, ease: "power4.out" },
          0.08
        );

        tl.fromTo(
          `.hs-wave-${index}`,
          {
            opacity: 0,
            y: 92,
            scaleX: 0.9,
            scaleY: 0.88,
            filter: "blur(12px)",
          },
          {
            opacity: 1,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            filter: "blur(0px)",
            duration: 0.72,
            ease: "expo.out",
          },
          0.12
        );

        tl.fromTo(
          `.hs-splash-${index}`,
          {
            opacity: 0,
            y: 78,
            scaleX: 0.94,
            scaleY: 0.92,
            filter: "blur(10px)",
          },
          {
            opacity: 1,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            filter: "blur(0px)",
            duration: 0.75,
            ease: "expo.out",
          },
          0.16
        );

        tl.fromTo(
          `.hs-shadow-${index}`,
          { opacity: 0, y: 28, scale: 0.82 },
          { opacity: 0.24, y: 0, scale: 1, duration: 0.5, ease: "power2.out" },
          0.24
        );

        tl.fromTo(
          `.hs-pop-${index}`,
          {
            opacity: 0,
            y: 80,
            x: -10,
            scale: 0.7,
            rotateX: 18,
            rotateZ: -8,
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            rotateX: 0,
            rotateZ: 0,
            duration: 0.92,
            ease: "power3.out",
          },
          0.2
        );

        tl.to(
          `.hs-pop-${index}`,
          { y: -4, duration: 0.14, ease: "power2.out" },
          ">-0.02"
        );

        tl.to(
          `.hs-pop-${index}`,
          { y: 0, duration: 0.24, ease: "bounce.out" },
          ">"
        );

        tl.to(
          `.hs-wave-${index}`,
          {
            scaleX: 1.04,
            scaleY: 0.96,
            y: -4,
            duration: 0.16,
            ease: "power2.out",
          },
          0.48
        );

        tl.to(
          `.hs-wave-${index}`,
          {
            scaleX: 1,
            scaleY: 1,
            y: 0,
            duration: 0.34,
            ease: "elastic.out(1, 0.55)",
          },
          0.62
        );
      }

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${total * 110}%`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        snap: {
          snapTo: 1 / total,
          duration: { min: 0.22, max: 0.48 },
          delay: 0,
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
          const index = Math.round(self.progress * total);
          animateIn(index);
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <>
      <style jsx global>{`
        .ice-hero-shell {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          touch-action: pan-y;
          -webkit-tap-highlight-color: transparent;
          perspective: 1500px;
          transform-style: preserve-3d;
        }

        .ice-hero-text {
          position: absolute;
          top: 7%;
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
          pointer-events: none;
          will-change: transform, opacity;
        }

        .ice-hero-pop {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translateX(-50%);
          z-index: 30;
          width: min(82vw, 580px);
          height: min(76vh, 780px);
          will-change: transform, opacity;
          transform-style: preserve-3d;
        }

        .ice-hero-splash {
          position: absolute;
          left: 50%;
          bottom: -2%;
          width: 112%;
          height: 40vh;
          transform: translateX(-50%);
          z-index: 15;
          pointer-events: none;
          will-change: transform, opacity;
          overflow: visible;
        }

        .ice-hero-wave {
          position: absolute;
          left: 50%;
          bottom: 4%;
          width: min(110vw, 980px);
          height: 34vh;
          transform: translateX(-50%);
          z-index: 14;
          pointer-events: none;
          will-change: transform, opacity;
          overflow: visible;
        }

        .ice-hero-shadow {
          position: absolute;
          left: 50%;
          bottom: 18%;
          width: min(48vw, 360px);
          height: 72px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(
            ellipse at center,
            rgba(0, 0, 0, 0.28) 0%,
            rgba(0, 0, 0, 0.16) 30%,
            rgba(0, 0, 0, 0.08) 56%,
            transparent 72%
          );
          filter: blur(18px);
          z-index: 18;
          pointer-events: none;
          will-change: transform, opacity;
        }

        .ice-hero-float {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }

        .ice-glow {
          position: absolute;
          inset: 12% 18%;
          border-radius: 50%;
          filter: blur(64px);
          background: rgba(255, 255, 255, 0.24);
          opacity: 0.8;
          z-index: 0;
        }

        .ice-particle {
          position: absolute;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.25);
          filter: blur(1px);
          opacity: 0.55;
        }

        .hs-sheen {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            110deg,
            transparent 35%,
            rgba(255, 255, 255, 0.62) 50%,
            transparent 65%
          );
          mix-blend-mode: screen;
          opacity: 0.35;
          transform: translateX(-160%);
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .ice-hero-text {
            top: 6%;
          }

          .ice-hero-pop {
            top: 52%;
            width: min(92vw, 430px);
            height: min(60vh, 560px);
          }

          .ice-hero-splash {
            width: 118%;
            height: 32vh;
            bottom: 0;
          }

          .ice-hero-wave {
            width: 100vw;
            height: 24vh;
            bottom: 6%;
          }

          .ice-hero-shadow {
            width: 60vw;
            bottom: 19%;
          }
        }

        @media (max-width: 420px) {
          .ice-hero-pop {
            top: 53%;
            width: 92vw;
            height: 56vh;
          }

          .ice-hero-splash {
            height: 28vh;
          }

          .ice-hero-wave {
            height: 22vh;
          }

          .ice-hero-shadow {
            width: 66vw;
            bottom: 20%;
          }
        }
      `}</style>

      <div ref={containerRef} className="ice-hero-shell">
        <div ref={bgRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />

        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.18), transparent 58%), linear-gradient(to top, rgba(255,255,255,0.18), transparent 32%)",
            mixBlendMode: "soft-light",
          }}
        />

        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            opacity: 0.18,
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'300\' height=\'300\' filter=\'url(%23n)\' opacity=\'0.07\'/%3E%3C/svg%3E")',
            backgroundSize: "300px 300px",
            mixBlendMode: "overlay",
          }}
        />

        {FLAVORS.map((flavor, i) => (
          <section key={flavor.id} style={{ position: "absolute", inset: 0, zIndex: 2 }}>
            <div className={`hs-text-${i} ice-hero-text`}>
              <p
                style={{
                  margin: 0,
                  fontFamily: "monospace",
                  fontSize: 10,
                  letterSpacing: "0.34em",
                  textTransform: "uppercase",
                  color: flavor.textHex,
                  opacity: 0.72,
                }}
              >
                Ice Cream Store
              </p>

              <h1
                style={{
                  fontSize: "clamp(44px, 10vw, 132px)",
                  fontWeight: 900,
                  letterSpacing: "-0.05em",
                  lineHeight: 0.95,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  background: `linear-gradient(to bottom, transparent 0%, ${flavor.textHex} 72%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  margin: "10px 0 0",
                  userSelect: "none",
                  textAlign: "center",
                }}
              >
                {flavor.title}
              </h1>

              <p
                style={{
                  marginTop: 12,
                  fontFamily: "monospace",
                  fontSize: 11,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: flavor.textHex,
                  opacity: 0.66,
                }}
              >
                {flavor.subtitle}
              </p>
            </div>

            <div className={`hs-shadow-${i} ice-hero-shadow`} />

            <div className={`hs-wave-${i} ice-hero-wave`}>
              <div className="hs-wave-float ice-hero-float">
                <svg
                  viewBox="0 0 900 320"
                  preserveAspectRatio="none"
                  style={{ width: "100%", height: "100%", overflow: "visible" }}
                >
                  <defs>
                    <linearGradient id={`cream-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.98)" />
                      <stop offset="45%" stopColor="rgba(255,255,255,0.82)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
                    </linearGradient>

                    <filter id={`goo-${i}`}>
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feColorMatrix
                        in="blur"
                        mode="matrix"
                        values="
                          1 0 0 0 0
                          0 1 0 0 0
                          0 0 1 0 0
                          0 0 0 22 -10"
                        result="goo"
                      />
                    </filter>
                  </defs>

                  <g filter={`url(#goo-${i})`}>
                    <path
                      d="
                        M0 190
                        C120 130 180 250 300 185
                        C410 120 510 250 620 180
                        C720 120 820 220 900 170
                        L900 320
                        L0 320
                        Z
                      "
                      fill={`url(#cream-${i})`}
                    />
                    <circle cx="180" cy="180" r="42" fill="rgba(255,255,255,0.82)" />
                    <circle cx="360" cy="170" r="55" fill="rgba(255,255,255,0.72)" />
                    <circle cx="560" cy="178" r="44" fill="rgba(255,255,255,0.75)" />
                    <circle cx="760" cy="168" r="52" fill="rgba(255,255,255,0.78)" />
                  </g>
                </svg>

                <div className="hs-sheen" />
              </div>
            </div>

            <div className={`hs-splash-${i} ice-hero-splash`}>
              <div className="hs-splash-float ice-hero-float">
                <Image
                  src={flavor.splash}
                  alt={`${flavor.title} splash`}
                  fill
                  className="object-cover object-bottom"
                  style={{
                    opacity: 1,
                    objectPosition: "center bottom",
                    filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.12))",
                  }}
                />
              </div>
            </div>

            <div className={`hs-pop-${i} ice-hero-pop`}>
              <div className="hs-pop-float ice-hero-float">
                <div className="ice-glow" />
                <Image
                  src={flavor.pop}
                  alt={flavor.title}
                  fill
                  priority={i === 0}
                  className="object-contain object-center"
                  style={{
                    filter: "drop-shadow(0 26px 54px rgba(0,0,0,0.22))",
                    zIndex: 2,
                  }}
                />
              </div>
            </div>

            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 15,
                pointerEvents: "none",
              }}
            >
              {Array.from({ length: 8 }).map((_, p) => (
                <span
                  key={p}
                  className="hs-particle"
                  style={{
                    position: "absolute",
                    width: 8 + p * 1.5,
                    height: 8 + p * 1.5,
                    borderRadius: "50%",
                    left: `${10 + p * 11}%`,
                    top: `${16 + (p % 4) * 10}%`,
                  }}
                />
              ))}
            </div>
          </section>
        ))}

        <div
          style={{
            position: "absolute",
            right: 18,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            zIndex: 50,
          }}
        >
          {FLAVORS.map((_, i) => (
            <div
              key={i}
              className={`nav-dot nav-dot-${i}`}
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                border: "1.4px solid rgba(0,0,0,0.35)",
                backgroundColor: i === 0 ? "rgba(0,0,0,0.58)" : "transparent",
                transition: "background-color 0.2s ease",
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
                  }
