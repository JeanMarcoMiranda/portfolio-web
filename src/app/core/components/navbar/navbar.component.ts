import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ScrollService, SectionId } from '../../services/scroll.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly scrollService = inject(ScrollService);

  // Exposed from service
  activeSection = this.scrollService.activeSection;
  scrollProgress = this.scrollService.scrollProgress;

  // Local state
  isScrolled = signal(false);
  isMenuOpen = signal(false);

  readonly navLinks: { id: SectionId; label: string }[] = [
    { id: 'home',     label: 'INICIO'   },
    { id: 'about',    label: 'STATS'    },
    { id: 'projects', label: 'MISIONES' },
    { id: 'contact',  label: 'CONTACTO' },
  ];

  constructor() {
    // Listen to scroll for navbar background blur effect
    if (typeof window !== 'undefined') {
      window.addEventListener(
        'scroll',
        () => this.isScrolled.set(window.scrollY > 50),
        { passive: true },
      );
    }
  }

  scrollTo(id: SectionId): void {
    this.scrollService.scrollTo(id);
    // Close mobile menu after navigation
    this.isMenuOpen.set(false);
  }

  toggleMenu(): void {
    this.isMenuOpen.update((v) => !v);
  }
}
