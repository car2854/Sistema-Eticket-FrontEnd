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

    let name;
    let price;

    this.sectors.forEach((sector: SectorModel) => {
      if (sector.idsector === idSector) {
        name = sector.nombre;
        price = sector.precio
      };
    });

    const data = {
      idsector: idSector,
      cantidad: amount,
      nombre: name,
      price: price,
      espacios: []
    }

    this.aggregateSectors.push(data);

    console.log(this.aggregateSectors);
    

  }

  public addAgregateSpace = (idSector:number, idespacio: number) => {


    let spacioData!: SpaceModel;
    this.spaces.forEach((spaceD:SpaceModel) => {
      if (spaceD.idespacio == idespacio) spacioData = spaceD;
    });
    if (!spacioData) return;


    if (this.existSector(idSector)){

      this.aggregateSectors.forEach((dataSector:any) => {
        
        if(!this.existSpace(dataSector.espacios, spacioData)){

          dataSector.espacios.push(spacioData);

        }
        

      });

    }else{

      let name;
      let price;
  
      this.sectors.forEach((sector: SectorModel) => {
        if (sector.idsector === idSector) {
          name = sector.nombre;
          price = sector.precio
        };
      });

      const data = {
        idsector: idSector,
        cantidad: 0,
        nombre: name,
        price: price,
        espacios: [
          spacioData
        ]
      }
      this.aggregateSectors.push(data);
      console.log(this.aggregateSectors);
      
      
    }
    
    this.removeSpace(spacioData);

  }

  public removeSpace = (spacioData: SpaceModel) => {

    this.spaces.splice(this.spaces.indexOf(spacioData),1);
    
  }

  private existSpace = (dataEspacio: SpaceModel[], spacioData: SpaceModel) => {

    return dataEspacio.includes(spacioData);

  }

  public existSector = (idSector: number) => {
    let exist: boolean = false;

    this.aggregateSectors.forEach((sector:any) => {
      if (sector.idsector === idSector) exist = true;
    });

    return exist;
  }


  

  public deleteSector = (idSector:number) => {
    
    const newAggregateSectors = this.aggregateSectors.filter((sector:any) => {

      if (sector.idsector === idSector) return false;
      return true

    }).map((sector:any) => {return sector});
    
    this.aggregateSectors = newAggregateSectors;

  }
}
