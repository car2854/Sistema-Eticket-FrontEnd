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

  public deleteImg = (id:number) => {
    return this.httpClient.delete(`${base_url}/v1.0.0/imagenesEvento/${id}`);
  }

  public saveImage = async(imagen: File, id: number) => {

    try {
      const url = `${base_url}/v1.0.0/imagenesEvento`;
      const formData = new FormData();
      
      formData.append('idevento', id.toString());
      formData.append('image', imagen);

      const resp = await fetch( url, {
        method: 'POST',
        body: formData
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
