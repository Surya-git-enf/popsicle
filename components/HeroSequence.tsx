
"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const FLAVORS = [
  { id: "chocolate",  title: "CHOCOLATE",  bg: "#F2C94C", textHex: "#4A2311" },
  { id: "strawberry", title: "STRAWBERRY", bg: "#00FFFF", textHex: "#E91E63" },
  { id: "vanilla",    title: "VANILLA",    bg: "#3E2723", textHex: "#FFF3E0" },
  { id: "pistachio",  title: "PISTACHIO",  bg: "#A5D6A7", textHex: "#1B5E20" },
];

export default function HeroSequence() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const bgRef         = useRef<HTMLDivElement>(null);
  const triggerRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef     = useRef(0);

  useGSAP(() => {
    // ── Initial state ────────────────────────────────────────────────────────
    gsap.set(bgRef.current, { backgroundColor: FLAVORS[0].bg });

    FLAVORS.forEach((_, i) => {
      if (i === 0) {
        gsap.set(`.hs-text-${i}`,   { opacity: 1, y: 0 });
        gsap.set(`.hs-pop-${i}`,    { opacity: 1, y: 0, rotation: 0 });
        gsap.set(`.hs-splash-${i}`, { opacity: 1, y: 0 });
      } else {
        gsap.set(`.hs-text-${i}`,   { opacity: 0, y: 70 });
        gsap.set(`.hs-pop-${i}`,    { opacity: 0, y: 90, rotation: 35 });
        gsap.set(`.hs-splash-${i}`, { opacity: 0, y: 45 });
      }
    });

    // ── Continuous ambient float ─────────────────────────────────────────────
    gsap.to(".hs-pop-float", {
      y: -22, rotation: 2.5, duration: 2.8,
      yoyo: true, repeat: -1, ease: "sine.inOut", stagger: 0.5,
    });
    gsap.to(".hs-splash-float", {
      scale: 1.04, y: 12, duration: 3.6,
      yoyo: true, repeat: -1, ease: "sine.inOut", stagger: 0.7,
    });

    // ── Crossfade function ───────────────────────────────────────────────────
    function animateIn(index: number) {
      if (activeRef.current === index) return;
      const prev = activeRef.current;
      activeRef.current = index;

      const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

      tl.to(bgRef.current, { backgroundColor: FLAVORS[index].bg, duration: 0.8, ease: "power2.inOut" }, 0);

      // OUT prev
      tl.to(`.hs-text-${prev}`,   { opacity: 0, y: -50, duration: 0.38, ease: "power2.in" }, 0);
      tl.to(`.hs-pop-${prev}`,    { opacity: 0, y: -60, rotation: -18, duration: 0.38, ease: "power2.in" }, 0);
      tl.to(`.hs-splash-${prev}`, { opacity: 0, y: -30, duration: 0.32, ease: "power2.in" }, 0);

      // IN next
      tl.fromTo(`.hs-text-${index}`,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power4.out" }, 0.22
      );
      tl.fromTo(`.hs-pop-${index}`,
        { opacity: 0, y: 100, rotation: 35 },
        { opacity: 1, y: 0, rotation: 0, duration: 1.1, ease: "expo.out" }, 0.18
      );
      tl.fromTo(`.hs-splash-${index}`,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.28
      );
    }

    // ── One ScrollTrigger per sentinel div ───────────────────────────────────
    // Each sentinel is 100vh tall, stacked inside the 400vh container.
    // When it crosses the viewport midpoint, animateIn fires.
    triggerRefs.current.forEach((el, i) => {
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end:   "bottom 45%",
        onEnter:     () => animateIn(i),
        onEnterBack: () => animateIn(i),
      });
    });

    // ── Snap: one full scroll step = one flavor ──────────────────────────────
    // CSS `position: sticky` on the inner div handles the visual pin.
    // ScrollTrigger only manages the snap — no `pin` here (avoids spacer / black gap).
    ScrollTrigger.create({
      trigger: containerRef.current,
      start:   "top top",
      end:     "bottom bottom",
      snap: {
        snapTo:   1 / 3,                          // 0 → 1/3 → 2/3 → 1
        duration: { min: 0.45, max: 0.85 },
        delay:    0.05,
        ease:     "power2.inOut",
      },
    });
  }, { scope: containerRef });

  return (
    /**
     * 400vh tall outer container.
     * The next sibling (TiltShowcase) sits flush underneath — no gap,
     * no black, because we are NOT using ScrollTrigger `pin: true`
     * (which injects a spacer div and shifts layout).
     */
    <div ref={containerRef} style={{ position: "relative", height: "400vh" }}>

      {/* ── 4 invisible sentinel divs, one per flavor slot ───────────────── */}
      {FLAVORS.map((_, i) => (
        <div
          key={i}
          ref={(el) => { triggerRefs.current[i] = el; }}
          style={{
            position:      "absolute",
            top:           `${i * 100}vh`,
            left:          0,
            width:         "100%",
            height:        "100vh",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* ── CSS sticky viewport — stays at top while 400vh scrolls ────────── */}
      <div
        style={{
          position: "sticky",
          top:      0,
          width:    "100%",
          height:   "100vh",
          overflow: "hidden",
        }}
      >
        {/* Background */}
        <div ref={bgRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />

        {/* Grain texture */}
        <div
          aria-hidden
          style={{
            position:        "absolute",
            inset:           0,
            zIndex:          1,
            pointerEvents:   "none",
            opacity:         0.4,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E")`,
            backgroundSize:  "300px 300px",
            mixBlendMode:    "overlay",
          }}
        />

        {/* ── 4 flavor layers (all stacked absolute) ──────────────────────── */}
        {FLAVORS.map((flavor, i) => (
          <div key={flavor.id} style={{ position: "absolute", inset: 0, zIndex: 2 }}>

            {/* Text — top 8% */}
            <div
              className={`hs-text-${i}`}
              style={{
                position:      "absolute",
                top:           "8%",
                left:          0,
                right:         0,
                display:       "flex",
                flexDirection: "column",
                alignItems:    "center",
                pointerEvents: "none",
                zIndex:        10,
              }}
            >
              <h1
                style={{
                  fontSize:             "clamp(52px, 11vw, 132px)",
                  fontWeight:           900,
                  letterSpacing:        "-0.04em",
                  lineHeight:           1,
                  fontFamily:           "Georgia, 'Times New Roman', serif",
                  background:           `linear-gradient(to bottom, transparent 0%, ${flavor.textHex} 68%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor:  "transparent",
                  backgroundClip:       "text",
                  margin:               0,
                  userSelect:           "none",
                  textAlign:            "center",
                }}
              >
                {flavor.title}
              </h1>
              <p
                style={{
                  marginTop:     10,
                  fontFamily:    "monospace",
                  fontSize:      10,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color:         flavor.textHex,
                  opacity:       0.55,
                }}
              >
                Artisan · {String(i + 1).padStart(2, "0")}
              </p>
            </div>

            {/* Popsicle — top 12%, centered */}
            <div
              className={`hs-pop-${i}`}
              style={{
                position:  "absolute",
                top:       "12%",
                left:      "50%",
                transform: "translateX(-50%)",
                width:     290,
                height:    "62vh",
                zIndex:    30,
              }}
            >
              <div
                className="hs-pop-float"
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                <Image
                  src={`/images/${flavor.id}-pop.png`}
                  alt={flavor.title}
                  fill
                  className="object-contain object-center"
                  priority={i === 0}
                  style={{ filter: "drop-shadow(0 28px 56px rgba(0,0,0,0.28))" }}
                />
              </div>
            </div>

            {/* Splash — pinned to bottom */}
            <div
              className={`hs-splash-${i}`}
              style={{
                position: "absolute",
                bottom:   0,
                left:     0,
                right:    0,
                height:   "36vh",
                zIndex:   20,
              }}
            >
              <div
                className="hs-splash-float"
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                <Image
                  src={`/images/${flavor.id}-splash.png`}
                  alt={`${flavor.title} splash`}
                  fill
                  className="object-cover object-bottom"
                  priority={i === 0}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Dot navigation — right edge */}
        <div
          style={{
            position:      "absolute",
            right:         20,
            top:           "50%",
            transform:     "translateY(-50%)",
            display:       "flex",
            flexDirection: "column",
            gap:           10,
            zIndex:        50,
          }}
        >
          {FLAVORS.map((_, i) => (
            <div
              key={i}
              style={{
                width:           6,
                height:          6,
                borderRadius:    "50%",
                border:          "1.5px solid rgba(0,0,0,0.35)",
                backgroundColor: i === 0 ? "rgba(0,0,0,0.55)" : "transparent",
                transition:      "background 0.3s",
              }}
            />
          ))}
        </div>

        {/* ORDER NOW — bottom center */}
        <div
          style={{
            position:  "absolute",
            bottom:    30,
            left:      "50%",
            transform: "translateX(-50%)",
            zIndex:    50,
          }}
        >
          <button
            style={{
              padding:           "13px 34px",
              borderRadius:      999,
              border:            "1.5px solid rgba(255,255,255,0.45)",
              background:        "rgba(255,255,255,0.16)",
              backdropFilter:    "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              color:             "#111",
              fontFamily:        "monospace",
              fontSize:          10,
              fontWeight:        700,
              letterSpacing:     "0.28em",
              textTransform:     "uppercase",
              cursor:            "pointer",
              boxShadow:         "0 8px 28px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.55)",
              transition:        "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.transform  = "translateY(-2px)";
              b.style.background = "rgba(255,255,255,0.32)";
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.transform  = "translateY(0)";
              b.style.background = "rgba(255,255,255,0.16)";
            }}
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
          }
