'use client';

import React, { useEffect, useRef } from 'react';

export default function ReactiveBackground() {
  const containerRef = useRef(null);
  const posRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          if (containerRef.current) {
            containerRef.current.style.setProperty('--mouse-x', `${posRef.current.x}px`);
            containerRef.current.style.setProperty('--mouse-y', `${posRef.current.y}px`);
          }
          rafRef.current = null;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden select-none"
    >
      {/* Base & Dots: Repeating CSS dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(9, 9, 11, 0.15) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Reactive Glow: Soft radial gradient using Acid accent (#D2E823) centered on cursor */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(500px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), #D2E823, transparent 75%)',
          opacity: 0.4,
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  );
}
