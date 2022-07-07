import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreasComponent } from './areas/areas.component';
import { ControllerListComponent } from './events/controller-list/controller-list.component';
import { CreateEventComponent } from './events/create-event/create-event.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { LocationsComponent } from './locations/locations.component';
import { PagesComponent } from './pages.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    children: [
      { path: 'lista-eventos', component: EventListComponent },
      { path: 'evento/controladores/:id', component: ControllerListComponent },
      { path: 'evento/:id', component: CreateEventComponent },
      { path: 'ubicacion/:id', component: LocationsComponent },
      { path: 'area/:id', component: AreasComponent },
      { path: 'usuario', component: UserComponent },
      { path: '**', redirectTo: '/dashboard/lista-eventos', pathMatch: 'full' },
      { path: '', redirectTo: '/dashboard/lista-eventos', pathMatch: 'full', }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
