"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface PortfolioSectionProps {
  portfolioUrls: string[];
  tutorName: string;
}

export function PortfolioSection({
  portfolioUrls,
  tutorName,
}: PortfolioSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalItems = portfolioUrls.length;
  const activeUrl = portfolioUrls[activeIndex];
  const hasMultipleItems = totalItems > 1;

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? totalItems - 1 : current - 1,
    );
  };

  const goToNext = () => {
    setActiveIndex((current) =>
      current >= totalItems - 1 ? 0 : current + 1,
    );
  };

  return (
    <section className="mt-8 rounded-3xl border border-[var(--gelap)]/10 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[var(--biru)] sm:text-xl">
          Portofolio
        </h2>
        {portfolioUrls.length > 0 ? (
          <span className="rounded-full bg-[var(--biru)]/10 px-3 py-1 text-xs font-semibold text-[var(--biru)]">
            {portfolioUrls.length} item
          </span>
        ) : null}
      </div>

      {portfolioUrls.length === 0 ? (
        <p className="mt-3 text-sm text-[var(--gelap)]/45 italic">
          Belum ada portofolio yang ditambahkan.
        </p>
      ) : (
        <>
          <div className="relative mx-auto mt-4 max-w-3xl overflow-hidden rounded-2xl border border-[var(--gelap)]/10 bg-[#F0ECFF]">
            <a
              href={activeUrl}
              target="_blank"
              rel="noreferrer"
              className="group block aspect-[4/3] w-full sm:aspect-[16/9]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeUrl}
                alt={`Portfolio ${activeIndex + 1} ${tutorName}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                Buka gambar
              </span>
            </a>

            {hasMultipleItems ? (
              <>
                <button
                  type="button"
                  onClick={goToPrevious}
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--gelap)] shadow-md transition hover:bg-white"
                  aria-label="Portfolio sebelumnya"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--gelap)] shadow-md transition hover:bg-white"
                  aria-label="Portfolio berikutnya"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            ) : null}

            <span className="absolute right-4 top-4 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white">
              {activeIndex + 1} / {totalItems}
            </span>
          </div>

          {hasMultipleItems ? (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {portfolioUrls.map((url, index) => (
                <button
                  key={`${url}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-8 bg-[var(--biru)]"
                      : "w-2.5 bg-[var(--gelap)]/20 hover:bg-[var(--biru)]/45"
                  }`}
                  aria-label={`Lihat portfolio ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                />
              ))}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
