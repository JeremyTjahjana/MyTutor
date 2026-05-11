import { ScrollableRow } from "./ScrollableRow";

interface SubjectsSectionProps {
  matkuls: string[];
  activeMatkul: number;
  onMatkul: (index: number) => void;
}

export function SubjectsSection({
  matkuls,
  activeMatkul,
  onMatkul,
}: SubjectsSectionProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-[var(--biru)] mb-3">
        Pelajaran Tersedia
      </h2>
      <ScrollableRow>
        {matkuls.map((m, i) => (
          <button
            key={m + i}
            onClick={() => onMatkul(i)}
            type="button"
            className={`btn-chip ${
              i === activeMatkul ? "btn-chip-active" : "btn-chip-inactive"
            } shrink-0 px-4 py-2`}
          >
            {m}
          </button>
        ))}
      </ScrollableRow>
    </section>
  );
}
