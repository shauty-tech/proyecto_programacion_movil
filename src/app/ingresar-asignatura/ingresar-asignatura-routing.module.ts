import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresarAsignaturaPage } from './ingresar-asignatura.page';

const routes: Routes = [
  {
    path: '',
    component: IngresarAsignaturaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IngresarAsignaturaPageRoutingModule {}
