import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, RevealOnScrollDirective],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {
  readonly demoTables = [
    { code: 'MESA-01', name: 'Mesa 1' },
    { code: 'MESA-02', name: 'Mesa 2' },
    { code: 'MESA-03', name: 'Mesa 3' },
  ];

  readonly featuredDishes = [
    {
      name: 'Sabores de temporada',
      description: 'Ingredientes frescos, productores locales y una carta que cambia con la estación.',
      image: 'assets/imgs/carousel-5.jpg',
    },
    {
      name: 'Cocina con identidad',
      description: 'Recetas reconocibles con técnicas contemporáneas y una presentación honesta.',
      image: 'assets/imgs/carousel-3.jpg',
    },
    {
      name: 'Una mesa para compartir',
      description: 'Platos pensados para conversar, descubrir y disfrutar sin prisas.',
      image: 'assets/imgs/carousel-7.jpg',
    },
  ];
}
