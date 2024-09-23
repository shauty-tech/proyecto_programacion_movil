import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrarCamaraPageRoutingModule } from './registrar-camara-routing.module';

import { RegistrarCamaraPage } from './registrar-camara.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrarCamaraPageRoutingModule
  ],
  declarations: [RegistrarCamaraPage]
})
export class RegistrarCamaraPageModule {}
