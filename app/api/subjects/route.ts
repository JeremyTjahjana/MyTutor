import { NextRequest, NextResponse } from "next/server";
import { fetchSubjectsCatalog } from "@/features/tutor/repositories/tutor.repository";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search") ?? undefined;

  try {
    const subjects = await fetchSubjectsCatalog(search);
    return NextResponse.json({ subjects });
  } catch (err) {
    console.error("/api/subjects error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
