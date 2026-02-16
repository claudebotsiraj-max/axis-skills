import type { Metadata } from "next";
import { Providers } from "./providers";
import { Nav } from "@/components/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mission Control — OpenClaw",
  description: "AI Agent Mission Control Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <Nav />
          <main className="px-4 pb-8 pt-2 max-w-[1600px] mx-auto">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
