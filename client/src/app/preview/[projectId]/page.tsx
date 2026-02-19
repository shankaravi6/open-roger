/**
 * Standalone live preview – no dashboard layout.
 * ?v=dark → dark theme app. ?v=glassmorphism → glassmorphism UI. Default → light.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "App preview – SyncNet",
  robots: "noindex",
};

type Variant = "default" | "dark" | "glassmorphism";

function DefaultPreview() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-indigo-600">Gym CRM</h1>
          <nav className="flex gap-4 text-sm">
            <span className="text-slate-500">Dashboard</span>
            <span className="font-medium text-indigo-600">Members</span>
            <span className="text-slate-500">Plans</span>
            <span className="text-slate-500">Settings</span>
          </nav>
        </div>
      </header>
      <div className="flex">
        <aside className="w-52 border-r border-slate-200 bg-white p-4 text-sm">
          <p className="mb-2 font-medium text-slate-700">Menu</p>
          <ul className="space-y-1 text-slate-600">
            <li className="rounded bg-indigo-50 px-2 py-1.5 text-indigo-700">
              Dashboard
            </li>
            <li className="rounded px-2 py-1.5 hover:bg-slate-100">Members</li>
            <li className="rounded px-2 py-1.5 hover:bg-slate-100">
              Subscriptions
            </li>
            <li className="rounded px-2 py-1.5 hover:bg-slate-100">Plans</li>
          </ul>
        </aside>
        <main className="flex-1 p-6">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">
            Members
          </h2>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">
                    Plan
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">Jane Doe</td>
                  <td className="px-4 py-3 text-slate-600">jane@example.com</td>
                  <td className="px-4 py-3">Premium</td>
                  <td className="px-4 py-3 text-slate-500">Feb 1, 2025</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">John Smith</td>
                  <td className="px-4 py-3 text-slate-600">john@example.com</td>
                  <td className="px-4 py-3">Basic</td>
                  <td className="px-4 py-3 text-slate-500">Jan 15, 2025</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">Alex Rivera</td>
                  <td className="px-4 py-3 text-slate-600">alex@example.com</td>
                  <td className="px-4 py-3">Premium</td>
                  <td className="px-4 py-3 text-slate-500">Jan 28, 2025</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Live preview (demo) · Built by SyncNet
          </p>
        </main>
      </div>
    </div>
  );
}

function DarkPreview() {
  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100">
      <header className="border-b border-slate-700 bg-slate-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-indigo-400">Gym CRM</h1>
          <nav className="flex gap-4 text-sm">
            <span className="text-slate-400">Dashboard</span>
            <span className="font-medium text-indigo-400">Members</span>
            <span className="text-slate-400">Plans</span>
            <span className="text-slate-400">Settings</span>
          </nav>
        </div>
      </header>
      <div className="flex">
        <aside className="w-52 border-r border-slate-700 bg-slate-800/80 p-4 text-sm">
          <p className="mb-2 font-medium text-slate-300">Menu</p>
          <ul className="space-y-1 text-slate-400">
            <li className="rounded bg-indigo-500/20 px-2 py-1.5 text-indigo-300">
              Dashboard
            </li>
            <li className="rounded px-2 py-1.5 hover:bg-slate-700">Members</li>
            <li className="rounded px-2 py-1.5 hover:bg-slate-700">
              Subscriptions
            </li>
            <li className="rounded px-2 py-1.5 hover:bg-slate-700">Plans</li>
          </ul>
        </aside>
        <main className="flex-1 p-6">
          <h2 className="mb-4 text-xl font-semibold text-slate-100">Members</h2>
          <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800/80">
            <table className="w-full text-sm">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-400">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-400">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-400">
                    Plan
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-400">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                <tr className="hover:bg-slate-800/60">
                  <td className="px-4 py-3 font-medium">Jane Doe</td>
                  <td className="px-4 py-3 text-slate-400">jane@example.com</td>
                  <td className="px-4 py-3">Premium</td>
                  <td className="px-4 py-3 text-slate-500">Feb 1, 2025</td>
                </tr>
                <tr className="hover:bg-slate-800/60">
                  <td className="px-4 py-3 font-medium">John Smith</td>
                  <td className="px-4 py-3 text-slate-400">john@example.com</td>
                  <td className="px-4 py-3">Basic</td>
                  <td className="px-4 py-3 text-slate-500">Jan 15, 2025</td>
                </tr>
                <tr className="hover:bg-slate-800/60">
                  <td className="px-4 py-3 font-medium">Alex Rivera</td>
                  <td className="px-4 py-3 text-slate-400">alex@example.com</td>
                  <td className="px-4 py-3">Premium</td>
                  <td className="px-4 py-3 text-slate-500">Jan 28, 2025</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Live preview (demo) · Dark theme · Built by SyncNet
          </p>
        </main>
      </div>
    </div>
  );
}

function GlassmorphismPreview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 font-sans text-slate-800">
      <header
        className="border border-white/40 bg-white/60 px-4 py-3 shadow-lg backdrop-blur-xl"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-indigo-600">Gym CRM</h1>
          <nav className="flex gap-4 text-sm">
            <span className="text-slate-500">Dashboard</span>
            <span className="font-medium text-indigo-600">Members</span>
            <span className="text-slate-500">Plans</span>
            <span className="text-slate-500">Settings</span>
          </nav>
        </div>
      </header>
      <div className="flex">
        <aside
          className="w-52 border-r border-white/40 bg-white/50 p-4 text-sm backdrop-blur-xl"
          style={{ boxShadow: "4px 0 24px rgba(0,0,0,0.04)" }}
        >
          <p className="mb-2 font-medium text-slate-700">Menu</p>
          <ul className="space-y-1 text-slate-600">
            <li className="rounded bg-white/70 px-2 py-1.5 text-indigo-700 shadow-sm backdrop-blur">
              Dashboard
            </li>
            <li className="rounded px-2 py-1.5 hover:bg-white/50">Members</li>
            <li className="rounded px-2 py-1.5 hover:bg-white/50">
              Subscriptions
            </li>
            <li className="rounded px-2 py-1.5 hover:bg-white/50">Plans</li>
          </ul>
        </aside>
        <main className="flex-1 p-6">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">Members</h2>
          <div
            className="overflow-hidden rounded-2xl border border-white/60 bg-white/60 shadow-xl backdrop-blur-xl"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
          >
            <table className="w-full text-sm">
              <thead className="bg-white/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">
                    Plan
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                <tr className="hover:bg-white/40">
                  <td className="px-4 py-3 font-medium">Jane Doe</td>
                  <td className="px-4 py-3 text-slate-600">jane@example.com</td>
                  <td className="px-4 py-3">Premium</td>
                  <td className="px-4 py-3 text-slate-500">Feb 1, 2025</td>
                </tr>
                <tr className="hover:bg-white/40">
                  <td className="px-4 py-3 font-medium">John Smith</td>
                  <td className="px-4 py-3 text-slate-600">john@example.com</td>
                  <td className="px-4 py-3">Basic</td>
                  <td className="px-4 py-3 text-slate-500">Jan 15, 2025</td>
                </tr>
                <tr className="hover:bg-white/40">
                  <td className="px-4 py-3 font-medium">Alex Rivera</td>
                  <td className="px-4 py-3 text-slate-600">alex@example.com</td>
                  <td className="px-4 py-3">Premium</td>
                  <td className="px-4 py-3 text-slate-500">Jan 28, 2025</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Live preview (demo) · Glassmorphism UI · Built by SyncNet
          </p>
        </main>
      </div>
    </div>
  );
}

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ v?: string }>;
}) {
  const resolved = await searchParams;
  const v = (resolved.v ?? "default") as Variant;
  const variant: Variant =
    v === "dark" || v === "glassmorphism" ? v : "default";

  if (variant === "dark") return <DarkPreview />;
  if (variant === "glassmorphism") return <GlassmorphismPreview />;
  return <DefaultPreview />;
}
