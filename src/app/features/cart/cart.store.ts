import { Injectable, computed, signal } from '@angular/core';
import { MenuItem } from '../menu/menu.models';
import { CartItem } from './cart.models';

const CART_KEY = 'cheftable.cart';
const TABLE_KEY = 'cheftable.table';
const IDEMPOTENCY_KEY = 'cheftable.order-idempotency-key';

function readCart(): CartItem[] {
  try {
    const value = sessionStorage.getItem(CART_KEY);
    return value ? (JSON.parse(value) as CartItem[]) : [];
  } catch {
    sessionStorage.removeItem(CART_KEY);
    return [];
  }
}

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly itemsState = signal<CartItem[]>(readCart());
  private readonly tableCodeState = signal(sessionStorage.getItem(TABLE_KEY) ?? '');

  readonly items = this.itemsState.asReadonly();
  readonly tableCode = this.tableCodeState.asReadonly();
  readonly itemCount = computed(() =>
    this.itemsState().reduce((total, item) => total + item.quantity, 0),
  );
  readonly total = computed(() =>
    this.itemsState().reduce((total, item) => total + item.product.price * item.quantity, 0),
  );

  add(product: MenuItem): void {
    if (!this.tableCodeState() || !product.available || product.stock < 1) {
      return;
    }

    const current = this.itemsState();
    const existing = current.find((item) => item.product.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        return;
      }
      this.save(current.map((item) =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
      ));
      return;
    }

    this.save([...current, { product, quantity: 1, notes: '' }]);
  }

  decrease(productId: number): void {
    const item = this.itemsState().find((entry) => entry.product.id === productId);
    if (!item) {
      return;
    }
    if (item.quantity === 1) {
      this.remove(productId);
      return;
    }
    this.save(this.itemsState().map((entry) =>
      entry.product.id === productId ? { ...entry, quantity: entry.quantity - 1 } : entry,
    ));
  }

  remove(productId: number): void {
    this.save(this.itemsState().filter((item) => item.product.id !== productId));
  }

  updateNotes(productId: number, notes: string): void {
    this.save(this.itemsState().map((item) =>
      item.product.id === productId ? { ...item, notes } : item,
    ));
  }

  setTableCode(code: string): void {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      return;
    }
    if (normalized === this.tableCodeState()) {
      return;
    }
    if (this.tableCodeState() && this.itemsState().length > 0) {
      this.save([]);
    }
    this.tableCodeState.set(normalized);
    sessionStorage.setItem(TABLE_KEY, normalized);
    this.resetIdempotencyKey();
  }

  clearTableContext(): void {
    this.itemsState.set([]);
    this.tableCodeState.set('');
    sessionStorage.removeItem(CART_KEY);
    sessionStorage.removeItem(TABLE_KEY);
    this.resetIdempotencyKey();
  }

  clear(): void {
    this.save([]);
  }

  getOrCreateIdempotencyKey(): string {
    const existing = sessionStorage.getItem(IDEMPOTENCY_KEY);
    if (existing) {
      return existing;
    }
    const key = crypto.randomUUID();
    sessionStorage.setItem(IDEMPOTENCY_KEY, key);
    return key;
  }

  resetIdempotencyKey(): void {
    sessionStorage.removeItem(IDEMPOTENCY_KEY);
  }

  reconcile(menuItems: MenuItem[]): boolean {
    const menuById = new Map(menuItems.map((item) => [item.id, item]));
    const nextItems = this.itemsState().flatMap((item) => {
      const currentProduct = menuById.get(item.product.id);
      if (!currentProduct?.available || currentProduct.stock < 1) {
        return [];
      }
      return [{
        ...item,
        product: currentProduct,
        quantity: Math.min(item.quantity, currentProduct.stock),
      }];
    });
    const changed = JSON.stringify(nextItems) !== JSON.stringify(this.itemsState());
    if (changed) {
      this.save(nextItems);
    }
    return changed;
  }

  private save(items: CartItem[]): void {
    this.itemsState.set(items);
    sessionStorage.setItem(CART_KEY, JSON.stringify(items));
    this.resetIdempotencyKey();
  }
}
