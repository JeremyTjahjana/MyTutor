import { z } from "zod";

export const tutorListFiltersSchema = z.object({
  search: z.string().trim().min(1).optional(),
  subjectId: z.string().uuid().optional(),
});

export type TutorListFiltersInput = z.infer<typeof tutorListFiltersSchema>;
