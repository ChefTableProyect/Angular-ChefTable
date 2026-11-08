import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateOrderRequest, OrderResponse, OrderStatus } from './order.models';

@Injectable({ providedIn: 'root' })
export class OrderApiService {
  private readonly http = inject(HttpClient);

  create(request: CreateOrderRequest, idempotencyKey: string): Observable<OrderResponse> {
    const headers = new HttpHeaders({ 'Idempotency-Key': idempotencyKey });
    return this.http.post<OrderResponse>(`${environment.apiUrl}/orders`, request, { headers });
  }

  find(publicCode: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${environment.apiUrl}/orders/${encodeURIComponent(publicCode)}`);
  }

  findKitchenQueue(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${environment.apiUrl}/kitchen/orders`);
  }

  updateStatus(id: number, status: OrderStatus): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${environment.apiUrl}/kitchen/orders/${id}/status`, { status });
  }
}
