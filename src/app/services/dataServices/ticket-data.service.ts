import { Injectable } from '@angular/core';
import { DateModel } from 'src/app/models/date';
import { LocationModel } from 'src/app/models/location';

@Injectable({
  providedIn: 'root'
})
export class TicketDataService {

  public location!: LocationModel;
  public date!: DateModel;

  constructor() { }
}
