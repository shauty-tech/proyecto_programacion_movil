import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IngresarAsignaturaPageRoutingModule } from './ingresar-asignatura-routing.module';

import { IngresarAsignaturaPage } from './ingresar-asignatura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IngresarAsignaturaPageRoutingModule
  ],
  declarations: [IngresarAsignaturaPage]
})
export class IngresarAsignaturaPageModule {}
