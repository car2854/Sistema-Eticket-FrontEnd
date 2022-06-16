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
      cantidad: amount
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
        
        if (sector.idsector === idSector && !this.existSpace(sector,idespacio)){
       
          sector.espacios.push(space);
          this.removeSpace(space);

        }
        
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

      this.removeSpace(space);
      

    }


  }

  public removeSpace = (spacioData: SpaceModel) => {
    this.spaces = this.spaces.filter((space: SpaceModel) => {
      if (space.idespacio === spacioData.idespacio) return false;
      return true;
    }).map((space:SpaceModel) => space);

    

  }

  public existSpace = (dataEspacio: any, spacioData: number) => {
    
    let exist: boolean = false;

    dataEspacio.espacios.forEach((spaceData:any) => {
      if (spaceData.idespacio === spacioData) exist = true;
    });
    return exist;
  }

  public existSector = (idSector: number) => {

    let exist: boolean = false;

    this.aggregateSectors.forEach((sector:any) => {
      if (sector.idsector === idSector) exist = true
    });

    return exist;
  }


  

  public deleteSector = (sector:any) => {

    if (sector.espacios.length === 0){
      // No tiene espacios
      this.aggregateSectors = this.aggregateSectors.filter((sectorData:any) => {
        if (sectorData.idsector === sector.idsector) return false;
        return true;
      }).map((sectorData:any) => sectorData);
    }else{

      // Eliminar el sector por completo
      this.aggregateSectors = this.aggregateSectors.filter((sectorData:any) => {
        if (sectorData.idsector === sector.idsector) return false;
        return true;
      }).map((sectorData:any) => sectorData);

      this.addDataSpace(this.spacesAux, sector.id);

    }

  }

  public deleteSpace = (sector:any, space: any) => {

    if (sector.espacios.length === 1){
      // Solo tiene un espacio
      this.aggregateSectors = this.aggregateSectors.filter((sectorData:any) => {
        if (sectorData.idsector === sector.idsector) return false;
        return true;
      }).map((sectorData:any) => sectorData);

      this.addDataSpace(this.spacesAux, sector.idsector);

    }else{
      // Tienen mas espacios
      this.aggregateSectors.forEach((sector: any) => {

        sector.espacios = sector.espacios.filter((spaceData:any) => {
          if (spaceData.idespacio === space.idespacio) return false;
          return true;
        }).map((spaceData:any) => spaceData);

      });

      this.addDataSpace(this.spacesAux, sector.idsector);

    }

  }

  public addDataSpace = (data:SpaceModel[], id:number) => {

    this.spaces = [];
    this.spacesAux = [];
    this.spacesAux = data;

    if (this.existSector(id)){
      this.aggregateSectors.forEach((sector:any) => {
        if (sector.idsector === id){
          
          data.forEach((space: SpaceModel) => {

            if (!this.existSpace(sector, space.idespacio)){
              this.spaces.push(space);
            }

          });
  
        }
      });
    }else{
      this.spaces = data;

    }

    
  }

  public calculatePriceSpaces = (data:any) => {
    let price = 0;

    if (data.espacios){
      data.espacios.forEach((space:any) => {
        price = price + parseFloat(space.precio);
      });

    }


    return price;
  }

  public calculatePriceTotal = () => {
    let price = 0;

    this.aggregateSectors.forEach((sector:any) => {
      
      if (sector.espacios){
        sector.espacios.forEach((space:any) => {
          price = price + parseFloat(space.precio);
        });
      }else{
        price = price + (parseFloat(sector.precio) * parseFloat(sector.cantidad));
      }
    });

    return price;
  }
}
