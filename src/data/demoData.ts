import { Project, Registration, Notification, StatisticsData, FormField } from '@/types';

export const demoProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'مسابقة الذكاء الاصطناعي 2025',
    description: 'شارك في أكبر مسابقة للذكاء الاصطناعي في المنطقة العربية. قم ببناء حلول مبتكرة باستخدام تقنيات التعلم الآلي والتعلم العميق.',
    requirements: 'معرفة أساسية بـ Python و Machine Learning',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    status: 'open',
    registeredCount: 45,
    formFields: ['fullName', 'email', 'phone', 'school', 'github'],
  },
  {
    id: 'proj-2',
    title: 'هاكاثون تطوير تطبيقات الموبايل',
    description: 'ماراثون برمجي لمدة 48 ساعة لتطوير تطبيقات الهاتف المحمول باستخدام أحدث التقنيات. جوائز قيمة للفائزين.',
    requirements: 'خبرة في React Native أو Flutter',
    startDate: '2025-02-15',
    endDate: '2025-02-17',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    status: 'open',
    registeredCount: 78,
    formFields: ['fullName', 'email', 'phone', 'linkedin', 'portfolio'],
  },
  {
    id: 'proj-3',
    title: 'مشروع تخرج الطلاب المتميزين',
    description: 'برنامج خاص لدعم مشاريع التخرج المتميزة. نوفر الإرشاد والموارد اللازمة لإنجاح مشروعك.',
    requirements: 'طالب في السنة النهائية',
    startDate: '2025-01-15',
    endDate: '2025-06-30',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    status: 'closing-soon',
    registeredCount: 23,
    formFields: ['fullName', 'email', 'phone', 'school', 'gpa', 'cv'],
  },
  {
    id: 'proj-4',
    title: 'ورشة تطوير الويب الحديث',
    description: 'تعلم أحدث تقنيات تطوير الويب مع React و TypeScript و Tailwind CSS. ورشة عملية مكثفة على مدار أسبوعين.',
    requirements: 'معرفة أساسية بـ HTML و CSS و JavaScript',
    startDate: '2024-12-01',
    endDate: '2024-12-20',
    image: 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=800',
    status: 'closed',
    registeredCount: 156,
    formFields: ['fullName', 'email', 'phone'],
  },
  {
    id: 'proj-5',
    title: 'مسابقة تصميم واجهات المستخدم',
    description: 'أظهر إبداعك في تصميم واجهات المستخدم. المسابقة مفتوحة لجميع المصممين والمطورين.',
    requirements: 'خبرة في Figma أو Adobe XD',
    startDate: '2025-01-10',
    endDate: '2025-02-28',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    status: 'open',
    registeredCount: 34,
    formFields: ['fullName', 'email', 'portfolio', 'workSamples'],
  },
  {
    id: 'proj-6',
    title: 'برنامج التدريب الصيفي',
    description: 'فرصة تدريب صيفية في أكبر الشركات التقنية. اكتسب خبرة عملية حقيقية واعمل مع محترفين.',
    requirements: 'طالب جامعي في تخصص تقني',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    status: 'closing-soon',
    registeredCount: 89,
    formFields: ['fullName', 'email', 'phone', 'school', 'major', 'cv', 'motivationLetter'],
  },
];

export const adminDemoProjects: Project[] = [
  ...demoProjects,
  {
    id: 'proj-7',
    title: 'مسابقة البرمجة التنافسية',
    description: 'تحدى نفسك في حل المسائل البرمجية المعقدة',
    requirements: 'إتقان لغة برمجة واحدة على الأقل',
    startDate: '2025-03-01',
    endDate: '2025-03-15',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800',
    status: 'open',
    registeredCount: 67,
    formFields: ['fullName', 'email', 'github'],
  },
  {
    id: 'proj-8',
    title: 'ورشة الأمن السيبراني',
    description: 'تعلم أساسيات الأمن السيبراني والاختراق الأخلاقي',
    requirements: 'معرفة بأساسيات الشبكات',
    startDate: '2025-04-01',
    endDate: '2025-04-30',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    status: 'open',
    registeredCount: 42,
    formFields: ['fullName', 'email', 'phone', 'experience'],
  },
];

