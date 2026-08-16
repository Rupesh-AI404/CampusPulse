import { useEffect } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { usePulse, type Role } from "@/lib/pulse-store";
import { PulseMark } from "@/components/campus/SiteChrome";

/** Prefixes that require a signed-in session, and the role allowed on each. */
const guarded: { prefix: string; role: Role | "any" }[] = [
  { prefix: "/explore", role: "student" },
  { prefix: "/saved", role: "student" },
  { prefix: "/applications", role: "student" },
  { prefix: "/dashboard", role: "student" },
  { prefix: "/profile", role: "student" },
  { prefix: "/opportunity", role: "any" },
  { prefix: "/organizer", role: "organizer" },
];

export function guardFor(pathname: string) {
  return guarded.find((g) => pathname === g.prefix || pathname.startsWith(`${g.prefix}/`));
}

export const homeFor = (role: Role) => (role === "organizer" ? "/organizer" : "/dashboard");

function Holding({ label }: { label: string }) {
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <PulseMark />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

/**
 * Frontend-only session gate. Protected pages never render for a visitor
 * without the right role in localStorage.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { ready, session } = usePulse();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const guard = guardFor(pathname);
  const allowed =
    !guard ||
    (session !== null && (guard.role === "any" || session.role === guard.role));

  useEffect(() => {
    if (!ready || !guard || allowed) return;
    if (!session) {
      void navigate({ to: "/login", search: { next: pathname }, replace: true });
    } else {
      void navigate({ to: homeFor(session.role), replace: true });
    }
  }, [ready, guard, allowed, session, pathname, navigate]);

  if (guard && !ready) return <Holding label="Checking your session…" />;
  if (!allowed) return <Holding label="Redirecting…" />;
  return <>{children}</>;
}
