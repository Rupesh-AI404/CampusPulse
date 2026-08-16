import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { PulseMark } from "@/components/campus/SiteChrome";
import { homeFor } from "@/components/campus/AuthGate";
import { demoAccounts, usePulse, type Role } from "@/lib/pulse-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { next?: string } =>
    typeof search["next"] === "string" ? { next: search["next"] } : {},

  head: () => ({
    meta: [
      { title: "Sign in — Campus Pulse" },
      {
        name: "description",
        content:
          "Sign in to Campus Pulse as a student to track your journey, or as an organiser to publish opportunities and review applicants.",
      },
      { property: "og:title", content: "Sign in — Campus Pulse" },
      {
        property: "og:description",
        content: "Two roles, one campus opportunity ecosystem. Sign in to continue.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

function Login() {
  const { login, session, ready } = usePulse();
  const { next } = Route.useSearch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const go = (role: Role) => {
    const target = next && next !== "/login" ? next : homeFor(role);
    void navigate({ to: target, replace: true });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter both an email and a password.");
      return;
    }
    const result = login(email, password);
    if (!result.ok || !result.role) {
      setError(result.message);
      return;
    }
    setError(null);
    toast.success(result.message, {
      description:
        result.role === "student"
          ? "Discover, save, apply and track your journey."
          : "Create opportunities and review applicants.",
    });
    go(result.role);
  };

  const useDemo = (account: (typeof demoAccounts)[number]) => {
    setEmail(account.email);
    setPassword(account.password);
    setError(null);
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="shell flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <PulseMark />
            <span className="font-display text-[0.95rem] font-extrabold tracking-tight">
              Campus Pulse
            </span>
          </Link>
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            Back to the landing page
          </Link>
        </div>
      </header>

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-canvas" aria-hidden />
        <div className="shell relative grid gap-14 pt-16 pb-24 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
          <div>
            <p className="marker">Sign in</p>
            <h1 className="mt-6 max-w-lg type-heading">
              Two roles, one
              <br />
              campus ecosystem.
            </h1>
            <p className="mt-7 max-w-md type-lede">
              Students discover, apply and build a record of what they achieved. Organisers publish
              opportunities and decide who joins them.
            </p>

            {ready && session && (
              <div className="panel mt-10 p-5">
                <p className="text-sm">
                  You are already signed in as{" "}
                  <span className="font-semibold">{session.name}</span>.
                </p>
                <button
                  className="btn btn-primary mt-4"
                  onClick={() => go(session.role)}
                >
                  Continue
                  <ArrowRight className="size-4" />
                </button>
              </div>
            )}

            <div className="mt-12 space-y-3">
              <p className="marker">Demo accounts</p>
              {demoAccounts.map((a) => (
                <button
                  key={a.email}
                  type="button"
                  onClick={() => useDemo(a)}
                  className="panel flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:border-border-strong"
                >
                  <span>
                    <span className="font-display text-sm font-bold tracking-tight">
                      {a.role === "student" ? "Student" : "Organiser"}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {a.email} · {a.password}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em]",
                      a.role === "student"
                        ? "bg-primary/12 text-primary"
                        : "bg-energy/12 text-energy",
                    )}
                  >
                    Use
                  </span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={submit} className="panel panel-signal h-fit p-7 lg:sticky lg:top-24">
            <p className="font-display text-lg font-bold tracking-tight">Sign in to continue</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Prototype sign-in — your session is kept in this browser.
            </p>

            <label className="mt-8 block">
              <span className="marker">Email</span>
              <div className="field mt-2.5 pb-2">
                <input
                  type="email"
                  value={email}
                  autoComplete="username"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@campus.edu"
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
            </label>

            <label className="mt-6 block">
              <span className="marker">Password</span>
              <div className="field mt-2.5 pb-2">
                <input
                  type="password"
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
            </label>

            {error && <p className="mt-4 text-xs font-medium text-energy">{error}</p>}

            <button type="submit" className="btn btn-primary mt-8 w-full justify-center">
              Sign in
              <ArrowRight className="size-4" />
            </button>
            <p className="mt-4 text-xs text-muted-foreground">
              Pick a demo account on the left to fill these fields.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
