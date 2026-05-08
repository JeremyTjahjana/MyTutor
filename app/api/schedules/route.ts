import { NextRequest, NextResponse } from "next/server";
import {
  fetchSchedulesByTutorProfileId,
  fetchTutorProfileByUserId,
} from "@/app/server/repositories/tutors.repository";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tutorUserId = searchParams.get("tutorUserId");

  if (!tutorUserId) {
    return NextResponse.json(
      { error: "tutorUserId required" },
      { status: 400 },
    );
  }

  try {
    const profile = await fetchTutorProfileByUserId(tutorUserId);
    if (!profile) {
      return NextResponse.json({ tutorProfileId: null, schedules: [] });
    }

    const schedules = await fetchSchedulesByTutorProfileId(profile.id);
    return NextResponse.json({
      tutorProfileId: profile.id,
      schedules,
      profile: {
        bio: profile.bio,
        experience: profile.experience,
        cost_per_hour: profile.cost_per_hour,
      },
    });
  } catch (err) {
    console.error("/api/schedules error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
