import { Component, OnInit } from '@angular/core';
import { ItemList } from 'src/app/interfaces/itemlist';
import { Router } from '@angular/router'; 
@Component({
  selector: 'app-menu-estudiante',
  templateUrl: './menu-estudiante.page.html',
  styleUrls: ['./menu-estudiante.page.scss'],
})
export class MenuEstudiantePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }


  accion:string=''

  clase:string=''
  vinculos:ItemList[]=[{
    ruta:'/registrar-camara',
    titulo:'Registrar asistencia',
    icono:'walk-outline'
  },

  ];
  
  
    alertButtons=[{
    text:'Aceptar',
    cssClass:'btnAceptarStyle',
    handler:()=>{
      this.accion='Presionó aceptar';
      this.router.navigate(['/home']);
    }
  },{
    text:'Cancelar',
    cssClass:'btnCancelarStyle',
    handler:()=>{
      this.accion="Presionó cancelar";
    }
  }];
}
