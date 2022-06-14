import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesClientRoutingModule } from './pages-client-routing.module';
import { PagesClientComponent } from './pages-client.component';
import { MainComponent } from './main/main.component';
import { SharedModule } from '../shared/shared.module';
import { EventDetailsComponent } from './event-details/event-details.component';
import { CategoryLengthPipe } from '../pipes/category-length.pipe';
import { ComponentsModule } from '../components/components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CompletePaymentComponent } from './complete-payment/complete-payment.component';


@NgModule({
  declarations: [
    PagesClientComponent,
    MainComponent,
    EventDetailsComponent,
    CategoryLengthPipe,
    CompletePaymentComponent
  ],
  imports: [
    CommonModule,
    PagesClientRoutingModule,
    SharedModule,
    ComponentsModule,
    ReactiveFormsModule,
  ]
})
export class PagesClientModule { }
