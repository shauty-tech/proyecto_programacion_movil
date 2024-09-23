import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerAsistenciaEstudiantePageRoutingModule } from './ver-asistencia-estudiante-routing.module';

import { VerAsistenciaEstudiantePage } from './ver-asistencia-estudiante.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerAsistenciaEstudiantePageRoutingModule
  ],
  declarations: [VerAsistenciaEstudiantePage]
})
export class VerAsistenciaEstudiantePageModule {}
