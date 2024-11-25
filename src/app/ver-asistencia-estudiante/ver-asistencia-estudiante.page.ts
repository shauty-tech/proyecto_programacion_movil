import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { from, of } from 'rxjs';
import { switchMap, catchError, map, mergeMap, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-ver-asistencia-estudiante',
  templateUrl: './ver-asistencia-estudiante.page.html',
  styleUrls: ['./ver-asistencia-estudiante.page.scss'],
})
export class VerAsistenciaEstudiantePage implements OnInit {
  asistenciaArray: { ramo: string; totalAsistencias: number; totalClases: number }[] = [];
  errorMessage: string | null = null;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private cdr: ChangeDetectorRef // Servicio para forzar la detección de cambios
  ) {}

  ngOnInit() {
    this.authService.getUser()
      .pipe(
        switchMap((usuario) => {
          const uidEstudiante = usuario?.uid;
          if (!uidEstudiante) {
            throw new Error('No se obtuvo el UID del estudiante.');
          }
          return this.obtenerRamosInscritos(uidEstudiante);
        }),
        catchError((error) => {
          this.errorMessage = error.message;
          console.error('Error:', error);
          return of([]); // Devuelve un array vacío si ocurre algún error
        })
      )
      .subscribe((asistencias) => {
        this.asistenciaArray = asistencias;
        console.log('Array de Asistencias:', this.asistenciaArray);
        this.cdr.detectChanges(); // Forzar detección de cambios
      });
  }

  obtenerRamosInscritos(uidEstudiante: string) {
    // Buscar ramos donde el estudiante esté inscrito en la subcolección "Alumnos"
    return this.firestore.collection('Ramos').snapshotChanges().pipe(
      mergeMap((ramosSnapshot) =>
        from(ramosSnapshot).pipe(
          mergeMap(async (ramo) => {
            const ramoId = ramo.payload.doc.id;

            // Verificar si el estudiante está inscrito en la subcolección "Alumnos"
            const alumnoSnapshot = await this.firestore
              .collection('Ramos')
              .doc(ramoId)
              .collection('Alumnos')
              .doc(uidEstudiante)
              .get()
              .toPromise();

            if (alumnoSnapshot.exists) {
              // Obtener clases relacionadas con el ramo
              const clasesSnapshot = await this.firestore
                .collection('Clase', (ref) => ref.where('Ramo', '==', ramoId))
                .get()
                .toPromise();

              const totalClases = clasesSnapshot.size;
              let totalAsistencias = 0;

              for (const claseDoc of clasesSnapshot.docs) {
                const alumnoAsistencia = await claseDoc.ref
                  .collection('Alumnos')
                  .doc(uidEstudiante)
                  .get();

                // Cambiamos a la notación con corchetes
                if (alumnoAsistencia.exists && alumnoAsistencia.data()?.['Asistencia'] === true) {
                  totalAsistencias++;
                }
              }

              return { ramo: ramoId, totalAsistencias, totalClases };
            } else {
              // Si no está inscrito, devolver null para este ramo
              return null;
            }
          }),
          toArray(),
          map((ramos) => ramos.filter((ramo) => ramo !== null)) // Filtrar ramos no inscritos
        )
      )
    );
  }
}
