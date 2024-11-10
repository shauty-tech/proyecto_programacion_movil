import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {
  accion:string=''
  hola:string='QR EJEMPLO'
  clase:string=''

  accion_1: string=''//cuidado con la reutilizacion de codigo, con la parte del hadler
  alertButtons_1=[{
    text:'Aceptar',
    cssClass:'btnAceptarStyle',
    handler:()=>{
      this.accion_1='Presionó aceptar';
      this.router.navigate(['/menu-profesor']);
    }
  },{
    text:'Cancelar',
    cssClass:'btnCancelarStyle',
    handler:()=>{
      this.accion_1="Presionó cancelar";
    }
  }]
  alertButtons_2=[{
    text:'Aceptar',
    cssClass:'btnAceptarStyle',
    handler:()=>{
      this.accion='Presionó aceptar';
      this.router.navigate(['/menu-profesor']);
    }
  },{
    text:'Cancelar',
    cssClass:'btnCancelarStyle',
    handler:()=>{
      this.accion="Presionó cancelar";
    }
  }]

  constructor(private router: Router) { }

  ngOnInit() {
  }

}
