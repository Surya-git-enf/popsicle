
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
  image: string;
  kind: "splash" | "bar";
};

const FLAVORS: Flavor[] = [
  {
    id: "vanilla",
    title: "VANILLA",
    subtitle: "Soft · Creamy · Classic",
    bg: "#F3E2C7",
    textHex: "#6B4B2A",
    image: "/images/cream-splash.png",
    kind: "splash",
  },
  {
    id: "chocolate",
    title: "CHOCOLATE",
    subtitle: "Rich · Smooth · Bold",
    bg: "#5A2B1D",
    textHex: "#FFE6D1",
    image: "/images/choco-splash.png",
    kind: "splash",
  },
  {
    id: "strawberry",
    title: "STRAWBERRY",
    subtitle: "Fresh · Sweet · Bright",
    bg: "#FAD1DB",
    textHex: "#C2185B",
    image: "/images/strawberry-splash.png",
    kind: "splash",
  },
  {
    id: "pistachio",
    title: "PISTACHIO",
    subtitle: "Nutty · Fresh · Smooth",
    bg: "#DDE9A6",
    textHex: "#496B12",
    image: "/images/pistachio-splash.png",
    kind: "splash",
  },
  {
    id: "pistachio-bar",
    title: "PISTACHIO BAR",
    subtitle: "Crunchy · Cool · Premium",
    bg: "#D7E89A",
    textHex: "#2D4E10",
    image: "/images/pistachio-bar.png",
    kind: "bar",
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
          gsap.set(`.hs-text-${i}`, { opacity: 0, y: 80 });
          gsap.set(`.hs-pop-${i}`, { opacity: 0, y: 110, scale: 0.9, rotation: 10 });
          gsap.set(`.hs-splash-${i}`, { opacity: 0, y: 60, scale: 0.98 });
        }
      });

      gsap.to(".hs-pop-float", {
        y: -18,
        rotation: 2,
        duration: 2.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.25,
      });

      gsap.to(".hs-splash-float", {
        y: 10,
        scale: 1.03,
        duration: 3.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.25,
      });

      gsap.to(".hs-particle", {
        y: -14,
        opacity: 0.9,
        duration: 2.6,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.12,
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
            duration: 0.8,
            ease: "power2.inOut",
          },
          0
        );

        tl.to(
          `.hs-text-${prev}`,
          { opacity: 0, y: -40, duration: 0.35, ease: "power2.in" },
          0
        );
        tl.to(
          `.hs-pop-${prev}`,
          { opacity: 0, y: -50, scale: 0.9, rotation: -8, duration: 0.35, ease: "power2.in" },
          0
        );
        tl.to(
          `.hs-splash-${prev}`,
          { opacity: 0, y: -25, scale: 0.96, duration: 0.3, ease: "power2.in" },
          0
        );

        tl.fromTo(
          `.hs-text-${index}`,
          { opacity: 0, y: 70 },
          { opacity: 1, y: 0, duration: 0.85, ease: "power4.out" },
          0.18
        );

        tl.fromTo(
          `.hs-pop-${index}`,
          { opacity: 0, y: 110, scale: 0.88, rotation: 10 },
          { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 1.05, ease: "expo.out" },
          0.12
        );

        tl.fromTo(
          `.hs-splash-${index}`,
          { opacity: 0, y: 60, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" },
          0.24
        );

        gsap.to(".nav-dot", { backgroundColor: "transparent", duration: 0.25 });
        gsap.to(`.nav-dot-${index}`, {
          backgroundColor: "rgba(0,0,0,0.58)",
          duration: 0.25,
        });
      }

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${total * 100}%`,
        pin: true,
        scrub: 0.75,
        snap: {
          snapTo: 1 / total,
          duration: { min: 0.35, max: 0.8 },
          delay: 0.02,
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
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <div ref={bgRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.20), transparent 58%), linear-gradient(to top, rgba(255,255,255,0.16), transparent 32%)",
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
          opacity: 0.22,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'300\' height=\'300\' filter=\'url(%23n)\' opacity=\'0.07\'/%3E%3C/svg%3E")',
          backgroundSize: "300px 300px",
        }}
      />

      {FLAVORS.map((flavor, i) => (
        <section key={flavor.id} style={{ position: "absolute", inset: 0, zIndex: 2 }}>
          <div
            className={`hs-text-${i}`}
            style={{
              position: "absolute",
              top: "7%",
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
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
                fontSize: "clamp(44px, 10vw, 128px)",
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

          <div
            className={`hs-pop-${i}`}
            style={{
              position: "absolute",
              left: "50%",
              top: flavor.kind === "bar" ? "48%" : "50%",
              transform: "translateX(-50%)",
              width: flavor.kind === "bar" ? "min(58vw, 380px)" : "min(80vw, 580px)",
              height: flavor.kind === "bar" ? "min(60vh, 760px)" : "min(74vh, 760px)",
              zIndex: 20,
            }}
          >
            <div
              className="hs-pop-float"
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: "10% 18%",
                  borderRadius: "50%",
                  filter: "blur(60px)",
                  background: "rgba(255,255,255,0.22)",
                  opacity: 0.7,
                  zIndex: 0,
                }}
              />
              <Image
                src={flavor.image}
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
            className={`hs-splash-${i}`}
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: "0%",
              height: "30vh",
              zIndex: 5,
              pointerEvents: "none",
            }}
          >
            <div
              className="hs-splash-float"
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <Image
                src={flavor.kind === "bar" ? "/images/pistachio-bar.png" : flavor.image}
                alt={`${flavor.title} splash`}
                fill
                className="object-cover object-bottom"
                style={{ opacity: flavor.kind === "bar" ? 0.0 : 0.18 }}
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
                  width: 8 + p * 1.6,
                  height: 8 + p * 1.6,
                  borderRadius: "50%",
                  left: `${10 + p * 11}%`,
                  top: `${16 + (p % 4) * 10}%`,
                  background: "rgba(255,255,255,0.24)",
                  filter: "blur(1px)",
                  opacity: 0.55,
                }}
              />
            ))}
          </div>
        </section>
      ))}

      <div
        style={{
          position: "absolute",
          right: 20,
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
  );
}
