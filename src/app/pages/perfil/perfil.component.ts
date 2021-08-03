import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Usuario } from 'src/app/models/usuario.model';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;

  constructor(private fb: FormBuilder, private userService: UsuarioService, private fileUploadService: FileUploadService) { 
    this.usuario = userService.usuario;
  }

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]]
    })

  }

  actualizarPerfil(){
    console.log(this.perfilForm.value);
    this.userService.actualizarPerfil(this.perfilForm.value).subscribe(() => {
      const { nombre, email } = this.perfilForm.value
      this.usuario.nombre = nombre;
      this.usuario.email = email;

      Swal.fire('Guardado','Usuario Actualizado Correctamente', 'success');
    }, (err) => {
      Swal.fire('Error',err.error.msg, 'error');
      console.log(err.error.msg)
    })  
  }

  cambiarImagen( event ) {
    this.imagenSubir = event.target.files[0];

    if(!event.target.files[0]) {
      return this.imgTemp = null;
    }

    if(!event.target.files[0]){
      return;
    }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(event.target.files[0]);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen(){
    this.fileUploadService.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
                          .then(img => {
                            this.usuario.img = img
                            Swal.fire('Guardado','Imagen Usuario Actualizada', 'success');
                          }, (err) => {
                            Swal.fire('Error',err.error.msg, 'error');
                            console.log(err.error.msg)
                          });
  }
}
