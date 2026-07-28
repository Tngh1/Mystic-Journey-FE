import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Mystic Journey",
  description: "A dark-fantasy pixel MMORPG. Wake in the Elf Forest and answer the call.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Both faces were discovered only after globals.css parsed, which put the
          body font 612ms into the critical chain. Preloading them starts the
          fetch with the document instead. Only these two — the app ships no
          other faces, so there is nothing here to over-preload. */}
      <head>
        <link
          rel="preload"
          href="/fonts/PatrickHand-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/PatrickHandSC-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
