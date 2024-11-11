import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {
  accion: string = '';
  clase: string = ''; // La clase seleccionada
  qrData: string = ''; // Dato QR generado

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

  constructor(private router: Router, private firestore: AngularFirestore, private route: ActivatedRoute) {}

  ngOnInit() {
   // Obtener el parámetro de la clase seleccionada (UID del documento)
  this.route.queryParams.subscribe(params => {
    this.clase = params['clase'] || '';  // Recibe el UID del documento
    console.log('Clase UID:', this.clase);  // Verifica que esté llegando correctamente
  });
  }

  async generateQR() {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      const uidProfesor = user.uid;
      const fechaHoraActual = new Date().toISOString();  // Fecha y hora actual en string ISO
  
      // Construimos el dato para el QR en formato de objeto JSON como string
      const qrInfo = {
        UIDProfesor: uidProfesor,
        Clase: this.clase,  // El UID de la clase
        FechaHora: fechaHoraActual
      };
      this.qrData = JSON.stringify(qrInfo);  // Convertimos el objeto a un string JSON para el QR
  
      console.log("QR Data:", this.qrData);  // Verifica en la consola
    } else {
      console.error('No hay usuario autenticado');
    }
  }
}