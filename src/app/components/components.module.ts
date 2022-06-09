import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { EmptyComponent } from './empty/empty.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { DetailsModalComponent } from './details-modal/details-modal.component';
import { LoadingDataComponent } from './loading-data/loading-data.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    LoadingComponent,
    EmptyComponent,
    GoogleMapComponent,
    DetailsModalComponent,
    LoadingDataComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    LoadingComponent,
    EmptyComponent,
    GoogleMapComponent,
    DetailsModalComponent,
    LoadingDataComponent
  ]
})
export class ComponentsModule { }
