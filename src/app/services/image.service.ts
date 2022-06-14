import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ImageService {

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

  public deleteImg = (id:number) => {
    return this.httpClient.delete(`${base_url}/v1.0.0/imagenesEvento/${id}`, this.header);
  }

  public saveImage = async(imagen: File, id: number) => {

    try {
      const url = `${base_url}/v1.0.0/imagenesEvento`;
      const formData = new FormData();
      
      formData.append('idevento', id.toString());
      formData.append('image', imagen);

      const resp = await fetch( url, {
        method: 'POST',
        body: formData,
        headers: {
          'authorization': `Bearer ${this.token}`
        }
      });

      const data = await resp.json();

      if (data){
        return data;
      }else{
        
        return false;
      }

    } catch (error) {
      console.log(error);
      return false;
    }

  }
}
