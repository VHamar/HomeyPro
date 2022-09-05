// Log in at https://developer.tibber.com/settings/access-token and create your token, it should at least have price and tibber_graph. 
//Replace [Your Token Here] on the line below (including the [ and ]) with your token
const token = 'Bearer ' + '[Your Token Here]';

// numHours in period, must be 3, 5 or 7 where 3 is default
const numHours = 3;

// house number in case you have more than one house registered at Tibber
const houseNumber = 0;

// Add leading 0 numbers < 10
function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

// format time as hh or hh - hh depending on it being single hour or period
function formatTime(datestr, period = false, periodOffset = 1) {
  var date = new Date(datestr.split('+')[0]);
  if (period) {
    var output = [
      padTo2Digits(date.getHours()-periodOffset),
      padTo2Digits(date.getHours()+periodOffset)
    ].join(' - ');
    return output;
  } else {
    return padTo2Digits(date.getHours());
  }
}

// Calulate the average period price, period must be 3,5 or 7 where 3 is default
function calcAvgPeriodPrice(arrPrices, numHours = 5){
    var offset;
  switch (numHours) {
    case 5:
      offset = 2;
    break;
    case 7:
      offset = 3;
    break;
    default: 
      offset = 1;
      numHours = 3;
  }
  for (let i = 0; i < arrPrices.length; i++) {
    arrPrices[i].avgPeriodPrice = 999.99;
  }
  for (let i = offset; i < arrPrices.length - offset; i++) {
    var arr = arrPrices.slice(i-offset, i + numHours - offset);
    var total = arr.reduce((acc,c) => acc + c.total, 0);
    arrPrices[i].avgPeriodPrice = total;
  }
  return [arrPrices, offset]
}

// call Tibber API and fetch prices
var res = await fetch("https://api.tibber.com/v1-beta/gql", {
  body: '{ "query": "{viewer {homes {currentSubscription {priceInfo {current {total energy tax startsAt }today {total energy tax startsAt }tomorrow {total energy tax startsAt }}}}}}"}',
  headers: {
    Authorization: token,
    "Content-Type": 'application/json'
  },
  method: "POST"
});

// check return code
if (!res.ok) {
  throw new Error(res.statusText);
}

// get the json object and pick it apart into home, then get today's and tomoorrows prices for that home
const result = await res.json();
var home = result.data.viewer.homes[houseNumber];
var priceInfoToday = home.currentSubscription.priceInfo.today;
var priceInfoTomorrow = home.currentSubscription.priceInfo.tomorrow;

// check if data for tomorrow exist. Usually only available after 13:00.
var tomorrowExist = priceInfoTomorrow.length > 0;
if (tomorrowExist) {
  log(`Data available for tomorrow. (length: ${priceInfoTomorrow.length})`)
} else {
  log(`No data available for tomorrow. (length: ${priceInfoTomorrow.length})`)
}

// calculate average period prices for today and tommorow.
var periodOffset = 1;
[priceInfoToday, periodOffset] = calcAvgPeriodPrice(priceInfoToday, numHours);
[priceInfoTomorrow, periodOffset] = calcAvgPeriodPrice(priceInfoTomorrow, numHours);

// sort todays prices ascending and pick first (lowest)
priceInfoToday.sort((a,b) => {
  return a.total - b.total;
});
var cheapestHourToday = formatTime(priceInfoToday[0].startsAt);

// sort today for ascending period prices and pick first (lowest) period 
priceInfoToday.sort((a,b) => {
  return a.avgPeriodPrice - b.avgPeriodPrice;
});
var cheapestPeriodToday = formatTime(priceInfoToday[0].startsAt, true, periodOffset)

// set/update tags for today
log(cheapestHourToday, cheapestPeriodToday)
await tag('TIB-cheapestHourToday', cheapestHourToday);
await tag('TIB-cheapestPeriodToday', cheapestPeriodToday);

// if data for tomorrow exists then get info for tomorrow
if (tomorrowExist) {
  // sort tomorrows prices ascending and pick first (lowest)
  priceInfoTomorrow.sort((a,b) => {
    return a.total - b.total;
  });

  // sort tomorrow for ascending period prices and pick first (lowest) period 
  var cheapestHourTomorrow = formatTime(priceInfoTomorrow[0].startsAt);
  priceInfoTomorrow.sort((a,b) => {
    return a.avgPeriodPrice - b.avgPeriodPrice;
  });
  var cheapestPeriodTomorrow = formatTime(priceInfoTomorrow[0].startsAt, true, periodOffset)
  
  
  // set/update tags for today
  log(cheapestHourTomorrow, cheapestPeriodTomorrow)
  await tag('TIB-cheapestHourTomorrow', cheapestHourTomorrow);
  await tag('TIB-cheapestPeriodTomorrow', cheapestPeriodTomorrow);
} 