# Results

All temperatures are Landsat **land surface temperatures** (°C), median composites, at the time of the satellite overpass (around 10 a.m. local time). Statistics are based on 2,000 random 30 m pixels (seed = 42). Water pixels (NDVI < 0) are excluded from the class means.

## Analysis 1 — Summers 2023–2026, approximate rectangle
*Script: `scripts/01_summer2023-2026_rectangle.js` · Run on 2026-09-28*

| Metric | Value |
|---|---|
| Images used | 49 |
| Pearson correlation (NDVI vs temperature) | −0.743 |
| p-value | < 0.001 (displayed as 0) |
| r² (share of variation explained by NDVI) | ≈ 0.55 |
| Mean temperature, low vegetation (NDVI 0–0.2) | 39.34 °C |
| Mean temperature, medium vegetation (NDVI 0.2–0.6) | 38.11 °C |
| Mean temperature, dense vegetation (NDVI ≥ 0.6) | 32.45 °C |
| Difference, low vs dense vegetation | 6.89 °C |

## Analysis 2 — Year 2026 (Jan–Sep), approximate rectangle
*Script: `scripts/02_year2026_rectangle.js` · Run on 2026-09-28*

| Metric | Value |
|---|---|
| Images used | 30 |
| Pearson correlation (NDVI vs temperature) | −0.561 |
| p-value | 2.36 × 10⁻¹⁶⁶ |
| r² | ≈ 0.31 |
| Mean temperature, low vegetation | 28.55 °C |
| Mean temperature, medium vegetation | 27.89 °C |
| Mean temperature, dense vegetation | 24.44 °C |
| Difference, low vs dense vegetation | 4.11 °C |
| Dense vegetation area | 1,985.7 ha |
| Dense vegetation, % of study area | 12.18% |

## Analysis 3 — Year 2026 (Jan–Sep), official urban area (IBGE boundary)
*Script: `scripts/03_year2026_ibge_boundary.js` · Run on 2026-09-28*

| Metric | Value |
|---|---|
| Municipalities matched in IBGE dataset | 1 |
| Images used | 26 |
| Pearson correlation (NDVI vs temperature) | −0.546 |
| p-value | 1.82 × 10⁻¹⁵⁵ |
| r² | ≈ 0.30 |
| Mean temperature, low vegetation | 28.28 °C |
| Mean temperature, medium vegetation | 27.69 °C |
| Mean temperature, dense vegetation | 25.04 °C |
| Difference, low vs dense vegetation | 3.24 °C |
| Analysed area | 6,764.4 ha |
| Dense vegetation area | 720.7 ha |
| Dense vegetation, % of analysed area | 10.65% |

## Analysis 4 — Summers 2023–2026, official urban area (IBGE boundary)
*Script: `scripts/04_summer2023-2026_ibge_boundary.js` · Pending*

| Metric | Value |
|---|---|
| Images used | |
| Pearson correlation (NDVI vs temperature) | |
| p-value | |
| r² | |
| Mean temperature, low vegetation | |
| Mean temperature, medium vegetation | |
| Mean temperature, dense vegetation | |
| Difference, low vs dense vegetation | |
| Analysed area | |
| Dense vegetation area | |
| Dense vegetation, % of analysed area | |

## Comparison

| | Analysis 1 | Analysis 2 | Analysis 3 | Analysis 4 |
|---|---|---|---|---|
| Period | Summers 2023–26 | 2026 | 2026 | Summers 2023–26 |
| Area | Rectangle | Rectangle | Official urban | Official urban |
| r | −0.74 | −0.56 | −0.55 | |
| Low → medium vegetation | −1.23 °C | −0.66 °C | −0.59 °C | |
| Medium → dense vegetation | −5.66 °C | −3.45 °C | −2.65 °C | |
| Low → dense vegetation | −6.89 °C | −4.11 °C | −3.24 °C | |

**Consistent pattern:** in all analyses, most of the cooling happens between medium and dense vegetation, not between low and medium vegetation.
