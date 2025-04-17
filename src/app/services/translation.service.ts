import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const translations = {
  en: {
    // Navigation
    welcome_back: 'Welcome Back!',
    welcome_subtitle: 'Here\'s what\'s happening with your students today.',
    notifications: 'Notifications',
    clear_all: 'Clear all',
    settings: 'Settings',
    profile: 'Profile',
    logout: 'Logout',

    // Dashboard
    dashboard: 'Dashboard',
    students_distribution: 'Students Distribution',
    analytics: 'Analytics',
    total_students: 'Total Students',
    departments: 'Departments',
    active: 'Active',
    growth: 'Growth',

    // Table Headers
    student: 'Student',
    department: 'Department',
    factory: 'Factory',
    group: 'Group',
    stage: 'Stage',
    date: 'Date',
    actions: 'Actions',

    // Filters and Sorting
    filters: 'Filters',
    sort: 'Sort',
    sort_by: 'Sort by',
    all: 'All',

    // Actions
    export: 'Export',
    add_student: 'Add Student',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',

    // Statistics
    department_distribution: 'Department Distribution',

    // Pagination
    showing: 'Showing',
    to: 'to',
    of: 'of',
    entries: 'entries',
    per_page_5: '5 per page',
    per_page_10: '10 per page',
    per_page_20: '20 per page',

    // New translation key
    back_to_home: 'Back to Home',
    batch: 'Batch',
    month: 'Month',
    year: 'Year',
    day: 'Day',
  },
  ar: {
    // Navigation
    welcome_back: 'مرحباً بعودتك!',
    welcome_subtitle: 'إليك ما يحدث مع طلابك اليوم.',
    notifications: 'الإشعارات',
    clear_all: 'مسح الكل',
    settings: 'الإعدادات',
    profile: 'الملف الشخصي',
    logout: 'تسجيل الخروج',

    // Dashboard
    dashboard: 'لوحة التحكم',
    students_distribution: 'توزيع الطلاب',
    analytics: 'التحليلات',
    total_students: 'إجمالي الطلاب',
    departments: 'الأقسام',
    active: 'نشط',
    growth: 'النمو',

    // Table Headers
    student: 'الطالب',
    department: 'القسم',
    factory: 'المصنع',
    group: 'المجموعة',
    stage: 'المرحلة',
    date: 'التاريخ',
    actions: 'الإجراءات',

    // Filters and Sorting
    filters: 'التصفية',
    sort: 'ترتيب',
    sort_by: 'ترتيب حسب',
    all: 'الكل',

    // Actions
    export: 'تصدير',
    add_student: 'إضافة طالب',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ',
    cancel: 'إلغاء',

    // Statistics
    department_distribution: 'توزيع الأقسام',

    // Pagination
    showing: 'عرض',
    to: 'إلى',
    of: 'من',
    entries: 'سجل',
    per_page_5: '5 لكل صفحة',
    per_page_10: '10 لكل صفحة',
    per_page_20: '20 لكل صفحة',

    // New translation key
    back_to_home: 'العودة للرئيسية',
    batch: 'دفعة',
    month: 'شهر',
    year: 'سنة',
    day: 'يوم',
  }
} as const;

type TranslationKeys = keyof typeof translations.en | 'year';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang = new BehaviorSubject<'en' | 'ar'>('en');
  currentLang$ = this.currentLang.asObservable();

  constructor() {}

  setLanguage(lang: 'en' | 'ar') {
    this.currentLang.next(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  translate(key: TranslationKeys): string {
    const currentLang = this.currentLang.value;
    return translations[currentLang][key as keyof typeof translations.en];
  }
}
