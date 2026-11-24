import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatCompact, formatParams } from "@/lib/format";
import type { Model } from "@/lib/types";

function LayerTicks({ layers }: { layers: number | null }) {
  const filled = layers
    ? Math.max(1, Math.min(12, Math.round(layers / 4)))
    : 0;

  return (
    <div
      role="img"
      aria-label={layers ? `${layers} layers` : "Layer count unavailable"}
      className="flex items-end gap-[3px]"
    >
      {Array.from({ length: 12 }).map((_, index) => (
        <span
          key={index}
          className={`h-3 w-px ${
            index < filled ? "bg-foreground/70" : "bg-border"
          }`}
        />
      ))}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background p-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1.5 truncate text-sm font-medium">{value}</p>
    </div>
  );
}

export function ModelCard({ model }: { model: Model }) {
  const totalParameters =
    typeof model.architecture.totalParameters === "number"
      ? model.architecture.totalParameters
      : null;
  const contextWindow =
    typeof model.architecture.contextWindow === "number"
      ? model.architecture.contextWindow
      : null;
  const layers =
    typeof model.architecture.numLayers === "number"
      ? model.architecture.numLayers
      : null;

  return (
    <Link
      href={`/models/${model.id
        .split("/")
        .map((part) => encodeURIComponent(part))
        .join("/")}`}
      className="group relative flex h-full flex-col rounded-2xl border border-border p-5 transition-colors duration-200 hover:border-foreground/30 hover:bg-white/[0.015] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {model.family ? <Badge variant="outline">{model.family}</Badge> : null}
          {model.architectureStatus === "Partial" ? (
            <Badge variant="muted">Partial</Badge>
          ) : null}
          {model.quantized ? <Badge variant="muted">Quantized</Badge> : null}
          {model.multimodal ? (
            <Badge variant="muted">Multimodal</Badge>
          ) : null}
        </div>
        <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>

      <div className="mt-8">
        <p className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {model.author ?? "Unknown author"}
        </p>
        <h3 className="mt-2 line-clamp-2 text-[19px] font-medium leading-snug tracking-[-0.01em]">
          {model.name}
        </h3>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
        <Metric label="Parameters" value={formatParams(totalParameters)} />
        <Metric label="Context" value={formatCompact(contextWindow)} />
        <Metric
          label="Layers"
          value={layers !== null ? String(layers) : "—"}
        />
        <Metric label="Downloads" value={formatCompact(model.downloads)} />
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 pt-5">
        <span className="truncate font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {model.modelType ?? "Unclassified"}
        </span>
        <LayerTicks layers={layers} />
      </div>
    </Link>
  );
}
