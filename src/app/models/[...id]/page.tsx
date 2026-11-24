import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  Layers,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatCompact,
  formatNumber,
  formatParams,
  formatValue,
} from "@/lib/format";
import { getArchitecture } from "@/lib/details";
import { getModel } from "@/lib/models";
import { site } from "@/lib/site";

export const revalidate = 3600;

type Params = Promise<{ id: string[] }>;

const sections = [
  { id: "core", index: "01", label: "Core dimensions" },
  { id: "context", index: "02", label: "Context and positions" },
  { id: "attention", index: "03", label: "Attention and MLP" },
  { id: "moe", index: "04", label: "Mixture of experts" },
];

const coreFields: [string, string][] = [
  ["hiddenSize", "Hidden size"],
  ["numLayers", "Layers"],
  ["numAttentionHeads", "Attention heads"],
  ["numKvHeads", "KV heads"],
  ["headDim", "Head dimension"],
  ["intermediateSize", "Intermediate size"],
  ["vocabSize", "Vocabulary size"],
  ["embeddingDimensions", "Embedding dimensions"],
];

const positionFields: [string, string][] = [
  ["contextWindow", "Context window"],
  ["maxPositionEmbeddings", "Max position embeddings"],
  ["positionalEmbedding", "Positional embedding"],
  ["ropeTheta", "RoPE theta"],
  ["ropeScaling", "RoPE scaling"],
];

const attentionFields: [string, string][] = [
  ["attentionMechanism", "Attention mechanism"],
  ["normalization", "Normalization"],
  ["activationFunction", "Activation function"],
  ["mlpStructure", "MLP structure"],
  ["biasConfiguration", "Bias configuration"],
  ["tiedEmbeddings", "Tied embeddings"],
  ["lmHead", "LM head"],
];

const moeFields: [string, string][] = [
  ["moe", "Mixture of experts"],
  ["numberOfExperts", "Number of experts"],
  ["expertsPerToken", "Experts per token"],
  ["sharedExperts", "Shared experts"],
  ["routingMechanism", "Routing mechanism"],
  ["activeParametersBasis", "Active parameter basis"],
];

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="border-t border-border py-4">
      <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-2 break-words text-sm leading-6">{value}</dd>
    </div>
  );
}

function FieldGrid({
  fields,
  architecture,
}: {
  fields: [string, string][];
  architecture: Record<string, unknown>;
}) {
  return (
    <dl className="grid gap-x-10 sm:grid-cols-2 xl:grid-cols-3">
      {fields.map(([key, label]) => (
        <Field key={key} label={label} value={formatValue(architecture[key])} />
      ))}
    </dl>
  );
}

function KeyStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background px-4 py-5 sm:px-5">
      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 truncate text-lg font-medium tracking-[-0.02em]">
        {value}
      </p>
    </div>
  );
}

function Section({
  id,
  index,
  title,
  description,
  children,
}: {
  id: string;
  index: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border pt-8">
      <div className="flex gap-4 sm:gap-6">
        <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {index}
        </span>
        <div className="max-w-2xl">
          <h2 className="text-xl font-medium tracking-[-0.025em] sm:text-2xl">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-7">{children}</div>
    </section>
  );
}

