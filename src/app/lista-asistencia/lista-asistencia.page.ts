import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-lista-asistencia',
  templateUrl: './lista-asistencia.page.html',
  styleUrls: ['./lista-asistencia.page.scss'],
})
export class ListaAsistenciaPage implements OnInit {
  uidClase: string = '';  // UID de la clase recibido
  alumnos: any[] = [];    // Array para almacenar los datos de los alumnos

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore) { }

  ngOnInit() {
    // Obtener el parámetro 'clase' de la URL
    this.route.queryParams.subscribe(params => {
      this.uidClase = params['clase'] || ''; // Capturamos el UID de la clase
      console.log('UID de la clase recibida:', this.uidClase); // Verificar en consola

      // Si el UID de la clase está disponible, cargar los alumnos
      if (this.uidClase) {
        this.loadAlumnos();
      }
    });
  }

  async loadAlumnos() {
    try {
      // Consultar los documentos en la subcolección 'Alumnos' de la clase especificada
      const alumnosSnapshot = await this.firestore
        .collection('Clase')
        .doc(this.uidClase)
        .collection('Alumnos')
        .get()
        .toPromise();

      // Mapear los datos de los alumnos
      this.alumnos = alumnosSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          nombre: `${data['Nombre']} ${data['Apellido']}`,  // Nombre completo del alumno
          asistencia: data['Asistencia'] ? 'Sí asistió' : 'No asistió'  // Estado de asistencia
        };
      });

      console.log('Alumnos de la clase:', this.alumnos); // Verificar los datos en consola
    } catch (error) {
      console.error('Error al obtener los alumnos:', error);
    }
  }
}
