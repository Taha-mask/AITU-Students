import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSwitcherComponent]
})
export class NavbarComponent {
  showNotifications = false;
  showUserMenu = false;
  notificationCount = 3;
  hasNotifications = true;

  constructor(public translationService: TranslationService) {}

  admin = [{
    name: 'John Doe',
    types: ['Administrator']
  }];

  notifications = [
    {
      icon: 'bi-person-plus',
      message: 'New student registered',
      time: '5 min ago'
    },
    {
      icon: 'bi-building',
      message: 'Factory capacity updated',
      time: '1 hour ago'
    }
  ];

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showUserMenu) this.showUserMenu = false;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    if (this.showNotifications) this.showNotifications = false;
  }

  clearAllNotifications() {
    this.notifications = [];
    this.notificationCount = 0;
    this.hasNotifications = false;
    this.showNotifications = false;
  }

  logout() {
    // Implement logout logic
  }
}
