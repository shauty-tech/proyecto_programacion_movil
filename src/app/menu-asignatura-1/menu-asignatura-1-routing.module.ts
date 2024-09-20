import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuAsignatura1Page } from './menu-asignatura-1.page';

const routes: Routes = [
  {
    path: '',
    component: MenuAsignatura1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuAsignatura1PageRoutingModule {}
