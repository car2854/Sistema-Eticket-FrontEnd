import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesClientRoutingModule } from './pages-client-routing.module';
import { PagesClientComponent } from './pages-client.component';
import { MainComponent } from './main/main.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    PagesClientComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    PagesClientRoutingModule,
    SharedModule
  ]
})
export class PagesClientModule { }
