import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { errorHelpers } from 'src/app/helpers/helpers';
import { CategoryModel } from 'src/app/models/category';
import { EventModel } from 'src/app/models/event';
import { CategoryService } from 'src/app/services/category.service';
import { EventService } from 'src/app/services/event.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  
  public isCreatingEvent: boolean = false;

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
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.error.message,
          });
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
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.error.message,
          });
        },
        next: (resp:any) => {
          this.categories = resp;
        }
      })
  }

  public deleteEvent = (event : EventModel) => {

    Swal.fire({
      title: 'Estas seguro?',
      text: `El evento ${event.nombre} se eliminara de forma permanente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.eventService.deleteEvent(event.idevento)
        .subscribe({
          error: (err:any) => {
            errorHelpers(err);
          },
            complete: () => {
              this.events.splice(this.events.indexOf(event), 1);
              Swal.fire(
                'Eliminado!',
                `El evento ${event.nombre} a sido eliminado correctamente.`,
                'success'
              );
            }
          });

      }
    });

    
  }

  public create = () => {
    
    if (this.eventForm.invalid || this.eventForm.get('idcategoria')?.value === 0) return;

    this.isCreatingEvent = true;
    
    this.eventService.createEvent(this.eventForm.value)
    .subscribe({
      error: (err:any) => {
        console.log(err);
        this.isCreatingEvent = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error.message,
        });
      },
      next: (resp:any) => {
        this.isCreatingEvent = false;
        this.refClose.nativeElement.click();
        this.router.navigateByUrl(`/dashboard/evento/${resp.idevento}`);
        }
      });
    
  }

  public changeStatus = (event: EventModel) => {
    
    Swal.fire({
      title: 'Seleccione el estado',
      input: 'select',
      inputOptions: {
        'Activo': 'Activo',
        'Finalizado': 'Finalizado',
        'Cancelado': 'Cancelado',
        'Inactivo': 'Inactivo',
      },
      inputPlaceholder: 'Seleccione un estado',
      showCancelButton: true,
      inputValidator: (value) => {

        return new Promise ( (resolve, reject) => {
          if (value !== '') {
            
            const data = {
              estado: value
            }

            this.eventService.changeStatus(event.idevento, data)
              .subscribe({
                error: (err:any) => {

                  if (err.status === 400){
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: err.error.message,
                    });
                  }else{
                    Swal.fire({
                      icon: 'error',
                      title: 'Error interno',
                      text: 'No se puedo cambiar el estado',
                    });
                  }

                },
                next: (resp:any) => {
                  event.estado = value;
                  Swal.fire('Listo!', resp.message, 'success')
                }
              });

          } else {
            resolve('Tienes que seleccionar un estado');
          }
        });
      }
    }).then(function (result) {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          html: 'You selected: ' + result.value
        });
      }
    });

  }

  public isError = (name: string) => {

    if (name === 'idcategoria')
      return this.eventForm.get(name)?.value === 0;

      return this.eventForm.get(name)?.invalid
  }

}
