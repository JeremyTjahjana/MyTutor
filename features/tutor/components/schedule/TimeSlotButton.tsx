import type { Schedule } from "@/types/tutor";
import { DAY_NAMES } from "@/types/tutor";

interface TimeSlotButtonProps {
  schedule: Schedule;
  active: boolean;
  onClick: () => void;
  isMobile?: boolean;
}

export function TimeSlotButton({
  schedule,
  active,
  onClick,
  isMobile,
}: TimeSlotButtonProps) {
  const dayName = DAY_NAMES[schedule.dayOfWeek] ?? "—";
  const timeLabel = `${schedule.startTime.slice(0, 5)} - ${schedule.endTime.slice(0, 5)}`;
  const label = `${dayName} (${timeLabel})`;

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
