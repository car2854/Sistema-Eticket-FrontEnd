import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AppRoutingModule } from '../app-routing.module';
import { NavbarPublicComponent } from './navbar-public/navbar-public.component';



@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    NavbarPublicComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    NavbarPublicComponent
  ]
})
export class SharedModule { }
