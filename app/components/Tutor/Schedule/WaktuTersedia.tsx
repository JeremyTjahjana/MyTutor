"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { dummyTutor } from "@/app/assets/assets";

type WaktuType = {
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  tanggal: string;
};

type Props = {
  waktu?: WaktuType[];
  columns?: number;
  selectedIndex?: number | null;
  onSelect?: (index: number, item: WaktuType) => void;
  className?: string;
};

const WaktuTersedia = ({
  columns = 2,
  selectedIndex: controlledIndex = null,
  onSelect,
  className = "",
}: Props) => {
  const params = useParams();
  const tutorId = Number(params.id);

  const tutor = useMemo(() => {
    return dummyTutor.find((item) => item.id === tutorId);
  }, [tutorId]);

  const waktu = tutor?.waktu ?? [];

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [selected, setSelected] = useState<number>(controlledIndex ?? 0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    if (controlledIndex !== null) {
      setSelected(controlledIndex);
    }
  }, [controlledIndex]);

  const checkScroll = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    checkScroll();
  }, [waktu]);

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

    setTimeout(checkScroll, 300);
  };

  const formattedTimes = useMemo(() => {
    return waktu.map((item) => {
      const date = new Date(item.tanggal);

      const tanggalFormatted = date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      return {
        ...item,
        label: `${item.hari}, ${tanggalFormatted} (${item.jamMulai} - ${item.jamSelesai})`,
      };
    });
  }, [waktu]);

  const handleClick = (index: number) => {
    setSelected(index);
    centerItem(index);
    onSelect?.(index, waktu[index]);
  };

  if (!tutor) {
    return (
      <section className="w-full">
        <p className="text-red-500">Jadwal tutor tidak ditemukan.</p>
      </section>
    );
  }

  return (
    <section className={`w-full ${className}`}>
      <h3 className="text-[18px] font-semibold text-[var(--biru)] mb-3">
        Waktu Tersedia
      </h3>

      <div className="relative bg-[#F5F6FB] rounded-3xl p-3 overflow-hidden">
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-3 overflow-x-auto w-full scroll-smooth px-2 [&::-webkit-scrollbar]:hidden"
        >
          {formattedTimes.map((item, i) => (
            <button
              key={`${item.tanggal}-${i}`}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              onClick={() => handleClick(i)}
              className={`px-5 py-3 rounded-2xl text-sm font-medium transition-all border-2 whitespace-nowrap shrink-0 ${
                selected === i
                  ? "bg-white text-[var(--biru)] border-[var(--biru)] shadow-sm"
                  : "bg-[var(--putih)] text-[var(--biru)]/90 border-[var(--biru)]/20 hover:bg-[#E6F3F5]"
              }`}
            >
              {item.label}
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
              if (selected > 0) {
                handleClick(selected - 1);
              } else {
                centerItem(selected);
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
              if (selected < formattedTimes.length - 1) {
                handleClick(selected + 1);
              } else {
                centerItem(selected);
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
    </section>
  );
};

export default WaktuTersedia;
