import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreasComponent } from './areas/areas.component';
import { CreateEventComponent } from './events/create-event/create-event.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { LocationsComponent } from './locations/locations.component';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    children: [
      { path: 'lista-eventos', component: EventListComponent },
      { path: 'evento/:id', component: CreateEventComponent },
      { path: 'ubicacion/:id', component: LocationsComponent },
      { path: 'area/:id', component: AreasComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
