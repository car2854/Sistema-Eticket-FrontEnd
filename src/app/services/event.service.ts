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

  public getEvents = () => {
    return this.http.get(`${base_url}/v1.0.0/eventosDatos`, this.header);
  }
  
  public createEvent = (data:any) => {
    return this.http.post(`${base_url}/v1.0.0/eventos`, data, this.header);
  }
  
  public getEvent = (id:number) => {
    return this.http.get(`${base_url}/v1.0.0/eventosDatos/${id}`, this.header);
  }

  public deleteEvent = (id:number) => {
    return this.http.delete(`${base_url}/v1.0.0/eventos/${id}`, this.header);
  }

  public updateEvent = (id:number, data:any) => {
    return this.http.put(`${base_url}/v1.0.0/eventos/${id}`, data, this.header);
  }

  public changeStatus = (id:number, data: any) => {
    return this.http.put(`${base_url}/v1.0.0/eventos/estado/${id}`, data, this.header);
  }

  public getEventsPublic = (nombre:string='', categoria:string='') => {
    return this.http.get(`${base_url}/v1.0.0/public/eventos?nombre=${nombre}&categoria=${categoria}`);
  }

  public getEventPublic = (id:number) => {
    return this.http.get(`${base_url}/v1.0.0/public/eventos/${id}`);
  }
  
  public getTimeEventPublic = (id:number) => {
    return this.http.get(`${base_url}/v1.0.0/public/horarios/${id}`);
  }


  
  public getControllerEvent = (id:number) => {
    return this.http.get(`${base_url}/v1.0.0/admin/eventos/controladores/${id}`, this.header);
  }

  public addControllerEvent = (data:any) => {
    return this.http.post(`${base_url}/v1.0.0/admin/asignar/controlador`, data, this.header);
  }
}
