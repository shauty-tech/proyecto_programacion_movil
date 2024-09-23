import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerAsistenciaEstudiantePage } from './ver-asistencia-estudiante.page';

const routes: Routes = [
  {
    path: '',
    component: VerAsistenciaEstudiantePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerAsistenciaEstudiantePageRoutingModule {}
