import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ChronicleLog } from '../models/chronicle-log';

@Injectable({
  providedIn: 'root'
})
export class ChroniclesService {
  private readonly http = inject(HttpClient);
  private readonly REGISTRY_URL = 'assets/chronicles/registry.json';
  private readonly LOGS_DIR = 'assets/chronicles/logs/';

  getRegistry(): Observable<ChronicleLog[]> {
    return this.http.get<ChronicleLog[]>(this.REGISTRY_URL);
  }

  getLogContent(filename: string): Observable<string> {
    return this.http.get(`${this.LOGS_DIR}${filename}`, { responseType: 'text' });
  }
}
