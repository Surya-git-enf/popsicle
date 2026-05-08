
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
  { id: "vanilla",    title: "VANILLA",    bg: "#3E2723", textHex: "#FFFFFF" },
  { id: "pistachio",  title: "PISTACHIO",  bg: "#A5D6A7", textHex: "#1B5E20" },
];

export default function HeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // ── 1. INITIAL LOAD STATES ──────────────────────────────────────────────
    // Push all backgrounds off to the right
    gsap.set(".shutter-bg", { clipPath: "inset(0% 0% 0% 100%)" });
    
    // Hide the master groups and tilt them in 3D
    gsap.set(".flavor-group", { autoAlpha: 0, xPercent: 20, rotationY: 10 });
    
    // Hide all internal elements so they can animate in INDIVIDUALLY
    gsap.set(".hs-text", { opacity: 0, y: 60 });
    gsap.set(".hs-pop", { yPercent: 100, rotation: 35 });
    gsap.set(".hs-splash", { yPercent: 60, opacity: 0 });

    // ── 2. CHOCOLATE (FLAVOR 0) ENTRANCE ────────────────────────────────────
    const initTl = gsap.timeline();
    
    initTl.to(".shutter-bg-0", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.inOut" })
          .to(".flavor-group-0", { autoAlpha: 1, xPercent: 0, rotationY: 0, duration: 1, ease: "power3.out" }, "-=0.8")
          // Individual element reveals!
          .to(".flavor-group-0 .hs-text", { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.8")
          .to(".flavor-group-0 .hs-pop", { yPercent: 0, rotation: 0, duration: 1.2, ease: "expo.out" }, "-=0.8")
          .to(".flavor-group-0 .hs-splash", { yPercent: 0, opacity: 1, duration: 1, ease: "power2.out" }, "-=0.8");

    // ── 3. CONTINUOUS "LOVE MOTIONS" (3D FLOATING) ──────────────────────────
    gsap.to(".float-pop", {
      y: -20, rotationX: 8, rotationY: 4, duration: 3,
      yoyo: true, repeat: -1, ease: "sine.inOut", stagger: 0.2
    });

    gsap.to(".float-splash", {
      y: 12, scale: 1.05, rotationX: -8, duration: 4,
      yoyo: true, repeat: -1, ease: "sine.inOut", stagger: 0.3
    });

    // ── 4. PERPLEXITY SCROLL & SNAP TIMELINE ────────────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%", 
        pin: true,
        scrub: 0.5, // Butter smooth drag
        snap: {
          snapTo: "labelsDirectional", // Instant locking
          duration: { min: 0.4, max: 0.7 },
          delay: 0, 
          ease: "power2.inOut" 
        },
      },
    });

    tl.addLabel("flavor0", 0);

    FLAVORS.forEach((_, i) => {
      if (i === 0) return; 

      // 1. Shutter background wipe
      tl.to(`.shutter-bg-${i}`, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power2.inOut" }, i - 1);

      // 2. Animate previous flavor OUT (Individual elements disappear)
      tl.to(`.flavor-group-${i - 1} .hs-text`, { opacity: 0, y: -60, duration: 0.5, ease: "power2.in" }, i - 1);
      tl.to(`.flavor-group-${i - 1} .hs-pop`, { yPercent: -100, rotation: -20, duration: 0.5, ease: "power2.in" }, i - 1);
      tl.to(`.flavor-group-${i - 1} .hs-splash`, { yPercent: 60, opacity: 0, duration: 0.5, ease: "power2.in" }, i - 1);
      tl.to(`.flavor-group-${i - 1}`, { autoAlpha: 0, xPercent: -20, rotationY: -10, duration: 0.8 }, i - 1);

      // 3. Animate new flavor IN (Individual elements appear)
      tl.to(`.flavor-group-${i}`, { autoAlpha: 1, xPercent: 0, rotationY: 0, duration: 0.8, ease: "power2.out" }, i - 0.8);
      tl.to(`.flavor-group-${i} .hs-text`, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, i - 0.6);
      tl.to(`.flavor-group-${i} .hs-pop`, { yPercent: 0, rotation: 0, duration: 1, ease: "expo.out" }, i - 0.6);
      tl.to(`.flavor-group-${i} .hs-splash`, { yPercent: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, i - 0.6);

      tl.addLabel(`flavor${i}`, i); 
    });

  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black"
      style={{ perspective: "1200px" }} 
    >
      
      {/* ── BACKGROUND SHUTTERS ── */}
      <div className="absolute inset-0 z-0">
        {FLAVORS.map((flavor, i) => (
          <div
            key={`bg-${flavor.id}`}
            className={`shutter-bg shutter-bg-${i} absolute inset-0 w-full h-full`}
            style={{ backgroundColor: flavor.bg, zIndex: i }}
          />
        ))}
      </div>

      {/* ── 3D FLAVOR GROUPS ── */}
      {FLAVORS.map((flavor, i) => (
        <div 
          key={`group-${flavor.id}`} 
          className={`flavor-group flavor-group-${i} absolute inset-0 z-10 flex flex-col items-center justify-center`}
          style={{ transformStyle: "preserve-3d" }} 
        >
          
          {/* Typography */}
          <div className="hs-text absolute top-[8%] md:top-[10%] w-full flex justify-center z-10 pointer-events-none">
            <h1 
              className="text-[15vw] font-black tracking-tighter uppercase"
              style={{ 
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                background: `linear-gradient(to bottom, ${flavor.textHex}00 0%, ${flavor.textHex} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textAlign: "center"
              }}
            >
              {flavor.title}
            </h1>
          </div>

          {/* Popsicle (hs-pop handles scroll entry, float-pop handles continuous floating) */}
          <div className="hs-pop absolute top-[12%] z-30 w-full flex items-center justify-center pointer-events-none">
            <div className="float-pop relative w-[280px] h-[550px] md:w-[380px] md:h-[750px]" style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.35))" }}>
              <Image 
                src={`/images/${flavor.id}-pop.png`} 
                alt={flavor.title} 
                fill 
                className="object-contain object-center" 
                priority={i === 0} 
              />
            </div>
          </div>

          {/* Splash (hs-splash handles scroll entry, float-splash handles continuous floating) */}
          <div className="hs-splash absolute bottom-0 z-20 w-full h-[40vh] md:h-[45vh] pointer-events-none flex items-end justify-center">
            <div className="float-splash relative w-full h-full">
              <Image 
                src={`/images/${flavor.id}-splash.png`} 
                alt={`${flavor.title} Splash`} 
                fill 
                className="object-cover object-bottom" 
                priority={i === 0} 
              />
            </div>
          </div>

        </div>
      ))}

      {/* ── SURYA PRO WATERMARK ── */}
      <div className="absolute bottom-6 right-8 z-50 pointer-events-none opacity-60">
        <p className="font-mono text-[10px] tracking-[0.3em] text-white uppercase mix-blend-difference">
          3D Experience by Surya
        </p>
      </div>

    </div>
  );
}
