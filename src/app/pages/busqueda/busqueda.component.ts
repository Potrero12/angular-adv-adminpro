import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusquedasService } from 'src/app/services/busquedas.service';

import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medicos.model';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public medicos: Medico[] = [];
  public hospitales: Hospital[] = [];

  constructor(private activatedRoute: ActivatedRoute, private busquedaService: BusquedasService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({termino}) => {
      this.busquedaGlobal(termino);
    })
  }

  busquedaGlobal(termino:string){
    this.busquedaService.busquedaGlobal(termino).subscribe((resp:any) => {
      this.usuarios = resp.usuario;
      this.medicos = resp.medicos;
      this.hospitales = resp.hospital;
    })
  }

  abrirMedico(medico: Medico){
    
  }

}
