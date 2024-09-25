import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login-alumno',
  templateUrl: './login-alumno.page.html',
  styleUrls: ['./login-alumno.page.scss'],
})
export class LoginAlumnoPage {

  emailAlumno: string = '';
  passwordAlumno: string = '';

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

  loginAlumno() {
    const emailTest = 'alumno@test.com';
    const passwordTest = 'pass123';

    if (this.emailAlumno === emailTest && this.passwordAlumno === passwordTest) {
      this.presentToast('Iniciando sesión como Alumno', 'success');
      this.navCtrl.navigateRoot('/menu-estudiante'); // Redirigir a menu-estudiante
    } else {
      this.presentToast('Correo o contraseña incorrectos', 'danger');
    }
  }
}
