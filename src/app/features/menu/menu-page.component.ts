import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EMPTY, catchError, finalize, forkJoin, switchMap, timer } from 'rxjs';
import { CartStore } from '../cart/cart.store';
import { MenuApiService } from './menu-api.service';
import { MenuCategory, MenuItem } from './menu.models';

@Component({
  selector: 'app-menu-page',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './menu-page.component.html',
  styleUrl: './menu-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuPageComponent implements OnInit {
  private readonly menuApi = inject(MenuApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly cart = inject(CartStore);
  readonly items = signal<MenuItem[]>([]);
  readonly categories = signal<MenuCategory[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly search = signal('');
  readonly selectedCategory = signal<number | null>(null);
  readonly cartOpen = signal(false);
  readonly tableLoading = signal(true);
  readonly tableVerified = signal(false);
  readonly tableName = signal('');
  readonly tableError = signal('');

  readonly filteredItems = computed(() => {
    const term = this.search().trim().toLowerCase();
    const category = this.selectedCategory();
    return this.items().filter((item) => {
      const matchesCategory = category === null || item.categoryId === category;
      const matchesTerm = !term || item.name.toLowerCase().includes(term) || item.categoryName.toLowerCase().includes(term);
      return matchesCategory && matchesTerm;
    });
  });

  ngOnInit(): void {
    const table = this.route.snapshot.queryParamMap.get('table') ?? this.cart.tableCode();
    this.resolveTable(table);
    this.loadMenu();
    timer(30_000, 30_000).pipe(
      switchMap(() => this.menuApi.getItems().pipe(catchError(() => EMPTY))),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((items) => {
      this.items.set(items);
      this.cart.reconcile(items);
    });
  }

  loadMenu(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    forkJoin({
      items: this.menuApi.getItems(),
      categories: this.menuApi.getCategories(),
    }).subscribe({
      next: ({ items, categories }) => {
        this.items.set(items);
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No pudimos cargar el menú. Verifica que la API esté disponible.');
        this.loading.set(false);
      },
    });
  }

  imageFor(item: MenuItem): string {
    const images = [
      'assets/imgs/carousel-5.jpg',
      'assets/imgs/carousel-3.jpg',
      'assets/imgs/carousel-7.jpg',
      'assets/imgs/about-1.jpg',
      'assets/imgs/carousel-4.jpg',
    ];
    return images[item.id % images.length];
  }

  updateSearch(value: string): void {
    this.search.set(value);
  }

  private resolveTable(code: string): void {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      this.tableLoading.set(false);
      this.tableError.set('Escanea el QR de tu mesa para habilitar el pedido.');
      return;
    }

    this.tableLoading.set(true);
    this.tableError.set('');
    this.menuApi.getTable(normalized)
      .pipe(finalize(() => this.tableLoading.set(false)))
      .subscribe({
        next: (table) => {
          this.cart.setTableCode(table.code);
          this.tableName.set(table.name);
          this.tableVerified.set(true);
        },
        error: () => {
          this.cart.clearTableContext();
          this.tableVerified.set(false);
          this.tableError.set('El QR no corresponde a una mesa activa. Prueba uno de los accesos de demostración.');
        },
      });
  }
}
