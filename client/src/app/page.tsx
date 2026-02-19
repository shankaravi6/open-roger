import Link from "next/link";
import Image from "next/image";
import { Sparkles, LogIn, UserPlus } from "lucide-react";

/** Theme: #2a3038 (base), #ca786d (accent) */
const theme = {
  base: "#2a3038",
  accent: "#ca786d",
  accentHover: "#b86a60",
  foreground: "#f1f5f9",
  muted: "#94a3b8",
};

export default function Home() {
  return (
    <div
      className="fixed inset-0 flex h-screen w-screen flex-col overflow-hidden text-foreground"
      // style={{
      //   backgroundImage: `linear-gradient(to bottom, rgba(42, 48, 56, 0.65), rgba(42, 48, 56, 0.85)), url(${bgImage})`,
      //   backdropFilter: "blur(80px)",
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      // }}
    >
      {/* Header banner - liquid glass */}
      <header className="liquid-glass flex shrink-0 items-center justify-between px-6 py-4 md:px-8">
        <Link
          href="/"
          className="font-title flex items-center gap-2 font-semibold tracking-tight"
          style={{ color: theme.foreground }}
        >
          <Image
            src="/images/or-logo.png"
            alt="Open Roger"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <span>Open Roger</span>
        </Link>
        <Link
          href="/dashboard"
          className="font-button glass flex items-center gap-2 rounded-lg border-white/20 px-4 py-2 text-sm font-medium transition-all hover:bg-white/15"
          style={{ color: theme.foreground }}
        >
          <LogIn className="h-4 w-4" />
          Sign in
        </Link>
      </header>

      {/* Hero - liquid glass card */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center md:px-12">
        <div className="liquid-glass-card mx-auto max-w-4xl rounded-3xl p-8 md:p-12">
          <div className="mb-4 flex justify-center">
            <span
              className="liquid-glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm"
              style={{ color: theme.muted }}
            >
              <Sparkles className="h-4 w-4" style={{ color: theme.accent }} />
              Multi-agent factory · Human approval at every phase
            </span>
          </div>
          <h1
            className="font-title text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl"
            style={{ color: theme.foreground }}
          >
            Intent{" "}
            <span className="italic" style={{ color: theme.accent }}>
              to code
            </span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-xl text-base md:text-lg"
            style={{ color: theme.muted }}
          >
            Describe your app in plain English. Open Roger creates the codebase
            with AI agents—every step visible and approved by you.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="font-button liquid-glass inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium uppercase tracking-wide text-white transition-all hover:opacity-90"
              style={{ backgroundColor: theme.accent }}
            >
              <UserPlus className="h-5 w-5" />
              Get started
            </Link>
            {/* <Link
              href="/sign-in"
              className="font-button glass inline-flex items-center gap-2 rounded-xl border-white/20 px-5 py-3 font-medium transition-all hover:bg-white/15"
              style={{ color: theme.foreground }}
            >
              <ArrowRight className="h-4 w-4" />
              Sign in
            </Link> */}
          </div>
        </div>
      </main>

      {/* Footer strip - glass */}
      <footer className="glass shrink-0 px-6 py-3 md:px-8">
        <p className="text-center text-xs" style={{ color: theme.muted }}>
          Open Roger
        </p>
      </footer>
    </div>
  );
}
