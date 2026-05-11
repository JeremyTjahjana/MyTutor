import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_TUTOR_SUBJECTS } from "@/lib/data";
import { fetchSubjectsCatalog } from "@/features/tutor/repositories/tutor.repository";
import { subjectNameCategoryMatch } from "@/lib/subject-utils";

function filterPresetSubjects(
  search: string | undefined,
  dbSubjects: { name: string; category: string | null }[],
): { name: string; category: string | null }[] {
  const q = search?.trim();
  const safe = q
    ? q.replace(/%/g, "").replace(/_/g, "").trim().toLowerCase()
    : "";

  return DEFAULT_TUTOR_SUBJECTS.filter((p) => {
    const alreadyInDb = dbSubjects.some((s) =>
      subjectNameCategoryMatch(p.name, p.category, s.name, s.category),
    );
    if (alreadyInDb) return false;
    if (!safe) return true;
    const n = p.name.toLowerCase();
    const c = (p.category ?? "").toLowerCase();
    return n.includes(safe) || c.includes(safe);
  });
}

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search") ?? undefined;

  try {
    const subjects = await fetchSubjectsCatalog(search);
    const presets = filterPresetSubjects(search, subjects);
    return NextResponse.json({ subjects, presets });
  } catch (err) {
    console.error("/api/subjects error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
