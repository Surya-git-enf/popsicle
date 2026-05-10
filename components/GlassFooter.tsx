
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
    gsap.set(panelRef.current, {
      y: 100,
      scale: 0.92,
      opacity: 0,
    });

    gsap.set(overlayRef.current, {
      opacity: 0,
    });
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

    // Open panel when last 2 seconds start
    if (!hasShown.current && currentTime >= duration - 2) {
      hasShown.current = true;

      // Save loop start point
      loopStartRef.current = duration - 2;

      openPanel();
    }

    // Loop ONLY the final 2 seconds forever
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
        background: "#000",
      }}
    >
      {/* Background Video */}
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

      {/* Dark Overlay */}
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.12), rgba(0,0,0,0.45))",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
        }}
      />

      {/* Glass Panel */}
      <div
        ref={panelRef}
        style={{
          position: "relative",
          zIndex: 10,
          width: "min(92vw, 560px)",
          borderRadius: 28,
          padding: "42px",
          background:
            "linear-gradient(to bottom, rgba(20,20,20,0.72), rgba(10,10,10,0.88))",
          border: "1px solid rgba(255,255,255,0.10)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 22,
          }}
        >
          <div
            style={{
              position: "relative",
              width: 96,
              height: 96,
              borderRadius: 24,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow:
                "0 0 18px rgba(255,255,255,0.9), 0 0 44px rgba(255,255,255,0.42)",
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

        {/* Heading */}
        <h2
          style={{
            marginBottom: 16,
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "clamp(30px, 4.4vw, 56px)",
            fontWeight: 400,
            lineHeight: 1.06,
            color: "#fff",
            letterSpacing: "-0.03em",
          }}
        >
          Playful — Design 3D Websites
        </h2>

        {/* Description */}
        <p
          style={{
            maxWidth: 430,
            margin: "0 auto 28px",
            fontFamily: "system-ui, sans-serif",
            fontSize: "clamp(13px, 1.2vw, 15px)",
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.72)",
            letterSpacing: "0.01em",
            fontWeight: 300,
          }}
        >
          Build cinematic digital experiences with immersive animations,
          futuristic visuals, and premium interactions that make your brand
          unforgettable.
        </p>

        {/* CTA BUTTON */}
        <a
          href="https://forms.gle/TVrR86bnF1fvzEnA7"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            padding: "15px 32px",
            background:
              "linear-gradient(to bottom, #ff9a1f, #ff7a00)",
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.05em",
            textDecoration: "none",
            cursor: "pointer",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.12), 0 10px 30px rgba(255,140,0,0.28)",
            transition: "all 0.3s ease-out",
          }}
          onMouseEnter={(e) => {
            const b = e.currentTarget as HTMLAnchorElement;

            b.style.transform = "translateY(-2px) scale(1.02)";
            b.style.boxShadow =
              "0 0 0 1px rgba(255,255,255,0.18), 0 0 24px rgba(255,140,0,0.85), 0 0 64px rgba(255,120,0,0.55), 0 16px 40px rgba(255,120,0,0.30)";
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget as HTMLAnchorElement;

            b.style.transform = "translateY(0) scale(1)";
            b.style.boxShadow =
              "0 0 0 1px rgba(255,255,255,0.12), 0 10px 30px rgba(255,140,0,0.28)";
          }}
        >
          Book a Call
        </a>
      </div>

      {/* Bottom Text */}
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
