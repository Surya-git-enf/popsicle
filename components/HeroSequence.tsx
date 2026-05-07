
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
          y: i === 0 ? 0 : 40,
        });

        gsap.set(`.hs-pop-${i}`, {
          opacity: i === 0 ? 1 : 0,
          y: i === 0 ? 0 : 80,
          x: i === 0 ? 0 : -10,
          scale: i === 0 ? 1 : 0.7,
          rotateX: i === 0 ? 0 : 18,
          rotateZ: i === 0 ? 0 : -8,
          transformPerspective: 1200,
          transformOrigin: "50% 50%",
        });

        gsap.set(`.hs-splash-${i}`, {
          opacity: i === 0 ? 1 : 0,
          y: i === 0 ? 0 : 70,
          scaleX: i === 0 ? 1 : 0.96,
          scaleY: i === 0 ? 1 : 0.94,
        });

        gsap.set(`.hs-wave-${i}`, {
          opacity: i === 0 ? 1 : 0,
          y: i === 0 ? 0 : 50,
          scaleX: i === 0 ? 1 : 0.96,
          scaleY: i === 0 ? 1 : 0.94,
        });

        gsap.set(`.hs-shadow-${i}`, {
          opacity: i === 0 ? 0.18 : 0,
          scale: i === 0 ? 1 : 0.8,
          y: i === 0 ? 0 : 30,
        });

        gsap.set(`.hs-bgword-${i}`, {
          opacity: i === 0 ? 0.14 : 0,
          y: i === 0 ? 0 : 20,
          x: i === 0 ? 0 : -12,
          scale: i === 0 ? 1 : 0.98,
        });
      });

      gsap.to(".hs-pop-float", {
        y: -10,
        rotation: 0.9,
        duration: 3.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.15,
      });

      gsap.to(".hs-pop-float", {
        x: 6,
        duration: 4.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.15,
      });

      gsap.to(".hs-splash-float", {
        y: -7,
        scaleX: 1.02,
        scaleY: 1.01,
        duration: 4.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.15,
      });

      gsap.to(".hs-wave-float", {
        y: -6,
        scaleX: 1.02,
        scaleY: 1.01,
        duration: 4.6,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.15,
      });

      gsap.to(".hs-sheen", {
        xPercent: 240,
        duration: 4.2,
        repeat: -1,
        ease: "none",
        stagger: 0.18,
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
            duration: 0.85,
            ease: "power2.inOut",
          },
          0
        );

        tl.to(
          `.hs-text-${prev}`,
          { opacity: 0, y: -18, duration: 0.28, ease: "power2.inOut" },
          0
        );
        tl.to(
          `.hs-pop-${prev}`,
          {
            opacity: 0,
            y: -28,
            scale: 0.9,
            rotateX: 14,
            rotateZ: -6,
            duration: 0.28,
            ease: "power2.inOut",
          },
          0
        );
        tl.to(
          `.hs-splash-${prev}`,
          { opacity: 0, y: -14, scaleX: 0.96, scaleY: 0.94, duration: 0.25, ease: "power2.inOut" },
          0
        );
        tl.to(
          `.hs-wave-${prev}`,
          { opacity: 0, y: -12, scaleX: 0.96, scaleY: 0.94, duration: 0.25, ease: "power2.inOut" },
          0
        );
        tl.to(
          `.hs-bgword-${prev}`,
          { opacity: 0, y: -10, scale: 0.98, duration: 0.25, ease: "power2.inOut" },
          0
        );

        tl.fromTo(
          `.hs-text-${index}`,
          { opacity: 0, y: 34 },
          { opacity: 1, y: 0, duration: 0.62, ease: "power4.out" },
          0.1
        );

        tl.fromTo(
          `.hs-bgword-${index}`,
          { opacity: 0, y: 18, x: -14, scale: 0.98 },
          { opacity: 0.14, y: 0, x: 0, scale: 1, duration: 0.6, ease: "power3.out" },
          0.1
        );

        tl.fromTo(
          `.hs-splash-${index}`,
          {
            opacity: 0,
            y: 60,
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
            duration: 0.7,
            ease: "power3.out",
          },
          0.18
        );

        tl.fromTo(
          `.hs-wave-${index}`,
          {
            opacity: 0,
            y: 72,
            scaleX: 0.93,
            scaleY: 0.9,
            filter: "blur(8px)",
          },
          {
            opacity: 1,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            filter: "blur(0px)",
            duration: 0.72,
            ease: "power3.out",
          },
          0.2
        );

        tl.fromTo(
          `.hs-shadow-${index}`,
          { opacity: 0, y: 34, scale: 0.8 },
          { opacity: 0.22, y: 0, scale: 1, duration: 0.6, ease: "power2.out" },
          0.3
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
            duration: 0.9,
            ease: "power3.out",
          },
          0.24
        );

        tl.to(
          `.hs-pop-${index}`,
          { y: -3, duration: 0.12, ease: "power2.out" },
          ">-0.03"
        );
        tl.to(
          `.hs-pop-${index}`,
          { y: 0, duration: 0.2, ease: "bounce.out" },
          ">"
        );

        tl.to(
          `.hs-shadow-${index}`,
          { opacity: 0.28, scale: 1.04, duration: 0.18, ease: "power2.out" },
          0.45
        );

        tl.to(
          `.hs-wave-${index}`,
          { y: -5, scaleX: 1.03, scaleY: 0.99, duration: 0.2, ease: "power2.out" },
          0.45
        );

        tl.to(
          `.hs-wave-${index}`,
          { y: 0, scaleX: 1, scaleY: 1, duration: 0.28, ease: "sine.out" },
          0.64
        );

        gsap.to(".nav-dot", { backgroundColor: "transparent", duration: 0.2 });
        gsap.to(`.nav-dot-${index}`, {
          backgroundColor: "rgba(0,0,0,0.58)",
          duration: 0.2,
        });
      }

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${total * 120}%`,
        pin: true,
        scrub: 0.9,
        anticipatePin: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        snap: {
          snapTo: 1 / total,
          duration: { min: 0.3, max: 0.6 },
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
          perspective: 1400px;
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
          z-index: 20;
          width: min(82vw, 580px);
          height: min(74vh, 780px);
          will-change: transform, opacity;
          transform-style: preserve-3d;
        }

        .ice-hero-splash {
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1%;
          height: 38vh;
          z-index: 5;
          pointer-events: none;
          will-change: transform, opacity;
          overflow: hidden;
        }

        .ice-hero-wave {
          position: absolute;
          left: 50%;
          bottom: 5%;
          width: min(100vw, 820px);
          height: 28vh;
          transform: translateX(-50%);
          z-index: 14;
          pointer-events: none;
          will-change: transform, opacity;
        }

        .ice-hero-shadow {
          position: absolute;
          left: 50%;
          bottom: 18%;
          width: min(46vw, 360px);
          height: 70px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(
            ellipse at center,
            rgba(0, 0, 0, 0.28) 0%,
            rgba(0, 0, 0, 0.18) 32%,
            rgba(0, 0, 0, 0.08) 55%,
            transparent 72%
          );
          filter: blur(18px);
          z-index: 18;
          pointer-events: none;
          will-change: transform, opacity, filter;
        }

        .ice-hero-bgword {
          position: absolute;
          left: 50%;
          top: 54%;
          transform: translate(-50%, -50%);
          z-index: 8;
          pointer-events: none;
          user-select: none;
          white-space: nowrap;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 900;
          font-size: clamp(54px, 12vw, 180px);
          letter-spacing: -0.08em;
          line-height: 0.9;
          opacity: 0.14;
          mix-blend-mode: soft-light;
          filter: blur(0.2px);
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
            height: 32vh;
            bottom: 0;
          }

          .ice-hero-wave {
            width: 100vw;
            height: 24vh;
            bottom: 6%;
          }

          .ice-hero-shadow {
            width: 58vw;
            bottom: 19%;
          }

          .ice-hero-bgword {
            top: 56%;
            font-size: clamp(44px, 16vw, 120px);
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

          .ice-hero-bgword {
            top: 57%;
            font-size: clamp(40px, 18vw, 104px);
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
            <div
              className={`hs-bgword-${i} ice-hero-bgword`}
              style={{
                color: flavor.textHex,
              }}
            >
              {flavor.title}
            </div>

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
                Lickers
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

            <div className={`hs-wave-${i} ice-hero-wave`}>
              <div className="hs-wave-float ice-hero-float">
                <svg
                  viewBox="0 0 800 260"
                  preserveAspectRatio="none"
                  style={{ width: "100%", height: "100%", overflow: "visible" }}
                >
                  <defs>
                    <linearGradient id={`wave-grad-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.92)" />
                      <stop offset="55%" stopColor="rgba(255,255,255,0.68)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.24)" />
                    </linearGradient>
                    <linearGradient id={`sheen-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                      <stop offset="48%" stopColor="rgba(255,255,255,0.55)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>
                    <filter id={`wave-blur-${i}`}>
                      <feGaussianBlur stdDeviation="2.8" />
                    </filter>
                  </defs>

                  <path
                    d="M0,132 C72,88 146,182 220,138 C300,92 370,178 448,136 C528,95 598,182 676,140 C735,108 770,98 800,116 L800,260 L0,260 Z"
                    fill={`url(#wave-grad-${i})`}
                    filter={`url(#wave-blur-${i})`}
                    opacity="0.95"
                  />
                  <path
                    d="M0,140 C72,94 146,186 220,144 C300,98 370,182 448,142 C528,99 598,184 676,146 C735,114 770,104 800,122 L800,260 L0,260 Z"
                    fill="rgba(255,255,255,0.16)"
                  />
                  <rect
                    x="0"
                    y="112"
                    width="800"
                    height="48"
                    fill={`url(#sheen-grad-${i})`}
                    opacity="0.45"
                  />
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
                
