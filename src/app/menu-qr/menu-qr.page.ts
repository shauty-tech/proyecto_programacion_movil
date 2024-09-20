import { Component, OnInit } from '@angular/core';
import { ItemList } from 'src/app/interfaces/itemlist';
@Component({
  selector: 'app-menu-qr',
  templateUrl: './menu-qr.page.html',
  styleUrls: ['./menu-qr.page.scss'],
})
export class MenuQRPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  vinculos:ItemList[]=[{
    ruta:'/asistencia',
    titulo:'Asignatura_1',
    icono:''
  },
    {
      ruta:'/asistencia',
      titulo:'Asignatura_2',
      icono:''

  },
  {
    ruta:'/asistencia',
    titulo:'Asignatura_3',
    icono:''

},

  ];
  
}