export const myProjects: Registration[] = [
  {
    id: 'reg-1',
    projectId: 'proj-1',
    projectTitle: 'مسابقة الذكاء الاصطناعي 2025',
    registrationDate: '2025-01-05',
    status: 'registered',
    filesCount: 0,
  },
  {
    id: 'reg-2',
    projectId: 'proj-2',
    projectTitle: 'هاكاثون تطوير تطبيقات الموبايل',
    registrationDate: '2025-01-10',
    status: 'in-progress',
    filesCount: 2,
  },
  {
    id: 'reg-3',
    projectId: 'proj-4',
    projectTitle: 'ورشة تطوير الويب الحديث',
    registrationDate: '2024-12-01',
    status: 'submitted',
    filesCount: 5,
  },
];

export const notifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'تم فتح مسابقة جديدة',
    message: 'مسابقة الذكاء الاصطناعي 2025 مفتوحة للتسجيل الآن!',
    date: '2025-01-01',
    read: false,
    type: 'info',
  },
  {
    id: 'notif-2',
    title: 'اقتراب موعد التسليم',
    message: 'باقي 5 أيام على موعد تسليم هاكاثون تطوير التطبيقات',
    date: '2025-02-12',
    read: false,
    type: 'warning',
  },
  {
    id: 'notif-3',
    title: 'تم قبول تسجيلك',
    message: 'تهانينا! تم قبول تسجيلك في مسابقة تصميم واجهات المستخدم',
    date: '2025-01-11',
    read: true,
    type: 'success',
  },
  {
    id: 'notif-4',
    title: 'تذكير مهم',
    message: 'باقي 3 أيام على إغلاق التسجيل في برنامج التدريب الصيفي',
    date: '2025-05-28',
    read: false,
    type: 'warning',
  },
  {
    id: 'notif-5',
    title: 'تم نشر النتائج',
    message: 'تم نشر نتائج مسابقة تطوير الويب. تحقق من ترتيبك الآن!',
    date: '2024-12-25',
    read: true,
    type: 'success',
  },
];

export const registrants = [
  { id: 'r-1', name: 'أحمد محمد علي', email: 'ahmed@example.com', registrationDate: '2025-01-02', status: 'مسجل', filesCount: 0 },
  { id: 'r-2', name: 'سارة عبدالله', email: 'sara@example.com', registrationDate: '2025-01-03', status: 'جاري العمل', filesCount: 2 },
  { id: 'r-3', name: 'محمد خالد', email: 'mohamed@example.com', registrationDate: '2025-01-04', status: 'تم التسليم', filesCount: 5 },
  { id: 'r-4', name: 'فاطمة حسن', email: 'fatma@example.com', registrationDate: '2025-01-05', status: 'مسجل', filesCount: 0 },
  { id: 'r-5', name: 'عمر أحمد', email: 'omar@example.com', registrationDate: '2025-01-06', status: 'جاري العمل', filesCount: 3 },
  { id: 'r-6', name: 'نورا سامي', email: 'noura@example.com', registrationDate: '2025-01-07', status: 'تم التسليم', filesCount: 4 },
  { id: 'r-7', name: 'يوسف إبراهيم', email: 'youssef@example.com', registrationDate: '2025-01-08', status: 'مسجل', filesCount: 0 },
  { id: 'r-8', name: 'هدى علي', email: 'hoda@example.com', registrationDate: '2025-01-09', status: 'جاري العمل', filesCount: 1 },
  { id: 'r-9', name: 'كريم محمود', email: 'karim@example.com', registrationDate: '2025-01-10', status: 'مسجل', filesCount: 0 },
  { id: 'r-10', name: 'مريم عادل', email: 'mariam@example.com', registrationDate: '2025-01-11', status: 'تم التسليم', filesCount: 6 },
];

