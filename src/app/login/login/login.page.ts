import { User } from './../../interfaces/usuario';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  login() {
    // Si el formulario es inválido, muestra un toast y termina la ejecución.
    if (this.form.invalid) {
      this.presentToast('Por favor, completa los campos correctamente.');
      return;
    }

    // Aquí declaramos 'user' y le asignamos el valor del formulario.
    const user = this.form.value as User;

    // Llamada al servicio de autenticación
    this.authService.login(user)
      .then((firebaseUser) => {
        // Muestra el 'uid' del usuario autenticado en consola
        console.log('UID del usuario autenticado:', firebaseUser.user?.uid);

        // Dependiendo del correo, navega a la vista correspondiente.
        if (user.email.endsWith('@alumno.cl')) {
          this.presentToast('Inicio de sesión exitoso como estudiante.');
          this.router.navigate(['/menu-estudiante']);
        } else if (user.email.endsWith('@profesor.cl')) {
          this.presentToast('Inicio de sesión exitoso como profesor.');
          this.router.navigate(['/menu-profesor']);
        } else {
          this.presentToast('Correo no válido.');
        }
      })
      .catch(error => {
        console.error('Error en el login:', error);
        this.presentToast('Error en el inicio de sesión. Inténtalo de nuevo.');
      });
  }

  // Función para mostrar Toast
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }
}
