import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Mystic Journey",
  description: "A dark-fantasy pixel MMORPG. Wake in the Elf Forest and answer the call.",
};

// Renders the root layout view component.
// Returns the JSX element hierarchy for the page view.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
