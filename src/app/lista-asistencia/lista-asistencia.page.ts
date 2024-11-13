import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-lista-asistencia',
  templateUrl: './lista-asistencia.page.html',
  styleUrls: ['./lista-asistencia.page.scss'],
})
export class ListaAsistenciaPage implements OnInit {
  uidClase: string = '';
  alumnos: any[] = []; 

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.uidClase = params['clase'] || ''; 
      console.log('UID de la clase recibida:', this.uidClase);

      if (this.uidClase) {
        this.loadAlumnos();
      }
    });
  }

  async loadAlumnos() {
    try {
      const alumnosSnapshot = await this.firestore
        .collection('Clase')
        .doc(this.uidClase)
        .collection('Alumnos')
        .get()
        .toPromise();

      this.alumnos = alumnosSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          nombre: `${data['Nombre']} ${data['Apellido']}`,
          asistencia: data['Asistencia'] 
        };
      });

      console.log('Alumnos de la clase:', this.alumnos);
    } catch (error) {
      console.error('Error al obtener los alumnos:', error);
    }
  }
}
