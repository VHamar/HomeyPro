// Log in at https://developer.tibber.com/settings/access-token and create your token, it should at least have price and tibber_graph. 
//Replace [Your Token Here] on the line below (including the [ and ]) with your token
const token = 'Bearer ' + '[Your Token Here]';

// Ledende 0 for time og minutt
function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

// formater tid som hh elle hh-hh og returner
function formatTime(datestr, period = false) {
  var date = new Date(datestr.split('+')[0]);
  if (period) {
    var output = [
      padTo2Digits(date.getHours()-1),
      padTo2Digits(date.getHours()+1)
    ].join('->');
    return output;
  } else {
    return padTo2Digits(date.getHours());
  }
}

var res = await fetch("https://api.tibber.com/v1-beta/gql", {
  body: '{ "query": "{viewer {homes {currentSubscription {priceInfo {current {total energy tax startsAt }today {total energy tax startsAt }tomorrow {total energy tax startsAt }}}}}}"}',
  headers: {
    Authorization: token,
    "Content-Type": 'application/json'
  },
  method: "POST"
});

if (!res.ok) {
  throw new Error(res.statusText);
}
const result = await res.json();
var home = result.data.viewer.homes[0];
var priceInfoToday = home.currentSubscription.priceInfo.today;
var priceInfoTomorrow = home.currentSubscription.priceInfo.tomorrow;
var tomorrowExist = priceInfoTomorrow.length > 0;
if (tomorrowExist) {
  log(`Data available for tomorrow. (length: ${priceInfoTomorrow.length})`)
} else {
  log(`No data available for tomorrow. (length: ${priceInfoTomorrow.length})`)
}

for (let i = 1; i < priceInfoToday.length - 1; i++) {
  var avg = (priceInfoToday[i-1].total + priceInfoToday[i].total + priceInfoToday[i+1].total ) / 3;
  priceInfoToday[i].avgNext3Hours = avg;
}
for (let i = 1; i < priceInfoTomorrow.length - 1; i++) {
  var avg = (priceInfoTomorrow[i-1].total + priceInfoTomorrow[i].total + priceInfoTomorrow[i+1].total ) / 3;
  priceInfoTomorrow[i].avgNext3Hours = avg;
}

priceInfoToday.sort((a,b) => {
  return a.total - b.total;
});
var cheapestHourToday = formatTime(priceInfoToday[0].startsAt);
priceInfoToday.sort((a,b) => {
  return a.avgNext3Hours - b.avgNext3Hours;
});
var cheapest3HourPeriodToday = formatTime(priceInfoToday[0].startsAt, true)

log(cheapestHourToday, cheapest3HourPeriodToday)
await tag('TIB-laveste', cheapestHourToday);
await tag('TIB-laveste3tPeriode', cheapest3HourPeriodToday);

if (tomorrowExist) {
  priceInfoTomorrow.sort((a,b) => {
    return a.total - b.total;
  });
  var cheapestHourTomorrow = formatTime(priceInfoTomorrow[0].startsAt);
  priceInfoTomorrow.sort((a,b) => {
    return a.avgNext3Hours - b.avgNext3Hours;
  });
  var cheapest3HourPeriodTomorrow = formatTime(priceInfoTomorrow[0].startsAt, true)

  log(cheapestHourTomorrow, cheapest3HourPeriodTomorrow)
  await tag('TIB-lavesteNesteDag', cheapestHourTomorrow);
  await tag('TIB-laveste3tPeriodeNesteDag', cheapest3HourPeriodTomorrow);

}
