import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaAsistenciaPage } from './lista-asistencia.page';

const routes: Routes = [
  {
    path: '',
    component: ListaAsistenciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaAsistenciaPageRoutingModule {}
