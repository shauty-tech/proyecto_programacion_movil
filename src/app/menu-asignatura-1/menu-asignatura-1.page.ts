import { Component, OnInit } from '@angular/core';
import { ItemList } from 'src/app/interfaces/itemlist';
@Component({
  selector: 'app-menu-asignatura-1',
  templateUrl: './menu-asignatura-1.page.html',
  styleUrls: ['./menu-asignatura-1.page.scss'],
})
export class MenuAsignatura1Page implements OnInit {



  vinculos:ItemList[]=[{
    ruta:'/lista-asistencia',
    titulo:'2024-01-02',
    icono:''
  },
    {
      ruta:'/lista-asistencia',
      titulo:'2024-01-03',
      icono:''

  },
  {
    ruta:'/lista-asistencia',
    titulo:'2024-01-04',
    icono:''

},

  ];

  constructor() { }

  ngOnInit() {
  }

}
