import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Loader } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environment.prod';

const apiKey = environment.apiKey;

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {
  
  private markers : any[] = [];

  private map!: google.maps.Map;
  
  @Output() eventEmitterSelectedCreateMarker = new EventEmitter<any>();

  @Input() initPositionUpdate: any = {};
  @Input() isUpdate: boolean = false;
  @Input() isCreate: boolean = true;
  @Input() initPosition: any = {};

  @Input() set changeLocation(location: any){
    
    this.initPosition = location;
    
    // Si el map existe, hacer esto, si no existe, no hacer nada
    if (this.map){
      if (this.markers){
        for (const marker in this.markers) {
          this.markers[marker].setMap(null);
        }
        this.markers = [];
      }
  
      const markets = new google.maps.Marker({
        position: {lat: parseFloat(this.initPosition.lat), lng: parseFloat(this.initPosition.lng)},
        map: this.map,
      });
  
      this.markers.push(markets);
  
      const initialLocation = new google.maps.LatLng(this.initPosition.lat, this.initPosition.lng);
      this.map.panTo(initialLocation);
    }

   
  }

  constructor() { }
  
  ngOnInit(): void {

    const loader = new Loader({
      apiKey: apiKey,
      version: "weekly",
      libraries: ["places"]
    });
    
    let mapOptions = {};

    if (this.isUpdate){
      mapOptions = {
        center: {lat: parseFloat(this.initPositionUpdate.lat), lng: parseFloat(this.initPositionUpdate.lng)},
        zoom: 14
      };
    
    }else if(!this.isCreate){

      mapOptions = {
        center: {lat: parseFloat(this.initPosition.lat), lng: parseFloat(this.initPosition.lng)},
        zoom: 14
      };

    }else{
      mapOptions = {
        center: {lat: -17.7837626, lng: -63.1572144},
        zoom: 14
      };
    }
    

    loader
      .load()
      .then((google) => {
        this.map = new google.maps.Map(document.getElementById("map")!, mapOptions);

        // Cuando el mapa tiene que actualizar su ubicacion
        if(this.isUpdate){
          const markets = new google.maps.Marker({
            position: {lat: parseFloat(this.initPositionUpdate.lat), lng: parseFloat(this.initPositionUpdate.lng)},
            map: this.map,
          });
    
          this.markers.push(markets);
        }

        // Cuando el mapa se visualiza sin asignar ubicacion
        if (!this.isCreate){
          const markets = new google.maps.Marker({
            position: {lat: parseFloat(this.initPosition.lat), lng: parseFloat(this.initPosition.lng)},
            map: this.map,
          });
    
          this.markers.push(markets);
        }

        // Cuando el mapa tiene que asignar una ubicacion
        if (this.isCreate){

          google.maps.event.addListener(this.map, 'click', ( event:any ) => {

            if (this.markers){
              for (const marker in this.markers) {
                this.markers[marker].setMap(null);
              }
              this.markers = [];
            }
  
            const myLatLng = { lat: event.latLng.lat(), lng: event.latLng.lng() };
            
            this.eventEmitterSelectedCreateMarker.emit(myLatLng);
  
            const markets = new google.maps.Marker({
              position: myLatLng,
              map: this.map,
            });
  
            this.markers.push(markets);
  
          });

        }

        
      })
      .catch(e => {
        // do something
      });
    
    
  }


}
