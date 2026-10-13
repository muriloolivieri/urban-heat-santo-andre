// =====================================================================
// URBAN HEAT ISLANDS IN SANTO ANDRÉ (SP, BRAZIL)
// Script 07 - Build a machine learning dataset
// Samples pixels in the official urban area (summers 2023-2026) with the
// target (land surface temperature) and several explanatory features,
// then exports them as a CSV file to Google Drive.
// Run in the Google Earth Engine Code Editor: https://code.earthengine.google.com
// =====================================================================

// 1. STUDY AREA: OFFICIAL URBAN AREA (same as scripts 03 and 04)
var municipalities = ee.FeatureCollection('projects/calor-urbano-510100/assets/SP_Municipios_2025');
var santoAndre = municipalities.filter(ee.Filter.eq('NM_MUN', 'Santo André'));
var northRectangle = ee.Geometry.Rectangle([-46.58, -23.72, -46.46, -23.60]);
var area = santoAndre.geometry().intersection(northRectangle, 1);
Map.centerObject(area, 12);

// 2. CLOUD AND CLOUD-SHADOW MASK (QA_PIXEL bit 3 = cloud, bit 4 = shadow)
function maskClouds(img) {
  var qa = img.select('QA_PIXEL');
  var cloud = qa.bitwiseAnd(1 << 3).neq(0);
  var shadow = qa.bitwiseAnd(1 << 4).neq(0);
  return img.updateMask(cloud.or(shadow).not());
}

// 3. LANDSAT VARIABLES
function compute(img) {
  // Target: land surface temperature (°C)
  var temp = img.select('ST_B10')
    .multiply(0.00341802).add(149.0).subtract(273.15)
    .rename('temp');

  // Surface reflectance (official scale factors)
  var sr = img.select(['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'])
    .multiply(0.0000275).add(-0.2);

  // NDVI: vegetation (NIR vs red)
  var ndvi = sr.normalizedDifference(['SR_B5', 'SR_B4']).rename('ndvi');
  // NDBI: built-up surfaces (SWIR1 vs NIR)
  var ndbi = sr.normalizedDifference(['SR_B6', 'SR_B5']).rename('ndbi');
  // NDWI: water (green vs NIR), used only to remove water pixels
  var ndwi = sr.normalizedDifference(['SR_B3', 'SR_B5']).rename('ndwi');
  // Broadband albedo (Liang, 2001, coefficients adapted to Landsat 8/9 OLI)
  var albedo = sr.expression(
    '0.356 * B2 + 0.130 * B4 + 0.373 * B5 + 0.085 * B6 + 0.072 * B7 - 0.0018', {
      B2: sr.select('SR_B2'), B4: sr.select('SR_B4'), B5: sr.select('SR_B5'),
      B6: sr.select('SR_B6'), B7: sr.select('SR_B7')
    }).rename('albedo');

  return temp.addBands([ndvi, ndbi, ndwi, albedo])
    .copyProperties(img, ['system:time_start']);
}

// 4. SUMMER COMPOSITE, LANDSAT 8 + 9, 2023-2026
var l8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2');
var l9 = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2');

var collection = l8.merge(l9)
  .filterBounds(area)
  .filterDate('2023-01-01', '2026-04-01')
  .filter(ee.Filter.calendarRange(12, 3, 'month'))
  .filter(ee.Filter.lt('CLOUD_COVER', 40))
  .map(maskClouds)
  .map(compute);

print('Number of images used:', collection.size());
var composite = collection.median();

// 5. EXTRA FEATURES
// Elevation (m), NASA SRTM digital elevation model
var elevation = ee.Image('USGS/SRTMGL1_003').select('elevation').rename('elevation');

// Distance (m) to the nearest dense-vegetation pixel (NDVI >= 0.6)
var dense = composite.select('ndvi').gte(0.6);
var distDense = dense.distance(ee.Kernel.euclidean(3000, 'meters'))
  .rename('dist_dense_m');

// Tree cover and built-up cover within 50 m (ESA WorldCover 2021, 10 m).
// WorldCover separates trees (class 10) from grass (class 30), which NDVI cannot.
var worldCover = ee.ImageCollection('ESA/WorldCover/v200').first();
var wcProj = worldCover.projection();
var treeCover = worldCover.eq(10).focalMean(50, 'circle', 'meters')
  .reproject(wcProj).rename('tree_cover_50m');
var builtCover = worldCover.eq(50).focalMean(50, 'circle', 'meters')
  .reproject(wcProj).rename('built_cover_50m');

// Coordinates, used later for spatial cross-validation
var lonLat = ee.Image.pixelLonLat();

// 6. STACK ALL VARIABLES AND REMOVE WATER
var stack = composite.select(['temp', 'ndvi', 'ndbi', 'albedo', 'ndwi'])
  .addBands([elevation, distDense, treeCover, builtCover, lonLat]);

var notWater = composite.select('ndwi').lt(0).and(worldCover.neq(80));
stack = stack.updateMask(notWater).clip(area);

// 7. SAMPLE PIXELS
var dataset = stack.sample({
  region: area,
  scale: 30,
  numPixels: 8000,
  seed: 42,
  geometries: false,
  tileScale: 4
}).filter(ee.Filter.notNull(['temp', 'ndvi', 'ndbi', 'albedo', 'elevation',
                             'dist_dense_m', 'tree_cover_50m', 'built_cover_50m']));

print('Number of sampled points:', dataset.size());
print('First 5 rows:', dataset.limit(5));

// Quick check: map of tree cover and built-up cover
Map.setOptions('HYBRID');
Map.addLayer(treeCover.clip(area), {min: 0, max: 1, palette: ['white', 'darkgreen']},
  'Tree cover within 50 m (WorldCover)', false);
Map.addLayer(builtCover.clip(area), {min: 0, max: 1, palette: ['white', 'red']},
  'Built-up cover within 50 m (WorldCover)', false);

// 8. EXPORT TO GOOGLE DRIVE AS CSV (run it from the Tasks tab)
Export.table.toDrive({
  collection: dataset,
  description: 'santo_andre_urban_heat_ml_dataset',
  fileFormat: 'CSV',
  selectors: ['temp', 'ndvi', 'ndbi', 'albedo', 'elevation', 'dist_dense_m',
              'tree_cover_50m', 'built_cover_50m', 'longitude', 'latitude']
});
