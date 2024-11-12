import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth } from 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-asistencia',
  templateUrl: './ver-asistencia.page.html',
  styleUrls: ['./ver-asistencia.page.scss'],
})
export class VerAsistenciaPage implements OnInit {

  vinculos: ItemList[] = [];

  constructor(private firestore: AngularFirestore, private router: Router) {}

  ngOnInit() {
    this.loadRamos();
  }

  async loadRamos() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const uidProfesor = user.uid;

      // Realizar una consulta para obtener los ramos con UIDProfesor coincidente
      const ramosSnapshot = await this.firestore
        .collection('Ramos', (ref) => ref.where('UIDProfesor', '==', uidProfesor))
        .get()
        .toPromise();

      // Mapear los ramos a la estructura de vinculos
      this.vinculos = ramosSnapshot.docs.map((doc) => ({
        ruta: '/menu-asignatura-1',
        titulo: doc.id,  // Usamos el ID del documento como título
        icono: '',       // Puedes añadir un icono aquí si lo deseas
      }));
    } else {
      console.error('No hay usuario autenticado');
    }
  }

  goToAsignatura(ruta: string, clase: string) {
    this.router.navigate([ruta], { queryParams: { clase } });
  }
}

// Declaración de la estructura de datos en el mismo archivo
interface ItemList {
  ruta: string;
  titulo: string;
  icono: string;
}
