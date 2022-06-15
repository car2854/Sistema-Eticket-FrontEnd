import { Injectable } from '@angular/core';
import { DateModel } from 'src/app/models/date';
import { EventModel } from 'src/app/models/event';
import { LocationModel } from 'src/app/models/location';
import { SectorModel } from 'src/app/models/sector';
import { SpaceModel } from 'src/app/models/space';

@Injectable({
  providedIn: 'root'
})
export class TicketDataService {

  public goPay: boolean = false;

  public event!: EventModel;

  public location!: LocationModel;
  public date!: DateModel;
  public sectors: SectorModel[] = [];
  public spaces: SpaceModel[] = [];
  public spacesAux: SpaceModel[] = [];


  // sin sectores
  public withoutSector: boolean = false;
  public cantidad: number = 0;
  public ticketsAvailableWS: number = 0;


  // con sectores
  public aggregateSectors: any[] = [];

  constructor() { }

  // con sectores
  public addAggregateSector = (idSector:number, amount:number) => {

    let sectorData!: SectorModel;

    this.sectors.forEach((sector:SectorModel) => {
      if (sector.idsector === idSector) sectorData = sector
    });  

    const data = {
      ...sectorData,
      cantidad: amount,
      espacios: []
    }

    this.aggregateSectors.push(data);

    console.log(this.aggregateSectors);
    

  }

  public addAgregateSpace = (idSector:number, idespacio: number) => {

    let space: any;

    this.spaces.forEach((spaceData: SpaceModel) => {
      if (spaceData.idespacio === idespacio) space = spaceData;
    });

    if (this.existSector(idSector)){

      // Existe el sector
      this.aggregateSectors.forEach((sector:any) => {
        console.log(sector);
        
        // if (this.existSpace(sector, idespacio)){

        // }
      });

    }else{

      let sectorData!: SectorModel;

      this.sectors.forEach((sector:SectorModel) => {
        if (sector.idsector === idSector) sectorData = sector
      });

      const data = {
        ...sectorData,
        cantidad: 0,
        espacios: [
          space
        ]
      }

      this.aggregateSectors.push(data);

      console.log(this.aggregateSectors);
      

    }


  }

  public removeSpace = (spacioData: SpaceModel) => {

  }

  public existSpace = (dataEspacio: any, spacioData: number) => {

  }

  public existSector = (idSector: number) => {

    let exist: boolean = false;

    this.aggregateSectors.forEach((sector:any) => {
      if (sector.idsector === idSector) exist = true
    });

    return exist;
  }


  

  public deleteSector = (idSector:number) => {

  }
}
