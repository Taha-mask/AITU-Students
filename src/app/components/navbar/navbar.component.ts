import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { Notification } from '../../interfaces/notification';

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
    image: 'images/user-1.png',
    name: 'Ahmed Saad',
    types: ['Admin', 'Administrative', 'Technical']
  }];

  notifications: Notification[] = [
    {
      icon: 'bi-building-add',
      message: 'New factory added by student',
      time: '1 min ago',
      type: 'factory_request',
      id: 1,
      studentName: 'Mohammed Ahmed',
      factoryName: 'Hope Factory'
    },
    {
      icon: 'bi-person-plus',
      message: 'New student registered',
      time: '5 min ago',
      type: 'registration'
    },
    {
      icon: 'bi-building',
      message: 'Factory capacity updated',
      time: '1 hour ago',
      type: 'factory_update'
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

  handleFactoryRequest(notificationId: number, action: 'accept' | 'deny') {
    // Here you would typically make an API call to update the factory request status
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.notificationCount = this.notifications.length;
    if (this.notificationCount === 0) {
      this.hasNotifications = false;
    }
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
