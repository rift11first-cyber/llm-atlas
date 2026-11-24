import raw from "@/data/models-details.json";
import type { Architecture } from "@/lib/types";

const details = raw as unknown as Record<string, Architecture>;

export function getArchitecture(id: string) {
  return details[id];
}
