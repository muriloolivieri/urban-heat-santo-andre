// =====================================================================
// URBAN HEAT ISLANDS IN SANTO ANDRÉ (SP, BRAZIL)
// Script 06 - Urban neighbourhoods only: heat ranking + population
// Summers (December to March) 2023-2026.
// Uses the IBGE 2022 Census neighbourhood file, which also includes
// Census counts (v0001 = total residents).
// Run in the Google Earth Engine Code Editor: https://code.earthengine.google.com
// =====================================================================

// 1. NEIGHBOURHOODS OF SANTO ANDRÉ
var allNeighbourhoods = ee.FeatureCollection('projects/calor-urbano-510100/assets/BR_bairros_CD2022')
  .filter(ee.Filter.eq('NM_MUN', 'Santo André'));

// Keep only URBAN neighbourhoods: those whose centre lies inside the same
// northern rectangle used in Analyses 3 and 4. This removes the forested
// water-protection area in the south (Paranapiacaba, Parque do Pedroso etc.).
var northRectangle = ee.Geometry.Rectangle([-46.58, -23.72, -46.46, -23.60]);
var neighbourhoods = allNeighbourhoods.map(function(f) {
  var inside = northRectangle.contains(f.geometry().centroid(1), 1);
  return f.set('is_urban', ee.Algorithms.If(inside, 1, 0));
}).filter(ee.Filter.eq('is_urban', 1));

print('All neighbourhoods:', allNeighbourhoods.size());
print('Urban neighbourhoods analysed:', neighbourhoods.size());

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
  .filterBounds(northRectangle)
  .filterDate('2023-01-01', '2026-04-01')
  .filter(ee.Filter.calendarRange(12, 3, 'month'))
  .filter(ee.Filter.lt('CLOUD_COVER', 40))
  .map(maskClouds)
  .map(compute);

print('Number of images used:', collection.size());

var composite = collection.median();
var dense = composite.select('ndvi').gte(0.6).rename('dense');
var bands = composite.addBands(dense);

// 5. MEAN VALUES + POPULATION FOR EACH URBAN NEIGHBOURHOOD
var stats = bands.reduceRegions({
  collection: neighbourhoods,
  reducer: ee.Reducer.mean(),
  scale: 30,
  tileScale: 4
});

// v0001 (total residents) is stored as text. IBGE uses symbols such as
// "." or "X" when a value does not exist or cannot be released
// (e.g. areas with no or very few households). Those become null
// (no population data) instead of breaking the script.
var MISSING_CODES = ee.List(['.', '..', '...', '-', 'X', 'x', '']);
function toNumberOrNull(value) {
  var isString = ee.String(ee.Algorithms.ObjectType(value)).equals('String');
  return ee.Algorithms.If(isString,
    ee.Algorithms.If(MISSING_CODES.contains(ee.String(value).trim()),
      null,
      ee.Number.parse(ee.String(value).trim())),
    value);
}

var table = stats
  .filter(ee.Filter.notNull(['temp']))
  .map(function(f) {
    var areaKm2 = f.geometry().area(1).divide(1e6);
    var population = toNumberOrNull(f.get('v0001'));
    return f.set({
      'temp_C': ee.Number(f.get('temp')).multiply(10).round().divide(10),
      'ndvi_mean': ee.Number(f.get('ndvi')).multiply(100).round().divide(100),
      'dense_veg_pct': ee.Number(f.get('dense')).multiply(100).round(),
      'population': population,
      'density_per_km2': ee.Algorithms.If(population,
        ee.Number(population).divide(areaKm2).round(), null),
      'area_km2': areaKm2.multiply(100).round().divide(100)
    });
  });

var columns = ['temp_C', 'ndvi_mean', 'dense_veg_pct', 'population', 'density_per_km2'];

// 6. RANKINGS OF URBAN NEIGHBOURHOODS
var hottest = table.sort('temp_C', false);
var coolest = table.sort('temp_C');

