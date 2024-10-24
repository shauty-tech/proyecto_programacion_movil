import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    // Validar el correo electrónico para determinar si es alumno o profesor
    if (this.email.endsWith('@alumno.cl')) {
      // Redirigir a menú estudiante
      this.router.navigate(['/menu-estudiante']);
    } else if (this.email.endsWith('@profesor.cl')) {
      // Redirigir a menú profesor
      this.router.navigate(['/menu-profesor']);
    } else {
      // Mostrar un mensaje de error si el correo no es válido
      console.error('Correo no válido');
    }
  }
}