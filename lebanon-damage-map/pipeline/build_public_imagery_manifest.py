#!/usr/bin/env python3
"""Build a public-imagery URL manifest for the app's villages.

This uses NASA GIBS WMS true-color imagery. It does not confirm that a date is
cloud-free or detailed enough for damage analysis; it creates auditable URLs for
quick visual context and near-real-time monitoring.
"""

from __future__ import annotations

import argparse
import csv
import json
from datetime import date, timedelta
from pathlib import Path
from urllib.parse import urlencode

LAYER = "MODIS_Terra_CorrectedReflectance_TrueColor"
WMS_ENDPOINT = "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi"


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def latest_public_date(lag_days: int) -> str:
    return (date.today() - timedelta(days=lag_days)).isoformat()


def bbox_for_polygon(polygon: list[list[float]]) -> list[float]:
    lons = [point[0] for point in polygon]
    lats = [point[1] for point in polygon]
    min_lon, max_lon = min(lons), max(lons)
    min_lat, max_lat = min(lats), max(lats)
    lon_pad = max(0.1, (max_lon - min_lon) * 1.8)
    lat_pad = max(0.1, (max_lat - min_lat) * 1.8)
    return [
        round(min_lon - lon_pad, 5),
        round(min_lat - lat_pad, 5),
        round(max_lon + lon_pad, 5),
        round(max_lat + lat_pad, 5),
    ]


def wms_url(day: str, bbox: list[float]) -> str:
    params = {
        "SERVICE": "WMS",
        "REQUEST": "GetMap",
        "VERSION": "1.1.1",
        "LAYERS": LAYER,
        "STYLES": "",
        "SRS": "EPSG:4326",
        "BBOX": ",".join(str(value) for value in bbox),
        "WIDTH": "720",
        "HEIGHT": "626",
        "FORMAT": "image/jpeg",
        "TIME": day,
    }
    return f"{WMS_ENDPOINT}?{urlencode(params)}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--neighborhoods", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--baseline-date", default="2023-10-15")
    parser.add_argument("--after-date", default=None)
    parser.add_argument("--lag-days", default=1, type=int)
    args = parser.parse_args()

    after_date = args.after_date or latest_public_date(args.lag_days)
    fields = [
        "neighborhood_id",
        "name",
        "source",
        "baseline_date",
        "after_date",
        "before_url",
        "after_url",
        "notes",
    ]

    with args.output.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        for row in read_csv(args.neighborhoods):
            bbox = bbox_for_polygon(json.loads(row["polygon"]))
            writer.writerow(
                {
                    "neighborhood_id": row["id"],
                    "name": row["name"],
                    "source": "NASA GIBS WMS MODIS Terra true color",
                    "baseline_date": args.baseline_date,
                    "after_date": after_date,
                    "before_url": wms_url(args.baseline_date, bbox),
                    "after_url": wms_url(after_date, bbox),
                    "notes": "Public context imagery; too coarse for building-level confirmation.",
                }
            )


if __name__ == "__main__":
    main()
