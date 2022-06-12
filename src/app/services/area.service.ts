import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  constructor(
    private httpClient: HttpClient
  ) { }

  get header(){
    return {
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${this.token}`
      }
    }
  }

  get token(){
    return localStorage.getItem('token') || '';
  }

  public getArea = (id:number) => {
    return this.httpClient.get(`${base_url}/v1.0.0/sectores/${id}`, this.header);
  }

  public updateArea = (id:number, data:any) => {
    return this.httpClient.put(`${base_url}/v1.0.0/sectores/${id}`, data, this.header);
  }

}
