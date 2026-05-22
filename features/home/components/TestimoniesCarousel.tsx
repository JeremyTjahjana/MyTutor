"use client";

import React, { useEffect, useState } from "react";
import TestimonyCard from "./TestimonyCard";
import { assets } from "@/assets/assets";

export type HomeTestimony = {
  id: string;
  profile: string | null;
  studentName: string;
  subjects: string;
  message: string;
  rating: number;
};

type TestimoniesCarouselProps = {
  testimonials: HomeTestimony[];
};

const TestimoniesCarousel = ({ testimonials }: TestimoniesCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const total = testimonials.length;

  useEffect(() => {
    setActiveIndex(0);
  }, [total]);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasAnimatedIn(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, []);

  if (total === 0) return null;

  const prevIndex = (activeIndex - 1 + total) % total;
  const nextIndex = (activeIndex + 1) % total;

  const visibleSlides =
    total === 1
      ? [{ index: activeIndex, offset: 0 }]
      : total === 2
        ? [
            { index: activeIndex, offset: 0 },
            { index: nextIndex, offset: 1 },
          ]
      : [
          { index: prevIndex, offset: -1 },
          { index: activeIndex, offset: 0 },
          { index: nextIndex, offset: 1 },
        ];

  const handlePrev = () => {
    setActiveIndex((current) => (current - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % total);
  };

  return (
    <section
      ref={sectionRef}
      className="mx-auto w-full max-w-[1280px] px-6 sm:px-10 md:px-14 lg:px-20 py-12 sm:py-16 bg-[var(--putih)] text-[var(--gelap)]"
    >
      <h2
        className={`fade-up text-center text-3xl sm:text-5xl font-semibold text-[var(--biru)] ${hasAnimatedIn ? "fade-up-visible" : ""}`}
      >
        Testimonies
      </h2>

      <div className="mt-8 mx-auto w-full max-w-[840px]">
        <div className="relative h-[250px] sm:h-[340px]">
          {visibleSlides.map((slide) => {
            const item = testimonials[slide.index];
            const isActive = slide.offset === 0;
            const staggerDelay = (slide.offset + 1) * 110 + 150;

            return (
              <div
                key={`${item.id}-${slide.offset}`}
                className="absolute left-1/2 top-0 w-[200px] max-[400px]:w-[160px] sm:w-[320px] transition-all duration-500 ease-out"
                style={{
                  transform: `translateX(calc(-50% + ${slide.offset * 58}%)) translateY(${isActive ? "0px" : "12px"}) scale(${isActive ? 1 : 0.92})`,
                  opacity: isActive ? 1 : 0.72,
                  zIndex: isActive ? 30 : 20,
                }}
                onClick={() => setActiveIndex(slide.index)}
              >
                <div
                  className={`fade-up ${hasAnimatedIn ? "fade-up-visible" : ""}`}
                  style={
                    {
                      "--fade-up-delay": `${staggerDelay}ms`,
                    } as React.CSSProperties
                  }
                >
                  <TestimonyCard
                    profile={item.profile ?? assets.profile}
                    studentName={item.studentName}
                    subjects={item.subjects}
                    message={item.message}
                    rating={item.rating}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {total > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              className="btn-icon h-9 w-9 border border-[var(--biru)]/35 text-[var(--biru)]"
              aria-label="Previous testimony"
            >
              &lt;
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-6 bg-[var(--biru)]"
                      : "w-2.5 bg-[var(--gelap)]/25"
                  }`}
                  aria-label={`Go to testimony ${index + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="btn-icon h-9 w-9 border border-[var(--biru)]/35 text-[var(--biru)]"
              aria-label="Next testimony"
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimoniesCarousel;
