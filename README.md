

# Cross-Border Damage Analytics Map

Static MVP for tracking neighborhood-level damage analytics over time across Lebanon and neighboring northern Israel monitoring areas.

Open `index.html` in a browser. The app uses local sample inference data from `app-data.js`.

The main map uses Esri World Imagery tiles for a clearer satellite-style basemap. A local vector basemap remains in the code as a fallback pattern, but it is not the default.

## What is included

- Time slider across assessment windows
- Neighborhood polygons colored by damage severity
- Confidence and regional filters, including Northern Israel
- Hover status badge for mapped destruction signals
- Toggleable map popups
- Summary metrics
- Village selector with before/after image review previews
- Actual public satellite before/after views from NASA GIBS WMS
- Clear high-resolution reference mode using Esri World Imagery tiles
- Selected-area trend sparkline
- Highest-signal ranking list
- Local validation workflow for each area/date
- CSV export for the visible date/filter state, including validation fields

## Data contract

The UI expects this shape in `app-data.js`:

```js
{
  dates: [{ id, label, description }],
  neighborhoods: [
    {
      id,
      name,
      region,
      source,
      polygon: [[lon, lat]],
      series: [
        {
          date,
          severity,
          probability,
          confidence,
          buildings
        }
      ]
    }
  ],
  events: [{ id, date, label, lon, lat, intensity }]
}
```

`severity` should be a 0-100 index. `probability` and `confidence` should be 0-1 values. `buildings` should be an estimated count for the date window.

## Replacing the sample data

Use the sample as a UI fixture only. Production data should come from a reproducible pipeline:

1. Pull administrative/neighborhood polygons into PostGIS for every monitored country/region.
2. Pull building footprints from OSM, Microsoft Global ML Building Footprints, or a validated local source.
3. Pull imagery for each window from Sentinel-1, Sentinel-2, or validated high-resolution imagery.
4. Preprocess imagery into aligned tiles.
5. Run change detection and produce per-building or per-grid damage probabilities.
6. Aggregate by neighborhood and date.
7. Export the same data contract used by `app-data.js`.

The map intentionally says probability, not confirmation. Confirmed damage should be stored separately from model output.

## Validation workflow

The selected-area panel includes a review status for the active area/date:

- Demo value
- Suspected ML signal
- Analyst reviewed
- Confirmed
- Rejected / false positive

Reviews are saved locally in the browser with `localStorage`, so they are useful for prototyping and analyst demos without a backend. Exported CSV files include `validation_status`, `evidence_source`, `review_notes`, and `validated_at` so the review decisions can move into the real pipeline later.

For a production workflow, store review decisions in a database or a reviewed CSV queue. The starter queue is `pipeline/validation_queue.csv`; replace it with analyst output after imagery or field validation.

## Near-real-time imagery

The before/after panel can request actual public satellite imagery through NASA GIBS WMS:

```text
https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi
```

This uses `MODIS_Terra_CorrectedReflectance_TrueColor`, which is useful for live context but too coarse for confirming individual damaged buildings. For building-level before/after imagery, connect a licensed or authorized source such as Maxar, Planet, Airbus, Copernicus EMS/UNOSAT products, or a Sentinel Hub/Copernicus pipeline with higher-resolution or validated products.

The clearer reference mode uses Esri World Imagery tiles for visual context. It is not date-specific before/after evidence and should not be used as confirmation of destruction.

You can also generate a URL manifest for the current villages:

```bash
python3 pipeline/build_public_imagery_manifest.py \
  --neighborhoods pipeline/sample_neighborhoods.csv \
  --output pipeline/public_imagery_manifest.csv
```

## CSV to app-data.js

The `pipeline/train_predict_damage.py` helper trains a dependency-free baseline from labeled change features and writes an inference CSV:

```bash
python3 pipeline/train_predict_damage.py \
  --train pipeline/sample_training_features.csv \
  --predict pipeline/sample_prediction_features.csv \
  --output pipeline/model_inference.csv
```

The `pipeline/export_app_data.py` helper then converts inference CSV outputs into the JavaScript file the app reads:

```bash
python3 pipeline/export_app_data.py \
  --neighborhoods pipeline/sample_neighborhoods.csv \
  --inference pipeline/model_inference.csv \
  --events pipeline/sample_events.csv \
  --output app-data.generated.js
```

Use the generated file as `app-data.js` when you are ready to replace the sample fixture.
