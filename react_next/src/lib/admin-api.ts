// ============================================================
// Admin API Client — Client-side auth-aware REST API for admin pages
// Uses PUBLIC_API_BASE (relative URL proxied via next.config rewrites)
// Reads JWT token from aladdin_token cookie
// ============================================================

export const ADMIN_API_BASE = '/wp-json/sap/v1';

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function getToken(): string | undefined {
  return getCookie('aladdin_token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function adminFetch<T>(
  endpoint: string,
  options: RequestInit & { params?: Record<string, any> } = {}
): Promise<{ success: boolean; data?: T; message?: string; total?: number }> {
  const { params, ...fetchOpts } = options;
  let url = `${ADMIN_API_BASE}/${endpoint}`;
  if (params) {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') sp.set(k, String(v)); });
    const qs = sp.toString();
    if (qs) url += `?${qs}`;
  }
  try {
    const res = await fetch(url, {
      ...fetchOpts,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
        ...(fetchOpts.headers as Record<string, string>),
      },
    });
    if (!res.ok) {
      if (res.status === 401) return { success: false, message: '認証エラー' };
      return { success: false, message: `HTTP ${res.status}` };
    }
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'ネットワークエラー' };
  }
}

export const adminApi = {
  // ======== Dashboard Stats ========
  getStats: () => adminFetch<any>('admin/stats'),

  // ======== Articles ========
  getArticles: (params?: Record<string, any>) => adminFetch<any[]>('articles', { params }),
  getArticle: (id: number) => adminFetch<any>(`articles/${id}`),
  createArticle: (data: any) =>
    adminFetch<any>('articles', { method: 'POST', body: JSON.stringify(data) }),
  updateArticle: (id: number, data: any) =>
    adminFetch<any>(`articles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteArticle: (id: number) =>
    adminFetch<any>(`articles/${id}`, { method: 'DELETE' }),
  searchArticles: (q: string, params?: Record<string, any>) =>
    adminFetch<any[]>('articles/search', { params: { q, ...params } }),

  // ======== Modules ========
  getModules: () => adminFetch<any[]>('modules'),
  getModule: (slug: string) => adminFetch<any>(`modules/${slug}`),
  getModuleContent: (slug: string) => adminFetch<any>(`modules/${slug}/content`),
  createModule: (data: any) =>
    adminFetch<any>('modules', { method: 'POST', body: JSON.stringify(data) }),
  updateModule: (slug: string, data: any) =>
    adminFetch<any>(`modules/${slug}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteModule: (slug: string) =>
    adminFetch<any>(`modules/${slug}`, { method: 'DELETE' }),

  // ======== Courses ========
  getCourses: (params?: Record<string, any>) => adminFetch<any[]>('courses', { params }),
  getCourse: (id: number) => adminFetch<any>(`courses/${id}`),
  createCourse: (data: any) =>
    adminFetch<any>('courses', { method: 'POST', body: JSON.stringify(data) }),
  updateCourse: (id: number, data: any) =>
    adminFetch<any>(`courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCourse: (id: number) =>
    adminFetch<any>(`courses/${id}`, { method: 'DELETE' }),

  // ======== Lessons ========
  getLessons: (params?: Record<string, any>) => adminFetch<any[]>('lessons', { params }),
  getLesson: (id: number) => adminFetch<any>(`lessons/${id}`),
  createLesson: (data: any) =>
    adminFetch<any>('lessons', { method: 'POST', body: JSON.stringify(data) }),
  updateLesson: (id: number, data: any) =>
    adminFetch<any>(`lessons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLesson: (id: number) =>
    adminFetch<any>(`lessons/${id}`, { method: 'DELETE' }),

  // ======== Knowledge ========
  getKnowledge: (params?: Record<string, any>) => adminFetch<any[]>('knowledge', { params }),
  getKnowledgeDetail: (id: number) => adminFetch<any>(`knowledge/${id}`),
  createKnowledge: (data: any) =>
    adminFetch<any>('knowledge', { method: 'POST', body: JSON.stringify(data) }),
  updateKnowledge: (id: number, data: any) =>
    adminFetch<any>(`knowledge/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteKnowledge: (id: number) =>
    adminFetch<any>(`knowledge/${id}`, { method: 'DELETE' }),

  // ======== Cases ========
  getCases: (params?: Record<string, any>) => adminFetch<any[]>('cases', { params }),
  getCase: (id: number) => adminFetch<any>(`cases/${id}`),
  createCase: (data: any) =>
    adminFetch<any>('cases', { method: 'POST', body: JSON.stringify(data) }),
  updateCase: (id: number, data: any) =>
    adminFetch<any>(`cases/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCase: (id: number) =>
    adminFetch<any>(`cases/${id}`, { method: 'DELETE' }),

  // ======== Videos ========
  getVideos: (params?: Record<string, any>) => adminFetch<any[]>('videos', { params }),
  getVideo: (id: number) => adminFetch<any>(`videos/${id}`),
  createVideo: (data: any) =>
    adminFetch<any>('videos', { method: 'POST', body: JSON.stringify(data) }),
  updateVideo: (id: number, data: any) =>
    adminFetch<any>(`videos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteVideo: (id: number) =>
    adminFetch<any>(`videos/${id}`, { method: 'DELETE' }),

  // ======== Quizzes ========
  getQuizzes: (params?: Record<string, any>) => adminFetch<any[]>('quizzes', { params }),
  getQuiz: (id: number) => adminFetch<any>(`quizzes/${id}`),
  createQuiz: (data: any) =>
    adminFetch<any>('quizzes', { method: 'POST', body: JSON.stringify(data) }),
  updateQuiz: (id: number, data: any) =>
    adminFetch<any>(`quizzes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteQuiz: (id: number) =>
    adminFetch<any>(`quizzes/${id}`, { method: 'DELETE' }),

  // ======== Learning Paths ========
  getLearningPaths: (params?: Record<string, any>) => adminFetch<any[]>('learning-paths', { params }),
  getLearningPath: (id: number) => adminFetch<any>(`learning-paths/${id}`),
  createLearningPath: (data: any) =>
    adminFetch<any>('learning-paths', { method: 'POST', body: JSON.stringify(data) }),
  updateLearningPath: (id: number, data: any) =>
    adminFetch<any>(`learning-paths/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLearningPath: (id: number) =>
    adminFetch<any>(`learning-paths/${id}`, { method: 'DELETE' }),

  // ======== Steps ========
  getStep: (id: number) => adminFetch<any>(`steps/${id}`),

  // ======== Notes ========
  getNotes: (params?: Record<string, any>) => adminFetch<any[]>('notes', { params }),
  getNote: (id: number) => adminFetch<any>(`notes/${id}`),
  createNote: (data: any) =>
    adminFetch<any>('notes', { method: 'POST', body: JSON.stringify(data) }),
  updateNote: (id: number, data: any) =>
    adminFetch<any>(`notes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteNote: (id: number) =>
    adminFetch<any>(`notes/${id}`, { method: 'DELETE' }),

  // ======== Users ========
  getUsers: (params?: Record<string, any>) => adminFetch<any[]>('users', { params }),
  updateUser: (id: number, data: any) =>
    adminFetch<any>(`users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id: number) =>
    adminFetch<any>(`users/${id}`, { method: 'DELETE' }),

  // ======== Contact Inquiries ========
  getContactInquiries: (params?: Record<string, any>) => adminFetch<any[]>('contact', { params }),
  markContactRead: (id: number) =>
    adminFetch<any>(`contact/${id}/read`, { method: 'PUT' }),

  // ======== Pages ========
  getPages: () => adminFetch<any[]>('pages'),
  createPage: (data: any) =>
    adminFetch<any>('pages', { method: 'POST', body: JSON.stringify(data) }),
  updatePage: (id: number, data: any) =>
    adminFetch<any>(`pages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePage: (id: number) =>
    adminFetch<any>(`pages/${id}`, { method: 'DELETE' }),

  // ======== Applications ========
  getApplications: (params?: Record<string, any>) => adminFetch<any[]>('cases/applications', { params }),
  updateApplication: (id: number, data: any) =>
    adminFetch<any>(`cases/applications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};
