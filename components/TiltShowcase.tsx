
"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const FLAVORS = [
  {
    id:        "chocolate",
    name:      "Chocolate",
    tagline:   "Dark & Indulgent",
    num:       "01",
    cardBg:    "#1A0F00",
    accent:    "#F2C94C",
    textLight: "#FFF8E1",
    popImage:  "/images/chocolate-pop.png",
  },
  {
    id:        "strawberry",
    name:      "Strawberry",
    tagline:   "Bold & Electrifying",
    num:       "02",
    cardBg:    "#00101A",
    accent:    "#00FFFF",
    textLight: "#E0FFFF",
    popImage:  "/images/strawberry-pop.png",
  },
  {
    id:        "vanilla",
    name:      "Vanilla",
    tagline:   "Silky & Classic",
    num:       "03",
    cardBg:    "#0D0804",
    accent:    "#FFF3E0",
    textLight: "#FFF3E0",
    popImage:  "/images/vanilla-pop.png",
  },
  {
    id:        "pistachio",
    name:      "Pistachio",
    tagline:   "Fresh & Nutty",
    num:       "04",
    cardBg:    "#041A08",
    accent:    "#A5D6A7",
    textLight: "#E8F5E9",
    popImage:  "/images/pistachio-pop.png",
  },
];

export default function TiltShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Start all card pops rotated 35° and invisible
    gsap.set(".ts-card", { y: 60, opacity: 0 });
    gsap.set(".ts-pop",  { rotation: 35, transformOrigin: "center bottom" });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start:   "top 70%",
      once:    true,
      onEnter: () => {
        // Cards slide up
        gsap.to(".ts-card", {
          y:        0,
          opacity:  1,
          duration: 0.8,
          ease:     "power3.out",
          stagger:  0.12,
        });

        // Pops snap to upright with elastic bounce (1 sec delay per spec)
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
        backgroundColor: "#0A0A0A",  // Dark editorial — punchy contrast to beige hero
        padding:         "100px 32px 120px",
        boxSizing:       "border-box",
        overflow:        "hidden",
      }}
    >
      {/* ── Decorative background grid lines ──────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position:       "absolute",
          inset:          0,
          backgroundImage:`
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents:  "none",
        }}
      />

      {/* ── Section header ─────────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", marginBottom: 72, position: "relative", zIndex: 1 }}>
        <p
          style={{
            fontFamily:    "monospace",
            fontSize:      10,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color:         "rgba(255,255,255,0.3)",
            marginBottom:  16,
          }}
        >
          — The Collection —
        </p>
        <h2
          style={{
            fontSize:      "clamp(44px, 7vw, 96px)",
            fontWeight:    900,
            fontFamily:    "Georgia, 'Times New Roman', serif",
            letterSpacing: "-0.04em",
            lineHeight:    0.95,
            color:         "#fff",
            margin:        0,
          }}
        >
          Pick Your
          <br />
          <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.45)" }}>
            Obsession
          </em>
        </h2>
      </div>

      {/* ── 4-column card grid ─────────────────────────────────────────────── */}
      <div
        style={{
          display:               "grid",
          gridTemplateColumns:   "repeat(4, 1fr)",
          gap:                   20,
          maxWidth:              1320,
          margin:                "0 auto",
          position:              "relative",
          zIndex:                1,
        }}
      >
        {FLAVORS.map((flavor) => (
          <div
            key={flavor.id}
            className="ts-card"
            style={{
              display:       "flex",
              flexDirection: "column",
              height:        520,
              borderRadius:  20,
              overflow:      "hidden",
              backgroundColor: flavor.cardBg,
              border:        `1px solid rgba(255,255,255,0.07)`,
              boxShadow:     "0 4px 40px rgba(0,0,0,0.5)",
              cursor:        "pointer",
              transition:    "transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease",
              position:      "relative",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.transform = "translateY(-10px) scale(1.02)";
              el.style.boxShadow = `0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px ${flavor.accent}55`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.transform = "translateY(0) scale(1)";
              el.style.boxShadow = "0 4px 40px rgba(0,0,0,0.5)";
            }}
          >
            {/* Accent glow top */}
            <div
              aria-hidden
              style={{
                position:     "absolute",
                top:          -60,
                left:         "50%",
                transform:    "translateX(-50%)",
                width:        180,
                height:       180,
                borderRadius: "50%",
                background:   flavor.accent,
                opacity:      0.07,
                filter:       "blur(40px)",
                pointerEvents:"none",
              }}
            />

            {/* Flavor number — top-left badge */}
            <div
              style={{
                position:      "absolute",
                top:           16,
                left:          18,
                fontFamily:    "monospace",
                fontSize:      11,
                letterSpacing: "0.2em",
                color:         flavor.accent,
                opacity:       0.7,
                zIndex:        5,
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
                paddingTop:     20,
              }}
            >
              {/* Subtle radial gradient backdrop */}
              <div
                aria-hidden
                style={{
                  position:     "absolute",
                  inset:        0,
                  background:   `radial-gradient(ellipse at 50% 80%, ${flavor.accent}18 0%, transparent 70%)`,
                  pointerEvents:"none",
                }}
              />

              <div
                className="ts-pop"
                style={{
                  position: "relative",
                  width:    "62%",
                  height:   "86%",
                }}
              >
                <Image
                  src={flavor.popImage}
                  alt={flavor.name}
                  fill
                  className="object-contain object-center"
                  style={{
                    filter: `drop-shadow(0 20px 40px ${flavor.accent}40)`,
                  }}
                />
              </div>
            </div>

            {/* Thin separator */}
            <div
              style={{
                height:          1,
                backgroundColor: `rgba(255,255,255,0.06)`,
                margin:          "0 18px",
              }}
            />

            {/* ── MIDDLE 10%: name + tagline ───────────────────────────────── */}
            <div
              style={{
                flex:           "0 0 10%",
                display:        "flex",
                flexDirection:  "column",
                alignItems:     "center",
                justifyContent: "center",
                gap:            2,
                padding:        "0 14px",
              }}
            >
              <span
                style={{
                  fontFamily:    "Georgia, serif",
                  fontSize:      15,
                  fontWeight:    700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color:         flavor.accent,
                }}
              >
                {flavor.name}
              </span>
              <span
                style={{
                  fontFamily:    "monospace",
                  fontSize:      9,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color:         "rgba(255,255,255,0.28)",
                }}
              >
                {flavor.tagline}
              </span>
            </div>

            {/* Thin separator */}
            <div
              style={{
                height:          1,
                backgroundColor: `rgba(255,255,255,0.06)`,
                margin:          "0 18px",
              }}
            />

            {/* ── BOTTOM 10%: CTA button ───────────────────────────────────── */}
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
                  padding:       "8px 22px",
                  borderRadius:  999,
                  border:        `1px solid ${flavor.accent}50`,
                  background:    `${flavor.accent}14`,
                  color:         flavor.accent,
                  fontFamily:    "monospace",
                  fontSize:      9,
                  fontWeight:    700,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  cursor:        "pointer",
                  transition:    "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.background = flavor.accent;
                  b.style.color      = flavor.cardBg;
                  b.style.transform  = "scale(1.04)";
                }}
                onMouseLeave={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.background = `${flavor.accent}14`;
                  b.style.color      = flavor.accent;
                  b.style.transform  = "scale(1)";
                }}
              >
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom marquee strip ───────────────────────────────────────────── */}
      <div
        style={{
          marginTop:    80,
          overflow:     "hidden",
          position:     "relative",
          zIndex:       1,
          borderTop:    "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding:      "14px 0",
        }}
      >
        <div
          style={{
            display:   "flex",
            gap:       40,
            animation: "marquee 18s linear infinite",
            whiteSpace:"nowrap",
          }}
        >
          {Array.from({ length: 6 }).flatMap(() =>
            FLAVORS.map((f) => (
              <span
                key={`${f.id}-${Math.random()}`}
                style={{
                  fontFamily:    "Georgia, serif",
                  fontSize:      11,
                  fontWeight:    700,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color:         f.accent,
                  opacity:       0.5,
                }}
              >
                {f.name} ·
              </span>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (max-width: 900px) {
          .ts-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 540px) {
          .ts-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
              }
                
