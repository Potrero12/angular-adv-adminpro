import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';

const url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(
    private http: HttpClient
  ) { }


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

  cargarHospitales(){

    return this.http.get(`${url}/hospitales`, this.headers)
                    .pipe(
                      map((resp:{ok: true, hospitales: Hospital[]}) => resp.hospitales)
                    );
  }

  crearHospital(nombre: string){

    return this.http.post(`${url}/hospitales/crear-hospital`,{nombre}, this.headers);
  }

  actualizarHospital(_id: string, nombre: string){

    return this.http.put(`${url}/hospitales/actualizar-hospital/${_id}`,{nombre}, this.headers);
  }

  eliminarHospital(_id: string){

    return this.http.delete(`${url}/hospitales/borrar-hospital/${_id}`, this.headers);
  }
}
