import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-registrar-camara',
  templateUrl: './registrar-camara.page.html',
  styleUrls: ['./registrar-camara.page.scss'],
})
export class RegistrarCamaraPage implements OnInit {
  isSupported = false;
  barcodes: Barcode[] = [];

  constructor(private alertController: AlertController, private firestore: AngularFirestore) { }

  ngOnInit(){
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
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


          await this.verifyAttendance(uidClaseGenerada);
        } catch (error) {
          console.error('Error al parsear el QR:', error);
        }
      }
    }
  }

  async verifyAttendance(uidClaseGenerada: string): Promise<void> {

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const uidUsuario = user.uid;


      try {
        const alumnoSnapshot = await this.firestore
          .collection('Clase')
          .doc(uidClaseGenerada)
          .collection('Alumnos')
          .doc(uidUsuario)
          .get()
          .toPromise();

        if (alumnoSnapshot.exists) {
    
          await this.firestore
            .collection('Clase')
            .doc(uidClaseGenerada)
            .collection('Alumnos')
            .doc(uidUsuario)
            .update({ Asistencia: true });

          console.log('Asistencia registrada para el estudiante:', uidUsuario);
          this.presentSuccessAlert();
        } else {
          console.error('El estudiante no está registrado en esta clase.');
          this.presentErrorAlert('El estudiante no está registrado en esta clase.');
        }
      } catch (error) {
        console.error('Error al verificar la asistencia:', error);
        this.presentErrorAlert('Error al registrar la asistencia.');
      }
    } else {
      console.error('No hay usuario autenticado');
    }
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permiso denegado',
      message: 'Para usar la aplicación, autoriza los permisos de cámara.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async presentSuccessAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Asistencia registrada',
      message: 'La asistencia ha sido registrada exitosamente.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async presentErrorAlert(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
