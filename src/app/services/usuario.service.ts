import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable, of, pipe } from 'rxjs';
import { Router } from '@angular/router';

import { RegisterForm } from '../interfaces/registerForm.interface';
import { LoginForm } from '../interfaces/loginForm.interface';

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

  logout() {
    localStorage.removeItem('token');

    this.auth2.signOut().then(() => {

      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  validarToken(): Observable<boolean> {

    return this.http.get(`${url}/auth/renew`,{
      headers: {
        'x-token': this.Token
      }
    }).pipe(
      tap( (resp: any )=> {
        const { email, google, nombre, role, img = '', uid } = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
        localStorage.setItem('token', resp.token);
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
                        localStorage.setItem('token', resp.token)
                      })
                    );

  }

  actualizarPerfil(data: {email:string, nombre: string, role: string}){

    data = {
      ...data,
      role: this.usuario.role
    }

    return this.http.put(`${url}/usuarios/actualizar-usuario/${this.uid}`, data, {
        headers: {
          'x-token': this.Token
        }
      });

  }

  loginUsuario(formData: LoginForm){
    
    return this.http.post(`${url}/auth/login`, formData)
                    .pipe(
                      tap( (resp: any)  => {
                        localStorage.setItem('token', resp.token)
                      })
                    )

  }

  loginGoogle(token){
    
    return this.http.post(`${url}/auth/google`, {token})
                    .pipe(
                      tap( (resp: any)  => {
                        localStorage.setItem('token', resp.token)
                      })
                    )

  }
}
