# Urban Heat Islands in Santo André, Brazil

**Mapping land surface temperature and vegetation with satellite data to identify priority areas for urban tree planting.**

Santo André is a city of the São Paulo metropolitan area (Brazil). This independent research project uses free Landsat 8 and 9 satellite imagery and Google Earth Engine to measure how much hotter the city's less vegetated areas are, and where new trees would bring the greatest cooling benefit.

> Status: in progress (started September 2026). Ground-based air temperature measurements are planned for the 2026–2027 summer.

## Research question

Which urban areas of Santo André have the highest land surface temperatures in summer, and how much does the presence of vegetation explain these differences?

## Data

| Dataset | Source | Use |
|---|---|---|
| Landsat 8 and 9, Collection 2, Level 2 (`LANDSAT/LC08/C02/T1_L2`, `LANDSAT/LC09/C02/T1_L2`) | USGS / NASA, via Google Earth Engine | Land surface temperature (band `ST_B10`) and NDVI (bands `SR_B4`, `SR_B5`) |
| Malha Municipal 2025, state of São Paulo (`SP_Municipios_2025`) | IBGE, Brazilian Institute of Geography and Statistics | Official municipal boundary of Santo André |

## Methods

1. **Study area.** The official IBGE boundary of Santo André, intersected with a rectangle over the northern part of the municipality. The southern part (Paranapiacaba and the Serra do Mar) is almost entirely forest and was excluded so that it would not dominate the results. Analysed area: about 6,764 ha.
2. **Image processing.** Clouds and cloud shadows were masked using the `QA_PIXEL` band (bits 3 and 4). Scenes with more than 40% cloud cover were discarded. Official scale factors were applied to convert band values to degrees Celsius (temperature) and surface reflectance (NDVI).
3. **Composites.** A median composite was calculated for each period analysed (summer months 2023–2026, and the year 2026).
4. **Sampling and statistics.** 2,000 random 30 m pixels were sampled (fixed seed = 42). For each sample, the Pearson correlation between NDVI and land surface temperature was calculated, as well as the mean temperature in three vegetation classes: low (NDVI 0–0.2), medium (0.2–0.6) and dense (≥ 0.6). Water pixels (NDVI < 0) were excluded from the class means.
5. **Validation of dense vegetation areas.** Pixels with NDVI ≥ 0.6 were mapped over a satellite basemap and inspected visually to check whether they correspond to urban parks or to forest outside the city.

## Main results so far

| Analysis | Images | Correlation (r) | Low veg. | Medium veg. | Dense veg. | Difference |
|---|---|---|---|---|---|---|
| Summers 2023–2026, rectangle | 49 | −0.74 | 39.3 °C | 38.1 °C | 32.4 °C | 6.9 °C |
| Year 2026, rectangle | 30 | −0.56 | 28.5 °C | 27.9 °C | 24.4 °C | 4.1 °C |
| Year 2026, official urban area | 26 | −0.55 | 28.3 °C | 27.7 °C | 25.0 °C | 3.2 °C |
| **Summers 2023–2026, official urban area** | **36** | **−0.71** | **39.3 °C** | **38.3 °C** | **33.2 °C** | **6.1 °C** |

Temperatures are **land surface temperatures** at the time of the Landsat overpass (around 10 a.m. local time). Full results are in [`results/results.md`](results/results.md).

**Key findings**

- **In summer, areas of Santo André with dense vegetation are on average about 6 °C cooler at the surface than areas with little vegetation** (official urban area, summers 2023–2026).
- The effect is strongest when heat is most dangerous: in summer, NDVI explains about 50% of the variation in surface temperature (r = −0.71, p < 0.001), against about 30% over 2026 (r = −0.55), and the temperature difference is almost twice as large (6.1 °C vs 3.2 °C).
- **Dense vegetation matters most.** In all four analyses, moving from low to medium vegetation lowered the mean temperature by only about 0.6–1.2 °C, while moving from medium to dense vegetation lowered it by about 2.7–5.7 °C.
- Dense vegetation covers only about 11% (≈ 720–750 ha) of the analysed urban area, and it corresponds mainly to parks and well-vegetated areas within the city.

## Limitations

- Landsat measures **land surface** temperature, not air temperature, and only at about 10 a.m. Afternoon and night-time heat are not captured. Ground-based air temperature sensors are planned to address this.
- The thermal band has a coarser native resolution than 30 m, so small features such as single trees are not resolved.
- Correlation does not imply causation. Areas with little vegetation also tend to have more asphalt, dark roofs and dense buildings.
- Neighbouring pixels are not fully independent (spatial autocorrelation), which makes p-values look stronger than they would be for independent observations.
- The correlation was calculated using all sampled pixels, including a few water pixels (NDVI < 0), which were only excluded from the class means.
- The 2026 analysis covers January to September only, so it contains more cool-season images than a full year would.

## How to reproduce

1. Create a free, non-commercial Google Earth Engine account at [earthengine.google.com](https://earthengine.google.com).
2. For scripts 03 and 04, download `SP_Municipios_2025.zip` from the [IBGE download server](https://geoftp.ibge.gov.br/organizacao_do_territorio/malhas_territoriais/malhas_municipais/municipio_2025/UFs/SP/), upload it as a table asset in the Earth Engine Code Editor (Assets → New → Shape files), and replace the asset path at the top of the script.
3. Paste a script from the [`scripts`](scripts) folder into the [Code Editor](https://code.earthengine.google.com) and click **Run**.

## Repository structure

```
scripts/
  01_summer2023-2026_rectangle.js      first exploratory analysis
  02_year2026_rectangle.js             year 2026 + dense vegetation map
  03_year2026_ibge_boundary.js         year 2026, official urban area (current)
  04_summer2023-2026_ibge_boundary.js  summers, official urban area (current)
results/
  results.md                           full numerical results
research-log/
  research_log.md                      dated record of every step and decision
```

## Next steps

- Calculate the mean temperature of each neighbourhood and rank the hottest ones.
- Install low-cost air temperature sensors in different neighbourhoods during the 2026–2027 summer and compare them with the satellite data.
- Measure surface temperatures of different materials (asphalt, concrete, grass, tree shade) with an infrared thermometer.
- Produce a priority map for urban tree planting and share it with the city government.

## Author

*[Murilo Pinho Olivieri]* — independent student research project, Santo André, Brazil.

## License

Code: [MIT License](LICENSE). Text, figures and results: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
