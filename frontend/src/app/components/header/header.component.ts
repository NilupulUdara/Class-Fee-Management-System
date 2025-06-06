import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  openDropdown: string | null = null;
  selectedMenu: string | null = null;
  showLogoutModal = false;
  showSuccess = false;

  constructor(private router: Router) { }

  toggleDropdown(menu: string): void {
    const isSame = this.openDropdown === menu;
    this.openDropdown = isSame ? null : menu;
    this.selectedMenu = isSame ? null : menu;
  }

  closeDropdown(): void {
    this.openDropdown = null;
  }

  handleLogout(): void {
    this.showLogoutModal = true;
  }

  confirmLogout(): void {
    this.showLogoutModal = false;
    this.showSuccess = true;
    setTimeout(() => {
      this.showSuccess = false;
      localStorage.removeItem('accessToken');
      this.router.navigate(['/']);
    }, 0);
  }

  menuStyle(menu: string): string {
    return `font-medium text-base cursor-pointer flex items-center transition ${this.selectedMenu === menu ? 'text-gray-300' : 'text-white hover:text-gray-400'
      }`;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const clickedInside = (event.target as HTMLElement).closest('nav');
    if (!clickedInside) {
      this.closeDropdown();
    }
  }
}
