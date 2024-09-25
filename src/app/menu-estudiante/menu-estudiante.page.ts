import { Component, OnInit } from '@angular/core';
import { ItemList } from 'src/app/interfaces/itemlist';
import { Router } from '@angular/router'; 
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-menu-estudiante',
  templateUrl: './menu-estudiante.page.html',
  styleUrls: ['./menu-estudiante.page.scss'],
})
export class MenuEstudiantePage implements OnInit {

  constructor(private router: Router, private alertController: AlertController) { }

  ngOnInit() {
  }


  accion:string=''

  clase:string=''
  vinculos:ItemList[]=[{
    ruta:'/registrar-camara',
    titulo:'Registrar asistencia',
    icono:'walk-outline'
  },
  {
    ruta:'/ver-asistencia-estudiante',
    titulo:'ver asistencia',
    icono:'school-outline'
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
  }];


  async submitCodigo() {

      const alert = await this.alertController.create({
        header: 'Cerrar sesion',
        subHeader: 'Cuidado',
        message: '¿Esta seguro de cerrar su seccion actual?',
        buttons: this.alertButtons,
        backdropDismiss: false
      });
      await alert.present();

  }
}
