import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CartStore } from '../cart/cart.store';
import { MenuApiService } from '../menu/menu-api.service';
import { OrderApiService } from './order-api.service';
import { ApiErrorResponse } from './order.models';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPageComponent implements OnInit {
  private readonly orderApi = inject(OrderApiService);
  private readonly menuApi = inject(MenuApiService);
  private readonly router = inject(Router);

  readonly cart = inject(CartStore);
  readonly submitting = signal(false);
  readonly checkingAvailability = signal(false);
  readonly errorMessage = signal('');
  readonly availabilityMessage = signal('');

  ngOnInit(): void {
    this.refreshAvailability();
  }

  confirm(): void {
    if (this.cart.items().length === 0 || !this.cart.tableCode() || this.submitting() || this.checkingAvailability()) {
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');
    const idempotencyKey = this.cart.getOrCreateIdempotencyKey();
    this.orderApi.create({
      tableCode: this.cart.tableCode(),
      items: this.cart.items().map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        notes: item.notes.trim() || null,
      })),
    }, idempotencyKey).pipe(finalize(() => this.submitting.set(false))).subscribe({
      next: (order) => {
        this.cart.clear();
        void this.router.navigate(['/orders', order.publicCode]);
      },
      error: (error: HttpErrorResponse) => {
        const apiError = error.error as Partial<ApiErrorResponse> | undefined;
        this.errorMessage.set(apiError?.title ?? 'No pudimos confirmar el pedido. Revisa la mesa y la disponibilidad.');
        if (apiError?.type === 'INSUFFICIENT_STOCK' || apiError?.type === 'PRODUCT_UNAVAILABLE') {
          this.refreshAvailability();
        }
      },
    });
  }

  private refreshAvailability(): void {
    if (this.cart.items().length === 0) {
      return;
    }
    this.checkingAvailability.set(true);
    this.menuApi.getItems()
      .pipe(finalize(() => this.checkingAvailability.set(false)))
      .subscribe({
        next: (items) => {
          const changed = this.cart.reconcile(items);
          this.availabilityMessage.set(changed
            ? 'Actualizamos tu pedido porque cambió la disponibilidad del menú.'
            : 'Disponibilidad verificada con cocina.');
        },
        error: () => this.availabilityMessage.set('No pudimos actualizar la disponibilidad; se validará al confirmar.'),
      });
  }
}
