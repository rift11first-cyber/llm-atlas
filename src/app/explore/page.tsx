import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  GitPullRequest,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { ModelCard } from "@/components/model-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { families, modelTypes, models } from "@/lib/models";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 24;

type SearchParams = Promise<{
  q?: string;
  family?: string;
  type?: string;
  badge?: string;
  page?: string;
  sort?: string;
}>;

const quickFilters = [
  { value: "", label: "All" },
  { value: "quantized", label: "Quantized" },
  { value: "multimodal", label: "Multimodal" },
  { value: "moe", label: "MoE" },
  { value: "partial", label: "Partial" },
];

const sortOptions = [
  { value: "downloads", label: "Most downloaded" },
  { value: "likes", label: "Most liked" },
  { value: "params", label: "Largest models" },
  { value: "layers", label: "Most layers" },
  { value: "name", label: "Name A–Z" },
];

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const family = params.family ?? "";
  const type = params.type ?? "";
  const badge = params.badge ?? "";
  const sort = sortOptions.some((option) => option.value === params.sort)
    ? (params.sort as string)
    : "downloads";
  const page = Math.max(1, Number(params.page) || 1);

  let filtered = models;

  if (q) {
    const needle = q.toLowerCase();
    filtered = filtered.filter(
      (model) =>
        model.id.toLowerCase().includes(needle) ||
        model.name.toLowerCase().includes(needle) ||
        (model.author ?? "").toLowerCase().includes(needle) ||
        (model.family ?? "").toLowerCase().includes(needle)
    );
  }
  if (family) {
    filtered = filtered.filter((model) => model.family === family);
  }
  if (type) {
    filtered = filtered.filter((model) => model.modelType === type);
  }
  if (badge === "quantized") {
    filtered = filtered.filter((model) => model.quantized);
  } else if (badge === "multimodal") {
    filtered = filtered.filter((model) => model.multimodal);
  } else if (badge === "moe") {
    filtered = filtered.filter((model) =>
      String(model.architecture.moe ?? "")
        .toLowerCase()
        .includes("yes")
    );
  } else if (badge === "partial") {
    filtered = filtered.filter(
      (model) => model.architectureStatus === "Partial"
    );
  }

  const sorted = [...filtered];

  if (sort === "likes") {
    sorted.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
  } else if (sort === "params") {
    sorted.sort((a, b) => {
      const aParams =
        typeof a.architecture.totalParameters === "number"
          ? a.architecture.totalParameters
          : 0;
      const bParams =
        typeof b.architecture.totalParameters === "number"
          ? b.architecture.totalParameters
          : 0;
      return bParams - aParams;
    });
  } else if (sort === "layers") {
    sorted.sort((a, b) => {
      const aLayers =
        typeof a.architecture.numLayers === "number"
          ? a.architecture.numLayers
          : 0;
      const bLayers =
        typeof b.architecture.numLayers === "number"
          ? b.architecture.numLayers
          : 0;
      return bLayers - aLayers;
    });
  } else if (sort === "name") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const firstResult =
    sorted.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const lastResult = Math.min(currentPage * PAGE_SIZE, sorted.length);

  const base = new URLSearchParams();
  if (q) base.set("q", q);
  if (family) base.set("family", family);
  if (type) base.set("type", type);
  if (badge) base.set("badge", badge);
  if (sort !== "downloads") base.set("sort", sort);

  const pageHref = (nextPage: number) => {
    const sp = new URLSearchParams(base);
    if (nextPage > 1) sp.set("page", String(nextPage));
    const query = sp.toString();
    return query ? `/explore?${query}` : "/explore";
  };

  const chipHref = (value: string) => {
    const sp = new URLSearchParams(base);
    if (!value || badge === value) {
      sp.delete("badge");
    } else {
      sp.set("badge", value);
    }
    const query = sp.toString();
    return query ? `/explore?${query}` : "/explore";
  };

  const hasFilters = Boolean(q || family || type || badge);

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Explore / Architecture index
        </p>
        <h1 className="mt-6 text-4xl font-medium leading-[1] tracking-[-0.05em] sm:text-6xl">
          Every model is a set
          <br />
          of decisions.
        </h1>
      </div>
      <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
        Search {models.length.toLocaleString()} models with extracted
        architecture data. Filter by family, model type, quantization, and
        completeness.
      </p>

      <form
        action="/explore"
        method="get"
        className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.9fr_0.9fr_auto]"
      >
        <div className="relative bg-background">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={q}
            placeholder="Search model, author, or family"
            aria-label="Search models"
            className="h-12 rounded-none border-0 bg-transparent pl-11 focus-visible:border-transparent focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-foreground/30"
          />
        </div>

        <div className="relative bg-background">
          <select
            name="family"
            defaultValue={family}
            aria-label="Filter by family"
            className="h-12 w-full appearance-none bg-transparent px-4 pr-10 text-sm text-foreground focus-visible:bg-white/[0.02] focus-visible:outline-none"
          >
            <option value="">All families</option>
            {families.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        </div>

        <div className="relative bg-background">
          <select
            name="type"
            defaultValue={type}
            aria-label="Filter by model type"
            className="h-12 w-full appearance-none bg-transparent px-4 pr-10 text-sm text-foreground focus-visible:bg-white/[0.02] focus-visible:outline-none"
          >
            <option value="">All model types</option>
            {modelTypes.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        </div>

        <div className="relative bg-background">
          <select
            name="sort"
            defaultValue={sort}
            aria-label="Sort models"
            className="h-12 w-full appearance-none bg-transparent px-4 pr-10 text-sm text-foreground focus-visible:bg-white/[0.02] focus-visible:outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        </div>

        <Button type="submit" className="h-12 w-full rounded-none px-6">
          <SlidersHorizontal />
          Filter
        </Button>

        {badge ? <input type="hidden" name="badge" value={badge} /> : null}
      </form>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Quick filters
        </span>
        {quickFilters.map((filter) => {
          const active = badge === filter.value;
          return (
            <Link
              key={filter.value || "all"}
              href={chipHref(filter.value)}
              className={cn(
                "inline-flex items-center rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
              )}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Results
          </p>
          <p className="mt-1 text-2xl font-medium tracking-[-0.03em]">
            {sorted.length.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            Showing {firstResult}-{lastResult}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            Page {String(currentPage).padStart(3, "0")} /{" "}
            {String(totalPages).padStart(3, "0")}
          </p>
          {hasFilters ? (
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear all
              <X className="size-3" />
            </Link>
          ) : null}
        </div>
      </div>

      {pageItems.length ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pageItems.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-border px-6 py-20 text-center">
          <Search className="size-5 text-muted-foreground" />
          <p className="mt-5 text-sm font-medium">No models match these filters.</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Try a broader search or reset the filters to browse the full index.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/explore">Clear filters</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={site.contributeUrl} target="_blank" rel="noreferrer">
                Contribute a model
                <GitPullRequest />
              </a>
            </Button>
          </div>
        </div>
      )}

      {totalPages > 1 ? (
        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          {currentPage > 1 ? (
            <Button asChild variant="ghost" size="sm" className="px-0">
              <Link href={pageHref(currentPage - 1)}>
                <ArrowLeft />
                Previous
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="px-0" disabled>
              <ArrowLeft />
              Previous
            </Button>
          )}
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {String(currentPage).padStart(3, "0")} /{" "}
            {String(totalPages).padStart(3, "0")}
          </span>
          {currentPage < totalPages ? (
            <Button asChild variant="ghost" size="sm" className="px-0">
              <Link href={pageHref(currentPage + 1)}>
                Next
                <ArrowRight />
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="px-0" disabled>
              Next
              <ArrowRight />
            </Button>
          )}
        </div>
      ) : null}

      <section className="mt-16 border-t border-border pt-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Missing a model?
            </p>
            <h2 className="mt-3 text-2xl font-medium tracking-[-0.03em]">
              Help expand the atlas.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              If a model belongs in the index but is not here, open an issue
              with its Hugging Face repo ID. Contributions are welcome.
            </p>
          </div>
          <Button asChild variant="outline">
            <a href={site.contributeUrl} target="_blank" rel="noreferrer">
              Contribute on GitHub
              <GitPullRequest />
            </a>
          </Button>
        </div>
      </section>
    </main>
  );
}
