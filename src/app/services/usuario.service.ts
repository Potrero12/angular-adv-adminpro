import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable, of, pipe } from 'rxjs';
import { Router } from '@angular/router';

import { RegisterForm } from '../interfaces/registerForm.interface';
import { LoginForm } from '../interfaces/loginForm.interface';

const url = environment.base_url;

declare const gapi;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;

  constructor(private http: HttpClient, private router: Router, private ngZone: NgZone) { 
    this.googleInit();
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
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${url}/auth/renew`,{
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (resp: any )=> {
        localStorage.setItem('token', resp.token)
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
