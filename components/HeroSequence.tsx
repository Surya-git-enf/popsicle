
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
        if (i === 0) {
          gsap.set(`.hs-text-${i}`, { opacity: 1, y: 0 });
          gsap.set(`.hs-pop-${i}`, { opacity: 1, y: 0, scale: 1, rotation: 0 });
          gsap.set(`.hs-splash-${i}`, { opacity: 1, y: 0, scale: 1 });
        } else {
          gsap.set(`.hs-text-${i}`, { opacity: 0, y: 70 });
          gsap.set(`.hs-pop-${i}`, { opacity: 0, y: 110, scale: 0.92, rotation: 8 });
          gsap.set(`.hs-splash-${i}`, { opacity: 0, y: 40, scale: 0.97 });
        }
      });

      // Gentle ambient motion
      gsap.to(".hs-pop-float", {
        y: -12,
        rotation: 1.2,
        duration: 3.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.16,
      });

      gsap.to(".hs-splash-float", {
        y: -6,
        scale: 1.02,
        duration: 3.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.16,
      });

      gsap.to(".hs-particle", {
        y: -8,
        opacity: 0.95,
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
            duration: 0.95,
            ease: "power2.inOut",
          },
          0
        );

        tl.to(
          `.hs-text-${prev}`,
          { opacity: 0, y: -28, duration: 0.35, ease: "power2.inOut" },
          0
        );
        tl.to(
          `.hs-pop-${prev}`,
          { opacity: 0, y: -34, scale: 0.92, rotation: -6, duration: 0.35, ease: "power2.inOut" },
          0
        );
        tl.to(
          `.hs-splash-${prev}`,
          { opacity: 0, y: -16, scale: 0.96, duration: 0.3, ease: "power2.inOut" },
          0
        );

        tl.fromTo(
          `.hs-text-${index}`,
          { opacity: 0, y: 56 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power4.out" },
          0.15
        );

        // 3D-like entrance for the popsicle
        tl.fromTo(
          `.hs-pop-${index}`,
          { opacity: 0, y: 110, scale: 0.88, rotation: 10, z: -80 },
          { opacity: 1, y: 0, scale: 1, rotation: 0, z: 0, duration: 1.15, ease: "expo.out" },
          0.08
        );

        // Stronger splash reveal for a commercial feel
        tl.fromTo(
          `.hs-splash-${index}`,
          { opacity: 0, y: 52, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" },
          0.2
        );

        gsap.to(".nav-dot", { backgroundColor: "transparent", duration: 0.22 });
        gsap.to(`.nav-dot-${index}`, {
          backgroundColor: "rgba(0,0,0,0.58)",
          duration: 0.22,
        });
      }

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${total * 120}%`,
        pin: true,
        scrub: 1.1,
        anticipatePin: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        snap: {
          snapTo: 1 / total,
          duration: { min: 0.45, max: 0.95 },
          delay: 0.04,
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
                Ice Cream Store · {String(i + 1).padStart(2, "0")}
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

            <div className={`hs-pop-${i} ice-hero-pop`}>
              <div className="hs-pop-float ice-hero-float">
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: "8% 14%",
                    borderRadius: "50%",
                    filter: "blur(58px)",
                    background: "rgba(255,255,255,0.24)",
                    opacity: 0.9,
                    zIndex: 0,
                  }}
                />
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
                    width: 8 + p * 1.5,
                    height: 8 + p * 1.5,
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
                transition: "background-color 0.25s ease",
              }}
            />
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 60,
          }}
        >
          <button
            style={{
              padding: "13px 34px",
              borderRadius: 999,
              border: "1.5px solid rgba(255,255,255,0.45)",
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              color: "#111",
              fontFamily: "monospace",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              cursor: "pointer",
              boxShadow:
                "0 8px 28px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.55)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.transform = "translateY(-2px)";
              b.style.background = "rgba(255,255,255,0.32)";
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.transform = "translateY(0)";
              b.style.background = "rgba(255,255,255,0.18)";
            }}
          >
            Order Now
          </button>
        </div>
      </div>
    </>
  );
}
