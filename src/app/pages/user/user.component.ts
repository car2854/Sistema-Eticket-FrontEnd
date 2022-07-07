import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { errorHelpers } from 'src/app/helpers/helpers';
import { UserModel } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @ViewChild('refClose') refModal!: ElementRef;

  public userModel: UserModel[] = [];

  public isLoading: boolean = true;
  public isCreateUser: boolean = false;

  public sendingData: boolean = false;

  public userForm = this.fb.group({
    nombre_usuario    : [,[Validators.required]],
    email             : [,[Validators.required,Validators.email]],
    contrasena        : [,[Validators.required, Validators.minLength(5)]]
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit(): void {

    this.userService.getUserController()
      .subscribe({
        error: (err:any) => {
          errorHelpers(err);
          this.isLoading = false;
        },
        next: (resp:any) => {
          console.log(resp);
          
          this.userModel = resp;
          this.isLoading = false;
        }
      });

  }

  public isError = (name: string) => {
    return this.userForm.get(name)?.invalid;
  }

  public create = () => {
    if (this.userForm.invalid) return;

    this.isCreateUser = true;

    const data = {
      ...this.userForm.value,
      rol: 'controlador',
    }

    this.userService.registerController(data)
      .subscribe({
        error: (err:any) => {
          errorHelpers(err);
          this.isCreateUser = false;
        },
        next: (resp:any) => {

          const data = {
            ...resp,
            nombre: resp.nombre_usuario
          }

          this.userModel.push(data);
          
          this.isCreateUser = false;

          this.userForm.get('nombre_usuario')?.setValue(null);
          this.userForm.get('email')?.setValue(null);
          this.userForm.get('contrasena')?.setValue(null);
          
          this.refModal.nativeElement.click();
        }
      });




  }

}
