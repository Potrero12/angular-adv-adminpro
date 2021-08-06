import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';

import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medicos.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];

  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;

  constructor(
    private fb: FormBuilder, 
    private hospitalService: HospitalService, 
    private medicoService: MedicoService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(({id}) => {
      this.cargarMedico(id);
    })

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    });
    this.cargarHospitales();

    this.medicoForm.get('hospital').valueChanges.subscribe((hospitalId) => {
      this.hospitalSeleccionado = this.hospitales.find(hosp => hosp._id === hospitalId);
    })

  }

  cargarMedico(id: string){

    if(id === 'nuevo'){
      return;
    }
      
    this.medicoService.cargarMedico(id).pipe(
      delay(100)
    ).subscribe((medico) => {

      if(!medico){
        return this.router.navigateByUrl(`/dashboard/medicos`)
      }

      const { nombre, hospital: {_id} } = medico;
      this.medicoSeleccionado = medico;
      this.medicoForm.setValue({nombre, hospital: _id});  
    })

  }


  cargarHospitales(){
    this.hospitalService.cargarHospitales().subscribe((hospitales: Hospital[]) => {
      this.hospitales = hospitales;
    })
  }

  guardarMedico(){

    // const { nombre } = this.medicoForm.value;

    if(this.medicoSeleccionado){

      const data = {
        ...this.medicoForm.value,
      }
      const _id = this.medicoSeleccionado._id;

      this.medicoService.actualizarMedico(_id ,data).subscribe((resp) => {
        console.log(resp);
        Swal.fire('Actualizado', 'Medico Actualizado Correctamente','success');
      });
    } else {
      
      this.medicoService.crearMedico(this.medicoForm.value).subscribe((resp:any) => {
        Swal.fire('Guarado', 'Medico Guardado Correctamente','success');
        this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`)
      });

    }


  }

}
