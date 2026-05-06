import { notFound } from "next/navigation";
import { dummyTutor } from "@/app/assets/assets";
import {
  PortfolioSection,
  TestimoniesSection,
  TutorDescription,
  TutorHeader,
  TutorScheduleButton,
} from "@/app/components/Tutor/eachTutor";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const tutor = dummyTutor.find(
    (item) => item.id === Number(resolvedParams.id),
  );

  if (!tutor) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F7F8FC] px-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10">
        <TutorHeader tutor={tutor} />
        <TutorDescription description={tutor.description} />
        <PortfolioSection
          portofolio={tutor.portofolio}
          tutorName={tutor.name}
        />
        <TestimoniesSection tutor={tutor} />
        <TutorScheduleButton tutorId={tutor.id} />
      </div>
    </main>
  );
}
