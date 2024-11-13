import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../services/auth.service';
import { combineLatest, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-ver-asistencia-estudiante',
  templateUrl: './ver-asistencia-estudiante.page.html',
  styleUrls: ['./ver-asistencia-estudiante.page.scss'],
})
export class VerAsistenciaEstudiantePage implements OnInit {
  asistenciaArray: { ramo: string; totalAsistencias: number; totalClases: number }[] = [];
  errorMessage: string | null = null;

  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  ngOnInit() {
    this.authService.getUser().pipe(
      switchMap((usuario) => {
        const uidEstudiante = usuario?.uid;
        if (!uidEstudiante) {
          throw new Error('No se obtuvo el UID del estudiante.');
        }
        return this.calcularAsistenciasPorRamo(uidEstudiante);
      }),
      catchError((error) => {
        this.errorMessage = error.message;
        console.error('Error:', error);
        return of([]);
      })
    ).subscribe((asistencias) => {
      this.asistenciaArray = asistencias;
      console.log('Array de Asistencias:', this.asistenciaArray);
    });
  }

  calcularAsistenciasPorRamo(uidEstudiante: string) {
    return this.firestore.collection('Ramos').snapshotChanges().pipe(
      switchMap((ramosSnapshot) => {
        const ramoObservables = ramosSnapshot.map((ramo) => {
          const ramoId = ramo.payload.doc.id;
          return this.firestore.collection('Clase', (ref) => ref.where('Ramo', '==', ramoId))
            .snapshotChanges().pipe(
              switchMap((clasesSnapshot) => {
                const totalClases = clasesSnapshot.length;
                const claseObservables = clasesSnapshot.map((clase) =>
                  clase.payload.doc.ref.collection('Alumnos')
                    .where('UID', '==', uidEstudiante)
                    .where('Asistencia', '==', true)
                    .get().then((alumnosSnapshot) => !alumnosSnapshot.empty ? 1 : 0)
                );


                return Promise.all(claseObservables).then((asistencias) => {
                  const totalAsistencias = asistencias.reduce((a, b) => a + b, 0);
                  return { ramo: ramoId, totalAsistencias, totalClases };
                });
              }),
              catchError((error) => {
                console.warn(`Error al procesar ramo ${ramoId}:`, error);
                return of({ ramo: ramoId, totalAsistencias: 0, totalClases: 0 });
              })
            );
        });
        return combineLatest(ramoObservables);
      })
    );
  }
}
