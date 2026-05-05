"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { dummyTutor } from "@/app/assets/assets";
import WaktuTersedia from "./WaktuTersedia";

type WaktuType = {
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  tanggal: string;
};

const PelajaranTersedia = () => {
  const params = useParams();
  const tutorId = Number(params.id);

  const tutor = useMemo(() => {
    return dummyTutor.find((item) => item.id === tutorId);
  }, [tutorId]);

  const pelajaran = tutor?.matkuls ?? [];

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number | null>(
    null,
  );
  const [selectedTime, setSelectedTime] = useState<WaktuType | null>(null);

  const checkScroll = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    checkScroll();
  }, [pelajaran]);

  useEffect(() => {
    const onResize = () => checkScroll();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const centerItem = (index: number) => {
    const container = scrollRef.current;
    const el = itemRefs.current[index];

    if (!container || !el) return;

    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    const elCenter =
      elRect.left -
      containerRect.left +
      container.scrollLeft +
      elRect.width / 2;

    const targetScrollLeft = elCenter - container.clientWidth / 2;
    const maxScrollLeft = Math.max(
      0,
      container.scrollWidth - container.clientWidth,
    );

    container.scrollTo({
      left: Math.max(0, Math.min(targetScrollLeft, maxScrollLeft)),
      behavior: "smooth",
    });

    setActiveIndex(index);
    setSelectedTimeIndex(null);
    setSelectedTime(null);

    setTimeout(checkScroll, 300);
  };

  const handleTimeSelect = (index: number, item: WaktuType) => {
    setSelectedTimeIndex(index);
    setSelectedTime(item);
  };

  if (!tutor) {
    return (
      <section className="p-6">
        <p className="text-red-500">Tutor tidak ditemukan.</p>
      </section>
    );
  }

  return (
    <section className="w-full bg-[var(--putih)] text-[var(--gelap)]">
      <div className="w-full flex flex-col gap-4 mt-6">
        <h2 className="text-[18px] font-bold text-[var(--biru)]">
          Pelajaran Tersedia
        </h2>

        <div className="relative bg-[#F5F6FB] rounded-3xl p-3 overflow-hidden group">
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-3 overflow-x-auto w-full scroll-smooth px-2 [&::-webkit-scrollbar]:hidden"
          >
            {pelajaran.map((item, index) => (
              <button
                key={index}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                onClick={() => centerItem(index)}
                className={`px-6 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors shrink-0 ${
                  index === activeIndex
                    ? "bg-white border-2 border-[var(--biru)] text-[var(--biru)]"
                    : "bg-white border-2 border-[var(--biru)]/30 text-[var(--biru)]/70 hover:bg-[#E6F3F5]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white via-white to-transparent pointer-events-none z-5" />
          )}

          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white to-transparent pointer-events-none z-5" />
          )}

          {canScrollLeft && (
            <button
              onClick={() => {
                if (activeIndex > 0) {
                  centerItem(activeIndex - 1);
                } else {
                  centerItem(activeIndex);
                }
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full flex items-center justify-center text-[var(--biru)] hover:text-[var(--biru)]/80 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => {
                if (activeIndex < pelajaran.length - 1) {
                  centerItem(activeIndex + 1);
                } else {
                  centerItem(activeIndex);
                }
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full flex items-center justify-center text-[var(--biru)] hover:text-[var(--biru)]/80 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          )}
        </div>

        <div className="mt-4">
          <WaktuTersedia
            waktu={tutor.waktu}
            selectedIndex={selectedTimeIndex}
            onSelect={handleTimeSelect}
          />
        </div>
      </div>
    </section>
  );
};

export default PelajaranTersedia;
