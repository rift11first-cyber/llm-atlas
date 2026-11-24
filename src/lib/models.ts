import raw from "@/data/models-index.json";
import type { Dataset, Model } from "@/lib/types";

const dataset = raw as unknown as Dataset;

export const coverage = dataset.coverage;
export const datasetDate = dataset.datasetDate;

export const models: Model[] = dataset.models;

const modelById = new Map(models.map((model) => [model.id, model]));

export function getModel(id: string) {
  return modelById.get(id);
}

export const familyCounts = Object.entries(
  models.reduce<Record<string, number>>((acc, model) => {
    const family = model.family ?? "Other/Unknown";
    acc[family] = (acc[family] ?? 0) + 1;
    return acc;
  }, {})
)
  .map(([name, count]) => ({ name, count }))
  .sort((a, b) => b.count - a.count);

export const modelTypes = Array.from(
  new Set(models.map((model) => model.modelType).filter(Boolean))
).sort() as string[];

export const families = familyCounts.map((family) => family.name);
