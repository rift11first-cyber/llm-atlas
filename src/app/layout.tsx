import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Strata",
    template: "%s · Strata",
  },
  description:
    "Learn how language models are built by exploring real architectures from Hugging Face.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <footer className="px-5 pb-8 pt-12 sm:px-8">
          <p className="text-center font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Built by Nicky <span className="text-foreground">♥</span>
          </p>
        </footer>
      </body>
    </html>
  );
}
