// =====================================================================
// URBAN HEAT ISLANDS IN SANTO ANDRÉ (SP, BRAZIL)
// Script 02 - Year 2026 (January to September), approximate rectangle
// Exploratory analysis. Superseded by scripts 03 and 04, which use
// the official IBGE municipal boundary.
// Run in the Google Earth Engine Code Editor: https://code.earthengine.google.com
// =====================================================================

// 1. STUDY AREA
// Approximate rectangle over the urban area of Santo André.
// Limitation: it also includes parts of neighbouring municipalities.
var area = ee.Geometry.Rectangle([-46.58, -23.72, -46.46, -23.60]);
Map.centerObject(area, 12);

// 2. CLOUD AND CLOUD-SHADOW MASK
// QA_PIXEL bit 3 = cloud, bit 4 = cloud shadow.
function maskClouds(img) {
  var qa = img.select('QA_PIXEL');
  var cloud = qa.bitwiseAnd(1 << 3).neq(0);
  var shadow = qa.bitwiseAnd(1 << 4).neq(0);
  return img.updateMask(cloud.or(shadow).not());
}

// 3. LAND SURFACE TEMPERATURE (°C) AND VEGETATION INDEX (NDVI)
function compute(img) {
  var temp = img.select('ST_B10')
    .multiply(0.00341802).add(149.0)   // official scale factors -> Kelvin
    .subtract(273.15)                  // Kelvin -> Celsius
    .rename('temp');
  var optical = img.select(['SR_B4', 'SR_B5'])
    .multiply(0.0000275).add(-0.2);    // official reflectance scale factors
  var ndvi = optical.normalizedDifference(['SR_B5', 'SR_B4']).rename('ndvi');
  return temp.addBands(ndvi).copyProperties(img, ['system:time_start']);
}

// 4. IMAGE COLLECTION: LANDSAT 8 + 9, YEAR 2026
// The end date is exclusive, so it is set to the day after the last day.
var l8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2');
var l9 = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2');

var collection = l8.merge(l9)
  .filterBounds(area)
  .filterDate('2026-01-01', '2026-09-29')
  .filter(ee.Filter.lt('CLOUD_COVER', 40))
  .map(maskClouds)
  .map(compute);

print('Number of images used:', collection.size());

// Median composite of all images in the period
var composite = collection.median().clip(area);

// 5. MAP LAYERS
Map.addLayer(composite.select('ndvi'),
  {min: 0, max: 0.7, palette: ['white', 'lightgreen', 'darkgreen']},
  'Vegetation (NDVI)', false);

Map.addLayer(composite.select('temp'),
  {min: 20, max: 40, palette: ['blue', 'cyan', 'yellow', 'orange', 'red']},
  'Land surface temperature (°C)');

// 6. SCATTER PLOT: NDVI vs LAND SURFACE TEMPERATURE
// 2,000 random pixels (30 m), fixed seed for reproducibility.
var sample = composite.sample({
  region: area,
  scale: 30,
  numPixels: 2000,
  seed: 42,
  geometries: false
});

var chart = ui.Chart.feature.byFeature(sample, 'ndvi', ['temp'])
  .setChartType('ScatterChart')
  .setOptions({
    title: 'NDVI vs Land Surface Temperature - Santo André (2026)',
    hAxis: {title: 'NDVI (vegetation)'},
    vAxis: {title: 'Land surface temperature (°C)'},
    pointSize: 2,
    legend: 'none'
  });
print(chart);

// 7. STATISTICS
// Pearson correlation (all sampled pixels)
var corr = sample.reduceColumns(ee.Reducer.pearsonsCorrelation(), ['ndvi', 'temp']);
print('Correlation NDVI vs temperature:', corr);

// Mean temperature by vegetation class (water, NDVI < 0, excluded)
var low = sample.filter(ee.Filter.and(ee.Filter.gte('ndvi', 0), ee.Filter.lt('ndvi', 0.2)));
var mid = sample.filter(ee.Filter.and(ee.Filter.gte('ndvi', 0.2), ee.Filter.lt('ndvi', 0.6)));
var high = sample.filter(ee.Filter.gte('ndvi', 0.6));

print('Low vegetation (NDVI 0-0.2) - mean temp (°C):', low.aggregate_mean('temp'));
print('Medium vegetation (NDVI 0.2-0.6) - mean temp (°C):', mid.aggregate_mean('temp'));
print('Dense vegetation (NDVI >= 0.6) - mean temp (°C):', high.aggregate_mean('temp'));

// 8. EXPORT TO GOOGLE DRIVE (optional; run it from the Tasks tab)
Export.image.toDrive({
  image: composite.select(['temp', 'ndvi']),
  description: 'urban_heat_santo_andre_2026_rectangle',
  region: area,
  scale: 30,
  maxPixels: 1e9
});

// 9. WHERE IS THE DENSE VEGETATION?
Map.setOptions('HYBRID');   // satellite basemap with street names

var dense = composite.select('ndvi').gte(0.6);
Map.addLayer(dense.selfMask(), {palette: ['magenta']}, 'Dense vegetation (NDVI >= 0.6)');

var denseArea = ee.Number(dense.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(), geometry: area, scale: 30, maxPixels: 1e9
}).get('ndvi'));
print('Dense vegetation (hectares):', denseArea.divide(10000));
print('Dense vegetation (% of study area):', denseArea.divide(area.area(1)).multiply(100));
