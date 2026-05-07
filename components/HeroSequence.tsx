
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
  year: string;
  bg: string;
  textHex: string;
  pop: string;
  splash: string;
  accent: string;
};

const FLAVORS: Flavor[] = [
  {
    id: "chocolate",
    title: "CHOCOLATE",
    subtitle: "Rich, smooth and bold",
    year: "May 1, 2026",
    bg: "#EBCB67",
    textHex: "#4A2311",
    pop: "/images/chocolate-pop.png",
    splash: "/images/chocolate-splash.png",
    accent: "rgba(74,35,17,0.16)",
  },
  {
    id: "strawberry",
    title: "STRAWBERRY",
    subtitle: "Fresh, bright and sweet",
    year: "Apr 25, 2026",
    bg: "#F7B8C8",
    textHex: "#C2185B",
    pop: "/images/strawberry-pop.png",
    splash: "/images/strawberry-splash.png",
    accent: "rgba(194,24,91,0.16)",
  },
  {
    id: "vanilla",
    title: "VANILLA",
    subtitle: "Soft, clean and classic",
    year: "Apr 23, 2026",
    bg: "#D8C7AE",
    textHex: "#3E2723",
    pop: "/images/vanilla-pop.png",
    splash: "/images/vanilla-splash.png",
    accent: "rgba(62,39,35,0.14)",
  },
  {
    id: "pistachio",
    title: "PISTACHIO",
    subtitle: "Nutty, fresh and premium",
    year: "Apr 18, 2026",
    bg: "#C9D98E",
    textHex: "#1B5E20",
    pop: "/images/pistachio-pop.png",
    splash: "/images/pistachio-splash.png",
    accent: "rgba(27,94,32,0.14)",
  },
];

