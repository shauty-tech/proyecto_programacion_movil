import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  email: string = '';

  constructor(private toastController: ToastController) {}

  async sendResetLink() {
    const registeredEmails = ['profesor@test.com', 'alumno@test.com'];
    
    if (registeredEmails.includes(this.email)) {
      this.presentToast('Correo con instrucciones enviado', 'warning');
    } else {
      this.presentToast('No hay ninguna cuenta registrada con ese correo', 'danger');
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    toast.present();
  }
}
