import { Injectable } from '@angular/core';
import { EventModel } from 'src/app/models/event';

@Injectable({
  providedIn: 'root'
})
export class EventsDataService {

  public events: EventModel[] = [];

  constructor() { }
}