export default async function ModelPage({ params }: { params: Params }) {
  const resolved = await params;
  const modelId = resolved.id
    .map((part) => {
      try {
        return decodeURIComponent(part);
      } catch {
        return part;
      }
    })
    .join("/");
  const model = getModel(modelId);

  if (!model) notFound();

  const architecture = getArchitecture(model.id);

  if (!architecture) notFound();
  const totalParameters =
    typeof architecture.totalParameters === "number"
      ? architecture.totalParameters
      : null;
  const activeParameters =
    typeof architecture.activeParameters === "number"
      ? architecture.activeParameters
      : null;
  const contextWindow =
    typeof architecture.contextWindow === "number"
      ? architecture.contextWindow
      : null;
  const layers =
    typeof architecture.numLayers === "number" ? architecture.numLayers : null;
  const hiddenSize =
    typeof architecture.hiddenSize === "number"
      ? architecture.hiddenSize
      : null;
  const attentionHeads =
    typeof architecture.numAttentionHeads === "number"
      ? architecture.numAttentionHeads
      : null;
  const vocabSize =
    typeof architecture.vocabSize === "number"
      ? architecture.vocabSize
      : null;

  return (
    <main className="mx-auto w-full max-w-7xl px-5 pb-24 pt-8 sm:px-8">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          All models
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Architecture record
        </span>
      </div>

      <header className="grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <div className="flex flex-wrap gap-1.5">
            {model.family ? (
              <Badge variant="outline">{model.family}</Badge>
            ) : null}
            <Badge variant="muted">{model.modelClass ?? "Unclassified"}</Badge>
            {model.architectureStatus === "Partial" ? (
              <Badge variant="muted">Partial architecture</Badge>
            ) : (
              <Badge variant="outline">Complete architecture</Badge>
            )}
            {model.quantized ? <Badge variant="muted">Quantized</Badge> : null}
            {model.multimodal ? (
              <Badge variant="muted">Multimodal</Badge>
            ) : null}
          </div>

          <h1 className="mt-6 max-w-4xl break-words text-4xl font-medium leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            {model.name}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span>{model.author ?? "Unknown author"}</span>
            <span className="text-border">/</span>
            <span className="font-mono text-xs">{model.id}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {model.modelType ?? "Unknown model type"}
            {model.familyBasis ? ` · ${model.familyBasis}` : ""}
          </p>
        </div>

        <Button asChild variant="outline" size="lg">
          <a href={model.url} target="_blank" rel="noreferrer">
            View on Hugging Face
            <ArrowUpRight />
          </a>
        </Button>
      </header>

      <section
        aria-label="Key architecture statistics"
        className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4"
      >
        <KeyStat label="Parameters" value={formatParams(totalParameters)} />
        <KeyStat
          label="Active parameters"
          value={
            activeParameters !== null && activeParameters !== totalParameters
              ? formatParams(activeParameters)
              : "Dense"
          }
        />
        <KeyStat
          label="Context window"
          value={
            contextWindow !== null
              ? `${formatCompact(contextWindow)} tokens`
              : "—"
          }
        />
        <KeyStat
          label="Layers"
          value={layers !== null ? formatNumber(layers) : "—"}
        />
        <KeyStat
          label="Hidden size"
          value={hiddenSize !== null ? formatNumber(hiddenSize) : "—"}
        />
        <KeyStat
          label="Attention heads"
          value={attentionHeads !== null ? formatNumber(attentionHeads) : "—"}
        />
        <KeyStat
          label="Vocabulary"
          value={vocabSize !== null ? formatNumber(vocabSize) : "—"}
        />
        <KeyStat label="Downloads" value={formatCompact(model.downloads)} />
      </section>

      <div className="mt-8 flex flex-wrap gap-2 lg:hidden">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            {section.label}
          </a>
        ))}
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[180px_minmax(0,1fr)] xl:grid-cols-[210px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              On this page
            </p>
            <nav className="mt-4 flex flex-col">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="group flex items-center justify-between gap-3 border-t border-border py-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="flex items-baseline gap-3">
                    <span className="font-mono text-[9px] tracking-[0.14em]">
                      {section.index}
                    </span>
                    {section.label}
                  </span>
                  <ChevronRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              ))}
            </nav>
            <div className="mt-8 border-t border-border pt-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                Record
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm">
                <Layers className="size-3.5 text-muted-foreground" />
                {model.architectureStatus}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                Dataset {site.datasetDate}
              </p>
            </div>
          </div>
        </aside>

        <div className="space-y-12">
          <Section
            id="core"
            index="01"
            title="Core dimensions"
            description="The shape of the model: width, depth, attention layout, and vocabulary."
          >
            <FieldGrid fields={coreFields} architecture={architecture} />
            <dl className="mt-2 grid gap-x-10 sm:grid-cols-2">
              <Field
                label="Total parameters"
                value={
                  totalParameters !== null
                    ? `${formatNumber(totalParameters)} (${formatParams(totalParameters)})`
                    : "—"
                }
              />
              <Field
                label="Active parameters"
                value={
                  activeParameters !== null
                    ? `${formatNumber(activeParameters)} (${formatParams(activeParameters)})`
                    : "—"
                }
              />
            </dl>
          </Section>

          <Section
            id="context"
            index="02"
            title="Context and positions"
            description="How the model represents sequence order and how far it can attend."
          >
            <FieldGrid fields={positionFields} architecture={architecture} />
          </Section>

          <Section
            id="attention"
            index="03"
            title="Attention and MLP"
            description="Attention variant, normalization, activation, and feed-forward design."
          >
            <FieldGrid fields={attentionFields} architecture={architecture} />
          </Section>

          <Section
            id="moe"
            index="04"
            title="Mixture of experts"
            description="Sparse routing, expert counts, and active parameter behavior."
          >
            <FieldGrid fields={moeFields} architecture={architecture} />
          </Section>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <p className="text-xs text-muted-foreground">
              Missing fields are shown as an em dash.
            </p>
            <Button asChild variant="ghost" size="sm" className="px-0">
              <Link href="/explore">
                Back to the index
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
