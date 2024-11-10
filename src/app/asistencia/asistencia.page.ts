import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {
  accion: string = '';
  hola: string = 'QR EJEMPLO';
  clase: string = '';

  // Botones de la alerta para "Terminar asistencia"
  alertButtons_1 = [
    {
      text: 'Aceptar',
      cssClass: 'btnAceptarStyle',
      handler: () => {
        this.accion = 'Presionó aceptar';
        this.router.navigate(['/menu-profesor']);
      },
    },
    {
      text: 'Cancelar',
      cssClass: 'btnCancelarStyle',
      handler: () => {
        this.accion = 'Presionó cancelar';
      },
    },
  ];

  // Botones de la alerta para "Cancelar asistencia"
  alertButtons_2 = [
    {
      text: 'Aceptar',
      cssClass: 'btnAceptarStyle',
      handler: () => {
        this.accion = 'Presionó aceptar';
        this.router.navigate(['/menu-profesor']);
      },
    },
    {
      text: 'Cancelar',
      cssClass: 'btnCancelarStyle',
      handler: () => {
        this.accion = 'Presionó cancelar';
      },
    },
  ];

  constructor(private router: Router, private firestore: AngularFirestore) {}

  ngOnInit() {}

  async generateQR() {
    // Lógica para generar el QR
  }
}
