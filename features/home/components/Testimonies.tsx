import { connection } from "next/server";
import { supabase } from "@/lib/supabase/server";
import TestimoniesCarousel, { type HomeTestimony } from "./TestimoniesCarousel";

function unwrapJoin<T>(join: unknown): T | null {
  if (!join) return null;
  if (Array.isArray(join)) return (join[0] as T) ?? null;
  return join as T;
}

async function fetchHomeTestimonies(): Promise<HomeTestimony[]> {
  await connection();

  const { data, error } = await supabase
    .from("testimonies")
    .select(
      `id, tutor_profile_id, rating, message, created_at,
       users!testimonies_student_id_fkey(full_name, avatar_url)`,
    )
    .eq("rating", 5)
    .not("message", "is", null)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    console.error("fetchHomeTestimonies error:", error);
    return [];
  }

  const rows = (data ?? []).filter(
    (row) => typeof row.message === "string" && row.message.trim().length > 0,
  ).sort(() => Math.random() - 0.5).slice(0, 5);
  const tutorProfileIds = [
    ...new Set(rows.map((row) => row.tutor_profile_id as string)),
  ];
  const subjectMap = new Map<string, string[]>();

  if (tutorProfileIds.length > 0) {
    const { data: subjectRows, error: subjectError } = await supabase
      .from("tutor_subjects")
      .select("tutor_profile_id, subjects(name)")
      .in("tutor_profile_id", tutorProfileIds);

    if (subjectError) {
      console.error("fetchHomeTestimonies subjects error:", subjectError);
    }

    for (const row of subjectRows ?? []) {
      const subject = unwrapJoin<{ name: string }>(row.subjects);
      if (!subject) continue;

      const tutorProfileId = row.tutor_profile_id as string;
      const currentSubjects = subjectMap.get(tutorProfileId) ?? [];
      subjectMap.set(tutorProfileId, [...currentSubjects, subject.name]);
    }
  }

  return rows.map((row) => {
    const student = unwrapJoin<{ full_name: string; avatar_url: string | null }>(
      row.users,
    );
    const subjects = subjectMap.get(row.tutor_profile_id as string) ?? [];

    return {
      id: row.id as string,
      profile: student?.avatar_url ?? null,
      studentName: student?.full_name ?? "Anonim",
      subjects:
        subjects.length > 0 ? subjects.slice(0, 3).join(", ") : "General",
      message: row.message as string,
      rating: Number(row.rating) || 0,
    };
  });
}

export default async function Testimonies() {
  const testimonials = await fetchHomeTestimonies();

  return <TestimoniesCarousel testimonials={testimonials} />;
}
