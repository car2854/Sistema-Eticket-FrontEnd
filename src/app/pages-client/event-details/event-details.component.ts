import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLinkActive } from '@angular/router';
import { errorHelpers } from 'src/app/helpers/helpers';
import { DateModel } from 'src/app/models/date';
import { EventModel } from 'src/app/models/event';
import { LocationModel } from 'src/app/models/location';
import { TicketDataService } from 'src/app/services/dataServices/ticket-data.service';
import { EventService } from 'src/app/services/event.service';
import { LocationService } from 'src/app/services/location.service';
import { SectorService } from 'src/app/services/sector.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {

  @ViewChild('refModal') refModal!: ElementRef;
  @ViewChild('refModalSector') refModalSector!: ElementRef;

  public initPosition!: any;

  public isLoading: boolean = true;
  public isLoadingDate: boolean = false;
  public isSendingData: boolean = false;

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
    private locationService: LocationService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    // Limpiar el servicio de la data
    this.ticketDataService.aggregateSectors = [];
    this.ticketDataService.cantidad = 0;
    this.ticketDataService.goPay = false;
    
    this.ticketDataService.withoutSector = false;



    const id = parseInt(this.route.snapshot.paramMap.get('id') ?? '0');

    this.eventService.getEventPublic(id)
      .subscribe({
        error: (err:any) => {
          errorHelpers(err);
          this.isLoading = false;
        },
        next: (resp:any) => {
          this.event = resp;
          this.ticketDataService.event = resp;
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
            this.dataForm.get('idDate')?.setValue(0);
            this.date = resp;
            this.isLoadingDate = false;
          }
        });
    }
    

  }

  public selectData = () => {

    if (this.dataForm.invalid) return;

    this.isSendingData = true;

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
          this.isSendingData = false;
        },
        next: (resp:any) => {
          
          
          this.ticketDataService.sectors = resp;
          if (this.ticketDataService.sectors.length === 0){

            this.locationService.ticketsAvailablePublic(this.ticketDataService.date.idhorario, this.ticketDataService.location.idubicacion)
              .subscribe({
                error: (err:any) => {
                  errorHelpers(err);
                  this.isSendingData = false;
                },
                next: (resp:any) => {
                  this.isSendingData = false;
                  this.ticketDataService.ticketsAvailableWS = resp;
                  this.refModal.nativeElement.click();
                  this.ticketDataService.withoutSector = true;
                }
              });

          }else{
            this.refModalSector.nativeElement.click();
            this.isSendingData = false;
            this.ticketDataService.withoutSector = false;
          }
        }
      });
    
  }

  public showMap = () => {

    const content = document.getElementsByTagName('html')[0];
    content.scrollTop = 10000000;

  }

  public getLast = (image: string[]) => {
    return image[image.length-1]
  }
}
