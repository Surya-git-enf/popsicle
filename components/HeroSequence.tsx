
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// FLAVOR DATA
// ─────────────────────────────────────────────────────────────────────────────
interface Flavor {
  id: string;
  title: string;
  subtitle: string;
  popImage: string;
  splashImage: string;
  bg: string;
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
    titleColor: "#D4EAD8",
    subtitleColor: "#9DC4A8",
  },
];

const TOTAL = FLAVORS.length;

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Instantly reset a flavor to its hidden/entry state.
 * Called before we reveal a different flavor.
 */
function hideFlavor(
  pop: HTMLDivElement,
  splash: HTMLDivElement,
  title: HTMLDivElement,
  sub: HTMLDivElement,
  layer: HTMLDivElement,
  floatTween: gsap.core.Tween
) {
  floatTween.pause();
  gsap.killTweensOf([pop, splash, title, sub]);

  // Collapse layer so it doesn't sit on top
  gsap.set(layer, { autoAlpha: 0 });

  // Reset to entry state — ready to animate IN again if scrolled back
  gsap.set(pop, {
    scale: 0.68,
    y: 90,
    x: -12,
    rotateX: 18,
    rotateZ: -8,
    opacity: 0,
  });
  gsap.set(splash, {
    scale: 0.82,
    scaleX: 0.72,
    y: 35,
    opacity: 0,
    filter: "blur(5px)",
  });
  gsap.set([title, sub], { opacity: 0, y: 14 });
}

/**
 * Animate a flavor fully into view.
 * Each element reveals sequentially — pop leads, splash follows, text arrives last.
 */
