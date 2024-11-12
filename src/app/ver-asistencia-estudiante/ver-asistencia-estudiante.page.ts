import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-ver-asistencia-estudiante',
  templateUrl: './ver-asistencia-estudiante.page.html',
  styleUrls: ['./ver-asistencia-estudiante.page.scss'],
})
export class VerAsistenciaEstudiantePage implements OnInit {
  asistenciasPorRamo: { [key: string]: number } = {};
  asistenciaArray: { ramo: string; porcentaje: number }[] = [];

  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  async ngOnInit() {
    try {
      const usuario = await this.authService.getUser().toPromise();
      const uidEstudiante = usuario?.uid;
  
      if (uidEstudiante) {
        await this.calcularAsistenciasPorRamo(uidEstudiante);
        
        // Convertir asistenciasPorRamo a un array
        this.asistenciaArray = Object.keys(this.asistenciasPorRamo).map(ramo => ({
          ramo: ramo,
          porcentaje: this.asistenciasPorRamo[ramo]
        }));
  
        console.log('Asistencia Array:', this.asistenciaArray); // Agregar log para verificar los datos
      }
    } catch (error) {
      console.error('Error al obtener el UID del usuario:', error);
    }
  }
  

  async calcularAsistenciasPorRamo(uidEstudiante: string) {
    try {
      const clasesSnapshot = await this.firestore.collection('Clase').get().toPromise();
      const asistenciaPorRamo: { [key: string]: { total: number, asistidas: number } } = {};
  
      for (const claseDoc of clasesSnapshot.docs) {
        const ramo = claseDoc.data()['Ramo'];
        const alumnosSnapshot = await claseDoc.ref.collection('Alumnos').where('UID', '==', uidEstudiante).get();
  
        if (!asistenciaPorRamo[ramo]) {
          asistenciaPorRamo[ramo] = { total: 0, asistidas: 0 };
        }
  
        asistenciaPorRamo[ramo].total += alumnosSnapshot.size;
  
        alumnosSnapshot.forEach(alumnoDoc => {
          const asistencia = alumnoDoc.data()?.['Asistencia'];
          if (asistencia === true) {
            asistenciaPorRamo[ramo].asistidas++;
          }
        });
      }
  
      for (const ramo in asistenciaPorRamo) {
        const datosRamo = asistenciaPorRamo[ramo];
        this.asistenciasPorRamo[ramo] = (datosRamo.asistidas / datosRamo.total) * 100;
      }
  
      console.log('Asistencias por ramo:', this.asistenciasPorRamo); // Agrega log para verificar datos
    } catch (error) {
      console.error('Error al calcular el porcentaje de asistencia:', error);
    }
  }
}