print(ui.Chart.feature.byFeature(hottest.limit(15), 'NM_BAIRRO', columns)
  .setChartType('Table')
  .setOptions({title: '15 hottest urban neighbourhoods'}));

print(ui.Chart.feature.byFeature(coolest.limit(10), 'NM_BAIRRO', columns)
  .setChartType('Table')
  .setOptions({title: '10 coolest urban neighbourhoods'}));

// Summary numbers
var tempMax = hottest.first().get('temp_C');
var tempMin = coolest.first().get('temp_C');
print('Hottest urban neighbourhood (°C):', tempMax,
      'Coolest urban neighbourhood (°C):', tempMin,
      'Difference (°C):', ee.Number(tempMax).subtract(tempMin));

// 7. WHERE DO MOST PEOPLE FACE THE MOST HEAT?
// Hot = among the hottest 25% of urban neighbourhoods.
var p75 = ee.Number(table.reduceColumns(ee.Reducer.percentile([75]), ['temp_C']).get('p75'));
var hotNeighbourhoods = table.filter(ee.Filter.gte('temp_C', p75));

// Population sums use only neighbourhoods with Census population data
var withPopulation = table.filter(ee.Filter.notNull(['population']));
var hotWithPopulation = hotNeighbourhoods.filter(ee.Filter.notNull(['population']));

print('Temperature threshold for the hottest 25% (°C):', p75);
print('Number of neighbourhoods in the hottest 25%:', hotNeighbourhoods.size());
print('Urban neighbourhoods without population data:',
  table.size().subtract(withPopulation.size()));
print('Residents living in the hottest 25% of neighbourhoods:', hotWithPopulation.aggregate_sum('population'));
print('Residents in all urban neighbourhoods analysed:', withPopulation.aggregate_sum('population'));

print(ui.Chart.feature.byFeature(hotWithPopulation.sort('population', false).limit(10), 'NM_BAIRRO', columns)
  .setChartType('Table')
  .setOptions({title: 'Hottest 25%: the 10 with the most residents (candidate priorities)'}));

// 8. DOES LESS VEGETATION MEAN A HOTTER URBAN NEIGHBOURHOOD?
print(ui.Chart.feature.byFeature(table, 'ndvi_mean', ['temp_C'])
  .setChartType('ScatterChart')
  .setOptions({
    title: 'Urban neighbourhoods: mean NDVI vs mean land surface temperature',
    hAxis: {title: 'Mean NDVI (vegetation)'},
    vAxis: {title: 'Mean land surface temperature (°C)'},
    pointSize: 4,
    legend: 'none'
  }));

print('Correlation across urban neighbourhoods (NDVI vs temperature):',
  table.reduceColumns(ee.Reducer.pearsonsCorrelation(), ['ndvi_mean', 'temp_C']));

// 9. MAP
Map.setOptions('HYBRID');
Map.centerObject(neighbourhoods, 13);

Map.addLayer(ee.Image().float().paint(table, 'temp_C'),
  {min: 34, max: 41, palette: ['blue', 'cyan', 'yellow', 'orange', 'red']},
  'Mean summer land surface temperature, urban neighbourhoods (°C)');

Map.addLayer(ee.Image().byte().paint({featureCollection: table, color: 1, width: 1}),
  {palette: ['white']}, 'Neighbourhood boundaries');

Map.addLayer(ee.Image().byte().paint({featureCollection: hotNeighbourhoods, color: 1, width: 3}),
  {palette: ['black']}, 'Hottest 25% of neighbourhoods (thick outline)');

// 10. EXPORT THE FULL TABLE AS CSV (optional; run it from the Tasks tab)
Export.table.toDrive({
  collection: hottest.select(['NM_BAIRRO'].concat(columns).concat(['area_km2']), null, false),
  description: 'santo_andre_urban_neighbourhoods_heat_population',
  fileFormat: 'CSV'
});
