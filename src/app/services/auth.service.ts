import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root', // Esto asegura que el servicio esté disponible en toda la app
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  login(user: User) {
    return this.afAuth.signInWithEmailAndPassword(user.email, user.password);
  }

 async register(email: string, password: string, name: string) {
  try {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

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
