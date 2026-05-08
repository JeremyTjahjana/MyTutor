import SearchTutor from "../components/Tutor/SearchTutor";
import { TutorList } from "../components/TutorList";
import { listTutors } from "../server/services/tutors.service";

export default async function TutorPage() {
  const tutors = await listTutors();

  return (
    <>
      <h2 className="text-center text-[40px] sm:text-5xl md:text-7xl font-semibold text-[var(--biru)] pt-12">
        Tutors Available
      </h2>
      <SearchTutor />
      <TutorList tutors={tutors} />
    </>
  );
}
