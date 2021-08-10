import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable, of, pipe } from 'rxjs';
import { Router } from '@angular/router';

import { RegisterForm } from '../interfaces/registerForm.interface';
import { LoginForm } from '../interfaces/loginForm.interface';
import { cargarUsuarios } from '../interfaces/cargar-usuarios.interface';

import { Usuario } from '../models/usuario.model';

const url = environment.base_url;

declare const gapi;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor(private http: HttpClient, private router: Router, private ngZone: NgZone) { 
    this.googleInit();
  }

  get uid(): string{
    return this.usuario.uid || '';
  }

  get Token(): string{
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers: {
        'x-token': this.Token
      }
    }
  }

  get role():'ADMIN_ROLE' | 'USER_ROLE'{
    return this.usuario.role
  }

  googleInit() {

    return new Promise((resolve:any) => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '264682096132-5hisnv4mqb2t92l6phr6p6vvmf7njj2k.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
  
        });

        resolve();
      });
    })
  }

  guardarStorage(token: string, menu:any){
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  logout() {
    localStorage.removeItem('token');
    
    localStorage.removeItem('menu');

    this.auth2.signOut().then(() => {

      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  validarToken(): Observable<boolean> {

    return this.http.get(`${url}/auth/renew`, this.headers).pipe(
      tap( (resp: any )=> {
        const { email, google, nombre, role, img = '', uid } = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
        this.guardarStorage(resp.token, resp.menu);
        return true;
      }),
      map( resp => true),
      catchError(error  => of(false))
    );
  }

  crearUsuario(formData: RegisterForm){
    
    return this.http.post(`${url}/usuarios/crear-usuario`, formData)
                    .pipe(
                      tap( (resp: any)  => {
                        this.guardarStorage(resp.token, resp.menu);
                      })
                    );

  }

  actualizarPerfil(data: {email:string, nombre: string, role: string}){

    data = {
      ...data,
      role: this.usuario.role
    }

    return this.http.put(`${url}/usuarios/actualizar-usuario/${this.uid}`, data, this.headers);

  }

  loginUsuario(formData: LoginForm){
    
    return this.http.post(`${url}/auth/login`, formData)
                    .pipe(
                      tap( (resp: any)  => {
                        this.guardarStorage(resp.token, resp.menu);
                      })
                    )

  }

  loginGoogle(token){
    
    return this.http.post(`${url}/auth/google`, {token})
                    .pipe(
                      tap( (resp: any)  => {
                        this.guardarStorage(resp.token, resp.menu);
                      })
                    )

  }

  cargarUsuarios(desde: number = 5){

    return this.http.get<cargarUsuarios>(`${url}/usuarios?desde=${desde}`, this.headers)
                    .pipe(
                      // delay(500),
                      map(resp => {

                        const usuarios = resp.usuarios.map(
                                                        user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
                        );

                        return {
                          total: resp.total,
                          usuarios
                        };
                      })
                    );
  }

  eliminarUsuario({uid}: Usuario) {
    return this.http.delete(`${url}/usuarios/borrar-usuario/${uid}`, this.headers);
  }

  guardarUsuario(usuario: Usuario){


    return this.http.put(`${url}/usuarios/actualizar-usuario/${this.usuario.uid}`, usuario, this.headers);

  }


}
