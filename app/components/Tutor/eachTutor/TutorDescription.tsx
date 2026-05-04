interface TutorDescriptionProps {
  description: string;
}

export function TutorDescription({ description }: TutorDescriptionProps) {
  return (
    <p className="mt-5 text-[13px] leading-6 text-[var(--gelap)]/85 sm:mt-6 sm:text-[15px] sm:leading-7">
      {description}
    </p>
  );
}
