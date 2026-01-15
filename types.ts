
export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: string;
  type: 'video' | 'text' | 'quiz';
  videoUrl?: string;
  isFreePreview?: boolean; // Nouvelle propriété
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
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  isAuthenticated: boolean;
  is2FAVerified: boolean;
  purchasedCourses: string[];
  phoneNumber?: string;
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
