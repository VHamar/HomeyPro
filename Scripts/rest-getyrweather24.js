const lat = (await Homey.flowToken.getFlowToken({uri: 'homey:app:com.athom.homeyscript',id: 'adr-lat'})).value;
const lon = (await Homey.flowToken.getFlowToken({uri: 'homey:app:com.athom.homeyscript',id: 'adr-lon'})).value;

function getlegend(weatherinfo) {
  var wcode = weatherinfo.summary.symbol_code.split('_')[0];

  var legend = legends[wcode].desc_nb;  // desc_nb, desc_nn or desc_en
  return legend
}

function getprecipitation(weatherinfo) {
  var precip =  weatherinfo.details.precipitation_amount;
  return precip;
}

function getDirection(degrees) {
  var direction = '';
  if (degrees < 11.25) {
    direction = "N";
  } else if (degrees < 33.75) {
    direction = 'NNØ';
  } else if (degrees < 56.25) {
    direction = "NØ";
  } else if (degrees < 78.75) {
    direction = "ØNØ";
  } else if (degrees < 101.25) {
    direction = "Ø";
  } else if (degrees < 123.75) {
    direction = "ØSØ";
  } else if (degrees < 146.25) {
    direction = "SØ";
  } else if (degrees < 168.75) {
    direction = "SSØ";
  } else if (degrees < 191.25) {
    direction = "S";
  } else if (degrees < 213.75) {
    direction = "SSV";
  } else if (degrees < 236.25) {
    direction = "SV";
  } else if (degrees < 258.75) {
    direction = "VSV";
  } else if (degrees < 281.25) {
    direction = "V";
  } else if (degrees < 303.75) {
    direction = "VNV";
  } else if (degrees < 326.25) {
    direction = "NV";
  } else if (degrees < 348.75) {
    direction = "NNV";
  } else {
    direction = "N";
  }
  return (`${direction}  `).slice(0,3);
}


var res = await fetch(`https://api.met.no/weatherapi/weathericon/2.0/legends`);
if (!res.ok) {
  throw new Error(res.statusText);
}
const legends = await res.json();

res = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`,{ "headers": { "User-Agent": "rest-getyrweather.js https://github.com/VHamar/HomeyPro/" } });
if (!res.ok) {
  throw new Error(res.statusText);
}
const weather = await res.json();

const sys = await Homey.system.getInfo()

var forecast = '';
for (let i = 0;i < 24;i++) {
  var timeseries = weather.properties.timeseries[i];
  var next1h = timeseries.data.next_1_hours;
  var legend = getlegend(next1h)
  var precip = +getprecipitation(next1h);
  var details = timeseries.data.instant.details;
  var temp = +details.air_temperature;
  var windd = +details.wind_from_direction;
  var winds = +details.wind_speed
  var time = new Date(timeseries.time).toLocaleTimeString('nb-NO',{hour: 'numeric', minute: 'numeric', timeZone: sys.timezone});
  forecast += `${time}: ${(`    ${temp.toFixed(1)}`).slice(-5)}°C, ${precip.toFixed(1)}mm, ${winds.toFixed(1)}ms ${getDirection(windd)}:  ${legend}° \n`;
}
log(forecast);
await tag('yrneste24', forecast);

