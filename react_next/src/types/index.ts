// ============================================================
// SAP Panda Academy — Shared Types
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface SapModule {
  slug: string;
  name: string;
  description?: string;
  article_count?: number;
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  module_slug: string;
  difficulty: string;
  date: string;
  reading_time: number;
  author_name: string;
  reactions?: Record<string, number>;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  content: string;
  module_slug: string;
  difficulty: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  slug: string;
  title: string;
  content: string;
  duration?: string;
  course_id?: number;
}

export interface SapKnowledge {
  id: number;
  slug: string;
  title: string;
  content: string;
  module_slug: string;
}

export interface SapNote {
  id: number;
  slug: string;
  title: string;
  content: string;
  date: string;
}

export interface SapCase {
  id: number;
  title: string;
  company: string;
  location: string;
  salary_range: string;
  description: string;
  module_slug: string;
  excerpt?: string;
}

export interface LearningPath {
  id: number;
  title: string;
  description: string;
  target_audience: string;
  estimated_hours: number;
  accent_color: string;
  module?: string;
  steps: PathStep[];
}

export interface PathStep {
  id: number;
  title: string;
  description: string;
  content?: string;
  articles?: Array<{ id: number; slug: string; title: string }>;
  courses?: Array<{ id: number; title: string }>;
  knowledge?: Array<{ id: number; slug: string; title: string }>;
}

export interface Quiz {
  id: number;
  question: string;
  options: string[];
  correctIndex?: number;
  explanation?: string;
}

export interface Video {
  id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
}

export interface MemberPlan {
  id: number;
  name: string;
  price: number;
  interval: string;
  description: string;
  features: string[];
}

export interface User {
  id: number;
  display_name: string;
  email: string;
  role?: string;
}

export interface Points {
  total: number;
  daily_streak: number;
}

export interface QuizStats {
  total_answered: number;
  correct_rate: number;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}
