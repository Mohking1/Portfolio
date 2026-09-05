import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  lastScrollTop = 0;
  isHeaderHidden = false;

  constructor(@Inject(PLATFORM_ID) private platformId: object) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      import('aos').then(AOS => AOS.default.init({
        duration: 1000,
        once: true,
        mirror: false
      }));
      window.scrollTo(0, 0);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.isMenuOpen) return;
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll <= 60) {
      this.isHeaderHidden = false;
    } else if (currentScroll > this.lastScrollTop && currentScroll - this.lastScrollTop > 8) {
      this.isHeaderHidden = true;
    } else if (currentScroll < this.lastScrollTop && this.lastScrollTop - currentScroll > 8) {
      this.isHeaderHidden = false;
    }
    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    document.body.classList.toggle('no-scroll', this.isMenuOpen);
  }
}
