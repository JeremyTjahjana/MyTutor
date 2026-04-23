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
      <div className="w-full sm:px-10 md:px-20 flex flex-col gap-4 p-6">
        <h2 className="text-2xl font-bold text-[var(--biru)]">
          Pelajaran Tersedia
        </h2>

        <div className="relative bg-[#F5F6FB] rounded-3xl p-3 flex items-center overflow-hidden">
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
                    : "bg-white border-2 border-[var(--biru)]/30 text-[var(--biru)]/70"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
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
