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

  public createSector = (data:any) => {
    return this.httpClient.post(`${base_url}/v1.0.0/sectores`, data);
  }

  public deleteSector = (id:number) => {
    return this.httpClient.delete(`${base_url}/v1.0.0/sectores/${id}`);
  }

  public getSectorPublic = (id:number) => {
    return this.httpClient.get(`${base_url}/v1.0.0/public/sectores/${id}`);
  }
}
