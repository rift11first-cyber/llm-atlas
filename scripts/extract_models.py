import json
import re
from datetime import date, datetime
from pathlib import Path

from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parents[1]
WORKBOOK = ROOT.parent / "HuggingFace_LLM_Architecture_Database.xlsx"
OUT = ROOT / "src" / "data" / "models.json"
LIMIT = 1000


def camel(value: str) -> str:
    parts = re.split(r"[^A-Za-z0-9]+", str(value))
    first = parts[0].lower()
    rest = [p[:1].upper() + p[1:] for p in parts[1:] if p]
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
        if not value:
            return None
    return value


def number(value):
    if value is None or value == "":
        return None
    try:
        f = float(value)
        return int(f) if f.is_integer() else f
    except (TypeError, ValueError):
        return None


def split_list(value):
    if not value:
        return []
    return [x.strip() for x in str(value).split(";") if x.strip()]


def rows(path: Path):
    wb = load_workbook(path, read_only=True, data_only=True)
    ws = wb[path.name]
    it = ws.iter_rows(values_only=True)
    headers = [camel(h) for h in next(it)]
    for values in it:
        yield dict(zip(headers, values))
    wb.close()


def sheet_rows(wb, name):
    ws = wb[name]
    it = ws.iter_rows(values_only=True)
    headers = [camel(h) for h in next(it)]
    for values in it:
        yield dict(zip(headers, values))


def main():
    wb = load_workbook(WORKBOOK, read_only=True, data_only=True)

    models = []
    ids = set()
    for row in sheet_rows(wb, "All_Repositories"):
        if row.get("inLlmScope") != "Yes":
            continue
        model_id = clean(row.get("repositoryId"))
        if not model_id or model_id in ids:
            continue
        ids.add(model_id)
        models.append(
            {
                "id": model_id,
                "name": clean(row.get("modelName")) or model_id.split("/")[-1],
                "author": clean(row.get("authorOrganization")),
                "url": clean(row.get("huggingFaceUrl")) or f"https://huggingface.co/{model_id}",
                "created": clean(row.get("creationDate")),
                "modified": clean(row.get("lastUpdatedDate")),
                "downloads": number(row.get("downloads30d")),
                "likes": number(row.get("likes")),
                "trending": number(row.get("trendingScore")),
                "pipeline": clean(row.get("pipelineTag")),
                "library": clean(row.get("libraryName")),
                "tags": split_list(row.get("modelTags")),
                "gated": clean(row.get("gatedStatus")),
                "private": clean(row.get("privateStatus")),
                "family": clean(row.get("modelFamily")),
                "familyBasis": clean(row.get("familyBasis")),
                "modelType": clean(row.get("modelType")),
                "baseModels": split_list(row.get("baseModels")),
                "relationship": clean(row.get("checkpointRelationship")),
                "modelClass": clean(row.get("baseInstructChatReasoning")),
                "fineTuning": clean(row.get("fineTuningMethod")),
                "adapter": row.get("loraPeftAdapter") == "Yes",
                "quantized": row.get("quantized") == "Yes",
                "distilled": row.get("distilled") == "Yes",
                "multimodal": row.get("multimodalTextOnly") == "Multimodal",
                "modality": clean(row.get("multimodalTextOnly")),
                "languages": clean(row.get("languageSupport")),
                "derivative": clean(row.get("derivativeDuplicateStatus")),
                "inLlmScope": True,
                "completeness": clean(row.get("dataCompleteness")),
                "architectureData": clean(row.get("architectureData")),
                "tokenizerData": clean(row.get("tokenizerData")),
                "cardData": clean(row.get("modelCardData")),
                "weightsData": clean(row.get("weightsData")),
                "notes": clean(row.get("notes")),
                "architecture": None,
                "tokenizer": None,
                "weights": None,
                "modelCard": None,
                "license": None,
                "sources": None,
                "files": None,
                "errors": None,
            }
        )
        if len(models) >= LIMIT:
            break

    detail_sheets = {
        "Architecture": "architecture",
        "Tokenizer": "tokenizer",
        "Weights": "weights",
        "Model_Cards": "modelCard",
        "Licenses": "license",
        "Sources": "sources",
        "Repository_Files": "files",
        "Errors_Missing": "errors",
    }

    by_id = {m["id"]: m for m in models}
    for sheet, key in detail_sheets.items():
        found = 0
        for row in sheet_rows(wb, sheet):
            model_id = clean(row.get("repositoryId"))
            if model_id in by_id:
                by_id[model_id][key] = {k: clean(v) for k, v in row.items() if k != "repositoryId"}
                found += 1
        print(f"{sheet}: matched {found}/{len(models)}")

    families = []
    for row in sheet_rows(wb, "Model_Families"):
        families.append(
            {
                "name": clean(row.get("modelFamily")),
                "count": number(row.get("repositoryCount")),
                "variants": number(row.get("architectureVariants")),
                "types": clean(row.get("commonModelTypes")),
                "params": clean(row.get("parameterRange")),
                "examples": split_list(row.get("exampleRepositories")),
                "notes": clean(row.get("notes")),
            }
        )

    meta = {}
    for row in sheet_rows(wb, "Summary"):
        metric = clean(row.get("metric"))
        if not metric:
            continue
        value = clean(row.get("value"))
        meta[camel(metric)] = {"value": value, "notes": clean(row.get("notes"))}

    wb.close()

    payload = {
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
        "datasetDate": "2026-11-23",
        "limit": LIMIT,
        "meta": meta,
        "families": families,
        "models": models,
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {len(models)} models to {OUT}")
    print(f"Size: {OUT.stat().st_size / 1024 / 1024:.2f} MB")


if __name__ == "__main__":
    main()
