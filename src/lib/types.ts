export type ArchitectureValue = string | number | null;

export type Architecture = Record<string, ArchitectureValue>;

export type Model = {
  id: string;
  name: string;
  author: string | null;
  url: string;
  downloads: number | null;
  likes: number | null;
  family: string | null;
  familyBasis: string | null;
  modelType: string | null;
  modelClass: string | null;
  quantized: boolean;
  multimodal: boolean;
  architectureStatus: "Complete" | "Partial" | string;
  architecture: Architecture;
};

export type Coverage = {
  totalRepositories: number;
  llmScope: number;
  withArchitecture: number;
  withoutArchitecture: number;
  complete: number;
  partial: number;
  noConfigListed: number;
  configUnavailable: number;
};

export type Dataset = {
  generatedAt: string;
  datasetDate: string;
  coverage: Coverage;
  models: Model[];
};
