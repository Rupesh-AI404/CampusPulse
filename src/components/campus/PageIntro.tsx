import { cn } from "@/lib/utils";

export function PageIntro({
  eyebrow,
  title,
  lede,
  aside,
  className,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("shell pt-14 pb-10 md:pt-20", className)}>
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl animate-rise">
          <p className="marker">{eyebrow}</p>
          <h1 className="mt-5 type-heading">{title}</h1>
          {lede && <p className="mt-4 max-w-xl type-lede">{lede}</p>}
        </div>
        {aside && <div className="animate-rise md:pb-2">{aside}</div>}
      </div>
    </div>
  );
}

export function StageChip({ stage }: { stage: string }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-border-strong bg-surface px-3.5 py-1.5 text-xs font-semibold tracking-wide">
      <span className="flex items-end gap-[2px]" aria-hidden>
        {[4, 7, 10, 6].map((h, i) => (
          <span
            key={i}
            className={cn("w-[2px] rounded-full", i < 2 ? "bg-growth" : "bg-primary")}
            style={{ height: h }}
          />
        ))}
      </span>
      {stage}
    </span>
  );
}
