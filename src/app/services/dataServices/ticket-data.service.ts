import { Injectable } from '@angular/core';
import { DateModel } from 'src/app/models/date';
import { LocationModel } from 'src/app/models/location';
import { SectorModel } from 'src/app/models/sector';

@Injectable({
  providedIn: 'root'
})
export class TicketDataService {

  public goPay: boolean = false;

  public location!: LocationModel;
  public date!: DateModel;
  public sectors: SectorModel[] = [];
  
  // con sectores
  public aggregateSectors: any[] = [];

  constructor() { }

  // con sectores
  public addAggregateSector = (idSector:number, amount:number, price:number) => {

    if (this.existSector(idSector)) return;

    let name;

    this.sectors.forEach((sector: SectorModel) => {
      if (sector.idsector === idSector) name = sector.nombre;
    });

    const data = {
      id_sector: idSector,
      cantidad: amount,
      nombre: name
    }

    this.aggregateSectors.push(data);

  }

  public existSector = (idSector: number) => {
    let exist: boolean = false;

    this.aggregateSectors.forEach((sector:any) => {
      if (sector.id_sector === idSector) exist = true;
    });

    return exist;
  }

  public deleteSector = (idSector:number) => {
    
    const newAggregateSectors = this.aggregateSectors.filter((sector:any) => {

      if (sector.id_sector === idSector) return false;
      return true

    }).map((sector:any) => {return sector});
    
    this.aggregateSectors = newAggregateSectors;

  }
}
