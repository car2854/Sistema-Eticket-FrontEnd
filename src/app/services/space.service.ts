import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class SpaceService {

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

  constructor(
    private httpClient: HttpClient
  ) { }

  public deleteSpace = (id:number) => {
    return this.httpClient.delete(`${base_url}/v1.0.0/espacios/${id}`, this.header);
  }
  
  public createSpace = (data:any, cantidad: number = 1) => {
    return this.httpClient.post(`${base_url}/v1.0.0/espacios/${cantidad}`, data, this.header);
  }

  public updateSpace = (data:any, id:number) => {
    return this.httpClient.put(`${base_url}/v1.0.0/espacios/${id}`, data, this.header);
  }
}
