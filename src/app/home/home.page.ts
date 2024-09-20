import { Component, OnInit } from '@angular/core';
import { ItemList } from 'src/app/interfaces/itemlist';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  accion:string=''

  clase:string=''
  vinculos:ItemList[]=[{
    ruta:'/menu-qr',
    titulo:'Asistencia en linea',
    icono:'alarm'
  },
    {
      ruta:'/ingresar-asignatura',
      titulo:'Ingresar asignatura',
      icono:'add-circle'

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
    }
  },{
    text:'Cancelar',
    cssClass:'btnCancelarStyle',
    handler:()=>{
      this.accion="Presionó cancelar";
    }
  }] 

  constructor(private alertctrl:AlertController) {}

  ngOnInit() {
  }

}
