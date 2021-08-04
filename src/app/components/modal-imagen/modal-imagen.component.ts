import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir: File;
  public imgTemp: any = null;

  constructor(public modalImagenService: ModalImagenService, private fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }


  cerrarModal(){
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
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

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService.actualizarFoto(this.imagenSubir, tipo, id)
                          .then(img => {
                            Swal.fire('Guardado','Imagen Usuario Actualizada', 'success');
                            this.modalImagenService.nuevaImagen.emit(img);
                            this.cerrarModal();
                          }, (err) => {
                            Swal.fire('Error',err.error.msg, 'error');
                            console.log(err.error.msg)
                          });
  }
}
