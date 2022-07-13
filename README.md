# HomeyPro

This is where I play around with Homey Pro and share what I make. If the info below is Norwegian then it's so because the script/Flow info is Norway specific.

## **Scripts**
### [**Hent Addresse Info**](./wiki/rest-getaddressinfo.md)
Dette HomeyScript'et henter adresse info fra Kartverket og lagrer informasjonen som tag'er. 
### [**Min Renovasjon**](./wiki/rest-mrendatoer.md)
Dette HomeyScript'et henter tømmedatoer for forskjellige typer avfall fra Min Renovasjon og lagrer tømmedatoene i tag'er.

## **Flows**
### Min Renovasjon
Eksempel på bruk av Min Renovasjon scriptet ovenfor. 
* Hver mandag 06:00, hent tømmedatoer.
* Hver dag sjekk om det er tømming i dag eller i morra og send notifikasjon om det er.
  
![MinRenovasjon.PNG](FlowScreenshots/MinRenovasjon.PNG)

### Homey Restarted
This is a flow that runs every time the Homey restart, running script that set's tags that are used in other flows.
![HomeyRestarted.PNG](FlowScreenshots/HomeyRestarted.PNG)
