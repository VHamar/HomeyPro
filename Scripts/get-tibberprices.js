// Log in at https://developer.tibber.com/settings/access-token and create your token, it should at least have price and tibber_graph. 
//Replace [Your Token Here] on the line below (including the [ and ]) with your token
const token = 'Bearer ' + '[Your Token Here]';

// Ledende 0 for time og minutt
function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

// formater tid som hh:mm og returner
function formatTime(datestr) {
  var date = new Date(datestr.split('+')[0]);
  return [
    padTo2Digits(date.getHours()),
    padTo2Digits(date.getMinutes())
  ].join(':');
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
var priceInfo = home.currentSubscription.priceInfo;
priceInfo.today.sort((a,b) => {
  return a.total - b.total;
});

var cheapestHourToday = formatTime(priceInfo.today[0].startsAt);

var foo = priceInfo.today.slice(0,3)
var bar = ''
foo.forEach((e) => {
  bar += formatTime(e.startsAt) + ','
})
var cheapest3HoursToday = bar.slice(0,-1);

log(cheapestHourToday, cheapest3HoursToday)
await tag('TIB-laveste', cheapestHourToday);
await tag('TIB-3laveste', cheapest3HoursToday);

