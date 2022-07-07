import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { errorHelpers } from 'src/app/helpers/helpers';
import { DateModel } from 'src/app/models/date';
import { EventModel } from 'src/app/models/event';
import { UserModel } from 'src/app/models/user';
import { EventService } from 'src/app/services/event.service';
import { UserService } from 'src/app/services/user.service';

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
  
  public userModel: UserModel[] = [];
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
              
              this.verifyUser(resp);
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
          this.loading[2] = false;
          this.eventModel = resp;
        }
      });

   

  }

  public verifyUser = (userModelData: UserModel[]) => {

    userModelData.forEach((userModel1: UserModel) => {

      let exist = false;
      this.userModel.forEach((userModel2: UserModel) => {

        if (userModel1.id === userModel2.id) exist = true;

      });

      if (!exist) this.allUserModel.push(userModel1);
       
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

  public passController = (idcontroller: string) => {

  
    this.allUserModel = this.allUserModel.filter((userModel: UserModel) => {

      if (userModel.id === idcontroller) {
        this.userModel.push(userModel);
        return false;
      }
      return true;
    }).map((userModel: UserModel) => userModel);

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
          this.passController(resp.idcontrolador);
          this.isAddUser = false;

          this.userForm.get('idcontrolador')?.setValue(0);
          this.userForm.get('idubicacion')?.setValue(0);
          this.userForm.get('idhorario')?.setValue(0);
          this.refClose.nativeElement.click();
        }
      });

  }
}
