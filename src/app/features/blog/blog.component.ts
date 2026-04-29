import { Component, computed, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../core/services/navigation.service';
import { BlogService } from './services/blog.service';
import { BlogPost } from './models/blog-post';
import { MarkdownViewerComponent } from './components/markdown-viewer/markdown-viewer.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideFileText, lucideArrowLeft, lucideFolder } from '@ng-icons/lucide';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, MarkdownViewerComponent, NgIconComponent],
  providers: [provideIcons({ lucideFileText, lucideArrowLeft, lucideFolder })],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {
  private nav = inject(NavigationService);
  private blogService = inject(BlogService);
  private platformId = inject(PLATFORM_ID);

  sectionVisible = computed(() => this.nav.currentSection() === 'blog');

  posts = signal<BlogPost[]>([]);
  selectedPost = signal<BlogPost | null>(null);
  currentChapterIndex = signal(0);

  isLoading = signal(true);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.blogService.getRegistry().subscribe({
        next: (data) => {
          this.posts.set(data);
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

  selectPost(post: BlogPost) {
    this.selectedPost.set(post);
    this.currentChapterIndex.set(0);
  }

  backToList() {
    this.selectedPost.set(null);
  }

  nextChapter() {
    const post = this.selectedPost();
    if (post?.isSeries && post.parts) {
      if (this.currentChapterIndex() < post.parts.length - 1) {
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
    const post = this.selectedPost();
    if (!post) return '';
    if (post.isSeries && post.parts) {
      return post.parts[this.currentChapterIndex()].file;
    }
    return post.file || '';
  }
}
