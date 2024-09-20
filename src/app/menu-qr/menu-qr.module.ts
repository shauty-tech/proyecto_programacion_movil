import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuQRPageRoutingModule } from './menu-qr-routing.module';

import { MenuQRPage } from './menu-qr.page';
import { ComponentsModule } from "../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuQRPageRoutingModule,
    ComponentsModule
  ],
  declarations: [MenuQRPage]
})
export class MenuQRPageModule {}
