import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public isLoading: boolean = true;
  public isCreateUser: boolean = false;

  public sendingData: boolean = false;

  public userForm = this.fb.group({
    nombre_usuario    : [,[Validators.required]],
    email             : [,[Validators.required,Validators.email]],
    contrasena        : [,[Validators.required, Validators.minLength(5)]],
    rol               : ['',[Validators.required, Validators.minLength(1)]]
  });

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.isLoading = false;
    }, 10);

  }

  public isError = (name: string) => {
    return this.userForm.get(name)?.invalid;
  }

  public create = () => {
    if (this.userForm.invalid) return;
  }

}
