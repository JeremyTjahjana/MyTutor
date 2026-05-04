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
            className={`hover:bg-[var(--biru)]/10 cursor-pointer shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              i === activeMatkul
                ? "border-[var(--biru)] text-[var(--biru)] bg-white"
                : "border-[var(--biru)]/30 text-[var(--biru)]/80 bg-white"
            }`}
          >
            {m}
          </button>
        ))}
      </ScrollableRow>
    </section>
  );
}
