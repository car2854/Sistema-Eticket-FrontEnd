import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { EmptyComponent } from './empty/empty.component';



@NgModule({
  declarations: [
    LoadingComponent,
    EmptyComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingComponent,
    EmptyComponent
  ]
})
export class ComponentsModule { }
