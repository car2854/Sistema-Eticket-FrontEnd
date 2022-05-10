import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class SpaceService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public deleteSpace = (id:number) => {
    return this.httpClient.delete(`${base_url}/v1.0.0/espacios/${id}`);
  }
  
  public createSpace = (data:any) => {
    return this.httpClient.post(`${base_url}/v1.0.0/espacios`, data);
  }

  public updateSpace = (data:any, id:number) => {
    return this.httpClient.put(`${base_url}/v1.0.0/espacios/${id}`, data);
  }
}