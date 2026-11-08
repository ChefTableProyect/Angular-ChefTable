import { MenuItem } from '../menu/menu.models';
import { CartStore } from './cart.store';

describe('CartStore', () => {
  beforeEach(() => sessionStorage.clear());

  it('reuses the idempotency key until the order changes', () => {
    const store = new CartStore();
    store.setTableCode('MESA-01');
    store.add(menuItem({ id: 1, stock: 3 }));

    const firstKey = store.getOrCreateIdempotencyKey();
    const retryKey = store.getOrCreateIdempotencyKey();
    store.updateNotes(1, 'sin cebolla');
    const changedOrderKey = store.getOrCreateIdempotencyKey();

    expect(retryKey).toBe(firstKey);
    expect(changedOrderKey).not.toBe(firstKey);
  });

  it('clips quantities and removes unavailable products when reconciling', () => {
    const store = new CartStore();
    store.setTableCode('MESA-01');
    const first = menuItem({ id: 1, stock: 3 });
    const second = menuItem({ id: 2, stock: 1 });
    store.add(first);
    store.add(first);
    store.add(first);
    store.add(second);

    const changed = store.reconcile([
      menuItem({ id: 1, stock: 1 }),
      menuItem({ id: 2, stock: 0, available: false }),
    ]);

    expect(changed).toBeTrue();
    expect(store.items().length).toBe(1);
    expect(store.items()[0].quantity).toBe(1);
    expect(store.items()[0].product.stock).toBe(1);
  });

  it('does not add products before a table is identified', () => {
    const store = new CartStore();

    store.add(menuItem({ id: 1 }));

    expect(store.items()).toEqual([]);
  });

  it('clears the cart when a different table is assigned', () => {
    const store = new CartStore();
    store.setTableCode('MESA-01');
    store.add(menuItem({ id: 1 }));

    store.setTableCode('MESA-02');

    expect(store.tableCode()).toBe('MESA-02');
    expect(store.items()).toEqual([]);
  });
});

function menuItem(overrides: Partial<MenuItem>): MenuItem {
  return {
    id: 1,
    name: 'Plato de prueba',
    price: 25,
    stock: 1,
    active: true,
    available: true,
    categoryId: 1,
    categoryName: 'Pruebas',
    ...overrides,
  };
}
