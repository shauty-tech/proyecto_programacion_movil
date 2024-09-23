import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuEstudiantePageRoutingModule } from './menu-estudiante-routing.module';

import { MenuEstudiantePage } from './menu-estudiante.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuEstudiantePageRoutingModule
  ],
  declarations: [MenuEstudiantePage]
})
export class MenuEstudiantePageModule {}
