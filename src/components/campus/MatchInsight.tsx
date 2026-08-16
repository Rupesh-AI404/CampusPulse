import { Check } from "lucide-react";
import type { MatchReason } from "@/data/campus";
import { MatchMeter } from "./MatchMeter";

/**
 * The match system as a signature product feature: the number never appears
 * without the signals that produced it.
 */
export function MatchInsight({
  value,
  reasons,
  size = "lg",
  note,
}: {
  value: number;
  reasons: MatchReason[];
  size?: "sm" | "lg";
  note?: string;
}) {
  const verdict =
    value >= 85 ? "Strong fit" : value >= 70 ? "Worth a look" : "Stretch opportunity";

  return (
    <div>
      <div className="flex items-center gap-5">
        <MatchMeter value={value} size={size} />
        <div className="min-w-0">
          <p className="font-display text-base font-bold tracking-tight">{verdict}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {note ?? "Read from your profile signals — never from popularity."}
          </p>
        </div>
      </div>

      <p className="marker mt-6">Why this matched</p>
      <ul className="mt-3.5 space-y-2.5">
        {reasons.map((r, i) => (
          <li
            key={r.label}
            className="flex items-start gap-2.5 text-sm animate-rise"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <Check className="mt-0.5 size-3.5 flex-none text-growth" />
            <span className="text-foreground/85">{r.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
