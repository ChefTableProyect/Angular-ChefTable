import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { EMPTY, catchError, switchMap, timer } from 'rxjs';
import { AuthStore } from '../../core/auth/auth.store';
import { OrderApiService } from '../orders/order-api.service';
import { OrderResponse, OrderStatus } from '../orders/order.models';

@Component({
  selector: 'app-kitchen-board',
  standalone: true,
  imports: [DatePipe, NgTemplateOutlet],
  templateUrl: './kitchen-board.component.html',
  styleUrl: './kitchen-board.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitchenBoardComponent implements OnInit {
  private readonly orderApi = inject(OrderApiService);
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly orders = signal<OrderResponse[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly updatingId = signal<number | null>(null);

  readonly confirmed = computed(() => this.orders().filter((order) => order.status === 'CONFIRMED'));
  readonly preparing = computed(() => this.orders().filter((order) => order.status === 'PREPARING'));
  readonly ready = computed(() => this.orders().filter((order) => order.status === 'READY'));

  ngOnInit(): void {
    timer(0, 8_000).pipe(
      switchMap(() => this.orderApi.findKitchenQueue().pipe(
        catchError(() => {
          this.errorMessage.set('No pudimos actualizar la cola de cocina.');
          this.loading.set(false);
          return EMPTY;
        }),
      )),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((orders) => {
      this.orders.set(orders);
      this.errorMessage.set('');
      this.loading.set(false);
    });
  }

  move(order: OrderResponse, status: OrderStatus): void {
    this.updatingId.set(order.id);
    this.orderApi.updateStatus(order.id, status).subscribe({
      next: (updated) => {
        if (status === 'DELIVERED' || status === 'CANCELLED') {
          this.orders.update((orders) => orders.filter((entry) => entry.id !== order.id));
        } else {
          this.orders.update((orders) => orders.map((entry) => entry.id === order.id ? updated : entry));
        }
        this.updatingId.set(null);
      },
      error: () => {
        this.errorMessage.set('El estado cambió en otro dispositivo. Actualizaremos la cola.');
        this.updatingId.set(null);
      },
    });
  }

  logout(): void {
    this.auth.clear();
    void this.router.navigate(['/login']);
  }
}
