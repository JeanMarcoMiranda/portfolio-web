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
import { NavigationService, SectionId } from '../../core/services/navigation.service';

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

  private readonly platformId    = inject(PLATFORM_ID);
  private readonly nav           = inject(NavigationService);

  private sub!: Subscription;

  // ── State ────────────────────────────────────────────────────────────────
  mousePos      = signal({ x: 0, y: 0 });
  activeNode    = signal<MapNode | null>(null);
  animatedSkills = signal(false);
  typewriterText = signal('');

  // ── Data ─────────────────────────────────────────────────────────────────
  readonly SVG_W = 700;
  readonly SVG_H = 500;

  stats = [
    { label: 'LVL_XP',  value: '3+'       },
    { label: 'QUESTS',  value: '12+'      },
    { label: 'CLASS',   value: 'FULL·STK' },
  ];

  skills: Skill[] = [
    { name: 'Angular',    level: 90, color: 'var(--color-primary)'       },
    { name: 'TypeScript', level: 88, color: 'var(--color-primary)'       },
    { name: 'Node.js',    level: 82, color: 'var(--color-accent-teal)'   },
    { name: 'Flutter',    level: 78, color: 'var(--color-accent-amber)'  },
  ];

  // ── Typewriter ────────────────────────────────────────────────────────────
  private readonly roles = [
    'Fullstack_Developer',
    'Technical_Instructor',
    'Angular_Specialist',
    'Systems_Architect',
  ];
  private twRoleIdx  = 0;
  private twCharIdx  = 0;
  private twDeleting = false;
  private twTimer: ReturnType<typeof setTimeout> | null = null;

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
      setTimeout(() => this.tickTypewriter(), 800);
    }
    setTimeout(() => this.animatedSkills.set(true), 600);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    if (this.twTimer) clearTimeout(this.twTimer);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  navigateTo(id: string): void {
    this.nav.navigateTo(id as SectionId);
  }

  /** Returns array of 5 booleans for star rating (level 0–100 → 0–5 stars) */
  getStars(level: number): boolean[] {
    const filled = Math.round(level / 20);
    return Array(5).fill(false).map((_, i) => i < filled);
  }

  /** Typewriter loop — cycles through role strings */
  private tickTypewriter(): void {
    const role = this.roles[this.twRoleIdx];
    if (!this.twDeleting) {
      this.typewriterText.set(role.slice(0, ++this.twCharIdx));
      if (this.twCharIdx >= role.length) {
        this.twDeleting = true;
        this.twTimer = setTimeout(() => this.tickTypewriter(), 2200);
        return;
      }
    } else {
      this.typewriterText.set(role.slice(0, --this.twCharIdx));
      if (this.twCharIdx === 0) {
        this.twDeleting = false;
        this.twRoleIdx  = (this.twRoleIdx + 1) % this.roles.length;
      }
    }
    this.twTimer = setTimeout(() => this.tickTypewriter(), this.twDeleting ? 40 : 70);
  }

  toSvgX(pct: number): number { return toSVG(pct, this.SVG_W); }
  toSvgY(pct: number): number { return toSVG(pct, this.SVG_H); }
}
