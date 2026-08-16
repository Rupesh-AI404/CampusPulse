import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Compass,
  Bookmark,
  FileText,
  Activity,
  User,
  LayoutGrid,
  Plus,
  Inbox,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { usePulse, organizerProfile } from "@/lib/pulse-store";


/** The Campus Pulse mark: four signal ticks rising into a journey. */
export function PulseMark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-end gap-[3px]", className)} aria-hidden>
      {[6, 11, 8, 15].map((h, i) => (
        <span
          key={i}
          className={cn("w-[3px] rounded-full", i === 3 ? "bg-growth" : "bg-primary")}
          style={{ height: h }}
        />
      ))}
    </span>
  );
}

const studentLinks = [
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/applications", label: "Applications", icon: FileText },
  { to: "/dashboard", label: "My journey", icon: Activity },
  { to: "/profile", label: "Profile", icon: User },
] as const;

const organizerLinks = [
  { to: "/organizer", label: "Dashboard", icon: LayoutGrid },
  { to: "/organizer/opportunities", label: "My opportunities", icon: Compass },
  { to: "/organizer/applications", label: "Applications", icon: Inbox },
  { to: "/organizer/new", label: "Create", icon: Plus },
] as const;

function AccountControls() {
  const { session, profile, logout } = usePulse();
  const navigate = useNavigate();

  if (!session) {
    return (
      <Link to="/login" className="btn btn-primary">
        Sign in
      </Link>
    );
  }

  const organizer = session.role === "organizer";
  const avatar = !organizer ? profile.avatar : undefined;

  return (
    <div className="flex items-center gap-3">
      <span className="hidden items-center gap-2 sm:flex">
        {avatar ? (
          <img
            src={avatar}
            alt=""
            className="size-7 rounded-full border border-border-strong object-cover"
          />
        ) : (
          <span className="grid size-7 place-items-center rounded-full border border-border-strong bg-surface text-[0.6rem] font-bold">
            {organizer ? organizerProfile.initials : profile.initials}
          </span>
        )}
        <span className="hidden text-xs text-muted-foreground xl:inline">{session.name}</span>
      </span>
      <button
        onClick={() => {
          logout();
          toast("Signed out", { description: "Your session was cleared from this browser." });
          void navigate({ to: "/login", replace: true });
        }}
        className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-surface px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <LogOut className="size-3.5" />
        Log out
      </button>
    </div>
  );
}

export function SiteHeader() {
  const { role, session, savedOpportunities, myApplications, organizerApplications } = usePulse();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const organizer = role === "organizer";
  const links = session ? (organizer ? organizerLinks : studentLinks) : [];


  const countFor = (to: string) => {
    if (to === "/saved") return savedOpportunities.length;
    if (to === "/applications") return myApplications.length;
    if (to === "/organizer/applications")
      return organizerApplications.filter((a) => a.status === "pending").length;
    return 0;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="group flex items-center gap-3">
            <PulseMark className="transition-transform duration-300 group-hover:translate-y-[-1px]" />
            <span className="font-display text-[0.95rem] font-extrabold tracking-tight">
              Campus Pulse
            </span>
          </Link>
          {session && (
            <span
              className={cn(
                "hidden rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] sm:inline-block",
                organizer ? "bg-energy/12 text-energy" : "bg-primary/12 text-primary",
              )}
            >
              {organizer ? "Organiser" : "Student"}
            </span>
          )}

        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => {
            const count = countFor(l.to);
            const active = l.to === "/organizer" ? pathname === "/organizer" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "underline-sweep flex items-center gap-2 text-sm transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {l.label}
                {count > 0 && (
                  <span className="rounded-full bg-surface-raised px-1.5 text-[0.65rem] font-bold tabular-nums text-foreground">
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <AccountControls />
        </div>

      </div>

      {/* Mobile / narrow: the same destinations, never hidden */}
      {links.length > 0 && (
      <div className="border-t border-border lg:hidden">

        <div className="shell flex gap-1 overflow-x-auto py-2">
          {links.map((l) => {
            const active = l.to === "/organizer" ? pathname === "/organizer" : pathname.startsWith(l.to);
            const Icon = l.icon;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "flex flex-none items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-surface-raised text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-3.5" />
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>
      )}
    </header>

  );
}

export function SiteFooter() {
  return (
    <footer className="mt-28 border-t border-border">
      <div className="shell flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <PulseMark />
          <p className="font-display text-sm font-bold">
            Campus Pulse
            <span className="ml-2 font-sans font-normal text-muted-foreground">
              Your campus opportunities, connected.
            </span>
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Discover · Apply · Participate · Achieve — prototype data stored in your browser
        </p>
      </div>
    </footer>
  );
}
