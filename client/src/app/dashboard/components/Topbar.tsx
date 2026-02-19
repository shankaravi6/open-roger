"use client";

import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

const hasClerkKey = Boolean(
  typeof process !== "undefined" && process.env.NEXT_CLERK_PUBLISHABLE_KEY,
);

function TopbarDemo() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-white/10 bg-surface px-4 md:px-6">
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
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-teal">
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

function TopbarWithClerk() {
  const { user } = useUser();
  const displayName =
    user?.firstName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    "User";

  return (
    <header className="flex h-14 items-center justify-between border-b border-white/10 bg-surface px-4 md:px-6">
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
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-teal">
          Hi, <span className="font-medium text-pink">{displayName}</span>
        </span>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-9 w-9",
            },
          }}
        />
      </div>
    </header>
  );
}

export function Topbar() {
  if (!hasClerkKey) return <TopbarDemo />;
  return <TopbarWithClerk />;
}
