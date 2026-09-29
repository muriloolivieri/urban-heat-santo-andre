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
*Script: `scripts/04_summer2023-2026_ibge_boundary.js` · Run on 2026-09-28 · **Main result of the project so far***

| Metric | Value |
|---|---|
| Municipalities matched in IBGE dataset | 1 |
| Images used | 36 |
| Pearson correlation (NDVI vs temperature) | −0.705 |
| p-value | 1.19 × 10⁻³⁰⁰ |
| r² | ≈ 0.50 |
| Mean temperature, low vegetation | 39.26 °C |
| Mean temperature, medium vegetation | 38.33 °C |
| Mean temperature, dense vegetation | 33.18 °C |
| Difference, low vs dense vegetation | 6.09 °C |
| Analysed area | 6,764.4 ha |
| Dense vegetation area | 754.2 ha |
| Dense vegetation, % of analysed area | 11.15% |

## Comparison

| | Analysis 1 | Analysis 2 | Analysis 3 | Analysis 4 |
|---|---|---|---|---|
| Period | Summers 2023–26 | 2026 | 2026 | Summers 2023–26 |
| Area | Rectangle | Rectangle | Official urban | Official urban |
| r | −0.74 | −0.56 | −0.55 | −0.71 |
| Low → medium vegetation | −1.23 °C | −0.66 °C | −0.59 °C | −0.93 °C |
| Medium → dense vegetation | −5.66 °C | −3.45 °C | −2.65 °C | −5.15 °C |
| Low → dense vegetation | −6.89 °C | −4.11 °C | −3.24 °C | −6.09 °C |

**Consistent pattern:** in all analyses, most of the cooling happens between medium and dense vegetation, not between low and medium vegetation.

**Seasonal effect (official urban area, Analyses 3 and 4):** the difference between low and dense vegetation is 6.1 °C in summer, almost twice the 3.2 °C observed over 2026, and NDVI explains about 50% of the variation in summer against about 30% over the year.

---

## Analysis 5 — All 113 neighbourhoods, summers 2023–2026
*Script: `scripts/05_neighbourhood_ranking_summer.js` · Run on 2026-09-29 · Superseded by Analysis 6*

IBGE 2022 Census neighbourhood boundaries; mean values per neighbourhood; 49 images.

The hottest neighbourhood was Vila Lucinda (≈ 40.8 °C). The 10 coolest were all in the forested water-protection area in the south of the municipality:

| Neighbourhood | Surface temp. (°C) | Mean NDVI | Dense vegetation (%) | Area (km²) |
|---|---|---|---|---|
| Rio Grande | 26.5 | 0.87 | 100 | 11.04 |
| Araçaúva | 26.8 | 0.87 | 100 | 4.77 |
| Waisberg II | 27.4 | 0.85 | 99 | 1.84 |
| Sítio dos Teco | 27.4 | 0.84 | 98 | 0.70 |
| Jardim Joaquim Eugênio de Lima | 27.8 | 0.86 | 100 | 5.61 |
| Parque do Pedroso | 28.0 | 0.83 | 97 | 8.87 |
| Três Divisas | 28.0 | 0.84 | 97 | 1.01 |
| Rio Bonito | 28.1 | 0.86 | 100 | 5.41 |
| Sítio Taquaral | 28.3 | 0.78 | 94 | 0.58 |
| Waisberg I | 28.4 | 0.84 | 100 | 0.13 |

Because these are forest areas, Analysis 6 repeats the ranking using urban neighbourhoods only.

## Analysis 6 — 87 urban neighbourhoods + population, summers 2023–2026
*Script: `scripts/06_urban_neighbourhood_ranking_population.js` · Run on 2026-09-29 · **Current neighbourhood analysis***

Urban neighbourhoods = neighbourhoods whose centre lies inside the northern urban area used in Analyses 3 and 4. Population = residents in the 2022 Census (`v0001`). 49 images.

