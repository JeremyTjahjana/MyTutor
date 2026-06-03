import { NextRequest, NextResponse } from "next/server";
import { listBookingsForDashboardRequest } from "@/features/booking/services/booking.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  try {
    const bookings = await listBookingsForDashboardRequest({
      studentId: searchParams.get("studentId"),
      tutorUserId: searchParams.get("tutorUserId"),
    });

    return NextResponse.json(bookings);
  } catch (err) {
    if (err instanceof Error && err.message === "BOOKING_FILTER_REQUIRED") {
      return NextResponse.json(
        { error: "studentId or tutorUserId required" },
        { status: 400 },
      );
    }

    console.error("/api/bookings error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
