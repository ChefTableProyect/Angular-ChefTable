// src/app/services/alert.service.ts
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  
  success(message: string, title: string = 'Éxito') {
    Swal.fire({
      title,
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  }

  error(message: string, title: string = 'Error') {
    Swal.fire({
      title,
      text: message,
      icon: 'error',
      confirmButtonText: 'Entendido'
    });
  }

  warning(message: string, title: string = 'Atención') {
    Swal.fire({
      title,
      text: message,
      icon: 'warning',
      confirmButtonText: 'Ok'
    });
  }

  info(message: string, title: string = 'Información') {
    Swal.fire({
      title,
      text: message,
      icon: 'info',
      confirmButtonText: 'Ok'
    });
  }

  confirm(message: string, title: string = '¿Estás seguro?'): Promise<boolean> {
    return Swal.fire({
      title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
    }).then(result => result.isConfirmed);
  }
}
