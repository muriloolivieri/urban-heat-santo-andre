# Research Log

A dated record of each step, result and methodological decision in the project.

---

## 2026-09-28

**Project choice.** Chose to study urban heat islands in Santo André. Reasons: the city does not appear to have a detailed public heat island map; the project needs few permissions; satellite analysis can start immediately, without equipment.

**Set-up.** Registered a non-commercial research project on Google Earth Engine (Community tier, category: Adaptation).

**Analysis 1 — Summers 2023–2026, approximate rectangle.**
Median composite of 49 Landsat 8/9 images (December–March). Clear negative relationship between NDVI and land surface temperature (r = −0.74). Low-vegetation areas averaged 39.3 °C and dense-vegetation areas 32.4 °C, a difference of about 7 °C.
*Observation:* the scatter plot is not linear. Temperature falls slowly up to NDVI ≈ 0.5 and then drops sharply. Hypothesis: dense vegetation, not scattered greenery, is what cools the city.
*Observation:* a few pixels with NDVI ≈ 0 and low temperature are probably water. Decision: exclude NDVI < 0 from the class means.
*Sample point:* a pixel on a street near my school showed 38.2 °C and NDVI 0.21 (summer composite), close to the medium-vegetation class average.

**Analysis 2 — Year 2026, approximate rectangle.**
Changed the period to January–September 2026 (30 images). The relationship holds, but is weaker (r = −0.56; difference of 4.1 °C). Interpretation: the cooling effect of vegetation is strongest in summer, when solar radiation is highest. The pattern "dense vegetation matters most" appeared again.
*Note:* values are much lower than in summer because the median now includes autumn and winter images. These are surface temperatures at ~10 a.m., not air temperatures.

**Validation of dense vegetation.** Mapped NDVI ≥ 0.6 pixels (12.2% of the rectangle) over a satellite basemap. They correspond mainly to parks and well-vegetated areas inside the city, so the comparison is relevant to where people live.

**Methodological refinement — official boundary.**
Problem identified: the rectangle includes parts of neighbouring municipalities (São Bernardo do Campo, Mauá, São Caetano do Sul, São Paulo). Downloaded the IBGE Malha Municipal 2025 (state of São Paulo), uploaded it to Earth Engine, and used the official boundary of Santo André intersected with the northern rectangle, to exclude the forested south of the municipality.

**Analysis 3 — Year 2026, official urban area.**
26 images, analysed area 6,764 ha. r = −0.55 (NDVI explains ≈ 30% of the variation). Low vegetation 28.3 °C, dense vegetation 25.0 °C (difference 3.2 °C). Dense vegetation covers 10.7% (≈ 721 ha) of the urban area.
*Comparison with Analysis 2:* removing neighbouring municipalities reduced the difference from 4.1 °C to 3.2 °C, suggesting that part of the coolest areas in the rectangle were outside Santo André. The main pattern did not change.
*Question for later:* what explains the remaining ~70% of the variation? Candidates: roof materials, building density, asphalt, elevation.

**Repository.** Published the scripts, results and this log on GitHub, with an MIT License for the code and CC BY 4.0 for text and results.

**Analysis 4 — Summers 2023–2026, official urban area.**
36 images. r = −0.71 (NDVI explains ≈ 50% of the variation). Low vegetation 39.3 °C, medium 38.3 °C, dense 33.2 °C: a difference of 6.1 °C.
*Comparison with Analysis 3 (same area, 2026):* the difference between low and dense vegetation almost doubles in summer (6.1 °C vs 3.2 °C). Vegetation cools the city most when heat is most dangerous.
*Comparison with Analysis 1 (same period, rectangle):* using the official boundary slightly reduced the difference (6.9 °C → 6.1 °C) and the correlation (−0.74 → −0.71), but the result remains strong.
*Consistent pattern, 4th time:* low → medium vegetation −0.9 °C; medium → dense vegetation −5.2 °C.
*Observation:* dense vegetation covers slightly more area in the summer composite (11.1%) than in the 2026 composite (10.7%), probably because vegetation is greener in the rainy season.

