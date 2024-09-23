import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarCamaraPage } from './registrar-camara.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrarCamaraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrarCamaraPageRoutingModule {}
