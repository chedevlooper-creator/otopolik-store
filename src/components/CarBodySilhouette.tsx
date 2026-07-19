"use client";

type Props = {
  bodyType: string;
  className?: string;
};

export default function CarBodySilhouette({ bodyType, className = "h-12 w-24 text-white/40" }: Props) {
  const norm = bodyType.toLowerCase();

  // SUV, Crossover, MPV, Minivan, Van
  if (norm.includes("suv") || norm.includes("cross") || norm.includes("mpv") || norm.includes("van") || norm.includes("wagon") || norm.includes("station")) {
    return (
      <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        {/* Ground/wheels line */}
        <path d="M2 17h10M20 17h8M36 17h10" />
        {/* SUV Body path */}
        <path d="M2 15v-4.5c0-1 .8-1.5 1.8-1.5h7.7l4.5-3.5A2.5 2.5 0 0 1 18 5h17.5c1.2 0 2.2.8 2.5 2l2.5 4.5h2.7c1 0 1.8.8 1.8 1.8v2.2M43 15h2" />
        {/* Wheels */}
        <circle cx="16" cy="17" r="4.2" fill="none" strokeWidth="1.5" />
        <circle cx="16" cy="17" r="1.5" fill="currentColor" />
        <circle cx="32" cy="17" r="4.2" fill="none" strokeWidth="1.5" />
        <circle cx="32" cy="17" r="1.5" fill="currentColor" />
      </svg>
    );
  }

  // Hatchback, Microcar
  if (norm.includes("hatchback") || norm.includes("micro") || norm.includes("stepway")) {
    return (
      <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        {/* Ground/wheels line */}
        <path d="M2 17h10M20 17h8M36 17h10" />
        {/* Hatchback Body path */}
        <path d="M2 15v-4c0-1 .8-1.5 1.8-1.5h8.2l5.5-4.5a2.5 2.5 0 0 1 1.7-.8h14.3c1.1 0 2 .8 2.2 1.8l1.8 4.7c.3.2 1 .3 1.5.3h3.2c1 0 1.8.8 1.8 1.8v2" />
        {/* Wheels */}
        <circle cx="16" cy="17" r="4.2" fill="none" strokeWidth="1.5" />
        <circle cx="16" cy="17" r="1.5" fill="currentColor" />
        <circle cx="32" cy="17" r="4.2" fill="none" strokeWidth="1.5" />
        <circle cx="32" cy="17" r="1.5" fill="currentColor" />
      </svg>
    );
  }

  // Coupe, Cabrio, Roadster, Convertible
  if (norm.includes("coupe") || norm.includes("cabrio") || norm.includes("roadster") || norm.includes("sport")) {
    return (
      <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        {/* Ground/wheels line */}
        <path d="M2 17h10M20 17h8M36 17h10" />
        {/* Coupe Body path */}
        <path d="M2 15v-2.5c0-.8.8-1.3 1.5-1.3h7.3l5-4.2A2.5 2.5 0 0 1 17.5 6.5h11c1 0 2 .6 2.5 1.5l3.2 3.8h6.1c1 0 1.8.8 1.8 1.8V15" />
        {/* Wheels */}
        <circle cx="16" cy="17" r="4.2" fill="none" strokeWidth="1.5" />
        <circle cx="16" cy="17" r="1.5" fill="currentColor" />
        <circle cx="32" cy="17" r="4.2" fill="none" strokeWidth="1.5" />
        <circle cx="32" cy="17" r="1.5" fill="currentColor" />
      </svg>
    );
  }

  // Sedan, Liftback, Sportback, Fastback (Default)
  return (
    <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      {/* Ground/wheels line */}
      <path d="M2 17h10M20 17h8M36 17h10" />
      {/* Sedan Body path */}
      <path d="M2 15v-2c0-.8.8-1.5 1.8-1.5h7.2l4.5-4.2a2.5 2.5 0 0 1 1.7-.8H30c1.1 0 2 .8 2.5 1.8l2.5 3.2H42c1 0 1.8.8 1.8 1.8V15" />
      {/* Wheels */}
      <circle cx="16" cy="17" r="4.2" fill="none" strokeWidth="1.5" />
      <circle cx="16" cy="17" r="1.5" fill="currentColor" />
      <circle cx="32" cy="17" r="4.2" fill="none" strokeWidth="1.5" />
      <circle cx="32" cy="17" r="1.5" fill="currentColor" />
    </svg>
  );
}
