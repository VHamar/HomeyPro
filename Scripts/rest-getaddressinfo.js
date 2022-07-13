/*
 * Dette skriptet henter eiendomsinfo fra Kartverket.
 * Input er gatenavn,gatenummer, postnummer, bokstav og poststed i en komma separert string
 * Eksempel uten bokstav: valtoppveien,5,,1425,ski
 * Eksempel med bokstav: valtoppveien,5,a,1425,ski
 * 
 * Den henter da adressekode, kommunenummer, kommunenavn,gards, bruk, feste og undernummer (hvis det finnes) 
 * og i tillegg gpslokasjon (lat og long) som lagres i tags som da kan benyttes i andre flows.
 */

// Hvis du vil teste direkte i HomeyScript, så fjern // på linjen nedenfor, og legg inn din egen adresse
// const args = ['valtoppveien,5,,1425,ski',''];
log(args)
const adresseInfo = args[0].split(',')

const gatenavn = adresseInfo[0];
const gatenummer = adresseInfo[1];
const bokstav = adresseInfo[2];
const postnummer = adresseInfo[3];
const poststed = adresseInfo[4];

log(`${gatenavn} ${gatenummer} ${postnummer} ${poststed}`)

var adresser = `https://ws.geonorge.no/adresser/v1/sok?fuzzy=false&adressenavn=${gatenavn}&nummer=${gatenummer}&bokstav=${bokstav}&poststed=${poststed}&postnummer=${postnummer}&utkoordsys=4258&treffPerSide=10&side=0&asciiKompatibel=true`

// Create the request
const res = await fetch(adresser);
if (!res.ok) {
  throw new Error(res.statusText);
}

// Get the body JSON
const adrRes = await res.json();
log(adrRes)

const treff = adrRes.metadata.totaltAntallTreff

if (!treff == 1) {
  throw new Error('Antall treff: ' + treff + ' <> 1');
} else {
  var adresse = adrRes.adresser[0];
  if(gatenavn != null) {await tag('adr-gatenavn', gatenavn);} else {await tag('adr-gatenavn', '');}
  if(gatenummer != null) {await tag('adr-gatenummer', gatenummer);} else {await tag('adr-gatenummer', '');}
  if(bokstav != null) {await tag('adr-gatebokstav', bokstav);} else {await tag('adr-gateboksta', '');}
  if(postnummer != null) {await tag('adr-postnummer', postnummer);} else {await tag('adr-postnummer', '');}
  if(poststed != null) {await tag('adr-poststed', poststed);} else {await tag('adr-poststed', '');}

  if(adresse.adressekode != null) {await tag('adr-adressekode', adresse.adressekode);} else {await tag('adr-adressekode', '');}
  if(adresse.kommunenummer != null) {await tag('adr-kommunenummer', adresse.kommunenummer);} else {await tag('adr-kommunenummer', '');}
  if(adresse.kommunenavn != null) {await tag('adr-kommunenavn', adresse.kommunenavn);} else {await tag('adr-kommunenavn', '');}
  if(adresse.gardsnummer != null) {await tag('adr-gardsnummer', adresse.gardsnummer);} else {await tag('adr-gardsnummer', '');}
  if(adresse.bruksnummer != null) {await tag('adr-bruksnummer', adresse.bruksnummer);} else {await tag('adr-bruksnummer', '');}
  if(adresse.festenummer != null) {await tag('adr-festenummer', adresse.festenummer);} else {await tag('adr-festenummer', '');}
  if(adresse.undernummer != null) {await tag('adr-undernummer', adresse.undernummer);} else {await tag('adr-undernummer', '');}
  if(adresse.representasjonspunkt.lat != null) {await tag('adr-lat', adresse.representasjonspunkt.lat)} else {await tag('adr-lat', '');}
  if(adresse.representasjonspunkt.lon != null) {await tag('adr-lon', adresse.representasjonspunkt.lon)} else {await tag('adr-lon', '');}
}