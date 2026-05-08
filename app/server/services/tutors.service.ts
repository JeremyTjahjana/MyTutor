import {
  fetchTutorListings,
  fetchTutorById,
  fetchTutorProfileByUserId,
  fetchSchedulesByTutorProfileId,
  updateTutorProfile,
  updateSchedule,
  createSchedule,
  deleteSchedule,
  type UpdateTutorProfileInput,
  type UpdateScheduleInput,
  type CreateScheduleInput,
} from "../repositories/tutors.repository";
import {
  tutorListFiltersSchema,
  type TutorListFiltersInput,
} from "../validations/tutors.validation";
import type { TutorListItem, TutorDetail } from "@/app/types/tutor";

function normalizeText(value: string) {
  return value.toLowerCase().trim();
}

export async function listTutors(
  input?: TutorListFiltersInput,
): Promise<TutorListItem[]> {
  const filters = tutorListFiltersSchema.parse(input ?? {});
  const tutors = await fetchTutorListings();

  return tutors.filter((tutor) => {
    if (filters.subjectId && !tutor.subjects.includes(filters.subjectId)) {
      return false;
    }
    if (!filters.search) return true;
    const query = normalizeText(filters.search);
    return [tutor.name, tutor.bio, ...tutor.subjects]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
}

export async function getTutorById(
  tutorProfileId: string,
): Promise<TutorDetail | null> {
  return fetchTutorById(tutorProfileId);
}

export async function getTutorProfileByUserId(userId: string) {
  return fetchTutorProfileByUserId(userId);
}

export async function getSchedulesByTutorProfileId(tutorProfileId: string) {
  return fetchSchedulesByTutorProfileId(tutorProfileId);
}

export async function updateTutorProfileService(
  tutorProfileId: string,
  input: UpdateTutorProfileInput,
): Promise<void> {
  return updateTutorProfile(tutorProfileId, input);
}

export async function updateScheduleService(
  scheduleId: string,
  input: UpdateScheduleInput,
): Promise<void> {
  return updateSchedule(scheduleId, input);
}

export async function createScheduleService(
  input: CreateScheduleInput,
): Promise<{ id: string }> {
  return createSchedule(input);
}

export async function deleteScheduleService(scheduleId: string): Promise<void> {
  return deleteSchedule(scheduleId);
}
