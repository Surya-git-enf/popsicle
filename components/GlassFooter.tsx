"use client";

import React from "react";

export default function GlassFooter() {
  const panelRef = React.useRef<HTMLDivElement>(null);

  // Recreating the glow logic you provided in the style object
  const buttonGlow = {
    boxShadow: "0 0 0 1px rgba(255,255,255,0.12), 0 10px 30px rgba(255, 140, 0, 0.28)",
  };

  return (
    <section className="relative w-full h-screen bg-[#F5F5DC] overflow-hidden">
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

      {/* Floating Panel (Your exact provided code) */}
      <div
        ref={panelRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          // Removed opacity: 0 and transform so it is immediately visible
        }}
      >
        <div
          style={{
            width: "min(92vw, 560px)",
            borderRadius: "28px",
            padding: "34px 28px",
            background:
              "linear-gradient(180deg, rgba(20,20,20,0.72), rgba(10,10,10,0.88))",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
            textAlign: "center",
            pointerEvents: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "18px",
            }}
          >
            <img
              src="/images/logo.jpg"
              alt="Playful logo"
              style={{
                width: "96px",
                height: "96px",
                objectFit: "cover",
                borderRadius: "22px",
                boxShadow:
                  "0 0 18px rgba(255,255,255,0.90), 0 0 44px rgba(255,255,255,0.42)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            />
          </div>

          <h2
            style={{
              margin: "0 0 14px 0",
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: "clamp(28px, 4.2vw, 54px)",
              fontWeight: 400,
              lineHeight: 1.08,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            Playful - design 3D website
          </h2>

          <p
            style={{
              margin: "0 auto 24px auto",
              maxWidth: "420px",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "clamp(13px, 1.2vw, 15px)",
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.68)",
              letterSpacing: "0.01em",
              fontWeight: 300,
            }}
          >
            Build cinematic, high-impact web experiences that feel premium,
            futuristic, and unforgettable.
          </p>

          <button
            type="button"
            style={{
              border: "none",
              borderRadius: "999px",
              padding: "14px 24px",
              background: "linear-gradient(180deg, #ff9a1f, #ff7a00)",
              color: "#fff",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              cursor: "pointer",
              transition:
                "transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease",
              ...buttonGlow,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
              e.currentTarget.style.boxShadow =
                "0 0 0 1px rgba(255,255,255,0.18), 0 0 24px rgba(255, 140, 0, 0.85), 0 0 64px rgba(255, 120, 0, 0.55), 0 16px 40px rgba(255, 120, 0, 0.30)";
              e.currentTarget.style.filter = "brightness(1.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow =
                "0 0 0 1px rgba(255,255,255,0.12), 0 10px 30px rgba(255, 140, 0, 0.28)";
              e.currentTarget.style.filter = "brightness(1)";
            }}
          >
            Book now
          </button>
        </div>
      </div>
    </section>
  );
}

