import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesRoutingModule } from './pages/pages-routing.module';

const routes: Routes = [
  { path: '**', redirectTo: '/dashboard/lista-eventos', pathMatch: 'full' },
  { path: '', redirectTo: '/dashboard/lista-eventos', pathMatch: 'full', }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    PagesRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
