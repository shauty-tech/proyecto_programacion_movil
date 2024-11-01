import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService, private toastController: ToastController) {}

  login() {
    this.authService.login(this.email, this.password)
      .then(() => {
        if (this.email.endsWith('@alumno.cl')) {
          this.router.navigate(['/menu-estudiante']);
          this.presentToast('Inicio de sesión exitoso como estudiante.');
        } else if (this.email.endsWith('@profesor.cl')) {
          this.router.navigate(['/menu-profesor']);
          this.presentToast('Inicio de sesión exitoso como profesor.');
        } else {
          this.presentToast('Correo no válido.');
        }
      })
      .catch(error => {
        console.error('Error en el login:', error);
        this.presentToast('Error en el inicio de sesión. Inténtalo de nuevo.');
      });
  }
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }
}