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

var next1h = weather.properties.timeseries[0].data.next_1_hours;
var next6h = weather.properties.timeseries[0].data.next_6_hours;
var next12h = weather.properties.timeseries[0].data.next_12_hours;

var lnext1h = getlegend(next1h);
var lnext6h = getlegend(next6h);
var lnext12h = getlegend(next12h);

var pnext1h = getprecipitation(next1h);
var pnext6h = getprecipitation(next6h);

await tag('yrforecast1h', `${ getlegend(next1h)} (${getprecipitation(next1h)} mm)`);
await tag('yrforecast6h', `${ getlegend(next6h)} (${getprecipitation(next6h)} mm)`);
await tag('yrforecast12h', `${ getlegend(next12h)}`);
