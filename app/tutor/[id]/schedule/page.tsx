import { notFound } from "next/navigation";
import { getTutorById } from "@/app/server/services/tutors.service";
import { fetchSlotStatuses } from "@/app/server/repositories/bookings.repository";
import SchedulePageClient from "./SchedulePageClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function SchedulePage({ params }: PageProps) {
  const { id } = await params;
  const [tutor, slotStatuses] = await Promise.all([
    getTutorById(id),
    fetchSlotStatuses(id),
  ]);

  if (!tutor) {
    notFound();
  }

  return <SchedulePageClient tutor={tutor} slotStatuses={slotStatuses} />;
}
