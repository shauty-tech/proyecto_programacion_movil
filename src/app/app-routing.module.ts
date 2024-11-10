import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'asistencia',
    loadChildren: () => import('./asistencia/asistencia.module').then( m => m.AsistenciaPageModule)
  },
  {
    path: 'ver-asistencia',
    loadChildren: () => import('./ver-asistencia/ver-asistencia.module').then( m => m.VerAsistenciaPageModule)
  },
  {
    path: 'menu-asignatura-1',
    loadChildren: () => import('./menu-asignatura-1/menu-asignatura-1.module').then( m => m.MenuAsignatura1PageModule)
  },
  {
    path: 'lista-asistencia',
    loadChildren: () => import('./lista-asistencia/lista-asistencia.module').then( m => m.ListaAsistenciaPageModule)
  },
  {
    path: 'menu-qr',
    loadChildren: () => import('./menu-qr/menu-qr.module').then( m => m.MenuQRPageModule)
  },
  {
    path: 'menu-estudiante',
    loadChildren: () => import('./menu-estudiante/menu-estudiante.module').then( m => m.MenuEstudiantePageModule)
  },
  {
    path: 'menu-profesor',
    loadChildren: () => import('./menu-profesor/menu-profesor.module').then( m => m.MenuProfesorPageModule)
  },
  {
    path: 'registrar-camara',
    loadChildren: () => import('./registrar-camara/registrar-camara.module').then( m => m.RegistrarCamaraPageModule)
  },
  {
    path: 'ver-asistencia-estudiante',
    loadChildren: () => import('./ver-asistencia-estudiante/ver-asistencia-estudiante.module').then( m => m.VerAsistenciaEstudiantePageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./login/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./login/registro/registro.module').then( m => m.RegistroPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
