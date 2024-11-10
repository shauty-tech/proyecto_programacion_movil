import { Component, OnInit } from '@angular/core';
import { ItemList } from 'src/app/interfaces/itemlist';
import { Router } from '@angular/router'; 
@Component({
  selector: 'app-menu-profesor',
  templateUrl: './menu-profesor.page.html',
  styleUrls: ['./menu-profesor.page.scss'],
})
export class MenuProfesorPage implements OnInit {



  accion:string=''

  clase:string=''
  vinculos:ItemList[]=[{
    ruta:'/menu-qr',
    titulo:'Asistencia en linea',
    icono:'alarm'
  },
  {
    ruta:'/ver-asistencia',
    titulo:'Ver asistencia',
    icono:'reader-outline'

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
  }]
  constructor(private router: Router) { }

  ngOnInit() {
  }

}
