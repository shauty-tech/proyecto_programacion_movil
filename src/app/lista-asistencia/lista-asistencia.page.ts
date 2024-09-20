import { Component, OnInit } from '@angular/core';
import { Recurso_nombre, Recurso_asistencia } from 'src/app/interfaces/itemlist';
@Component({
  selector: 'app-lista-asistencia',
  templateUrl: './lista-asistencia.page.html',
  styleUrls: ['./lista-asistencia.page.scss'],
})
export class ListaAsistenciaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  vinculos:Recurso_nombre[]=[{
    titulo:'Benja',
  },
    {
      titulo:'Goku',

  },
  {
    titulo:'Vegeta',

},

  ];
  recurso:Recurso_asistencia[]=[{
    titulo:'No asistio',
  },
    {
      titulo:'Si asistio',
  },
  {
    titulo:'Si asistio',
},

  ];
}
