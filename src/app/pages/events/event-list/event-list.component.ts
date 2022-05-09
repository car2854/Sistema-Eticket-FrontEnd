import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryModel } from 'src/app/models/category';
import { EventModel } from 'src/app/models/event';
import { CategoryService } from 'src/app/services/category.service';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  
  @ViewChild('refClose') refClose!: ElementRef;

  public eventForm = this.fb.group({
    nombre: [,[Validators.required]],
    idcategoria: [0,[Validators.required]]
  });
  
  public events: EventModel[] = [];
  public categories: CategoryModel[] = [];

  public isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private categoryService: CategoryService,
    private router: Router
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
      });


    this.categoryService.getCategories()
      .subscribe({
        error: (err:any) => {
          console.log(err);
        },
        next: (resp:any) => {
          this.categories = resp;
        }
      })
  }

  public deleteLocation = (event : EventModel) => {
    this.eventService.deleteEvent(event.idevento)
    .subscribe({
      error: (err:any) => {
        console.log(err);
      },
        complete: () => {
          this.events.splice(this.events.indexOf(event), 1);
        }
      });
  }

  public create = () => {
    
    if (this.eventForm.invalid || this.eventForm.get('idcategoria')?.value === 0) return;

    
    this.eventService.createEvent(this.eventForm.value)
    .subscribe({
      error: (err:any) => {
        console.log(err);
      },
      next: (resp:any) => {
        this.refClose.nativeElement.click();
        this.router.navigateByUrl(`/dashboard/evento/${resp.idevento}`);
        }
      });
    
  }

}
