import { Injectable } from '@angular/core';
import { DateModel } from 'src/app/models/date';
import { EventModel } from 'src/app/models/event';
import { LocationModel } from 'src/app/models/location';
import { SectorModel } from 'src/app/models/sector';

@Injectable({
  providedIn: 'root'
})
export class TicketDataService {

  public goPay: boolean = false;

  public event!: EventModel;

  public location!: LocationModel;
  public date!: DateModel;
  public sectors: SectorModel[] = [];


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

  public addAgregateSpace = (idSector:number, identificador: number) => {

    if (this.existSector(idSector)){

      this.aggregateSectors.forEach((dataSector:any) => {
        
        

      });

    }else{



    }

  }

  public existSpace = (idsector: number, idespacio: number) => {
    let exist:boolean = false;

    this.aggregateSectors.forEach((dataSector) => {
      
      if (dataSector.idsector === idsector){
        dataSector.espacios.forEach((dataSpace: any) => {
          if (dataSpace.idespacio === idespacio) exist = true;
        });
      }

    });

    return exist;
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
