import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-language-switcher',
  template: `
    <div class="lang-switcher">
      <button 
        class="lang-btn" 
        [class.active]="(translationService.currentLang$ | async) === 'en'"
        (click)="switchLanguage('en')">
        EN
      </button>
      <button 
        class="lang-btn" 
        [class.active]="(translationService.currentLang$ | async) === 'ar'"
        (click)="switchLanguage('ar')">
        ع
      </button>
    </div>
  `,
  styles: [`
    .lang-switcher {
      display: flex;
      gap: 0.5rem;
      padding: 0.25rem;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    
    .lang-btn {
      padding: 0.5rem 0.75rem;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }
    
    .lang-btn:hover {
      background: #f1f5f9;
      color: #3b82f6;
    }
    
    .lang-btn.active {
      background: #3b82f6;
      color: white;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class LanguageSwitcherComponent {
  constructor(public translationService: TranslationService) {}

  switchLanguage(lang: 'en' | 'ar') {
    this.translationService.setLanguage(lang);
  }
}
