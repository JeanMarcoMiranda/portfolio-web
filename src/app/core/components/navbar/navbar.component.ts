import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NavigationService, SectionId } from '../../services/navigation.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly nav = inject(NavigationService);

  activeSection = this.nav.currentSection;

  // Navbar becomes opaque on any section other than home
  isScrolled = computed(() => this.nav.currentSection() !== 'home' || this.nav.isTransitioning());

  isMenuOpen = signal(false);

  readonly navLinks: { id: SectionId; label: string }[] = [
    { id: 'home',       label: 'INICIO'     },
    { id: 'about',      label: 'STATS'      },
    { id: 'projects',   label: 'MISIONES'   },
    { id: 'chronicles', label: 'DATA_LOGS'  },
    { id: 'contact',    label: 'CONTACTO'   },
  ];

  navigateTo(id: SectionId): void {
    this.nav.navigateTo(id);
    this.isMenuOpen.set(false);
  }

  toggleMenu(): void {
    this.isMenuOpen.update((v) => !v);
  }
}
