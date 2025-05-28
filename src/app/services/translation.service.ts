import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const translations: Record<'en' | 'ar', Record<string, string>> = {
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
    supervisor_distribution: 'Supervisor Distribution',
    analytics: 'Analytics',
    total_students: 'Total Students',
    departments: 'Departments',
    supervisors: 'Supervisors',
    active: 'Active',
    growth: 'Growth',

    // Table Headers
    student: 'Student',
    department: 'Department',
    factory: 'Factory',
    group: 'Group',
    stage: 'Stage',
    date: 'Date',
    supervisor: 'Supervisor',
    actions: 'Actions',

    // Filters and Sorting
    filters: 'Filters',
    sort: 'Sort',
    sort_by: 'Sort by',
    all: 'All',
    all_departments: 'All Departments',
    all_stages: 'All Stages',
    all_batches: 'All Batches',
    all_factories: 'All Factories',
    all_supervisors: 'All Supervisors',

    // Actions
    export: 'Export',
    add_student: 'Add Student',
    add_factory: 'Add Factory',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    accept: 'Accept',
    deny: 'Deny',

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

    // Factory and Student related
    back_to_home: 'Back to Home',
    batch: 'Batch',
    month: 'Month',
    year: 'Year',
    day: 'Day',
    reset: 'Reset',
    factory_name: 'Factory Name',
    address: 'Address',
    phone: 'Phone Number',
    email: 'Email',
    role: 'Role',
    lastUpdated: 'Last Updated',
    contact_name: 'Contact Name',
    industry: 'Industry',
    capacity: 'Capacity',
    type: 'Type',
    select_all: 'Select All',
    students_selected: 'students selected',
    drag_students_here: 'Drag students here',
    factory_is_full: 'Factory is full',
    search_students: 'Search students...',
    search_factories: 'Search factories...',
    add_new_factory: 'Add New Factory',
    enter_factory_name: 'Enter factory name',
    enter_address: 'Enter address',
    enter_phone: 'Enter phone number',
    enter_contact_name: 'Enter contact person name',
    select_industry: 'Select industry',
    enter_capacity: 'Enter capacity',
    select_type: 'Select type',
    factory_details: 'Factory Details',
    name: 'Name',
    assigned_students: 'Assigned Students',
    students: 'Students',
    factories: 'Factories',
    
    // Notifications
    new_factory_added: 'New factory added by student',
    new_student_registered: 'New student registered',
    factory_capacity_updated: 'Factory capacity updated',
    view_details: 'View Details',
    
    // Validation messages
    required_field: 'This field is required',
    invalid_phone: 'Invalid phone number format',
    invalid_capacity: 'Capacity must be a positive number',

    // Department names
    Electrical: 'Electrical',
    Mechanics: 'Mechanics',
    'Information Technology': 'Information Technology',
    'Electrical Technology': 'Electrical Technology',
    'كهرباء': 'Electrical',
    'ميكانيكا': 'Mechanics',
    'تكنولوجيا المعلومات': 'Information Technology',
    'تكنولوجيا كهربائية': 'Electrical Technology',

    // Stage names
    School: 'School',
    Institute: 'Institute',
    Faculty: 'Faculty',
    'مدرسة': 'School',
    'معهد': 'Institute',
    'كلية': 'Faculty',
    'كلية عليا': 'Upper College',
    'كلية متوسطة': 'Middle College',

    // Batch names
    'Batch 1': 'Batch 1',
    'Batch 2': 'Batch 2',
    'Batch 3': 'Batch 3',
    'Batch 4': 'Batch 4',
    '1': 'Batch 1',
    '2': 'Batch 2',
    '3': 'Batch 3',
    '4': 'Batch 4',
    'دفعة 1': 'Batch 1',
    'دفعة 2': 'Batch 2',
    'دفعة 3': 'Batch 3',
    'دفعة 4': 'Batch 4',

    // Factory types
    Internal: 'Internal',
    External: 'External',
    'داخلي': 'Internal',
    'خارجي': 'External',

    // Comparison
    vs: 'vs',

    // Month names
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',

    // Sort options
    name_asc: 'Name (A-Z)',
    name_desc: 'Name (Z-A)',
    date_new: 'Newest First',
    date_old: 'Oldest First',

    // Student Distribution Component
    no_students_assigned: 'No students assigned',
    save_changes: 'Save Changes',

    // Analytics Component
    monthly_trends: 'Monthly Trends',
    capacity_utilization: 'Capacity Utilization',
    student_distribution: 'Student Distribution',
    department_breakdown: 'Department Breakdown',
    supervisor_workload: 'Supervisor Workload',
    factory_performance: 'Factory Performance',
    student_growth: 'Student Growth',
    capacity_vs_assigned: 'Capacity vs Assigned Students',

    // Login Component
    login: 'Login',
    username: 'Username',
    password: 'Password',
    remember_me: 'Remember Me',
    forgot_password: 'Forgot Password?',
    sign_in: 'Sign In',
    invalid_credentials: 'Invalid username or password',
    enter_email: 'Enter your email',
    enter_password: 'Enter your password',
    email_required: 'Email is required',
    invalid_email: 'Please enter a valid email',
    password_required: 'Password is required',
    password_min_length: 'Password must be at least 6 characters',
    logging_in: 'Logging in...',
    no_account: 'Don\'t have an account?',

    // Sign Up Component
    sign_up: 'Sign Up',
    confirm_password: 'Confirm Password',
    create_account: 'Create Account',
    already_have_account: 'Already have an account?',
    passwords_dont_match: 'Passwords do not match',
    email_in_use: 'Email is already in use',
    weak_password: 'Password is too weak',
    first_name: 'First Name',
    last_name: 'Last Name',
    enter_first_name: 'Enter your first name',
    enter_last_name: 'Enter your last name',
    enter_confirm_password: 'Confirm your password',
    select_role: 'Select Role',
    administrative_supervisor: 'Administrative Supervisor',
    technical_supervisor: 'Technical Supervisor',
    signing_up: 'Signing up...',

    // Settings Component
    account_settings: 'Account Settings',
    change_password: 'Change Password',
    current_password: 'Current Password',
    new_password: 'New Password',
    update_profile: 'Update Profile',
    notification_settings: 'Notification Settings',
    language_settings: 'Language Settings',
    theme_settings: 'Theme Settings',
    save_settings: 'Save Settings',
    reset_settings: 'Reset Settings',

    // Supervisor Distribution Component
    add_supervisor: 'Add Supervisor',
    add_new_supervisor: 'Add New Supervisor',
    supervisor_name: 'Supervisor Name',
    enter_supervisor_name: 'Enter supervisor name',
    search_supervisors: 'Search supervisors...',
    supervisor_details: 'Supervisor Details',
    supervisor_is_full: 'Supervisor is full'
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
    supervisor_distribution: 'توزيع المشرفين',
    analytics: 'التحليلات',
    total_students: 'إجمالي الطلاب',
    departments: 'الأقسام',
    supervisors: 'المشرفين',
    active: 'نشط',
    growth: 'النمو',

    // Table Headers
    student: 'الطالب',
    department: 'القسم',
    factory: 'المصنع',
    group: 'المجموعة',
    stage: 'المرحلة',
    date: 'التاريخ',
    supervisor: 'المشرف',
    actions: 'الإجراءات',

    // Filters and Sorting
    filters: 'التصفية',
    sort: 'ترتيب',
    sort_by: 'ترتيب حسب',
    all: 'الكل',
    all_departments: 'جميع الأقسام',
    all_stages: 'جميع المراحل',
    all_batches: 'جميع الدفعات',
    all_factories: 'جميع المصانع',
    all_supervisors: 'جميع المشرفين',

    // Actions
    export: 'تصدير',
    add_student: 'إضافة طالب',
    add_factory: 'إضافة مصنع',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ',
    cancel: 'إلغاء',
    close: 'إغلاق',
    accept: 'قبول',
    deny: 'رفض',

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

    // Factory and Student related
    back_to_home: 'العودة للرئيسية',
    batch: 'دفعة',
    month: 'شهر',
    year: 'سنة',
    day: 'يوم',
    reset: 'إعادة تعيين',
    factory_name: 'اسم المصنع',
    address: 'العنوان',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني',
    role: 'الدور',
    lastUpdated: 'آخر تحديث',
    contact_name: 'اسم جهة الاتصال',
    industry: 'الصناعة',
    capacity: 'السعة',
    type: 'النوع',
    select_all: 'تحديد الكل',
    students_selected: 'طالب محدد',
    drag_students_here: 'اسحب الطلاب هنا',
    factory_is_full: 'المصنع ممتلئ',
    search_students: 'البحث عن طلاب...',
    search_factories: 'البحث عن مصانع...',
    add_new_factory: 'إضافة مصنع جديد',
    enter_factory_name: 'أدخل اسم المصنع',
    enter_address: 'أدخل العنوان',
    enter_phone: 'أدخل رقم الهاتف',
    enter_contact_name: 'أدخل اسم جهة الاتصال',
    select_industry: 'اختر الصناعة',
    enter_capacity: 'أدخل السعة',
    select_type: 'اختر النوع',
    factory_details: 'تفاصيل المصنع',
    name: 'الاسم',
    assigned_students: 'الطلاب المعينين',
    students: 'الطلاب',
    factories: 'المصانع',
    
    // Notifications
    new_factory_added: 'تمت إضافة مصنع جديد بواسطة طالب',
    new_student_registered: 'تم تسجيل طالب جديد',
    factory_capacity_updated: 'تم تحديث سعة المصنع',
    view_details: 'عرض التفاصيل',
    
    // Validation messages
    required_field: 'هذا الحقل مطلوب',
    invalid_phone: 'صيغة رقم الهاتف غير صحيحة',
    invalid_capacity: 'يجب أن تكون السعة رقمًا موجبًا',

    // Department names
    Electrical: 'كهرباء',
    Mechanics: 'ميكانيكا',
    'Information Technology': 'تكنولوجيا المعلومات',
    'Electrical Technology': 'تكنولوجيا كهربائية',
    'كهرباء': 'كهرباء',
    'ميكانيكا': 'ميكانيكا',
    'تكنولوجيا المعلومات': 'تكنولوجيا المعلومات',
    'تكنولوجيا كهربائية': 'تكنولوجيا كهربائية',

    // Stage names
    School: 'مدرسة',
    Institute: 'معهد',
    Faculty: 'كلية',
    'مدرسة': 'مدرسة',
    'معهد': 'معهد',
    'كلية': 'كلية',
    'كلية عليا': 'كلية عليا',
    'كلية متوسطة': 'كلية متوسطة',

    // Batch names
    'Batch 1': 'دفعة 1',
    'Batch 2': 'دفعة 2',
    'Batch 3': 'دفعة 3',
    'Batch 4': 'دفعة 4',
    '1': 'دفعة 1',
    '2': 'دفعة 2',
    '3': 'دفعة 3',
    '4': 'دفعة 4',
    'دفعة 1': 'دفعة 1',
    'دفعة 2': 'دفعة 2',
    'دفعة 3': 'دفعة 3',
    'دفعة 4': 'دفعة 4',

    // Factory types
    Internal: 'داخلي',
    External: 'خارجي',
    'داخلي': 'داخلي',
    'خارجي': 'خارجي',

    // Comparison
    vs: 'مقابل',

    // Month names
    january: 'يناير',
    february: 'فبراير',
    march: 'مارس',
    april: 'أبريل',
    may: 'مايو',
    june: 'يونيو',
    july: 'يوليو',
    august: 'أغسطس',
    september: 'سبتمبر',
    october: 'أكتوبر',
    november: 'نوفمبر',
    december: 'ديسمبر',

    // Sort options
    name_asc: 'الاسم (أ-ي)',
    name_desc: 'الاسم (ي-أ)',
    date_new: 'الأحدث أولاً',
    date_old: 'الأقدم أولاً',

    // Student Distribution Component
    no_students_assigned: 'لا يوجد طلاب معينين',
    save_changes: 'حفظ التغييرات',

    // Analytics Component
    monthly_trends: 'الاتجاهات الشهرية',
    capacity_utilization: 'استخدام السعة',
    student_distribution: 'توزيع الطلاب',
    department_breakdown: 'تفصيل الأقسام',
    supervisor_workload: 'عبء العمل على المشرفين',
    factory_performance: 'أداء المصانع',
    student_growth: 'نمو الطلاب',
    capacity_vs_assigned: 'السعة مقابل الطلاب المعينين',

    // Login Component
    login: 'تسجيل الدخول',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    remember_me: 'تذكرني',
    forgot_password: 'نسيت كلمة المرور؟',
    sign_in: 'تسجيل الدخول',
    invalid_credentials: 'اسم المستخدم أو كلمة المرور غير صحيحة',
    enter_email: 'أدخل بريدك الإلكتروني',
    enter_password: 'أدخل كلمة المرور',
    email_required: 'البريد الإلكتروني مطلوب',
    invalid_email: 'الرجاء إدخال بريد إلكتروني صحيح',
    password_required: 'كلمة المرور مطلوبة',
    password_min_length: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
    logging_in: 'جاري تسجيل الدخول...',
    no_account: 'ليس لديك حساب؟',

    // Sign Up Component
    sign_up: 'إنشاء حساب',
    confirm_password: 'تأكيد كلمة المرور',
    create_account: 'إنشاء حساب',
    already_have_account: 'لديك حساب بالفعل؟',
    passwords_dont_match: 'كلمات المرور غير متطابقة',
    email_in_use: 'البريد الإلكتروني مستخدم بالفعل',
    weak_password: 'كلمة المرور ضعيفة جداً',
    first_name: 'الاسم الأول',
    last_name: 'الاسم الأخير',
    enter_first_name: 'أدخل اسمك الأول',
    enter_last_name: 'أدخل اسمك الأخير',
    enter_confirm_password: 'تأكيد كلمة المرور',
    select_role: 'اختر الدور',
    administrative_supervisor: 'مشرف إداري',
    technical_supervisor: 'مشرف تقني',
    signing_up: 'جاري إنشاء الحساب...',

    // Settings Component
    account_settings: 'إعدادات الحساب',
    change_password: 'تغيير كلمة المرور',
    current_password: 'كلمة المرور الحالية',
    new_password: 'كلمة المرور الجديدة',
    update_profile: 'تحديث الملف الشخصي',
    notification_settings: 'إعدادات الإشعارات',
    language_settings: 'إعدادات اللغة',
    theme_settings: 'إعدادات المظهر',
    save_settings: 'حفظ الإعدادات',
    reset_settings: 'إعادة تعيين الإعدادات',

    // Supervisor Distribution Component
    add_supervisor: 'إضافة مشرف',
    add_new_supervisor: 'إضافة مشرف جديد',
    supervisor_name: 'اسم المشرف',
    enter_supervisor_name: 'أدخل اسم المشرف',
    search_supervisors: 'البحث عن المشرفين...',
    supervisor_details: 'تفاصيل المشرف',
    supervisor_is_full: 'المشرف ممتلئ'
  }
} as const;

