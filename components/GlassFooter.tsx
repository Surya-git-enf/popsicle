
"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function GlassFooter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const hasShown = useRef(false);

  // Play video ONLY when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause(); // Pauses if they scroll away
        }
      },
      { threshold: 0.3 } // Triggers when 30% of the section is visible on screen
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      // Panel and overlay start fully hidden
      gsap.set(panelRef.current, { y: 100, scale: 0.92, opacity: 0 });
      gsap.set(overlayRef.current, { opacity: 0 });
    },
    { scope: sectionRef }
  );

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid || !vid.duration) return;

    const { currentTime, duration } = vid;

    // 1. Reveal panel slightly before the 1-second loop starts for a smooth transition
    if (!hasShown.current && currentTime >= duration - 1.5) {
      hasShown.current = true;

      // Darken the overlay
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      });

      // Float the panel up
      gsap.to(panelRef.current, {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "expo.out",
        delay: 0.1,
      });
    }

    // 2. Loop ONLY the last 1 second infinitely
    if (currentTime >= duration - 0.1) {
      vid.currentTime = duration - 1;
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
        backgroundColor: "#000",
      }}
    >
      {/* Full-screen background video — autoPlay REMOVED */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        // Fallback safety net for the 1-second loop
        onEnded={() => {
          if (videoRef.current) {
            videoRef.current.currentTime = videoRef.current.duration - 1;
            videoRef.current.play();
          }
        }}
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

      {/* Dark overlay */}
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

      {/* Glassmorphism panel */}
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
              boxShadow:
                "0 0 18px rgba(255,255,255,0.9), 0 0 44px rgba(255,255,255,0.42)",
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

        <a
          href="https://forms.gle/TVrR86bnF1fvzEnA7"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            textDecoration: "none",
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
            const b = e.currentTarget;
            b.style.transform = "translateY(-2px)";
            b.style.boxShadow =
              "0 0 0 1px rgba(255,255,255,0.18), 0 0 24px rgba(255,140,0,0.85), 0 0 64px rgba(255,120,0,0.55), 0 16px 40px rgba(255,120,0,0.30)";
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget;
            b.style.transform = "translateY(0)";
            b.style.boxShadow =
              "0 0 0 1px rgba(255,255,255,0.12), 0 10px 30px rgba(255,140,0,0.28)";
          }}
        >
          Book a Call
        </a>
      </div>
    </section>
  );
}
