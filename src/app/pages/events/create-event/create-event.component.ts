import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryModel } from 'src/app/models/category';
import { EventModel } from 'src/app/models/event';
import { LocationModel } from 'src/app/models/location';
import { CategoryService } from 'src/app/services/category.service';
import { EventService } from 'src/app/services/event.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {

  @ViewChild('refClose') refClose!: ElementRef;

  public eventForm = this.fb.group({
    contacto      : [],
    descripcion   : [],
    estado        : [,[Validators.required]],
    idcategoria   : [,[Validators.required]],
    idevento      : [,[Validators.required]],
    nombre        : [,[Validators.required]],
  }); 

  public locationForm = this.fb.group({
    nombre                : [,[Validators.required]],
    direccion             : [,[Validators.required]],
    latitud               : [0.111,[Validators.required]],
    longitud              : [0.111,[Validators.required]],
    cantidad_de_personas  : [,[Validators.required, Validators.min(1)]],
    idevento              : [,[Validators.required]],
  }); 

  public locations: LocationModel[] = [];
  public categories: CategoryModel[] = [];

  public loading: boolean[] = [true,true];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private eventService: EventService,
    private categoryService: CategoryService,
    private locationService: LocationService,
    private router: Router
  ) { }

  ngOnInit(): void {

    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    
    this.eventService.getEvent(id)
      .subscribe({
        error: (err:any) => {
          console.log(err);
          this.loading[0] = false;
        },
        next: (resp:any) => {

          this.locations = resp.ubicacions;
          

          this.eventForm.get('contacto')?.setValue(resp.contacto);
          this.eventForm.get('descripcion')?.setValue(resp.descripcion);
          this.eventForm.get('estado')?.setValue(resp.estado);
          this.eventForm.get('idcategoria')?.setValue(resp.idcategoria);
          this.eventForm.get('idevento')?.setValue(resp.idevento);
          this.eventForm.get('nombre')?.setValue(resp.nombre);
          this.locationForm.get('idevento')?.setValue(resp.idevento);

          this.loading[0] = false;
        }
      });
      
      
      this.categoryService.getCategories()
      .subscribe({
        error: (err:any) => {
          console.log(err);
          this.loading[1] = false;
        },
        next: (resp:any) => {
          this.categories = resp;
          this.loading[1] = false;
        }
      })

  }

  public isLoading = () => {
    return this.loading.includes(true);
  }

  public updateEvent = () => {
    console.log(this.eventForm.value);
    
  }

  public createLocation = () => {

    if (this.locationForm.invalid) return;
    
    this.locationService.createLocation(this.locationForm.value)
      .subscribe({
        error: (err:any) => {
          console.log(err);
        },
        next: (resp:any) => {
          
          this.refClose.nativeElement.click();
          this.router.navigateByUrl(`/dashboard/ubicacion/${resp.idubicacion}`);
        }
      })
  }

}
