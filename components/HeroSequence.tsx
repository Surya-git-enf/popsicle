
"use client";

/**
 * IceCreamHero — Premium 3D Snap-Scroll Product Showcase
 *
 * Architecture:
 *  - TOTAL × 100vh outer scroll container
 *  - ScrollTrigger pins the 100vh stage while scroll burns through the height
 *  - Separate ScrollTrigger handles snap (no scrub — discrete onEnter callbacks)
 *  - Each flavor switch: camera-push 3D exit → instant swap → 3D entry
 *  - True CSS perspective stage with translateZ depth layers
 *  - Per-character title split animation (staggered Y + blur)
 *  - Particle shimmer layer (canvas) tied to active flavor
 *  - Idle float + subtle slow rotation loop on popsicle
 */

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// FLAVOR DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────
interface Flavor {
  id: string;
  title: string;
  subtitle: string;
  tag: string;          // small label top-left
  popImage: string;
  splashImage: string;
  bg: string;           // deep background
  midColor: string;     // radial mid glow
  titleColor: string;
  subtitleColor: string;
  accentColor: string;  // line + particle color
  particle: string;     // particle rgba
}

const FLAVORS: Flavor[] = [
  {
    id: "chocolate",
    title: "CHOCOLATE",
    subtitle: "dark · roasted · indulgent",
    tag: "No. 01",
    popImage: "/images/chocolate-pop.png",
    splashImage: "/images/chocolate-splash.png",
    bg: "#160C05",
    midColor: "#4A2C10",
    titleColor: "#F2DDB8",
    subtitleColor: "#A8875A",
    accentColor: "#C8832A",
    particle: "rgba(200,131,42,",
  },
  {
    id: "strawberry",
    title: "STRAWBERRY",
    subtitle: "ripe · bright · sun-kissed",
    tag: "No. 02",
    popImage: "/images/strawberry-pop.png",
    splashImage: "/images/strawberry-splash.png",
    bg: "#1A0510",
    midColor: "#5C1530",
    titleColor: "#FFD0DC",
    subtitleColor: "#C4607A",
    accentColor: "#FF5476",
    particle: "rgba(255,84,118,",
  },
  {
    id: "vanilla",
    title: "VANILLA",
    subtitle: "soft · creamy · timeless",
    tag: "No. 03",
    popImage: "/images/vanilla-pop.png",
    splashImage: "/images/vanilla-splash.png",
    bg: "#151008",
    midColor: "#3D2E15",
    titleColor: "#FFF6E8",
    subtitleColor: "#B09A6E",
    accentColor: "#E8C87A",
    particle: "rgba(232,200,122,",
  },
  {
    id: "pistachio",
    title: "PISTACHIO",
    subtitle: "earthy · aromatic · rare",
    tag: "No. 04",
    popImage: "/images/pistachio-pop.png",
    splashImage: "/images/pistachio-splash.png",
    bg: "#060F09",
    midColor: "#163320",
    titleColor: "#C8E8CC",
    subtitleColor: "#6DA878",
    accentColor: "#5EC87A",
    particle: "rgba(94,200,122,",
  },
];

const TOTAL = FLAVORS.length;

// ─────────────────────────────────────────────────────────────────────────────
// PARTICLE CANVAS
// Draws floating shimmer dots in the accent color of the active flavor.
// ─────────────────────────────────────────────────────────────────────────────
interface Particle {
  x: number; y: number; r: number;
  vx: number; vy: number; alpha: number; va: number;
}

