"use client";

import React, { useEffect, useState } from "react";
import TutorCard from "./TutorCard";
import { assets } from "../../assets/assets";

const testimonials = [
  {
    profile: assets.mehehe,
    name: "John Carter",
    role: "MK1, MK2, MK3",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit amet hendrerit pretium nulla sed enim iaculis mi.",
    rating: 4,
  },
  {
    profile: assets.mehehe,
    name: "Dina Putri",
    role: "Kalkulus, Statistika",
    description:
      "Penjelasannya runtut dan mudah dipahami, jadi saya lebih percaya diri saat ujian.",
    rating: 5,
  },
  {
    profile: assets.mehehe,
    name: "Rafi Maulana",
    role: "Fisika Dasar, Mekanika",
    description:
      "Sesi belajar interaktif dan fleksibel. Progress belajar saya terasa jauh lebih cepat.",
    rating: 5,
  },
  {
    profile: assets.mehehe,
    name: "Keisya Ananda",
    role: "Kimia Organik",
    description:
      "Tutor sangat sabar membimbing. Materi yang rumit jadi terasa lebih sederhana.",
    rating: 4,
  },
  {
    profile: assets.mehehe,
    name: "Bagas Pratama",
    role: "Bahasa Inggris Akademik",
    description:
      "Latihan dan feedback-nya detail. Nilai tugas saya meningkat setelah beberapa sesi.",
    rating: 5,
  },
];

const Testimonies = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const total = testimonials.length;

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

  const prevIndex = (activeIndex - 1 + total) % total;
  const nextIndex = (activeIndex + 1) % total;

  const visibleSlides = [
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
        <div className="relative h-[270px] sm:h-[320px]">
          {visibleSlides.map((slide) => {
            const item = testimonials[slide.index];
            const isActive = slide.offset === 0;
            const staggerDelay = (slide.offset + 1) * 110 + 150;

            return (
              <div
                key={`${item.name}-${slide.index}`}
                className="absolute left-1/2 top-0 w-[250px] sm:w-[320px] transition-all duration-500 ease-out"
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
                  <TutorCard
                    profile={item.profile}
                    name={item.name}
                    role={item.role}
                    description={item.description}
                    rating={item.rating}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handlePrev}
            className="h-9 w-9 rounded-full border border-[var(--biru)]/35 text-[var(--biru)] transition hover:bg-[var(--biru)]/10"
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
            className="h-9 w-9 rounded-full border border-[var(--biru)]/35 text-[var(--biru)] transition hover:bg-[var(--biru)]/10"
            aria-label="Next testimony"
          >
            &gt;
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonies;
