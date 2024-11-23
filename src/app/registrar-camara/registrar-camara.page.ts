import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-registrar-camara',
  templateUrl: './registrar-camara.page.html',
  styleUrls: ['./registrar-camara.page.scss'],
})
export class RegistrarCamaraPage implements OnInit {
  isSupported = false;
  barcodes: Barcode[] = [];

  constructor(
    private alertController: AlertController,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert('Permiso denegado', 'Debes otorgar permisos de cámara para continuar.');
      return;
    }

    const { barcodes } = await BarcodeScanner.scan();
    if (barcodes.length > 0) {
      const qrData = barcodes[0].displayValue;

      if (qrData) {
        try {
          const qrInfo = JSON.parse(qrData);
          console.log('Datos del QR:', qrInfo);

          const uidClaseGenerada = qrInfo.UIDClaseGenerada;
          const docRamo = qrInfo.Clase; // Nombre del documento de la colección 'Ramos'

          await this.handleEnrollment(docRamo, uidClaseGenerada);
        } catch (error) {
          console.error('Error al parsear el QR:', error);
          this.presentAlert('Error', 'No se pudo procesar el código QR.');
        }
      }
    }
  }

  async handleEnrollment(docRamo: string, uidClase: string): Promise<void> {
    const user = await this.afAuth.currentUser;

    if (user) {
      const uidUsuario = user.uid;

      try {
        // Verificar si el estudiante ya está inscrito en el Ramo
        const alumnoSnapshot = await this.firestore
          .collection('Ramos')
          .doc(docRamo)
          .collection('Alumnos')
          .doc(uidUsuario)
          .get()
          .toPromise();

        if (alumnoSnapshot.exists) {
          console.log('El estudiante ya está inscrito en este ramo.');
          this.presentAlert('Información', 'Ya estás inscrito en este ramo.');
        } else {
          // Preguntar si desea inscribirse
          const confirm = await this.confirmAction(
            'Inscripción requerida',
            'No estás inscrito en este ramo. ¿Deseas inscribirte?'
          );

          if (confirm) {
            // Inscribir al estudiante en el Ramo
            await this.firestore
              .collection('Ramos')
              .doc(docRamo)
              .collection('Alumnos')
              .doc(uidUsuario)
              .set({
                Nombre: user.displayName || 'Desconocido',
                Asistencia: false,
              });

            console.log('Estudiante inscrito correctamente en el ramo:', docRamo);

            // Registrar asistencia en la Clase correspondiente
            await this.firestore
              .collection('Clase')
              .doc(uidClase)
              .collection('Alumnos')
              .doc(uidUsuario)
              .set({
                Nombre: user.displayName || 'Desconocido',
                UID: uidUsuario,
                Asistencia: true,
              });

            this.presentAlert('Éxito', 'Te has inscrito y tu asistencia fue registrada.');
          }
        }
      } catch (error) {
        console.error('Error durante la inscripción:', error);
        this.presentAlert('Error', 'Hubo un problema al procesar tu inscripción.');
      }
    } else {
      console.error('No hay usuario autenticado');
      this.presentAlert('Error', 'No se detectó un usuario autenticado.');
    }
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async confirmAction(header: string, message: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header,
        message,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve(false),
          },
          {
            text: 'Aceptar',
            handler: () => resolve(true),
          },
        ],
      });
      await alert.present();
    });
  }
}
