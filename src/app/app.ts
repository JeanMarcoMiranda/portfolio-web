import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeroComponent as Hero } from './features/hero/hero.component';
import { AboutComponent as About } from './features/about/about.component';
import { NavbarComponent as Navbar } from './core/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Hero, About, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('jean-portfolio');
}
