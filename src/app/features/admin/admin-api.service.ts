import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MenuItem } from '../menu/menu.models';

export interface AdminMenuItemRequest {
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/admin/menu/items`;

  getItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.url);
  }

  create(request: AdminMenuItemRequest): Observable<MenuItem> {
    return this.http.post<MenuItem>(this.url, request);
  }

  update(id: number, request: AdminMenuItemRequest): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.url}/${id}`, request);
  }

  deactivate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
