import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { PagesClientRoutingModule } from './pages-client/pages-client-routing.module';
import { PagesRoutingModule } from './pages/pages-routing.module';

const routes: Routes = [
  // { path: '**', redirectTo: '/dashboard/lista-eventos', pathMatch: 'full' },
  // { path: '', redirectTo: '/dashboard/lista-eventos', pathMatch: 'full', }
  { path: '**', redirectTo: '/public/eventos', pathMatch: 'full' },
  { path: '', redirectTo: '/public/eventos', pathMatch: 'full', }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    PagesRoutingModule,
    PagesClientRoutingModule,
    AuthRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
