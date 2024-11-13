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
  clase: string = '';
  qrData: string = '';
  alumnos: any[] = [];
  uidClaseGenerada: string = '';

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
        this.cancelarAsistencia();
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

    this.route.queryParams.subscribe(params => {
      this.clase = params['clase'] || '';
      console.log('Clase UID:', this.clase);
      this.getAlumnosFromRamo();
    });
  }

  async getAlumnosFromRamo() {
    try {
      const alumnosSnapshot = await this.firestore
        .collection('Ramos')
        .doc(this.clase)
        .collection('Alumnos')
        .get()
        .toPromise();

      this.alumnos = alumnosSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          uid: doc.id,
          nombreCompleto: `${data['Nombre']} ${data['Apellido']}`,
          asistencia: data['Asistencia'] ?? false
        };
      });
      
      console.log('Alumnos:', this.alumnos);
    } catch (error) {
      console.error('Error al obtener los alumnos:', error);
    }
  }

  async generateQR() {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      const uidProfesor = user.uid;
      const fechaHoraActual = new Date().toISOString();
  
      
      try {
        const docRef = await this.firestore.collection('Clase').add({
          Ramo: this.clase,
          UIDProfesor: uidProfesor,
          fecha_inicio: fechaHoraActual,
        });

        this.uidClaseGenerada = docRef.id;

        
        const batch = this.firestore.firestore.batch();
        this.alumnos.forEach(alumno => {
          const alumnoRef = this.firestore.collection('Clase').doc(this.uidClaseGenerada)
            .collection('Alumnos').doc(alumno.uid).ref;
          
          batch.set(alumnoRef, {
            Nombre: alumno.nombreCompleto.split(' ')[0],
            Apellido: alumno.nombreCompleto.split(' ')[1],
            UID: alumno.uid,
            Asistencia: false 
          });
        });

       
        await batch.commit();

        
        const qrInfo = {
          UIDProfesor: uidProfesor,
          Clase: this.clase,
          FechaHora: fechaHoraActual,
          UIDClaseGenerada: this.uidClaseGenerada,
        };

        this.qrData = JSON.stringify(qrInfo); 
        
        console.log("QR Data:", this.qrData); 
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
      const alumnosSnapshot = await this.firestore.collection('Clase')
        .doc(this.uidClaseGenerada)
        .collection('Alumnos')
        .get()
        .toPromise();

      const batch = this.firestore.firestore.batch();
      alumnosSnapshot.docs.forEach(doc => batch.delete(doc.ref));

      await batch.commit();

      await this.firestore.collection('Clase').doc(this.uidClaseGenerada).delete();


      this.router.navigate(['/menu-profesor']);
    } catch (error) {
      console.error('Error deleting Clase instance:', error);
    }
  }
}
