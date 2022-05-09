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
}
