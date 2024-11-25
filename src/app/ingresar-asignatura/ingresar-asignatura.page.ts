import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-ingresar-asignatura',
  templateUrl: './ingresar-asignatura.page.html',
  styleUrls: ['./ingresar-asignatura.page.scss'],
})
export class IngresarAsignaturaPage {
  nombreAsignatura = '';
  codigoAsignatura = '';

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router,
    private alertController: AlertController
  ) {}

  async confirmarGuardar() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de guardar esta asignatura?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sí',
          handler: () => {
            this.guardarAsignatura();
          },
        },
      ],
    });

    await alert.present();
  }

  guardarAsignatura() {
    this.auth.currentUser.then((user) => {
      if (user) {
        const uidProfesor = user.uid;
        const idDocumento = `${this.nombreAsignatura}${this.codigoAsignatura}`; // Combina el nombre y el código
  
        // Guardar la asignatura en Firestore
        this.firestore
          .collection('Ramos')
          .doc(idDocumento)
          .set({
            UIDProfesor: uidProfesor,
          })
          .then(() => {
            // Crear subcolección vacía "Alumnos"
            this.firestore
              .collection('Ramos')
              .doc(idDocumento)
              .collection('Alumnos')
              .doc(); // Crear la subcolección vacía
  
            // Limpiar los campos del formulario
            this.nombreAsignatura = '';
            this.codigoAsignatura = '';
  
            // Redirigir al menú del profesor
            this.router.navigate(['/menu-profesor']);
          })
          .catch((error) => {
            console.error('Error al guardar la asignatura:', error);
          });
      }
    });
  }
  
}
