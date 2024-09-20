import { Component, OnInit } from '@angular/core';
import { ItemList } from 'src/app/interfaces/itemlist';
@Component({
  selector: 'app-ver-asistencia',
  templateUrl: './ver-asistencia.page.html',
  styleUrls: ['./ver-asistencia.page.scss'],
})
export class VerAsistenciaPage implements OnInit {



  vinculos:ItemList[]=[{
    ruta:'/menu-asignatura-1',
    titulo:'Asignatura_1',
    icono:''
  },
    {
      ruta:'/menu-asignatura-1',
      titulo:'Asignatura_2',
      icono:''

  },
  {
    ruta:'/menu-asignatura-1',
    titulo:'Asignatura_3',
    icono:''

},

  ];

  constructor() { }

  ngOnInit() {
  }

}
