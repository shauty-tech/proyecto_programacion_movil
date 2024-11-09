import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';  // Importamos AngularFirestore
import { User } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root', // Esto asegura que el servicio esté disponible en toda la app
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore  // Inyectamos AngularFirestore
  ) {}

  // Método para login
  login(user: User) {
    return this.afAuth.signInWithEmailAndPassword(user.email, user.password);
  }

  // Método de registro con datos adicionales
  async register(
    email: string,
    password: string,
    name: string,
    segnom: string,
    apellPat: string,
    apellMat: string,
    emailAlt: string
  ) {
    try {
      // Creamos el usuario con Firebase Authentication
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Si el usuario es creado, actualizamos su perfil
      if (user) {
        await user.updateProfile({ displayName: name });

        // Guardamos los datos adicionales en Firestore
        await this.firestore.collection('users').doc(user.uid).set({
          nom: name,
          segnom: segnom,
          apellPat: apellPat,
          apellMat: apellMat,
          emailAlt: emailAlt,
          email: email
        });
      }

      return userCredential;
    } catch (error) {
      throw error;  // Si ocurre un error, lo lanzamos
    }
  }

  // Método para logout
  logout() {
    return this.afAuth.signOut();
  }

  // Método para obtener el estado del usuario
  getUser() {
    return this.afAuth.authState;
  }
}
