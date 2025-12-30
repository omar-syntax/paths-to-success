import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'en';

interface LangContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const translations = {
  ar: {
    // Platform
    platformName: 'مسارات النجاح',
    platformFullName: 'Paths to Success – مسارات النجاح',
    
    // Hero
    heroTitle: 'منصة لإدارة المشاريع والمسابقات للطلاب',
    heroSubtitle: 'قدّم على مشاريع، مسابقات، وتابع تقدمك في مكان واحد',
    heroStartNow: 'ابدأ الآن',
    heroBrowseProjects: 'تصفح المشاريع',
    
    // Features
    featuresTitle: 'مميزات المنصة',
    feature1Title: 'التقديم على المشاريع والمسابقات',
    feature1Desc: 'تصفح وقدّم على مختلف المشاريع والمسابقات المتاحة بكل سهولة',
    feature2Title: 'نظام إشعارات ذكي',
    feature2Desc: 'تلقى إشعارات فورية عند أي تحديث على مشاريعك أو تقييماتك',
    feature3Title: 'رفع الملفات وتتبع التقدم',
    feature3Desc: 'ارفع ملفاتك وتابع حالة تقدمك في كل مشروع',
    feature4Title: 'لوحة تحكم للطالب',
    feature4Desc: 'لوحة تحكم شاملة لإدارة جميع مشاريعك في مكان واحد',
    
    // How It Works
    howItWorksTitle: 'كيف تعمل المنصة؟',
    step1Title: 'إنشاء حساب',
    step1Desc: 'سجّل حسابك الجديد في دقائق معدودة',
    step2Title: 'التقديم على مشروع أو مسابقة',
    step2Desc: 'اختر المشروع المناسب وقدّم عليه',
    step3Title: 'رفع الملفات ومتابعة النتائج',
    step3Desc: 'ارفع ملفاتك وتابع تقييمك ونتائجك',
    
    // CTA
    ctaTitle: 'مستعد تبدأ رحلتك؟',
    ctaSubtitle: 'انضم إلى آلاف الطلاب الذين يحققون نجاحاتهم عبر منصتنا',
    ctaButton: 'انضم الآن',
    
    // Footer
    footerRights: 'جميع الحقوق محفوظة',
    
    // Navbar
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب',
    notifications: 'الإشعارات',
    myProjects: 'مشاريعي',
    dashboard: 'لوحة التحكم',
    profile: 'الملف الشخصي',
    logout: 'تسجيل الخروج',
    
    // Chatbot
    chatbotTitle: 'مساعد المنصة',
    chatbotWelcome: 'مرحباً! كيف يمكنني مساعدتك؟',
    chatbotPlaceholder: 'اكتب رسالتك هنا...',
    chatbotSend: 'إرسال',
    chatbotDefaultReply: 'من فضلك وضّح سؤالك أكثر، يمكنك السؤال عن التسجيل، المسابقات، أو رفع الملفات.',
    chatbotApplyReply: 'للتقديم على مشروع أو مسابقة، قم بتسجيل الدخول ثم اذهب إلى صفحة المشاريع واختر المشروع المناسب واضغط على زر "التقديم".',
    chatbotCompetitionReply: 'المسابقات هي فرص للطلاب للمشاركة في تحديات متنوعة. يمكنك تصفح المسابقات المتاحة من لوحة التحكم والتقديم عليها.',
    chatbotUploadReply: 'لرفع الملفات، اذهب إلى صفحة مشاريعي، اختر المشروع، ثم اضغط على زر "رفع ملف" واختر الملفات المطلوبة.',
  },
  en: {
    // Platform
    platformName: 'Paths to Success',
    platformFullName: 'Paths to Success – مسارات النجاح',
    
    // Hero
    heroTitle: 'Student Project & Competition Management Platform',
    heroSubtitle: 'Apply for projects, competitions, and track your progress in one place',
    heroStartNow: 'Start Now',
    heroBrowseProjects: 'Browse Projects',
    
    // Features
    featuresTitle: 'Platform Features',
    feature1Title: 'Apply for Projects & Competitions',
    feature1Desc: 'Browse and apply for various available projects and competitions easily',
    feature2Title: 'Smart Notification System',
    feature2Desc: 'Receive instant notifications for any updates on your projects or grades',
    feature3Title: 'File Upload & Progress Tracking',
    feature3Desc: 'Upload your files and track your progress on each project',
    feature4Title: 'Student Dashboard',
    feature4Desc: 'Comprehensive dashboard to manage all your projects in one place',
    
    // How It Works
    howItWorksTitle: 'How It Works',
    step1Title: 'Create an Account',
    step1Desc: 'Register your new account in just minutes',
    step2Title: 'Apply for a Project or Competition',
    step2Desc: 'Choose the right project and apply for it',
    step3Title: 'Upload Files & Track Results',
    step3Desc: 'Upload your files and track your grades and results',
    
    // CTA
    ctaTitle: 'Ready to Start Your Journey?',
    ctaSubtitle: 'Join thousands of students achieving success through our platform',
    ctaButton: 'Join Now',
    
    // Footer
    footerRights: 'All Rights Reserved',
    
    // Navbar
    login: 'Login',
    signup: 'Sign Up',
    notifications: 'Notifications',
    myProjects: 'My Projects',
    dashboard: 'Dashboard',
    profile: 'Profile',
    logout: 'Logout',
    
    // Chatbot
    chatbotTitle: 'Platform Assistant',
    chatbotWelcome: 'Hello! How can I help you?',
    chatbotPlaceholder: 'Type your message here...',
    chatbotSend: 'Send',
    chatbotDefaultReply: 'Please clarify your question. You can ask about registration, competitions, or file uploads.',
    chatbotApplyReply: 'To apply for a project or competition, log in, go to the Projects page, select the appropriate project, and click the "Apply" button.',
    chatbotCompetitionReply: 'Competitions are opportunities for students to participate in various challenges. You can browse available competitions from the dashboard and apply for them.',
    chatbotUploadReply: 'To upload files, go to My Projects page, select the project, then click "Upload File" button and choose the required files.',
  },
};

const LangContext = createContext<LangContextType | undefined>(undefined);

export const LangProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('platform-lang');
    return (saved as Language) || 'ar';
  });

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('platform-lang', lang);
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  const t = (key: string): string => {
    const langTranslations = translations[lang];
    return (langTranslations as Record<string, string>)[key] || key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = (): LangContextType => {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error('useLang must be used within a LangProvider');
  }
  return context;
};
