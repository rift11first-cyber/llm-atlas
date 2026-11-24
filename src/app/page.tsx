import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";

import { ModelCard } from "@/components/model-card";
import { ModelVisual } from "@/components/model-visual";
import { Button } from "@/components/ui/button";
import { coverage, familyCounts, models } from "@/lib/models";
import { site } from "@/lib/site";

function Stat({
  index,
  value,
  label,
}: {
  index: string;
  value: string;
  label: string;
}) {
  return (
    <div className="px-5 py-8 sm:px-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {index}
      </p>
      <p className="mt-6 text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
        {value}
      </p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{label}</p>
    </div>
  );
}

export default function Home() {
  const featured = models.slice(0, 6);
  const topFamilies = familyCounts.slice(0, 8);

  return (
    <main>
      <section className="border-b border-border">
        <div className="mx-auto grid w-full max-w-7xl gap-14 px-5 pb-16 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-center lg:gap-12 lg:pb-24">
          <div>
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <span className="size-1.5 bg-foreground" />
              Open model architecture database
            </div>
            <h1 className="mt-7 max-w-4xl text-balance text-5xl font-medium leading-[0.94] tracking-[-0.055em] sm:text-7xl lg:text-[5.2rem]">
              See inside
              <br />
              the model.
            </h1>
            <p className="mt-7 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              A field guide to{" "}
              <span className="text-foreground">
                {coverage.withArchitecture.toLocaleString()}
              </span>{" "}
              open language models. Read the blueprint behind the weights:
              layers, attention, context, parameters, and routing.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/explore">
                  Explore the atlas
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/explore?type=Decoder-only+LLM">
                  Start with decoder-only
                </Link>
              </Button>
            </div>          </div>
          <ModelVisual />
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 divide-x divide-border px-5 sm:px-8 lg:grid-cols-4">
          <Stat
            index="01"
            value={coverage.withArchitecture.toLocaleString()}
            label="Models with architecture"
          />
          <Stat
            index="02"
            value={coverage.complete.toLocaleString()}
            label="Complete architecture records"
          />
          <Stat
            index="03"
            value={coverage.partial.toLocaleString()}
            label="Partial architecture records"
          />
          <Stat
            index="04"
            value={site.familyCount.toString()}
            label="Model families"
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              01 / Popular architectures
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
              Start with the models you know.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              The most-downloaded models with extracted architecture data, from
              compact open weights to frontier-scale systems.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/explore">
              View all models
              <ArrowUpRight />
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {featured.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                02 / Model families
              </p>
              <h2 className="mt-3 text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
                Browse the family tree.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Architecture patterns repeat across model generations. Start with
              a family and compare how it evolves.
            </p>
          </div>
          <div className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
            {topFamilies.map((family, index) => (
              <Link
                key={family.name}
                href={`/explore?family=${encodeURIComponent(family.name)}`}
                className="group flex items-center justify-between gap-4 border-t border-border py-5 transition-colors hover:border-foreground/40"
              >
                <div className="flex min-w-0 items-baseline gap-3">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate text-sm">{family.name}</span>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                    {family.count}
                  </span>
                  <ChevronRight className="size-3.5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
