# Hent Addresse Info: [rest-getaddressinfo.js](../Scripts/rest-getaddressinfo.js)
Dette HomeyScript'et henter adresse info fra Kartverket og lagrer informasjonen som tag'er. Jeg kjører dette scriptet hver gang Homey restarter slik at tag'ene er tilgjengelige for flows sånn som Min Renovasjon nedenfor. Scriptet krever input (se kommentar på toppen av scriptet).
## Input
Scriptet forventer å få en kommaseparert string med følgende opplsyninger som input. Om en ikke har gate bokstav så la den være blank (,,)
* Gatenavn
* Gatenummer 
* [Gatebokstav]
* Postnummer 
* Poststed

### Eksempel
* slottsplassen,1,,0010,Oslo
* slottsplassen,1,a,0010,Oslo

## Output:
* **Adresse**
  * adr-gatenavn
  * adr-gatenummer 
  * [adr-gatebokstav]
  * adr-postnummer 
  * adr-poststed
* **Fra Kartverket**
  * adr-adressekode
  * adr-kommunenummer
  * adr-kommunenavn
  * adr-gardsnummer
  * adr-bruksnummer
  * adr-festenummer
  * [adr-undernummer] 
  * **GPS Koordinater**
    * adr-lat
    * adr-lon