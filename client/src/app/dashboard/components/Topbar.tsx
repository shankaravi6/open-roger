"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

type TopbarProps = {
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
};

export function Topbar({ sidebarOpen, onSidebarToggle }: TopbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-surface px-4 md:px-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSidebarToggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-teal transition-colors hover:bg-white/10 hover:text-white"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/or-logo.png"
            alt="Open Roger"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <span className="text-lg font-semibold text-white">Open Roger</span>
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-muted-teal sm:inline">
          Hi, <span className="font-medium text-pink">Demo user</span>
        </span>
        <Link
          href="/"
          className="rounded-lg border border-white/20 px-3 py-1.5 text-sm font-medium text-muted-teal transition-colors hover:bg-white/10 hover:text-white"
        >
          Sign out
        </Link>
      </div>
    </header>
  );
}
