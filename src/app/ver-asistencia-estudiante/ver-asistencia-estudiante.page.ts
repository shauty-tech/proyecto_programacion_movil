import { Component, OnInit } from '@angular/core';
import { Recurso_nombre, Recurso_asistencia } from 'src/app/interfaces/itemlist';
@Component({
  selector: 'app-ver-asistencia-estudiante',
  templateUrl: './ver-asistencia-estudiante.page.html',
  styleUrls: ['./ver-asistencia-estudiante.page.scss'],
})
export class VerAsistenciaEstudiantePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  vinculos:Recurso_nombre[]=[{
    titulo:'Asignatura_1',
  },
    {
      titulo:'Asignatura_2',

  },
  {
    titulo:'Asignatura_3',

},

  ];
  recurso:Recurso_asistencia[]=[{
    titulo:'70%',
  },
    {
      titulo:'80%',
  },
  {
    titulo:'90%',
},

  ];
}
