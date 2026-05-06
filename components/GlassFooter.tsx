
"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function GlassFooter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Panel starts hidden
      gsap.set(panelRef.current, {
        y: 100,
        scale: 0.9,
        opacity: 0,
      });
    },
    { scope: sectionRef }
  );

  function handleVideoEnd() {
    // Animate panel into view
    gsap.to(panelRef.current, {
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 1.5,
      ease: "expo.out",
    });

    // Restart video so it loops behind the visible panel
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100vh" }}
    >
      {/* Full-screen background video — NO loop attribute */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src="/videos/ice.mp4" type="video/mp4" />
      </video>

      {/* Subtle dark overlay so panel pops */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.35)", zIndex: 1 }}
      />

      {/* Centered glassmorphism panel (starts hidden, revealed on video end) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <div
          ref={panelRef}
          className="relative z-10 w-[min(92vw,560px)] rounded-[28px] p-8 md:p-10 text-center pointer-events-auto"
          style={{
            background:
              "linear-gradient(to bottom, #141414B8, #0A0A0AE0)",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-5 w-full">
            <div
              className="relative w-24 h-24 rounded-[22px] overflow-hidden mx-auto"
              style={{
                boxShadow:
                  "0 0 18px rgba(255,255,255,0.9), 0 0 44px rgba(255,255,255,0.42)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <Image
                src="/images/logo.jpg"
                alt="Playful logo"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Heading */}
          <h2
            className="mb-4 font-serif font-normal text-white"
            style={{
              fontSize: "clamp(28px, 4.2vw, 54px)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
            }}
          >
            Playful - design 3D website
          </h2>

          {/* Body */}
          <p
            className="mx-auto mb-6 font-sans font-light leading-[1.75]"
            style={{
              maxWidth: 420,
              fontSize: "clamp(13px, 1.2vw, 15px)",
              letterSpacing: "0.01em",
              color: "rgba(255,255,255,0.70)",
            }}
          >
            Build cinematic, high-impact web experiences that feel premium,
            futuristic, and unforgettable.
          </p>

          {/* CTA button */}
          <button
            className="group relative border-none rounded-full px-6 py-3.5 text-white font-sans text-sm font-bold tracking-[0.04em]"
            style={{
              background: "linear-gradient(to bottom, #ff9a1f, #ff7a00)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.12), 0 10px 30px rgba(255,140,0,0.28)",
              cursor: "pointer",
              transition: "all 0.3s ease-out",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.transform = "translateY(-2px)";
              el.style.boxShadow =
                "0 0 0 1px rgba(255,255,255,0.18), 0 0 24px rgba(255,140,0,0.85), 0 0 64px rgba(255,120,0,0.55), 0 16px 40px rgba(255,120,0,0.30)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.transform = "translateY(0)";
              el.style.boxShadow =
                "0 0 0 1px rgba(255,255,255,0.12), 0 10px 30px rgba(255,140,0,0.28)";
            }}
          >
            <span className="relative z-10 transition-all duration-300 group-hover:brightness-110">
              Book now
            </span>
          </button>
        </div>
      </div>

      {/* Skip / mute hint */}
      <div
        className="absolute bottom-6 right-6 font-sans text-xs uppercase tracking-widest"
        style={{ color: "rgba(255,255,255,0.4)", zIndex: 20 }}
      >
        Video intro
      </div>
    </section>
  );
}
