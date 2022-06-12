import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SpaceModel } from 'src/app/models/space';
import { AreaService } from 'src/app/services/area.service';
import { SpaceService } from 'src/app/services/space.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css']
})
export class AreasComponent implements OnInit {

  public isFileAmount: boolean = false;

  public isUpdatingArea: boolean = false;
  public isCreatingSpace: boolean = false;
  public isDeletingSpace: boolean = false;

  @ViewChild('refCreateSpaceModal') refCreateSpaceModal!: ElementRef;

  private idLocation: number = 0;

  private idUpdate: number = 0;

  public areaForm = this.fb.group({
    nombre: [,[Validators.required]],
    capacidad: [,[Validators.required, Validators.min(1)]],
    referencia: [],
    idubicacion: [,[Validators.required]],
    precio: [0,[Validators.min(0)]]
  });

  public spaceForm = this.fb.group({
    identificador: [,[Validators.required]],
    tipo_de_espacio: [,[Validators.required]],
    cantidad_de_personas: [,[Validators.required, Validators.min(1)]],
    idsector: [,[Validators.required]],
    cantidad: [],
    precio: [0, [Validators.required, Validators.min(0)]]
  });

  public spaces: SpaceModel[] = [];

  public isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private areaService: AreaService,
    private fb: FormBuilder,
    private spaceService: SpaceService,
    private router: Router
  ) { }

  ngOnInit(): void {

    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0');

    this.spaceForm.get('idsector')?.setValue(id);
    

    this.areaService.getArea(id)
      .subscribe({
        error: (err:any) => {
          console.log(err);
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.error.message,
          });
        },
        next: (resp:any) => {
          
          this.idLocation = resp.idubicacion;

          this.areaForm.get('nombre')?.setValue(resp.nombre);
          this.areaForm.get('capacidad')?.setValue(resp.capacidad);
          this.areaForm.get('referencia')?.setValue(resp.referencia);
          this.areaForm.get('idubicacion')?.setValue(resp.idubicacion);
          this.areaForm.get('precio')?.setValue(resp.precio);
          
          this.spaces = resp.espacios;
          this.isLoading = false;
        }
      })
  }

  public deleteSpace = (space: SpaceModel) => {

    Swal.fire({
      title: 'Estas seguro?',
      text: `El espacio ${space.identificador} se eliminara de forma permanente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.isDeletingSpace = true;

        this.spaceService.deleteSpace(space.idespacio)
          .subscribe({
            error: (err:any) => {
              console.log(err);
              this.isDeletingSpace = false;
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.error.message,
              });
            },
            complete: () => {
              this.isDeletingSpace = false;
              this.spaces.splice(this.spaces.indexOf(space),1);
              Swal.fire(
                'Eliminado!',
                `El espacio ${space.identificador} a sido eliminado correctamente.`,
                'success'
              );
            }
          });
        
      }
    });

  }

  public updateSpace = (space: SpaceModel) => {
    this.isFileAmount = false;
    this.spaceForm.get('identificador')?.setValue(space.identificador);
    this.spaceForm.get('tipo_de_espacio')?.setValue(space.tipo_de_espacio);
    this.spaceForm.get('cantidad_de_personas')?.setValue(space.cantidad_de_personas);
    this.spaceForm.get('precio')?.setValue(space.precio);
    this.idUpdate = space.idespacio;
    document.getElementById('refNewSpace')?.click();
  }

  public clickCreateSpace = () => {
    this.isFileAmount = true;
    this.spaceForm.reset();
    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    this.spaceForm.get('idsector')?.setValue(id);
    document.getElementById('refNewSpace')?.click();
  }

  public createSpace = () => {
    
    if (this.spaceForm.invalid) return;

    if (this.idUpdate === 0){

      if (this.areaForm.invalid) return;

      const id = parseInt(this.route.snapshot.paramMap.get('id') || '0');

      this.isCreatingSpace = true;

      const {precio, ...data} = this.areaForm.value;

      this.areaService.updateArea(id, data)
        .subscribe({
          error: (err:any) => {
            console.log(err);
            this.isCreatingSpace = false;
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: err.error.message,
            });
          },
          complete: () => {
            
            this.spaceService.createSpace(this.spaceForm.value, this.spaceForm.get('cantidad')?.value)
              .subscribe({
                error: (err:any) => {
                  console.log(err);
                  this.isCreatingSpace = false;
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err.error.message,
                  });
                },
                next: (resp:any) => {
                  console.log(resp);
                  
                  resp.forEach((space: any) => {
                    this.spaces.push(space);
                  });

                  this.isCreatingSpace = false;
                  this.refCreateSpaceModal.nativeElement.click();
                }
              });

          }
        });


      
    }else{


      if (this.areaForm.invalid) return;

      const id = parseInt(this.route.snapshot.paramMap.get('id') || '0');

      this.isCreatingSpace = true;

      const {precio, ...data} = this.areaForm.value;

      this.areaService.updateArea(id, data)
        .subscribe({
          error: (err:any) => {
            console.log(err);
            this.isCreatingSpace = false;
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: err.error.message,
            });
          },
          complete: () => {

            this.spaceService.updateSpace(this.spaceForm.value, this.idUpdate)
            .subscribe({
              error: (err:any) => {
                console.log(err);
                this.isCreatingSpace = false;
                this.idUpdate = 0;
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: err.error.message,
                });
              },
              next: (resp:any) => {
                
                this.isCreatingSpace = false;
                this.spaces.forEach((space: SpaceModel) => {
                  if (space.idespacio === this.idUpdate){
                    space.identificador = this.spaceForm.get('identificador')?.value;
                    space.tipo_de_espacio = this.spaceForm.get('tipo_de_espacio')?.value;
                    space.cantidad_de_personas = this.spaceForm.get('cantidad_de_personas')?.value;
                    this.refCreateSpaceModal.nativeElement.click();
                  }
                });
                this.idUpdate = 0;
              }
            });

          }
        });



      
    }

    
  }

  public updateArea = () => {

    
    if (this.areaForm.invalid) return;

    this.isUpdatingArea = true;

    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0');

    const {precio, ...data} = this.areaForm.value;
    if (this.spaces.length === 0){
      data.precio = precio;
    }

    this.areaService.updateArea(id, data)
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
          this.router.navigateByUrl(`/dashboard/ubicacion/${this.idLocation}`);
          this.isUpdatingArea = false;
        }
      });

  }

  public isErrorArea = (name:string) => {
    return this.areaForm.get(name)?.invalid;
  }

  public isErrorSpace = (name:string) => {
    return this.spaceForm.get(name)?.invalid;
  }
}
