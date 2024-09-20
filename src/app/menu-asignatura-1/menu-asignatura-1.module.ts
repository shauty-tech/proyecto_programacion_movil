import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuAsignatura1PageRoutingModule } from './menu-asignatura-1-routing.module';

import { MenuAsignatura1Page } from './menu-asignatura-1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuAsignatura1PageRoutingModule
  ],
  declarations: [MenuAsignatura1Page]
})
export class MenuAsignatura1PageModule {}
