import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { errorHelpers } from 'src/app/helpers/helpers';
import { ErrorDataService } from 'src/app/services/dataServices/error-data.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-client',
  templateUrl: './register-client.component.html',
  styleUrls: ['./register-client.component.css']
})
export class RegisterClientComponent implements OnInit {

  public sendingData: boolean = false;

  public registerForm = this.fb.group({
    nombre_usuario    : ['carlos',[Validators.required]],
    email             : ['carlos@gmail.com',[Validators.required,Validators.email]],
    contrasena        : ['123456789',[Validators.required, Validators.minLength(5)]],
    confirContraseña  : ['12345678',[Validators.required, Validators.minLength(5)]]
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    public errorDataService: ErrorDataService
  ) { }
  
  ngOnInit(): void {
  }

  public isError = (value:string) => {
    return this.registerForm.get(value)?.invalid;
  }

  public contrasenias(){
    const pass1 = this.registerForm.get('contrasena')?.value;
    const pass2 = this.registerForm.get('confirContraseña')?.value;

    if (pass1 !== pass2){
      return true;
    }else{
      return false;
    }
  }

  public register = async() => {

    this.errorDataService.errors = [];
    
    if (this.registerForm.invalid || this.contrasenias()){

      if (this.registerForm.get('nombre_usuario')?.invalid) this.errorDataService.errors.push('El nombre el obligatorio');
      if (this.registerForm.get('email')?.invalid) this.errorDataService.errors.push('El email es invalido');
      if (this.registerForm.get('contrasena')?.invalid) this.errorDataService.errors.push('La contraseña debe ser mayor a 5 caracteres');
      if (this.contrasenias()) this.errorDataService.errors.push('No coinciden las contraseñas');

      return
    };

    const data = {
      ...this.registerForm.value,
      rol: 'cliente'
    }

    this.sendingData = true;
    
    this.userService.registerClient(data)
      .subscribe({
        error: (err:any) => {
          errorHelpers(err);
          this.sendingData = false;
        },
        next: (resp:any) => {
          console.log(resp);
          
          Swal.fire({
            icon: 'success',
            title: 'Completado',
            text: 'Se le a enviado un mensaje a su correo para verificar la cuenta',
          });
          this.sendingData = false;
          this.router.navigateByUrl('/auth/login');

        }
      });
    
    
    
  }
}
