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
  clase: string = ''; // La clase seleccionada (UID del documento)
  qrData: string = ''; // Dato QR generado
  alumnos: any[] = []; // Alumnos fetched from Firestore
  uidClaseGenerada: string = ''; // UID of the created "Clase" instance

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

  alertButtons_2 = [
    {
      text: 'Aceptar',
      cssClass: 'btnAceptarStyle',
      handler: () => {
        this.cancelarAsistencia(); // Llama a cancelarAsistencia solo después de confirmar
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
      this.clase = params['clase'] || ''; // Recibe el UID del documento
      console.log('Clase UID:', this.clase); // Verifica que esté llegando correctamente
      
      // Fetch students from the specified 'Ramo' document
      this.getAlumnosFromRamo();
    });
  }

  async getAlumnosFromRamo() {
    try {
      const alumnosSnapshot = await this.firestore
        .collection('Ramos')
        .doc(this.clase) // Use the UID of the selected 'Ramo'
        .collection('Alumnos')
        .get()
        .toPromise();

      this.alumnos = alumnosSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          uid: doc.id,
          nombreCompleto: `${data['Nombre']} ${data['Apellido']}`, // Use bracket notation to access fields
          asistencia: data['Asistencia'] ?? false // Use bracket notation and default to false if Asistencia is missing
        };
      });
      
      console.log('Alumnos:', this.alumnos); // Verifica la información de los alumnos en la consola
    } catch (error) {
      console.error('Error al obtener los alumnos:', error);
    }
  }

  async generateQR() {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      const uidProfesor = user.uid;
      const fechaHoraActual = new Date().toISOString(); // Fecha y hora actual en string ISO
  
      // Crear una nueva instancia en la colección 'Clase'
      try {
        const docRef = await this.firestore.collection('Clase').add({
          Ramo: this.clase,
          UIDProfesor: uidProfesor,
          fecha_inicio: fechaHoraActual,
        });

        this.uidClaseGenerada = docRef.id; // Store the UID of the created "Clase" instance

        // Agregar la subcolección 'Alumnos' en la nueva instancia de 'Clase'
        const batch = this.firestore.firestore.batch();
        this.alumnos.forEach(alumno => {
          const alumnoRef = this.firestore.collection('Clase').doc(this.uidClaseGenerada)
            .collection('Alumnos').doc(alumno.uid).ref;
          
          batch.set(alumnoRef, {
            Nombre: alumno.nombreCompleto.split(' ')[0],
            Apellido: alumno.nombreCompleto.split(' ')[1],
            UID: alumno.uid,
            Asistencia: false // Inicializa el campo 'Asistencia' en false
          });
        });

        // Ejecutar la operación en batch para agregar todos los alumnos
        await batch.commit();

        // Construir los datos del QR en formato JSON como string
        const qrInfo = {
          UIDProfesor: uidProfesor,
          Clase: this.clase,
          FechaHora: fechaHoraActual,
          UIDClaseGenerada: this.uidClaseGenerada,
        };

        this.qrData = JSON.stringify(qrInfo); // Convertir el objeto a un string JSON para el QR
        
        console.log("QR Data:", this.qrData); // Verificar en consola
      } catch (error) {
        console.error('Error al crear la instancia en Clase o agregar Alumnos:', error);
      }
    } else {
      console.error('No hay usuario autenticado');
    }
  }

  async cancelarAsistencia() {
    if (!this.uidClaseGenerada) {
      console.error('No UID for Clase instance found');
      return;
    }

    try {
      // Delete all documents in the 'Alumnos' subcollection
      const alumnosSnapshot = await this.firestore.collection('Clase')
        .doc(this.uidClaseGenerada)
        .collection('Alumnos')
        .get()
        .toPromise();

      const batch = this.firestore.firestore.batch();
      alumnosSnapshot.docs.forEach(doc => batch.delete(doc.ref));

      // Commit the batch deletion for 'Alumnos' documents
      await batch.commit();

      // Delete the 'Clase' document itself
      await this.firestore.collection('Clase').doc(this.uidClaseGenerada).delete();

      // Navigate back after successful deletion
      this.router.navigate(['/menu-profesor']);
    } catch (error) {
      console.error('Error deleting Clase instance:', error);
    }
  }
}
