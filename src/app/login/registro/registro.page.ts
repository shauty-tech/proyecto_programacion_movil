import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  email: string = '';
  password: string = '';
  name: string = '';
  segnom: string = '';
  apellPat: string = '';
  apellMat: string = '';
  emailAlt: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private storage: Storage
  ) {
    this.storage.create();
  }

  ngOnInit() {}

  validateEmail(email: string): boolean {
    const regex = /^(.*)(@profesor\.cl|@alumno\.cl)$/;
    return regex.test(email);
  }

  async register() {
    if (!this.name || !this.apellPat || !this.email || !this.password) {
      const alert = await this.alertController.create({
        header: 'Campos incompletos',
        message: 'Por favor, complete todos los campos obligatorios (nombre, apellido paterno, correo y contraseña).',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (!this.validateEmail(this.email)) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'El correo electrónico debe terminar en @profesor.cl o @alumno.cl.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    try {
      const userCredential = await this.authService.register(
        this.email, 
        this.password, 
        this.name,
        this.segnom,
        this.apellPat,
        this.apellMat,
        this.emailAlt
      );

      const user = userCredential.user;
      const uid = user.uid;

   
      const alumnoData = {
        UID: uid,
        Nombre: this.name,
        Apellido: this.apellPat,
      };
      
      
      await this.storage.set('email', this.email);
      await this.storage.set('password', this.password);

      const alert = await this.alertController.create({
        header: '¡Éxito!',
        message: 'Cuenta registrada con éxito.',
        buttons: [{
          text: 'Aceptar',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }]
      });
      await alert.present();
    } catch (error: any) {
      let errorMessage = 'Ocurrió un error durante el registro. Intenta nuevamente.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'El correo electrónico ya está registrado.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
      }

      const alert = await this.alertController.create({
        header: 'Error',
        message: errorMessage,
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}