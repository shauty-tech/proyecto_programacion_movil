// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

export interface Environment {
  production: boolean;
  firebaseConfig: FirebaseConfig;
}

export const environment: Environment = {
  production: false,
  firebaseConfig : {
    apiKey: "AIzaSyBz1J6FHM9sn9fU0OAGtwtIUtGRIiN90tk",
    authDomain: "proyecto-prueba-90d4b.firebaseapp.com",
    projectId: "proyecto-prueba-90d4b",
    storageBucket: "proyecto-prueba-90d4b.firebasestorage.app",
    messagingSenderId: "940245006649",
    appId: "1:940245006649:web:1e2c7058c1f54edd2190e8",
    measurementId: "G-JEHPV4YZGR"
  }
};


/*s
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
