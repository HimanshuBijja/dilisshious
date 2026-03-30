"use client";

import { useState, useEffect } from "react";

export default function IntroScreen() {
  const [show, setShow] = useState(false);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("dilisshious-intro")) return;
    } catch {
      return;
    }

    // First visit — mount the overlay and start animation
    setShow(true);
    document.body.style.overflow = "hidden";

    const revealTimer = setTimeout(() => setReveal(true), 2600);

    // Slide-away is 0.7s — remove overlay at 3400ms
    const doneTimer = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "";
      try {
        sessionStorage.setItem("dilisshious-intro", "1");
      } catch {}
    }, 3600);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!show) return null;

  return (
    <div className={`intro-overlay${reveal ? " intro-overlay--reveal" : ""}`}>
      <div className="intro-overlay__logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo_animate.svg" alt="" draggable={false} />
      </div>
    </div>
  );
}
