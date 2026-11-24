import json
import re
from datetime import date, datetime
from pathlib import Path

from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parents[1]
WORKBOOK = ROOT.parent / "HuggingFace_LLM_Architecture_Database.xlsx"
INDEX_OUT = ROOT / "src" / "data" / "models-index.json"
DETAILS_OUT = ROOT / "src" / "data" / "models-details.json"

INDEX_ARCH_KEYS = ["totalParameters", "contextWindow", "numLayers", "moe"]
DETAIL_ARCH_KEYS = [
    "hiddenSize",
    "numLayers",
    "numAttentionHeads",
    "numKvHeads",
    "headDim",
    "intermediateSize",
    "vocabSize",
    "embeddingDimensions",
    "totalParameters",
    "activeParameters",
    "contextWindow",
    "maxPositionEmbeddings",
    "positionalEmbedding",
    "ropeTheta",
    "ropeScaling",
    "attentionMechanism",
    "normalization",
    "activationFunction",
    "mlpStructure",
    "biasConfiguration",
    "tiedEmbeddings",
    "lmHead",
    "moe",
    "numberOfExperts",
    "expertsPerToken",
    "sharedExperts",
    "routingMechanism",
    "activeParametersBasis",
]


def camel(value: str) -> str:
    parts = re.split(r"[^A-Za-z0-9]+", str(value))
    first = parts[0].lower()
    rest = [p.capitalize() for p in parts[1:] if p]
    return first + "".join(rest)


def clean(value):
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.isoformat(sep=" ", timespec="seconds")
    if isinstance(value, date):
        return value.isoformat()
    if isinstance(value, float) and value.is_integer():
        return int(value)
    if isinstance(value, str):
        value = value.strip()
        return value or None
    return value


def number(value):
    if value is None or value == "":
        return None
    try:
        f = float(value)
        return int(f) if f.is_integer() else f
    except (TypeError, ValueError):
        return None


def sheet_rows(wb, name):
    ws = wb[name]
    it = ws.iter_rows(values_only=True)
    headers = [camel(h) for h in next(it)]
    for values in it:
        yield dict(zip(headers, values))


def main():
    wb = load_workbook(WORKBOOK, read_only=True, data_only=True)

    architecture = {}
    for row in sheet_rows(wb, "Architecture"):
        model_id = clean(row.get("repositoryId"))
        if model_id:
            architecture[model_id] = {
                k: clean(v) for k, v in row.items() if k != "repositoryId"
            }
    print(f"Architecture rows loaded: {len(architecture)}")

    models = []
    details = {}
    coverage = {
        "totalRepositories": 0,
        "llmScope": 0,
        "withArchitecture": 0,
        "withoutArchitecture": 0,
        "complete": 0,
        "partial": 0,
        "noConfigListed": 0,
        "configUnavailable": 0,
    }

    for row in sheet_rows(wb, "All_Repositories"):
        coverage["totalRepositories"] += 1
        if row.get("inLlmScope") != "Yes":
            continue
        coverage["llmScope"] += 1
        model_id = clean(row.get("repositoryId"))
        status = clean(row.get("architectureData"))
        if status == "Complete":
            coverage["complete"] += 1
        elif status == "Partial":
            coverage["partial"] += 1
        elif status == "No config.json listed":
            coverage["noConfigListed"] += 1
        else:
            coverage["configUnavailable"] += 1

        if status not in ("Complete", "Partial") or not model_id:
            coverage["withoutArchitecture"] += 1
            continue

        arch = architecture.get(model_id)
        if not arch:
            coverage["withoutArchitecture"] += 1
            continue

        coverage["withArchitecture"] += 1
        summary_arch = {
            k: arch[k]
            for k in INDEX_ARCH_KEYS
            if k in arch and arch[k] not in (None, "")
        }
        detail_arch = {
            k: arch[k]
            for k in DETAIL_ARCH_KEYS
            if k in arch and arch[k] not in (None, "")
        }
        details[model_id] = detail_arch
        models.append(
            {
                "id": model_id,
                "name": clean(row.get("modelName")) or model_id.split("/")[-1],
                "author": clean(row.get("authorOrganization")),
                "url": clean(row.get("huggingFaceUrl")) or f"https://huggingface.co/{model_id}",
                "downloads": number(row.get("downloads30d")),
                "likes": number(row.get("likes")),
                "family": clean(row.get("modelFamily")),
                "familyBasis": clean(row.get("familyBasis")),
                "modelType": clean(row.get("modelType")),
                "modelClass": clean(row.get("baseInstructChatReasoning")),
                "quantized": row.get("quantized") == "Yes",
                "multimodal": row.get("multimodalTextOnly") == "Multimodal",
                "architectureStatus": status,
                "architecture": summary_arch,
            }
        )

    wb.close()

    models.sort(key=lambda model: model.get("downloads") or 0, reverse=True)

    payload = {
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
        "datasetDate": "2026-11-23",
        "coverage": coverage,
        "models": models,
    }
    INDEX_OUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    DETAILS_OUT.write_text(json.dumps(details, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(json.dumps(coverage, indent=2))
    print(f"Wrote {len(models)} models to {INDEX_OUT}")
    print(f"Index size: {INDEX_OUT.stat().st_size / 1024 / 1024:.2f} MB")
    print(f"Details size: {DETAILS_OUT.stat().st_size / 1024 / 1024:.2f} MB")


if __name__ == "__main__":
    main()
