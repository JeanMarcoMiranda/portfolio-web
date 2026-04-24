import {
  Component,
  signal,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

// ── Interfaces ───────────────────────────────────────────────────────────────

export interface TechCategory {
  id: string;
  label: string;
  color: string;   // CSS variable reference
  glow: string;    // rgba value for hover glow
  techs: string[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  period: string;
  icon: string;
}

export interface XpStat {
  label: string;
  value: string;
  icon: string;
}

// ── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements AfterViewInit, OnDestroy {

  private readonly platformId = inject(PLATFORM_ID);
  private readonly elRef      = inject(ElementRef);
  private observer: IntersectionObserver | null = null;

  /** Triggers stagger animations when the section enters the viewport */
  sectionVisible = signal(false);

  // ── Tech Inventory ─────────────────────────────────────────────────────────

  readonly techCategories: TechCategory[] = [
    {
      id:    'frontend',
      label: 'FRONTEND_WEB',
      color: 'var(--color-primary)',
      glow:  'rgba(124, 106, 247, 0.15)',
      techs: ['Angular', 'React', 'TypeScript', 'JavaScript', 'HTML / CSS', 'SCSS'],
    },
    {
      id:    'mobile',
      label: 'MOBILE_DEV',
      color: 'var(--color-accent-teal)',
      glow:  'rgba(46, 207, 168, 0.15)',
      techs: ['Flutter', 'React Native', 'Kotlin', 'Android SDK'],
    },
    {
      id:    'backend',
      label: 'BACKEND_&_DB',
      color: 'var(--color-accent-amber)',
      glow:  'rgba(240, 165, 0, 0.15)',
      techs: ['NestJS', 'Node.js', 'PostgreSQL', 'REST APIs', 'GraphQL'],
    },
    {
      id:    'tools',
      label: 'TOOLS_&_OPS',
      color: 'var(--color-zone-contact)',
      glow:  'rgba(224, 92, 122, 0.15)',
      techs: ['Docker', 'Git', 'GitHub Actions', 'Figma', 'Linux'],
    },
  ];

  // ── Education ──────────────────────────────────────────────────────────────

  readonly education: EducationEntry[] = [
    {
      institution: 'TECSUP',
      degree:      'Tecnología en Desarrollo de Software',
      period:      '2020 — 2023',
      icon:        '🎓',
    },
  ];

  // ── Character Traits (soft skills) ────────────────────────────────────────

  readonly traits: string[] = [
    'Clean Architecture',
    'Remote Work',
    'Agile / Scrum',
    'Code Review',
    'Problem Solver',
    'Self-Learner',
  ];

  // ── XP Stats ──────────────────────────────────────────────────────────────

  readonly xpStats: XpStat[] = [
    { label: 'AÑOS_EXP',   value: '3+',  icon: '⚔' },
    { label: 'PROYECTOS',  value: '12+', icon: '🏰' },
    { label: 'PLATAFORM',  value: '3',   icon: '🖥' },
  ];

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.sectionVisible.set(true);
          this.observer?.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    this.observer.observe(this.elRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
