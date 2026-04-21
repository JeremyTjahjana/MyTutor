"use client";

import React, { useEffect, useState } from "react";

type Props = {
  times?: string[];
  columns?: number;
  selectedIndex?: number | null;
  onSelect?: (index: number, time: string) => void;
  className?: string;
};

const defaultTimes = [
  "Senin (13:00 - 14:30)",
  "Senin (15:00 - 16:30)",
  "Selasa (09:00 - 10:30)",
  "Rabu (11:00 - 12:30)",
  "Kamis (13:00 - 14:30)",
  "Jumat (08:00 - 09:30)",
];

const WaktuTersedia = ({
  times = defaultTimes,
  columns = 2,
  selectedIndex: controlledIndex = null,
  onSelect,
  className = "",
}: Props) => {
  const [selected, setSelected] = useState<number | null>(controlledIndex ?? null);

  useEffect(() => {
    setSelected(controlledIndex ?? null);
  }, [controlledIndex]);

  const handleClick = (index: number) => {
    setSelected(index);
    if (onSelect) onSelect(index, times[index]);
  };

  return (
    <section className={`w-full ${className}`}>
      <h3 className="text-2xl font-semibold text-[var(--biru)] mb-2">Waktu Tersedia</h3>

      <div className="rounded-2xl bg-[#F5F6FB] p-6">
        <div
          className={`grid grid-cols-1 sm:grid-cols-${columns} gap-4`}
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {times.map((t, i) => (
            <button
              key={t + i}
              onClick={() => handleClick(i)}
              className={`w-full px-5 py-2 rounded-full text-sm font-medium transition-colors border-2 flex items-center justify-center whitespace-nowrap ${
                selected === i
                  ? "bg-white text-[var(--biru)] border-[var(--biru)]"
                  : "bg-[var(--putih)] text-[var(--biru)]/90 border-[var(--biru)]/30 hover:bg-[#E6F3F5]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WaktuTersedia;
