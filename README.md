# HomeyPro

This is where I play around with Homey Pro and share what I make. If the info below is Norwegian then it's so because the script/Flow info is Norway specific.

## **Scripts**
### Hent Addresse Info: [rest-getaddressinfo.js](Scripts/rest-getaddressinfo.js)
Dette HomeyScript'et henter adresse info fra Kartverket og lagrer informasjonen som tag'er. Jeg kjører dette scriptet hver gang Homey restarter slik at tag'ene er tilgjengelige for flows sånn som Min Renovasjon nedenfor. Scriptet krever input (se kommentar på toppen av scriptet).
#### Tag'er':
* **Input**
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
### **Min Renovasjon**: [rest-mrendatoer.js](Scripts/rest-mrendatoer.js)
**Viktig: Dette scriptet er avhengig av skriptet ovenfor**
Dette HomeyScript'et henter tømmedatoer for forskjellige typer avfall fra Min Renovasjon og lagrer tømmedatoene i tag's: Det er 2 tag'er for hver avfallstype, en med tømmedato og en med dagen før, begge i Homey dato format (dd-mm-yyyy). Hvor mange tag'er du får er avhenging av hvor mange avfallstyper det er i ditt område
#### **Tag eksempeler:** Restavfall 21 Jul 2022 og Papir 28 Jul 2022
* MRen-Restavfall   : 21-07-2022
* MRen-Restavfall-df: 20-07-2022
* MRen-Papir   : 28-07-2022
* MRen-Papir-df: 27-07-2022

## **Flows**
### Min Renovasjon
Eksempel på bruk av Min Renovasjon scriptet ovenfor. 
* Hver mandag 06:00, hent tømmedatoer.
* Hver dag sjekk om det er tømming i dag eller i morra og send notifikasjon om det er.
  
![MinRenovasjon.PNG](FlowScreenshots/MinRenovasjon.PNG)

### Homey Restarted
This is a flow that runs every time the Homey restart, running script that set's tags that are used in other flows.
![HomeyRestarted.PNG](FlowScreenshots/HomeyRestarted.PNG)