function revealFlavor(
  pop: HTMLDivElement,
  splash: HTMLDivElement,
  title: HTMLDivElement,
  sub: HTMLDivElement,
  layer: HTMLDivElement,
  bg: HTMLDivElement,
  bgColor: string,
  floatTween: gsap.core.Tween
) {
  // Make this layer visible
  gsap.set(layer, { autoAlpha: 1 });

  // Swap background color — fast but smooth
  gsap.to(bg, { backgroundColor: bgColor, duration: 0.35, ease: "power2.out" });

  const tl = gsap.timeline({
    onComplete: () => floatTween.play(), // gentle idle float starts after reveal
  });

  // Popsicle emerges from below with 3D tilt
  tl.fromTo(
    pop,
    { scale: 0.68, y: 90, x: -12, rotateX: 18, rotateZ: -8, opacity: 0 },
    {
      scale: 1,
      y: 0,
      x: 0,
      rotateX: 0,
      rotateZ: 0,
      opacity: 1,
      duration: 0.75,
      ease: "back.out(1.6)",
    }
  );

  // Splash rises up behind popsicle
  tl.fromTo(
    splash,
    { scale: 0.82, scaleX: 0.72, y: 35, opacity: 0, filter: "blur(5px)" },
    {
      scale: 1,
      scaleX: 1,
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.6,
      ease: "power3.out",
    },
    "-=0.52"
  );

  // Title fades up
  tl.fromTo(
    title,
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.38, ease: "power2.out" },
    "-=0.32"
  );

  // Subtitle follows
  tl.fromTo(
    sub,
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" },
    "-=0.22"
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function IceCreamHero() {
  const wrapRef    = useRef<HTMLDivElement>(null);  // full-height scroll container
  const pinnedRef  = useRef<HTMLDivElement>(null);  // pinned 100vh viewport
  const bgRef      = useRef<HTMLDivElement>(null);  // background color div

  const layerRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const popRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const splashRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const subRefs    = useRef<(HTMLDivElement | null)[]>([]);

  // One float tween per flavor — paused by default, played after reveal
  const floatTweens = useRef<gsap.core.Tween[]>([]);

  const [active, setActive] = useState(0);

  useGSAP(() => {
    const wrap   = wrapRef.current;
    const pinned = pinnedRef.current;
    const bg     = bgRef.current;
    if (!wrap || !pinned || !bg) return;

    // ── STEP 1: SET ALL FLAVORS TO HIDDEN/ENTRY STATE ────────────────────
    FLAVORS.forEach((_, i) => {
      const layer  = layerRefs.current[i];
      const pop    = popRefs.current[i];
      const splash = splashRefs.current[i];
      const title  = titleRefs.current[i];
      const sub    = subRefs.current[i];
      if (!layer || !pop || !splash || !title || !sub) return;

      gsap.set(layer, { autoAlpha: 0 });

      gsap.set(pop, {
        scale: 0.68,
        y: 90,
        x: -12,
        rotateX: 18,
        rotateZ: -8,
        opacity: 0,
        transformOrigin: "center bottom",
        transformPerspective: 900,
      });

      gsap.set(splash, {
        scale: 0.82,
        scaleX: 0.72,
        y: 35,
        opacity: 0,
        filter: "blur(5px)",
        transformOrigin: "center bottom",
      });

      gsap.set([title, sub], { opacity: 0, y: 14 });

      // Create a looping float tween, paused — GSAP won't run it until .play()
      floatTweens.current[i] = gsap.to(pop, {
        y: "-=12",
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        paused: true,
      });
    });

    // ── STEP 2: SET BACKGROUND AND REVEAL FLAVOR 0 IMMEDIATELY ──────────
    gsap.set(bg, { backgroundColor: FLAVORS[0].bg });

    revealFlavor(
      popRefs.current[0]!,
      splashRefs.current[0]!,
      titleRefs.current[0]!,
      subRefs.current[0]!,
      layerRefs.current[0]!,
      bg,
      FLAVORS[0].bg,
      floatTweens.current[0]
    );

    // ── STEP 3: PIN THE VIEWPORT ─────────────────────────────────────────
    // The wrapper is TOTAL×100vh. The inner 100vh pinner gets pinned.
    // While pinned, scroll position drives which flavor is active.
    ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: `+=${window.innerHeight * (TOTAL - 1)}`,
      pin: pinned,
      pinSpacing: true,
      anticipatePin: 1,
    });

    // ── STEP 4: SNAP ─────────────────────────────────────────────────────
    // A separate ScrollTrigger just for snapping.
    // snapTo: 1/(TOTAL-1) creates equally-spaced snap points.
    ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: `+=${window.innerHeight * (TOTAL - 1)}`,
      snap: {
        snapTo: 1 / (TOTAL - 1),
        duration: { min: 0.25, max: 0.55 },
        delay: 0.04,
        ease: "power2.inOut",
      },
    });

    // ── STEP 5: PER-FLAVOR DISCRETE TRIGGERS ─────────────────────────────
    // Each flavor owns a scroll zone: flavor i → [i×vh, (i+1)×vh].
    // We switch at the midpoint of each zone so the swap feels decisive.
    //
    // onEnter      = scrolling DOWN into flavor i
    // onEnterBack  = scrolling UP back into flavor i
    // Both call the same reveal — one flavor fully shown at a time.
    FLAVORS.forEach((flavor, i) => {
      const layer  = layerRefs.current[i];
      const pop    = popRefs.current[i];
      const splash = splashRefs.current[i];
      const title  = titleRefs.current[i];
      const sub    = subRefs.current[i];
      if (!layer || !pop || !splash || !title || !sub) return;

      const ft = floatTweens.current[i];
      const vh = window.innerHeight;

      // Trigger point: midway through this flavor's scroll zone.
      // Flavor 0 triggers at 0 (start) since it's already revealed on mount.
      const triggerStart = i === 0
        ? `top+=${0} top`
        : `top+=${vh * i - vh * 0.5} top`;

      const switchFlavor = () => {
        if (active === i) return; // already this flavor — skip
        setActive(i);

        // Hide every OTHER flavor instantly
        FLAVORS.forEach((_, j) => {
          if (j === i) return;
          const l = layerRefs.current[j];
          const p = popRefs.current[j];
          const s = splashRefs.current[j];
          const t = titleRefs.current[j];
          const u = subRefs.current[j];
          if (l && p && s && t && u) {
            hideFlavor(p, s, t, u, l, floatTweens.current[j]);
          }
        });

        // Reveal this flavor
        revealFlavor(pop, splash, title, sub, layer, bg, flavor.bg, ft);
      };

      ScrollTrigger.create({
        trigger: wrap,
        start: triggerStart,
        // End doesn't matter for onEnter/onEnterBack — we use start crossing
        end: `top+=${vh * TOTAL} top`,
        onEnter: switchFlavor,
        onEnterBack: switchFlavor,
      });
    });

  }, { scope: wrapRef });

  // ── DOT CLICK NAV ────────────────────────────────────────────────────────
  const scrollToFlavor = (i: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wrapTop = wrap.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: wrapTop + window.innerHeight * i, behavior: "smooth" });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // JSX
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Space+Mono&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ih-wrap {
          position: relative;
          width: 100%;
        }

        .ih-pinned {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        /* ── Background ── */
        .ih-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .ih-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 55% at 50% 65%,
            rgba(255,255,255,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ── Film grain ── */
        .ih-grain {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 160px 160px;
          mix-blend-mode: overlay;
        }

        /* ── Vignette ── */
        .ih-vignette {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background:
            radial-gradient(ellipse 110% 45% at 50% 100%, rgba(0,0,0,0.5) 0%, transparent 65%),
            radial-gradient(ellipse 120% 25% at 50% 0%,   rgba(0,0,0,0.2) 0%, transparent 55%);
        }

        /* ── Flavor layer ── */
        .ih-layer {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ── Title ── */
        .ih-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(2.8rem, 8.5vw, 7.5rem);
          letter-spacing: 0.28em;
          text-transform: uppercase;
          line-height: 1;
          margin-top: clamp(28px, 6vh, 56px);
          text-align: center;
          padding: 0 1.5rem;
          will-change: opacity, transform;
        }

        /* ── Subtitle ── */
        .ih-sub {
          font-family: 'Space Mono', monospace;
          font-size: clamp(0.5rem, 1vw, 0.72rem);
          letter-spacing: 0.36em;
          text-transform: lowercase;
          margin-top: 10px;
          text-align: center;
          will-change: opacity, transform;
        }

        /* ── Popsicle ── */
        .ih-pop {
          position: absolute;
          left: 50%;
          top: 50%;
          translate: -50% -54%;
          width: clamp(160px, 22vw, 320px);
          z-index: 10;
          will-change: transform, opacity;
          perspective: 900px;
        }
        .ih-pop img {
          width: 100%;
          height: auto;
          display: block;
          filter:
            drop-shadow(0 28px 52px rgba(0,0,0,0.6))
            drop-shadow(0 8px 18px rgba(0,0,0,0.35));
        }

        /* ── Splash ── */
        .ih-splash {
          position: absolute;
          bottom: -2px;
          left: 50%;
          translate: -50% 0;
          width: clamp(260px, 68vw, 800px);
          z-index: 8;
          will-change: transform, opacity, filter;
          transform-origin: center bottom;
        }
        .ih-splash img {
          width: 100%;
          height: auto;
          display: block;
        }
        /* Gloss sweep */
        .ih-splash::after {
          content: '';
          position: absolute;
          top: 0; left: -40%;
          width: 28%;
          height: 100%;
          background: linear-gradient(108deg,
            transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%);
          animation: glossSweep 5s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes glossSweep {
          0%   { left: -40%; opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { left: 110%; opacity: 0; }
        }

        /* ── Nav dots ── */
        .ih-dots {
          position: absolute;
          right: clamp(14px, 2.5vw, 32px);
          top: 50%;
          translate: 0 -50%;
          z-index: 20;
          display: flex;
          flex-direction: column;
          gap: 11px;
        }
        .ih-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.22);
          border: 1px solid rgba(255,255,255,0.12);
          cursor: pointer;
          transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
        }
        .ih-dot.active {
          transform: scale(1.65);
          background: rgba(255,255,255,0.92);
          border-color: rgba(255,255,255,0.5);
          box-shadow: 0 0 10px rgba(255,255,255,0.3);
        }

        /* ── Mobile ── */
        @media (max-width: 600px) {
          .ih-pop    { width: clamp(130px, 36vw, 200px); top: 47%; }
          .ih-splash { width: 90vw; }
          .ih-title  { letter-spacing: 0.16em; }
          .ih-sub    { letter-spacing: 0.2em; font-size: 0.52rem; }
        }
      `}</style>

      {/* TOTAL × 100vh — gives scroll room while pinner is locked */}
      <div
        ref={wrapRef}
        className="ih-wrap"
        style={{ height: `${TOTAL * 100}vh` }}
      >
        {/* 100vh pinned viewport */}
        <div ref={pinnedRef} className="ih-pinned">

          {/* Background color layer */}
          <div ref={bgRef} className="ih-bg" />

          {/* Film grain */}
          <div className="ih-grain" />

          {/* Vignette */}
          <div className="ih-vignette" />

          {/* FLAVOR LAYERS — all stacked, GSAP controls visibility */}
          {FLAVORS.map((flavor, i) => (
            <div
              key={flavor.id}
              ref={(el) => { layerRefs.current[i] = el; }}
              className="ih-layer"
            >
              {/* Flavor title */}
              <div
                ref={(el) => { titleRefs.current[i] = el; }}
                className="ih-title"
                style={{ color: flavor.titleColor }}
              >
                {flavor.title}
              </div>

              {/* Flavor subtitle */}
              <div
                ref={(el) => { subRefs.current[i] = el; }}
                className="ih-sub"
                style={{ color: flavor.subtitleColor }}
              >
                {flavor.subtitle}
              </div>

              {/* Splash (behind pop, z-index 8) */}
              <div
                ref={(el) => { splashRefs.current[i] = el; }}
                className="ih-splash"
              >
                <Image
                  src={flavor.splashImage}
                  alt={`${flavor.title} splash`}
                  width={800}
                  height={440}
                  priority={i === 0}
                  style={{ objectFit: "contain" }}
                />
              </div>

              {/* Popsicle (in front, z-index 10) */}
              <div
                ref={(el) => { popRefs.current[i] = el; }}
                className="ih-pop"
              >
                <Image
                  src={flavor.popImage}
                  alt={`${flavor.title} popsicle`}
                  width={320}
                  height={500}
                  priority={i === 0}
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          ))}

          {/* NAV DOTS */}
          <div className="ih-dots">
            {FLAVORS.map((_, i) => (
              <div
                key={i}
                className={`ih-dot${active === i ? " active" : ""}`}
                onClick={() => scrollToFlavor(i)}
              />
            ))}
          </div>

        </div>
      </div>
    </>
  );
      }
                  
