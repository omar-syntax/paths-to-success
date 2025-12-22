export interface Project {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  startDate: string;
  endDate: string;
  image?: string;
  status: 'open' | 'closing-soon' | 'closed';
  registeredCount: number;
  formFields: string[];
}

export interface Registration {
  id: string;
  projectId: string;
  projectTitle: string;
  registrationDate: string;
  status: 'registered' | 'in-progress' | 'submitted';
  filesCount: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface StatisticsData {
  totalProjects: number;
  totalRegistrations: number;
  openProjects: number;
  uploadedFiles: number;
  weeklyRegistrations: { day: string; count: number }[];
  monthlyRegistrations: { month: string; count: number }[];
  projectsRanking: { name: string; count: number }[];
  statusDistribution: { status: string; count: number; color: string }[];
}

export interface FormField {
  id: string;
  label: string;
  category: 'basic' | 'education' | 'additional' | 'links' | 'files' | 'custom';
  type: 'text' | 'email' | 'tel' | 'date' | 'number' | 'url' | 'textarea' | 'select' | 'file';
}
