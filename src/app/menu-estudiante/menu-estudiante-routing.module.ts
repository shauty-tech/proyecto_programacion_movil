import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuEstudiantePage } from './menu-estudiante.page';

const routes: Routes = [
  {
    path: '',
    component: MenuEstudiantePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuEstudiantePageRoutingModule {}
