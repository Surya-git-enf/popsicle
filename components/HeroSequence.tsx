
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
    // ── Pre-Load Setup (All hidden, identical style) ───────────────────────
    // Set all backgrounds hidden off to the right side via clip-path
    gsap.set(".shutter-bg", { clipPath: "inset(0% 0% 0% 100%)" });
    // Hide all flavors off to the right with rotation in 3D void
    gsap.set(".flavor-group", { autoAlpha: 0, xPercent: 30, rotationY: 15 });


    // 1. Surya Entrance Animation - Treating Chocolate like Strawberry
    // Now, Chocolate does NOT start visible. It wipes and swings in on load, 
    // establishing the animation style immediately.
    const initTl = gsap.timeline();
    
    // Background 0 (Chocolate) wipes in
    initTl.to(`.shutter-bg-0`, { 
      clipPath: "inset(0% 0% 0% 0%)", 
      duration: 1.5, 
      ease: "power3.out" 
    })
    // Chocolate group swings in in 3D from the right
    .to(`.flavor-group-0`, {
      xPercent: 0,
      autoAlpha: 1,
      rotationY: 0,
      duration: 1.5,
      ease: "power3.out"
    }, "-=1.2"); // Stagger with background wipe for depth


    // 2. Continuous ambient floating motion
    gsap.to(".pop-image", {
      y: -22, rotation: 2.5, duration: 2.8,
      yoyo: true, repeat: -1, ease: "sine.inOut", stagger: 0.5,
    });
    gsap.to(".splash-image", {
      scale: 1.04, y: 12, duration: 3.6,
      yoyo: true, repeat: -1, ease: "sine.inOut", stagger: 0.7,
    });


    // 3. The Professional 3D Scroll Timeline with snapping physics
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%", // 3 extra scrolls to get through the 4 flavors
        pin: true,     // Native GSAP pinning (avoids mobile black void crash)
        scrub: 0.5,    // Snappy responsiveness
        snap: {
          snapTo: "labelsDirectional", // Perplexity-style native app snap feel
          duration: { min: 0.3, max: 0.6 },
          delay: 0,    // React instantly to input
          ease: "power2.inOut" 
        },
      },
    });

    tl.addLabel("flavor0", 0);

    // 4. Build identical transitions for ALL subsequent flavors
    FLAVORS.forEach((_, i) => {
      if (i === 0) return; // Flavor 0 handled by initTl

      // Background wipes in from right
      tl.to(`.shutter-bg-${i}`, { 
        clipPath: "inset(0% 0% 0% 0%)", 
        duration: 1, 
        ease: "power2.inOut" 
      }, i - 1);

      // Previous flavor swings out to the left void
      tl.to(`.flavor-group-${i - 1}`, {
        xPercent: -30,
        opacity: 0,
        rotationY: -15,
        duration: 1,
        ease: "power2.inOut"
      }, i - 1);

      // Current flavor swings in from the right void
      tl.to(`.flavor-group-${i}`, {
        xPercent: 0,
        autoAlpha: 1,
        rotationY: 0,
        duration: 1,
        ease: "power2.inOut"
      }, i - 1);

      tl.addLabel(`flavor${i}`, i); 
    });

  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black"
      style={{ perspective: "1200px" }} // Critical for 3D depth and swing transitions
    >
      
      {/* ── BACKGROUND CANVAS / SHUTTERS ── */}
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
          style={{ transformStyle: "preserve-3d" }} // Required for perspective on children
        >
          
          {/* Opacity Gradient Typography — top 8%, centered */}
          <div className="absolute top-[8%] md:top-[10%] w-full flex justify-center z-10 pointer-events-none">
            <h1 
              className="text-[15vw] font-black tracking-tighter uppercase"
              style={{ 
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                // Opacity fades from transparent at top to solid hex color at bottom
                background: `linear-gradient(to bottom, ${flavor.textHex}00 0%, ${flavor.textHex} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textAlign: "center"
              }}
            >
              {flavor.title}
            </h1>
          </div>

          {/* Popsicle — centered, separated layers for 3D float vs. transition motion */}
          <div className="absolute top-[12%] z-30 w-full flex items-center justify-center pointer-events-none">
            <div className="pop-image relative w-[280px] h-[550px] md:w-[380px] md:h-[750px]" style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.35))" }}>
              <Image 
                src={`/images/${flavor.id}-pop.png`} 
                alt={flavor.title} 
                fill 
                className="object-contain object-center" 
                priority={i === 0} 
              />
            </div>
          </div>

          {/* Splash — pinned to bottom, separated layers for 3D float vs. transition motion */}
          <div className="absolute bottom-0 z-20 w-full h-[40vh] md:h-[45vh] pointer-events-none flex items-end justify-center">
            <div className="splash-image relative w-full h-full">
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

      {/* ── SURYA PRO WATERMARK — artist's signature ────────────────── */}
      <div className="absolute bottom-6 right-8 z-50 pointer-events-none opacity-60">
        <p className="font-mono text-[10px] tracking-[0.3em] text-white uppercase mix-blend-difference">
          3D Experience by Surya
        </p>
      </div>

    </div>
  );
}
