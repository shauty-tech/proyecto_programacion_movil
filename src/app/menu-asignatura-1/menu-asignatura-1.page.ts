import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-menu-asignatura-1',
  templateUrl: './menu-asignatura-1.page.html',
  styleUrls: ['./menu-asignatura-1.page.scss'],
})
export class MenuAsignatura1Page implements OnInit {
  vinculos: any[] = [];
  ramoSeleccionado: string = '';

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.ramoSeleccionado = params['clase'];
      console.log('Ramo seleccionado:', this.ramoSeleccionado);
      if (this.ramoSeleccionado) {
        this.loadClases();
      }
    });
  }

  async loadClases() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user && this.ramoSeleccionado) {
      try {
        const clasesSnapshot = await this.firestore
          .collection('Clase', (ref) => ref.where('Ramo', '==', this.ramoSeleccionado))
          .get()
          .toPromise();

        console.log('Clases encontradas:', clasesSnapshot.docs.length);

        this.vinculos = clasesSnapshot.docs.map((doc) => {
          const clase = doc.data();
          const fechaInicioRaw = clase['fecha_inicio'];

          // Transformar la fecha en formato deseado
          const fechaInicio = this.formatFecha(fechaInicioRaw);

          return {
            ruta: '/lista-asistencia',
            titulo: fechaInicio,
            icono: '',
            uid: doc.id
          };
        });

        if (this.vinculos.length === 0) {
          console.log('No hay clases para este ramo');
        }
      } catch (error) {
        console.error('Error al cargar las clases:', error);
      }
    } else {
      console.error('No hay usuario autenticado o ramo no seleccionado');
    }
  }

  formatFecha(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    const opcionesFecha = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    } as const;
    const opcionesHora = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    } as const;

    const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);
    const horaFormateada = fecha.toLocaleTimeString('es-ES', opcionesHora);

    return `${fechaFormateada} ${horaFormateada}`;
  }

  goToListaAsistencia(uidClase: string) {
    this.router.navigate(['/lista-asistencia'], { queryParams: { clase: uidClase } });
  }
}
