import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthStore } from '../../core/auth/auth.store';
import { MenuApiService } from '../menu/menu-api.service';
import { MenuCategory, MenuItem } from '../menu/menu.models';
import { AdminApiService } from './admin-api.service';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMenuComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly adminApi = inject(AdminApiService);
  private readonly menuApi = inject(MenuApiService);
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  readonly items = signal<MenuItem[]>([]);
  readonly categories = signal<MenuCategory[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly editorOpen = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly availableCount = computed(() => this.items().filter((item) => item.available).length);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    categoryId: [0, [Validators.required, Validators.min(1)]],
    active: [true],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    forkJoin({ items: this.adminApi.getItems(), categories: this.menuApi.getCategories() }).subscribe({
      next: ({ items, categories }) => {
        this.items.set(items);
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No pudimos cargar la administración del menú.');
        this.loading.set(false);
      },
    });
  }

  create(): void {
    this.editingId.set(null);
    this.form.reset({ name: '', price: 0, stock: 0, categoryId: this.categories()[0]?.id ?? 0, active: true });
    this.editorOpen.set(true);
  }

  edit(item: MenuItem): void {
    this.editingId.set(item.id);
    this.form.reset({
      name: item.name,
      price: item.price,
      stock: item.stock,
      categoryId: item.categoryId ?? 0,
      active: item.active,
    });
    this.editorOpen.set(true);
  }

  save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const request = this.form.getRawValue();
    const operation = this.editingId() === null
      ? this.adminApi.create(request)
      : this.adminApi.update(this.editingId()!, request);
    operation.subscribe({
      next: (saved) => {
        this.items.update((items) => this.editingId() === null
          ? [...items, saved].sort((a, b) => a.name.localeCompare(b.name))
          : items.map((item) => item.id === saved.id ? saved : item));
        this.editorOpen.set(false);
        this.saving.set(false);
      },
      error: () => {
        this.errorMessage.set('No pudimos guardar el plato. Revisa los datos e inténtalo nuevamente.');
        this.saving.set(false);
      },
    });
  }

  deactivate(item: MenuItem): void {
    if (!window.confirm(`¿Desactivar “${item.name}” del menú público?`)) {
      return;
    }
    this.adminApi.deactivate(item.id).subscribe({
      next: () => this.items.update((items) => items.map((entry) =>
        entry.id === item.id ? { ...entry, active: false, available: false } : entry,
      )),
      error: () => this.errorMessage.set('No pudimos desactivar el plato.'),
    });
  }

  logout(): void {
    this.auth.clear();
    void this.router.navigate(['/login']);
  }
}
