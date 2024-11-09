import { Component, OnInit } from '@angular/core';
import { ItemList } from 'src/app/interfaces/itemlist';
import { Router } from '@angular/router'; 
import { AlertController, ModalController } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { getAuth } from "firebase/auth";

@Component({
  selector: 'app-menu-estudiante',
  templateUrl: './menu-estudiante.page.html',
  styleUrls: ['./menu-estudiante.page.scss'],
})
export class MenuEstudiantePage implements OnInit {

  isSupported = false;
  barcodes: Barcode[] = [];
  accion: string = '';
  clase: string = '';
  vinculos: ItemList[] = [
    {
      ruta: '/registrar-camara',
      titulo: 'Registrar asistencia',
      icono: 'walk-outline'
    },
    {
      ruta: '/ver-asistencia-estudiante',
      titulo: 'ver asistencia',
      icono: 'school-outline'
    }
  ];

  constructor(private router: Router, private alertController: AlertController, private modalController: ModalController) { }

  ngOnInit() {
    // Comprobamos si el escáner de códigos de barras es compatible
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });

    // Verificamos si el usuario está autenticado y obtenemos su UID
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      console.log("ID de usuario:", userId);
      // Aquí puedes pasar el ID del usuario a una lista, función, etc.
    } else {
      console.log("No hay ningún usuario autenticado.");
    }
  }

  async startScan() {
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      componentProps: { 
        formats: [],
        lensFacing: LensFacing
      }
    });

    await modal.present();
  }

  alertButtons = [{
    text: 'Aceptar',
    cssClass: 'btnAceptarStyle',
    handler: () => {
      this.accion = 'Presionó aceptar';
      this.router.navigate(['/home']);
    }
  }, {
    text: 'Cancelar',
    cssClass: 'btnCancelarStyle',
    handler: () => {
      this.accion = "Presionó cancelar";
    }
  }];

  async submitCodigo() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      subHeader: 'Cuidado',
      message: '¿Está seguro de cerrar su sesión actual?',
      buttons: this.alertButtons,
      backdropDismiss: false
    });
    await alert.present();
  }
}
