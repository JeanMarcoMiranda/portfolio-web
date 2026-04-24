import {
  Component,
  signal,
  computed,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideExternalLink, lucideGithub } from '@ng-icons/lucide';
import {
  simpleAngular,
  simpleReact,
  simpleTypescript,
  simpleFlutter,
  simpleNestjs,
  simpleNodedotjs,
  simpleDotnet,
  simpleDjango,
} from '@ng-icons/simple-icons';

// ── Interfaces ───────────────────────────────────────────────────────────────

export type ProjectFilter = 'ALL' | 'WEB' | 'MOBILE' | 'FULLSTACK';

export interface TechBadge {
  name: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  type: ProjectFilter;
  difficulty: number; // 1 to 5
  description: string;
  image: string;
  techs: TechBadge[];
  demoUrl?: string;
  repoUrl?: string;
}

// ── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  viewProviders: [
    provideIcons({
      lucideExternalLink,
      lucideGithub,
      simpleAngular,
      simpleReact,
      simpleTypescript,
      simpleFlutter,
      simpleNestjs,
      simpleNodedotjs,
      simpleDotnet,
      simpleDjango,
    }),
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elRef = inject(ElementRef);
  private observer: IntersectionObserver | null = null;

  // ── Signals ───────────────────────────────────────────────────────────────

  sectionVisible = signal(false);
  activeFilter = signal<ProjectFilter>('ALL');

  // ── Data ──────────────────────────────────────────────────────────────────

  readonly filters: { id: ProjectFilter; label: string }[] = [
    { id: 'ALL', label: 'ALL_QUESTS' },
    { id: 'WEB', label: 'WEB_APPS' },
    { id: 'MOBILE', label: 'MOBILE' },
    { id: 'FULLSTACK', label: 'FULLSTACK' },
  ];

  readonly allProjects: Project[] = [
    {
      id: 'toyota-monolith',
      title: 'Toyota Virtual Monolith',
      type: 'WEB',
      difficulty: 4,
      description:
        'Herramienta interactiva para comparar el consumo de combustible de vehículos actuales con modelos híbridos de forma visual y dinámica.',
      image: 'assets/img/projects/toyota.jpg', // Placeholder
      techs: [
        { name: 'React', icon: 'simpleReact' },
        { name: 'TypeScript', icon: 'simpleTypescript' },
      ],
      demoUrl: 'https://mitsui-tau.vercel.app/',
    },
    {
      id: 'taxi-dashboard',
      title: 'Taxi Fleet Monitoring Dashboard',
      type: 'FULLSTACK',
      difficulty: 4,
      description:
        'Sistema web en tiempo real para monitorear flota, gestionar servicios y analizar métricas operativas desde un panel administrativo central.',
      image: 'assets/img/projects/taxi-web.jpg',
      techs: [
        { name: 'React', icon: 'simpleReact' },
        { name: 'Node.js', icon: 'simpleNodedotjs' },
      ],
      repoUrl: 'https://github.com/JeanMarcoMiranda/taxi_web',
    },
    {
      id: 'sga-tanta',
      title: 'SGA - Tanta Ordering Platform',
      type: 'FULLSTACK',
      difficulty: 5,
      description:
        'Modernización del sistema de pedidos con roles dinámicos, carrito de compras y procesamiento de pagos seguros para alto volumen de transacciones.',
      image: 'assets/img/projects/tanta.jpg',
      techs: [
        { name: 'Angular', icon: 'simpleAngular' },
        { name: 'NestJS', icon: 'simpleNestjs' },
      ],
    },
    {
      id: 'chinalco-academic',
      title: 'Chinalco Academic Management System',
      type: 'FULLSTACK',
      difficulty: 5,
      description:
        'Módulos web integrados para digitalizar y mejorar la eficiencia operativa de los procesos académicos del sistema educativo de Chinalco.',
      image: 'assets/img/projects/chinalco.jpg',
      techs: [
        { name: 'React', icon: 'simpleReact' },
        { name: '.NET', icon: 'simpleDotnet' },
      ],
    },
    {
      id: 'tiacher-ai',
      title: 'Tiacher - AI English Learning',
      type: 'MOBILE',
      difficulty: 4,
      description:
        'Aplicación interactiva y personalizada para practicar inglés usando contenido visual del entorno cotidiano con feedback de IA.',
      image: 'assets/img/projects/tiacher.jpg',
      techs: [
        { name: 'Flutter', icon: 'simpleFlutter' },
        { name: 'Django', icon: 'simpleDjango' },
      ],
      demoUrl: 'https://play.google.com/store/apps/details?id=com.brittany.tiacher&hl=en',
    },
    {
      id: 'taxi-tracking',
      title: 'Taxi Fleet Tracking System',
      type: 'MOBILE',
      difficulty: 5,
      description:
        'App para rastrear flota en tiempo real con geolocalización precisa y comunicación instantánea entre conductores y central.',
      image: 'assets/img/projects/taxi-app.jpg',
      techs: [
        { name: 'Flutter', icon: 'simpleFlutter' },
        { name: 'Node.js', icon: 'simpleNodedotjs' },
      ],
    },
    {
      id: 'contigo-pecuario',
      title: 'Contigo Pecuario - Livestock',
      type: 'MOBILE',
      difficulty: 3,
      description:
        'App para digitalizar el control ganadero con trazabilidad genética, análisis de producción y proyecciones basadas en datos.',
      image: 'assets/img/projects/pecuario.jpg',
      techs: [
        { name: 'Flutter', icon: 'simpleFlutter' },
        { name: 'NestJS', icon: 'simpleNestjs' },
      ],
      demoUrl: 'https://play.google.com/store/apps/details?id=com.contigopecuario.app',
    },
  ];

  // ── Computed ──────────────────────────────────────────────────────────────

  filteredProjects = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'ALL') return this.allProjects;
    return this.allProjects.filter((p) => p.type === filter);
  });

  // ── Helpers ───────────────────────────────────────────────────────────────

  setFilter(filter: ProjectFilter): void {
    this.activeFilter.set(filter);
  }

  getStars(difficulty: number): number[] {
    return Array(5)
      .fill(0)
      .map((_, i) => (i < difficulty ? 1 : 0));
  }

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
