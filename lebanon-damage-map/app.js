(function () {
  const data = window.LEBANON_DAMAGE_DATA;
  const state = {
    dateIndex: data.dates.length - 2,
    minConfidence: 0.55,
    area: "all",
    selectedId: "dahiyeh",
    showPopups: true,
    showEvents: false,
    imageryMode: "clarity",
    afterImageryDate: null,
    validationReviews: loadValidationReviews(),
    zoom: 9,
    center: { lon: 35.7, lat: 33.55 },
    dragging: false,
    dragStart: null,
    pointerDown: null
  };

  const els = {
    map: document.getElementById("map"),
    tileLayer: document.getElementById("tileLayer"),
    overlay: document.getElementById("overlay"),
    tooltip: document.getElementById("mapTooltip"),
    hoverStatus: document.getElementById("hoverStatus"),
    mapSource: document.getElementById("mapSource"),
    slider: document.getElementById("dateSlider"),
    dateTicks: document.getElementById("dateTicks"),
    activeDateLabel: document.getElementById("activeDateLabel"),
    activeDateDescription: document.getElementById("activeDateDescription"),
    confidenceFilter: document.getElementById("confidenceFilter"),
    confidenceLabel: document.getElementById("confidenceLabel"),
    areaFilter: document.getElementById("areaFilter"),
    villageSelect: document.getElementById("villageSelect"),
    popupToggle: document.getElementById("popupToggle"),
    eventToggle: document.getElementById("eventToggle"),
    metricBuildings: document.getElementById("metricBuildings"),
    metricProbability: document.getElementById("metricProbability"),
    metricNeighborhoods: document.getElementById("metricNeighborhoods"),
    selectedName: document.getElementById("selectedName"),
    selectedSeverity: document.getElementById("selectedSeverity"),
    selectedConfidence: document.getElementById("selectedConfidence"),
    selectedSource: document.getElementById("selectedSource"),
    selectedValidation: document.getElementById("selectedValidation"),
    validationStatus: document.getElementById("validationStatus"),
    evidenceSource: document.getElementById("evidenceSource"),
    reviewNotes: document.getElementById("reviewNotes"),
    saveValidation: document.getElementById("saveValidation"),
    validationSaved: document.getElementById("validationSaved"),
    sparkline: document.getElementById("sparkline"),
    imageryTitle: document.getElementById("imageryTitle"),
    beforeImageLabel: document.getElementById("beforeImageLabel"),
    beforeImage: document.getElementById("beforeImage"),
    afterImage: document.getElementById("afterImage"),
    afterImageLabel: document.getElementById("afterImageLabel"),
    imageryCaption: document.getElementById("imageryCaption"),
    imageLightbox: document.getElementById("imageLightbox"),
    lightboxImage: document.getElementById("lightboxImage"),
    closeLightbox: document.getElementById("closeLightbox"),
    imageryMode: document.getElementById("imageryMode"),
    afterImageryDate: document.getElementById("afterImageryDate"),
    useLatestImagery: document.getElementById("useLatestImagery"),
    baselineSeverity: document.getElementById("baselineSeverity"),
    afterSeverity: document.getElementById("afterSeverity"),
    buildingDelta: document.getElementById("buildingDelta"),
    rankingList: document.getElementById("rankingList"),
    exportCsv: document.getElementById("exportCsv"),
    zoomIn: document.getElementById("zoomIn"),
    zoomOut: document.getElementById("zoomOut"),
    resetView: document.getElementById("resetView")
  };

  const regionLabels = {
    all: "All mapped areas",
    beirut: "Beirut metro",
    south: "South and Nabatiyeh",
    bekaa: "Bekaa and Baalbek-Hermel",
    israel: "Northern Israel"
  };

  const validationLabels = {
    demo: "Demo value",
    suspected: "Suspected ML signal",
    "analyst-reviewed": "Analyst reviewed",
    confirmed: "Confirmed",
    rejected: "Rejected / false positive"
  };

  const evidenceLabels = {
    none: "No evidence attached",
    sentinel: "Sentinel-derived change",
    "public-imagery": "Public imagery review",
    "high-res": "High-resolution imagery",
    "field-report": "Field report",
    "media-osint": "Media / OSINT",
    "local-authority": "Local authority report"
  };

  const placeCenters = {
    "dahiyeh": { lon: 35.512, lat: 33.858 },
    "haret-hreik": { lon: 35.518, lat: 33.854 },
    "ghobeiry": { lon: 35.501, lat: 33.861 },
    "bint-jbeil": { lon: 35.432, lat: 33.119 },
    "nabatieh": { lon: 35.484, lat: 33.378 },
    "sour": { lon: 35.203, lat: 33.273 },
    "marjayoun": { lon: 35.592, lat: 33.361 },
    "saida": { lon: 35.371, lat: 33.563 },
    "baalbek": { lon: 36.218, lat: 34.005 },
    "zahle": { lon: 35.904, lat: 33.846 },
    "hermel": { lon: 36.392, lat: 34.394 },
    "aley": { lon: 35.596, lat: 33.81 },
    "kiryat-shmona": { lon: 35.572, lat: 33.207 },
    "metula": { lon: 35.579, lat: 33.278 },
    "nahariya": { lon: 35.095, lat: 33.006 },
    "safed": { lon: 35.495, lat: 32.965 },
    "khiam": { lon: 35.6067, lat: 33.323 },
    "kfar-kila": { lon: 35.55167, lat: 33.27722 },
    "odaisseh": { lon: 35.557, lat: 33.255 },
    "taybeh-marjayoun": { lon: 35.52056, lat: 33.27627 },
    "houla": { lon: 35.5165, lat: 33.2065 },
    "mays-al-jabal": { lon: 35.52344, lat: 33.16907 },
    "aitaroun": { lon: 35.46667, lat: 33.11667 },
    "yaroun": { lon: 35.4225, lat: 33.08028 },
    "blida": { lon: 35.51444, lat: 33.14 },
    "markaba": { lon: 35.5167, lat: 33.2333 }
  };

  const villageAreaSpecs = [
    ["khiam", "Khiam", "south", "Sentinel-1 SAR + Sentinel-2 optical", [5, 30, 70, 82, 88, 84], [18, 210, 850, 1220, 1420, 1350]],
    ["kfar-kila", "Kfar Kila", "south", "Sentinel-1 SAR coherence proxy", [6, 38, 76, 88, 92, 89], [22, 260, 760, 1080, 1250, 1200]],
    ["odaisseh", "Odaisseh", "south", "Sentinel-1 SAR + event context", [5, 35, 72, 85, 90, 87], [16, 190, 610, 820, 920, 890]],
    ["taybeh-marjayoun", "Taybeh", "south", "Sentinel-2 optical + SAR change", [4, 24, 55, 68, 76, 72], [12, 110, 360, 520, 640, 610]],
    ["houla", "Houla", "south", "Sentinel-1 SAR coherence proxy", [3, 27, 61, 74, 80, 77], [10, 130, 430, 610, 720, 690]],
    ["mays-al-jabal", "Mays al Jabal", "south", "Sentinel-2 optical + building footprints", [4, 28, 58, 70, 78, 74], [13, 150, 470, 640, 760, 720]],
    ["aitaroun", "Aitaroun", "south", "Sentinel-1 SAR + Sentinel-2 optical", [5, 32, 68, 80, 86, 82], [15, 180, 590, 790, 900, 860]],
    ["yaroun", "Yaroun", "south", "Sentinel-2 optical + SAR change", [4, 25, 57, 69, 75, 72], [11, 120, 390, 560, 670, 640]],
    ["blida", "Blida", "south", "Sentinel-1 SAR coherence proxy", [4, 29, 63, 75, 82, 78], [14, 145, 470, 660, 790, 750]],
    ["markaba", "Markaba", "south", "Sentinel-1 SAR + event context", [3, 22, 50, 62, 70, 67], [10, 100, 320, 470, 560, 535]]
  ];

  const useSatelliteBasemap = true;
  const localBasemap = {
    water: [
      [34.62, 32.82],
      [35.08, 32.82],
      [35.14, 33.12],
      [35.18, 33.38],
      [35.24, 33.64],
      [35.23, 33.9],
      [35.21, 34.18],
      [35.18, 34.68],
      [34.62, 34.68]
    ],
    lebanon: [
      [35.1, 33.08],
      [35.16, 33.24],
      [35.23, 33.5],
      [35.35, 33.76],
      [35.47, 33.92],
      [35.68, 34.17],
      [35.84, 34.39],
      [36.08, 34.62],
      [36.48, 34.55],
      [36.58, 34.31],
      [36.47, 34.08],
      [36.36, 33.84],
      [36.25, 33.58],
      [35.99, 33.31],
      [35.83, 33.14],
      [35.64, 33.02],
      [35.42, 32.96],
      [35.22, 33.0]
    ],
    neighbors: [
      [
        [35.92, 32.82],
        [36.85, 32.82],
        [36.85, 34.68],
        [36.48, 34.55],
        [36.58, 34.31],
        [36.25, 33.58],
        [35.83, 33.14]
      ],
      [
        [34.62, 32.82],
        [35.92, 32.82],
        [35.42, 32.96],
        [35.22, 33.0],
        [35.1, 33.08],
        [34.62, 33.05]
      ]
    ],
    roads: [
      [
        [35.18, 33.25],
        [35.35, 33.56],
        [35.5, 33.89],
        [35.83, 33.84],
        [36.17, 34.0],
        [36.35, 34.4]
      ],
      [
        [35.45, 33.1],
        [35.49, 33.37],
        [35.5, 33.89],
        [35.89, 33.84]
      ]
    ],
    labels: [
      { name: "Beirut", lon: 35.5, lat: 33.89 },
      { name: "Saida", lon: 35.37, lat: 33.56 },
      { name: "Sour", lon: 35.2, lat: 33.27 },
      { name: "Nabatieh", lon: 35.48, lat: 33.38 },
      { name: "Baalbek", lon: 36.2, lat: 34.0 },
      { name: "Hermel", lon: 36.39, lat: 34.39 },
      { name: "Kiryat Shmona", lon: 35.572, lat: 33.207 },
      { name: "Nahariya", lon: 35.095, lat: 33.006 },
      { name: "Safed", lon: 35.495, lat: 32.965 }
    ]
  };

  function init() {
    addVillageAreas();
    els.slider.max = String(data.dates.length - 1);
    els.slider.value = String(state.dateIndex);
    els.dateTicks.innerHTML = data.dates.map((date) => `<span>${date.label.split(",")[0]}</span>`).join("");
    els.villageSelect.innerHTML = data.neighborhoods
      .map((area) => `<option value="${area.id}">${area.name}</option>`)
      .join("");
    els.villageSelect.value = state.selectedId;
    state.afterImageryDate = latestPublicImageryDate();
    els.afterImageryDate.value = state.afterImageryDate;
    els.eventToggle.checked = state.showEvents;
    els.imageryMode.value = state.imageryMode;
    updateImageryControls();

    els.slider.addEventListener("input", (event) => {
      state.dateIndex = Number(event.target.value);
      render();
    });

    els.confidenceFilter.addEventListener("input", (event) => {
      state.minConfidence = Number(event.target.value) / 100;
      els.confidenceLabel.textContent = `${event.target.value}%`;
      render();
    });

    els.areaFilter.addEventListener("change", (event) => {
      state.area = event.target.value;
      render();
    });

    els.villageSelect.addEventListener("change", (event) => {
      selectArea(event.target.value, true);
    });

    els.popupToggle.addEventListener("change", (event) => {
      state.showPopups = event.target.checked;
      if (!state.showPopups) hideTooltip();
    });

    els.eventToggle.addEventListener("change", (event) => {
      state.showEvents = event.target.checked;
      renderOverlay();
    });

    els.imageryMode.addEventListener("change", (event) => {
      state.imageryMode = event.target.value;
      updateImageryControls();
      renderSelected();
    });

    els.afterImageryDate.addEventListener("change", (event) => {
      state.afterImageryDate = event.target.value;
      renderSelected();
    });

    els.useLatestImagery.addEventListener("click", () => {
      state.afterImageryDate = latestPublicImageryDate();
      els.afterImageryDate.value = state.afterImageryDate;
      renderSelected();
    });
    els.saveValidation.addEventListener("click", saveValidationReview);
    els.beforeImage.addEventListener("click", () => openLightbox(els.beforeImage.innerHTML));
    els.afterImage.addEventListener("click", () => openLightbox(els.afterImage.innerHTML));
    els.closeLightbox.addEventListener("click", closeLightbox);
    els.imageLightbox.addEventListener("click", (event) => {
      if (event.target === els.imageLightbox) closeLightbox();
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeLightbox();
    });

    els.exportCsv.addEventListener("click", exportVisibleCsv);
    els.zoomIn.addEventListener("click", () => setZoom(state.zoom + 1));
    els.zoomOut.addEventListener("click", () => setZoom(state.zoom - 1));
    els.resetView.addEventListener("click", () => {
      state.zoom = 9;
      state.center = { lon: 35.7, lat: 33.55 };
      render();
    });

    els.map.addEventListener("pointerdown", startDrag);
    els.map.addEventListener("pointermove", updateHoverFromPointer);
    els.map.addEventListener("pointerleave", clearHoverStatus);
    els.map.addEventListener("click", selectFromMapClick);
    window.addEventListener("pointermove", dragMap);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("resize", render);

    render();
  }

  function addVillageAreas() {
    villageAreaSpecs.forEach(([id, name, region, source, severities, buildings]) => {
      if (data.neighborhoods.some((area) => area.id === id)) return;
      const center = placeCenters[id];
      data.neighborhoods.push({
        id,
        name,
        region,
        source,
        polygon: monitoringPolygon(center, 0.025, 0.02),
        series: data.dates
          .filter((date) => date.id !== "2026-04-18")
          .map((date, index) => {
            const severity = severities[index] ?? severities[severities.length - 1];
            return {
              date: date.id,
              severity,
              probability: Math.round(Math.min(0.95, severity / 100 + 0.04) * 100) / 100,
              confidence: Math.round((0.68 + Math.min(0.14, severity / 500)) * 100) / 100,
              buildings: buildings[index] ?? buildings[buildings.length - 1]
            };
          })
      });
    });
  }

  function monitoringPolygon(center, lonRadius, latRadius) {
    return [
      [roundCoord(center.lon - lonRadius), roundCoord(center.lat + latRadius)],
      [roundCoord(center.lon + lonRadius), roundCoord(center.lat + latRadius)],
      [roundCoord(center.lon + lonRadius), roundCoord(center.lat - latRadius)],
      [roundCoord(center.lon - lonRadius), roundCoord(center.lat - latRadius)]
    ];
  }

  function setZoom(nextZoom) {
    state.zoom = Math.max(7, Math.min(18, nextZoom));
    render();
  }

  function startDrag(event) {
    if (event.target.closest("button")) return;
    state.dragging = true;
    state.dragStart = {
      x: event.clientX,
      y: event.clientY,
      centerWorld: lonLatToWorld(state.center.lon, state.center.lat, state.zoom)
    };
    state.pointerDown = { x: event.clientX, y: event.clientY };
    els.map.setPointerCapture?.(event.pointerId);
  }

  function dragMap(event) {
    if (!state.dragging || !state.dragStart) return;
    const dx = event.clientX - state.dragStart.x;
    const dy = event.clientY - state.dragStart.y;
    const world = {
      x: state.dragStart.centerWorld.x - dx,
      y: state.dragStart.centerWorld.y - dy
    };
    state.center = worldToLonLat(world.x, world.y, state.zoom);
    render();
  }

  function endDrag() {
    state.dragging = false;
    state.dragStart = null;
  }

  function render() {
    const date = data.dates[state.dateIndex];
    els.activeDateLabel.textContent = date.label;
    els.activeDateDescription.textContent = `${date.description} · ${regionLabels[state.area]}`;

    renderBasemap();
    renderOverlay();
    renderMetrics();
    renderSelected();
    renderRankings();
  }

  function selectArea(areaId, recenter) {
    const selected = data.neighborhoods.find((area) => area.id === areaId);
    if (!selected) return;
    state.selectedId = areaId;
    if (recenter) {
      state.center = areaCenter(selected);
      state.zoom = Math.max(state.zoom, 14);
    }
    render();
  }

  function renderBasemap() {
    if (useSatelliteBasemap) {
      renderSatelliteTiles();
      return;
    }
    renderLocalBasemap();
  }

  function renderSatelliteTiles() {
    els.mapSource.textContent = "Esri World Imagery";
    const rect = els.map.getBoundingClientRect();
    const centerWorld = lonLatToWorld(state.center.lon, state.center.lat, state.zoom);
    const topLeft = {
      x: centerWorld.x - rect.width / 2,
      y: centerWorld.y - rect.height / 2
    };
    const minTileX = Math.floor(topLeft.x / 256);
    const minTileY = Math.floor(topLeft.y / 256);
    const maxTileX = Math.floor((topLeft.x + rect.width) / 256);
    const maxTileY = Math.floor((topLeft.y + rect.height) / 256);
    const limit = 2 ** state.zoom;
    const tiles = [];

    for (let x = minTileX; x <= maxTileX; x += 1) {
      for (let y = minTileY; y <= maxTileY; y += 1) {
        if (y < 0 || y >= limit) continue;
        const wrappedX = ((x % limit) + limit) % limit;
        tiles.push(`
          <img
            class="map-tile"
            alt=""
            src="${esriTileUrl(state.zoom, wrappedX, y)}"
            style="left:${Math.round(x * 256 - topLeft.x)}px; top:${Math.round(y * 256 - topLeft.y)}px;"
            referrerpolicy="no-referrer"
            draggable="false"
          />
        `);
      }
    }

    els.tileLayer.innerHTML = tiles.join("");
  }

  function renderLocalBasemap() {
    els.mapSource.textContent = "Local basemap · no external tile requests";
    const rect = els.map.getBoundingClientRect();
    const polygon = (points) => points.map(([lon, lat]) => {
      const point = project(lon, lat);
      return `${point.x},${point.y}`;
    }).join(" ");
    const line = (points) => points.map(([lon, lat], index) => {
      const point = project(lon, lat);
      return `${index ? "L" : "M"} ${point.x} ${point.y}`;
    }).join(" ");
    const labels = localBasemap.labels.map((label) => {
      const point = project(label.lon, label.lat);
      return `<text class="basemap-place" x="${point.x + 8}" y="${point.y - 8}">${label.name}</text>`;
    }).join("");
    const neighbors = localBasemap.neighbors.map((shape) => {
      return `<polygon class="basemap-neighbor" points="${polygon(shape)}"></polygon>`;
    }).join("");
    const roads = localBasemap.roads.map((shape) => {
      return `<path class="basemap-road" d="${line(shape)}"></path>`;
    }).join("");

    els.tileLayer.innerHTML = `
      <svg class="local-basemap" viewBox="0 0 ${rect.width} ${rect.height}" aria-hidden="true">
        <rect class="basemap-water" width="${rect.width}" height="${rect.height}"></rect>
        ${neighbors}
        <polygon class="basemap-land" points="${polygon(localBasemap.lebanon)}"></polygon>
        ${roads}
        ${labels}
      </svg>
    `;
  }

  function renderOverlay() {
    const rect = els.map.getBoundingClientRect();
    els.overlay.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
    els.overlay.setAttribute("width", rect.width);
    els.overlay.setAttribute("height", rect.height);
    els.overlay.innerHTML = "";

    const visible = visibleNeighborhoods();
    const fragment = document.createDocumentFragment();

    data.neighborhoods.forEach((area) => {
      const datum = byDate(area);
      const passes = visible.some((item) => item.id === area.id);
      const points = area.polygon.map(([lon, lat]) => project(lon, lat));
      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      polygon.setAttribute("points", points.map((point) => `${point.x},${point.y}`).join(" "));
      polygon.setAttribute("class", [
        "area-shape",
        passes ? "" : "is-muted",
        state.selectedId === area.id ? "is-selected" : ""
      ].join(" "));
      polygon.setAttribute("fill", severityColor(datum.severity));
      polygon.setAttribute("data-id", area.id);
      polygon.addEventListener("click", () => {
        selectArea(area.id, false);
      });
      polygon.addEventListener("pointermove", (event) => maybeShowTooltip(event, area, datum));
      polygon.addEventListener("pointerleave", hideTooltip);
      fragment.appendChild(polygon);

      if (passes) renderAreaPin(fragment, area, datum);
    });

    if (state.showEvents) {
      data.events.forEach((event) => {
        const activeDate = data.dates[state.dateIndex].id;
        const point = project(event.lon, event.lat);
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", point.x);
        circle.setAttribute("cy", point.y);
        circle.setAttribute("r", 4 + event.intensity * 8);
        circle.setAttribute("class", event.date <= activeDate ? "event-point" : "event-point is-muted");
        fragment.appendChild(circle);
      });
    }

    els.overlay.appendChild(fragment);
  }

  function renderAreaPin(fragment, area, datum) {
    const point = project(areaCenter(area).lon, areaCenter(area).lat);
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("class", `area-pin-group ${state.selectedId === area.id ? "is-selected" : ""}`);
    group.setAttribute("data-id", area.id);
    group.addEventListener("click", (event) => {
      event.stopPropagation();
      selectArea(area.id, false);
    });
    group.addEventListener("pointermove", (event) => maybeShowTooltip(event, area, datum));
    group.addEventListener("pointerleave", hideTooltip);

    const halo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    halo.setAttribute("cx", point.x);
    halo.setAttribute("cy", point.y);
    halo.setAttribute("r", 12);
    halo.setAttribute("class", "area-pin-halo");
    group.appendChild(halo);

    const pin = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    pin.setAttribute("cx", point.x);
    pin.setAttribute("cy", point.y);
    pin.setAttribute("r", 6);
    pin.setAttribute("fill", severityColor(datum.severity));
    pin.setAttribute("class", "area-pin");
    group.appendChild(pin);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", point.x + 10);
    label.setAttribute("y", point.y - 10);
    label.setAttribute("class", "area-label");
    label.textContent = area.name;
    group.appendChild(label);
    fragment.appendChild(group);
  }

  function renderMetrics() {
    const visible = visibleNeighborhoods();
    const buildings = visible.reduce((sum, area) => sum + byDate(area).buildings, 0);
    const weightedProbability = visible.reduce((sum, area) => {
      const datum = byDate(area);
      return sum + datum.probability * Math.max(1, datum.buildings);
    }, 0);
    const denominator = visible.reduce((sum, area) => sum + Math.max(1, byDate(area).buildings), 0);

    els.metricBuildings.textContent = formatNumber(buildings);
    els.metricProbability.textContent = `${Math.round((weightedProbability / Math.max(1, denominator)) * 100)}%`;
    els.metricNeighborhoods.textContent = String(visible.length);
  }

  function renderSelected() {
    const selected = data.neighborhoods.find((area) => area.id === state.selectedId) || visibleNeighborhoods()[0];
    if (!selected) return;
    state.selectedId = selected.id;
    const datum = byDate(selected);

    els.selectedName.textContent = selected.name;
    els.selectedSeverity.textContent = `${datum.severity}/100`;
    els.selectedConfidence.textContent = `${Math.round(datum.confidence * 100)}%`;
    els.selectedSource.textContent = selected.source;
    els.villageSelect.value = selected.id;
    renderValidationReview(selected);

    renderSparkline(selected);
    renderImageryReview(selected, datum);
  }

  function renderValidationReview(area) {
    const review = validationFor(area);
    els.selectedValidation.textContent = validationLabel(review.status);
    els.validationStatus.value = review.status;
    els.evidenceSource.value = review.evidenceSource;
    els.reviewNotes.value = review.notes;
    els.validationSaved.textContent = review.savedAt
      ? `Saved ${new Date(review.savedAt).toLocaleString()}`
      : "Not saved yet";
  }

  function renderSparkline(area) {
    const width = 350;
    const height = 96;
    const padding = 15;
    const values = area.series.map((item) => item.severity);
    const max = Math.max(100, ...values);
    const points = values.map((value, index) => {
      const x = padding + (index / (values.length - 1)) * (width - padding * 2);
      const y = height - padding - (value / max) * (height - padding * 2);
      return { x, y };
    });
    const path = points.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ");
    const activeDatum = byDate(area);
    const activeIndex = Math.max(0, area.series.findIndex((item) => item.date === activeDatum.date));
    const active = points[activeIndex] || points[points.length - 1];

    els.sparkline.setAttribute("viewBox", `0 0 ${width} ${height}`);
    els.sparkline.innerHTML = `
      <path d="M ${padding} ${height - padding} H ${width - padding}" stroke="#d9e3df" stroke-width="2" />
      <path d="${path}" fill="none" stroke="#087f8c" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="${active.x}" cy="${active.y}" r="6" fill="${severityColor(activeDatum.severity)}" stroke="#111816" stroke-width="2" />
    `;
  }

  function renderRankings() {
    const visible = visibleNeighborhoods()
      .slice()
      .sort((a, b) => byDate(b).severity - byDate(a).severity)
      .slice(0, 6);

    els.rankingList.innerHTML = visible
      .map((area) => {
        const datum = byDate(area);
        const review = validationFor(area);
        return `
          <li>
            <button type="button" data-id="${area.id}">
              <strong>${area.name}</strong><br />
              <span>${formatNumber(datum.buildings)} estimated buildings · ${Math.round(datum.confidence * 100)}% confidence · ${validationLabel(review.status)}</span>
            </button>
            <span class="rank-score" style="background:${severityColor(datum.severity)}">${datum.severity}</span>
          </li>
        `;
      })
      .join("");

    els.rankingList.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        selectArea(button.dataset.id, true);
      });
    });
  }

  function visibleNeighborhoods() {
    return data.neighborhoods.filter((area) => {
      const datum = byDate(area);
      const regionPass = state.area === "all" || area.region === state.area;
      return regionPass && datum.confidence >= state.minConfidence;
    });
  }

  function byDate(area) {
    const dateId = data.dates[state.dateIndex].id;
    const exact = area.series.find((item) => item.date === dateId);
    if (exact) return exact;
    const prior = area.series
      .filter((item) => item.date <= dateId)
      .sort((a, b) => b.date.localeCompare(a.date))[0];
    return prior || area.series[0];
  }

  function maybeShowTooltip(event, area, datum) {
    updateHoverStatus(area, datum);
    if (!state.showPopups) return;
    const review = validationFor(area);
    els.tooltip.hidden = false;
    els.tooltip.style.left = `${event.clientX - els.map.getBoundingClientRect().left + 14}px`;
    els.tooltip.style.top = `${event.clientY - els.map.getBoundingClientRect().top + 14}px`;
    els.tooltip.innerHTML = `
      <strong>${area.name}</strong>
      ${destructionStatus(datum)}<br />
      Severity ${datum.severity}/100<br />
      ${formatNumber(datum.buildings)} estimated buildings<br />
      ${Math.round(datum.confidence * 100)}% confidence<br />
      ${validationLabel(review.status)}
    `;
  }

  function hideTooltip() {
    els.tooltip.hidden = true;
  }

  function updateHoverFromPointer(event) {
    if (state.dragging) return;
    if (event.target.closest(".area-shape") || event.target.closest(".area-pin-group")) return;
    const rect = els.map.getBoundingClientRect();
    const point = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    const hit = areaAtPoint(point);
    if (!hit) {
      hideTooltip();
      els.hoverStatus.innerHTML = "No mapped destruction signal here";
      return;
    }
    updateHoverStatus(hit.area, hit.datum);
    if (state.showPopups) maybeShowTooltip(event, hit.area, hit.datum);
  }

  function updateHoverStatus(area, datum) {
    els.hoverStatus.innerHTML = `<strong>${area.name}</strong> · ${destructionStatus(datum)} · ${datum.severity}/100`;
  }

  function clearHoverStatus() {
    hideTooltip();
    els.hoverStatus.textContent = "Hover over the map";
  }

  function areaAtPoint(point) {
    const polygonHit = visibleNeighborhoods()
      .map((area) => ({ area, datum: byDate(area), points: area.polygon.map(([lon, lat]) => project(lon, lat)) }))
      .filter((item) => pointInPolygon(point, item.points))
      .sort((a, b) => b.datum.severity - a.datum.severity)[0];
    if (polygonHit) return polygonHit;
    return nearestAreaAtPoint(point, 72);
  }

  function nearestAreaAtPoint(point, radius) {
    return visibleNeighborhoods()
      .map((area) => {
        const projected = project(areaCenter(area).lon, areaCenter(area).lat);
        const distance = Math.hypot(projected.x - point.x, projected.y - point.y);
        return { area, datum: byDate(area), distance };
      })
      .filter((item) => item.distance <= radius)
      .sort((a, b) => a.distance - b.distance)[0];
  }

  function selectFromMapClick(event) {
    if (!state.pointerDown) return;
    const moved = Math.hypot(event.clientX - state.pointerDown.x, event.clientY - state.pointerDown.y);
    state.pointerDown = null;
    if (moved > 8 || event.target.closest("button")) return;
    const rect = els.map.getBoundingClientRect();
    const hit = areaAtPoint({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
    if (!hit) return;
    state.selectedId = hit.area.id;
    render();
    maybeShowTooltip(event, hit.area, hit.datum);
  }

  function pointInPolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
      const xi = polygon[i].x;
      const yi = polygon[i].y;
      const xj = polygon[j].x;
      const yj = polygon[j].y;
      const intersects = yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
      if (intersects) inside = !inside;
    }
    return inside;
  }

  function destructionStatus(datum) {
    if (datum.severity >= 70) return "high destruction signal";
    if (datum.severity >= 40) return "moderate destruction signal";
    if (datum.severity >= 15) return "low destruction signal";
    return "no major destruction signal";
  }

  function validationKey(area) {
    return `${area.id}::${data.dates[state.dateIndex].id}`;
  }

  function validationFor(area) {
    return {
      status: "demo",
      evidenceSource: "none",
      notes: "",
      savedAt: "",
      ...(state.validationReviews[validationKey(area)] || {})
    };
  }

  function validationLabel(status) {
    return validationLabels[status] || validationLabels.demo;
  }

  function saveValidationReview() {
    const selected = data.neighborhoods.find((area) => area.id === state.selectedId);
    if (!selected) return;
    const review = {
      status: els.validationStatus.value,
      evidenceSource: els.evidenceSource.value,
      notes: els.reviewNotes.value.trim(),
      savedAt: new Date().toISOString()
    };
    state.validationReviews[validationKey(selected)] = review;
    saveValidationReviews(state.validationReviews);
    render();
  }

  function loadValidationReviews() {
    try {
      return JSON.parse(localStorage.getItem("damageValidationReviews") || "{}");
    } catch (error) {
      return {};
    }
  }

  function saveValidationReviews(reviews) {
    try {
      localStorage.setItem("damageValidationReviews", JSON.stringify(reviews));
    } catch (error) {
      els.validationSaved.textContent = "Could not save in this browser";
    }
  }

  function renderImageryReview(area, datum) {
    const baseline = area.series[0];
    const activeDate = data.dates[state.dateIndex];
    const afterDate = state.imageryMode === "dated" ? state.afterImageryDate : activeDate.id;
    els.imageryTitle.textContent = `${area.name} imagery review`;
    els.beforeImageLabel.textContent = `Before ${baseline.date}`;
    els.afterImageLabel.textContent = `After ${afterDate}`;
    if (state.imageryMode === "clarity") {
      renderClarityImagery(area, datum);
      els.imageryCaption.textContent = `${area.name} is shown with a clearer high-resolution reference basemap so the comparison reads like satellite imagery. This layer is not date-specific; the after side includes the current analytic damage overlay.`;
    } else if (state.imageryMode === "dated") {
      renderPublicImagery(area, baseline.date, afterDate);
      els.imageryCaption.textContent = `${destructionStatus(datum)} based on ${area.source}. Images are live public NASA GIBS true-color satellite views; they are useful for context, but too coarse for confirmed building-level damage.`;
    } else {
      els.beforeImage.innerHTML = imagerySvg(area, baseline, false);
      els.afterImage.innerHTML = imagerySvg(area, datum, true);
      els.imageryCaption.textContent = `${destructionStatus(datum)} based on ${area.source}. The preview is a local analytic mockup until validated satellite chips are connected.`;
    }
    els.baselineSeverity.textContent = `${baseline.severity}/100`;
    els.afterSeverity.textContent = `${datum.severity}/100`;
    els.buildingDelta.textContent = `+${formatNumber(Math.max(0, datum.buildings - baseline.buildings))}`;
  }

  function updateImageryControls() {
    const usesDatedPublicImagery = state.imageryMode === "dated";
    els.afterImageryDate.disabled = !usesDatedPublicImagery;
    els.useLatestImagery.disabled = !usesDatedPublicImagery;
  }

  function renderClarityImagery(area, datum) {
    const center = areaCenter(area);
    els.beforeImage.innerHTML = clarityImageMarkup(center, "Clearer reference", false, datum);
    els.afterImage.innerHTML = clarityImageMarkup(center, "Current signal overlay", true, datum);
  }

  function clarityImageMarkup(center, label, after, datum) {
    const zoom = 15;
    const tile = lonLatToTile(center.lon, center.lat, zoom);
    const tiles = [];
    for (let y = tile.y - 1; y <= tile.y + 1; y += 1) {
      for (let x = tile.x - 1; x <= tile.x + 1; x += 1) {
        tiles.push(`<img src="${esriTileUrl(zoom, x, y)}" alt="" loading="lazy" referrerpolicy="no-referrer" />`);
      }
    }
    return `
      <div class="tile-mosaic">${tiles.join("")}</div>
      ${after && datum.severity >= 30 ? '<span class="damage-overlay"></span>' : ""}
    `;
  }

  function esriTileUrl(zoom, x, y) {
    return `https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${y}/${x}`;
  }

  function renderPublicImagery(area, beforeDate, afterDate) {
    const bbox = imageryBbox(area.polygon);
    els.beforeImage.innerHTML = actualImageMarkup(area.name, beforeDate, bbox);
    els.afterImage.innerHTML = actualImageMarkup(area.name, afterDate, bbox);
  }

  function actualImageMarkup(areaName, date, bbox) {
    const url = gibsWmsUrl(date, bbox);
    return `
      <img
        src="${url}"
        alt="NASA GIBS true-color satellite image for ${areaName} on ${date}"
        loading="lazy"
        referrerpolicy="no-referrer"
      />
    `;
  }

  function openLightbox(markup) {
    if (!markup.trim()) return;
    els.lightboxImage.innerHTML = markup;
    els.imageLightbox.hidden = false;
  }

  function closeLightbox() {
    els.imageLightbox.hidden = true;
    els.lightboxImage.innerHTML = "";
  }

  function gibsWmsUrl(date, bbox) {
    const params = new URLSearchParams({
      SERVICE: "WMS",
      REQUEST: "GetMap",
      VERSION: "1.1.1",
      LAYERS: "MODIS_Terra_CorrectedReflectance_TrueColor",
      STYLES: "",
      SRS: "EPSG:4326",
      BBOX: bbox.join(","),
      WIDTH: "720",
      HEIGHT: "626",
      FORMAT: "image/jpeg",
      TIME: date
    });
    return `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?${params.toString()}`;
  }

  function imageryBbox(polygon) {
    const lons = polygon.map(([lon]) => lon);
    const lats = polygon.map(([, lat]) => lat);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const lonPad = Math.max(0.1, (maxLon - minLon) * 1.8);
    const latPad = Math.max(0.1, (maxLat - minLat) * 1.8);
    return [
      roundCoord(minLon - lonPad),
      roundCoord(minLat - latPad),
      roundCoord(maxLon + lonPad),
      roundCoord(maxLat + latPad)
    ];
  }

  function areaCenter(area) {
    return placeCenters[area.id] || polygonCenter(area.polygon);
  }

  function latestPublicImageryDate() {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - 1);
    return date.toISOString().slice(0, 10);
  }

  function lonLatToTile(lon, lat, zoom) {
    const latRad = (lat * Math.PI) / 180;
    const tiles = 2 ** zoom;
    return {
      x: Math.floor(((lon + 180) / 360) * tiles),
      y: Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * tiles)
    };
  }

  function imagerySvg(area, datum, after) {
    const seed = hashText(area.id);
    const rows = [];
    const damageLimit = after ? Math.round((datum.severity / 100) * 18) : 0;

    rows.push('<rect width="240" height="210" fill="#cfe1d8"></rect>');
    rows.push('<path d="M 0 160 C 54 144 90 172 138 151 S 205 125 240 140 L 240 210 L 0 210 Z" fill="#b9d7d1"></path>');
    rows.push('<path d="M -20 45 C 40 65 66 36 116 54 S 184 72 260 44" fill="none" stroke="#8bb3aa" stroke-width="10" opacity="0.58"></path>');
    rows.push('<path d="M 20 190 L 220 16" stroke="#e8ece3" stroke-width="11"></path>');
    rows.push('<path d="M 20 190 L 220 16" stroke="#aab9b3" stroke-width="2" stroke-dasharray="8 8"></path>');

    for (let index = 0; index < 34; index += 1) {
      const x = 20 + ((seed + index * 37) % 185);
      const y = 24 + ((seed * 3 + index * 29) % 145);
      const width = 11 + ((seed + index * 13) % 17);
      const height = 9 + ((seed + index * 17) % 19);
      const rotate = ((seed + index * 7) % 20) - 10;
      const damaged = index < damageLimit;
      const fill = damaged ? "#7b514c" : after ? "#d6d0bd" : "#e7e1ca";
      const stroke = damaged ? "#4b2926" : "#8f9b91";
      const opacity = damaged ? 0.72 : 0.94;
      rows.push(
        `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="1.5" fill="${fill}" stroke="${stroke}" stroke-width="1" opacity="${opacity}" transform="rotate(${rotate} ${x + width / 2} ${y + height / 2})"></rect>`
      );
      if (damaged) {
        rows.push(`<circle cx="${x + width / 2}" cy="${y + height / 2}" r="${Math.max(width, height) * 0.58}" fill="#3c2b28" opacity="0.18"></circle>`);
      }
    }

    return `<svg viewBox="0 0 240 210" aria-hidden="true">${rows.join("")}</svg>`;
  }

  function hashText(value) {
    return value.split("").reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) % 100000, 7);
  }

  function roundCoord(value) {
    return Math.round(value * 100000) / 100000;
  }

  function exportVisibleCsv() {
    const rows = [
      ["date", "neighborhood_id", "neighborhood", "region", "severity", "probability", "confidence", "estimated_damaged_buildings", "source", "validation_status", "evidence_source", "review_notes", "validated_at"]
    ];
    const date = data.dates[state.dateIndex].id;
    visibleNeighborhoods().forEach((area) => {
      const datum = byDate(area);
      const review = validationFor(area);
      rows.push([
        date,
        area.id,
        area.name,
        area.region,
        datum.severity,
        datum.probability,
        datum.confidence,
        datum.buildings,
        area.source,
        review.status,
        evidenceLabels[review.evidenceSource] || evidenceLabels.none,
        review.notes,
        review.savedAt
      ]);
    });
    const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lebanon-damage-${date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function csvEscape(value) {
    const text = String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }

  function lonLatToWorld(lon, lat, zoom) {
    const scale = 256 * 2 ** zoom;
    const sin = Math.sin((lat * Math.PI) / 180);
    return {
      x: ((lon + 180) / 360) * scale,
      y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale
    };
  }

  function worldToLonLat(x, y, zoom) {
    const scale = 256 * 2 ** zoom;
    const lon = (x / scale) * 360 - 180;
    const n = Math.PI - (2 * Math.PI * y) / scale;
    const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    return { lon, lat };
  }

  function project(lon, lat) {
    const rect = els.map.getBoundingClientRect();
    const centerWorld = lonLatToWorld(state.center.lon, state.center.lat, state.zoom);
    const point = lonLatToWorld(lon, lat, state.zoom);
    return {
      x: point.x - centerWorld.x + rect.width / 2,
      y: point.y - centerWorld.y + rect.height / 2
    };
  }

  function centroid(points) {
    return points.reduce(
      (acc, point) => ({ x: acc.x + point.x / points.length, y: acc.y + point.y / points.length }),
      { x: 0, y: 0 }
    );
  }

  function polygonCenter(polygon) {
    const center = polygon.reduce(
      (acc, point) => ({ lon: acc.lon + point[0] / polygon.length, lat: acc.lat + point[1] / polygon.length }),
      { lon: 0, lat: 0 }
    );
    return center;
  }

  function severityColor(value) {
    if (value >= 75) return "#8f1d18";
    if (value >= 55) return "#cf3f2f";
    if (value >= 30) return "#d19a1d";
    return "#0f8f61";
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(value);
  }

  init();
})();