function useParticles(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  color: string
) {
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const colorRef = useRef(color);

  useEffect(() => { colorRef.current = color; }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    const resize = () => {
      w = canvas.width  = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Spawn particles
    particlesRef.current = Array.from({ length: 55 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.2 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.55 - 0.15,
      alpha: Math.random() * 0.5 + 0.1,
      va: (Math.random() - 0.5) * 0.006,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      particlesRef.current.forEach((p) => {
        p.x  += p.vx;
        p.y  += p.vy;
        p.alpha = Math.min(0.65, Math.max(0.05, p.alpha + p.va));

        if (p.y < -10)  { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10)  p.x = w + 10;
        if (p.x > w+10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = colorRef.current + p.alpha + ")";
        ctx.fill();
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);
}

// ─────────────────────────────────────────────────────────────────────────────
// SPLIT TITLE into per-character spans for stagger animation
// ─────────────────────────────────────────────────────────────────────────────
function SplitTitle({
  text,
  color,
  divRef,
}: {
  text: string;
  color: string;
  divRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={divRef} className="ih-title" aria-label={text}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="ih-char"
          style={{ color, display: "inline-block" }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

/** Hide a flavor: kill tweens, reset to entry 3D state */
function hideFlavor(
  layer: HTMLDivElement,
  pop: HTMLDivElement,
  splash: HTMLDivElement,
  titleEl: HTMLDivElement,
  sub: HTMLDivElement,
  lineEl: HTMLDivElement,
  tagEl: HTMLDivElement,
  floatTween: gsap.core.Tween,
  numTween: gsap.core.Tween,
) {
  floatTween.pause();
  numTween.pause();
  gsap.killTweensOf([pop, splash, sub, lineEl, tagEl]);

  // Kill per-char tweens
  const chars = titleEl.querySelectorAll(".ih-char");
  gsap.killTweensOf(chars);

  gsap.set(layer, { autoAlpha: 0 });

  // Pop: pushed back in Z, tilted
  gsap.set(pop, {
    scale: 0.55,
    z: -220,
    y: 80,
    x: -18,
    rotateX: 22,
    rotateZ: -10,
    rotateY: 8,
    opacity: 0,
    filter: "blur(8px)",
  });

  // Splash: below, blurred
  gsap.set(splash, {
    scale: 0.78,
    scaleX: 0.65,
    y: 50,
    z: -180,
    opacity: 0,
    filter: "blur(10px)",
  });

  // Text elements
  gsap.set(chars,  { opacity: 0, y: 32, filter: "blur(6px)" });
  gsap.set(sub,    { opacity: 0, y: 12, letterSpacing: "0.5em" });
  gsap.set(lineEl, { scaleX: 0, opacity: 0 });
  gsap.set(tagEl,  { opacity: 0, x: -12 });
}

/** Reveal a flavor: full 3D entry animation */
function revealFlavor(
  layer: HTMLDivElement,
  pop: HTMLDivElement,
  splash: HTMLDivElement,
  titleEl: HTMLDivElement,
  sub: HTMLDivElement,
  lineEl: HTMLDivElement,
  tagEl: HTMLDivElement,
  bgEl: HTMLDivElement,
  glowEl: HTMLDivElement,
  flavor: Flavor,
  floatTween: gsap.core.Tween,
  numTween: gsap.core.Tween,
) {
  gsap.set(layer, { autoAlpha: 1 });

  // Background transition
  gsap.to(bgEl,   { backgroundColor: flavor.bg,       duration: 0.55, ease: "power2.inOut" });
  gsap.to(glowEl, { backgroundColor: flavor.midColor, duration: 0.55, ease: "power2.inOut" });

  const tl = gsap.timeline({
    onComplete: () => {
      floatTween.restart();
      numTween.restart();
    },
  });

  // ── Popsicle: Z-push forward with 3D perspective ──
  tl.fromTo(pop,
    { scale: 0.55, z: -220, y: 80, x: -18, rotateX: 22, rotateZ: -10, rotateY: 8, opacity: 0, filter: "blur(8px)" },
    { scale: 1,    z: 0,    y: 0,  x: 0,   rotateX: 0,  rotateZ: 0,   rotateY: 0, opacity: 1, filter: "blur(0px)",
      duration: 0.9, ease: "expo.out" },
    0
  );

  // ── Splash: rises from below as pop comes forward ──
  tl.fromTo(splash,
    { scale: 0.78, scaleX: 0.65, y: 50, z: -180, opacity: 0, filter: "blur(10px)" },
    { scale: 1,    scaleX: 1,    y: 0,  z: 0,    opacity: 1, filter: "blur(0px)",
      duration: 0.75, ease: "power4.out" },
    0.08
  );

  // ── Tag label slides in ──
  tl.fromTo(tagEl,
    { opacity: 0, x: -16 },
    { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" },
    0.2
  );

  // ── Thin accent line scales in ──
  tl.fromTo(lineEl,
    { scaleX: 0, opacity: 0 },
    { scaleX: 1, opacity: 1, duration: 0.5, ease: "expo.out", transformOrigin: "left center" },
    0.25
  );

  // ── Title chars: staggered Y + blur ──
  const chars = titleEl.querySelectorAll(".ih-char");
  tl.fromTo(chars,
    { opacity: 0, y: 38, filter: "blur(8px)" },
    { opacity: 1, y: 0,  filter: "blur(0px)",
      stagger: { each: 0.032, from: "start" },
      duration: 0.55, ease: "back.out(1.8)" },
    0.18
  );

  // ── Subtitle: tracks in letter-by-letter feel via letterSpacing ──
  tl.fromTo(sub,
    { opacity: 0, y: 10, letterSpacing: "0.55em" },
    { opacity: 1, y: 0,  letterSpacing: "0.32em",
      duration: 0.5, ease: "power3.out" },
    0.52
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function IceCreamHero() {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const stageRef   = useRef<HTMLDivElement>(null);  // the perspective stage (pinned)
  const bgRef      = useRef<HTMLDivElement>(null);
  const glowRef    = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);

  // Per-flavor element refs
  const layerRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const popRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const splashRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const subRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const tagRefs    = useRef<(HTMLDivElement | null)[]>([]);

  const floatTweens = useRef<gsap.core.Tween[]>([]);
  const numTweens   = useRef<gsap.core.Tween[]>([]);  // slow idle rotation

  const [active, setActive]         = useState(0);
  const [transitioning, setTrans]   = useState(false);

  // Particle canvas — color updates with active flavor
  useParticles(canvasRef as React.RefObject<HTMLCanvasElement>, FLAVORS[active].particle);

  // ── GSAP SETUP ──────────────────────────────────────────────────────────
  useGSAP(() => {
    const wrap  = wrapRef.current;
    const stage = stageRef.current;
    const bg    = bgRef.current;
    const glow  = glowRef.current;
    if (!wrap || !stage || !bg || !glow) return;

    // ── 1. INITIAL STATES ──
    FLAVORS.forEach((_, i) => {
      const layer  = layerRefs.current[i];
      const pop    = popRefs.current[i];
      const splash = splashRefs.current[i];
      const title  = titleRefs.current[i];
      const sub    = subRefs.current[i];
      const line   = lineRefs.current[i];
      const tag    = tagRefs.current[i];
      if (!layer || !pop || !splash || !title || !sub || !line || !tag) return;

      gsap.set(layer, { autoAlpha: 0 });

      gsap.set(pop, {
        scale: 0.55, z: -220, y: 80, x: -18,
        rotateX: 22, rotateZ: -10, rotateY: 8,
        opacity: 0, filter: "blur(8px)",
        transformOrigin: "center bottom",
        transformPerspective: 1100,
      });

      gsap.set(splash, {
        scale: 0.78, scaleX: 0.65, y: 50, z: -180,
        opacity: 0, filter: "blur(10px)",
        transformOrigin: "center bottom",
        transformPerspective: 1100,
      });

      const chars = title.querySelectorAll(".ih-char");
      gsap.set(chars,  { opacity: 0, y: 38, filter: "blur(8px)" });
      gsap.set(sub,    { opacity: 0, y: 12, letterSpacing: "0.55em" });
      gsap.set(line,   { scaleX: 0, opacity: 0 });
      gsap.set(tag,    { opacity: 0, x: -12 });

      // Idle float — gentle Y oscillation
      floatTweens.current[i] = gsap.to(pop, {
        y: "-=14",
        duration: 2.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        paused: true,
      });

      // Idle slow rotation — very subtle X+Z wobble
      numTweens.current[i] = gsap.to(pop, {
        rotateZ: "+=2.5",
        rotateX: "+=1.5",
        duration: 4.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        paused: true,
      });
    });

    // ── 2. BACKGROUND INITIAL ──
    gsap.set(bg,   { backgroundColor: FLAVORS[0].bg });
    gsap.set(glow, { backgroundColor: FLAVORS[0].midColor });

    // ── 3. REVEAL FLAVOR 0 ON MOUNT ──
    const f = FLAVORS[0];
    revealFlavor(
      layerRefs.current[0]!, popRefs.current[0]!, splashRefs.current[0]!,
      titleRefs.current[0]!, subRefs.current[0]!, lineRefs.current[0]!,
      tagRefs.current[0]!,  bg, glow, f,
      floatTweens.current[0], numTweens.current[0]
    );

    // ── 4. PIN THE STAGE ──
    ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: `+=${window.innerHeight * (TOTAL - 1)}`,
      pin: stage,
      pinSpacing: true,
      anticipatePin: 1,
    });

    // ── 5. SNAP ──
    ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: `+=${window.innerHeight * (TOTAL - 1)}`,
      snap: {
        snapTo: 1 / (TOTAL - 1),
        duration: { min: 0.35, max: 0.65 },
        delay: 0.04,
        ease: "expo.inOut",
      },
    });

    // ── 6. PER-FLAVOR DISCRETE TRIGGERS ──
    FLAVORS.forEach((flavor, i) => {
      const layer  = layerRefs.current[i];
      const pop    = popRefs.current[i];
      const splash = splashRefs.current[i];
      const title  = titleRefs.current[i];
      const sub    = subRefs.current[i];
      const line   = lineRefs.current[i];
      const tag    = tagRefs.current[i];
      if (!layer || !pop || !splash || !title || !sub || !line || !tag) return;

      const ft = floatTweens.current[i];
      const nt = numTweens.current[i];
      const vh = window.innerHeight;

      // Switch at midpoint of each zone (feels decisive, not laggy)
      const triggerScroll = i === 0 ? 1 : vh * i - vh * 0.45;

      const doSwitch = () => {
        setActive(i);

        // Hide all others immediately
        FLAVORS.forEach((_, j) => {
          if (j === i) return;
          const l = layerRefs.current[j], p = popRefs.current[j];
          const s = splashRefs.current[j], t = titleRefs.current[j];
          const u = subRefs.current[j],   ln = lineRefs.current[j];
          const tg = tagRefs.current[j];
          if (l && p && s && t && u && ln && tg) {
            hideFlavor(l, p, s, t, u, ln, tg, floatTweens.current[j], numTweens.current[j]);
          }
        });

        revealFlavor(layer, pop, splash, title, sub, line, tag, bg!, glow!, flavor, ft, nt);
      };

      ScrollTrigger.create({
        trigger: wrap,
        start: `top+=${triggerScroll} top`,
        end: `top+=${vh * TOTAL} top`,
        onEnter: doSwitch,
        onEnterBack: doSwitch,
      });
    });

  }, { scope: wrapRef });

  // ── DOT NAVIGATION ──────────────────────────────────────────────────────
  const scrollToFlavor = (i: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const top = wrap.getBoundingClientRect().top + window.scrollY + window.innerHeight * i;
    window.scrollTo({ top, behavior: "smooth" });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300&family=DM+Mono:wght@300;400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── SCROLL CONTAINER ── */
        .ih-wrap { position: relative; width: 100%; }

        /* ── PINNED PERSPECTIVE STAGE ── */
        .ih-stage {
          position: relative;
          width: 100%;
          height: 100dvh;
          overflow: hidden;
          /* True CSS 3D perspective for the whole scene */
          perspective: 1100px;
          perspective-origin: 50% 48%;
        }

        /* ── DEEP BACKGROUND ── */
        .ih-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          transition: background-color 0.55s ease;
        }

        /* ── RADIAL GLOW (mid-depth light source) ── */
        .ih-glow {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: radial-gradient(ellipse 62% 52% at 50% 62%, var(--glow) 0%, transparent 72%);
          mix-blend-mode: screen;
          opacity: 0.45;
          pointer-events: none;
        }

        /* ── FILM GRAIN ── */
        .ih-grain {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          opacity: 0.038;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px 180px;
          mix-blend-mode: overlay;
        }

        /* ── PARTICLE CANVAS ── */
        .ih-canvas {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          width: 100%;
          height: 100%;
        }

        /* ── VIGNETTE ── */
        .ih-vignette {
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
          background:
            radial-gradient(ellipse 120% 50% at 50% 100%, rgba(0,0,0,0.72) 0%, transparent 60%),
            radial-gradient(ellipse 80%  20% at 50% 0%,   rgba(0,0,0,0.28) 0%, transparent 55%),
            radial-gradient(ellipse 20%  80% at 0%   50%, rgba(0,0,0,0.18) 0%, transparent 50%),
            radial-gradient(ellipse 20%  80% at 100% 50%, rgba(0,0,0,0.18) 0%, transparent 50%);
        }

        /* ── FLAVOR LAYER (stacked absolute, GSAP drives visibility) ── */
        .ih-layer {
          position: absolute;
          inset: 0;
          z-index: 5;
          /* preserve-3d so children can use Z translations */
          transform-style: preserve-3d;
        }

        /* ── TAG (top-left flavor number) ── */
        .ih-tag {
          position: absolute;
          top: clamp(20px, 4vh, 40px);
          left: clamp(20px, 4vw, 48px);
          font-family: 'DM Mono', monospace;
          font-size: clamp(0.55rem, 0.8vw, 0.7rem);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          will-change: opacity, transform;
        }

        /* ── ACCENT LINE ── */
        .ih-line {
          position: absolute;
          top: clamp(20px, 4vh, 40px);
          left: clamp(70px, 10vw, 110px);
          width: clamp(28px, 5vw, 60px);
          height: 1px;
          /* color set inline per flavor */
          opacity: 0.6;
          transform-origin: left center;
          will-change: transform, opacity;
        }

        /* ── TITLE BLOCK (top-center) ── */
        .ih-title-wrap {
          position: absolute;
          top: clamp(14px, 3.5vh, 34px);
          left: 0; right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .ih-title {
          font-family: 'Playfair Display', serif;
          font-weight: 300;
          font-size: clamp(3rem, 7.5vw, 7rem);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          line-height: 1;
          text-align: center;
          will-change: opacity, transform, filter;
          overflow: visible;
          /* no color — set on each .ih-char */
        }

        .ih-char {
          display: inline-block;
          will-change: opacity, transform, filter;
        }

        .ih-sub {
          font-family: 'DM Mono', monospace;
          font-weight: 300;
          font-size: clamp(0.5rem, 0.9vw, 0.68rem);
          letter-spacing: 0.32em;
          text-transform: lowercase;
          text-align: center;
          will-change: opacity, transform, letter-spacing;
        }

        /* ── POPSICLE ── */
        .ih-pop {
          position: absolute;
          left: 50%;
          top: 50%;
          /* CSS translate for base position; GSAP animates the rest */
          translate: -50% -52%;
          width: clamp(155px, 20vw, 310px);
          z-index: 10;
          will-change: transform, opacity, filter;
          transform-style: preserve-3d;
        }

        .ih-pop img {
          width: 100%;
          height: auto;
          display: block;
          filter:
            drop-shadow(0 32px 60px rgba(0,0,0,0.65))
            drop-shadow(0 10px 22px rgba(0,0,0,0.4))
            drop-shadow(0 0 80px rgba(255,255,255,0.04));
        }

        /* ── SPLASH ── */
        .ih-splash {
          position: absolute;
          bottom: -4px;
          left: 50%;
          translate: -50% 0;
          width: clamp(240px, 65vw, 780px);
          z-index: 8;
          will-change: transform, opacity, filter;
          transform-origin: center bottom;
          transform-style: preserve-3d;
        }

        .ih-splash img {
          width: 100%;
          height: auto;
          display: block;
        }

        /* Gloss sweep across splash */
        .ih-splash::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            transparent 0%,
            rgba(255,255,255,0.06) 45%,
            transparent 90%
          );
          animation: glossSweep 6s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
        }
        @keyframes glossSweep {
          0%   { opacity: 0; transform: translateX(-60%); }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { opacity: 0; transform: translateX(120%); }
        }

        /* ── FLAVOR INDEX (bottom-left) ── */
        .ih-index {
          position: absolute;
          bottom: clamp(20px, 4vh, 42px);
          left: clamp(20px, 4vw, 48px);
          z-index: 20;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .ih-index-current {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.2rem, 4vw, 3.5rem);
          font-weight: 300;
          line-height: 1;
          color: rgba(255,255,255,0.12);
          letter-spacing: 0.05em;
          transition: color 0.4s ease;
        }
        .ih-index-total {
          font-family: 'DM Mono', monospace;
          font-size: clamp(0.55rem, 0.8vw, 0.68rem);
          letter-spacing: 0.25em;
          color: rgba(255,255,255,0.22);
        }

        /* ── NAV DOTS (right edge) ── */
        .ih-dots {
          position: absolute;
          right: clamp(16px, 2.8vw, 36px);
          top: 50%;
          translate: 0 -50%;
          z-index: 20;
          display: flex;
          flex-direction: column;
          gap: 14px;
          align-items: center;
        }
        .ih-dot-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .ih-dot-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.48rem;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0);
          text-transform: uppercase;
          transition: color 0.35s ease, transform 0.35s ease;
          transform: translateX(6px);
          white-space: nowrap;
          pointer-events: none;
        }
        .ih-dot-wrap.active .ih-dot-label {
          color: rgba(255,255,255,0.4);
          transform: translateX(0);
        }
        .ih-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.1);
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
                      background 0.35s ease,
                      box-shadow 0.35s ease;
          flex-shrink: 0;
        }
        .ih-dot-wrap.active .ih-dot {
          transform: scale(1.7);
          background: rgba(255,255,255,0.9);
          border-color: rgba(255,255,255,0.5);
          box-shadow: 0 0 12px rgba(255,255,255,0.35);
        }

        /* ── MOBILE ADJUSTMENTS ── */
        @media (max-width: 600px) {
          .ih-pop    { width: clamp(120px, 34vw, 190px); top: 47%; }
          .ih-splash { width: 88vw; }
          .ih-title  { font-size: clamp(2.2rem, 10vw, 4rem); letter-spacing: 0.12em; }
          .ih-tag, .ih-line { display: none; }
          .ih-dot-label { display: none; }
          .ih-index  { display: none; }
        }

        @media (max-width: 380px) {
          .ih-pop { width: 110px; }
        }
      `}</style>

      {/* ── OUTER SCROLL CONTAINER (TOTAL × 100vh) ── */}
      <div
        ref={wrapRef}
        className="ih-wrap"
        style={{ height: `${TOTAL * 100}vh` }}
      >
        {/* ── PINNED PERSPECTIVE STAGE ── */}
        <div ref={stageRef} className="ih-stage">

          {/* Deep background */}
          <div ref={bgRef} className="ih-bg" />

          {/* Mid glow — CSS var updated via inline style per flavor */}
          <div
            ref={glowRef}
            className="ih-glow"
            style={{ "--glow": FLAVORS[active].midColor } as React.CSSProperties}
          />

          {/* Film grain */}
          <div className="ih-grain" />

          {/* Particle shimmer */}
          <canvas ref={canvasRef} className="ih-canvas" />

          {/* Vignette */}
          <div className="ih-vignette" />

          {/* ── FLAVOR LAYERS ── */}
          {FLAVORS.map((flavor, i) => (
            <div
              key={flavor.id}
              ref={(el) => { layerRefs.current[i] = el; }}
              className="ih-layer"
            >
              {/* Flavor number tag */}
              <div
                ref={(el) => { tagRefs.current[i] = el; }}
                className="ih-tag"
              >
                {flavor.tag}
              </div>

              {/* Accent line */}
              <div
                ref={(el) => { lineRefs.current[i] = el; }}
                className="ih-line"
                style={{ backgroundColor: flavor.accentColor }}
              />

              {/* Title + subtitle — centered top */}
              <div className="ih-title-wrap">
                <SplitTitle
                  text={flavor.title}
                  color={flavor.titleColor}
                  divRef={(el) => { titleRefs.current[i] = el; }}
                />
                <div
                  ref={(el) => { subRefs.current[i] = el; }}
                  className="ih-sub"
                  style={{ color: flavor.subtitleColor }}
                >
                  {flavor.subtitle}
                </div>
              </div>

              {/* Splash (z-index 8 — behind pop) */}
              <div
                ref={(el) => { splashRefs.current[i] = el; }}
                className="ih-splash"
              >
                <Image
                  src={flavor.splashImage}
                  alt={`${flavor.title} cream splash`}
                  width={780}
                  height={430}
                  priority={i === 0}
                  style={{ objectFit: "contain" }}
                />
              </div>

              {/* Popsicle (z-index 10 — in front) */}
              <div
                ref={(el) => { popRefs.current[i] = el; }}
                className="ih-pop"
              >
                <Image
                  src={flavor.popImage}
                  alt={`${flavor.title} popsicle`}
                  width={310}
                  height={490}
                  priority={i === 0}
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          ))}

          {/* ── BOTTOM-LEFT INDEX ── */}
          <div className="ih-index">
            <div className="ih-index-current" style={{ color: `${FLAVORS[active].accentColor}22` }}>
              0{active + 1}
            </div>
            <div className="ih-index-total">/ 0{TOTAL}</div>
          </div>

          {/* ── RIGHT NAV DOTS ── */}
          <div className="ih-dots">
            {FLAVORS.map((flavor, i) => (
              <div
                key={i}
                className={`ih-dot-wrap${active === i ? " active" : ""}`}
                onClick={() => scrollToFlavor(i)}
              >
                <span className="ih-dot-label">{flavor.id}</span>
                <div className="ih-dot" />
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
                        }