export const statisticsData: StatisticsData = {
  totalProjects: 12,
  totalRegistrations: 156,
  openProjects: 5,
  uploadedFiles: 89,
  weeklyRegistrations: [
    { day: 'السبت', count: 12 },
    { day: 'الأحد', count: 19 },
    { day: 'الاثنين', count: 8 },
    { day: 'الثلاثاء', count: 15 },
    { day: 'الأربعاء', count: 23 },
    { day: 'الخميس', count: 18 },
    { day: 'الجمعة', count: 11 },
  ],
  monthlyRegistrations: [
    { month: 'يناير', count: 45 },
    { month: 'فبراير', count: 62 },
    { month: 'مارس', count: 38 },
    { month: 'أبريل', count: 55 },
    { month: 'مايو', count: 71 },
    { month: 'يونيو', count: 48 },
  ],
  projectsRanking: [
    { name: 'مسابقة الذكاء الاصطناعي', count: 45 },
    { name: 'هاكاثون الموبايل', count: 78 },
    { name: 'تطوير الويب', count: 156 },
    { name: 'التدريب الصيفي', count: 89 },
    { name: 'تصميم واجهات', count: 34 },
  ],
  statusDistribution: [
    { status: 'مسجل', count: 45, color: 'hsl(199, 89%, 48%)' },
    { status: 'جاري العمل', count: 67, color: 'hsl(38, 92%, 50%)' },
    { status: 'تم التسليم', count: 44, color: 'hsl(142, 76%, 36%)' },
  ],
};

export const formFieldsOptions: FormField[] = [
  // معلومات أساسية
  { id: 'fullName', label: 'الاسم الكامل', category: 'basic', type: 'text' },
  { id: 'email', label: 'البريد الإلكتروني', category: 'basic', type: 'email' },
  { id: 'phone', label: 'رقم التليفون', category: 'basic', type: 'tel' },
  { id: 'nationalId', label: 'الرقم القومي', category: 'basic', type: 'text' },
  { id: 'birthDate', label: 'تاريخ الميلاد', category: 'basic', type: 'date' },
  { id: 'gender', label: 'النوع', category: 'basic', type: 'select' },
  
  // معلومات تعليمية
  { id: 'school', label: 'المدرسة/الجامعة', category: 'education', type: 'text' },
  { id: 'grade', label: 'الصف الدراسي/السنة', category: 'education', type: 'text' },
  { id: 'major', label: 'التخصص', category: 'education', type: 'text' },
  { id: 'gpa', label: 'المعدل التراكمي (GPA)', category: 'education', type: 'number' },
  
  // معلومات إضافية
  { id: 'address', label: 'العنوان الكامل', category: 'additional', type: 'text' },
  { id: 'city', label: 'المحافظة/المدينة', category: 'additional', type: 'text' },
  { id: 'interests', label: 'الاهتمامات', category: 'additional', type: 'textarea' },
  { id: 'skills', label: 'المهارات', category: 'additional', type: 'textarea' },
  { id: 'experience', label: 'الخبرات السابقة', category: 'additional', type: 'textarea' },
  
  // روابط وحسابات
  { id: 'github', label: 'رابط GitHub', category: 'links', type: 'url' },
  { id: 'linkedin', label: 'رابط LinkedIn', category: 'links', type: 'url' },
  { id: 'portfolio', label: 'رابط Portfolio', category: 'links', type: 'url' },
  { id: 'twitter', label: 'حساب Twitter/X', category: 'links', type: 'text' },
  
  // ملفات مرفقة
  { id: 'photo', label: 'صورة شخصية', category: 'files', type: 'file' },
  { id: 'cv', label: 'السيرة الذاتية (PDF)', category: 'files', type: 'file' },
  { id: 'motivationLetter', label: 'خطاب التحفيز', category: 'files', type: 'file' },
  { id: 'certificates', label: 'شهادات (متعددة)', category: 'files', type: 'file' },
  { id: 'workSamples', label: 'نماذج أعمال سابقة', category: 'files', type: 'file' },
  
  // أسئلة مخصصة
  { id: 'customText1', label: 'سؤال نصي قصير 1', category: 'custom', type: 'text' },
  { id: 'customText2', label: 'سؤال نصي قصير 2', category: 'custom', type: 'text' },
  { id: 'customTextarea', label: 'سؤال نصي طويل', category: 'custom', type: 'textarea' },
  { id: 'customSelect', label: 'سؤال اختيار متعدد', category: 'custom', type: 'select' },
];
