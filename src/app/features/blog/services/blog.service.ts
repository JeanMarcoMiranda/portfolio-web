import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BlogPost } from '../models/blog-post';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private readonly http = inject(HttpClient);
  private readonly REGISTRY_URL = 'assets/blog/registry.json';
  private readonly POSTS_DIR = 'assets/blog/logs/';

  getRegistry(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(this.REGISTRY_URL);
  }

  getPostContent(filename: string): Observable<string> {
    return this.http.get(`${this.POSTS_DIR}${filename}`, { responseType: 'text' });
  }
}
