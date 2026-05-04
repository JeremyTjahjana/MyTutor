import type { StaticImageData } from "next/image";
import Image from "next/image";

interface PortfolioSectionProps {
  portofolio: Array<string | StaticImageData>;
  tutorName: string;
}

export function PortfolioSection({
  portofolio,
  tutorName,
}: PortfolioSectionProps) {
  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold text-[var(--biru)] sm:text-xl">
        Portofolio
      </h2>
      <div className="mt-2 flex gap-3 overflow-x-auto pb-2">
        {portofolio.map((item, index) => (
          <article
            key={index}
            className="relative h-[190px] w-[300px] shrink-0 overflow-hidden rounded-[20px] bg-[#F0ECFF] sm:h-[240px] sm:w-[360px] md:h-[280px] md:w-[400px]"
          >
            <Image
              src={item}
              alt={`Portfolio ${index + 1} ${tutorName}`}
              fill
              className="object-cover"
            />
          </article>
        ))}
      </div>
    </section>
  );
}
