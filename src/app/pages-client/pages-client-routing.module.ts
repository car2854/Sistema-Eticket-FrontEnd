import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { PagesClientComponent } from './pages-client.component';

const routes: Routes = [
  {
    path: 'public',
    component: PagesClientComponent,
    children: [
      { path: 'eventos', component: MainComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesClientRoutingModule { }
