import {
  Component,
  signal,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideMail, lucideMapPin, lucideSend, lucideGithub, lucideLinkedin, lucideTwitter } from '@ng-icons/lucide';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
  viewProviders: [
    provideIcons({
      lucideMail,
      lucideMapPin,
      lucideSend,
      lucideGithub,
      lucideLinkedin,
      lucideTwitter
    })
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elRef      = inject(ElementRef);
  private readonly fb         = inject(FormBuilder);
  
  private observer: IntersectionObserver | null = null;

  // ── Signals ───────────────────────────────────────────────────────────────

  sectionVisible = signal(false);
  isSubmitting   = signal(false);
  submitSuccess  = signal(false);

  // ── Form ──────────────────────────────────────────────────────────────────

  contactForm: FormGroup = this.fb.group({
    name:    ['', [Validators.required, Validators.minLength(2)]],
    email:   ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.sectionVisible.set(true);
          this.observer?.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    this.observer.observe(this.elRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  // ── Methods ───────────────────────────────────────────────────────────────

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    // Simulate API Call
    setTimeout(() => {
      console.log('Missive sent:', this.contactForm.value);
      this.isSubmitting.set(false);
      this.submitSuccess.set(true);
      this.contactForm.reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => this.submitSuccess.set(false), 5000);
    }, 1500);
  }
}
