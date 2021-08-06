import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Medico } from 'src/app/models/medicos.model';
import { BusquedasService } from 'src/app/services/busquedas.service';

import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription;

  constructor(private medicoService: MedicoService, private modalImagenService: ModalImagenService, private busquedaService: BusquedasService) { }

  ngOnDestroy(){
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen.pipe(delay(100)).subscribe(img => {this.cargarMedicos()} );
  }


  cargarMedicos(){
    this.cargando = true;

    this.medicoService.cargarMedicos().subscribe((medicos) =>{
      this.cargando = false;
      this.medicos = medicos;
    })
  }

  abrirModal(medico: Medico){
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }

  buscar(termino: string){
    if(termino.length === 0){
      return this.cargarMedicos();
    }

    this.busquedaService.buscar('medicos', termino).subscribe(
      resultado => {
        this.medicos = resultado as Medico[];
      }
    )
  }

  eliminarMedico(medico: Medico){
    this.medicoService.eliminarMedico(medico._id).subscribe(resp => {
      this.cargarMedicos();
      Swal.fire('Eliminado', 'El Medico Se Elimino Correctamente', 'error');
    })
  }

  abrirSweetAlert(){

  }

}
