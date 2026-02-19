import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Michroma, Inconsolata, Ubuntu } from "next/font/google";
import "./globals.css";

const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

const michroma = Michroma({
  variable: "--font-title",
  weight: "400",
  subsets: ["latin"],
});

const inconsolata = Inconsolata({
  variable: "--font-body",
  subsets: ["latin"],
});

const ubuntu = Ubuntu({
  variable: "--font-button",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Open Roger – Multi-agent software factory",
  description:
    "Turn intent into real, evolving code. Create and evolve applications with AI agents under mandatory approval at every phase.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en">
      <body
        className={`${michroma.variable} ${inconsolata.variable} ${ubuntu.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );

  return hasClerkKey ? <ClerkProvider>{content}</ClerkProvider> : content;
}
