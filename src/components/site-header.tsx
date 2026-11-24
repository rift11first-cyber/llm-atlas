import Link from "next/link";

import { Logo } from "@/components/logo";
import { SiteNav } from "@/components/site-nav";
import { Wordmark } from "@/components/wordmark";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background px-5 pb-4 pt-5 sm:px-8">
      <Link
        href="/"
        aria-label="Strata home"
        className="absolute left-5 top-5 z-10 flex items-center gap-2.5 sm:left-8"
      >
        <Logo className="size-8 shrink-0" />
        <Wordmark className="hidden sm:inline-block" />
      </Link>
      <div className="mx-auto flex w-fit items-center rounded-full border border-border bg-background p-1 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
        <SiteNav />
      </div>
    </header>
  );
}
