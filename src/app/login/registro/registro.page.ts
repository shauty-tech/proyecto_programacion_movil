import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service'; // Asegúrate de que el servicio esté importado

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  email: string = '';
  password: string = '';
  name: string = ''; // Nombre del usuario

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService // Inyectamos el servicio AuthService
  ) { }

  ngOnInit() {}

  // Método para registrar un nuevo usuario
  async register() {
    try {
      const userCredential = await this.authService.register(this.email, this.password, this.name);

      // Mostrar alerta de éxito
      const alert = await this.alertController.create({
        header: '¡Éxito!',
        message: 'Cuenta registrada con éxito.',
        buttons: [{
          text: 'Aceptar',
          handler: () => {
            // Redirigimos al login o a la página deseada
            this.router.navigate(['/login']);
          }
        }]
      });
      await alert.present();
    } catch (error: any) {
      // Manejo de errores
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
