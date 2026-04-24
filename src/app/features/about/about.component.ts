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
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideGlobe,
  lucideDownload,
  lucideGraduationCap,
  lucideSwords,
  lucideCastle,
  lucideMonitor,
  lucideNetwork
} from '@ng-icons/lucide';
import {
  simpleAngular,
  simpleReact,
  simpleTypescript,
  simpleJavascript,
  simpleHtml5,
  simpleCss,
  simpleSass,
  simpleFlutter,
  simpleKotlin,
  simpleAndroid,
  simpleNestjs,
  simpleNodedotjs,
  simplePostgresql,
  simpleGraphql,
  simpleDocker,
  simpleGit,
  simpleGithubactions,
  simpleFigma,
  simpleLinux
} from '@ng-icons/simple-icons';

// ── Interfaces ───────────────────────────────────────────────────────────────

export interface TechItem {
  name: string;
  icon: string;
}

export interface TechCategory {
  id: string;
  label: string;
  color: string;   // CSS variable reference
  glow: string;    // rgba value for hover glow
  techs: TechItem[];
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
  imports: [CommonModule, NgIconComponent],
  viewProviders: [
    provideIcons({
      lucideGlobe,
      lucideDownload,
      lucideGraduationCap,
      lucideSwords,
      lucideCastle,
      lucideMonitor,
      lucideNetwork,
      simpleAngular,
      simpleReact,
      simpleTypescript,
      simpleJavascript,
      simpleHtml5,
      simpleCss,
      simpleSass,
      simpleFlutter,
      simpleKotlin,
      simpleAndroid,
      simpleNestjs,
      simpleNodedotjs,
      simplePostgresql,
      simpleGraphql,
      simpleDocker,
      simpleGit,
      simpleGithubactions,
      simpleFigma,
      simpleLinux
    })
  ],
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
      techs: [
        { name: 'Angular', icon: 'simpleAngular' },
        { name: 'React', icon: 'simpleReact' },
        { name: 'TypeScript', icon: 'simpleTypescript' },
        { name: 'JavaScript', icon: 'simpleJavascript' },
        { name: 'HTML5', icon: 'simpleHtml5' },
        { name: 'CSS3', icon: 'simpleCss' },
        { name: 'SCSS', icon: 'simpleSass' }
      ],
    },
    {
      id:    'mobile',
      label: 'MOBILE_DEV',
      color: 'var(--color-accent-teal)',
      glow:  'rgba(46, 207, 168, 0.15)',
      techs: [
        { name: 'Flutter', icon: 'simpleFlutter' },
        { name: 'React Native', icon: 'simpleReact' },
        { name: 'Kotlin', icon: 'simpleKotlin' },
        { name: 'Android SDK', icon: 'simpleAndroid' }
      ],
    },
    {
      id:    'backend',
      label: 'BACKEND_&_DB',
      color: 'var(--color-accent-amber)',
      glow:  'rgba(240, 165, 0, 0.15)',
      techs: [
        { name: 'NestJS', icon: 'simpleNestjs' },
        { name: 'Node.js', icon: 'simpleNodedotjs' },
        { name: 'PostgreSQL', icon: 'simplePostgresql' },
        { name: 'REST APIs', icon: 'lucideNetwork' },
        { name: 'GraphQL', icon: 'simpleGraphql' }
      ],
    },
    {
      id:    'tools',
      label: 'TOOLS_&_OPS',
      color: 'var(--color-zone-contact)',
      glow:  'rgba(224, 92, 122, 0.15)',
      techs: [
        { name: 'Docker', icon: 'simpleDocker' },
        { name: 'Git', icon: 'simpleGit' },
        { name: 'GitHub Actions', icon: 'simpleGithubactions' },
        { name: 'Figma', icon: 'simpleFigma' },
        { name: 'Linux', icon: 'simpleLinux' }
      ],
    },
  ];

  // ── Education ──────────────────────────────────────────────────────────────

  readonly education: EducationEntry[] = [
    {
      institution: 'TECSUP',
      degree:      'Tecnología en Desarrollo de Software',
      period:      '2020 — 2023',
      icon:        'lucideGraduationCap',
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
    { label: 'AÑOS_EXP',   value: '3+',  icon: 'lucideSwords' },
    { label: 'PROYECTOS',  value: '12+', icon: 'lucideCastle' },
    { label: 'PLATAFORM',  value: '3',   icon: 'lucideMonitor' },
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
