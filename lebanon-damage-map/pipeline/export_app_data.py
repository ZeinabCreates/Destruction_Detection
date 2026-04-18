#!/usr/bin/env python3
"""Convert ML inference CSV files into the map's app-data.js contract."""

from __future__ import annotations

import argparse
import csv
import json
from collections import defaultdict
from pathlib import Path


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def number(value: str) -> int | float:
    parsed = float(value)
    return int(parsed) if parsed.is_integer() else parsed


def build_payload(neighborhoods_path: Path, inference_path: Path, events_path: Path | None) -> dict:
    inference_by_area: dict[str, list[dict]] = defaultdict(list)
    dates: dict[str, dict[str, str]] = {}

    for row in read_csv(inference_path):
        date = row["date"]
        dates.setdefault(
            date,
            {
                "id": date,
                "label": row.get("date_label") or date,
                "description": row.get("date_description") or "Model inference window",
            },
        )
        inference_by_area[row["neighborhood_id"]].append(
            {
                "date": date,
                "severity": number(row["severity"]),
                "probability": number(row["probability"]),
                "confidence": number(row["confidence"]),
                "buildings": number(row["buildings"]),
            }
        )

    neighborhoods = []
    for row in read_csv(neighborhoods_path):
        neighborhoods.append(
            {
                "id": row["id"],
                "name": row["name"],
                "region": row["region"],
                "source": row["source"],
                "polygon": json.loads(row["polygon"]),
                "series": sorted(inference_by_area[row["id"]], key=lambda item: item["date"]),
            }
        )

    events = []
    if events_path and events_path.exists():
        for row in read_csv(events_path):
            events.append(
                {
                    "id": row["id"],
                    "date": row["date"],
                    "label": row["label"],
                    "lon": number(row["lon"]),
                    "lat": number(row["lat"]),
                    "intensity": number(row["intensity"]),
                }
            )

    return {
        "generatedAt": "generated-by-pipeline",
        "dates": [dates[key] for key in sorted(dates)],
        "neighborhoods": neighborhoods,
        "events": events,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--neighborhoods", required=True, type=Path)
    parser.add_argument("--inference", required=True, type=Path)
    parser.add_argument("--events", type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()

    payload = build_payload(args.neighborhoods, args.inference, args.events)
    js = "window.LEBANON_DAMAGE_DATA = "
    js += json.dumps(payload, ensure_ascii=True, indent=2)
    js += ";\n"
    args.output.write_text(js, encoding="utf-8")


if __name__ == "__main__":
    main()
