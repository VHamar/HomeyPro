// Get values set by get-tibberprices.js
var hour = (await Homey.flowToken.getFlowToken({uri: 'homey:app:com.athom.homeyscript',id: 'TIB-cheapestHourToday'})).value;
var period = (await Homey.flowToken.getFlowToken({uri: 'homey:app:com.athom.homeyscript',id: 'TIB-cheapestPeriodToday'})).value;

// debug overrides, set hour or period to include current hour
//hour = '10'
//period = '10 - 12';

log(hour)

// Return value with leading zero if num < 10
function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function convertToArray(period) {
  var arrPeriod = period.replace(' ','').split('-');
  var start = parseInt(arrPeriod[0]);
  var stop = parseInt(arrPeriod[1]);
  var offset = stop - start;
  let arrHours = [];
  for (i = 0; i <= offset; i++) {
    arrHours[i] = padTo2Digits(start + i);
  }
  return arrHours;
}

const sys = await Homey.system.getInfo();
var time = new Date(); 

// convert system time to local time and get just the hour as 24h, so using Norwegian locale and timezone from the Homey.
var localHour = time.toLocaleTimeString('nb-NO',{hour: 'numeric', timeZone: sys.timezone});

// check if it's the lowest price hour and if so, set the tag to true
if (hour === localHour) {
  await tag('TIB-LowestHour', true);
} else {
  await tag('TIB-LowestHour', false);
}

// check if it's current hour is in the lowest price period and if so, set the tag to true
var arrHours = convertToArray(period);
log(arrHours);
if (arrHours.includes(localHour)) {
  await tag('TIB-LowestPeriod', true);
} else {
  await tag('TIB-LowestPeriod', false);
}