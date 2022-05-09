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

  public createLocation = (data:any) => {
    return this.httpClient.post(`${base_url}/v1.0.0/ubicaciones`,data);
  }
  
  public getLocation = (id:number) => {
    return this.httpClient.get(`${base_url}/v1.0.0/ubicaciones/${id}`);
  }
  
  public deleteLocation = (id:number) => {
    return this.httpClient.delete(`${base_url}/v1.0.0/ubicaciones/${id}`);
  }

  public updateLocation = (id:number, data:any) => {
    return this.httpClient.put(`${base_url}/v1.0.0/ubicaciones/${id}`, data);
  }
  
  public addDate = (data:any) => {
    return this.httpClient.post(`${base_url}/v1.0.0/horarios`,data);
  }
  
  public deleteDate = (id:number) => {
    return this.httpClient.delete(`${base_url}/v1.0.0/horarios/${id}`);
  }
}
