import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../guard/auth.guard';
import { AdminGuard } from '../guard/admin.guard';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { MedicoComponent } from './mantenimientos/medicos/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';



const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DashboardComponent, data: {titulo: 'Dashboard'} },
            { path: 'progress', component: ProgressComponent, data: {titulo: 'ProgressBar'} },
            { path: 'grafica1', component: Grafica1Component, data: {titulo: 'Graficas'} },
            { path: 'account-settings', component: AccountSettingsComponent, data: {titulo: 'Ajuste De Cuenta'} },
            { path: 'promesas', component: PromesasComponent, data: {titulo: 'Promesas'} },
            { path: 'rxjs', component: RxjsComponent, data: {titulo: 'RxJs'} },
            { path: 'perfil-usuario', component: PerfilComponent, data: {titulo: 'Perfil de Usuario'} },
            { path: 'buscar/:termino', component: BusquedaComponent, data: {titulo: 'Busquedas'} },

            //mantenimientos
            { path: 'hospitales', component: HospitalesComponent, data: {titulo: 'Hospitales de la Aplicación'} },
            { path: 'medicos', component: MedicosComponent, data: {titulo: 'Medicos de la Aplicación'} },
            { path: 'medico/:id', component: MedicoComponent, data: {titulo: 'Medico de la Aplicación'} },

            //rutas de admin
            { path: 'usuarios', canActivate: [AdminGuard], component: UsuariosComponent, data: {titulo: 'Usuarios de Aplicación'} },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
