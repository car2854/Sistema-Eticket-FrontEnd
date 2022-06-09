import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { errorHelpers } from 'src/app/helpers/helpers';
import { ErrorDataService } from 'src/app/services/dataServices/error-data.service';
import { TicketDataService } from 'src/app/services/dataServices/ticket-data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public sendingData: boolean = false;

  public loginForm = this.fb.group({
    email       : ['test@mail.com',[Validators.required, Validators.email]],
    contrasena  : ['12345', [Validators.required, Validators.minLength(5)]]
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private ticketDataService: TicketDataService,
    public errorDataService: ErrorDataService
  ) { }

  ngOnInit(): void {
  }

  public isError = (name:string) => {
    return this.loginForm.get(name)?.invalid;
  }

  public loginUser = () => {
    if (this.loginForm.invalid){
      this.errorDataService.errors = [];

      if (this.loginForm.get('email')?.invalid) this.errorDataService.errors.push('El email es invalido');
      if (this.loginForm.get('contrasena')?.invalid) this.errorDataService.errors.push('La contraseña debe ser mayor a 5 caracteres');

      return;
    }

    this.sendingData = true;
    
    this.userService.login(this.loginForm.value)
      .subscribe({
        error: (err:any) => {
          errorHelpers(err);
          this.sendingData = false;
        },
        complete: () => {
          // TODO: Login
          this.sendingData = false;

          if (this.ticketDataService.goPay){
            this.router.navigateByUrl('/public/completar-pago');
          }else{
            this.router.navigateByUrl('/public/eventos');
          }

        }
      });

  }
}
