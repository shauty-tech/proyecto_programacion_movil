import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
@Component({
  selector: 'app-ingresar-asignatura',
  templateUrl: './ingresar-asignatura.page.html',
  styleUrls: ['./ingresar-asignatura.page.scss'],
})
export class IngresarAsignaturaPage implements OnInit {
  accion:string=''

  clase:string=''

  codigo: string = '';
  codigoValido: boolean = true;
  asignatura: string = '';
  asignaturaValida: boolean = true;
  mensajeError: string = '';
  constructor(private router: Router) { }

  ngOnInit() {
  }
  validarCodigo() {
    if (this.codigo && this.codigo.toString().length === 5) {
      if (/^\d+$/.test(this.codigo)) {
        this.codigoValido = true;
        this.mensajeError = '';
      } else {
        this.codigoValido = false;
        this.mensajeError = 'No se permiten caracteres.';
      }
    } else {
      this.codigoValido = false;
      this.mensajeError = 'El código debe tener exactamente 5 dígitos.';
    }
  }
  validarAsignatura() {
    const length = this.asignatura.trim().length;
    this.asignaturaValida = length >= 3 && length <= 20;
  }

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

  alertButtons = [{
    text: 'Aceptar',
    cssClass: 'btnAceptarStyle',
    handler: () => {
      if (this.codigoValido && this.asignaturaValida) {
        this.accion = 'Presionó aceptar';
        this.codigo = '';
        this.asignatura = '';
        this.router.navigate(['/menu-profesor']);
      } else {
        // Aquí puedes agregar un mensaje de error o feedback
        this.accion = 'Código o asignatura no válidos';
      }
    }
  }, {
    text: 'Cancelar',
    cssClass: 'btnCancelarStyle',
    handler: () => {
      this.accion = "Presionó cancelar";
    }
  }];


}
