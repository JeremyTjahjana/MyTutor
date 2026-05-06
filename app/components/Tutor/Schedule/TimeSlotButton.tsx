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
      className={`btn-card ${
        active ? "btn-card-active" : "btn-card-inactive"
      } ${isMobile ? "w-full" : "shrink-0"}`}
    >
      {label}
    </button>
  );
}
