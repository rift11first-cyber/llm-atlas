import Link from "next/link";
import { ArrowLeft, GitPullRequest } from "lucide-react";

import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col items-start px-5 py-24 sm:px-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        404 / Not found
      </p>
      <h1 className="mt-6 text-4xl font-medium tracking-[-0.05em] sm:text-6xl">
        This model is not
        <br />
        in the atlas.
      </h1>
      <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground">
        It may be one of the LLM-scope repositories without a usable
        architecture config, or the link may be incorrect.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link href="/explore">
            <ArrowLeft />
            Back to explore
          </Link>
        </Button>
        <Button asChild variant="outline">
          <a href={site.contributeUrl} target="_blank" rel="noreferrer">
            Contribute this model
            <GitPullRequest />
          </a>
        </Button>
      </div>
    </main>
  );
}
