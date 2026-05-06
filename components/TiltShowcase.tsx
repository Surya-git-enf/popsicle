
"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const FLAVORS = [
  {
    id:       "chocolate",
    name:     "Chocolate",
    num:      "01",
    cardBg:   "#F2C94C",
    textHex:  "#4A2311",
    popImage: "/images/chocolate-pop.png",
  },
  {
    id:       "strawberry",
    name:     "Strawberry",
    num:      "02",
    cardBg:   "#00FFFF",
    textHex:  "#E91E63",
    popImage: "/images/strawberry-pop.png",
  },
  {
    id:       "vanilla",
    name:     "Vanilla",
    num:      "03",
    cardBg:   "#3E2723",
    textHex:  "#FFF3E0",
    popImage: "/images/vanilla-pop.png",
  },
  {
    id:       "pistachio",
    name:     "Pistachio",
    num:      "04",
    cardBg:   "#A5D6A7",
    textHex:  "#1B5E20",
    popImage: "/images/pistachio-pop.png",
  },
];

export default function TiltShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Start: popsicles rotated, cards slightly down and invisible
    gsap.set(".ts-pop",  { rotation: 35, transformOrigin: "center bottom" });
    gsap.set(".ts-card", { y: 48, opacity: 0 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start:   "top 72%",
      once:    true,
      onEnter: () => {
        // Cards slide up first
        gsap.to(".ts-card", {
          y:        0,
          opacity:  1,
          duration: 0.75,
          ease:     "power3.out",
          stagger:  0.11,
        });

        // Then popsicles snap upright with elastic bounce (1 sec delay)
        gsap.to(".ts-pop", {
          rotation: 0,
          duration: 1.4,
          delay:    1,
          ease:     "elastic.out(1, 0.75)",
          stagger:  0.1,
        });
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      style={{
        position:        "relative",
        width:           "100%",
        minHeight:       "100vh",
        /* Beige — seamless handoff from the hero's warm palette */
        backgroundColor: "#F5F5DC",
        padding:         "96px 28px 110px",
        boxSizing:       "border-box",
        overflow:        "hidden",
      }}
    >
      {/* Subtle dot-grid texture for editorial depth */}
      <div
        aria-hidden
        style={{
          position:       "absolute",
          inset:          0,
          backgroundImage:`radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          pointerEvents:  "none",
        }}
      />

      {/* ── Section header ─────────────────────────────────────────────────── */}
      <div
        style={{
          textAlign:      "center",
          marginBottom:   68,
          position:       "relative",
          zIndex:         1,
        }}
      >
        <p
          style={{
            fontFamily:    "monospace",
            fontSize:      10,
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color:         "rgba(0,0,0,0.32)",
            marginBottom:  14,
          }}
        >
          — The Collection —
        </p>
        <h2
          style={{
            fontSize:      "clamp(42px, 6.5vw, 90px)",
            fontWeight:    900,
            fontFamily:    "Georgia, 'Times New Roman', serif",
            letterSpacing: "-0.04em",
            lineHeight:    0.95,
            color:         "#1a1009",
            margin:        0,
          }}
        >
          Pick Your
          <br />
          <span
            style={{
              fontStyle: "italic",
              color:     "rgba(0,0,0,0.28)",
            }}
          >
            Obsession
          </span>
        </h2>
      </div>

      {/* ── 4-column flavor grid ───────────────────────────────────────────── */}
      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap:                 18,
          maxWidth:            1300,
          margin:              "0 auto",
          position:            "relative",
          zIndex:              1,
        }}
      >
        {FLAVORS.map((flavor) => (
          <div
            key={flavor.id}
            className="ts-card"
            style={{
              display:         "flex",
              flexDirection:   "column",
              height:          520,
              borderRadius:    22,
              overflow:        "hidden",
              backgroundColor: flavor.cardBg,
              /* Crisp paper-cut border matching the card color */
              border:          `2px solid ${flavor.cardBg}`,
              boxShadow:       "0 2px 20px rgba(0,0,0,0.10)",
              cursor:          "pointer",
              transition:      "transform 0.38s cubic-bezier(0.23,1,0.32,1), box-shadow 0.38s ease",
              position:        "relative",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.transform  = "translateY(-12px) scale(1.025)";
              el.style.boxShadow  = `0 28px 72px rgba(0,0,0,0.22), 0 0 0 2px ${flavor.textHex}44`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.transform  = "translateY(0) scale(1)";
              el.style.boxShadow  = "0 2px 20px rgba(0,0,0,0.10)";
            }}
          >
            {/* Number badge — top right */}
            <div
              style={{
                position:      "absolute",
                top:           14,
                right:         16,
                fontFamily:    "monospace",
                fontSize:      10,
                fontWeight:    700,
                letterSpacing: "0.22em",
                color:         flavor.textHex,
                opacity:       0.45,
                zIndex:        5,
                userSelect:    "none",
              }}
            >
              {flavor.num}
            </div>

            {/* ── TOP 80%: popsicle image ──────────────────────────────────── */}
            <div
              style={{
                flex:           "0 0 80%",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                position:       "relative",
                overflow:       "hidden",
                paddingTop:     16,
              }}
            >
              {/* Inner light vignette — gives the card a glowing product feel */}
              <div
                aria-hidden
                style={{
                  position:     "absolute",
                  inset:        0,
                  background:   `radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.25) 0%, transparent 70%)`,
                  pointerEvents:"none",
                }}
              />

              <div
                className="ts-pop"
                style={{
                  position: "relative",
                  width:    "64%",
                  height:   "87%",
                }}
              >
                <Image
                  src={flavor.popImage}
                  alt={flavor.name}
                  fill
                  className="object-contain object-center"
                  style={{
                    filter: `drop-shadow(0 18px 36px rgba(0,0,0,0.22))`,
                  }}
                />
              </div>
            </div>

            {/* Thin hairline separator */}
            <div
              style={{
                height:          1,
                margin:          "0 18px",
                backgroundColor: `${flavor.textHex}22`,
              }}
            />

            {/* ── MIDDLE 10%: flavor name only (no tagline) ────────────────── */}
            <div
              style={{
                flex:           "0 0 10%",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily:    "Georgia, 'Times New Roman', serif",
                  fontSize:      15,
                  fontWeight:    700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color:         flavor.textHex,
                }}
              >
                {flavor.name}
              </span>
            </div>

            {/* Thin hairline separator */}
            <div
              style={{
                height:          1,
                margin:          "0 18px",
                backgroundColor: `${flavor.textHex}22`,
              }}
            />

            {/* ── BOTTOM 10%: Order button ─────────────────────────────────── */}
            <div
              style={{
                flex:           "0 0 10%",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
              }}
            >
              <button
                style={{
                  padding:       "8px 24px",
                  borderRadius:  999,
                  border:        `1.5px solid ${flavor.textHex}`,
                  background:    "transparent",
                  color:         flavor.textHex,
                  fontFamily:    "monospace",
                  fontSize:      9,
                  fontWeight:    700,
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  cursor:        "pointer",
                  transition:    "all 0.22s ease",
                }}
                onMouseEnter={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.background = flavor.textHex;
                  b.style.color      = flavor.cardBg;
                  b.style.transform  = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.background = "transparent";
                  b.style.color      = flavor.textHex;
                  b.style.transform  = "scale(1)";
                }}
              >
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Scrolling marquee footer strip ────────────────────────────────── */}
      <div
        style={{
          marginTop:    72,
          overflow:     "hidden",
          position:     "relative",
          zIndex:       1,
          borderTop:    "1px solid rgba(0,0,0,0.08)",
          padding:      "16px 0 0",
        }}
      >
        <div
          style={{
            display:    "flex",
            gap:        48,
            animation:  "ts-marquee 20s linear infinite",
            whiteSpace: "nowrap",
          }}
        >
          {Array.from({ length: 8 }).flatMap((_, rep) =>
            FLAVORS.map((f) => (
              <span
                key={`${f.id}-${rep}`}
                style={{
                  fontFamily:    "Georgia, serif",
                  fontSize:      11,
                  fontWeight:    700,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color:         f.textHex,
                  opacity:       0.45,
                }}
              >
                {f.name} ·
              </span>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes ts-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (max-width: 860px) {
          /* override inline grid on smaller screens */
        }
      `}</style>
    </section>
  );
}
