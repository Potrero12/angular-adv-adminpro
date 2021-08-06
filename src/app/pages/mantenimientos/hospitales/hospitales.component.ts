import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Hospital } from 'src/app/models/hospital.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription;

  constructor(private hospitalService: HospitalService, private modalImagenService: ModalImagenService, private busquedaService: BusquedasService) { }

  ngOnDestroy(){
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {

    this.cargarHospital();
    this.imgSubs = this.modalImagenService.nuevaImagen.pipe(delay(100)).subscribe(img => {this.cargarHospital()} );

  }

  buscar(termino: string) {

    if(termino.length === 0){
      return this.cargarHospital();
    }

    this.busquedaService.buscar('hospitales', termino).subscribe(
      resultado => {
        this.hospitales = resultado as Hospital[];
      }
    )
  }

  cargarHospital(){
    this.cargando = true;

    this.hospitalService.cargarHospitales().subscribe((hospitales) =>{
      this.cargando = false;
      this.hospitales = hospitales;
    })
  }

  guardarCambios(hospital: Hospital){
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre).subscribe((resp) => {
      Swal.fire('Actualizado', 'El Hospital Se Actualizo Correctamente', 'success');
    })
  }

  eliminarHospital(hospital: Hospital){
    this.hospitalService.eliminarHospital(hospital._id,).subscribe((resp) => {
      this.cargarHospital();
      Swal.fire('Eliminado', 'El Hospital Se Elimino Correctamente', 'error');
    })
  }

  async abrirSweetAlert(){
    const {value = ''} = await Swal.fire<string>({
      title: 'Creación De Hospitales',
      cancelButtonText: 'Cancelar',
      confirmButtonText:'Guardar',
      input: 'text',
      inputLabel: 'Nombre Del Hospital',
      inputPlaceholder: 'Nombre Del Hospital',
      showCancelButton: true
    })

    if(value.trim().length > 0){
      this.hospitalService.crearHospital(value).subscribe((resp:any) => {
        this.hospitales.push(resp.hospital)
      })
    } else {
      Swal.fire('Incorrecto', 'Ingresa El Nombre Del Hospital', 'error');
    }
  }

  abrirModal(hospital: Hospital){
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
  }

}
