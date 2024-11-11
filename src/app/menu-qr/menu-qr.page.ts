import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth } from 'firebase/auth';
import { Router } from '@angular/router';
interface Ramo {
  titulo: string;
  UIDProfesor: string;
}

@Component({
  selector: 'app-menu-qr',
  templateUrl: './menu-qr.page.html',
  styleUrls: ['./menu-qr.page.scss'],
})
export class MenuQRPage implements OnInit {
  vinculos: { ruta: string; titulo: string; icono: string; uid: string }[] = [];

  constructor(private firestore: AngularFirestore,private router: Router) {}

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
        .collection<Ramo>('Ramos', (ref) => ref.where('UIDProfesor', '==', uidProfesor))
        .get()
        .toPromise();

      this.vinculos = ramosSnapshot.docs.map((doc) => ({
        ruta: '/asistencia',
        titulo: doc.id,  // Usa el ID del documento como título
        icono: 'book-outline',
        uid: doc.id,     // Agrega el UID del documento
      }));
    } else {
      console.error('No hay usuario autenticado');
    }

  }
  goToAsistencia(uid: string) {
    this.router.navigate(['/asistencia'], { queryParams: { clase: uid } });
  }
}