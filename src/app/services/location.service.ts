import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class LocationService {

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

  public createLocation = (data:any) => {
    return this.httpClient.post(`${base_url}/v1.0.0/ubicaciones`,data, this.header);
  }
  
  public getLocation = (id:number) => {
    return this.httpClient.get(`${base_url}/v1.0.0/ubicaciones/${id}`, this.header);
  }
  
  public deleteLocation = (id:number) => {
    return this.httpClient.delete(`${base_url}/v1.0.0/ubicaciones/${id}`, this.header);
  }

  public updateLocation = (id:number, data:any) => {
    return this.httpClient.put(`${base_url}/v1.0.0/ubicaciones/${id}`, data, this.header);
  }
  
  public addDate = (data:any) => {
    return this.httpClient.post(`${base_url}/v1.0.0/horarios`,data, this.header);
  }
  
  public deleteDate = (id:number) => {
    return this.httpClient.delete(`${base_url}/v1.0.0/horarios/${id}`, this.header);
  }
}
