import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { EmptyComponent } from './empty/empty.component';
import { GoogleMapComponent } from './google-map/google-map.component';



@NgModule({
  declarations: [
    LoadingComponent,
    EmptyComponent,
    GoogleMapComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingComponent,
    EmptyComponent,
    GoogleMapComponent
  ]
})
export class ComponentsModule { }
