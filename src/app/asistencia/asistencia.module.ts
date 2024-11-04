import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsistenciaPageRoutingModule } from './asistencia-routing.module';
import { QrCodeModule } from 'ng-qrcode';
import { AsistenciaPage } from './asistencia.page';
import { ComponentsModule } from "../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsistenciaPageRoutingModule,
    ComponentsModule,
    QrCodeModule 
  ],
  declarations: [AsistenciaPage]
})
export class AsistenciaPageModule {}
