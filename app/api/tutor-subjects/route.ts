import { NextRequest, NextResponse } from "next/server";
import {
  fetchTutorProfileByUserId,
  fetchTutorSubjectsByProfileId,
} from "@/features/tutor/repositories/tutor.repository";

export async function GET(request: NextRequest) {
  const tutorUserId = request.nextUrl.searchParams.get("tutorUserId");

  if (!tutorUserId) {
    return NextResponse.json(
      { error: "tutorUserId required" },
      { status: 400 },
    );
  }

  try {
    const profile = await fetchTutorProfileByUserId(tutorUserId);
    if (!profile) {
      return NextResponse.json({ tutorProfileId: null, subjects: [] });
    }

    const subjects = await fetchTutorSubjectsByProfileId(profile.id);
    return NextResponse.json({
      tutorProfileId: profile.id,
      subjects,
    });
  } catch (err) {
    console.error("/api/tutor-subjects error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
