// =====================================================================
// URBAN HEAT ISLANDS IN SANTO ANDRÉ (SP, BRAZIL)
// Script 05 - Neighbourhood ranking, summers (December to March) 2023-2026
// Mean land surface temperature, mean NDVI and share of dense vegetation
// for each neighbourhood, using the IBGE 2022 Census neighbourhood file.
// Run in the Google Earth Engine Code Editor: https://code.earthengine.google.com
// =====================================================================

// 1. NEIGHBOURHOODS OF SANTO ANDRÉ
// IBGE "Arquivo geoespacial de Bairros" (Censo 2022), uploaded as an asset.
// Note: IBGE neighbourhood boundaries may differ from the names and limits
// people use in everyday life.
var neighbourhoods = ee.FeatureCollection('projects/calor-urbano-510100/assets/BR_bairros_CD2022')
  .filter(ee.Filter.eq('NM_MUN', 'Santo André'));

print('Neighbourhoods in Santo André:', neighbourhoods.size());
print('Example neighbourhood (check the field names):', neighbourhoods.first());

// Field that stores the neighbourhood name. If the tables below show no
// names, open the example above and replace this with the right field.
var NAME_FIELD = 'NM_BAIRRO';

// 2. CLOUD AND CLOUD-SHADOW MASK (QA_PIXEL bit 3 = cloud, bit 4 = shadow)
function maskClouds(img) {
  var qa = img.select('QA_PIXEL');
  var cloud = qa.bitwiseAnd(1 << 3).neq(0);
  var shadow = qa.bitwiseAnd(1 << 4).neq(0);
  return img.updateMask(cloud.or(shadow).not());
}

// 3. LAND SURFACE TEMPERATURE (°C) AND NDVI
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

// 4. IMAGE COLLECTION: LANDSAT 8 + 9, SUMMER MONTHS (DEC-MAR), 2023-2026
var l8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2');
var l9 = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2');

var collection = l8.merge(l9)
  .filterBounds(neighbourhoods.geometry().bounds())
  .filterDate('2023-01-01', '2026-04-01')
  .filter(ee.Filter.calendarRange(12, 3, 'month'))
  .filter(ee.Filter.lt('CLOUD_COVER', 40))
  .map(maskClouds)
  .map(compute);

print('Number of images used:', collection.size());

var composite = collection.median();

// Extra band: 1 where NDVI >= 0.6 (dense vegetation), 0 elsewhere.
// Its mean inside a neighbourhood = share of dense vegetation.
var dense = composite.select('ndvi').gte(0.6).rename('dense');
var bands = composite.addBands(dense);

// 5. MEAN VALUES FOR EACH NEIGHBOURHOOD
var stats = bands.reduceRegions({
  collection: neighbourhoods,
  reducer: ee.Reducer.mean(),
  scale: 30,
  tileScale: 4
});

var table = stats
  .filter(ee.Filter.notNull(['temp']))
  .map(function(f) {
    return f.set({
      'temp_C': ee.Number(f.get('temp')).multiply(10).round().divide(10),
      'ndvi_mean': ee.Number(f.get('ndvi')).multiply(100).round().divide(100),
      'dense_veg_pct': ee.Number(f.get('dense')).multiply(100).round(),
      'area_km2': f.geometry().area(1).divide(1e6).multiply(100).round().divide(100)
    });
  });

var hottest = table.sort('temp_C', false);
var coolest = table.sort('temp_C');
var columns = ['temp_C', 'ndvi_mean', 'dense_veg_pct', 'area_km2'];

// 6. RANKINGS (shown as tables in the console)
print(ui.Chart.feature.byFeature(hottest.limit(15), NAME_FIELD, columns)
  .setChartType('Table')
  .setOptions({title: '15 hottest neighbourhoods (summer land surface temperature)'}));

print(ui.Chart.feature.byFeature(coolest.limit(10), NAME_FIELD, columns)
  .setChartType('Table')
  .setOptions({title: '10 coolest neighbourhoods'}));

// Bar chart of the 15 hottest
print(ui.Chart.feature.byFeature(hottest.limit(15), NAME_FIELD, ['temp_C'])
  .setChartType('BarChart')
  .setOptions({
    title: '15 hottest neighbourhoods of Santo André (summers 2023-2026)',
    hAxis: {title: 'Mean land surface temperature (°C)'},
    legend: 'none'
  }));

// 7. DOES LESS VEGETATION MEAN A HOTTER NEIGHBOURHOOD?
print(ui.Chart.feature.byFeature(table, 'ndvi_mean', ['temp_C'])
  .setChartType('ScatterChart')
  .setOptions({
    title: 'Neighbourhoods: mean NDVI vs mean land surface temperature',
    hAxis: {title: 'Mean NDVI (vegetation)'},
    vAxis: {title: 'Mean land surface temperature (°C)'},
    pointSize: 4,
    legend: 'none'
  }));

var corr = table.reduceColumns(ee.Reducer.pearsonsCorrelation(), ['ndvi_mean', 'temp_C']);
print('Correlation across neighbourhoods (NDVI vs temperature):', corr);

// 8. MAP: EACH NEIGHBOURHOOD COLOURED BY ITS MEAN TEMPERATURE
Map.setOptions('HYBRID');
Map.centerObject(neighbourhoods, 12);

var tempByNeighbourhood = ee.Image().float().paint(table, 'temp_C');
Map.addLayer(tempByNeighbourhood,
  {min: 28, max: 42, palette: ['blue', 'cyan', 'yellow', 'orange', 'red']},
  'Mean summer land surface temperature by neighbourhood (°C)');

var outlines = ee.Image().byte().paint({featureCollection: neighbourhoods, color: 1, width: 1});
Map.addLayer(outlines, {palette: ['white']}, 'Neighbourhood boundaries');

// 9. EXPORT THE FULL RANKING AS A CSV FILE (optional; run it from the Tasks tab)
Export.table.toDrive({
  collection: hottest.select([NAME_FIELD].concat(columns), null, false),
  description: 'santo_andre_neighbourhood_ranking_summer',
  fileFormat: 'CSV'
});
