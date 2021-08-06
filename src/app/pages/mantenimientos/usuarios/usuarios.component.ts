import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Usuario } from 'src/app/models/usuario.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuario: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public imgSubs: Subscription
  public desde: number = 0;
  public cargando:boolean = true;

  constructor(
      private userService: UsuarioService, 
      private busquedaService: BusquedasService, 
      private modalImagenService: ModalImagenService
    ) { }

    ngOnDestroy(){
      this.imgSubs.unsubscribe();
    }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalImagenService.nuevaImagen.pipe(delay(100)).subscribe(img => {this.cargarUsuarios()} );
  }

  cargarUsuarios() {

    this.cargando = true;

    this.userService.cargarUsuarios(this.desde)
    .subscribe( ({ total, usuarios }) => {
      this.totalUsuario = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
    })
  }

  cambiarPagina(valor: number){
    this.desde += valor;

    if(this.desde < 0){
      this.desde = 0;
    } else if(this.desde >= this.totalUsuario) {
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }

  buscar( termino: string ) {

    if ( termino.length === 0 ) {
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedaService.buscar( 'usuarios', termino )
        .subscribe( resp => {

          this.usuarios = resp as Usuario[];

        });
  }

  eliminarUsuario(usuario: Usuario){

    if(usuario.uid === this.userService.usuario.uid){
      return Swal.fire('Warning', 'No Puedes eliminarte a ti mismo', 'warning');
    }

    Swal.fire({
      title: 'Borrar Usuario?',
      text: `Estas A Punto De Borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {

        this.userService.eliminarUsuario(usuario).subscribe(
          resp => {
            this.cargarUsuarios();
            Swal.fire(
            'Eliminado!',
            `El Usuario ${usuario.nombre} Ha Sido Eliminado`,
            'success'
            )
          }
        );

      }
    })
  }

  cambiarRole(usuario: Usuario){
    this.userService.guardarUsuario(usuario).subscribe((resp) => {
      console.log(resp);
    })
  }

  abrirModal(usuario: Usuario){
    console.log(usuario);
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }

}
