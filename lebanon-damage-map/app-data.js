window.LEBANON_DAMAGE_DATA = {
  generatedAt: "2026-04-17T12:00:00-07:00",
  dates: [
    { id: "2023-10-15", label: "Oct 15, 2023", description: "Pre-escalation baseline window" },
    { id: "2024-06-01", label: "Jun 1, 2024", description: "Early recurring border-impact window" },
    { id: "2024-09-25", label: "Sep 25, 2024", description: "High-intensity escalation window" },
    { id: "2024-10-10", label: "Oct 10, 2024", description: "Expanded strike-impact window" },
    { id: "2024-11-05", label: "Nov 5, 2024", description: "Post-event assessment image window" },
    { id: "2025-01-15", label: "Jan 15, 2025", description: "Follow-up monitoring window" },
    { id: "2026-04-18", label: "Apr 18, 2026", description: "Latest timeline marker using last available inference" }
  ],
  neighborhoods: [
    {
      id: "dahiyeh",
      name: "Dahiyeh",
      region: "beirut",
      source: "Sentinel-1 SAR + Sentinel-2 optical",
      polygon: [
        [35.478, 33.872],
        [35.518, 33.878],
        [35.536, 33.852],
        [35.512, 33.827],
        [35.466, 33.836],
        [35.456, 33.858]
      ],
      series: [
        { date: "2023-10-15", severity: 4, probability: 0.06, confidence: 0.72, buildings: 18 },
        { date: "2024-06-01", severity: 9, probability: 0.12, confidence: 0.7, buildings: 43 },
        { date: "2024-09-25", severity: 42, probability: 0.55, confidence: 0.68, buildings: 620 },
        { date: "2024-10-10", severity: 71, probability: 0.78, confidence: 0.74, buildings: 1240 },
        { date: "2024-11-05", severity: 82, probability: 0.86, confidence: 0.79, buildings: 1510 },
        { date: "2025-01-15", severity: 76, probability: 0.81, confidence: 0.76, buildings: 1430 }
      ]
    },
    {
      id: "haret-hreik",
      name: "Haret Hreik",
      region: "beirut",
      source: "Sentinel-1 SAR + analyst labels",
      polygon: [
        [35.506, 33.864],
        [35.528, 33.864],
        [35.535, 33.847],
        [35.518, 33.838],
        [35.498, 33.848]
      ],
      series: [
        { date: "2023-10-15", severity: 3, probability: 0.05, confidence: 0.76, buildings: 7 },
        { date: "2024-06-01", severity: 8, probability: 0.1, confidence: 0.72, buildings: 20 },
        { date: "2024-09-25", severity: 48, probability: 0.61, confidence: 0.68, buildings: 420 },
        { date: "2024-10-10", severity: 79, probability: 0.84, confidence: 0.73, buildings: 890 },
        { date: "2024-11-05", severity: 87, probability: 0.9, confidence: 0.79, buildings: 980 },
        { date: "2025-01-15", severity: 81, probability: 0.85, confidence: 0.77, buildings: 950 }
      ]
    },
    {
      id: "ghobeiry",
      name: "Ghobeiry",
      region: "beirut",
      source: "Sentinel-2 optical + building footprints",
      polygon: [
        [35.482, 33.86],
        [35.503, 33.852],
        [35.497, 33.83],
        [35.467, 33.825],
        [35.452, 33.846]
      ],
      series: [
        { date: "2023-10-15", severity: 2, probability: 0.04, confidence: 0.71, buildings: 5 },
        { date: "2024-06-01", severity: 6, probability: 0.08, confidence: 0.68, buildings: 16 },
        { date: "2024-09-25", severity: 35, probability: 0.46, confidence: 0.66, buildings: 280 },
        { date: "2024-10-10", severity: 60, probability: 0.68, confidence: 0.7, buildings: 610 },
        { date: "2024-11-05", severity: 68, probability: 0.74, confidence: 0.74, buildings: 720 },
        { date: "2025-01-15", severity: 63, probability: 0.7, confidence: 0.72, buildings: 690 }
      ]
    },
    {
      id: "bint-jbeil",
      name: "Bint Jbeil",
      region: "south",
      source: "Sentinel-1 SAR coherence proxy",
      polygon: [
        [35.38, 33.14],
        [35.45, 33.15],
        [35.47, 33.105],
        [35.418, 33.078],
        [35.35, 33.1]
      ],
      series: [
        { date: "2023-10-15", severity: 7, probability: 0.09, confidence: 0.73, buildings: 38 },
        { date: "2024-06-01", severity: 36, probability: 0.46, confidence: 0.71, buildings: 310 },
        { date: "2024-09-25", severity: 66, probability: 0.72, confidence: 0.77, buildings: 760 },
        { date: "2024-10-10", severity: 78, probability: 0.82, confidence: 0.8, buildings: 980 },
        { date: "2024-11-05", severity: 84, probability: 0.87, confidence: 0.82, buildings: 1090 },
        { date: "2025-01-15", severity: 80, probability: 0.84, confidence: 0.79, buildings: 1055 }
      ]
    },
    {
      id: "nabatieh",
      name: "Nabatieh",
      region: "south",
      source: "Sentinel-2 optical + SAR change",
      polygon: [
        [35.43, 33.41],
        [35.515, 33.42],
        [35.545, 33.365],
        [35.49, 33.33],
        [35.405, 33.355]
      ],
      series: [
        { date: "2023-10-15", severity: 5, probability: 0.07, confidence: 0.76, buildings: 22 },
        { date: "2024-06-01", severity: 24, probability: 0.33, confidence: 0.73, buildings: 180 },
        { date: "2024-09-25", severity: 56, probability: 0.65, confidence: 0.75, buildings: 640 },
        { date: "2024-10-10", severity: 69, probability: 0.76, confidence: 0.78, buildings: 840 },
        { date: "2024-11-05", severity: 75, probability: 0.81, confidence: 0.8, buildings: 920 },
        { date: "2025-01-15", severity: 72, probability: 0.78, confidence: 0.77, buildings: 890 }
      ]
    },
    {
      id: "sour",
      name: "Sour",
      region: "south",
      source: "Sentinel-2 optical",
      polygon: [
        [35.13, 33.31],
        [35.235, 33.305],
        [35.255, 33.245],
        [35.18, 33.205],
        [35.095, 33.238]
      ],
      series: [
        { date: "2023-10-15", severity: 3, probability: 0.05, confidence: 0.7, buildings: 12 },
        { date: "2024-06-01", severity: 17, probability: 0.24, confidence: 0.67, buildings: 115 },
        { date: "2024-09-25", severity: 41, probability: 0.5, confidence: 0.7, buildings: 430 },
        { date: "2024-10-10", severity: 52, probability: 0.61, confidence: 0.72, buildings: 560 },
        { date: "2024-11-05", severity: 58, probability: 0.66, confidence: 0.73, buildings: 630 },
        { date: "2025-01-15", severity: 55, probability: 0.63, confidence: 0.71, buildings: 610 }
      ]
    },
    {
      id: "marjayoun",
      name: "Marjayoun",
      region: "south",
      source: "Sentinel-1 SAR",
      polygon: [
        [35.53, 33.38],
        [35.66, 33.385],
        [35.7, 33.31],
        [35.62, 33.265],
        [35.51, 33.29]
      ],
      series: [
        { date: "2023-10-15", severity: 8, probability: 0.11, confidence: 0.72, buildings: 42 },
        { date: "2024-06-01", severity: 31, probability: 0.4, confidence: 0.71, buildings: 240 },
        { date: "2024-09-25", severity: 58, probability: 0.67, confidence: 0.75, buildings: 590 },
        { date: "2024-10-10", severity: 67, probability: 0.74, confidence: 0.78, buildings: 710 },
        { date: "2024-11-05", severity: 73, probability: 0.79, confidence: 0.79, buildings: 780 },
        { date: "2025-01-15", severity: 70, probability: 0.76, confidence: 0.76, buildings: 750 }
      ]
    },
    {
      id: "saida",
      name: "Saida",
      region: "south",
      source: "Sentinel-2 optical",
      polygon: [
        [35.32, 33.585],
        [35.41, 33.59],
        [35.43, 33.535],
        [35.36, 33.505],
        [35.3, 33.535]
      ],
      series: [
        { date: "2023-10-15", severity: 2, probability: 0.04, confidence: 0.71, buildings: 8 },
        { date: "2024-06-01", severity: 5, probability: 0.08, confidence: 0.69, buildings: 19 },
        { date: "2024-09-25", severity: 18, probability: 0.28, confidence: 0.67, buildings: 130 },
        { date: "2024-10-10", severity: 26, probability: 0.36, confidence: 0.68, buildings: 210 },
        { date: "2024-11-05", severity: 30, probability: 0.4, confidence: 0.7, buildings: 245 },
        { date: "2025-01-15", severity: 28, probability: 0.38, confidence: 0.68, buildings: 230 }
      ]
    },
    {
      id: "baalbek",
      name: "Baalbek",
      region: "bekaa",
      source: "Sentinel-1 SAR + Sentinel-2 optical",
      polygon: [
        [36.08, 34.05],
        [36.245, 34.06],
        [36.27, 33.97],
        [36.17, 33.91],
        [36.03, 33.955]
      ],
      series: [
        { date: "2023-10-15", severity: 3, probability: 0.05, confidence: 0.72, buildings: 14 },
        { date: "2024-06-01", severity: 10, probability: 0.15, confidence: 0.69, buildings: 64 },
        { date: "2024-09-25", severity: 38, probability: 0.49, confidence: 0.7, buildings: 390 },
        { date: "2024-10-10", severity: 57, probability: 0.66, confidence: 0.73, buildings: 620 },
        { date: "2024-11-05", severity: 64, probability: 0.72, confidence: 0.76, buildings: 700 },
        { date: "2025-01-15", severity: 62, probability: 0.7, confidence: 0.74, buildings: 680 }
      ]
    },
    {
      id: "zahle",
      name: "Zahle",
      region: "bekaa",
      source: "Sentinel-2 optical",
      polygon: [
        [35.82, 33.885],
        [35.95, 33.895],
        [35.975, 33.82],
        [35.885, 33.775],
        [35.785, 33.815]
      ],
      series: [
        { date: "2023-10-15", severity: 1, probability: 0.03, confidence: 0.7, buildings: 5 },
        { date: "2024-06-01", severity: 3, probability: 0.06, confidence: 0.67, buildings: 12 },
        { date: "2024-09-25", severity: 13, probability: 0.2, confidence: 0.66, buildings: 78 },
        { date: "2024-10-10", severity: 20, probability: 0.3, confidence: 0.67, buildings: 140 },
        { date: "2024-11-05", severity: 23, probability: 0.33, confidence: 0.69, buildings: 165 },
        { date: "2025-01-15", severity: 22, probability: 0.32, confidence: 0.67, buildings: 158 }
      ]
    },
    {
      id: "hermel",
      name: "Hermel",
      region: "bekaa",
      source: "Sentinel-1 SAR",
      polygon: [
        [36.28, 34.46],
        [36.44, 34.47],
        [36.48, 34.36],
        [36.36, 34.31],
        [36.24, 34.36]
      ],
      series: [
        { date: "2023-10-15", severity: 1, probability: 0.03, confidence: 0.69, buildings: 4 },
        { date: "2024-06-01", severity: 5, probability: 0.08, confidence: 0.66, buildings: 21 },
        { date: "2024-09-25", severity: 20, probability: 0.31, confidence: 0.68, buildings: 135 },
        { date: "2024-10-10", severity: 31, probability: 0.43, confidence: 0.69, buildings: 230 },
        { date: "2024-11-05", severity: 36, probability: 0.48, confidence: 0.72, buildings: 280 },
        { date: "2025-01-15", severity: 34, probability: 0.46, confidence: 0.7, buildings: 268 }
      ]
    },
    {
      id: "aley",
      name: "Aley",
      region: "beirut",
      source: "Sentinel-2 optical",
      polygon: [
        [35.55, 33.83],
        [35.675, 33.84],
        [35.69, 33.775],
        [35.61, 33.735],
        [35.515, 33.77]
      ],
      series: [
        { date: "2023-10-15", severity: 1, probability: 0.03, confidence: 0.69, buildings: 5 },
        { date: "2024-06-01", severity: 2, probability: 0.05, confidence: 0.65, buildings: 9 },
        { date: "2024-09-25", severity: 11, probability: 0.18, confidence: 0.64, buildings: 58 },
        { date: "2024-10-10", severity: 17, probability: 0.25, confidence: 0.66, buildings: 98 },
        { date: "2024-11-05", severity: 20, probability: 0.29, confidence: 0.68, buildings: 120 },
        { date: "2025-01-15", severity: 19, probability: 0.28, confidence: 0.66, buildings: 116 }
      ]
    },
    {
      id: "kiryat-shmona",
      name: "Kiryat Shmona",
      region: "israel",
      source: "Sentinel-1 SAR + Sentinel-2 optical",
      polygon: [
        [35.535, 33.235],
        [35.6, 33.235],
        [35.615, 33.18],
        [35.565, 33.155],
        [35.515, 33.185]
      ],
      series: [
        { date: "2023-10-15", severity: 2, probability: 0.04, confidence: 0.72, buildings: 7 },
        { date: "2024-06-01", severity: 10, probability: 0.15, confidence: 0.69, buildings: 42 },
        { date: "2024-09-25", severity: 22, probability: 0.31, confidence: 0.68, buildings: 105 },
        { date: "2024-10-10", severity: 29, probability: 0.39, confidence: 0.7, buildings: 150 },
        { date: "2024-11-05", severity: 34, probability: 0.45, confidence: 0.71, buildings: 190 },
        { date: "2025-01-15", severity: 31, probability: 0.42, confidence: 0.7, buildings: 174 }
      ]
    },
    {
      id: "metula",
      name: "Metula",
      region: "israel",
      source: "Sentinel-1 SAR coherence proxy",
      polygon: [
        [35.548, 33.292],
        [35.596, 33.295],
        [35.61, 33.262],
        [35.574, 33.242],
        [35.535, 33.26]
      ],
      series: [
        { date: "2023-10-15", severity: 3, probability: 0.05, confidence: 0.7, buildings: 8 },
        { date: "2024-06-01", severity: 13, probability: 0.19, confidence: 0.68, buildings: 38 },
        { date: "2024-09-25", severity: 28, probability: 0.38, confidence: 0.7, buildings: 96 },
        { date: "2024-10-10", severity: 36, probability: 0.48, confidence: 0.72, buildings: 128 },
        { date: "2024-11-05", severity: 42, probability: 0.54, confidence: 0.73, buildings: 150 },
        { date: "2025-01-15", severity: 39, probability: 0.51, confidence: 0.72, buildings: 142 }
      ]
    },
    {
      id: "nahariya",
      name: "Nahariya",
      region: "israel",
      source: "Sentinel-2 optical + event context",
      polygon: [
        [35.045, 33.035],
        [35.13, 33.035],
        [35.145, 32.98],
        [35.09, 32.955],
        [35.025, 32.982]
      ],
      series: [
        { date: "2023-10-15", severity: 1, probability: 0.03, confidence: 0.72, buildings: 5 },
        { date: "2024-06-01", severity: 5, probability: 0.08, confidence: 0.68, buildings: 20 },
        { date: "2024-09-25", severity: 12, probability: 0.18, confidence: 0.66, buildings: 68 },
        { date: "2024-10-10", severity: 17, probability: 0.25, confidence: 0.67, buildings: 98 },
        { date: "2024-11-05", severity: 21, probability: 0.3, confidence: 0.69, buildings: 130 },
        { date: "2025-01-15", severity: 20, probability: 0.29, confidence: 0.68, buildings: 122 }
      ]
    },
    {
      id: "safed",
      name: "Safed",
      region: "israel",
      source: "Sentinel-2 optical",
      polygon: [
        [35.445, 32.99],
        [35.545, 32.995],
        [35.565, 32.93],
        [35.5, 32.895],
        [35.425, 32.925]
      ],
      series: [
        { date: "2023-10-15", severity: 1, probability: 0.03, confidence: 0.71, buildings: 4 },
        { date: "2024-06-01", severity: 4, probability: 0.07, confidence: 0.67, buildings: 16 },
        { date: "2024-09-25", severity: 10, probability: 0.15, confidence: 0.66, buildings: 54 },
        { date: "2024-10-10", severity: 14, probability: 0.21, confidence: 0.67, buildings: 84 },
        { date: "2024-11-05", severity: 16, probability: 0.24, confidence: 0.68, buildings: 100 },
        { date: "2025-01-15", severity: 15, probability: 0.23, confidence: 0.67, buildings: 92 }
      ]
    }
  ],
  events: [
    { id: "evt-1", date: "2024-09-25", label: "Reported strike cluster", lon: 35.515, lat: 33.854, intensity: 0.85 },
    { id: "evt-2", date: "2024-10-10", label: "Reported urban impact", lon: 35.414, lat: 33.115, intensity: 0.78 },
    { id: "evt-3", date: "2024-10-10", label: "Reported southern impact", lon: 35.49, lat: 33.375, intensity: 0.72 },
    { id: "evt-4", date: "2024-11-05", label: "Reported Bekaa impact", lon: 36.17, lat: 34.005, intensity: 0.65 },
    { id: "evt-5", date: "2024-11-05", label: "Reported border impact", lon: 35.61, lat: 33.325, intensity: 0.69 }
  ]
};
