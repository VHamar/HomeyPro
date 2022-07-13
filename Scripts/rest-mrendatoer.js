/*
 * Homeyscript for å hente tømmedatoer for avfall fra Min renovasjon.
 * Avhengigheter: rest-getaddresseinfo.js må ha kjørt for å sette tags for:
 * kommunenr, adressekode, gatenavn, gatenummer, gatebokstav
 */

// Ledende 0 for dag og måned
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  
  // formater dato som dd-mm-yyyy og returner dato
  function formatDate(datestr, dagenfoer) {
    var date = new Date(datestr);
    if (dagenfoer) {date.setDate( date.getDate() - 1)};
    return [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1), //stupid JavaScript that has 0 based month
      date.getFullYear(),
    ].join('-');
  }
  
  
  const appkey = 'AE13DEEC-804F-4615-A74E-B4FAC11F0A30'
  
  const kommunenr = (await Homey.flowToken.getFlowToken({uri: 'homey:app:com.athom.homeyscript',id: 'adr-kommunenummer'})).value;
  const gatenavn = (await Homey.flowToken.getFlowToken({uri: 'homey:app:com.athom.homeyscript',id: 'adr-gatenavn'})).value;
  const gatenummer = (await Homey.flowToken.getFlowToken({uri: 'homey:app:com.athom.homeyscript',id: 'adr-gatenummer'})).value;
  const gatebokstav = (await Homey.flowToken.getFlowToken({uri: 'homey:app:com.athom.homeyscript',id: 'adr-gatebokstav'})).value;
  const adressekode = (await Homey.flowToken.getFlowToken({uri: 'homey:app:com.athom.homeyscript',id: 'adr-adressekode'})).value;
  log(kommunenr, adressekode, gatenavn, gatenummer, gatebokstav)
  const gatenb = gatenummer + gatebokstav;
  
  // Hent fraksjoner
  var res = await fetch(`https://komteksky.norkart.no/komtek.renovasjonwebapi/api/fraksjoner`, { "headers": { "RenovasjonAppKey": appkey,"Kommunenr": kommunenr } });
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const fraksjoner = await res.json();
  // log(fraksjoner);
  
  // Hent datoer
  res = await fetch(`https://komteksky.norkart.no/komtek.renovasjonwebapi/api/tommekalender?gatenavn=${gatenavn}&gatekode=${adressekode}&husnr=${gatenb}`, { "headers": { "RenovasjonAppKey": appkey,"Kommunenr": kommunenr } });
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const datoer = await res.json();
  
  await fraksjoner.forEach(getFraksjon)
  
  async function getFraksjon(fraksjon) {
    var queryResult = _.find(datoer, function(x) {return x.FraksjonId == fraksjon.Id} );
    if (queryResult != null) {
      log(fraksjon.Navn, formatDate(queryResult.Tommedatoer[0], false));
      await tag('MRen-'+ fraksjon.Navn, formatDate(queryResult.Tommedatoer[0], false));
      await tag('MRen-'+ fraksjon.Navn + '-df', formatDate(queryResult.Tommedatoer[0], true));
    }
  }