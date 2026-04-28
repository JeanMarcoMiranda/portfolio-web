import { Component, Input, OnChanges, SimpleChanges, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { ChroniclesService } from '../../services/chronicles.service';

@Component({
  selector: 'app-markdown-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="markdown-container">
      @if (isLoading()) {
        <div class="loading-state">
          <span class="pixel-text">CARGANDO_DATOS...</span>
        </div>
      } @else if (error()) {
        <div class="error-state">
          <span class="pixel-text">ERROR: DATA_CORRUPTED</span>
        </div>
      } @else {
        <div class="markdown-body" [innerHTML]="safeHtml()"></div>
      }
    </div>
  `,
  styleUrl: './markdown-viewer.component.scss'
})
export class MarkdownViewerComponent implements OnChanges {
  @Input({ required: true }) file!: string;

  private readonly chroniclesService = inject(ChroniclesService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly platformId = inject(PLATFORM_ID);

  safeHtml = signal<SafeHtml>('');
  isLoading = signal(false);
  error = signal(false);

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['file'] && this.file) {
      if (isPlatformBrowser(this.platformId)) {
        this.loadMarkdown(this.file);
      }
    }
  }

  private loadMarkdown(filename: string) {
    this.isLoading.set(true);
    this.error.set(false);

    this.chroniclesService.getLogContent(filename).subscribe({
      next: async (content) => {
        try {
          const parsed = await marked.parse(content);
          const cleanHtml = DOMPurify.sanitize(parsed);
          this.safeHtml.set(this.sanitizer.bypassSecurityTrustHtml(cleanHtml));
        } catch (e) {
          this.error.set(true);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.isLoading.set(false);
      }
    });
  }
}
