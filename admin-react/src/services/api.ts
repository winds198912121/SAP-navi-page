import axios, { AxiosInstance } from 'axios'
import type { ApiResponse, Article, SapModule, Quiz, SapCase, Course, SapKnowledge, CourseFormData, KnowledgeFormData } from '../types'
import { API_BASE } from '../config'

class ApiService {
  public client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE,
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    })

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('sap_panda_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        // サーバー環境によって Authorization ヘッダーが PHP に届かない場合の
        // フォールバック: GET クエリパラメータにもトークンを付与
        if (config.method === 'get' || config.method === 'GET') {
          config.params = { ...config.params, _token: token }
        }
      }
      return config
    })

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('sap_panda_token')
        }
        return Promise.reject(error)
      }
    )
  }

  /** 文章列表 */
  async getArticles(params?: Record<string, any>): Promise<ApiResponse<Article[]>> {
    const { data } = await this.client.get('/articles', { params })
    return data
  }

  /** 文章详情 */
  async getArticle(id: number): Promise<ApiResponse<Article>> {
    const { data } = await this.client.get(`/articles/${id}`)
    return data
  }

  /** 热门文章 */
  async getPopularArticles(perPage = 10): Promise<ApiResponse<Article[]>> {
    const { data } = await this.client.get('/articles/popular', { params: { per_page: perPage } })
    return data
  }

  /** 搜索 */
  async searchArticles(q: string, params?: Record<string, any>): Promise<ApiResponse<Article[]>> {
    const { data } = await this.client.get('/articles/search', { params: { q, ...params } })
    return data
  }

  /** 模块列表 */
  async getModules(): Promise<ApiResponse<SapModule[]>> {
    const { data } = await this.client.get('/modules')
    return data
  }

  /** 模块文章 */
  async getModuleArticles(slug: string, params?: Record<string, any>): Promise<ApiResponse<Article[]>> {
    const { data } = await this.client.get(`/modules/${slug}/articles`, { params })
    return data
  }

  /** 模块全部內容 (含文章/课程/知识/统计) */
  async getModuleContent(slug: string): Promise<ApiResponse<any>> {
    const { data } = await this.client.get(`/modules/${slug}/content`)
    return data
  }

  /** 学習パス一覧 */
  async getLearningPaths(): Promise<ApiResponse<any>> {
    const { data } = await this.client.get('/learning-paths')
    return data
  }

  /** 動画一覧 */
  async getVideos(params?: Record<string, any>): Promise<ApiResponse<any>> {
    const { data } = await this.client.get('/videos', { params })
    return data
  }

  /** 動画詳細 */
  async getVideo(id: number): Promise<ApiResponse<any>> {
    const { data } = await this.client.get(`/videos/${id}`)
    return data
  }

  /** 学習パス詳細 */
  async getLearningPath(id: number): Promise<ApiResponse<any>> {
    const { data } = await this.client.get(`/learning-paths/${id}`)
    return data
  }

  /** コース詳細 */
  async getCourse(id: number): Promise<ApiResponse<Course>> {
    const { data } = await this.client.get(`/courses/${id}`)
    return data
  }

  /** ナレッジ詳細 */
  async getKnowledge(id: number): Promise<ApiResponse<SapKnowledge>> {
    const { data } = await this.client.get(`/knowledge/${id}`)
    return data
  }

  /** コース作成 */
  async createCourse(data: CourseFormData): Promise<ApiResponse<Course>> {
    const { data: res } = await this.client.post('/courses', data)
    return res
  }

  /** コース更新 */
  async updateCourse(id: number, data: CourseFormData): Promise<ApiResponse<Course>> {
    const { data: res } = await this.client.put(`/courses/${id}`, data)
    return res
  }

  /** コース削除 */
  async deleteCourse(id: number): Promise<ApiResponse<any>> {
    const { data: res } = await this.client.delete(`/courses/${id}`)
    return res
  }

  /** ナレッジ作成 */
  async createKnowledge(data: KnowledgeFormData): Promise<ApiResponse<SapKnowledge>> {
    const { data: res } = await this.client.post('/knowledge', data)
    return res
  }

  /** ナレッジ更新 */
  async updateKnowledge(id: number, data: KnowledgeFormData): Promise<ApiResponse<SapKnowledge>> {
    const { data: res } = await this.client.put(`/knowledge/${id}`, data)
    return res
  }

  /** ナレッジ削除 */
  async deleteKnowledge(id: number): Promise<ApiResponse<any>> {
    const { data: res } = await this.client.delete(`/knowledge/${id}`)
    return res
  }

  /** レッスン削除 */
  async deleteLesson(id: number): Promise<ApiResponse<any>> {
    const { data: res } = await this.client.delete(`/lessons/${id}`)
    return res
  }

  /** レッスン作成 */
  async createLesson(data: any): Promise<ApiResponse<any>> {
    const { data: res } = await this.client.post('/lessons', data)
    return res
  }

  /** レッスン更新 */
  async updateLesson(id: number, data: any): Promise<ApiResponse<any>> {
    const { data: res } = await this.client.put(`/lessons/${id}`, data)
    return res
  }

  /** ステップ詳細 */
  async getStep(id: number): Promise<ApiResponse<any>> {
    const { data } = await this.client.get(`/steps/${id}`)
    return data
  }

  /** パス内ステップ一覧 */
  async getPathSteps(pathId: number): Promise<ApiResponse<any>> {
    const { data } = await this.client.get(`/learning-paths/${pathId}/steps`)
    return data
  }

  /** 今日 Quiz */
  async getTodayQuiz(): Promise<ApiResponse<Quiz>> {
    const { data } = await this.client.get('/quizzes/today')
    return data
  }

  /** 提交答案 */
  async submitQuizAnswer(quizId: number, answer: number): Promise<ApiResponse<any>> {
    const { data } = await this.client.post(`/quizzes/${quizId}/answer`, { answer })
    return data
  }

  /** 答题统计 */
  async getQuizStats(): Promise<ApiResponse<any>> {
    const { data } = await this.client.get('/quizzes/stats')
    return data
  }

  /** 案件列表 */
  async getCases(params?: Record<string, any>): Promise<ApiResponse<SapCase[]>> {
    const { data } = await this.client.get('/cases', { params })
    return data
  }

  /** 案件详情 */
  async getCase(id: number): Promise<ApiResponse<SapCase>> {
    const { data } = await this.client.get(`/cases/${id}`)
    return data
  }

  /** 投递案件 */
  async applyToCase(caseId: number, formData: FormData): Promise<ApiResponse<any>> {
    const { data } = await this.client.post(`/cases/${caseId}/apply`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  }

  /** 登录 */
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
    const { data } = await this.client.post('/auth/login', { email, password })
    if (data.success && data.data.token) {
      localStorage.setItem('sap_panda_token', data.data.token)
    }
    return data
  }

  /** 注册 */
  async register(userData: Record<string, any>): Promise<ApiResponse<any>> {
    const { data } = await this.client.post('/auth/register', userData)
    return data
  }

  /** Token 验证 */
  async validateToken(): Promise<ApiResponse<any>> {
    const { data } = await this.client.post('/auth/validate')
    return data
  }

  /** 获取用户信息 */
  async getMe(): Promise<ApiResponse<any>> {
    const { data } = await this.client.get('/users/me')
    return data
  }

  /** 更新用户 */
  async updateMe(userData: Record<string, any>): Promise<ApiResponse<any>> {
    const { data } = await this.client.put('/users/me', userData)
    return data
  }

  /** 积分 */
  async getPoints(): Promise<ApiResponse<any>> {
    const { data } = await this.client.get('/points')
    return data
  }

  /** 每日签到领取积分 */
  async claimDailyPoints(): Promise<ApiResponse<any>> {
    const { data } = await this.client.post('/points/daily')
    return data
  }

  /** 会員プラン一覧 */
  async getMembershipPlans(): Promise<ApiResponse<any>> {
    const { data } = await this.client.get('/membership/plans')
    return data
  }

  /** 会員登録 */
  async subscribeMembership(planId: number): Promise<ApiResponse<any>> {
    const { data } = await this.client.post('/membership/subscribe', { plan_id: planId })
    return data
  }

  /** 現在の会員情報 */
  async getCurrentMembership(): Promise<ApiResponse<any>> {
    const { data } = await this.client.get('/membership/current')
    return data
  }

  /** 收藏列表 */
  async getBookmarks(): Promise<ApiResponse<Article[]>> {
    const { data } = await this.client.get('/users/me/bookmarks')
    return data
  }

  /** 切换收藏 */
  async toggleBookmark(articleId: number): Promise<ApiResponse<any>> {
    const { data } = await this.client.post('/users/me/bookmarks', { article_id: articleId })
    return data
  }

  logout(): void {
    localStorage.removeItem('sap_panda_token')
  }

  getToken(): string | null {
    return localStorage.getItem('sap_panda_token')
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const api = new ApiService()
export default api
