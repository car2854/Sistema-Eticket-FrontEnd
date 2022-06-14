import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PayService {

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

  public pay = (data:any) => {
    return this.httpClient.post(`${base_url}/v1.0.0/Compras`, data, this.header);
  }

  public getPaymentType = () => {
    return this.httpClient.get(`${base_url}/v1.0.0/TipoPagos`, this.header);
  }

}
