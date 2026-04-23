import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-page-transition',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-transition.component.html',
  styleUrl:    './page-transition.component.scss',
})
export class PageTransitionComponent {
  nav  = inject(NavigationService);
  bars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
}
