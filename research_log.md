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

**Next step:** run Analysis 4 (summers, official urban area) to compare directly with Analysis 1.

---
