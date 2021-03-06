import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DateModel } from 'src/app/models/date';
import { SectorModel } from 'src/app/models/sector';
import { LocationService } from 'src/app/services/location.service';
import { SectorService } from 'src/app/services/sector.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

  public isUpdatingLocation: boolean = false;
  public isCreatingArea: boolean = false;
  public isUpdatingArea: boolean = false;

  public selectedMoment:any ;

  @ViewChild('refSectorModal') refSectorModal!: ElementRef;
  
  private idEvent: number = 0;

  public locationForm = this.fb.group({
    nombre: [,[Validators.required]],
    cantidad_de_personas: [,[Validators.required, Validators.min(1)]],
    direccion: [,[Validators.required]], 
    latitud: [0,[Validators.required]], 
    longitud: [0,[Validators.required]], 
    precio: [0, [Validators.min(0)]]
  });

  public sectorForm = this.fb.group({
    nombre: [,[Validators.required]],
    capacidad: [,[Validators.required, Validators.min(1)]],
    referencia: [],
    idubicacion: [,[Validators.required]],
  });

  public dateForm = this.fb.group({
    fecha_hora: [,[Validators.required]],
    idubicacion: [,[Validators.required]]
  });

  public dates: DateModel[] = [];
  public sectors: SectorModel[] = [];

  private loading: boolean[] = [true];

  public initialPosition: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private locationService: LocationService,
    private sectorService: SectorService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0');

    this.dateForm.get('idubicacion')?.setValue(id);
    this.sectorForm.get('idubicacion')?.setValue(id);
    

    this.locationService.getLocation(id)
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
          
          this.idEvent = resp.idevento;
          
          this.dates = resp.horarios;
          this.sectors = resp.sectors;
          
          this.locationForm.get('nombre')?.setValue(resp.nombre);
          this.locationForm.get('cantidad_de_personas')?.setValue(resp.cantidad_de_personas);
          this.locationForm.get('direccion')?.setValue(resp.direccion);
          this.locationForm.get('latitud')?.setValue(resp.latitud);
          this.locationForm.get('longitud')?.setValue(resp.longitud);
          this.locationForm.get('precio')?.setValue(resp.precio);
          
          this.initialPosition = {
            lat: resp.latitud,
            lng: resp.longitud
          }

          this.loading[0] = false;
        }
      });

  }

  public deleteSector = (sector: SectorModel) => {

    Swal.fire({
      title: 'Estas seguro?',
      text: `La area ${sector.nombre} se eliminara de forma permanente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.sectorService.deleteSector(sector.idsector)
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
              this.sectors.splice(this.sectors.indexOf(sector), 1);
              Swal.fire(
                'Eliminado!',
                `La area ${sector.nombre} a sido eliminado correctamente.`,
                'success'
              );
            }
          });
        
      }
    });

  }

  public deleteDate = (date: DateModel) => {
    this.locationService.deleteDate(date.idhorario)
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
        this.dates.splice(this.dates.indexOf(date), 1);
      }
      });
    }
    
    public isLoading = () => {
      return this.loading.includes(true);
  }
  
  public addDate = () => {

    const date:any = document.getElementById('refDate');
    this.dateForm.get('fecha_hora')?.setValue(date.value);
    if (this.dateForm.invalid) return;
    this.locationService.addDate(this.dateForm.value)
      .subscribe({
        error: (err:any) => {
          if (err.status === 403){
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: err.error.errors[0].msg,
            });
          }else{
            console.log(err);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: err.error.message,
            });
          }
        },
        next: (resp:any) => {
          console.log(resp);
          this.dates.push(resp);
        }
      });
  
  }

  public createSector = () => {
    if (this.sectorForm.invalid || this.locationForm.invalid) return;

    this.isCreatingArea = true;
    
    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    
    const {precio, ...data} = this.locationForm.value;

    this.locationService.updateLocation(id, data)
      .subscribe({
        error: (err:any) => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.error.message,
          });
          this.isCreatingArea = false;
        },
        complete: () => {
          
          this.sectorService.createSector(this.sectorForm.value)
            .subscribe({
              error: (err:any) => {
                this.isCreatingArea = false;
                console.log(err);
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: err.error.message,
                });
              },
              next: (resp:any) => {
                this.isCreatingArea = false;
                this.sectors.push(resp);
                this.refSectorModal.nativeElement.click();
                this.router.navigateByUrl(`/dashboard/area/${resp.idsector}`);
              }
            });
          
        }
      });

    
  }

  public updateSector = (sector: SectorModel) => {

    if (this.locationForm.invalid) return;

    this.isUpdatingArea = true;

    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0');

    const {precio, ...data} = this.locationForm.value;

    this.locationService.updateLocation(id, data)
      .subscribe({
        error: (err:any) => {
          console.log(err);
          this.isUpdatingArea = false;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.error.message,
          });
        },
        complete: () => {
          this.isUpdatingArea = false;
          this.router.navigateByUrl(`/dashboard/area/${sector.idsector}`);
        }
      });

  }

  public changeLatLng = (data:any) => {
    
    this.locationForm.get('latitud')?.setValue(data.lat);
    this.locationForm.get('longitud')?.setValue(data.lng);
    
  }

  public updateLocation = () => {
    if (this.locationForm.invalid) return;

    this.isUpdatingLocation = true;
    
    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    
    const {precio, ...data} = this.locationForm.value;

    if (this.sectors.length === 0){
      data.precio = precio;
    }

    this.locationService.updateLocation(id, data)
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
          this.router.navigateByUrl(`/dashboard/evento/${this.idEvent}`);
        }
      });
  }

  public isErrorLocation = (name:string) => {
    return this.locationForm.get(name)?.invalid;
  }
  
  public isErrorSector = (name:string) => {
    return this.sectorForm.get(name)?.invalid;
  }
  
}
