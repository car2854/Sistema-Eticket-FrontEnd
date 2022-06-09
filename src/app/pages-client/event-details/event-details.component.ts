import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLinkActive } from '@angular/router';
import { errorHelpers } from 'src/app/helpers/helpers';
import { DateModel } from 'src/app/models/date';
import { EventModel } from 'src/app/models/event';
import { LocationModel } from 'src/app/models/location';
import { TicketDataService } from 'src/app/services/dataServices/ticket-data.service';
import { EventService } from 'src/app/services/event.service';
import { SectorService } from 'src/app/services/sector.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {

  @ViewChild('refModal') refModal!: ElementRef;

  public initPosition!: any;

  public isLoading: boolean = true;
  public isLoadingDate: boolean = false;

  public event!: EventModel;
  public date: DateModel[] = [];

  public dataForm = this.fb.group({
    idLocation: [0, [Validators.required, Validators.min(1)]],
    idDate: [0, [Validators.required, Validators.min(1)]]
  });

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private sectorService: SectorService,
    private ticketDataService: TicketDataService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    const id = parseInt(this.route.snapshot.paramMap.get('id') ?? '0');

    this.eventService.getEventPublic(id)
      .subscribe({
        error: (err:any) => {
          errorHelpers(err);
          this.isLoading = false;
        },
        next: (resp:any) => {
          this.event = resp;
          this.isLoading = false;
        }
      });

  }

  public changeLocation = () => {

    

    if (this.dataForm.get('idLocation')?.value != ''){

      this.isLoadingDate = true;

      const idLocation = parseInt(this.dataForm.get('idLocation')?.value || '0');

      

      this.event.ubicaciones.forEach((location: LocationModel) => {

        
        if (location.idubicacion === idLocation) {
          this.initPosition = {lat: location.latitud,lng: location.longitud}
        };
          

      });

      this.eventService.getTimeEventPublic(idLocation)
        .subscribe({
          error: (err:any) => {
            errorHelpers(err);
            this.isLoadingDate = false;
          },
          next: (resp:any) => {
            this.date = resp;
            this.isLoadingDate = false;
            
          }
        });
    }
    

  }

  public selectData = () => {

    if (this.dataForm.invalid) return;

    // this.eventService
    const idLocation = parseInt(this.dataForm.get('idLocation')?.value || '0');
    const idDate = parseInt(this.dataForm.get('idDate')?.value || '0');

    this.event.ubicaciones.forEach((location:LocationModel) => {
      if (location.idubicacion === idLocation) this.ticketDataService.location = location;
    });

    this.date.forEach((date: DateModel) => {
      if (date.idhorario === idDate) this.ticketDataService.date = date;
    });

    this.sectorService.getSectorPublic(idLocation)
      .subscribe({
        error: (err:any) => {
          errorHelpers(err);
        },
        next: (resp:any) => {
          this.ticketDataService.sectors = resp;
          this.refModal.nativeElement.click();
        }
      });
    
  }

  public showMap = () => {

    const content = document.getElementsByTagName('html')[0];
    content.scrollTop = 10000000;

  }
}
