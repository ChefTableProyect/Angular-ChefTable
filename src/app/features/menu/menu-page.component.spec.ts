import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { MenuApiService } from './menu-api.service';
import { MenuPageComponent } from './menu-page.component';
import { MenuItem } from './menu.models';

@Component({
  standalone: true,
  template: '',
})
class RouteDestinationComponent {}

registerLocaleData(localeEsPe);

describe('MenuPageComponent navigation', () => {
  let fixture: ComponentFixture<MenuPageComponent>;
  let router: Router;

  beforeEach(async () => {
    sessionStorage.clear();

    await TestBed.configureTestingModule({
      imports: [MenuPageComponent],
      providers: [
        provideRouter([
          { path: 'orders/track', component: RouteDestinationComponent },
          { path: 'orders/checkout', component: RouteDestinationComponent },
        ]),
        {
          provide: MenuApiService,
          useValue: {
            getItems: () => of([]),
            getCategories: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuPageComponent);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('opens the order tracking page from the header', fakeAsync(() => {
    const trackingLink = fixture.debugElement.query(By.css('a[routerLink="/orders/track"]'));

    trackingLink.nativeElement.click();
    tick();

    expect(router.url).toBe('/orders/track');
    discardPeriodicTasks();
  }));

  it('opens checkout from the cart drawer', fakeAsync(() => {
    fixture.componentInstance.cart.setTableCode('MESA-01');
    fixture.componentInstance.cart.add(menuItem());
    fixture.componentInstance.cartOpen.set(true);
    fixture.detectChanges();
    const checkoutLink = fixture.debugElement.query(By.css('.checkout-button'));

    checkoutLink.nativeElement.click();
    tick();

    expect(router.url).toBe('/orders/checkout');
    expect(fixture.componentInstance.cartOpen()).toBeFalse();
    discardPeriodicTasks();
  }));
});

function menuItem(): MenuItem {
  return {
    id: 1,
    name: 'Plato de prueba',
    price: 15.5,
    stock: 2,
    active: true,
    available: true,
    categoryId: 1,
    categoryName: 'Entradas',
  };
}
