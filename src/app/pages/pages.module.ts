import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { CreateEventComponent } from './events/create-event/create-event.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { SharedModule } from '../shared/shared.module';
import { LocationsComponent } from './locations/locations.component';
import { AreasComponent } from './areas/areas.component';
import { ComponentsModule } from '../components/components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { UserComponent } from './user/user.component';
import { ControllerListComponent } from './events/controller-list/controller-list.component';
import { ReportComponent } from './report/report.component';


@NgModule({
  declarations: [
    PagesComponent,
    CreateEventComponent,
    EventListComponent,
    LocationsComponent,
    AreasComponent,
    UserComponent,
    ControllerListComponent,
    ReportComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    ComponentsModule,
    ReactiveFormsModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    BrowserAnimationsModule
  ]
})
export class PagesModule { }
