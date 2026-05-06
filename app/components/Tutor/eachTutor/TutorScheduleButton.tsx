"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar, Loader2 } from "lucide-react";

interface TutorScheduleButtonProps {
  tutorId: number;
}

export function TutorScheduleButton({ tutorId }: TutorScheduleButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleViewSchedule = () => {
    setIsPending(true);
    router.push(`/tutor/${tutorId}/schedule`);
  };

  const handleBack = () => {
    router.push(`/tutor`);
  };

  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full mx-auto sm:max-w-md">
      <button
        onClick={handleViewSchedule}
        disabled={isPending}
        className="btn-primary w-full"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <Calendar className="mr-2 h-5 w-5" />
            Cek Jadwal
          </>
        )}
      </button>

      <button onClick={handleBack} className="btn-secondary w-full">
        Kembali
      </button>
    </div>
  );
}
