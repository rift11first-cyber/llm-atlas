import Link from "next/link";

import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 border-b border-border py-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Open architecture index
            </p>
            <p className="mt-3 max-w-md text-2xl font-medium leading-snug tracking-tight">
              A field guide to how language models are built.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-[0.14em]">
            <Link
              href="/explore"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Explore models
            </Link>
            <a
              href="https://huggingface.co"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Hugging Face ↗
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-2 py-6 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            {site.modelCount.toLocaleString()} models with architecture
          </p>
          <p className="font-mono uppercase tracking-[0.1em]">
            Dataset {site.datasetDate}
          </p>
        </div>
      </div>
    </footer>
  );
}
