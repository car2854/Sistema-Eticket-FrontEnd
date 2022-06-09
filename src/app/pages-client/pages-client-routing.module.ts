import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompletePaymentComponent } from './complete-payment/complete-payment.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { MainComponent } from './main/main.component';
import { PagesClientComponent } from './pages-client.component';

const routes: Routes = [
  {
    path: 'public',
    component: PagesClientComponent,
    children: [
      { path: 'eventos', component: MainComponent },
      { path: 'evento/:id', component: EventDetailsComponent },
      { path: 'completar-pago', component: CompletePaymentComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesClientRoutingModule { }
