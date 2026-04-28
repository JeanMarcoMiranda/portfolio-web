import { Component, computed, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../core/services/navigation.service';
import { ChroniclesService } from './services/chronicles.service';
import { ChronicleLog } from './models/chronicle-log';
import { MarkdownViewerComponent } from './components/markdown-viewer/markdown-viewer.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideFileText, lucideArrowLeft, lucideFolder } from '@ng-icons/lucide';

@Component({
  selector: 'app-chronicles',
  standalone: true,
  imports: [CommonModule, MarkdownViewerComponent, NgIconComponent],
  providers: [provideIcons({ lucideFileText, lucideArrowLeft, lucideFolder })],
  templateUrl: './chronicles.component.html',
  styleUrl: './chronicles.component.scss'
})
export class ChroniclesComponent implements OnInit {
  private nav = inject(NavigationService);
  private chroniclesService = inject(ChroniclesService);
  private platformId = inject(PLATFORM_ID);

  sectionVisible = computed(() => this.nav.currentSection() === 'chronicles');

  logs = signal<ChronicleLog[]>([]);
  selectedLog = signal<ChronicleLog | null>(null);
  currentChapterIndex = signal(0);

  isLoading = signal(true);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.chroniclesService.getRegistry().subscribe({
        next: (data) => {
          this.logs.set(data);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          // Handle error if needed
        }
      });
    } else {
      this.isLoading.set(false);
    }
  }

  selectLog(log: ChronicleLog) {
    this.selectedLog.set(log);
    this.currentChapterIndex.set(0);
  }

  backToList() {
    this.selectedLog.set(null);
  }

  nextChapter() {
    const log = this.selectedLog();
    if (log?.isSeries && log.parts) {
      if (this.currentChapterIndex() < log.parts.length - 1) {
        this.currentChapterIndex.update(i => i + 1);
      }
    }
  }

  prevChapter() {
    if (this.currentChapterIndex() > 0) {
      this.currentChapterIndex.update(i => i - 1);
    }
  }

  getCurrentFile(): string {
    const log = this.selectedLog();
    if (!log) return '';
    if (log.isSeries && log.parts) {
      return log.parts[this.currentChapterIndex()].file;
    }
    return log.file || '';
  }
}
