import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryModel } from 'src/app/models/category';
import { EventModel } from 'src/app/models/event';
import { ImageModel } from 'src/app/models/image';
import { LocationModel } from 'src/app/models/location';
import { CategoryService } from 'src/app/services/category.service';
import { EventService } from 'src/app/services/event.service';
import { ImageService } from 'src/app/services/image.service';
import { LocationService } from 'src/app/services/location.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {

  public isUpdatingEvent: boolean = false;
  public isCreatingLocation: boolean = false;
  public isUpdatingLocation: boolean = false;

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
    latitud               : [,[Validators.required]],
    longitud              : [,[Validators.required]],
    cantidad_de_personas  : [,[Validators.required, Validators.min(1)]],
    idevento              : [,[Validators.required]],
  }); 

  public locations: LocationModel[] = [];
  public categories: CategoryModel[] = [];
  public imageEvent: ImageModel[] = [];

  public loading: boolean[] = [true,true];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private eventService: EventService,
    private categoryService: CategoryService,
    private locationService: LocationService,
    private router: Router,
    private imageService: ImageService
  ) { }

  ngOnInit(): void {

    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    
    this.eventService.getEvent(id)
      .subscribe({
        error: (err:any) => {
          console.log(err);
          this.loading[0] = false;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.error.message,
          });
        },
        next: (resp:any) => {

          this.imageEvent = resp.imagenes_eventos;
          
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
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.error.message,
          });
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
    
    if (this.eventForm.invalid) return;
    
    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0');

    this.isUpdatingEvent = true;

    this.eventService.updateEvent(id, this.eventForm.value)
      .subscribe({
        error: (err:any) => {
          console.log(err);
          this.isUpdatingEvent = false;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.error.message,
          });
        },
        complete: () => {
          this.isUpdatingEvent = false;
          this.router.navigateByUrl('/dashboard/lista-eventos');
        }
      })
    
  }

  public deleteLocation = (location: LocationModel) => {

    Swal.fire({
      title: 'Estas seguro?',
      text: `La ubicacion ${location.nombre} se eliminara de forma permanente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.locationService.deleteLocation(location.idubicacion)
          .subscribe({
            error: (err:any) => {
              console.log(err);
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.error.message,
              });
            },
            complete: () => {
              this.locations.splice(this.locations.indexOf(location), 1);
              Swal.fire(
                'Eliminado!',
                `La ubicacion ${location.nombre} a sido eliminado correctamente.`,
                'success'
              );
            }
          });
        
      }
    });

  }

  public changeLatLng = (data:any) => {
    
    this.locationForm.get('latitud')?.setValue(data.lat);
    this.locationForm.get('longitud')?.setValue(data.lng);
    
  }

  public createLocation = () => {

    if (this.locationForm.invalid || this.eventForm.invalid) return;
    
    this.isCreatingLocation = true;

    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0');

    this.eventService.updateEvent(id, this.eventForm.value)
      .subscribe({
        error: (err:any) => {
          this.isCreatingLocation = false;
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.error.message,
          });
        },
        complete: () => {

          this.locationService.createLocation(this.locationForm.value)
          .subscribe({
            error: (err:any) => {
              this.isCreatingLocation = false;
              console.log(err);
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.error.message,
              });
            },
            next: (resp:any) => {
              
              this.isCreatingLocation = false;
              this.refClose.nativeElement.click();
              this.router.navigateByUrl(`/dashboard/ubicacion/${resp.idubicacion}`);
            }
          });

        }
      });


  }

  public newImagen = () => {
    document.getElementById('refNewImage')?.click();
  }

  public deleteImg = (image: ImageModel) => {
    
    this.imageService.deleteImg(image.idimagenevento)
      .subscribe({
        error: (err:any) => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.error.message,
          });
        },
        complete: () => {
          this.imageEvent.splice(this.imageEvent.indexOf(image), 1);
        }
      })
    
  }

  public changeImage = (event:Event) => {
    const target = event.target as HTMLInputElement
    let file: File = (target.files as FileList)[0];
    
    if (file){
      const id = parseInt(this.route.snapshot.paramMap.get('id') || '0');
      this.imageService.saveImage(file, id)
        .then(resp => {
          
          if (resp){
            this.imageEvent.push(resp[0]);          
          }
          
        }).catch(err => {
          console.log(err);
        });
    }

    target.value = '';
    
  }

  public updateLocation = (location: LocationModel) => {
    
    if (this.eventForm.invalid) return;

    this.isUpdatingLocation = true;

    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    
    this.eventService.updateEvent(id, this.eventForm.value)
      .subscribe({
        error: (err:any) => {
          this.isUpdatingLocation = false;
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.error.message,
          });
        },
        complete: () => {
          this.isUpdatingLocation = false;
          this.router.navigateByUrl(`/dashboard/ubicacion/${location.idubicacion}`);
        }
        });


  }

  public isErrorEvent = (name: string) => {

    if (name === 'idcategoria') return this.eventForm.get(name)?.value === 0;
    
    return this.eventForm.get(name)?.invalid;
  }
  
  public isErrorLocation = (name: string) => {
    return this.locationForm.get(name)?.invalid;
  }

}
