import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class SectorService {

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

  public createSector = (data:any) => {
    return this.httpClient.post(`${base_url}/v1.0.0/sectores`, data, this.header);
  }

  public deleteSector = (id:number) => {
    return this.httpClient.delete(`${base_url}/v1.0.0/sectores/${id}`, this.header);
  }

  public getSectorPublic = (id:number) => {
    return this.httpClient.get(`${base_url}/v1.0.0/public/sectores/${id}`);
  }

  public ticketsAvailablePublic = (id_sector: number, id_horario: number) => {
    return this.httpClient.get(`${base_url}/v1.0.0/public/sectores/entradas/disponibles?idhorario=${id_horario}&idsector=${id_sector}`);
  }
}
