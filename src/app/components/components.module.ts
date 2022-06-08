import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { EmptyComponent } from './empty/empty.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { DetailsModalComponent } from './details-modal/details-modal.component';



@NgModule({
  declarations: [
    LoadingComponent,
    EmptyComponent,
    GoogleMapComponent,
    DetailsModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingComponent,
    EmptyComponent,
    GoogleMapComponent,
    DetailsModalComponent
  ]
})
export class ComponentsModule { }
