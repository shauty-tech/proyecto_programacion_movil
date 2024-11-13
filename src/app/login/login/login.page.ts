import { User } from './../../interfaces/usuario';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage-angular'; // Importamos Storage

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController,
    private storage: Storage // Inyectamos Ionic Storage
  ) {
    this.storage.create(); // Creamos la instancia de storage
  }

  ngOnInit() {
    // Recuperar email y password desde IonicStorage y rellenar el formulario
    this.storage.get('email').then(storedEmail => {
      if (storedEmail) {
        this.form.controls['email'].setValue(storedEmail);
      }
    });

    this.storage.get('password').then(storedPassword => {
      if (storedPassword) {
        this.form.controls['password'].setValue(storedPassword);
      }
    });
  }

  login() {
    if (this.form.invalid) {
      this.presentToast('Por favor, completa los campos correctamente.');
      return;
    }

    const user = this.form.value as User;

    this.authService.login(user)
      .then((firebaseUser) => {
        console.log('UID del usuario autenticado:', firebaseUser.user?.uid);

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

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }
}