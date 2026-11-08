import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../models/Producto';
import { environment } from '../../../environments/environment';
const baseUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private readonly http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('TOKEN_NOTIF') || '';
  }

  get headers() {
    return {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    };
  }
  getAllProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${baseUrl}/menu/items`, this.headers);
  }

  recoverPassword(data: any): Observable<Producto[]> {
    return this.http.post<any[]>(`${environment.authUrl}/recover`, data);
  }
}
