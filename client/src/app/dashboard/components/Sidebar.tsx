"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Factory" },
  { href: "/dashboard/settings", label: "Settings" },
];

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export function Sidebar({ open = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  const nav = (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-pink text-white"
                : "text-muted-teal hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Overlay backdrop (all screen sizes) */}
      <div
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose?.()}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity ${
          open
            ? "visible opacity-100"
            : "invisible opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />
      {/* Sidebar: drawer on all screen sizes (open/close via icon) */}
      <aside
        className={`fixed left-0 top-14 z-50 flex h-[calc(100vh-3.5rem)] w-56 flex-col border-r border-white/10 bg-surface/95 transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {nav}
      </aside>
    </>
  );
}
