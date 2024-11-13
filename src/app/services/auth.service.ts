import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';  // Importamos AngularFirestore
import { User } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}


  login(user: User) {
    return this.afAuth.signInWithEmailAndPassword(user.email, user.password);
  }


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

      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;


      if (user) {
        await user.updateProfile({ displayName: name });


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
