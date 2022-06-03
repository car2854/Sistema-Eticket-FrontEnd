import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private http: HttpClient
  ) { }

  public getEvents = () => {
    return this.http.get(`${base_url}/v1.0.0/eventosDatos`);
  }
  
  public createEvent = (data:any) => {
    return this.http.post(`${base_url}/v1.0.0/eventos`, data);
  }
  
  public getEvent = (id:number) => {
    return this.http.get(`${base_url}/v1.0.0/eventosDatos/${id}`);
  }

  public deleteEvent = (id:number) => {
    return this.http.delete(`${base_url}/v1.0.0/eventos/${id}`);
  }

  public updateEvent = (id:number, data:any) => {
    return this.http.put(`${base_url}/v1.0.0/eventos/${id}`, data);
  }

  public changeStatus = (id:number, data: any) => {
    return this.http.put(`${base_url}/v1.0.0/eventos/estado/${id}`, data);
  }

  public getEventPublic = () => {
    
    return this.http.get(`${base_url}/v1.0.0/public/eventos`);
  }

}
