import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DiningTable, MenuCategory, MenuItem } from './menu.models';

@Injectable({ providedIn: 'root' })
export class MenuApiService {
  private readonly http = inject(HttpClient);

  getItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${environment.apiUrl}/menu/items`);
  }

  getCategories(): Observable<MenuCategory[]> {
    return this.http.get<MenuCategory[]>(`${environment.apiUrl}/menu/categories`);
  }

  getTable(code: string): Observable<DiningTable> {
    return this.http.get<DiningTable>(`${environment.apiUrl}/tables/${encodeURIComponent(code)}`);
  }
}
