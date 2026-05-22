import { notFound } from "next/navigation";
import { getTutorById } from "@/features/tutor/services/tutor.service";
import {
  PortfolioSection,
  TestimoniesSection,
  TutorDescription,
  TutorHeader,
  TutorScheduleButton,
} from "@/features/tutor/components/tutor-detail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const tutor = await getTutorById(id);

  if (!tutor) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F7F8FC] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl px-2 sm:px-4 lg:px-6">
        <TutorHeader
          name={tutor.name}
          avatarUrl={tutor.avatarUrl}
          subjects={tutor.subjects.map((s) => s.name)}
          costPerHour={tutor.costPerHour}
          rating={tutor.rating}
        />
        <TutorDescription description={tutor.bio} />
        <PortfolioSection
          portfolioUrls={tutor.portfolioUrls}
          tutorName={tutor.name}
        />
        <TestimoniesSection testimonies={tutor.testimonies} />
        <TutorScheduleButton tutorId={tutor.id} />
      </div>
    </main>
  );
}
