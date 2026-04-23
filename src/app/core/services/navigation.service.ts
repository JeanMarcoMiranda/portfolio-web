import {
  Injectable, OnDestroy, PLATFORM_ID, inject, signal, computed,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// ── Types ─────────────────────────────────────────────────────────────────────

export type SectionId = 'home' | 'about' | 'projects' | 'contact';

export interface ZoneData {
  id: SectionId;
  zoneName: string;
  desc: string;
  color: string;
}

export const ZONE_MAP: Record<SectionId, ZoneData> = {
  home:     { id: 'home',     zoneName: 'BASE__CAMP',       desc: 'Punto de spawn del jugador',  color: 'var(--color-primary)'       },
  about:    { id: 'about',    zoneName: 'CHARACTER_SHEET',  desc: 'Estadísticas del personaje',  color: 'var(--color-accent-teal)'   },
  projects: { id: 'projects', zoneName: 'QUEST__LOG',       desc: 'Misiones completadas',        color: 'var(--color-accent-amber)'  },
  contact:  { id: 'contact',  zoneName: 'COMM__HUB',        desc: 'Iniciar comunicación',        color: 'var(--color-zone-contact)'  },
};

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class NavigationService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  readonly sections: SectionId[] = ['home', 'about', 'projects', 'contact'];

  // ── Signals ───────────────────────────────────────────────────────────────
  currentSection  = signal<SectionId>('home');
  isTransitioning = signal(false);
  pendingSection  = signal<SectionId | null>(null);

  pendingZone = computed(() => {
    const id = this.pendingSection();
    return id ? ZONE_MAP[id] : null;
  });

  private isAnimating = false;
  private keyHandler: ((e: KeyboardEvent) => void) | null = null;

  // Timing (ms): bars sweep in → section swap → bars sweep out
  private readonly T_SWAP = 430;
  private readonly T_TOTAL = 900;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initKeyboard();
    }
  }

  // ── Public API ────────────────────────────────────────────────────────────

  navigateTo(id: SectionId): void {
    if (this.isAnimating || id === this.currentSection()) return;
    if (!this.sections.includes(id)) return;

    this.isAnimating = true;
    this.pendingSection.set(id);
    this.isTransitioning.set(true);

    setTimeout(() => this.currentSection.set(id), this.T_SWAP);

    setTimeout(() => {
      this.isTransitioning.set(false);
      this.pendingSection.set(null);
      this.isAnimating = false;
    }, this.T_TOTAL);
  }

  navigateNext(): void {
    const idx = this.sections.indexOf(this.currentSection());
    if (idx < this.sections.length - 1) this.navigateTo(this.sections[idx + 1]);
  }

  navigatePrev(): void {
    const idx = this.sections.indexOf(this.currentSection());
    if (idx > 0) this.navigateTo(this.sections[idx - 1]);
  }

  // ── Keyboard ──────────────────────────────────────────────────────────────

  private initKeyboard(): void {
    this.keyHandler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); this.navigateNext(); }
      if (e.key === 'ArrowUp'   || e.key === 'PageUp')   { e.preventDefault(); this.navigatePrev(); }
    };
    window.addEventListener('keydown', this.keyHandler);
  }

  ngOnDestroy(): void {
    if (this.keyHandler) window.removeEventListener('keydown', this.keyHandler);
  }
}
