"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function GlassFooter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const hasShown = useRef(false);
  const loopStartRef = useRef(0);

  useGSAP(() => {
    gsap.set(panelRef.current, { y: 100, scale: 0.92, opacity: 0 });
    gsap.set(overlayRef.current, { opacity: 0 });
  }, { scope: sectionRef });

  const openPanel = () => {
    gsap.to(overlayRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
    });

    gsap.to(panelRef.current, {
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 1.5,
      ease: "expo.out",
      delay: 0.1,
    });
  };

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid) return;

    const { currentTime, duration } = vid;
    if (!duration) return;

    // Open panel once when video reaches the last 2 seconds
    if (!hasShown.current && currentTime >= duration - 2) {
      hasShown.current = true;
      loopStartRef.current = duration - 2;
      openPanel();
    }

    // After the panel is shown, keep looping only the last 2 seconds
    if (hasShown.current && currentTime >= duration - 0.05) {
      vid.currentTime = loopStartRef.current;
      vid.play().catch(() => {});
    }
  };

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      >
        <source src="/videos/ice.mp4" type="video/mp4" />
      </video>

      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          backgroundColor: "rgba(0,0,0,0.22)",
          backdropFilter: "blur(2px)",
        }}
      />

      <div
        ref={panelRef}
        style={{
          position: "relative",
          zIndex: 10,
          width: "min(92vw, 560px)",
          borderRadius: 28,
          padding: "40px",
          background: "linear-gradient(to bottom, #141414B8, #0A0A0AE0)",
          border: "1px solid rgba(255,255,255,0.10)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div
            style={{
              position: "relative",
              width: 96,
              height: 96,
              borderRadius: 22,
              overflow: "hidden",
              boxShadow: "0 0 18px rgba(255,255,255,0.9), 0 0 44px rgba(255,255,255,0.42)",
              border: "1px solid rgba(255,255,255,0.20)",
            }}
          >
            <Image
              src="/images/logo.png"
              alt="Playful logo"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <h2
          style={{
            marginBottom: 16,
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "clamp(28px, 4.2vw, 54px)",
            fontWeight: 400,
            lineHeight: 1.08,
            color: "#fff",
            letterSpacing: "-0.02em",
          }}
        >
          Playful - design 3D website
        </h2>

        <p
          style={{
            maxWidth: 420,
            margin: "0 auto 24px",
            fontFamily: "system-ui, sans-serif",
            fontSize: "clamp(13px, 1.2vw, 15px)",
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.70)",
            letterSpacing: "0.01em",
            fontWeight: 300,
          }}
        >
          Build cinematic, high-impact web experiences that feel premium,
          futuristic, and unforgettable.
        </p>

        <button
          style={{
            position: "relative",
            border: "none",
            borderRadius: 999,
            padding: "14px 28px",
            background: "linear-gradient(to bottom, #ff9a1f, #ff7a00)",
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.04em",
            cursor: "pointer",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.12), 0 10px 30px rgba(255,140,0,0.28)",
            transition: "all 0.3s ease-out",
          }}
          onMouseEnter={(e) => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.transform = "translateY(-2px)";
            b.style.boxShadow =
              "0 0 0 1px rgba(255,255,255,0.18), 0 0 24px rgba(255,140,0,0.85), 0 0 64px rgba(255,120,0,0.55), 0 16px 40px rgba(255,120,0,0.30)";
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.transform = "translateY(0)";
            b.style.boxShadow =
              "0 0 0 1px rgba(255,255,255,0.12), 0 10px 30px rgba(255,140,0,0.28)";
          }}
        >
          Book a Call
        </button>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "monospace",
          fontSize: 9,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        Loading experience…
      </div>
    </section>
  );
}
