import { Component, OnInit } from '@angular/core';
import { EventModel } from 'src/app/models/event';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

  public events: EventModel[] = [];
  public isLoading: boolean = true;

  constructor(
    private eventService: EventService
  ) { }

  ngOnInit(): void {

    this.eventService.getEvents()
      .subscribe({
        error: (err:any) => {
          console.log(err);
          this.isLoading = false;
        },
        next: (resp:any) => {
          this.isLoading = false;
          this.events = resp;
        }
      })

  }

}
