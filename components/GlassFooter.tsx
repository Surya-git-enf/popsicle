
"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function GlassFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Hide panel initially
    gsap.set(panelRef.current, { y: 100, opacity: 0 });

    ScrollTrigger.create({
      trigger: footerRef.current,
      start: "top center", // Animates when footer reaches middle of screen
      onEnter: () => {
        gsap.to(panelRef.current, {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.3 // Brief pause to let the user see the video first
        });
      }
    });
  }, { scope: footerRef });

  return (
    <section ref={footerRef} className="relative w-full h-screen bg-[#F5F5DC] overflow-hidden flex items-center justify-center z-10">
      
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/ice.mp4" type="video/mp4" />
      </video>

      {/* Glassmorphism Floating Panel */}
      <div 
        ref={panelRef}
        className="relative z-10 w-[min(92vw,560px)] rounded-[28px] p-8 md:p-10 bg-gradient-to-b from-[#141414B8] to-[#0A0A0AE0] border border-white/10 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.04)] text-center pointer-events-auto"
      >
        
        <div className="flex justify-center mb-5 w-full">
          <div className="relative w-24 h-24 rounded-[22px] overflow-hidden shadow-[0_0_18px_rgba(255,255,255,0.9),0_0_44px_rgba(255,255,255,0.42)] border border-white/20 mx-auto">
            <Image 
              src="/images/logo.jpg" 
              alt="Playful logo" 
              fill
              className="object-cover"
            />
          </div>
        </div>

        <h2 className="mb-4 font-serif text-[clamp(28px,4.2vw,54px)] font-normal leading-[1.08] text-white tracking-[-0.02em]">
          Playful - design 3D website
        </h2>

        <p className="mx-auto mb-6 max-w-[420px] font-sans text-[clamp(13px,1.2vw,15px)] leading-[1.75] text-white/70 tracking-[0.01em] font-light">
          Build cinematic, high-impact web experiences that feel premium, futuristic, and unforgettable.
        </p>

        <button className="group relative border-none rounded-full px-6 py-3.5 bg-gradient-to-b from-[#ff9a1f] to-[#ff7a00] text-white font-sans text-sm font-bold tracking-[0.04em] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_0_24px_rgba(255,140,0,0.85),0_0_64px_rgba(255,120,0,0.55),0_16px_40px_rgba(255,120,0,0.30)] shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_10px_30px_rgba(255,140,0,0.28)]">
          <span className="relative z-10 transition-all duration-300 group-hover:brightness-110">
            Book now
          </span>
        </button>
        
      </div>
    </section>
  );
}
