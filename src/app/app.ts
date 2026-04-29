import { Component, inject } from '@angular/core';
import { HeroComponent } from './features/hero/hero.component';
import { AboutComponent } from './features/about/about.component';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { PageTransitionComponent } from './core/components/page-transition/page-transition.component';
import { NavigationService } from './core/services/navigation.service';
import { ProjectsComponent } from './features/projects/projects.component';
import { BlogComponent } from './features/blog/blog.component';
import { ContactComponent } from './features/contact/contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeroComponent,
    AboutComponent,
    ProjectsComponent,
    BlogComponent,
    ContactComponent,
    NavbarComponent,
    PageTransitionComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  nav = inject(NavigationService);
}