**Main finding so far:** in summer, areas of Santo André with dense vegetation are on average about 6 °C cooler at the surface than areas with little vegetation.

**Next steps:** find neighbourhood boundaries to rank neighbourhoods by temperature; plan the infrared thermometer experiment and the air temperature sensors for the summer.

---

## 2026-09-29

**Is the problem relevant?** Checked whether urban heat in Santo André is a current problem worth studying. Found: (1) a national Fiocruz/UFBA study (June 2026) associating about 120,000 deaths in Brazil (2000–2019) with heat waves, with the state of São Paulo having the highest absolute number; (2) Santo André's Civil Defence created a citizen climate monitoring network, which recorded differences of up to 7.5 °C in mean temperature between points in the city (January–July 2026). Conclusion: the topic is relevant; the contribution of this project is applying it to Santo André's neighbourhoods and linking it to tree planting.
*Caution:* the 7.5 °C compares an urban point with the forested water-protection area, so it is not only a heat-island effect. The warmest point in that network was in an urban park (Parque Erasmo Assunção), which goes against my results and deserves investigation.
*To do:* literature review (Google Scholar) for existing heat-island studies in the ABC region.

**Neighbourhood data.** Downloaded the IBGE 2022 Census neighbourhood file (`BR_bairros_CD2022`) and uploaded it to Earth Engine. Santo André has 113 neighbourhoods in this file. The file also contains Census counts; `v0001` = number of residents.

**Analysis 5 — all neighbourhoods, summer.** Vila Lucinda was the hottest (≈ 40.8 °C). The 10 coolest were all forest neighbourhoods in the south (≈ 26.5–28.4 °C, 94–100% dense vegetation). Decision: rank urban neighbourhoods separately.

**Data problem solved.** The script failed because one neighbourhood has "." instead of a number of residents (IBGE code for data that does not exist or cannot be released). Fixed the script to treat these values as missing: the neighbourhood stays in the temperature ranking but is excluded from population totals.

**Analysis 6 — 87 urban neighbourhoods + population, summer.**
- Correlation across urban neighbourhoods r = −0.83: vegetation explains ≈ 70% of the difference in temperature between neighbourhoods (more than at pixel level, because averaging a whole neighbourhood smooths out small details).
- Hottest: Vila Lucinda (40.8 °C, 1% dense vegetation). Coolest: Vila Guaraciaba (34.1 °C, 39% dense vegetation). Difference: 6.7 °C.
- The hottest 25% of neighbourhoods (22 neighbourhoods, ≥ 39.5 °C) are home to 153,695 people, more than one in five residents of the urban area. Dense vegetation covers only 0–5% of each of them.
- Candidate priorities (hot + many residents): Parque João Ramalho, Parque Capuava, Vila Palmares, Parque Oratório and Jardim Santa Cristina (the densest, with more than 28,000 residents per km² and 0% dense vegetation).

**Hypotheses to investigate later.**
1. *Vila Bastos* is among the coolest urban neighbourhoods (36.4 °C) with almost no dense vegetation (1%). Hypothesis: shade from tall buildings at the time of the satellite image (~10 a.m.).
2. *Heat and pollution:* neighbourhoods next to the Capuava petrochemical complex (Novo Homero Thon, Parque Capuava) are among the hottest, while the complex itself is not (it contains vegetated areas). Are some neighbourhoods exposed to both heat and air pollution? Not tested yet.
3. *Jardim Santo André (CDHU)* is dense (27,000 residents) but cool (35.0 °C, 31% dense vegetation): a possible positive example.

**Interpretation note.** Differences of 0.1–0.2 °C between neighbourhoods are within measurement uncertainty; present the hottest neighbourhoods as a group, not as an exact order.

**Next steps:** update the repository; contact the Civil Defence (with my teacher) about the monitoring network data; literature review; look for age data (older adults, children) by neighbourhood.

---
