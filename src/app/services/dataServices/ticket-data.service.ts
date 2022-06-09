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

  constructor() { }
}
