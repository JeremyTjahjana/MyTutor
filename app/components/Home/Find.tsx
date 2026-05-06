"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

const Find = () => {
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;

    const triggerReveal = () => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setHasAnimatedIn(true);
        });
      });
    };

    if (!("IntersectionObserver" in window)) {
      triggerReveal();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            triggerReveal();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="mt-4 sm:mt-8 text-center lg:text-left lg:max-w-[860px] lg:mx-auto"
    >
      <h3
        className={`fade-up text-2xl sm:text-3xl md:text-[40px] leading-tight font-medium text-[var(--gelap)] ${hasAnimatedIn ? "fade-up-visible" : ""}`}
      >
        Find the right Tutor for you !
      </h3>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-center gap-4 sm:gap-6 px-20 sm:px-0">
        <Link
          href="/register-tutor"
          className={`fade-up btn-primary w-full sm:w-auto min-w-[190px] ${hasAnimatedIn ? "fade-up-visible" : ""}`}
          style={{ "--fade-up-delay": "250ms" } as CSSProperties}
        >
          Become a Tutor
        </Link>

        <Link
          href="/tutor"
          className={`fade-up btn-secondary w-full sm:w-auto min-w-[160px] ${hasAnimatedIn ? "fade-up-visible" : ""}`}
          style={{ "--fade-up-delay": "150ms" } as CSSProperties}
        >
          Find Tutor
        </Link>
      </div>
    </div>
  );
};

export default Find;
