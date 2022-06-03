import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-client',
  templateUrl: './register-client.component.html',
  styleUrls: ['./register-client.component.css']
})
export class RegisterClientComponent implements OnInit {

  public errors: string[] = [];

  public registerForm = this.fb.group({
    nombre_usuario    : ['carlos',[Validators.required]],
    email             : ['carlos@gmail.com',[Validators.required,Validators.email]],
    contrasena        : ['123456789',[Validators.required, Validators.minLength(8)]],
    confirContraseña  : ['12345678',[Validators.required, Validators.minLength(8)]]
  });

  constructor(
    private fb: FormBuilder
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
    if (this.registerForm.invalid || this.contrasenias()){
      
      if (this.errors.length === 0){
        if (this.registerForm.get('nombre_usuario')?.invalid) this.errors.push('El nombre el obligatorio');
        if (this.registerForm.get('email')?.invalid) this.errors.push('El email es invalido');
        if (this.registerForm.get('contrasena')?.invalid) this.errors.push('La contraseña debe ser mayor a 8 caracteres');
        if (this.contrasenias()) this.errors.push('No coinciden las contraseñas');
      }

      setTimeout(() => {
        this.errors = [];
      }, 5000);

      return
    };

    console.log('send data');
    
    
  }
}
