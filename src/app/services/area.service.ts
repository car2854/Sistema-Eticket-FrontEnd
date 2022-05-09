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

  public getArea = (id:number) => {
    return this.httpClient.get(`${base_url}/v1.0.0/sectores/${id}`);
  }
}
