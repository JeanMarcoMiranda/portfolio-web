import {
  Injectable,
  OnDestroy,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// ── Types ────────────────────────────────────────────────────────────────────

export type SectionId = 'home' | 'about' | 'projects' | 'contact';

const SECTIONS: SectionId[] = ['home', 'about', 'projects', 'contact'];

// ── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class ScrollService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  // ── Public signals ─────────────────────────────────────────────────────────

  /** ID de la sección actualmente visible en el viewport */
  activeSection = signal<SectionId>('home');

  /** Progreso de scroll total de la página (0–100) */
  scrollProgress = signal(0);

  // ── Private ────────────────────────────────────────────────────────────────

  private observer: IntersectionObserver | null = null;
  private scrollHandler: (() => void) | null = null;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Small delay to ensure sections are rendered before observing
      setTimeout(() => {
        this.initIntersectionObserver();
        this.initScrollProgress();
      }, 100);
    }
  }

  // ── Initialization ─────────────────────────────────────────────────────────

  private initIntersectionObserver(): void {
    // Track the ratio of each section currently visible
    const ratioMap = new Map<SectionId, number>(
      SECTIONS.map((id) => [id, 0]),
    );

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id as SectionId;
          if (SECTIONS.includes(id)) {
            ratioMap.set(id, entry.intersectionRatio);
          }
        });

        // The active section is the one with the highest visible ratio
        let best: SectionId = 'home';
        let bestRatio = -1;
        ratioMap.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        });

        this.activeSection.set(best);
      },
      {
        // Observe with multiple thresholds for better accuracy
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
        rootMargin: '-10% 0px -10% 0px',
      },
    );

    // Observe only the sections that exist in the DOM
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) this.observer!.observe(el);
    });
  }

  private initScrollProgress(): void {
    this.scrollHandler = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      this.scrollProgress.set(Math.min(100, Math.round(progress)));
    };

    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    // Initialize on load
    this.scrollHandler();
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /** Hace smooth scroll hacia la sección con el `id` dado */
  scrollTo(id: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }
}
