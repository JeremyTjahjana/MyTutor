interface PortfolioSectionProps {
  portfolioUrls: string[];
  tutorName: string;
}

export function PortfolioSection({
  portfolioUrls,
  tutorName,
}: PortfolioSectionProps) {
  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold text-[var(--biru)] sm:text-xl">
        Portofolio
      </h2>
      {portfolioUrls.length === 0 ? (
        <p className="mt-3 text-sm text-[var(--gelap)]/45 italic">
          Belum ada portofolio yang ditambahkan.
        </p>
      ) : (
        <div className="mt-2 flex gap-3 overflow-x-auto pb-2">
          {portfolioUrls.map((url, index) => (
            <article
              key={index}
              className="relative h-[190px] w-[300px] shrink-0 overflow-hidden rounded-[20px] bg-[#F0ECFF] sm:h-[240px] sm:w-[360px] md:h-[280px] md:w-[400px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Portfolio ${index + 1} ${tutorName}`}
                className="h-full w-full object-cover"
              />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
