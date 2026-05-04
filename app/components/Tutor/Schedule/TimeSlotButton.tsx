interface TimeSlotButtonProps {
  waktu: {
    hari: string;
    jamMulai: string;
    jamSelesai: string;
    tanggal: string;
  };
  active: boolean;
  onClick: () => void;
  isMobile?: boolean;
}

export function TimeSlotButton({
  waktu,
  active,
  onClick,
  isMobile,
}: TimeSlotButtonProps) {
  const label = `${waktu.hari}, ${new Date(waktu.tanggal).toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  )} (${waktu.jamMulai} - ${waktu.jamSelesai})`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left px-5 py-4 rounded-full border text-sm transition-colors cursor-pointer hover:bg-[var(--biru)]/10 ${
        isMobile ? "w-full" : "shrink-0"
      } ${
        active
          ? "bg-white border-[var(--biru)] text-[var(--biru)]"
          : "bg-white border-[var(--biru)]/30 text-[var(--biru)]/80"
      }`}
      style={isMobile ? undefined : { minWidth: 220 }}
    >
      {label}
    </button>
  );
}
