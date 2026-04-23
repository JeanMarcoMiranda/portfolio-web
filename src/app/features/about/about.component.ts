import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  // Stats organizados por categorías según tu paleta semántica
  frontendSkills = [
    { name: 'Angular', level: 90, color: 'var(--color-primary)' },
    { name: 'React', level: 85, color: 'var(--color-primary)' },
    { name: 'TypeScript', level: 88, color: 'var(--color-primary)' },
  ];

  mobileSkills = [
    { name: 'React Native', level: 85, color: 'var(--color-accent-teal)' },
    { name: 'Flutter', level: 80, color: 'var(--color-accent-teal)' },
    { name: 'Android SDK', level: 75, color: 'var(--color-accent-teal)' },
  ];

  backendSkills = [
    { name: 'NestJS', level: 82, color: 'var(--color-accent-amber)' },
    { name: 'Node.js', level: 85, color: 'var(--color-accent-amber)' },
    { name: 'PostgreSQL', level: 78, color: 'var(--color-accent-amber)' },
  ];
}
