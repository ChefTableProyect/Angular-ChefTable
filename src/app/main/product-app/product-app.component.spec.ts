import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { ProductAppComponent } from './product-app.component';

describe('ProductAppComponent', () => {
  let component: ProductAppComponent;
  let fixture: ComponentFixture<ProductAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductAppComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
