import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EMPTY, catchError, switchMap, timer } from 'rxjs';
import { OrderApiService } from './order-api.service';
import { OrderResponse, OrderStatus } from './order.models';

@Component({
  selector: 'app-tracking-page',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, FormsModule, RouterLink],
  templateUrl: './tracking-page.component.html',
  styleUrl: './tracking-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackingPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orderApi = inject(OrderApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly order = signal<OrderResponse | null>(null);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly code = signal('');
  readonly hasPublicCode = signal(false);

  readonly statusLabel = computed(() => {
    const labels: Record<OrderStatus, string> = {
      CONFIRMED: 'Pedido confirmado',
      PREPARING: 'En preparación',
      READY: 'Listo para entregar',
      DELIVERED: 'Entregado',
      CANCELLED: 'Pedido cancelado',
    };
    return this.order() ? labels[this.order()!.status] : '';
  });

  ngOnInit(): void {
    const publicCode = this.route.snapshot.paramMap.get('publicCode');
    if (publicCode) {
      this.hasPublicCode.set(true);
      this.code.set(publicCode);
      this.startPolling(publicCode);
    }
  }

  search(): void {
    const normalized = this.code().trim().toUpperCase();
    if (normalized) {
      void this.router.navigate(['/orders', normalized]);
    }
  }

  stepReached(step: OrderStatus): boolean {
    const sequence: OrderStatus[] = ['CONFIRMED', 'PREPARING', 'READY', 'DELIVERED'];
    const current = this.order()?.status;
    return current !== undefined && current !== 'CANCELLED' && sequence.indexOf(current) >= sequence.indexOf(step);
  }

  private startPolling(publicCode: string): void {
    this.loading.set(true);
    timer(0, 10_000).pipe(
      switchMap(() => this.orderApi.find(publicCode).pipe(
        catchError(() => {
          this.errorMessage.set('No encontramos un pedido con ese código.');
          this.loading.set(false);
          return EMPTY;
        }),
      )),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((order) => {
      this.order.set(order);
      this.errorMessage.set('');
      this.loading.set(false);
    });
  }
}
