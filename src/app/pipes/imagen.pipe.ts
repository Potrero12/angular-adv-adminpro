import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const url = environment.base_url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipos: 'medicos' | 'usuarios' | 'hospitales'): unknown {

    if (!img) {
      return `${url}/upload/usuarios/no-image`;
    } else if (img.includes('https')) {
      return img
    } else if (img) {
      return `${url}/upload/${tipos}/${img}`;
    } else {
      return `${url}/upload/usuarios/no-image`;
    }
  }


}
