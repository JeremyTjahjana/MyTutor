"use client";

import React, { useEffect, useMemo, useState } from "react";
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

  const [selected, setSelected] = useState<number | null>(controlledIndex);

  useEffect(() => {
    setSelected(controlledIndex);
  }, [controlledIndex]);

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
      <h3 className="text-2xl font-semibold text-[var(--biru)] mb-3">
        Waktu Tersedia
      </h3>

      <div className="rounded-2xl bg-[#F5F6FB] p-6">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          }}
        >
          {formattedTimes.map((item, i) => (
            <button
              key={`${item.tanggal}-${i}`}
              onClick={() => handleClick(i)}
              className={`w-full px-5 py-3 rounded-2xl text-sm font-medium transition-all border-2 flex items-center justify-center text-center ${
                selected === i
                  ? "bg-white text-[var(--biru)] border-[var(--biru)] shadow-sm"
                  : "bg-[var(--putih)] text-[var(--biru)]/90 border-[var(--biru)]/20 hover:bg-[#E6F3F5]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WaktuTersedia;
