import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { UserModel } from '../models/user';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user?: UserModel;

  constructor(
    private httpClient: HttpClient
  ) { }

  public login = (data:any) => {

    return this.httpClient.post(`${base_url}/v1.0.0/auth/login`, data)
      .pipe(
        tap((resp:any) => {
          localStorage.setItem('token', resp.token);
          this.login = resp;
        })
      );

  }

  public registerClient = (data:any) => {
    	return this.httpClient.post(`${base_url}/v1.0.0/auth/register`, data)
        .pipe(
          tap((resp:any) => {
            localStorage.setItem('token', resp.token);
            console.log(resp);
          })
        );
  }
}
