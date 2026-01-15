
export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: string;
  type: 'video' | 'text' | 'quiz';
  videoUrl?: string;
  isFreePreview?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Invoice {
  id: string;
  courseTitle: string;
  date: string;
  amount: number;
  paymentMethod: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  category: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  lessons: Lesson[];
  rating: number;
  studentsCount: number;
  isFree: boolean;
  price?: number;
  reviews: Review[];
  status: 'draft' | 'published';
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  footerText: string;
}

export type SubscriptionPlan = 'Free' | 'Pro' | 'Enterprise';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  isAuthenticated: boolean;
  is2FAVerified: boolean;
  purchasedCourses: string[];
  invoices: Invoice[];
  phoneNumber: string;
  subscription: SubscriptionPlan;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
