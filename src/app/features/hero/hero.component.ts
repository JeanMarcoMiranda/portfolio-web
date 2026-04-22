import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  stats = [
    { label: 'AÑOS EXP', value: '3+' },
    { label: 'PROYECTOS', value: '10+' },
    { label: 'TECNOLOGÍAS', value: '8+' },
    { label: 'REMOTO', value: '100%' },
  ];
}
