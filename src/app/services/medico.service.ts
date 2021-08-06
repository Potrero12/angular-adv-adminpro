import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medicos.model';

const url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http: HttpClient) { }

  get Token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.Token
      }
    }
  }

  cargarMedicos(){
    return this.http.get(`${url}/medicos`, this.headers)
    .pipe(
      map((resp:{ok: true, medicos: Medico[]}) => resp.medicos)
    );
  }

  cargarMedico(_id: string){
    return this.http.get(`${url}/medicos/${_id}`, this.headers)
                    .pipe(
                      map((resp:{ok: true, medico: Medico}) => resp.medico)
                    );
  }

  crearMedico(medicos: {nombre: string, hospital: string}){

    return this.http.post(`${url}/medicos/crear-medico`,medicos, this.headers);
  }

  actualizarMedico(_id: string, medicos: Medico){

    return this.http.put(`${url}/medicos/actualizar-medico/${_id}`,medicos, this.headers);
  }

  eliminarMedico(_id: string){

    return this.http.delete(`${url}/medicos/borrar-medico/${_id}`, this.headers);
  }
}