// Create a type that represents all possible translation keys
type TranslationKeys = keyof typeof translations.en & keyof typeof translations.ar;

// Export the type for use in components
export type { TranslationKeys };

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang = new BehaviorSubject<'en' | 'ar'>('en');
  currentLang$ = this.currentLang.asObservable();

  constructor() {
    // Check if language preference exists in localStorage
    const savedLang = localStorage.getItem('preferredLanguage') as 'en' | 'ar' | null;
    if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
      this.setLanguage(savedLang);
    }
  }

  setLanguage(lang: 'en' | 'ar') {
    this.currentLang.next(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    // Save language preference to localStorage
    localStorage.setItem('preferredLanguage', lang);
  }

  translate(key: TranslationKeys): string {
    const currentLang = this.currentLang.value;
    const translation = translations[currentLang][key];
    
    if (!translation) {
      console.warn(`Translation key '${key}' not found in ${currentLang} language`);
      // Fallback to English if the key doesn't exist in the current language
      const englishTranslation = translations.en[key];
      if (!englishTranslation) {
        console.error(`Translation key '${key}' not found in both ${currentLang} and English`);
        return `Missing translation: ${key}`;
      }
      return englishTranslation;
    }
    return translation;
  }
  
  // Helper method to get current language
  getCurrentLanguage(): 'en' | 'ar' {
    return this.currentLang.value;
  }
  
  // Helper method to check if current language is RTL
  isRtl(): boolean {
    return this.currentLang.value === 'ar';
  }
}