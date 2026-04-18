#!/usr/bin/env python3
"""Train a small logistic baseline and emit neighborhood damage inference CSV.

This is intentionally dependency-free so it can run before the production stack
is set up. Replace it with TorchGeo/scikit-learn/XGBoost once real labels exist.
"""

from __future__ import annotations

import argparse
import csv
import math
from pathlib import Path

FEATURES = [
    "optical_delta",
    "sar_delta",
    "coherence_loss",
    "building_density",
    "event_proximity",
]


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def float_row(row: dict[str, str], fields: list[str]) -> list[float]:
    return [float(row[field]) for field in fields]


def sigmoid(value: float) -> float:
    if value < -40:
        return 0.0
    if value > 40:
        return 1.0
    return 1.0 / (1.0 + math.exp(-value))


def normalize(rows: list[list[float]]) -> tuple[list[list[float]], list[float], list[float]]:
    columns = list(zip(*rows))
    means = [sum(column) / len(column) for column in columns]
    scales = []
    for column, mean in zip(columns, means):
        variance = sum((value - mean) ** 2 for value in column) / len(column)
        scales.append(math.sqrt(variance) or 1.0)
    normalized = [
        [(value - means[index]) / scales[index] for index, value in enumerate(row)]
        for row in rows
    ]
    return normalized, means, scales


def apply_normalize(row: list[float], means: list[float], scales: list[float]) -> list[float]:
    return [(value - means[index]) / scales[index] for index, value in enumerate(row)]


def train(features: list[list[float]], labels: list[float], epochs: int, rate: float) -> list[float]:
    weights = [0.0] * (len(FEATURES) + 1)
    for _ in range(epochs):
        gradients = [0.0] * len(weights)
        for row, label in zip(features, labels):
            x = [1.0, *row]
            prediction = sigmoid(sum(weight * value for weight, value in zip(weights, x)))
            error = prediction - label
            for index, value in enumerate(x):
                gradients[index] += error * value
        for index, gradient in enumerate(gradients):
            weights[index] -= rate * gradient / len(features)
    return weights


def predict(weights: list[float], features: list[float]) -> float:
    x = [1.0, *features]
    return sigmoid(sum(weight * value for weight, value in zip(weights, x)))


def confidence(probability: float, feature_quality: float) -> float:
    separation = abs(probability - 0.5) * 0.75
    quality = max(0.0, min(feature_quality, 1.0)) * 0.25
    return round(min(0.95, 0.45 + separation + quality), 3)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--train", required=True, type=Path)
    parser.add_argument("--predict", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--epochs", type=int, default=900)
    parser.add_argument("--rate", type=float, default=0.18)
    args = parser.parse_args()

    train_rows = read_csv(args.train)
    train_features_raw = [float_row(row, FEATURES) for row in train_rows]
    train_features, means, scales = normalize(train_features_raw)
    labels = [float(row["label"]) for row in train_rows]
    weights = train(train_features, labels, args.epochs, args.rate)

    output_fields = [
        "date",
        "date_label",
        "date_description",
        "neighborhood_id",
        "severity",
        "probability",
        "confidence",
        "buildings",
    ]

    with args.output.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=output_fields)
        writer.writeheader()
        for row in read_csv(args.predict):
            raw_features = float_row(row, FEATURES)
            normalized = apply_normalize(raw_features, means, scales)
            probability = predict(weights, normalized)
            candidate_buildings = int(float(row["candidate_buildings"]))
            writer.writerow(
                {
                    "date": row["date"],
                    "date_label": row.get("date_label") or row["date"],
                    "date_description": row.get("date_description") or "Model inference window",
                    "neighborhood_id": row["neighborhood_id"],
                    "severity": round(probability * 100),
                    "probability": round(probability, 4),
                    "confidence": confidence(probability, float(row.get("feature_quality") or 0.65)),
                    "buildings": round(candidate_buildings * probability),
                }
            )


if __name__ == "__main__":
    main()
