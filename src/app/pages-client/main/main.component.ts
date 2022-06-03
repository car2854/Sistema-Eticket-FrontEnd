import { Component, OnInit } from '@angular/core';
import { EventModel } from 'src/app/models/event';
import { EventsDataService } from 'src/app/services/dataServices/events-data.service';
import { EventService } from 'src/app/services/event.service';

import { errorHelpers } from '../../helpers/helpers';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public isLoading = true;
  public events: EventModel[] = [];

  constructor(
    private eventService: EventService,
    private eventDataService: EventsDataService
  ) { }

  ngOnInit(): void {
    
    this.eventService.getEventPublic()
      .subscribe({
        error: (err:any) => {
          errorHelpers(err);
          this.isLoading = false;
        },
        next: (resp:any) => {
          this.isLoading = false;
          this.eventDataService.events = resp;
          this.events = this.eventDataService.events;
        }
      })

  }

}
