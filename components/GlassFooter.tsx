
"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function GlassFooter() {
  const panelRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasAppeared = useRef(false); // Keeps track so we only animate it once

  useGSAP(() => {
    // Hide panel initially, pushed down by 100px
    gsap.set(panelRef.current, { y: 100, opacity: 0 });
  }, { scope: panelRef });

  // This function runs multiple times a second while the video plays
  const handleTimeUpdate = () => {
    if (!videoRef.current || hasAppeared.current) return;

    const { currentTime, duration } = videoRef.current;

    // Check if we have the video duration AND we are in the last 2 seconds
    if (duration && currentTime >= duration - 2) {
      hasAppeared.current = true; // Lock it so it doesn't fire over and over

      // Animate the panel up!
      gsap.to(panelRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
      });
    }
  };

  return (
    <section className="relative w-full h-screen bg-[#F5F5DC] overflow-hidden flex items-center justify-center z-10">
      
      {/* Background Video Tracking Time */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
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
