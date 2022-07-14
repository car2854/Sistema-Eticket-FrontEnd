import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { errorHelpers } from 'src/app/helpers/helpers';
import { ControllerModel } from 'src/app/models/controller';
import { DateModel } from 'src/app/models/date';
import { EventModel } from 'src/app/models/event';
import { UserModel } from 'src/app/models/user';
import { EventService } from 'src/app/services/event.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-controller-list',
  templateUrl: './controller-list.component.html',
  styleUrls: ['./controller-list.component.css']
})
export class ControllerListComponent implements OnInit {


  @ViewChild('refClose') refClose!: ElementRef;

  public userForm = this.fb.group({
    idcontrolador: [0,[Validators.required, Validators.min(1)]],
    idubicacion: [0,[Validators.required, Validators.min(1)]],
    idhorario: [0,[Validators.required, Validators.min(1)]],
  });

  public loading: boolean[] = [true,true,true];
  public isAddUser: boolean = false;
  
  public userModel: ControllerModel[] = [];
  public allUserModel: UserModel[] = [];
  public eventModel!: EventModel;
  public dateModel: DateModel[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private eventService: EventService,
    private userService: UserService
  ) { }

  ngOnInit(): void {

    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    
    this.eventService.getControllerEvent(id)
      .subscribe({
        error: (err:any) => {
          errorHelpers(err);
          this.loading[0] = false;
        },
        next: (resp:any) => {
          this.userModel = resp;
          this.loading[0] = false;

          this.userService.getUserController()
          .subscribe({
            error: (err:any) => {
              errorHelpers(err);
              this.loading[1] = false;
            },
            next: (resp:any) => {
              this.allUserModel = resp;
              
              this.loading[1] = false;
            }
          });

        }
      });


    this.eventService.getEventPublic(id)
      .subscribe({
        error: (err:any) => {
          errorHelpers(err);
          this.loading[2] = false;
        },
        next: (resp:any) => {
          console.log(resp);
          
          this.loading[2] = false;
          this.eventModel = resp;
        }
      });

   

  }

  public changeLocation = () => {

    const idLocation = parseInt(this.userForm.get('idubicacion')?.value || '0');
    
    this.eventService.getTimeEventPublic(idLocation)
      .subscribe({
        error: (err:any) => {
          errorHelpers(err);
        },
        next: (resp:any) => {
          this.dateModel = resp;
        }
      });

  }

  public isLoading = () => {
    return this.loading.includes(true);
  }

  public delete = (user: ControllerModel) => {

    Swal.fire({
      title: 'Estas seguro?',
      text: `El controlador ${user.nombre} no podra controlar este evento`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.eventService.removeControllerEvent(user.id, user.idubicacion, user.idhorario)
        .subscribe({
          error: (err:any) => {
            errorHelpers(err);
          },
          next: (_) => {
            this.userModel.splice(1, this.userModel.indexOf(user));
          },
          complete: () => {
            Swal.fire(
              'Eliminado!',
              'Este controlador ya no podra controlar este evento',
              'success'
            );
          }
        });

      }
    })

 

  }

  public addController = () => {

    if (this.userForm.invalid) return;

    this.isAddUser = true;
    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0');

    const data = {
      ...this.userForm.value,
      idevento: id
    }
    
    this.eventService.addControllerEvent(data)
      .subscribe({
        error: (err:any) => {
          errorHelpers(err);
          this.isAddUser = false;
        },
        next: (resp:any) => {

          let userSelect:any, locationSelect:any, timeSelect:any;

          const idcontroller = this.userForm.get('idcontrolador')?.value;
          const iddate = parseInt(this.userForm.get('idhorario')?.value);
          const idlocation = parseInt(this.userForm.get('idubicacion')?.value);
          
          this.allUserModel.forEach((user: UserModel) => {
            if (user.id === idcontroller) userSelect = user;
          });
      
          this.dateModel.forEach((date: DateModel) => {
            if (date.idhorario === iddate) timeSelect = date;
          });
      
          this.eventModel.ubicaciones.forEach((data:any) => {
            if (data.idubicacion === idlocation) locationSelect = data;
          });
          
          const newUser = new ControllerModel(resp.idcontrolador, timeSelect.fecha_hora, resp.idhorario, resp.idubicacion, userSelect.nombre, userSelect.rol, locationSelect.nombre)

          this.userModel.push(newUser);

          this.isAddUser = false;

          this.userForm.get('idcontrolador')?.setValue(0);
          this.userForm.get('idubicacion')?.setValue(0);
          this.userForm.get('idhorario')?.setValue(0);
          this.refClose.nativeElement.click();
        }
      });

  }
}