| Metric | Value |
|---|---|
| Neighbourhoods in Santo André / urban neighbourhoods analysed | 113 / 87 |
| Correlation across urban neighbourhoods (mean NDVI vs mean temperature) | −0.833 |
| p-value | 1.47 × 10⁻²³ |
| r² | ≈ 0.69 |
| Hottest urban neighbourhood | Vila Lucinda, 40.8 °C |
| Coolest urban neighbourhood | Vila Guaraciaba, 34.1 °C |
| Difference | 6.7 °C |
| Threshold for the hottest 25% | 39.5 °C |
| Neighbourhoods in the hottest 25% | 22 |
| Residents in the hottest 25% | 153,695 |
| Residents in all urban neighbourhoods analysed | 712,855 |
| Share of urban residents in the hottest 25% | ≈ 21.6% |
| Urban neighbourhoods without population data | 1 (Pólo Petroquímico de Capuava) |

### 10 hottest urban neighbourhoods

| Neighbourhood | Surface temp. (°C) | Mean NDVI | Dense vegetation (%) | Residents | Residents per km² |
|---|---|---|---|---|---|
| Vila Lucinda | 40.8 | 0.22 | 1 | 7,292 | 12,183 |
| Novo Homero Thon | 40.4 | 0.26 | 4 | 4,356 | 2,835 |
| Vila Guarani | 40.3 | 0.25 | 2 | 3,261 | 12,844 |
| Jardim Guarará | 40.3 | 0.24 | 0 | 5,486 | 13,851 |
| Parque Oratório | 40.2 | 0.20 | 1 | 11,886 | 11,159 |
| Vila Scarpelli | 40.2 | 0.21 | 1 | 7,307 | 12,283 |
| Jardim Santa Cristina | 40.2 | 0.21 | 0 | 10,148 | 28,577 |
| Jardim Bom Pastor | 40.0 | 0.25 | 5 | 5,563 | 8,066 |
| Centreville | 40.0 | 0.20 | 0 | 5,138 | 17,782 |
| Jardim Santo Antônio | 39.9 | 0.20 | 0 | 8,956 | 11,315 |

### 10 coolest urban neighbourhoods

| Neighbourhood | Surface temp. (°C) | Mean NDVI | Dense vegetation (%) | Residents | Residents per km² |
|---|---|---|---|---|---|
| Vila Guaraciaba | 34.1 | 0.48 | 39 | 5,664 | 5,835 |
| Jardim Santo André CDHU | 35.0 | 0.46 | 31 | 27,028 | 17,512 |
| Cidade São Jorge | 35.1 | 0.44 | 33 | 13,149 | 8,919 |
| Jardim Cipreste | 35.2 | 0.43 | 26 | 7,311 | 16,349 |
| Condomínio Maracanã | 36.0 | 0.37 | 18 | 12,435 | 14,706 |
| Jardim Las Vegas | 36.0 | 0.45 | 36 | 11,978 | 10,030 |
| Jardim Alzira Franco | 36.1 | 0.41 | 24 | 7,602 | 9,423 |
| Vila Bastos | 36.4 | 0.28 | 1 | 4,441 | 13,663 |
| Pólo Petroquímico de Capuava | 36.4 | 0.42 | 24 | — | — |
| Paraíso | 36.5 | 0.47 | 38 | 3,426 | 4,263 |

### Hottest 25%: the 10 neighbourhoods with the most residents (candidate priorities)

| Neighbourhood | Surface temp. (°C) | Mean NDVI | Dense vegetation (%) | Residents | Residents per km² |
|---|---|---|---|---|---|
| Parque João Ramalho | 39.5 | 0.22 | 1 | 17,735 | 18,029 |
| Parque Capuava | 39.5 | 0.27 | 5 | 13,414 | 14,907 |
| Vila Palmares | 39.6 | 0.20 | 0 | 12,968 | 14,463 |
| Parque Oratório | 40.2 | 0.20 | 1 | 11,886 | 11,159 |
| Jardim Santa Cristina | 40.2 | 0.21 | 0 | 10,148 | 28,577 |
| Jardim Santo Antônio | 39.9 | 0.20 | 0 | 8,956 | 11,315 |
| Vila Scarpelli | 40.2 | 0.21 | 1 | 7,307 | 12,283 |
| Vila Lucinda | 40.8 | 0.22 | 1 | 7,292 | 12,183 |
| Vila Sacadura Cabral | 39.7 | 0.20 | 0 | 6,615 | 14,548 |
| Jardim Santo Alberto | 39.8 | 0.22 | 2 | 6,154 | 12,967 |

**Notes.** Differences of a few tenths of a degree are within measurement uncertainty. Temperatures are land surface temperatures at about 10 a.m. Neighbourhood limits follow IBGE and may differ from local usage.
