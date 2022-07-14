import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { errorHelpers } from 'src/app/helpers/helpers';
import { DataLoading } from 'src/app/models/dataLoading';
import { EventModel } from 'src/app/models/event';
import { LocationModel } from 'src/app/models/location';
import { eventPDF } from 'src/app/pdf/eventPdf';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  @ViewChild('refButtonModal') refButtonModal!:ElementRef;

  public dataLoading!: DataLoading;

  public isLoading = true;
  public isDownload = false;
  public events: EventModel[] = [];
  public ubicacions: LocationModel[] = [];

  public dataForm = this.fb.group({
    idubicacion: [0, [Validators.required, Validators.min(1)]]
  });

  private idSelectedEvento: number = 0;
  private idSelectedLocation: number = 0;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService
  ) { }

  ngOnInit(): void {

    this.eventService.getEvents()
      .subscribe({
        error: (err:any) => {
          errorHelpers(err);
          this.isLoading = false;
        },
        next: (resp:any) => {
          this.events = resp;
          this.isLoading = false;
        }
      });

  }


  public openDownload = (event:EventModel) => {
    this.ubicacions = event.ubicacions;
    this.idSelectedEvento = event.idevento;
    this.refButtonModal.nativeElement.click();
  }

  public download = () => {
    if (this.dataForm.invalid) return;

    this.isDownload = true;
    const id = parseInt(this.dataForm.get('idubicacion')?.value || '0');

    this.eventService.getInfoDownload(id)
      .subscribe({
        error: (err:any) => {
          errorHelpers(err);
          this.isDownload = false;
        },
        next: (data:any) => {
          
          this.isDownload = false;
          this.dataLoading = data;
          eventPDF(this.dataLoading);

        }
      });

  }
}
