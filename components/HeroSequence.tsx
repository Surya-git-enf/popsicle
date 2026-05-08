
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
    // 1. Initial Load "Surya Masterpiece" Entrance Animation
    const initTl = gsap.timeline();
    
    initTl.from(".flavor-group-0 h1", { 
      opacity: 0, y: 100, duration: 1.5, ease: "power4.out" 
    })
    .from(".flavor-group-0 .pop-image", { 
      yPercent: 50, rotationX: 45, rotationY: -30, opacity: 0, duration: 1.5, ease: "power3.out" 
    }, "-=1.2")
    .from(".flavor-group-0 .splash-image", { 
      scale: 0.2, yPercent: 50, opacity: 0, duration: 1.5, ease: "back.out(1.5)" 
    }, "-=1.2");

    // 2. Continuous 3D Floating Motions
    gsap.to(".pop-image", {
      y: -25,
      rotationX: 10,
      rotationY: 5,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to(".splash-image", {
      y: 15,
      scale: 1.05,
      rotationX: -10, 
      duration: 4,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    // 3. Setup Hidden States for upcoming flavors
    gsap.set(".shutter-bg:not(.shutter-bg-0)", { clipPath: "inset(0% 0% 0% 100%)" });
    gsap.set(".flavor-group:not(.flavor-group-0)", { autoAlpha: 0, xPercent: 30, rotationY: 15 });

    // 4. The Pro-Level Butter Timeline (Fixed the "Stuck" feeling)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%", 
        pin: true,
        scrub: 0.5, // Dropped from 1.2. This removes the "stuck/lag" input feeling!
        snap: {
          snapTo: "labelsDirectional", 
          duration: { min: 0.3, max: 0.6 }, // Much faster, snappier transition
          delay: 0, // Zero delay to react to user input instantly
          ease: "power2.inOut" 
        },
      },
    });

    tl.addLabel("flavor0", 0);

    // 5. Build the Transitions
    FLAVORS.forEach((_, i) => {
      if (i === 0) return; 

      tl.to(`.shutter-bg-${i}`, { 
        clipPath: "inset(0% 0% 0% 0%)", 
        duration: 1, 
        ease: "power2.inOut" 
      }, i - 1);

      tl.to(`.flavor-group-${i - 1}`, {
        xPercent: -30,
        opacity: 0,
        rotationY: -15,
        duration: 1,
        ease: "power2.inOut"
      }, i - 1);

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

          {/* Popsicle */}
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

          {/* Splash */}
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

      {/* ── SURYA PRO WATERMARK ── */}
      <div className="absolute bottom-6 right-8 z-50 pointer-events-none opacity-60">
        <p className="font-mono text-[10px] tracking-[0.3em] text-white uppercase mix-blend-difference">
          3D Experience by Surya
        </p>
      </div>

    </div>
  );
}
