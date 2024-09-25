import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login-profesor',
  templateUrl: './login-profesor.page.html',
  styleUrls: ['./login-profesor.page.scss'],
})
export class LoginProfesorPage {

  emailProfesor: string = '';
  passwordProfesor: string = '';

  constructor(private navCtrl: NavController, private toastController: ToastController) {}

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    toast.present();
  }

  loginProfesor() {
    const emailTest = 'profesor@test.com';
    const passwordTest = 'pass123';

    if (this.emailProfesor === emailTest && this.passwordProfesor === passwordTest) {
      this.presentToast('Iniciando sesión como Profesor', 'success');
      this.navCtrl.navigateRoot('/menu-profesor'); // Redirigir a menu-profesor
    } else {
      this.presentToast('Correo o contraseña incorrectos', 'danger');
    }
  }
}
