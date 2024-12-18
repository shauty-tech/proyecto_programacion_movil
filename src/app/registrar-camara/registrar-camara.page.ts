import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Storage } from '@ionic/storage-angular'; // Importar Storage

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
    private afAuth: AngularFireAuth,
    private storage: Storage // Inyectar Storage
  ) {}

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });

    this.initializeStorage(); // Inicializar Storage
  }

  async initializeStorage() {
    await this.storage.create(); // Crear instancia de Storage
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert('Permiso denegado', 'Debes otorgar permisos de cámara para continuar.');
      return;
    }

    try {
      const { barcodes } = await BarcodeScanner.scan();
      if (barcodes.length > 0) {
        const qrData = barcodes[0].displayValue;

        if (qrData) {
          try {
            const qrInfo = JSON.parse(qrData); // Parsear datos del QR
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
    } catch (error) {
      console.error('Error durante el escaneo:', error);
      this.presentAlert('Error', 'Hubo un problema al escanear el código QR.');
    }
  }

  async handleEnrollment(docRamo: string, uidClase: string): Promise<void> {
    const user = await this.afAuth.currentUser;

    if (user) {
      const uidUsuario = user.uid;

      try {
        // Definir una interfaz para los datos de usuario
        interface UserData {
          nom: string;
          apellPat: string;
          apellMat: string;
          email: string;
        }

        // Obtener los datos del usuario desde la colección 'users'
        const userDoc = await this.firestore.collection('users').doc(uidUsuario).get().toPromise();
        if (!userDoc.exists) {
          console.error('El usuario no existe en la colección "users".');
          this.presentAlert('Error', 'No se encontró tu información de usuario.');
          return;
        }

        const userData = userDoc.data() as UserData;

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
                Nombre: userData.nom || 'Desconocido',
                ApellidoPaterno: userData.apellPat || '',
                ApellidoMaterno: userData.apellMat || '',
                Email: userData.email || '',
              });

            console.log('Estudiante inscrito correctamente en el ramo:', docRamo);

            // Registrar asistencia en la Clase correspondiente
            await this.firestore
              .collection('Clase')
              .doc(uidClase)
              .collection('Alumnos')
              .doc(uidUsuario)
              .set({
                Nombre: userData.nom || 'Desconocido',
                ApellidoPaterno: userData.apellPat || '',
                ApellidoMaterno: userData.apellMat || '',
                Email: userData.email || '',
                UID: uidUsuario,
                Asistencia: true,
              });

            this.presentAlert('Éxito', 'Te has inscrito y tu asistencia fue registrada.');
          }
        }
      } catch (error) {
        console.error('Error durante la inscripción:', error);

        // Guardar datos en Ionic Storage si ocurre un error
        const attendanceData = {
          docRamo,
          uidClase,
          uidUsuario,
        };

        await this.storage.set('pendingAttendance', attendanceData);

        this.presentAlert(
          'Error',
          'Hubo un problema al procesar tu inscripción. Los datos se guardaron localmente y se intentarán enviar más tarde.'
        );
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
