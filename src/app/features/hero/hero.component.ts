import {
  Component,
  signal,
  computed,
  OnInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { fromEvent, Subscription } from 'rxjs';

// ── Interfaces ──────────────────────────────────────────────────────────────

export interface MapNode {
  id: string;
  label: string;
  desc: string;
  x: number;       // % from left inside SVG viewBox
  y: number;       // % from top inside SVG viewBox
  icon: string;    // emoji / pixel icon character
  color: string;   // CSS var reference
  zoneType: 'about' | 'projects' | 'contact' | 'skills';
}

export interface Skill {
  name: string;
  level: number;   // 0–100
  color: string;
}

// ── Path helper ─────────────────────────────────────────────────────────────

/** Convert node % coordinates (out of 100) to SVG viewBox coordinates (700×500) */
const toSVG = (pct: number, total: number) => (pct / 100) * total;

/** Build a pixelated (stepped) SVG path between two points */
function pixelPath(
  x1: number, y1: number,
  x2: number, y2: number,
): string {
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} L ${mx} ${y1} L ${mx} ${y2} L ${x2} ${y2}`;
}

// ── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit, OnDestroy {

  private readonly platformId = inject(PLATFORM_ID);

  private sub!: Subscription;

  // ── State ────────────────────────────────────────────────────────────────
  mousePos  = signal({ x: 0, y: 0 });
  activeNode = signal<MapNode | null>(null);
  animatedSkills = signal(false);

  // ── Data ─────────────────────────────────────────────────────────────────
  readonly SVG_W = 700;
  readonly SVG_H = 500;

  stats = [
    { label: 'Nivel XP',   value: '3+ Años'   },
    { label: 'Misiones',   value: '12 Proy'   },
    { label: 'Clase',      value: 'Fullstack' },
  ];

  skills: Skill[] = [
    { name: 'Angular',    level: 90, color: 'var(--color-zone-contact)' },
    { name: 'Node.js',    level: 82, color: 'var(--color-accent-teal)'  },
    { name: 'TypeScript', level: 88, color: 'var(--color-primary)'      },
    { name: 'SQL / DBs',  level: 75, color: 'var(--color-accent-amber)' },
  ];

  mapNodes: MapNode[] = [
    {
      id: 'about',
      label: 'STATS',
      desc: 'Ficha de personaje',
      x: 22, y: 28,
      icon: '⚔',
      color: 'var(--color-zone-about)',
      zoneType: 'about',
    },
    {
      id: 'projects',
      label: 'QUESTS',
      desc: 'Misiones completadas',
      x: 62, y: 62,
      icon: '🏰',
      color: 'var(--color-zone-projects)',
      zoneType: 'projects',
    },
    {
      id: 'contact',
      label: 'PARTY',
      desc: 'Iniciar comunicación',
      x: 78, y: 22,
      icon: '✉',
      color: 'var(--color-zone-contact)',
      zoneType: 'contact',
    },
  ];

  // ── Computed ─────────────────────────────────────────────────────────────

  /** SVG paths connecting consecutive map nodes */
  mapPaths = computed(() => {
    const paths: { d: string; id: string }[] = [];
    for (let i = 0; i < this.mapNodes.length - 1; i++) {
      const a = this.mapNodes[i];
      const b = this.mapNodes[i + 1];
      paths.push({
        id: `${a.id}-${b.id}`,
        d: pixelPath(
          toSVG(a.x, this.SVG_W), toSVG(a.y, this.SVG_H),
          toSVG(b.x, this.SVG_W), toSVG(b.y, this.SVG_H),
        ),
      });
    }
    return paths;
  });

  /** Active node position in SVG coords for the character cursor */
  cursorPos = computed(() => {
    const node = this.activeNode();
    if (!node) return null;
    return {
      x: toSVG(node.x, this.SVG_W),
      y: toSVG(node.y, this.SVG_H),
    };
  });

  /** Active node coords string for the HUD display */
  hudCoords = computed(() => {
    const node = this.activeNode();
    return node
      ? `X:${String(Math.round(node.x)).padStart(3, '0')} Y:${String(Math.round(node.y)).padStart(3, '0')}`
      : 'X:--- Y:---';
  });

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.sub = fromEvent<MouseEvent>(window, 'mousemove').subscribe((e) =>
        this.mousePos.set({ x: e.clientX, y: e.clientY }),
      );
    }
    // Trigger skill bar animation after a short delay
    setTimeout(() => this.animatedSkills.set(true), 600);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  navigateTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  toSvgX(pct: number): number { return toSVG(pct, this.SVG_W); }
  toSvgY(pct: number): number { return toSVG(pct, this.SVG_H); }
}
