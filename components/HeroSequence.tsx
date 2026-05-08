
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
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Continuous 3D Floating "Love Motions" (Untouched! 💖)
    gsap.to(".pop-image", {
      y: -25,
      rotationX: 10,
      rotationY: 5,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      stagger: 0.2
    });

    gsap.to(".splash-image", {
      y: 15,
      scale: 1.05,
      rotationX: -10, 
      duration: 4,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      stagger: 0.3
    });

    // 2. Initial Setup
    gsap.set(".shutter-bg:not(.shutter-bg-0)", { clipPath: "inset(0% 0% 0% 100%)" });
    gsap.set(".flavor-group:not(.flavor-group-0)", { autoAlpha: 0, xPercent: 30, rotationY: 15 });

    // 3. The Ultimate "Perplexity-Style" Directional Snap Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%", 
        pin: true,
        scrub: 1.2, // The base layer of the "butter" 🧈
        snap: {
          // THE MAGIC TRICK: This forces the scroll to land on exactly 1 flavor per flick!
          snapTo: "labelsDirectional", 
          duration: { min: 0.8, max: 1.5 }, // Long, cinematic glide duration
          delay: 0, // Instantly engages the moment you flick the wheel
          ease: "expo.out" // Premium, ultra-smooth landing curve
        },
      },
    });

    // Label 0 (Starting point)
    tl.addLabel("flavor0", 0);

    // 4. Build the Transitions & Labels
    FLAVORS.forEach((_, i) => {
      if (i === 0) return; 

      // Wipe background in from the right edge
      tl.to(`.shutter-bg-${i}`, { 
        clipPath: "inset(0% 0% 0% 0%)", 
        duration: 1, 
        ease: "power2.inOut" 
      }, i - 1);

      // Old flavor swings OUT to the left in 3D
      tl.to(`.flavor-group-${i - 1}`, {
        xPercent: -30,
        opacity: 0,
        rotationY: -15,
        duration: 1,
        ease: "power2.inOut"
      }, i - 1);

      // New flavor swings IN from the right in 3D
      tl.to(`.flavor-group-${i}`, {
        xPercent: 0,
        autoAlpha: 1,
        rotationY: 0,
        duration: 1,
        ease: "power2.inOut"
      }, i - 1);

      // Plant a label exactly at the end of this transition for the Snap to find!
      tl.addLabel(`flavor${i}`, i); 
    });

  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ perspective: "1200px" }} // Critical for the 3D depth!
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
          
          {/* Typography: Low to High Opacity Gradient */}
          <div className="absolute top-[8%] md:top-[10%] w-full flex justify-center z-10 pointer-events-none">
            <h1 
              className="text-[15vw] font-black tracking-tighter uppercase"
              style={{ 
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                background: `linear-gradient(to bottom, ${flavor.textHex}00 0%, ${flavor.textHex} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {flavor.title}
            </h1>
          </div>

          {/* Popsicle with separated 3D Float layer */}
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

          {/* Splash with separated 3D Float layer */}
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

      {/* ── GLOBAL UI BUTTON ── */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50">
        <button className="px-10 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm tracking-[0.2em] font-bold rounded-full hover:bg-white hover:text-black hover:scale-105 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
          ORDER NOW
        </button>
      </div>

    </div>
  );
}
