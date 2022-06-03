import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { errorHelpers } from 'src/app/helpers/helpers';
import { CategoryModel } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { EventsDataService } from 'src/app/services/dataServices/events-data.service';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-navbar-public',
  templateUrl: './navbar-public.component.html',
  styleUrls: ['./navbar-public.component.css']
})
export class NavbarPublicComponent implements OnInit {
  
  @ViewChild('refSearchInput') refSearchInput!: ElementRef;

  public selectedCategory: string = '';

  public showCategories: boolean = false;

  public categories: CategoryModel[] = [];

  constructor(
    private categoryService: CategoryService,
    private eventService: EventService,
    private eventsDataService: EventsDataService
  ) { }

  ngOnInit(): void {
    this.categoryService.getCategories()
      .subscribe({
        error: (err:any) => {
          errorHelpers(err);
        },
        next: (resp:any) => {
          this.categories = resp;
        }
      });
  }

  public selectCategory = (name:string) => {

    if (this.selectedCategory === name) name = '';

    this.selectedCategory = name;
    this.eventService.getEventPublic('', this.selectedCategory)
      .subscribe({
        error: (err:any) => {
          errorHelpers(err);
        },
        next: (resp:any) => {
          this.eventsDataService.events = resp;
        }
      });
  }

  public search = () => {
    const value = this.refSearchInput.nativeElement.value;

    this.eventService.getEventPublic(value, this.selectedCategory)
    .subscribe({
      error: (err:any) => {
        errorHelpers(err);
      },
      next: (resp:any) => {
        this.eventsDataService.events = resp;
      }
    });
    
  }
}
