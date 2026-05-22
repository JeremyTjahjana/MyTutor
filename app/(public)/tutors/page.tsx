import SearchTutor from "@/features/tutor/components/SearchTutor";
import { TutorList } from "@/features/tutor/components/TutorList";
import { listTutors } from "@/features/tutor/services/tutor.service";

export default async function TutorPage() {
  const tutors = await listTutors();

  return (
    <>
      <h2 className="text-center text-[40px] sm:text-5xl md:text-7xl font-semibold text-[var(--biru)] py-12">
        Tutors Available
      </h2>
      <SearchTutor />
      <TutorList tutors={tutors} />
    </>
  );
}
