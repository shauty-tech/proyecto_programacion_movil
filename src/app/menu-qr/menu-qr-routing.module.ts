import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuQRPage } from './menu-qr.page';

const routes: Routes = [
  {
    path: '',
    component: MenuQRPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuQRPageRoutingModule {}
