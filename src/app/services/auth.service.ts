import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../interfaces/usuario';
import { Firestore, doc, getDoc, setDoc} from '@angular/fire/firestore'; 
@Injectable({
  providedIn: 'root', // Esto asegura que el servicio esté disponible en toda la app
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private db: Firestore) {}

  login(user: User) {
    return this.afAuth.signInWithEmailAndPassword(user.email, user.password);
  }

 async register(email: string, password: string, name: string) {
  try {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    let rol: string;
    if (email.endsWith('@alumno.cl')) {
      rol = 'Alumno';
    } else if (email.endsWith('@profesor.cl')) {
      rol = 'Profesor';
    } else {
      rol = 'Invitado'; // O cualquier rol por defecto si no coincide
    }

    // Crear el objeto de usuario
    const userInfo = {
      correo_institucional: email,
      rol: rol,
      apellido_materno: '', // Vacío por defecto
      apellido_paterno: '', // Vacío por defecto
      correo_personal: '',  // Vacío por defecto
      nombre: '',           // Vacío por defecto
      segundo_nombre: '',   // Vacío por defecto
      // Aquí puedes agregar más campos si es necesario
    };
      // Guardar la información del usuario en Firestore con su UID como ID
      await setDoc(doc(this.db, 'usuario', userCredential.user.uid), userInfo);

    if (name) {
      await user.updateProfile({ displayName: name }); 
    }

    return userCredential;
  } catch (error) {
    throw error;
  }
}

  logout() {
    return this.afAuth.signOut();
  }

  getUser() {
    return this.afAuth.authState;
  }
}
