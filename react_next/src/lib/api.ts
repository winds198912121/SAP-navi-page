// ============================================================
// REST API Client — Shared /wp-json/sap/v1/ endpoints
// ============================================================

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/wp-json/sap/v1';

interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
}

async function apiRequest<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T | null> {
  const { params, ...fetchOpts } = options;
  let url = `${API_BASE}/${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.set(key, String(val));
      }
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOpts.headers as Record<string, string>),
  };

  try {
    const res = await fetch(url, { ...fetchOpts, headers, next: { revalidate: 60 } });
    if (!res.ok) {
      console.error(`[API] ${res.status} ${url}`);
      return null;
    }
    const json = await res.json();
    if (json.success && json.data !== undefined) return json.data as T;
    if (json.success) return json as unknown as T;
    return null;
  } catch (err) {
    console.error(`[API] Error fetching ${url}:`, err);
    return null;
  }
}

export const api = {
  // Articles
  getArticles: (params?: Record<string, any>) =>
    apiRequest<any[]>('articles', { params }),
  getArticle: (id: number) =>
    apiRequest<any>(`articles/${id}`),
  getPopularArticles: (perPage = 10) =>
    apiRequest<any[]>('articles/popular', { params: { per_page: perPage } }),
  searchArticles: (q: string, params?: Record<string, any>) =>
    apiRequest<any[]>('articles/search', { params: { q, ...params } }),

  // Modules
  getModules: () => apiRequest<any[]>('modules'),
  getModule: (slug: string) => apiRequest<any>(`modules/${slug}`),
  getModuleArticles: (slug: string, params?: Record<string, any>) =>
    apiRequest<any[]>(`modules/${slug}/articles`, { params }),
  getModuleContent: (slug: string) =>
    apiRequest<any>(`modules/${slug}/content`),

  // Courses
  getCourses: (params?: Record<string, any>) =>
    apiRequest<any[]>('courses', { params }),
  getCourse: (id: number) => apiRequest<any>(`courses/${id}`),
  getCourseLessons: (courseId: number) =>
    apiRequest<any[]>(`courses/${courseId}/lessons`),

  // Lessons
  getLesson: (id: number) => apiRequest<any>(`lessons/${id}`),

  // Learning Paths
  getLearningPaths: () => apiRequest<any[]>('learning-paths'),
  getLearningPath: (id: number) => apiRequest<any>(`learning-paths/${id}`),
  getPathSteps: (pathId: number) =>
    apiRequest<any[]>(`learning-paths/${pathId}/steps`),

  // Steps
  getStep: (id: number) => apiRequest<any>(`steps/${id}`),

  // Videos
  getVideos: (params?: Record<string, any>) =>
    apiRequest<any[]>('videos', { params }),

  // Knowledge
  getKnowledge: (params?: Record<string, any>) =>
    apiRequest<any[]>('knowledge', { params }),
  getKnowledgeDetail: (id: number) =>
    apiRequest<any>(`knowledge/${id}`),

  // Notes
  getNotes: (params?: Record<string, any>) =>
    apiRequest<any[]>('notes', { params }),
  getNote: (id: number) => apiRequest<any>(`notes/${id}`),

  // Quiz
  getTodayQuiz: () => apiRequest<any>('quizzes/today'),
  getQuizStats: () => apiRequest<any>('quizzes/stats'),

  // Cases
  getCases: (params?: Record<string, any>) =>
    apiRequest<any[]>('cases', { params }),

  // Auth
  login: async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (json.success && json.data) return json.data;
      throw new Error(json.message || 'Login failed');
    } catch (err) {
      throw err;
    }
  },
  register: async (data: Record<string, any>) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success && json.data) return json.data;
      throw new Error(json.message || 'Registration failed');
    } catch (err) {
      throw err;
    }
  },

  // User
  getMe: (token: string) =>
    apiRequest<any>('users/me', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    }),
  getPoints: (token: string) =>
    apiRequest<any>('points', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    }),
  claimDailyPoints: (token: string) =>
    fetch(`${API_BASE}/points/daily`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then(r => r.json()),

  // Membership
  getMembershipPlans: () => apiRequest<any[]>('membership/plans'),

  // Pages
  getPages: () => apiRequest<any[]>('pages'),

  // Contact
  submitContact: (data: Record<string, any>) =>
    fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  // Sitemap
  getSitemap: () => apiRequest<any>('sitemap'),
};