export default function HeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);

  useGSAP(
    () => {
      const total = FLAVORS.length - 1;

      gsap.set(bgRef.current, { backgroundColor: FLAVORS[0].bg });

      FLAVORS.forEach((_, i) => {
        gsap.set(`.hero-text-${i}`, {
          opacity: i === 0 ? 1 : 0,
          y: i === 0 ? 0 : 50,
        });

        gsap.set(`.hero-card-${i}`, {
          opacity: i === 0 ? 1 : 0,
          y: i === 0 ? 0 : 80,
          scale: i === 0 ? 1 : 0.94,
          rotateX: i === 0 ? 0 : 10,
          rotateY: i === 0 ? 0 : -8,
        });

        gsap.set(`.hero-splash-${i}`, {
          opacity: i === 0 ? 1 : 0,
          y: i === 0 ? 0 : 30,
          scale: i === 0 ? 1 : 0.98,
        });
      });

      gsap.to(".float-pop", {
        y: -14,
        rotation: 1.2,
        duration: 2.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.2,
      });

      gsap.to(".float-splash", {
        y: 8,
        scale: 1.02,
        duration: 3.6,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.2,
      });

      gsap.to(".float-particle", {
        y: -12,
        opacity: 0.9,
        duration: 2.6,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.1,
      });

      function animateTo(index: number) {
        if (activeRef.current === index) return;

        const prev = activeRef.current;
        activeRef.current = index;

        const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

        tl.to(
          bgRef.current,
          {
            backgroundColor: FLAVORS[index].bg,
            duration: 1,
            ease: "power2.inOut",
          },
          0
        );

        tl.to(
          `.hero-text-${prev}`,
          { opacity: 0, y: -30, duration: 0.4, ease: "power2.inOut" },
          0
        );
        tl.to(
          `.hero-card-${prev}`,
          { opacity: 0, y: -50, scale: 0.92, rotateX: 12, rotateY: -10, duration: 0.45, ease: "power2.inOut" },
          0
        );
        tl.to(
          `.hero-splash-${prev}`,
          { opacity: 0, y: -20, scale: 0.96, duration: 0.35, ease: "power2.inOut" },
          0
        );

        tl.fromTo(
          `.hero-text-${index}`,
          { opacity: 0, y: 44 },
          { opacity: 1, y: 0, duration: 0.85, ease: "power4.out" },
          0.18
        );
        tl.fromTo(
          `.hero-card-${index}`,
          { opacity: 0, y: 72, scale: 0.92, rotateX: 10, rotateY: -8 },
          { opacity: 1, y: 0, scale: 1, rotateX: 0, rotateY: 0, duration: 1.1, ease: "expo.out" },
          0.14
        );
        tl.fromTo(
          `.hero-splash-${index}`,
          { opacity: 0, y: 20, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.95, ease: "power3.out" },
          0.22
        );

        gsap.to(".dot", { backgroundColor: "transparent", duration: 0.25 });
        gsap.to(`.dot-${index}`, {
          backgroundColor: "rgba(0,0,0,0.58)",
          duration: 0.25,
        });
      }

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${total * 120}%`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        snap: {
          snapTo: 1 / total,
          duration: { min: 0.45, max: 0.9 },
          delay: 0.03,
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
          const index = Math.round(self.progress * total);
          animateTo(index);

          if (stageRef.current) {
            const shift = -self.progress * 40;
            gsap.set(stageRef.current, {
              xPercent: shift,
            });
          }
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <>
      <style jsx global>{`
        .ice-shell {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          perspective: 1400px;
          transform-style: preserve-3d;
          touch-action: pan-y;
          -webkit-tap-highlight-color: transparent;
        }

        .ice-grid {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: clamp(18px, 2vw, 32px);
          padding: clamp(18px, 3vw, 40px);
          z-index: 3;
          transform-style: preserve-3d;
        }

        .ice-left {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: 0;
          z-index: 5;
        }

        .ice-right {
          position: relative;
          min-width: 0;
          border-radius: 32px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.22);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.12);
          transform-style: preserve-3d;
        }

        .section-label {
          font-family: monospace;
          font-size: 11px;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          opacity: 0.65;
        }

        .resource-title {
          margin: 0;
          font-size: clamp(44px, 7vw, 96px);
          line-height: 0.95;
          letter-spacing: -0.06em;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 900;
          background: linear-gradient(to bottom, transparent 0%, currentColor 70%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          margin: 10px 0 0;
          font-family: monospace;
          font-size: 12px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          opacity: 0.68;
        }

        .meta-list {
          margin-top: 28px;
          display: grid;
          gap: 14px;
          max-width: 420px;
        }

        .meta-card {
          border-top: 1px solid rgba(0, 0, 0, 0.14);
          padding-top: 14px;
          display: flex;
          justify-content: space-between;
          gap: 18px;
          font-size: 14px;
          line-height: 1.5;
        }

        .meta-card strong {
          font-family: monospace;
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          opacity: 0.6;
          min-width: 110px;
        }

        .stage {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
        }

        .stage-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .stage-inner {
          position: absolute;
          inset: 0;
          z-index: 2;
          overflow: hidden;
        }

        .hero-card {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          transform-style: preserve-3d;
        }

        .card-shell {
          position: relative;
          width: min(72vw, 560px);
          height: min(72vh, 760px);
          transform-style: preserve-3d;
        }

        .float-pop {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }

        .float-splash {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .splash-wrap {
          position: absolute;
          left: 50%;
          bottom: -6%;
          width: min(100%, 620px);
          height: 34vh;
          transform: translateX(-50%);
          opacity: 1;
        }

        .glow {
          position: absolute;
          inset: 15% 18%;
          border-radius: 50%;
          filter: blur(72px);
          opacity: 0.75;
          background: rgba(255, 255, 255, 0.28);
        }

        .dot-stack {
          position: absolute;
          right: 24px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 30;
        }

        .dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          border: 1.4px solid rgba(0, 0, 0, 0.35);
          background: transparent;
        }

        .cta {
          position: absolute;
          left: 50%;
          bottom: 26px;
          transform: translateX(-50%);
          z-index: 30;
        }

        .cta button {
          padding: 13px 34px;
          border-radius: 999px;
          border: 1.5px solid rgba(255, 255, 255, 0.45);
          background: rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          color: #111;
          font-family: monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.55);
        }

        .grain {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: 0.18;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E");
          background-size: 300px 300px;
          mix-blend-mode: overlay;
        }

        @media (max-width: 900px) {
          .ice-grid {
            grid-template-columns: 1fr;
            padding: 16px;
          }

          .ice-left {
            position: absolute;
            inset: 16px 16px auto 16px;
            z-index: 8;
            pointer-events: none;
          }

          .ice-right {
            position: absolute;
            inset: 0;
            border-radius: 0;
            background: transparent;
            border: none;
            box-shadow: none;
          }

          .card-shell {
            width: min(88vw, 480px);
            height: min(56vh, 560px);
          }

          .dot-stack {
            right: 14px;
          }

          .cta {
            bottom: 18px;
          }

          .meta-list {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .resource-title {
            font-size: 38px;
          }

          .subtitle {
            font-size: 10px;
          }

          .card-shell {
            width: 92vw;
            height: 52vh;
          }
        }
      `}</style>

      <div ref={containerRef} className="ice-shell">
        <div ref={bgRef} className="stage-bg" />

        <div className="grain" />

        <div className="ice-grid">
          <div className="ice-left">
            <div>
              <div className="section-label">The Resource Library</div>

              {FLAVORS.map((flavor, i) => (
                <div
                  key={flavor.id}
                  className={`hero-text-${i}`}
                  style={{
                    position: i === 0 ? "relative" : "absolute",
                    opacity: i === 0 ? 1 : 0,
                    pointerEvents: i === 0 ? "auto" : "none",
                    color: flavor.textHex,
                  }}
                >
                  <h1 className="resource-title">{flavor.title}</h1>
                  <p className="subtitle">{flavor.subtitle}</p>

                  <div className="meta-list">
                    <div className="meta-card">
                      <strong>Date</strong>
                      <span>{flavor.year}</span>
                    </div>
                    <div className="meta-card">
                      <strong>Experience</strong>
                      <span>Snap-scroll 3D motion with smooth depth layering</span>
                    </div>
                    <div className="meta-card">
                      <strong>Style</strong>
                      <span>Minimal, premium, and mobile-safe</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "auto", paddingTop: 24 }}>
              <div className="section-label">Let’s start creating together</div>
              <p style={{ margin: "10px 0 0", maxWidth: 420, lineHeight: 1.7, opacity: 0.72 }}>
                A clean 3D ice cream showcase with smooth snap scroll, designed to feel like a premium brand site.
              </p>
            </div>
          </div>

          <div className="ice-right">
            <div className="stage" ref={stageRef}>
              {FLAVORS.map((flavor, i) => (
                <div key={flavor.id} className={`hero-card hero-card-${i}`}>
                  <div className="card-shell">
                    <div className="glow" style={{ background: flavor.accent }} />
                    <div className={`float-pop`}>
                      <Image
                        src={flavor.pop}
                        alt={flavor.title}
                        fill
                        priority={i === 0}
                        className="object-contain object-center"
                        style={{
                          filter: "drop-shadow(0 26px 54px rgba(0,0,0,0.22))",
                          transform: "translateZ(40px)",
                        }}
                      />
                    </div>
                  </div>

                  <div className={`splash-wrap hero-splash-${i}`}>
                    <div className="float-splash">
                      <Image
                        src={flavor.splash}
                        alt={`${flavor.title} splash`}
                        fill
                        className="object-cover object-bottom"
                        style={{
                          opacity: 1,
                          objectPosition: "center bottom",
                          filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.12))",
                        }}
                      />
                    </div>
                  </div>

                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.22), transparent 58%)",
                      transform: "translateZ(10px)",
                    }}
                  />

                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                      transform: "translateZ(20px)",
                    }}
                  >
                    {Array.from({ length: 6 }).map((_, p) => (
                      <span
                        key={p}
                        className="float-particle"
                        style={{
                          position: "absolute",
                          width: 8 + p * 2,
                          height: 8 + p * 2,
                          borderRadius: "50%",
                          left: `${14 + p * 13}%`,
                          top: `${16 + (p % 3) * 12}%`,
                          background: "rgba(255,255,255,0.28)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dot-stack">
          {FLAVORS.map((_, i) => (
            <div key={i} className={`dot dot-${i}`} />
          ))}
        </div>

        <div className="cta">
          <button>Order Now</button>
        </div>
      </div>
    </>
  );
    }
