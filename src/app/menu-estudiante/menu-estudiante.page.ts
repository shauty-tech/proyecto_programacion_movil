import { Component, OnInit } from '@angular/core';
import { ItemList } from 'src/app/interfaces/itemlist';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { getAuth } from "firebase/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Storage } from '@ionic/storage-angular';

// Interfaz para los datos del usuario
interface UserData {
  nom: string;
  apellPat: string;
  apellMat: string;
  email: string;
}

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
    private firestore: AngularFirestore,
    private storage: Storage
  ) {}

  async ngOnInit() {
    // Inicializar almacenamiento
    await this.storage.create();

    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });

    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      console.log("ID de usuario:", userId);
      this.checkPendingData(userId); // Revisar datos pendientes al iniciar sesión
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

  async checkPendingData(uidUsuario: string) {
    const pendingAttendance = await this.storage.get('pendingAttendance');

    if (pendingAttendance) {
      console.log('Datos pendientes encontrados:', pendingAttendance);
      const { docRamo, uidClase } = pendingAttendance;

      try {
        // Recuperar datos del usuario desde Firestore
        const userDoc = await this.firestore.collection('users').doc(uidUsuario).get().toPromise();
        if (!userDoc.exists) {
          console.error('El usuario no existe en la colección "users".');
          this.presentAlert('Error', 'No se pudo recuperar tu información de usuario.');
          return;
        }

        // Obtener datos con la interfaz 'UserData'
        const userData = userDoc.data() as UserData; // Utilizando la interfaz
        const nombre = userData.nom || 'Desconocido';
        const apellido = userData.apellPat || 'Desconocido';

        // Reenviar datos a Firestore
        await this.firestore
          .collection('Clase')
          .doc(uidClase)
          .collection('Alumnos')
          .doc(uidUsuario)
          .set({
            UID: uidUsuario,
            Asistencia: true,
            Nombre: nombre,
            Apellido: apellido,
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

  async presentAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
