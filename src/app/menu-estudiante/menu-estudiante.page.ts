import { Component, OnInit } from '@angular/core';
import { ItemList } from 'src/app/interfaces/itemlist';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-menu-estudiante',
  templateUrl: './menu-estudiante.page.html',
  styleUrls: ['./menu-estudiante.page.scss'],
})
export class MenuEstudiantePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  accion:string=''

  clase:string=''
  vinculos:ItemList[]=[{
    ruta:'',
    titulo:'camara',
    icono:'alarm'
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
  }];
}
