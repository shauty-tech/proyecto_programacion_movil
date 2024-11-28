import { Component, OnInit } from '@angular/core';
import { ItemList } from 'src/app/interfaces/itemlist';
import { Router } from '@angular/router'; 
import { AlertController, ModalController } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { getAuth } from "firebase/auth";
import { Storage } from '@ionic/storage-angular'; // Importar Ionic Storage
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importar Firestore

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
      titulo: 'Ver asistencia',
      icono: 'school-outline'
    }
  ];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController,
    private storage: Storage, // Inyectar Storage
    private firestore: AngularFirestore // Inyectar Firestore
  ) {}

  async ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });

    await this.initializeStorage(); // Inicializar Storage

    // Verificar si hay datos pendientes en el almacenamiento
    this.checkPendingData();

    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      console.log("ID de usuario:", userId);
    } else {
      console.log("No hay ningún usuario autenticado.");
    }
  }

  async initializeStorage() {
    await this.storage.create();
  }

  async checkPendingData() {
    const pendingAttendance = await this.storage.get('pendingAttendance');

    if (pendingAttendance) {
      console.log('Datos pendientes encontrados:', pendingAttendance);
      const { docRamo, uidClase, uidUsuario } = pendingAttendance;

      try {
        // Reenviar datos a Firestore
        await this.firestore
          .collection('Clase')
          .doc(uidClase)
          .collection('Alumnos')
          .doc(uidUsuario)
          .set({
            UID: uidUsuario,
            Asistencia: true,
          });

        console.log('Datos reenviados exitosamente.');
        await this.storage.remove('pendingAttendance'); // Eliminar datos locales
        this.presentAlert('Éxito', 'Tus datos pendientes han sido registrados.');
      } catch (error) {
        console.error('Error al reenviar datos:', error);
        this.presentAlert(
          'Error',
          'No se pudo reenviar tus datos pendientes. Intentaremos nuevamente más tarde.'
        );
      }
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

  alertButtons = [
    {
      text: 'Aceptar',
      cssClass: 'btnAceptarStyle',
      handler: () => {
        this.accion = 'Presionó aceptar';
        this.router.navigate(['/home']);
      }
    },
    {
      text: 'Cancelar',
      cssClass: 'btnCancelarStyle',
      handler: () => {
        this.accion = "Presionó cancelar";
      }
    }
  ];

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

  async presentAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
