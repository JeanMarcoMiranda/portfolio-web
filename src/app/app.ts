import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeroComponent }           from './features/hero/hero.component';
import { AboutComponent }          from './features/about/about.component';
import { NavbarComponent }         from './core/components/navbar/navbar.component';
import { PageTransitionComponent } from './core/components/page-transition/page-transition.component';
import { NavigationService }       from './core/services/navigation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeroComponent, AboutComponent, NavbarComponent, PageTransitionComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  nav = inject(NavigationService);
}
