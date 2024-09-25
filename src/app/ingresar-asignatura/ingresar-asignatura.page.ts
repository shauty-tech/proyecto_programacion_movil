import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { AlertController } from '@ionic/angular';
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
  constructor(private router: Router, private alertController: AlertController)  { }

  ngOnInit() {
  }
  validarCodigo() {
    // Verificamos que el código no sea nulo y tenga exactamente 4 caracteres
    if (this.codigo && this.codigo.toString().length === 4) {
      // Utilizamos una expresión regular para validar el formato
      const regex = /^(?=(?:[^0-9]*[0-9]){3})(?=(?:[^a-zA-Z]*[a-zA-Z]){1}).{4}$/;
      if (regex.test(this.codigo)) {
        this.codigoValido = true;
        this.mensajeError = '';
      } else {
        this.codigoValido = false;
        this.mensajeError = 'El código debe contener exactamente 3 números y 1 letra.';
      }
    } else {
      this.codigoValido = false;
      this.mensajeError = 'El código debe tener exactamente 4 caracteres.';
    }
  }
  validarAsignatura() {
    const length = this.asignatura.trim().length;
    this.asignaturaValida = length >= 3 && length <= 20;
  }
  async submitCodigo() {
    this.validarCodigo();
    if (this.codigoValido) {
      const alert = await this.alertController.create({
        header: 'Advertencia',
        subHeader: 'Cuidado',
        message: '¿Está seguro de GUARDAR la siguiente asignatura?',
        buttons: this.alertButtons,
        backdropDismiss: false
      });
      await alert.present();
    } else {
      console.log("Código no válido.");
    }
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
