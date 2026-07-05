var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.mjs";
import { useLocation, Navigate, Link, Outlet, useParams, useNavigate, useSearchParams, Routes, Route } from "react-router-dom";
import { createContext, useState, useCallback, useEffect, useContext, useRef, useMemo } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { ReactNodeViewRenderer, useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import { marked } from "marked";
import TurndownService from "turndown";
import { Node } from "@tiptap/core";
import { createPortal } from "react-dom";
const SAP_PANDA_DATA = typeof window !== "undefined" ? window.SAP_PANDA_DATA : void 0;
const SITE_BASE = (() => {
  if (typeof window === "undefined") {
    return process.env.SITE_BASE || "";
  }
  if (SAP_PANDA_DATA == null ? void 0 : SAP_PANDA_DATA.wpUrl) {
    try {
      return new URL(SAP_PANDA_DATA.wpUrl).pathname.replace(/\/+$/, "");
    } catch {
    }
  }
  const match = window.location.pathname.match(/^(\/[^/]+)\//);
  return match ? match[1] : "";
})();
const API_BASE = (() => {
  var _a;
  if (typeof window === "undefined") {
    return process.env.API_BASE || (process.env.SITE_BASE ? `${process.env.SITE_BASE}/wp-json/sap/v1` : "/wp-json/sap/v1");
  }
  return ((_a = SAP_PANDA_DATA == null ? void 0 : SAP_PANDA_DATA.restUrl) == null ? void 0 : _a.replace(/\/+$/, "")) || (SITE_BASE ? `${SITE_BASE}/wp-json/sap/v1` : "/wp-json/sap/v1");
})();
const p = (path) => SITE_BASE ? `${SITE_BASE}${path}` : path;
class ApiService {
  constructor() {
    __publicField(this, "client");
    this.client = axios.create({
      baseURL: API_BASE,
      headers: { "Content-Type": "application/json" },
      timeout: 15e3
    });
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("sap_panda_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        if (config.method === "get" || config.method === "GET") {
          config.params = { ...config.params, _token: token };
        }
      }
      return config;
    });
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        var _a;
        if (((_a = error.response) == null ? void 0 : _a.status) === 401) {
          localStorage.removeItem("sap_panda_token");
        }
        return Promise.reject(error);
      }
    );
  }
  /** 文章列表 */
  async getArticles(params) {
    const { data } = await this.client.get("/articles", { params });
    return data;
  }
  /** 文章详情 */
  async getArticle(id) {
    const { data } = await this.client.get(`/articles/${id}`);
    return data;
  }
  /** 热门文章 */
  async getPopularArticles(perPage = 10) {
    const { data } = await this.client.get("/articles/popular", { params: { per_page: perPage } });
    return data;
  }
  /** 搜索 */
  async searchArticles(q, params) {
    const { data } = await this.client.get("/articles/search", { params: { q, ...params } });
    return data;
  }
  /** 模块列表 */
  async getModules() {
    const { data } = await this.client.get("/modules");
    return data;
  }
  /** 模块文章 */
  async getModuleArticles(slug, params) {
    const { data } = await this.client.get(`/modules/${slug}/articles`, { params });
    return data;
  }
  /** 模块全部內容 (含文章/课程/知识/统计) */
  async getModuleContent(slug) {
    const { data } = await this.client.get(`/modules/${slug}/content`);
    return data;
  }
  /** 学習パス一覧 */
  async getLearningPaths() {
    const { data } = await this.client.get("/learning-paths");
    return data;
  }
  /** 学習パス詳細 */
  async getLearningPath(id) {
    const { data } = await this.client.get(`/learning-paths/${id}`);
    return data;
  }
  /** 学習パス作成 */
  async createLearningPath(form) {
    const { data } = await this.client.post("/learning-paths", form);
    return data;
  }
  /** 学習パス更新 */
  async updateLearningPath(id, form) {
    const { data } = await this.client.put(`/learning-paths/${id}`, form);
    return data;
  }
  /** 学習パス削除 */
  async deleteLearningPath(id) {
    const { data } = await this.client.delete(`/learning-paths/${id}`);
    return data;
  }
  /** 動画一覧 */
  async getVideos(params) {
    const { data } = await this.client.get("/videos", { params });
    return data;
  }
  /** 動画詳細 */
  async getVideo(id) {
    const { data } = await this.client.get(`/videos/${id}`);
    return data;
  }
  /** コース詳細 */
  async getCourse(id) {
    const { data } = await this.client.get(`/courses/${id}`);
    return data;
  }
  /** ナレッジ詳細 */
  async getKnowledge(id) {
    const { data } = await this.client.get(`/knowledge/${id}`);
    return data;
  }
  /** コース作成 */
  async createCourse(data) {
    const { data: res } = await this.client.post("/courses", data);
    return res;
  }
  /** コース更新 */
  async updateCourse(id, data) {
    const { data: res } = await this.client.put(`/courses/${id}`, data);
    return res;
  }
  /** コース削除 */
  async deleteCourse(id) {
    const { data: res } = await this.client.delete(`/courses/${id}`);
    return res;
  }
  /** ナレッジ作成 */
  async createKnowledge(data) {
    const { data: res } = await this.client.post("/knowledge", data);
    return res;
  }
  /** ナレッジ更新 */
  async updateKnowledge(id, data) {
    const { data: res } = await this.client.put(`/knowledge/${id}`, data);
    return res;
  }
  /** ナレッジ削除 */
  async deleteKnowledge(id) {
    const { data: res } = await this.client.delete(`/knowledge/${id}`);
    return res;
  }
  /** 记事列表 */
  async getNotes(params) {
    const { data } = await this.client.get("/notes", { params });
    return data;
  }
  /** 记事详情 */
  async getNote(id) {
    const { data } = await this.client.get(`/notes/${id}`);
    return data;
  }
  /** 记事作成 */
  async createNote(form) {
    const { data } = await this.client.post("/notes", form);
    return data;
  }
  /** 记事更新 */
  async updateNote(id, form) {
    const { data } = await this.client.put(`/notes/${id}`, form);
    return data;
  }
  /** 记事削除 */
  async deleteNote(id) {
    const { data: res } = await this.client.delete(`/notes/${id}`);
    return res;
  }
  /** レッスン削除 */
  async deleteLesson(id) {
    const { data: res } = await this.client.delete(`/lessons/${id}`);
    return res;
  }
  /** レッスン作成 */
  async createLesson(data) {
    const { data: res } = await this.client.post("/lessons", data);
    return res;
  }
  /** レッスン更新 */
  async updateLesson(id, data) {
    const { data: res } = await this.client.put(`/lessons/${id}`, data);
    return res;
  }
  /** ステップ詳細 */
  async getStep(id) {
    const { data } = await this.client.get(`/steps/${id}`);
    return data;
  }
  /** パス内ステップ一覧 */
  async getPathSteps(pathId) {
    const { data } = await this.client.get(`/learning-paths/${pathId}/steps`);
    return data;
  }
  /** 今日 Quiz */
  async getTodayQuiz() {
    const { data } = await this.client.get("/quizzes/today");
    return data;
  }
  /** 提交答案 */
  async submitQuizAnswer(quizId, answer) {
    const { data } = await this.client.post(`/quizzes/${quizId}/answer`, { answer });
    return data;
  }
  /** 答题统计 */
  async getQuizStats() {
    const { data } = await this.client.get("/quizzes/stats");
    return data;
  }
  /** 案件列表 */
  async getCases(params) {
    const { data } = await this.client.get("/cases", { params });
    return data;
  }
  /** 案件详情 */
  async getCase(id) {
    const { data } = await this.client.get(`/cases/${id}`);
    return data;
  }
  /** 投递案件 */
  async applyToCase(caseId, formData) {
    const { data } = await this.client.post(`/cases/${caseId}/apply`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
  }
  /** 登录 */
  async login(email, password) {
    const { data } = await this.client.post("/auth/login", { email, password });
    if (data.success && data.data.token) {
      localStorage.setItem("sap_panda_token", data.data.token);
    }
    return data;
  }
  /** 注册 */
  async register(userData) {
    const { data } = await this.client.post("/auth/register", userData);
    return data;
  }
  /** Token 验证 */
  async validateToken() {
    const { data } = await this.client.post("/auth/validate");
    return data;
  }
  /** 获取用户信息 */
  async getMe() {
    const { data } = await this.client.get("/users/me");
    return data;
  }
  /** 更新用户 */
  async updateMe(userData) {
    const { data } = await this.client.put("/users/me", userData);
    return data;
  }
  /** 积分 */
  async getPoints() {
    const { data } = await this.client.get("/points");
    return data;
  }
  /** 每日签到领取积分 */
  async claimDailyPoints() {
    const { data } = await this.client.post("/points/daily");
    return data;
  }
  /** 会員プラン一覧 */
  async getMembershipPlans() {
    const { data } = await this.client.get("/membership/plans");
    return data;
  }
  /** 会員登録 */
  async subscribeMembership(planId) {
    const { data } = await this.client.post("/membership/subscribe", { plan_id: planId });
    return data;
  }
  /** 現在の会員情報 */
  async getCurrentMembership() {
    const { data } = await this.client.get("/membership/current");
    return data;
  }
  /** 收藏列表 */
  async getBookmarks() {
    const { data } = await this.client.get("/users/me/bookmarks");
    return data;
  }
  /** 切换收藏 */
  async toggleBookmark(articleId) {
    const { data } = await this.client.post("/users/me/bookmarks", { article_id: articleId });
    return data;
  }
  logout() {
    localStorage.removeItem("sap_panda_token");
  }
  getToken() {
    return localStorage.getItem("sap_panda_token");
  }
  isAuthenticated() {
    return !!this.getToken();
  }
}
const api = new ApiService();
const AuthContext = createContext(null);
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchUser = useCallback(async () => {
    if (!api.isAuthenticated()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.getMe();
      if (res.success && res.data) {
        const d = res.data;
        setUser({
          id: d.id,
          email: d.email,
          displayName: d.display_name,
          description: d.description || "",
          url: d.url || "",
          avatarUrl: d.avatar_url,
          roles: d.roles || [],
          memberSince: d.member_since,
          stats: d.stats || {
            articlesRead: 0,
            quizzesAnswered: 0,
            quizAccuracy: 0,
            points: 0,
            bookmarks: 0
          }
        });
      }
    } catch {
      api.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  const login = async (email, password) => {
    var _a, _b;
    setError(null);
    setLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.success) {
        await fetchUser();
        return true;
      }
      setError(res.message || "ログインに失敗しました。");
      return false;
    } catch (e) {
      setError(((_b = (_a = e.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "サーバーエラーが発生しました。");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const register = async (email, password, displayName) => {
    var _a, _b;
    setError(null);
    setLoading(true);
    try {
      const res = await api.register({ email, password, display_name: displayName });
      if (res.success) {
        return await login(email, password);
      }
      setError(res.message || "登録に失敗しました。");
      return false;
    } catch (e) {
      setError(((_b = (_a = e.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "サーバーエラーが発生しました。");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    api.logout();
    setUser(null);
  };
  const updateProfile = async (data) => {
    setLoading(true);
    try {
      const res = await api.updateMe({
        display_name: data.displayName,
        description: data.description,
        url: data.url
      });
      if (res.success) {
        await fetchUser();
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value: { user, loading, error, login, register, logout, refreshUser: fetchUser, updateProfile }, children });
}
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
const MENU_GROUPS = [
  {
    label: "ダッシュボード",
    icon: "📊",
    children: [
      { path: "/admin", label: "統計概覧", icon: "📊" }
    ]
  },
  {
    label: "マスター管理",
    icon: "📋",
    children: [
      { path: "/admin/modules", label: "モジュール管理", icon: "🧩" },
      { path: "/admin/articles", label: "記事管理", icon: "📰" }
    ]
  },
  {
    label: "ラーニング管理",
    icon: "📚",
    children: [
      { path: "/admin/courses", label: "コース管理", icon: "📚" },
      { path: "/admin/lessons", label: "レッスン", icon: "📝" },
      { path: "/admin/knowledge", label: "ナレッジ管理", icon: "📖" },
      { path: "/admin/videos", label: "動画管理", icon: "🎬" },
      { path: "/admin/quizzes", label: "每日一问", icon: "❓" },
      { path: "/admin/learning-paths", label: "学習パス", icon: "🎯" },
      { path: "/admin/notes", label: "记事", icon: "📝" }
    ]
  },
  {
    label: "ビジネス管理",
    icon: "💼",
    children: [
      { path: "/admin/cases", label: "案件管理", icon: "💼" },
      { path: "/admin/applications", label: "応募管理", icon: "📋" },
      { path: "/admin/contact", label: "お問い合わせ", icon: "📨" }
    ]
  },
  {
    label: "システム管理",
    icon: "⚙",
    children: [
      { path: "/admin/pages", label: "固定ページ", icon: "📄" },
      { path: "/admin/users", label: "ユーザー管理", icon: "👥" },
      { path: "/admin/plugins", label: "プラグイン", icon: "🔌" },
      { path: "/admin/seo-geo", label: "SEO/GEO", icon: "🔍" }
    ]
  }
];
function NavGroup({ group, currentPath }) {
  const [open, setOpen] = useState(
    group.children.some((c) => currentPath.startsWith(c.path))
  );
  const activeCount = group.children.filter((c) => currentPath.startsWith(c.path)).length;
  return /* @__PURE__ */ jsxs("div", { style: { marginBottom: 6 }, children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: () => setOpen(!open),
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          padding: "8px 14px",
          borderRadius: 10,
          fontSize: 12,
          fontWeight: 700,
          color: activeCount > 0 ? "#8bc9a0" : "rgba(255,255,255,0.5)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          transition: "color .12s",
          userSelect: "none"
        },
        children: [
          /* @__PURE__ */ jsx("span", { style: { fontSize: 11 }, children: open ? "▾" : "▸" }),
          /* @__PURE__ */ jsx("span", { children: group.label })
        ]
      }
    ),
    open && /* @__PURE__ */ jsx("div", { style: { paddingLeft: 8 }, children: group.children.map((item) => {
      const active = currentPath.startsWith(item.path);
      return /* @__PURE__ */ jsxs(
        Link,
        {
          to: item.path,
          style: {
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 14px",
            borderRadius: 10,
            color: active ? "#8bc9a0" : "rgba(255,255,255,0.65)",
            textDecoration: "none",
            fontSize: 13.5,
            fontWeight: active ? 600 : 500,
            background: active ? "rgba(90,157,110,0.2)" : "transparent",
            transition: "all .12s",
            marginBottom: 1
          },
          onMouseEnter: (e) => {
            if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          },
          onMouseLeave: (e) => {
            if (!active) e.currentTarget.style.background = "transparent";
          },
          children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: 16, width: 22, textAlign: "center", flexShrink: 0 }, children: item.icon }),
            /* @__PURE__ */ jsx("span", { children: item.label })
          ]
        },
        item.path
      );
    }) })
  ] });
}
function AdminLayout() {
  var _a;
  const { user, loading } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);
  if (loading) return /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--bg-0)", color: "var(--ink-3)" }, children: "読み込み中..." });
  if (!user) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true });
  }
  if (!((_a = user.roles) == null ? void 0 : _a.includes("administrator"))) {
    return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--bg-0)", color: "var(--ink-2)", padding: 40, textAlign: "center" }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontSize: 64, marginBottom: 16 }, children: "🚫" }),
      /* @__PURE__ */ jsx("h2", { style: { fontFamily: "var(--font-display)", fontSize: 22, color: "var(--ink-0)", margin: "0 0 8px" }, children: "アクセス権限がありません" }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: 14, margin: "0 0 20px", maxWidth: 360 }, children: "この管理画面には管理者のみアクセスできます。" }),
      /* @__PURE__ */ jsx(Link, { to: "/", className: "btn", style: { textDecoration: "none" }, children: "トップページに戻る" })
    ] });
  }
  const currentPath = location.pathname;
  return /* @__PURE__ */ jsxs("div", { className: "admin-shell", children: [
    /* @__PURE__ */ jsx("button", { className: "admin-mobile-toggle", onClick: () => setSidebarOpen((prev) => !prev), "aria-label": "メニュー", children: sidebarOpen ? "✕" : "☰" }),
    sidebarOpen && /* @__PURE__ */ jsx("div", { className: "admin-overlay", onClick: () => setSidebarOpen(false) }),
    /* @__PURE__ */ jsxs("aside", { className: `admin-sidebar${sidebarOpen ? " admin-sidebar--open" : ""}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-sidebar-head", children: [
        /* @__PURE__ */ jsx(Link, { to: "/admin/courses", className: "admin-logo", children: "🎋 SAP Panda" }),
        /* @__PURE__ */ jsx("span", { className: "admin-badge", children: "管理" })
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "admin-nav", style: { padding: "8px 10px", overflowY: "auto", flex: 1 }, children: MENU_GROUPS.map((group) => /* @__PURE__ */ jsx(NavGroup, { group, currentPath }, group.label)) }),
      /* @__PURE__ */ jsxs("div", { className: "admin-sidebar-footer", children: [
        /* @__PURE__ */ jsxs("div", { className: "admin-user", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: user.avatarUrl || "",
              alt: user.displayName,
              className: "admin-avatar",
              onError: (e) => {
                e.target.style.display = "none";
              }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "admin-user-info", children: [
            /* @__PURE__ */ jsx("div", { className: "admin-user-name", children: user.displayName }),
            /* @__PURE__ */ jsx("div", { className: "admin-user-role", children: "管理者" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/", className: "admin-back-link", children: "← サイトに戻る" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("main", { className: "admin-main", children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] });
}
function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  if (totalPages <= 11) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    const start = Math.max(2, page - 5);
    const end = Math.min(totalPages - 1, page + 5);
    if (start > 2) pages.push("dots");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("dots");
    pages.push(totalPages);
  }
  return /* @__PURE__ */ jsxs("div", { className: "admin-pagination", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "admin-btn admin-btn-sm",
        disabled: page <= 1,
        onClick: () => onChange(page - 1),
        children: "← 前へ"
      }
    ),
    /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 4, alignItems: "center" }, children: pages.map(
      (p2, i) => p2 === "dots" ? /* @__PURE__ */ jsx("span", { style: { fontSize: 12, color: "var(--ink-3)", padding: "0 2px", userSelect: "none" }, children: "…" }, `dots-${i}`) : /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onChange(p2),
          className: "admin-btn admin-btn-sm",
          style: {
            minWidth: 34,
            justifyContent: "center",
            background: p2 === page ? "var(--accent)" : "",
            color: p2 === page ? "white" : "",
            borderColor: p2 === page ? "var(--accent)" : ""
          },
          children: p2
        },
        p2
      )
    ) }),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "admin-btn admin-btn-sm",
        disabled: page >= totalPages,
        onClick: () => onChange(page + 1),
        children: "次へ →"
      }
    ),
    /* @__PURE__ */ jsxs("span", { style: { fontSize: 12, color: "var(--ink-3)", marginLeft: 8 }, children: [
      page,
      " / ",
      totalPages,
      " ページ"
    ] })
  ] });
}
function exportToExcel(data, columns, filename) {
  const rows = data.map((item) => {
    const row = {};
    columns.forEach((col) => {
      row[col.label] = item[col.key] ?? "";
    });
    return row;
  });
  const ws = XLSX.utils.json_to_sheet(rows);
  if (columns.some((c) => c.width)) {
    ws["!cols"] = columns.map((c) => ({ wch: c.width || 20 }));
  }
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${filename}.xlsx`);
}
function readExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      var _a;
      try {
        const data = new Uint8Array((_a = e.target) == null ? void 0 : _a.result);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        if (!ws) {
          reject(new Error("シートが見つかりません"));
          return;
        }
        const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
        resolve({ data: json, errors: [] });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("ファイル読み込み失敗"));
    reader.readAsArrayBuffer(file);
  });
}
function downloadTemplate(columns, filename) {
  const row = {};
  columns.forEach((col) => {
    row[col.label] = "";
  });
  const ws = XLSX.utils.json_to_sheet([row]);
  if (columns.some((c) => c.width)) {
    ws["!cols"] = columns.map((c) => ({ wch: c.width || 20 }));
  }
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");
  XLSX.writeFile(wb, `${filename}_template.xlsx`);
}
function ImportModal({ columns, templateFilename, onImport, onClose }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState([]);
  const fileRef = useRef(null);
  const handleFile = async (f) => {
    setFile(f);
    try {
      const { data } = await readExcelFile(f);
      setPreview(data.slice(0, 5));
    } catch {
      setPreview([]);
    }
  };
  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const { data } = await readExcelFile(file);
      const res = await onImport(data);
      setResult(res);
    } catch (err) {
      setResult({ success: 0, failed: preview.length || 1, errors: [{ row: 0, message: err.message || "不明なエラー" }] });
    }
    setLoading(false);
  };
  return /* @__PURE__ */ jsx("div", { className: "admin-overlay", onClick: onClose, children: /* @__PURE__ */ jsx("div", { className: "admin-modal", style: { maxWidth: 560 }, onClick: (e) => e.stopPropagation(), children: !result ? /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "admin-modal-head", children: [
      /* @__PURE__ */ jsx("h3", { children: "📥 Excel インポート" }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, style: { background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--ink-3)" }, children: "×" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "admin-modal-body", children: [
      /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: "var(--ink-2)", margin: "0 0 16px", lineHeight: 1.7 }, children: "Excelファイル（.xlsx）をアップロードして一括インポートします。 1行目がヘッダー行として扱われます。" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "admin-btn admin-btn-sm",
          onClick: () => downloadTemplate(columns, templateFilename),
          style: { marginBottom: 16 },
          children: "📄 テンプレートをダウンロード"
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: () => {
            var _a;
            return (_a = fileRef.current) == null ? void 0 : _a.click();
          },
          style: {
            border: "2px dashed var(--line-2)",
            borderRadius: "var(--r-md)",
            padding: 32,
            textAlign: "center",
            cursor: "pointer",
            background: file ? "var(--accent-soft)" : "var(--bg-1)",
            transition: "all .15s",
            marginBottom: 16
          },
          children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: fileRef,
                type: "file",
                accept: ".xlsx,.xls",
                hidden: true,
                onChange: (e) => {
                  var _a;
                  return ((_a = e.target.files) == null ? void 0 : _a[0]) && handleFile(e.target.files[0]);
                }
              }
            ),
            file ? /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { style: { fontSize: 24, marginBottom: 4 }, children: "✅" }),
              /* @__PURE__ */ jsx("div", { style: { fontWeight: 600, fontSize: 14 }, children: file.name }),
              /* @__PURE__ */ jsxs("div", { style: { fontSize: 12, color: "var(--ink-3)" }, children: [
                (file.size / 1024).toFixed(1),
                " KB"
              ] })
            ] }) : /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { style: { fontSize: 32, marginBottom: 8 }, children: "📂" }),
              /* @__PURE__ */ jsx("div", { style: { fontWeight: 600, fontSize: 14 }, children: "クリックしてファイルを選択" }),
              /* @__PURE__ */ jsx("div", { style: { fontSize: 12, color: "var(--ink-3)" }, children: ".xlsx 形式" })
            ] })
          ]
        }
      ),
      preview.length > 0 && /* @__PURE__ */ jsxs("div", { style: { fontSize: 12, color: "var(--ink-2)", marginBottom: 6 }, children: [
        "プレビュー（先頭",
        preview.length,
        "行）:"
      ] }),
      preview.length > 0 && /* @__PURE__ */ jsx("div", { style: { overflowX: "auto", marginBottom: 16, border: "1px solid var(--line-1)", borderRadius: "var(--r-sm)" }, children: /* @__PURE__ */ jsxs("table", { style: { width: "100%", fontSize: 11, borderCollapse: "collapse" }, children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { style: { background: "var(--bg-tint)" }, children: Object.keys(preview[0]).map((k) => /* @__PURE__ */ jsx("th", { style: { padding: "4px 8px", textAlign: "left", whiteSpace: "nowrap", fontWeight: 600 }, children: k }, k)) }) }),
        /* @__PURE__ */ jsx("tbody", { children: preview.map((row, i) => /* @__PURE__ */ jsx("tr", { style: { borderTop: "1px solid var(--line-1)" }, children: Object.values(row).map((v, j) => /* @__PURE__ */ jsx("td", { style: { padding: "4px 8px", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: String(v).slice(0, 40) }, j)) }, i)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "admin-modal-actions", children: [
      /* @__PURE__ */ jsx("button", { className: "admin-btn", onClick: onClose, children: "キャンセル" }),
      /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-primary", onClick: handleImport, disabled: !file || loading, children: loading ? "インポート中..." : "インポート実行" })
    ] })
  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "admin-modal-head", children: [
      /* @__PURE__ */ jsx("h3", { children: "📋 インポート結果" }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, style: { background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--ink-3)" }, children: "×" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", padding: "20px 0" }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontSize: 40, marginBottom: 8 }, children: result.failed === 0 ? "✅" : "⚠️" }),
      /* @__PURE__ */ jsxs("div", { style: { fontSize: 16, fontWeight: 700, marginBottom: 8 }, children: [
        result.success,
        " 件成功 / ",
        result.failed,
        " 件失敗"
      ] }),
      result.errors.length > 0 && /* @__PURE__ */ jsx("div", { style: { textAlign: "left", fontSize: 12, color: "var(--rose)", maxHeight: 150, overflowY: "auto", background: "var(--rose-soft)", borderRadius: "var(--r-sm)", padding: 12, marginTop: 12 }, children: result.errors.map((e, i) => /* @__PURE__ */ jsxs("div", { style: { marginBottom: 4 }, children: [
        "行",
        e.row,
        ": ",
        e.message
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "admin-modal-actions", children: /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-primary", onClick: onClose, children: "閉じる" }) })
  ] }) }) });
}
function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showImport, setShowImport] = useState(false);
  const perPage = 20;
  const COURSE_COLUMNS = [
    { key: "id", label: "ID", width: 8 },
    { key: "title", label: "タイトル", width: 40 },
    { key: "module_name", label: "モジュール", width: 15 },
    { key: "difficulty_name", label: "難易度", width: 10 },
    { key: "price", label: "価格", width: 10 },
    { key: "duration", label: "時間", width: 10 },
    { key: "instructor", label: "講師", width: 15 },
    { key: "excerpt", label: "説明", width: 50 },
    { key: "status", label: "ステータス", width: 10 },
    { key: "created_at", label: "作成日", width: 15 },
    { key: "updated_at", label: "更新日", width: 15 }
  ];
  const handleExport = async () => {
    try {
      const { data } = await api.client.get("/courses", { params: { per_page: 9999 } });
      const items = data.success ? data.data || [] : [];
      const rows = items.map((c) => {
        var _a, _b, _c, _d;
        return {
          id: c.id,
          title: c.title,
          module_name: ((_a = c.module) == null ? void 0 : _a.name) || "",
          difficulty_name: ((_b = c.difficulty) == null ? void 0 : _b.name) || "",
          price: c.price || 0,
          duration: c.duration || "",
          instructor: c.instructor || "",
          excerpt: (c.excerpt || "").replace(/<[^>]*>/g, ""),
          status: c.status || "publish",
          created_at: ((_c = c.created_at) == null ? void 0 : _c.slice(0, 10)) || "",
          updated_at: ((_d = c.updated_at) == null ? void 0 : _d.slice(0, 10)) || ""
        };
      });
      exportToExcel(rows, COURSE_COLUMNS, `コース一覧_全${rows.length}件_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`);
    } catch {
    }
  };
  const handleImport = async (rows) => {
    var _a, _b, _c;
    let success = 0;
    let failed = 0;
    const errors = [];
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const rowNum = i + 2;
      if (!((_a = r["タイトル"]) == null ? void 0 : _a.trim())) {
        failed++;
        errors.push({ row: rowNum, message: "タイトルが空です" });
        continue;
      }
      try {
        await api.client.post("/courses", { title: r["タイトル"], price: parseInt(r["価格"] || "0"), duration: r["時間"] || "" });
        success++;
      } catch (e) {
        failed++;
        errors.push({ row: rowNum, message: ((_c = (_b = e.response) == null ? void 0 : _b.data) == null ? void 0 : _c.message) || "保存失敗" });
      }
    }
    if (success > 0) fetchCourses();
    return { success, failed, errors };
  };
  const fetchCourses = () => {
    setLoading(true);
    api.client.get("/courses", { params: { per_page: perPage, page, q: search || void 0 } }).then(({ data }) => {
      if (data.success) {
        setCourses(data.data || []);
        setTotal(data.total || 0);
      }
    }).catch(() => {
    }).finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchCourses();
  }, [page]);
  useEffect(() => {
    setSelectedIds([]);
  }, [page]);
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCourses();
  };
  const handleBatchStatus = async (statusStr) => {
    for (const id of selectedIds) {
      try {
        await api.client.put(`/courses/${id}`, { status: statusStr });
      } catch {
      }
    }
    setCourses((prev) => prev.map((i) => selectedIds.includes(i.id) ? { ...i, status: statusStr } : i));
    setSelectedIds([]);
  };
  const paginated = courses;
  const allSelected = paginated.length > 0 && paginated.every((i) => selectedIds.includes(i.id));
  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? paginated.map((i) => i.id) : []);
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await api.deleteCourse(deleteId);
      if (res.success) {
        setCourses((prev) => prev.filter((c) => c.id !== deleteId));
        setTotal((prev) => Math.max(0, prev - 1));
      }
    } catch {
    }
    setDeleting(false);
    setDeleteId(null);
  };
  const totalPages = Math.ceil(total / perPage);
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsxs("div", { className: "admin-page-head", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { children: "コース管理" }),
        /* @__PURE__ */ jsxs("p", { className: "admin-page-desc", children: [
          "全 ",
          total,
          " 件のコース"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsx("button", { className: "admin-btn", onClick: handleExport, children: "📤 エクスポート" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn", onClick: () => setShowImport(true), children: "📥 インポート" }),
        /* @__PURE__ */ jsx(Link, { to: "/admin/courses/new", className: "admin-btn admin-btn-primary", children: "+ 新規コース" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { className: "admin-search-bar", onSubmit: handleSearch, children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          className: "admin-input",
          placeholder: "コースを検索...",
          value: search,
          onChange: (e) => setSearch(e.target.value)
        }
      ),
      /* @__PURE__ */ jsx("button", { type: "submit", className: "admin-btn", children: "検索" })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "読み込み中..." }) : courses.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "admin-empty", children: [
      /* @__PURE__ */ jsx("div", { className: "admin-empty-icon", children: "🎋" }),
      /* @__PURE__ */ jsx("p", { children: "まだコースがありません" }),
      /* @__PURE__ */ jsx(Link, { to: "/admin/courses/new", className: "admin-btn admin-btn-primary", children: "最初のコースを作成" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "admin-table-wrap", children: /* @__PURE__ */ jsxs("table", { className: "admin-table", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { style: { width: 36 }, children: /* @__PURE__ */ jsx("input", { type: "checkbox", onChange: (e) => handleSelectAll(e.target.checked), checked: allSelected }) }),
          /* @__PURE__ */ jsx("th", { children: "タイトル" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-mobile", children: "モジュール" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-mobile", children: "難易度" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-tablet", children: "価格" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-tablet", children: "時間" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-tablet col-hide-mobile", children: "更新日" }),
          /* @__PURE__ */ jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: courses.map((c) => {
          var _a;
          return /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "col-hide-mobile", children: /* @__PURE__ */ jsx("input", { type: "checkbox", checked: selectedIds.includes(c.id), onChange: (e) => setSelectedIds((prev) => e.target.checked ? [...prev, c.id] : prev.filter((id) => id !== c.id)) }) }),
            /* @__PURE__ */ jsx("td", { className: "admin-cell-title", children: c.title }),
            /* @__PURE__ */ jsx("td", { className: "col-hide-mobile", children: ((_a = c.module) == null ? void 0 : _a.name) || "—" }),
            /* @__PURE__ */ jsx("td", { className: "col-hide-mobile", children: c.difficulty ? /* @__PURE__ */ jsx("span", { className: `admin-diff-lv l${c.difficulty.slug === "beginner" ? 1 : c.difficulty.slug === "intermediate" ? 2 : 3}`, children: c.difficulty.name }) : "—" }),
            /* @__PURE__ */ jsx("td", { className: "col-hide-tablet", children: c.price > 0 ? `¥${c.price.toLocaleString()}` : "無料" }),
            /* @__PURE__ */ jsx("td", { className: "col-hide-tablet", children: c.duration || "—" }),
            /* @__PURE__ */ jsx("td", { className: "admin-cell-date col-hide-tablet col-hide-mobile", children: new Date(c.updated_at || c.created_at).toLocaleDateString("ja-JP") }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: "admin-actions", children: [
              /* @__PURE__ */ jsx(Link, { to: `/admin/courses/${c.id}/edit`, className: "admin-btn admin-btn-sm", children: "編集" }),
              /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm admin-btn-danger", onClick: () => setDeleteId(c.id), children: "削除" })
            ] }) })
          ] }, c.id);
        }) })
      ] }) }),
      selectedIds.length > 0 && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "var(--accent-soft)", borderRadius: "var(--r-md)", marginTop: 8 }, children: [
        /* @__PURE__ */ jsxs("span", { style: { fontSize: 13, fontWeight: 600, color: "var(--accent-deep)" }, children: [
          selectedIds.length,
          " 件選択中"
        ] }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm admin-btn-primary", onClick: () => handleBatchStatus("publish"), children: "公開する" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => handleBatchStatus("draft"), children: "下書きにする" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => setSelectedIds([]), style: { marginLeft: "auto" }, children: "解除" })
      ] }),
      totalPages > 1 && /* @__PURE__ */ jsx(Pagination, { page, totalPages, onChange: (p2) => setPage(p2) })
    ] }),
    showImport && /* @__PURE__ */ jsx(
      ImportModal,
      {
        columns: COURSE_COLUMNS,
        templateFilename: "コースインポート",
        onImport: handleImport,
        onClose: () => {
          setShowImport(false);
          fetchCourses();
        }
      }
    ),
    deleteId && /* @__PURE__ */ jsx("div", { className: "admin-overlay", onClick: () => !deleting && setDeleteId(null), children: /* @__PURE__ */ jsxs("div", { className: "admin-modal", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsx("h3", { children: "コースを削除しますか？" }),
      /* @__PURE__ */ jsx("p", { children: "この操作は取り消せません。削除されたコースはゴミ箱に移動されます。" }),
      /* @__PURE__ */ jsxs("div", { className: "admin-modal-actions", children: [
        /* @__PURE__ */ jsx("button", { className: "admin-btn", onClick: () => setDeleteId(null), disabled: deleting, children: "キャンセル" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-danger", onClick: handleDelete, disabled: deleting, children: deleting ? "削除中..." : "削除する" })
      ] })
    ] }) })
  ] });
}
const _b64 = (svg) => {
  const min = svg.replace(/>\s+</g, "><").trim();
  return `data:image/svg+xml;base64,${btoa(min)}`;
};
const _PANDA = `<svg width="48" height="48" viewBox="-4 -8 108 108" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="52" r="46" fill="#e8f0fb" opacity="0.4" /><path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" /><g><path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" /><path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" /></g><circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" /><circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" /><ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" /><path d="M 43 70 Q 50 74 57 70" fill="#1a1612" /></svg>`;
const _TARO = `<svg width="48" height="48" viewBox="-4 -8 108 108" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="52" r="46" fill="#e8f0fb" opacity="0.4" /><path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" /><g><path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" /><path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" /></g><ellipse cx="58" cy="64" rx="5" ry="3" fill="#f4b8c4" opacity="0.6" /><circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" /><circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" /><ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" /><path d="M 46 70 Q 50 74 54 70" fill="#1a1612" /></svg>`;
const PANDA_IMG = _b64(_PANDA);
const TARO_IMG = _b64(_TARO);
const DialogNodeView = ({ node, updateAttributes, deleteNode, editor }) => {
  const who = node.attrs.who;
  const text = node.attrs.text;
  const isStudent = who === "taro";
  const name = isStudent ? "たろうくん" : "パンダ先生";
  const handleBlur = (e) => {
    const newText = e.currentTarget.textContent || "";
    updateAttributes({ text: newText });
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `dialog ${isStudent ? "student" : ""}`,
      style: {
        margin: "14px 0",
        padding: "14px 16px",
        background: "#f8f6ef",
        borderRadius: 10,
        border: "1px solid #e0d8c8",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        position: "relative",
        transition: "box-shadow 0.15s"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.boxShadow = "0 0 0 2px #b8d4e8";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.boxShadow = "none";
      },
      children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: isStudent ? TARO_IMG : PANDA_IMG,
            alt: name,
            style: { width: 48, height: 48, flexShrink: 0, display: "block" }
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ jsx("strong", { style: { color: "#8a7a5a", fontSize: 12.5, display: "block", marginBottom: 2 }, children: name }),
          /* @__PURE__ */ jsx(
            "div",
            {
              contentEditable: true,
              suppressContentEditableWarning: true,
              onBlur: handleBlur,
              onKeyDown: handleKeyDown,
              style: {
                outline: "none",
                minHeight: 24,
                fontSize: 14,
                lineHeight: 1.6,
                color: "#333",
                cursor: "text",
                borderRadius: 4,
                padding: "2px 4px",
                transition: "background 0.12s"
              },
              children: text || "セリフを入力"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              deleteNode();
            },
            style: {
              position: "absolute",
              top: 4,
              right: 6,
              border: "none",
              background: "rgba(0,0,0,0.05)",
              cursor: "pointer",
              color: "#999",
              fontSize: 16,
              width: 24,
              height: 24,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              transition: "opacity 0.15s"
            },
            className: "dialog-delete-btn",
            title: "削除",
            children: "×"
          }
        )
      ]
    }
  );
};
const DialogExtension = Node.create({
  name: "dialog",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      who: {
        default: "panda",
        parseHTML: (el) => el.classList.contains("student") ? "taro" : "panda"
      },
      text: {
        default: "",
        parseHTML: (el) => {
          var _a;
          const bubble = el.querySelector(".bubble");
          if (!bubble) return "";
          return ((_a = bubble.textContent) == null ? void 0 : _a.replace(/^[^：]*：\s*/, "").trim()) || "";
        }
      }
    };
  },
  parseHTML() {
    return [{ tag: "div.dialog" }];
  },
  renderHTML({ node }) {
    const who = node.attrs.who || "panda";
    const text = node.attrs.text || "";
    const isStudent = who === "taro";
    const name = isStudent ? "たろうくん" : "パンダ先生";
    const src = isStudent ? TARO_IMG : PANDA_IMG;
    const div = document.createElement("div");
    div.className = `dialog${isStudent ? " student" : ""}`;
    div.innerHTML = `<div class="av"><img src="${src}" alt="${name}" width="48" height="48" /></div><div class="bubble"><span class="who">${name}：</span>${text}</div>`;
    return div;
  },
  addNodeView() {
    return ReactNodeViewRenderer(DialogNodeView);
  }
});
const lowlight = createLowlight(common);
const turndownService = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
const PANDA_SVG = `<svg width="48" height="48" viewBox="-4 -8 108 108"><circle cx="50" cy="52" r="46" fill="#e8f0fb" opacity="0.4" /><path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" /><g><path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" /><path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" /></g><circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" /><circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" /><ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" /><path d="M 43 70 Q 50 74 57 70" fill="#1a1612" /></svg>`;
const TARO_SVG = `<svg width="48" height="48" viewBox="-4 -8 108 108"><circle cx="50" cy="52" r="46" fill="#e8f0fb" opacity="0.4" /><path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" /><g><path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" /><path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" /></g><ellipse cx="58" cy="64" rx="5" ry="3" fill="#f4b8c4" opacity="0.6" /><circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" /><circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" /><ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" /><path d="M 46 70 Q 50 74 54 70" fill="#1a1612" /></svg>`;
const DIALOG_HTML = {
  panda: `<div class="dialog"><div class="av">${PANDA_SVG}</div><div class="bubble"><span class="who">パンダ先生：</span>ここにセリフを入力</div></div>`,
  taro: `<div class="dialog student"><div class="av">${TARO_SVG}</div><div class="bubble"><span class="who">たろうくん：</span>ここにセリフを入力</div></div>`
};
const TEXT_COLORS = ["#000000", "#333333", "#666666", "#999999", "#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3c78d8", "#674ea7", "#a64d79"];
const BG_COLORS = ["#ffffff", "#f3f3f3", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc", "#dddddd", "#cccccc"];
function HtmlEditor({ value: initialValue, onChange, placeholder }) {
  const [mode, setMode] = useState("visual");
  const [htmlSource, setHtmlSource] = useState(initialValue);
  const [mdSource, setMdSource] = useState("");
  const [colorPicker, setColorPicker] = useState(null);
  const textAreaRef = useRef(null);
  const contentRef = useRef(initialValue);
  const prevValueRef = useRef(initialValue);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false
      }),
      Placeholder.configure({ placeholder: placeholder || "コンテンツを入力..." }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" }
      }),
      ImageExtension,
      Subscript,
      Superscript,
      CodeBlockLowlight.configure({ lowlight }),
      DialogExtension
    ],
    content: initialValue,
    onUpdate: ({ editor: editor2 }) => {
      const html = editor2.getHTML();
      contentRef.current = html;
      onChange(html);
    }
  });
  useEffect(() => {
    if (!editor) return;
    if (prevValueRef.current === initialValue) return;
    prevValueRef.current = initialValue;
    if (initialValue !== contentRef.current) {
      contentRef.current = initialValue;
      if (mode === "visual") {
        editor.commands.setContent(initialValue);
      } else if (mode === "html") {
        setHtmlSource(initialValue);
      } else {
        try {
          setMdSource(turndownService.turndown(initialValue));
        } catch {
          setMdSource(initialValue);
        }
      }
    }
  }, [initialValue, editor, mode]);
  const handleModeChange = useCallback((newMode) => {
    if (newMode === mode || !editor) return;
    if (newMode === "html") {
      const html = formatHtml(contentRef.current);
      setHtmlSource(html);
      onChange(contentRef.current);
    } else if (newMode === "markdown") {
      try {
        const md = turndownService.turndown(contentRef.current);
        setMdSource(md);
      } catch {
        setMdSource(contentRef.current);
      }
      onChange(contentRef.current);
    } else if (newMode === "visual") {
      const html = mode === "html" ? htmlSource : marked.parse(mdSource, { async: false });
      editor.commands.setContent(html);
      contentRef.current = html;
      onChange(html);
    }
    setMode(newMode);
    setColorPicker(null);
    if (newMode !== "visual") {
      setTimeout(() => {
        var _a;
        return (_a = textAreaRef.current) == null ? void 0 : _a.focus();
      }, 50);
    }
  }, [mode, editor, htmlSource, mdSource, onChange]);
  const handleImageUpload = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      var _a, _b;
      const file = (_a = input.files) == null ? void 0 : _a[0];
      if (!file || !editor) return;
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await fetch(`${API_BASE}/media/upload`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${localStorage.getItem("sap_panda_token") || ""}` },
          body: formData
        });
        const json = await res.json();
        if (json.success && ((_b = json.data) == null ? void 0 : _b.url)) {
          editor.chain().focus().setImage({ src: json.data.url }).run();
        } else {
          alert(json.message || "アップロードに失敗しました。");
        }
      } catch {
        alert("画像のアップロード中にエラーが発生しました。");
      }
    };
  }, [editor]);
  const insertDialog = useCallback((who) => {
    var _a;
    if (!editor) return;
    const { selection } = editor.state;
    const node = (_a = editor.schema.nodes.dialog) == null ? void 0 : _a.create({ who, text: "" });
    if (!node) return;
    editor.chain().focus().insertContentAt(selection.head, node).run();
  }, [editor]);
  const handleLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href || "";
    const url = window.prompt("リンクURLを入力してください", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().toggleLink({ href: url, target: "_blank" }).run();
  }, [editor]);
  const handleHtmlChange = (val) => {
    setHtmlSource(val);
    contentRef.current = val;
    onChange(val);
  };
  const handleMdChange = (val) => {
    setMdSource(val);
    try {
      const html = marked.parse(val, { async: false });
      contentRef.current = html;
      onChange(html);
    } catch {
    }
  };
  const insertHtmlAtCursor = (html) => {
    const ta = textAreaRef.current;
    if (!ta) {
      const fallback = htmlSource + "\n" + html + "\n";
      handleHtmlChange(fallback);
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const newVal = htmlSource.substring(0, start) + html + htmlSource.substring(end);
    handleHtmlChange(newVal);
    requestAnimationFrame(() => {
      ta.setSelectionRange(start + html.length, start + html.length);
      ta.focus();
    });
  };
  const toggleColorPicker = (type) => {
    setColorPicker((prev) => prev === type ? null : type);
  };
  const applyColor = (type, color) => {
    if (!editor) return;
    if (type === "text") {
      editor.chain().focus().setColor(color).run();
    } else {
      editor.chain().focus().toggleHighlight({ color }).run();
    }
    setColorPicker(null);
  };
  function formatHtml(html) {
    const tab2 = "  ";
    let result = "";
    let indent = 0;
    const pres = [];
    html = html.replace(/<pre[\s>][\s\S]*?<\/pre>/gi, (m) => {
      pres.push(m);
      return `\0PRE${pres.length - 1}\0`;
    });
    html = html.replace(/<code[\s>][\s\S]*?<\/code>/gi, (m) => {
      pres.push(m);
      return `\0PRE${pres.length - 1}\0`;
    });
    html = html.replace(/>\s*</g, ">\n<");
    const lines = html.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (/^<\//.test(trimmed)) indent = Math.max(0, indent - 1);
      result += tab2.repeat(indent) + trimmed + "\n";
      if (/^<[^/?!][^>]*>[^<]*$/.test(trimmed) && !/\/>$/.test(trimmed) && !/^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i.test(trimmed.replace(/<([a-z]+).*/i, "$1"))) indent++;
    }
    result = result.replace(/\x00PRE(\d+)\x00/g, (_, i) => pres[parseInt(i)]);
    return result.trim();
  }
  const isActive = (name, attrs) => (editor == null ? void 0 : editor.isActive(name, attrs)) ?? false;
  const tb = (label, action, active) => {
    const isOn = active ?? false;
    return /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: action,
        title: label,
        style: {
          padding: "4px 8px",
          fontSize: 13,
          fontWeight: isOn ? 700 : 400,
          cursor: "pointer",
          border: "none",
          background: isOn ? "#d4e4f7" : "transparent",
          color: isOn ? "#1a5b9c" : "#444",
          borderRadius: 4,
          fontFamily: "inherit",
          whiteSpace: "nowrap",
          transition: "all 0.1s"
        },
        onMouseEnter: (e) => {
          if (!isOn) e.currentTarget.style.background = "#eee";
        },
        onMouseLeave: (e) => {
          if (!isOn) e.currentTarget.style.background = "transparent";
        },
        children: label
      },
      label
    );
  };
  useEffect(() => {
    return () => {
      editor == null ? void 0 : editor.destroy();
    };
  }, [editor]);
  const tab = (active) => ({
    padding: "8px 18px",
    fontSize: 12.5,
    fontWeight: active ? 700 : 500,
    cursor: "pointer",
    border: "none",
    background: active ? "var(--bg-card)" : "transparent",
    color: active ? "var(--accent-deep)" : "var(--ink-2)",
    borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
    fontFamily: "inherit",
    transition: "all 0.12s"
  });
  const darkBtn = {
    padding: "4px 10px",
    fontSize: 11.5,
    background: "#2a2b3e",
    color: "#a9b1d6",
    border: "1px solid #3a3b4e",
    borderRadius: 4,
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap"
  };
  const styles = {
    bar: { display: "flex", gap: 0, marginBottom: 0, borderBottom: "1px solid var(--line-2)", background: "var(--bg-1)" },
    textarea: { width: "100%", minHeight: 360, padding: 16, fontFamily: "'JetBrains Mono', 'SF Mono', 'Consolas', monospace", fontSize: 13, lineHeight: 1.7, border: "none", outline: "none", resize: "vertical", background: "#1a1b26", color: "#a9b1d6", tabSize: 2 }
  };
  return /* @__PURE__ */ jsxs("div", { className: "html-editor", style: { border: "1px solid var(--line-2)", borderRadius: "var(--r-md)", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxs("div", { style: styles.bar, children: [
      /* @__PURE__ */ jsx("button", { style: tab(mode === "visual"), onClick: () => handleModeChange("visual"), type: "button", children: "✏️ ビジュアル" }),
      /* @__PURE__ */ jsxs("button", { style: tab(mode === "html"), onClick: () => handleModeChange("html"), type: "button", children: [
        "</>",
        " HTML"
      ] }),
      /* @__PURE__ */ jsx("button", { style: tab(mode === "markdown"), onClick: () => handleModeChange("markdown"), type: "button", children: "📝 Markdown" }),
      /* @__PURE__ */ jsx("span", { style: { marginLeft: "auto", padding: "8px 14px", fontSize: 11, color: "var(--ink-3)" }, children: mode === "visual" ? "TipTap WYSIWYG" : mode === "html" ? "HTML" : "Markdown" })
    ] }),
    mode === "visual" && editor && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 4, padding: "6px 10px", background: "#fcf8ee", borderBottom: "1px solid rgba(60,45,20,0.15)", alignItems: "center", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsx("span", { style: { fontSize: 11.5, fontWeight: 600, color: "#8a7a5a", marginRight: 4 }, children: "吹き出し：" }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => insertDialog("panda"), style: { padding: "4px 12px", fontSize: 12, background: "#fdfaf2", color: "#5a4a2a", border: "1px solid #d4c8a8", borderRadius: 4, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }, children: "🐼 パンダ先生" }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => insertDialog("taro"), style: { padding: "4px 12px", fontSize: 12, background: "#fdfaf2", color: "#5a4a2a", border: "1px solid #d4c8a8", borderRadius: 4, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }, children: "👨‍💻 たろうくん" }),
        /* @__PURE__ */ jsx("span", { style: { flex: 1 } }),
        /* @__PURE__ */ jsx("span", { style: { fontSize: 11, color: "#aaa", marginRight: 8 }, children: "吹き出し内のテキストをクリックして編集" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        gap: 2,
        padding: "6px 8px",
        background: "#f8f8f8",
        borderBottom: "1px solid #e0e0e0",
        flexWrap: "wrap",
        alignItems: "center"
      }, children: [
        tb("見出し1", () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive("heading", { level: 1 })),
        tb("見出し2", () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive("heading", { level: 2 })),
        tb("見出し3", () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive("heading", { level: 3 })),
        /* @__PURE__ */ jsx("div", { style: { width: 1, height: 20, background: "#ddd", margin: "0 4px" } }),
        tb("B", () => editor.chain().focus().toggleBold().run(), isActive("bold")),
        tb("I", () => editor.chain().focus().toggleItalic().run(), isActive("italic")),
        tb("U", () => editor.chain().focus().toggleUnderline().run(), isActive("underline")),
        tb("S", () => editor.chain().focus().toggleStrike().run(), isActive("strike")),
        /* @__PURE__ */ jsx("div", { style: { width: 1, height: 20, background: "#ddd", margin: "0 4px" } }),
        tb("x₁", () => editor.chain().focus().toggleSubscript().run(), isActive("subscript")),
        tb("x¹", () => editor.chain().focus().toggleSuperscript().run(), isActive("superscript")),
        /* @__PURE__ */ jsx("div", { style: { width: 1, height: 20, background: "#ddd", margin: "0 4px" } }),
        tb("•", () => editor.chain().focus().toggleBulletList().run(), isActive("bulletList")),
        tb("1.", () => editor.chain().focus().toggleOrderedList().run(), isActive("orderedList")),
        /* @__PURE__ */ jsx("div", { style: { width: 1, height: 20, background: "#ddd", margin: "0 4px" } }),
        tb("❝", () => editor.chain().focus().toggleBlockquote().run(), isActive("blockquote")),
        tb("<>", () => editor.chain().focus().toggleCodeBlock().run(), isActive("codeBlock")),
        /* @__PURE__ */ jsx("div", { style: { width: 1, height: 20, background: "#ddd", margin: "0 4px" } }),
        tb("⬅", () => editor.chain().focus().setTextAlign("left").run(), isActive("textAlign", { textAlign: "left" })),
        tb("≡", () => editor.chain().focus().setTextAlign("center").run(), isActive("textAlign", { textAlign: "center" })),
        tb("➡", () => editor.chain().focus().setTextAlign("right").run(), isActive("textAlign", { textAlign: "right" })),
        /* @__PURE__ */ jsx("div", { style: { width: 1, height: 20, background: "#ddd", margin: "0 4px" } }),
        /* @__PURE__ */ jsxs("div", { style: { position: "relative", display: "inline-block" }, children: [
          tb("A", () => toggleColorPicker("text"), colorPicker === "text"),
          colorPicker === "text" && /* @__PURE__ */ jsx("div", { style: {
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 100,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 6,
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            width: 168,
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)"
          }, children: TEXT_COLORS.map((c) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => applyColor("text", c),
              style: { width: 24, height: 24, background: c, border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" },
              title: c
            },
            c
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { position: "relative", display: "inline-block" }, children: [
          tb("■", () => toggleColorPicker("bg"), colorPicker === "bg"),
          colorPicker === "bg" && /* @__PURE__ */ jsx("div", { style: {
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 100,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 6,
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            width: 168,
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)"
          }, children: BG_COLORS.map((c) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => applyColor("bg", c),
              style: { width: 24, height: 24, background: c, border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" },
              title: c
            },
            c
          )) })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { width: 1, height: 20, background: "#ddd", margin: "0 4px" } }),
        tb("🔗", () => handleLink(), isActive("link")),
        tb("🖼", () => handleImageUpload()),
        /* @__PURE__ */ jsx("div", { style: { width: 1, height: 20, background: "#ddd", margin: "0 4px" } }),
        tb("↩", () => editor.chain().focus().undo().run()),
        tb("↪", () => editor.chain().focus().redo().run()),
        tb("✕", () => editor.chain().focus().unsetAllMarks().run())
      ] }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            padding: 0,
            minHeight: 340,
            cursor: "text"
          },
          onClick: () => editor.commands.focus(),
          children: [
            /* @__PURE__ */ jsx("style", { children: `
              .tiptap-editor .ProseMirror {
                min-height: 340px;
                padding: 14px 16px;
                outline: none;
                line-height: 1.85;
                font-size: 14px;
                font-family: "Noto Sans JP", system-ui, sans-serif;
              }
              .tiptap-editor .ProseMirror p { margin: 0 0 8px; }
              .tiptap-editor .ProseMirror h1 { font-size: 1.5em; font-weight: 700; margin: 16px 0 8px; }
              .tiptap-editor .ProseMirror h2 { font-size: 1.25em; font-weight: 700; margin: 14px 0 6px; }
              .tiptap-editor .ProseMirror h3 { font-size: 1.1em; font-weight: 600; margin: 12px 0 4px; }
              .tiptap-editor .ProseMirror ul, .tiptap-editor .ProseMirror ol { padding-left: 24px; margin: 4px 0; }
              .tiptap-editor .ProseMirror blockquote {
                border-left: 3px solid #ccc;
                margin: 8px 0;
                padding: 4px 12px;
                color: #666;
                font-style: italic;
              }
              .tiptap-editor .ProseMirror pre {
                background: #1a1b26;
                color: #a9b1d6;
                padding: 12px;
                border-radius: 6px;
                font-family: "JetBrains Mono", monospace;
                font-size: 13px;
                overflow-x: auto;
                margin: 8px 0;
              }
              .tiptap-editor .ProseMirror code {
                font-family: "JetBrains Mono", monospace;
                font-size: 0.9em;
                background: #f0f0f0;
                padding: 1px 4px;
                border-radius: 3px;
              }
              .tiptap-editor .ProseMirror pre code { background: transparent; padding: 0; }
              .tiptap-editor .ProseMirror img { max-width: 100%; height: auto; border-radius: 4px; margin: 8px 0; }
              .tiptap-editor .ProseMirror a { color: #1a73e8; cursor: pointer; }
              .tiptap-editor .ProseMirror a:hover { text-decoration: underline; }
              .tiptap-editor .ProseMirror hr { margin: 16px 0; border: none; border-top: 1px solid #ddd; }
              .tiptap-editor .ProseMirror p.is-editor-empty:first-child::before {
                color: #adb5bd;
                content: attr(data-placeholder);
                float: left;
                height: 0;
                pointer-events: none;
              }
              /* Dialog node in editor */
              .tiptap-editor .ProseMirror div.dialog:hover .dialog-delete-btn { opacity: 1 !important; }
              /* Lowlight code highlighting */
              .tiptap-editor .ProseMirror .hljs-keyword { color: #bb9af7; }
              .tiptap-editor .ProseMirror .hljs-string { color: #9ece6a; }
              .tiptap-editor .ProseMirror .hljs-number { color: #ff9e64; }
              .tiptap-editor .ProseMirror .hljs-comment { color: #565f89; font-style: italic; }
              .tiptap-editor .ProseMirror .hljs-function { color: #7aa2f7; }
              .tiptap-editor .ProseMirror .hljs-built_in { color: #e0af68; }
              .tiptap-editor .ProseMirror .hljs-attr { color: #73daca; }
            ` }),
            /* @__PURE__ */ jsx("div", { className: "tiptap-editor", children: /* @__PURE__ */ jsx(EditorContent, { editor }) })
          ]
        }
      )
    ] }),
    mode === "html" && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", background: "#1a1b26", borderBottom: "1px solid #2a2b3e" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 4 }, children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => insertHtmlAtCursor(DIALOG_HTML.panda), style: darkBtn, children: "🐼 パンダ先生" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => insertHtmlAtCursor(DIALOG_HTML.taro), style: darkBtn, children: "👨‍💻 たろうくん" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setHtmlSource(formatHtml(htmlSource)),
            style: { padding: "4px 12px", fontSize: 11.5, background: "#2a2b3e", color: "#a9b1d6", border: "1px solid #3a3b4e", borderRadius: 4, cursor: "pointer", fontFamily: "inherit" },
            children: "🔄 フォーマット"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          ref: textAreaRef,
          style: styles.textarea,
          value: htmlSource,
          onChange: (e) => handleHtmlChange(e.target.value),
          placeholder: "HTML を直接入力...",
          spellCheck: false
        }
      )
    ] }),
    mode === "markdown" && /* @__PURE__ */ jsx(
      "textarea",
      {
        ref: textAreaRef,
        style: styles.textarea,
        value: mdSource,
        onChange: (e) => handleMdChange(e.target.value),
        placeholder: "Markdown で入力（自動的に HTML に変換されます）...",
        spellCheck: false
      }
    )
  ] });
}
const SAP_MODULES = [
  { slug: "fi", code: "FI", name_ja: "財務会計", name_en: "Financial Accounting", description: "会計帳簿、決算、勘定科目。経理担当が触る一番大事な土台。", color: "#2f6d44", bg_color: "#d8ead9", article_count: 48, levels: ["初級", "中級", "上級"] },
  { slug: "co", code: "CO", name_ja: "管理会計", name_en: "Controlling", description: "原価計算、利益分析、予算管理。社内意思決定に効く。", color: "#2641a1", bg_color: "#dde4fc", article_count: 32, levels: ["初級", "中級"] },
  { slug: "mm", code: "MM", name_ja: "購買・在庫", name_en: "Material Management", description: "購買依頼から入庫まで。サプライチェーンの心臓部。", color: "#a25411", bg_color: "#fde0c2", article_count: 41, levels: ["初級", "中級", "上級"] },
  { slug: "sd", code: "SD", name_ja: "販売管理", name_en: "Sales & Distribution", description: "受注、出荷、請求。お客様への流れをぜんぶ管理。", color: "#b62a4a", bg_color: "#ffdfe6", article_count: 36, levels: ["初級", "中級", "上級"] },
  { slug: "pp", code: "PP", name_ja: "生産計画", name_en: "Production Planning", description: "MRP、BOM、製造指示。工場の動きをコントロール。", color: "#4828a8", bg_color: "#e4dffb", article_count: 22, levels: ["中級", "上級"] },
  { slug: "hr", code: "HR", name_ja: "人事管理", name_en: "Human Resources", description: "人事マスタ、給与、勤怠。SuccessFactorsとの連携も。", color: "#8a6212", bg_color: "#fee9b3", article_count: 18, levels: ["初級", "中級"] },
  { slug: "abap", code: "ABAP", name_ja: "開発言語", name_en: "ABAP", description: "SAP独自の開発言語。アドオン、レポート、機能拡張に。", color: "#1f6f6f", bg_color: "#cfecec", article_count: 54, levels: ["初級", "中級", "上級"] },
  { slug: "basis", code: "Basis", name_ja: "基盤管理", name_en: "Basis", description: "システム運用、権限、パッチ。SAPの裏方。", color: "#4a432d", bg_color: "#e3e1d8", article_count: 26, levels: ["中級", "上級"] },
  { slug: "s4", code: "S/4", name_ja: "S/4HANA", name_en: "Next-gen ERP", description: "次世代ERP。Fiori UI、HANA DB、シンプリフィケーション。", color: "#1864a3", bg_color: "#d1ecf9", article_count: 39, levels: ["初級", "中級", "上級"] }
];
const NAV_LINKS = [
  { id: "home", label: "ホーム", href: "/" },
  { id: "modules", label: "モジュール", href: "/modules" },
  { id: "paths", label: "学習パス", href: "/paths" },
  { id: "quiz", label: "今日の一問", href: "/quiz-page" },
  { id: "cases", label: "案件・仕事", href: "/cases" },
  { id: "yt", label: "動画", href: "/video" }
];
const LEARNING_PATHS = [
  {
    id: 1,
    audience: "新人さん向け",
    title: "SAPって何？からはじめる入門コース",
    description: "初日からつまずきがちな用語と基本フローをやさしく整理。3週間で全体像をつかむ。",
    steps: [
      { title: "SAPの世界観を知る", time: "20 min" },
      { title: "GUI 操作の基本", time: "30 min" },
      { title: "マスタとトランザクション", time: "40 min" },
      { title: "はじめての仕訳入力", time: "45 min" }
    ],
    duration: "約 3 週間 · 12 本",
    accent: "#5a9d6e"
  },
  {
    id: 2,
    audience: "コンサル中級",
    title: "プロジェクトで通用する設計力",
    description: "Fit/Gap、業務プロセス設計、カスタマイズ判断。経験 1〜3 年目のあなたに。",
    steps: [
      { title: "要件定義の進め方", time: "50 min" },
      { title: "組織構造の設計", time: "60 min" },
      { title: "マスタ設計のコツ", time: "45 min" },
      { title: "テストシナリオ作成", time: "40 min" }
    ],
    duration: "約 6 週間 · 18 本",
    accent: "#d97548"
  },
  {
    id: 3,
    audience: "開発者向け",
    title: "ABAP × S/4HANA モダン開発",
    description: "CDS Views、AMDP、RAP — 新世代の ABAP 開発作法をパンダ先生と一緒に。",
    steps: [
      { title: "モダン ABAP 構文", time: "40 min" },
      { title: "CDS Views 入門", time: "55 min" },
      { title: "OData サービス公開", time: "50 min" },
      { title: "Fiori 連携の基礎", time: "60 min" }
    ],
    duration: "約 8 週間 · 24 本",
    accent: "#d96570"
  }
];
const TOP10 = [
  "【保存版】SAP用語集 — はじめての100単語",
  "BAPI とは何か、なぜ使うのか — 5分で理解",
  "Fiori vs SAP GUI — 結局どう使い分ける？",
  "T-Code 早見表（よく使う 50 個）",
  "ABAP オブジェクト指向 完全入門",
  "MMの移動タイプ、覚えるならこの10個",
  "S/4HANA 1909 → 2023 アップグレード手順",
  "新人コンサルが最初に読むべき本ベスト5",
  "BW/4HANA で BI 案件に挑戦するには",
  "パンダ先生に聞く：転職タイミングの見極め方"
];
const DIFFICULTIES$3 = [
  { slug: "beginner", name: "初級" },
  { slug: "intermediate", name: "中級" },
  { slug: "advanced", name: "上級" }
];
function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    module: "",
    difficulty: "",
    price: 0,
    duration: ""
  });
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getCourse(parseInt(id)).then((res) => {
      var _a, _b;
      if (res.success && res.data) {
        const c = res.data;
        setForm({
          title: c.title || "",
          excerpt: c.excerpt || "",
          content: c.content || "",
          module: ((_a = c.module) == null ? void 0 : _a.slug) || "",
          difficulty: ((_b = c.difficulty) == null ? void 0 : _b.slug) || "",
          price: c.price || 0,
          duration: c.duration || ""
        });
      }
    }).catch(() => setError("コースの取得に失敗しました。")).finally(() => setLoading(false));
  }, [id]);
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("タイトルは必須です。");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (isEdit) {
        const res = await api.updateCourse(parseInt(id), form);
        if (res.success) navigate("/admin/courses");
        else setError(res.message || "更新に失敗しました。");
      } else {
        const res = await api.createCourse(form);
        if (res.success) navigate("/admin/courses");
        else setError(res.message || "作成に失敗しました。");
      }
    } catch {
      setError("サーバーエラーが発生しました。");
    } finally {
      setSaving(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "admin-page", children: /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "読み込み中..." }) });
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsx("div", { className: "admin-page-head", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-crumb", children: [
        /* @__PURE__ */ jsx(Link, { to: "/admin/courses", children: "コース管理" }),
        /* @__PURE__ */ jsx("span", { className: "sep", children: " › " }),
        /* @__PURE__ */ jsx("span", { children: isEdit ? "編集" : "新規作成" })
      ] }),
      /* @__PURE__ */ jsx("h1", { children: isEdit ? "コースを編集" : "新規コース作成" })
    ] }) }),
    error && /* @__PURE__ */ jsx("div", { className: "admin-error", children: error }),
    /* @__PURE__ */ jsxs("form", { className: "admin-form", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsxs("label", { className: "admin-label", children: [
            "タイトル ",
            /* @__PURE__ */ jsx("span", { className: "admin-required", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "admin-input",
              value: form.title,
              onChange: (e) => handleChange("title", e.target.value),
              placeholder: "コースタイトル",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "摘録" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "admin-input admin-textarea",
              value: form.excerpt,
              onChange: (e) => handleChange("excerpt", e.target.value),
              placeholder: "短い説明文",
              rows: 3
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "内容" }),
          /* @__PURE__ */ jsx(HtmlEditor, { value: form.content, onChange: (v) => handleChange("content", v), placeholder: "コース内容を入力..." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "メタ情報" }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-row", children: [
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "モジュール" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: "admin-input",
                value: form.module,
                onChange: (e) => handleChange("module", e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "選択なし" }),
                  SAP_MODULES.map((m) => /* @__PURE__ */ jsxs("option", { value: m.slug, children: [
                    m.code,
                    " · ",
                    m.name_ja
                  ] }, m.slug))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "難易度" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: "admin-input",
                value: form.difficulty,
                onChange: (e) => handleChange("difficulty", e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "選択なし" }),
                  DIFFICULTIES$3.map((d) => /* @__PURE__ */ jsx("option", { value: d.slug, children: d.name }, d.slug))
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-row", children: [
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "価格 (円)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                className: "admin-input",
                value: form.price,
                onChange: (e) => handleChange("price", parseInt(e.target.value) || 0),
                min: 0
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "所要時間" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "admin-input",
                value: form.duration,
                onChange: (e) => handleChange("duration", e.target.value),
                placeholder: "例: 3 weeks"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-actions", children: [
        /* @__PURE__ */ jsx(Link, { to: "/admin/courses", className: "admin-btn", children: "キャンセル" }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "admin-btn admin-btn-primary", disabled: saving, children: saving ? "保存中..." : isEdit ? "更新する" : "作成する" })
      ] })
    ] })
  ] });
}
const TYPE_LABELS$1 = {
  concept: "概念",
  tcode: "T-Code",
  best_practice: "ベストプラクティス",
  glossary: "SAP用語集",
  faq: "SAP FAQ",
  tcode_dict: "TCode辞典",
  error_code: "錯誤コード庫",
  config_guide: "配置指南",
  tutorial: "教程",
  interview: "面接題",
  career: "転職指南",
  special: "專題分類"
};
function KnowledgeList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showImport, setShowImport] = useState(false);
  const perPage = 20;
  const KNOWLEDGE_COLUMNS = [
    { key: "id", label: "ID", width: 8 },
    { key: "title", label: "タイトル", width: 40 },
    { key: "type_name", label: "タイプ", width: 15 },
    { key: "module_name", label: "モジュール", width: 15 },
    { key: "difficulty_name", label: "難易度", width: 10 },
    { key: "excerpt", label: "内容", width: 50 },
    { key: "status", label: "ステータス", width: 10 },
    { key: "created_at", label: "作成日", width: 15 },
    { key: "updated_at", label: "更新日", width: 15 }
  ];
  const handleExport = async () => {
    try {
      const { data } = await api.client.get("/knowledge", { params: { per_page: 9999 } });
      const items2 = data.success ? data.data || [] : [];
      const rows = items2.map((k) => {
        var _a, _b, _c, _d;
        return {
          id: k.id,
          title: k.title,
          type_name: k.type || "",
          module_name: ((_a = k.module) == null ? void 0 : _a.name) || "",
          difficulty_name: ((_b = k.difficulty) == null ? void 0 : _b.name) || "",
          excerpt: (k.excerpt || "").replace(/<[^>]*>/g, ""),
          status: k.status || "publish",
          created_at: ((_c = k.created_at) == null ? void 0 : _c.slice(0, 10)) || "",
          updated_at: ((_d = k.updated_at) == null ? void 0 : _d.slice(0, 10)) || ""
        };
      });
      exportToExcel(rows, KNOWLEDGE_COLUMNS, `ナレッジ一覧_全${rows.length}件_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`);
    } catch {
    }
  };
  const handleImport = async (rows) => {
    var _a, _b, _c;
    let success = 0;
    let failed = 0;
    const errors = [];
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const rowNum = i + 2;
      if (!((_a = r["タイトル"]) == null ? void 0 : _a.trim())) {
        failed++;
        errors.push({ row: rowNum, message: "タイトルが空です" });
        continue;
      }
      try {
        await api.client.post("/knowledge", { title: r["タイトル"], excerpt: r["内容"] || "" });
        success++;
      } catch (e) {
        failed++;
        errors.push({ row: rowNum, message: ((_c = (_b = e.response) == null ? void 0 : _b.data) == null ? void 0 : _c.message) || "保存失敗" });
      }
    }
    if (success > 0) fetchItems();
    return { success, failed, errors };
  };
  const fetchItems = () => {
    setLoading(true);
    api.client.get("/knowledge", { params: { per_page: perPage, page, q: search || void 0, type: typeFilter || void 0, module: moduleFilter || void 0 } }).then(({ data }) => {
      if (data.success) {
        setItems(data.data || []);
        setTotal(data.total || 0);
      }
    }).catch(() => {
    }).finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchItems();
  }, [page, typeFilter, moduleFilter]);
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchItems();
  };
  const handleBatchStatus = async (statusStr) => {
    for (const id of selectedIds) {
      try {
        await api.client.put(`/knowledge/${id}`, { status: statusStr });
      } catch {
      }
    }
    setItems((prev) => prev.map((i) => selectedIds.includes(i.id) ? { ...i, status: statusStr } : i));
    setSelectedIds([]);
  };
  const paginated = items;
  const allSelected = paginated.length > 0 && paginated.every((i) => selectedIds.includes(i.id));
  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? paginated.map((i) => i.id) : []);
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await api.deleteKnowledge(deleteId);
      if (res.success) {
        setItems((prev) => prev.filter((k) => k.id !== deleteId));
        setTotal((prev) => Math.max(0, prev - 1));
      }
    } catch {
    }
    setDeleting(false);
    setDeleteId(null);
  };
  useEffect(() => {
    setSelectedIds([]);
  }, [page]);
  const totalPages = Math.ceil(total / perPage);
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsxs("div", { className: "admin-page-head", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { children: "ナレッジ管理" }),
        /* @__PURE__ */ jsxs("p", { className: "admin-page-desc", children: [
          "全 ",
          total,
          " 件のナレッジ"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsx("button", { className: "admin-btn", onClick: handleExport, children: "📤 エクスポート" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn", onClick: () => setShowImport(true), children: "📥 インポート" }),
        /* @__PURE__ */ jsx(Link, { to: "/admin/knowledge/new", className: "admin-btn admin-btn-primary", children: "+ 新規ナレッジ" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { className: "admin-search-bar", onSubmit: handleSearch, children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          className: "admin-input",
          placeholder: "ナレッジを検索...",
          value: search,
          onChange: (e) => setSearch(e.target.value)
        }
      ),
      /* @__PURE__ */ jsxs(
        "select",
        {
          className: "admin-input admin-input-sm",
          value: typeFilter,
          onChange: (e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          },
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "すべてのタイプ" }),
            Object.entries(TYPE_LABELS$1).map(([k, v]) => /* @__PURE__ */ jsx("option", { value: k, children: v }, k))
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "select",
        {
          className: "admin-input admin-input-sm",
          value: moduleFilter,
          onChange: (e) => {
            setModuleFilter(e.target.value);
            setPage(1);
          },
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "すべてのモジュール" }),
            SAP_MODULES.map((m) => /* @__PURE__ */ jsx("option", { value: m.slug, children: m.code }, m.slug))
          ]
        }
      ),
      /* @__PURE__ */ jsx("button", { type: "submit", className: "admin-btn", children: "検索" })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "読み込み中..." }) : items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "admin-empty", children: [
      /* @__PURE__ */ jsx("div", { className: "admin-empty-icon", children: "🎋" }),
      /* @__PURE__ */ jsx("p", { children: "まだナレッジがありません" }),
      /* @__PURE__ */ jsx(Link, { to: "/admin/knowledge/new", className: "admin-btn admin-btn-primary", children: "最初のナレッジを作成" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "admin-table-wrap", children: /* @__PURE__ */ jsxs("table", { className: "admin-table", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { style: { width: 36 }, children: /* @__PURE__ */ jsx("input", { type: "checkbox", onChange: (e) => handleSelectAll(e.target.checked), checked: allSelected }) }),
          /* @__PURE__ */ jsx("th", { children: "タイトル" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-tablet col-hide-mobile", children: "タイプ" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-mobile", children: "モジュール" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-mobile", children: "難易度" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-tablet col-hide-mobile", children: "更新日" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-mobile", children: "ステータス" }),
          /* @__PURE__ */ jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: items.map((k) => {
          var _a;
          return /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("input", { type: "checkbox", checked: selectedIds.includes(k.id), onChange: (e) => setSelectedIds((prev) => e.target.checked ? [...prev, k.id] : prev.filter((id) => id !== k.id)) }) }),
            /* @__PURE__ */ jsx("td", { className: "admin-cell-title", children: k.title }),
            /* @__PURE__ */ jsx("td", { children: k.type ? /* @__PURE__ */ jsx("span", { className: "admin-type-badge", children: TYPE_LABELS$1[k.type] || k.type }) : "—" }),
            /* @__PURE__ */ jsx("td", { children: ((_a = k.module) == null ? void 0 : _a.name) || "—" }),
            /* @__PURE__ */ jsx("td", { children: k.difficulty ? /* @__PURE__ */ jsx("span", { className: `admin-diff-lv l${k.difficulty.slug === "beginner" ? 1 : k.difficulty.slug === "intermediate" ? 2 : 3}`, children: k.difficulty.name }) : "—" }),
            /* @__PURE__ */ jsx("td", { className: "admin-cell-date", children: new Date(k.updated_at || k.created_at).toLocaleDateString("ja-JP") }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: "admin-actions", children: [
              /* @__PURE__ */ jsx(Link, { to: `/admin/knowledge/${k.id}/edit`, className: "admin-btn admin-btn-sm", children: "編集" }),
              /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm admin-btn-danger", onClick: () => setDeleteId(k.id), children: "削除" })
            ] }) })
          ] }, k.id);
        }) })
      ] }) }),
      selectedIds.length > 0 && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "var(--accent-soft)", borderRadius: "var(--r-md)", marginTop: 8 }, children: [
        /* @__PURE__ */ jsxs("span", { style: { fontSize: 13, fontWeight: 600, color: "var(--accent-deep)" }, children: [
          selectedIds.length,
          " 件選択中"
        ] }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm admin-btn-primary", onClick: () => handleBatchStatus("publish"), children: "公開する" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => handleBatchStatus("draft"), children: "下書きにする" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => setSelectedIds([]), style: { marginLeft: "auto" }, children: "解除" })
      ] }),
      totalPages > 1 && /* @__PURE__ */ jsx(Pagination, { page, totalPages, onChange: (p2) => setPage(p2) })
    ] }),
    showImport && /* @__PURE__ */ jsx(ImportModal, { columns: KNOWLEDGE_COLUMNS, templateFilename: "ナレッジインポート", onImport: handleImport, onClose: () => {
      setShowImport(false);
      fetchItems();
    } }),
    deleteId && /* @__PURE__ */ jsx("div", { className: "admin-overlay", onClick: () => !deleting && setDeleteId(null), children: /* @__PURE__ */ jsxs("div", { className: "admin-modal", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsx("h3", { children: "ナレッジを削除しますか？" }),
      /* @__PURE__ */ jsx("p", { children: "この操作は取り消せません。削除されたナレッジはゴミ箱に移動されます。" }),
      /* @__PURE__ */ jsxs("div", { className: "admin-modal-actions", children: [
        /* @__PURE__ */ jsx("button", { className: "admin-btn", onClick: () => setDeleteId(null), disabled: deleting, children: "キャンセル" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-danger", onClick: handleDelete, disabled: deleting, children: deleting ? "削除中..." : "削除する" })
      ] })
    ] }) })
  ] });
}
const KNOWLEDGE_TYPES = [
  { slug: "concept", name: "概念" },
  { slug: "tcode", name: "T-Code" },
  { slug: "best_practice", name: "ベストプラクティス" },
  { slug: "glossary", name: "SAP用語集" },
  { slug: "faq", name: "SAP FAQ" },
  { slug: "tcode_dict", name: "TCode辞典" },
  { slug: "error_code", name: "錯誤コード庫" },
  { slug: "config_guide", name: "配置指南" },
  { slug: "tutorial", name: "教程" },
  { slug: "interview", name: "面接題" },
  { slug: "career", name: "転職指南" },
  { slug: "special", name: "專題分類" }
];
const DIFFICULTIES$2 = [
  { slug: "beginner", name: "初級" },
  { slug: "intermediate", name: "中級" },
  { slug: "advanced", name: "上級" }
];
function KnowledgeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    module: "",
    type: "",
    difficulty: ""
  });
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getKnowledge(parseInt(id)).then((res) => {
      var _a, _b;
      if (res.success && res.data) {
        const k = res.data;
        setForm({
          title: k.title || "",
          excerpt: k.excerpt || "",
          content: k.content || "",
          module: ((_a = k.module) == null ? void 0 : _a.slug) || "",
          type: k.type || "",
          difficulty: ((_b = k.difficulty) == null ? void 0 : _b.slug) || ""
        });
      }
    }).catch(() => setError("ナレッジの取得に失敗しました。")).finally(() => setLoading(false));
  }, [id]);
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("タイトルは必須です。");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (isEdit) {
        const res = await api.updateKnowledge(parseInt(id), form);
        if (res.success) navigate("/admin/knowledge");
        else setError(res.message || "更新に失敗しました。");
      } else {
        const res = await api.createKnowledge(form);
        if (res.success) navigate("/admin/knowledge");
        else setError(res.message || "作成に失敗しました。");
      }
    } catch {
      setError("サーバーエラーが発生しました。");
    } finally {
      setSaving(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "admin-page", children: /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "読み込み中..." }) });
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsx("div", { className: "admin-page-head", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-crumb", children: [
        /* @__PURE__ */ jsx(Link, { to: "/admin/knowledge", children: "ナレッジ管理" }),
        /* @__PURE__ */ jsx("span", { className: "sep", children: " › " }),
        /* @__PURE__ */ jsx("span", { children: isEdit ? "編集" : "新規作成" })
      ] }),
      /* @__PURE__ */ jsx("h1", { children: isEdit ? "ナレッジを編集" : "新規ナレッジ作成" })
    ] }) }),
    error && /* @__PURE__ */ jsx("div", { className: "admin-error", children: error }),
    /* @__PURE__ */ jsxs("form", { className: "admin-form", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsxs("label", { className: "admin-label", children: [
            "タイトル ",
            /* @__PURE__ */ jsx("span", { className: "admin-required", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "admin-input",
              value: form.title,
              onChange: (e) => handleChange("title", e.target.value),
              placeholder: "ナレッジタイトル",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "摘録" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "admin-input admin-textarea",
              value: form.excerpt,
              onChange: (e) => handleChange("excerpt", e.target.value),
              placeholder: "短い説明文",
              rows: 3
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "内容" }),
          /* @__PURE__ */ jsx(HtmlEditor, { value: form.content, onChange: (v) => handleChange("content", v), placeholder: "ナレッジ内容を入力..." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "メタ情報" }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-row", children: [
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "モジュール" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: "admin-input",
                value: form.module,
                onChange: (e) => handleChange("module", e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "選択なし" }),
                  SAP_MODULES.map((m) => /* @__PURE__ */ jsxs("option", { value: m.slug, children: [
                    m.code,
                    " · ",
                    m.name_ja
                  ] }, m.slug))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "タイプ" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: "admin-input",
                value: form.type,
                onChange: (e) => handleChange("type", e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "選択なし" }),
                  KNOWLEDGE_TYPES.map((t) => /* @__PURE__ */ jsx("option", { value: t.slug, children: t.name }, t.slug))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "難易度" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: "admin-input",
                value: form.difficulty,
                onChange: (e) => handleChange("difficulty", e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "選択なし" }),
                  DIFFICULTIES$2.map((d) => /* @__PURE__ */ jsx("option", { value: d.slug, children: d.name }, d.slug))
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-actions", children: [
        /* @__PURE__ */ jsx(Link, { to: "/admin/knowledge", className: "admin-btn", children: "キャンセル" }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "admin-btn admin-btn-primary", disabled: saving, children: saving ? "保存中..." : isEdit ? "更新する" : "作成する" })
      ] })
    ] })
  ] });
}
function LessonsList() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showImport, setShowImport] = useState(false);
  const perPage = 20;
  const LESSON_COLUMNS = [
    { key: "id", label: "ID", width: 8 },
    { key: "title", label: "タイトル", width: 40 },
    { key: "course_id", label: "コースID", width: 10 },
    { key: "course_title", label: "所属コース", width: 30 },
    { key: "order", label: "順序", width: 8 },
    { key: "time", label: "時間", width: 10 },
    { key: "content", label: "内容", width: 50 },
    { key: "status", label: "ステータス", width: 10 },
    { key: "created_at", label: "作成日", width: 15 }
  ];
  const handleExport = async () => {
    try {
      const { data } = await api.client.get("/lessons", { params: { per_page: 9999 } });
      const items = data.success ? data.data || [] : [];
      const rows = items.map((l) => {
        var _a;
        return {
          id: l.id,
          title: l.title,
          course_id: l.course_id || "",
          course_title: l.course_title || "",
          order: l.order || 0,
          time: l.time || "",
          content: (l.content || "").replace(/<[^>]*>/g, ""),
          status: l.status || "publish",
          created_at: ((_a = l.created_at) == null ? void 0 : _a.slice(0, 10)) || ""
        };
      });
      exportToExcel(rows, LESSON_COLUMNS, `レッスン一覧_全${rows.length}件_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`);
    } catch {
    }
  };
  const handleImport = async (rows) => {
    var _a, _b, _c;
    let success = 0;
    let failed = 0;
    const errors = [];
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const rowNum = i + 2;
      if (!((_a = r["タイトル"]) == null ? void 0 : _a.trim())) {
        failed++;
        errors.push({ row: rowNum, message: "タイトルが空です" });
        continue;
      }
      try {
        await api.client.post("/lessons", { title: r["タイトル"], order: parseInt(r["順序"] || "1"), time: r["時間"] || "" });
        success++;
      } catch (e) {
        failed++;
        errors.push({ row: rowNum, message: ((_c = (_b = e.response) == null ? void 0 : _b.data) == null ? void 0 : _c.message) || "保存失敗" });
      }
    }
    if (success > 0) {
      setPage(1);
      window.location.reload();
    }
    return { success, failed, errors };
  };
  const courseOptions = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    lessons.forEach((l) => {
      if (l.course_id && l.course_title) map.set(l.course_id, l.course_title);
    });
    return Array.from(map.entries()).map(([id, title]) => ({ id, title })).sort((a, b) => a.title.localeCompare(b.title));
  }, [lessons]);
  const filteredLessons = useMemo(() => {
    let result = lessons;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((l) => l.title.toLowerCase().includes(q));
    }
    if (courseFilter) {
      result = result.filter((l) => l.course_id === parseInt(courseFilter));
    }
    return result;
  }, [lessons, search, courseFilter]);
  const totalPages = Math.ceil(filteredLessons.length / perPage);
  const paginatedLessons = filteredLessons.slice((page - 1) * perPage, page * perPage);
  const fetchLessons = () => {
    setLoading(true);
    setError("");
    api.client.get("/lessons", { params: { per_page: 200 } }).then(({ data }) => {
      if (data && data.success) setLessons(data.data || []);
      else setError((data == null ? void 0 : data.message) || "データの取得に失敗しました。");
    }).catch((err) => {
      var _a, _b;
      setError(((_b = (_a = err == null ? void 0 : err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || (err == null ? void 0 : err.message) || "APIエラーが発生しました。");
    }).finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchLessons();
  }, []);
  useEffect(() => {
    setPage(1);
  }, [search, courseFilter]);
  useEffect(() => {
    setSelectedIds([]);
  }, [page]);
  const handleBatchStatus = async (statusStr) => {
    for (const id of selectedIds) {
      try {
        await api.client.put(`/lessons/${id}`, { status: statusStr });
      } catch {
      }
    }
    setLessons((prev) => prev.map((i) => selectedIds.includes(i.id) ? { ...i, status: statusStr } : i));
    setSelectedIds([]);
  };
  const allSelected = paginatedLessons.length > 0 && paginatedLessons.every((i) => selectedIds.includes(i.id));
  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? paginatedLessons.map((i) => i.id) : []);
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.deleteLesson(deleteId);
      setLessons((prev) => prev.filter((l) => l.id !== deleteId));
    } catch {
    }
    setDeleting(false);
    setDeleteId(null);
  };
  const goToPage = (p2) => {
    if (p2 >= 1 && p2 <= totalPages) setPage(p2);
  };
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsxs("div", { className: "admin-page-head", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { children: "レッスン管理" }),
        /* @__PURE__ */ jsx("p", { className: "admin-page-desc", children: "全コースのレッスンを管理" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsx("button", { className: "admin-btn", onClick: handleExport, children: "📤 エクスポート" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn", onClick: () => setShowImport(true), children: "📥 インポート" }),
        /* @__PURE__ */ jsx(Link, { to: "/admin/lessons/new", className: "admin-btn admin-btn-primary", children: "+ 新規レッスン" }),
        /* @__PURE__ */ jsx(Link, { to: "/admin/courses", className: "admin-btn", style: { fontSize: 11.5 }, children: "← コース管理に戻る" })
      ] })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "admin-error", children: error }),
    /* @__PURE__ */ jsxs("div", { className: "admin-search-bar", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          className: "admin-input",
          placeholder: "レッスンタイトルを検索...",
          value: search,
          onChange: (e) => setSearch(e.target.value)
        }
      ),
      /* @__PURE__ */ jsxs(
        "select",
        {
          className: "admin-input admin-input-sm",
          value: courseFilter,
          onChange: (e) => setCourseFilter(e.target.value),
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "すべてのコース" }),
            courseOptions.map((co) => /* @__PURE__ */ jsx("option", { value: co.id, children: co.title }, co.id))
          ]
        }
      ),
      /* @__PURE__ */ jsxs("span", { style: { fontSize: 12, color: "var(--ink-3)", alignSelf: "center", whiteSpace: "nowrap" }, children: [
        filteredLessons.length,
        " / ",
        lessons.length,
        " 件"
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "読み込み中..." }) : lessons.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "admin-empty", children: [
      /* @__PURE__ */ jsx("div", { className: "admin-empty-icon", children: "🎋" }),
      /* @__PURE__ */ jsx("p", { children: "まだレッスンがありません" }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: "var(--ink-3)", marginTop: 4 }, children: "まずコースを作成し、その後WordPress管理画面でレッスンを追加してください。" })
    ] }) : filteredLessons.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "admin-empty", children: [
      /* @__PURE__ */ jsx("div", { className: "admin-empty-icon", children: "🔍" }),
      /* @__PURE__ */ jsx("p", { children: "検索条件に一致するレッスンがありません" }),
      /* @__PURE__ */ jsx("button", { className: "admin-btn", style: { marginTop: 12 }, onClick: () => {
        setSearch("");
        setCourseFilter("");
      }, children: "クリア" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "admin-table-wrap", children: /* @__PURE__ */ jsxs("table", { className: "admin-table", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { style: { width: 36 }, children: /* @__PURE__ */ jsx("input", { type: "checkbox", onChange: (e) => handleSelectAll(e.target.checked), checked: allSelected }) }),
          /* @__PURE__ */ jsx("th", { children: "タイトル" }),
          /* @__PURE__ */ jsx("th", { children: "所属コース" }),
          /* @__PURE__ */ jsx("th", { children: "順序" }),
          /* @__PURE__ */ jsx("th", { children: "時間" }),
          /* @__PURE__ */ jsx("th", { children: "ステータス" }),
          /* @__PURE__ */ jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: paginatedLessons.map((l) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("input", { type: "checkbox", checked: selectedIds.includes(l.id), onChange: (e) => setSelectedIds((prev) => e.target.checked ? [...prev, l.id] : prev.filter((id) => id !== l.id)) }) }),
          /* @__PURE__ */ jsx("td", { className: "admin-cell-title", children: l.title }),
          /* @__PURE__ */ jsx("td", { children: l.course_title || "—" }),
          /* @__PURE__ */ jsx("td", { children: l.order || "—" }),
          /* @__PURE__ */ jsx("td", { children: l.time || "—" }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: "admin-actions", children: [
            /* @__PURE__ */ jsx(Link, { to: `/admin/lessons/${l.id}/edit`, className: "admin-btn admin-btn-sm", children: "編集" }),
            /* @__PURE__ */ jsx(Link, { to: `/lesson/${l.id}`, className: "admin-btn admin-btn-sm", children: "表示" }),
            /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm admin-btn-danger", onClick: () => setDeleteId(l.id), children: "削除" })
          ] }) })
        ] }, l.id)) })
      ] }) }),
      selectedIds.length > 0 && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "var(--accent-soft)", borderRadius: "var(--r-md)", marginTop: 8 }, children: [
        /* @__PURE__ */ jsxs("span", { style: { fontSize: 13, fontWeight: 600, color: "var(--accent-deep)" }, children: [
          selectedIds.length,
          " 件選択中"
        ] }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm admin-btn-primary", onClick: () => handleBatchStatus("publish"), children: "公開する" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => handleBatchStatus("draft"), children: "下書きにする" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => setSelectedIds([]), style: { marginLeft: "auto" }, children: "解除" })
      ] }),
      totalPages > 1 && /* @__PURE__ */ jsx(Pagination, { page, totalPages, onChange: goToPage })
    ] }),
    showImport && /* @__PURE__ */ jsx(ImportModal, { columns: LESSON_COLUMNS, templateFilename: "レッスンインポート", onImport: handleImport, onClose: () => {
      setShowImport(false);
      window.location.reload();
    } }),
    deleteId && /* @__PURE__ */ jsx("div", { className: "admin-overlay", onClick: () => !deleting && setDeleteId(null), children: /* @__PURE__ */ jsxs("div", { className: "admin-modal", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsx("h3", { children: "レッスンを削除しますか？" }),
      /* @__PURE__ */ jsx("p", { children: "この操作は取り消せません。" }),
      /* @__PURE__ */ jsxs("div", { className: "admin-modal-actions", children: [
        /* @__PURE__ */ jsx("button", { className: "admin-btn", onClick: () => setDeleteId(null), disabled: deleting, children: "キャンセル" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-danger", onClick: handleDelete, disabled: deleting, children: deleting ? "削除中..." : "削除する" })
      ] })
    ] }) })
  ] });
}
function LessonForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    course_id: "",
    order: "",
    time: ""
  });
  useEffect(() => {
    api.client.get("/courses", { params: { per_page: 50 } }).then(({ data }) => {
      if (data.success) setCourses(data.data || []);
    }).catch(() => {
    });
  }, []);
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.client.get(`/lessons/${id}`).then(({ data }) => {
      if (data.success && data.data) {
        const l = data.data;
        setForm({
          title: l.title || "",
          excerpt: l.excerpt || "",
          content: l.content || "",
          course_id: l.course_id ? String(l.course_id) : "",
          order: l.order ? String(l.order) : "",
          time: l.time || ""
        });
      }
    }).catch(() => setError("レッスンの取得に失敗しました。")).finally(() => setLoading(false));
  }, [id]);
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("タイトルは必須です。");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      course_id: form.course_id ? parseInt(form.course_id) : 0,
      order: form.order ? parseInt(form.order) : 0,
      time: form.time
    };
    try {
      if (isEdit) {
        const res = await api.updateLesson(parseInt(id), payload);
        if (res.success) navigate("/admin/lessons");
        else setError(res.message || "更新に失敗しました。");
      } else {
        const res = await api.createLesson(payload);
        if (res.success) navigate("/admin/lessons");
        else setError(res.message || "作成に失敗しました。");
      }
    } catch {
      setError("サーバーエラーが発生しました。");
    } finally {
      setSaving(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "admin-page", children: /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "読み込み中..." }) });
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsx("div", { className: "admin-page-head", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-crumb", children: [
        /* @__PURE__ */ jsx(Link, { to: "/admin/lessons", children: "レッスン管理" }),
        /* @__PURE__ */ jsx("span", { className: "sep", children: " › " }),
        /* @__PURE__ */ jsx("span", { children: isEdit ? "編集" : "新規作成" })
      ] }),
      /* @__PURE__ */ jsx("h1", { children: isEdit ? "レッスンを編集" : "新規レッスン作成" })
    ] }) }),
    error && /* @__PURE__ */ jsx("div", { className: "admin-error", children: error }),
    /* @__PURE__ */ jsxs("form", { className: "admin-form", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsxs("label", { className: "admin-label", children: [
            "タイトル ",
            /* @__PURE__ */ jsx("span", { className: "admin-required", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "admin-input",
              value: form.title,
              onChange: (e) => handleChange("title", e.target.value),
              placeholder: "レッスンタイトル",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "摘録" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "admin-input admin-textarea",
              value: form.excerpt,
              onChange: (e) => handleChange("excerpt", e.target.value),
              placeholder: "短い説明文",
              rows: 3
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "内容" }),
          /* @__PURE__ */ jsx(HtmlEditor, { value: form.content, onChange: (v) => handleChange("content", v), placeholder: "レッスン内容を入力..." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "レッスン設定" }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-row", children: [
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "所属コース" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: "admin-input",
                value: form.course_id,
                onChange: (e) => handleChange("course_id", e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "選択してください" }),
                  courses.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.title }, c.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "順序" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                className: "admin-input",
                value: form.order,
                onChange: (e) => handleChange("order", e.target.value),
                min: 0,
                placeholder: "0"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "所要時間" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "admin-input",
                value: form.time,
                onChange: (e) => handleChange("time", e.target.value),
                placeholder: "例: 20 min"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-actions", children: [
        /* @__PURE__ */ jsx(Link, { to: "/admin/lessons", className: "admin-btn", children: "キャンセル" }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "admin-btn admin-btn-primary", disabled: saving, children: saving ? "保存中..." : isEdit ? "更新する" : "作成する" })
      ] })
    ] })
  ] });
}
function LearningPathsList() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const perPage = 20;
  const fetchPaths = () => {
    setLoading(true);
    api.getLearningPaths().then((res) => {
      if (res.success && res.data) {
        const all = res.data;
        setTotal(all.length);
        const start = (page - 1) * perPage;
        setPaths(all.slice(start, start + perPage));
      }
    }).catch(() => {
    }).finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchPaths();
  }, [page]);
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await api.deleteLearningPath(deleteId);
      if (res.success) {
        setPaths((prev) => prev.filter((p2) => p2.id !== deleteId));
        setTotal((prev) => Math.max(0, prev - 1));
      }
    } catch {
    }
    setDeleting(false);
    setDeleteId(null);
  };
  const totalPages = Math.ceil(total / perPage);
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsxs("div", { className: "admin-page-head", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { children: "学習パス管理" }),
        /* @__PURE__ */ jsxs("p", { className: "admin-page-desc", children: [
          "全 ",
          total,
          " 件の学習パス"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 8 }, children: /* @__PURE__ */ jsx(Link, { to: "/admin/learning-paths/new", className: "admin-btn admin-btn-primary", children: "+ 新規学習パス" }) })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "読み込み中..." }) : paths.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "admin-empty", children: [
      /* @__PURE__ */ jsx("div", { className: "admin-empty-icon", children: "🎋" }),
      /* @__PURE__ */ jsx("p", { children: "まだ学習パスがありません" }),
      /* @__PURE__ */ jsx(Link, { to: "/admin/learning-paths/new", className: "admin-btn admin-btn-primary", children: "最初の学習パスを作成" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "admin-table-wrap", children: /* @__PURE__ */ jsxs("table", { className: "admin-table", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { children: "タイトル" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-mobile", children: "対象" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-mobile", children: "ステップ" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-tablet", children: "時間" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-tablet col-hide-mobile", children: "記事数" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-tablet col-hide-mobile", children: "作成日" }),
          /* @__PURE__ */ jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: paths.map((p2) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "admin-cell-title", children: p2.title }),
          /* @__PURE__ */ jsx("td", { className: "col-hide-mobile", children: p2.audience || "—" }),
          /* @__PURE__ */ jsx("td", { className: "col-hide-mobile", children: (p2.steps || []).length }),
          /* @__PURE__ */ jsx("td", { className: "col-hide-tablet", children: p2.duration || "—" }),
          /* @__PURE__ */ jsx("td", { className: "col-hide-tablet col-hide-mobile", children: p2.article_count || 0 }),
          /* @__PURE__ */ jsx("td", { className: "admin-cell-date col-hide-tablet col-hide-mobile", children: new Date(p2.created_at).toLocaleDateString("ja-JP") }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: "admin-actions", children: [
            /* @__PURE__ */ jsx(Link, { to: `/admin/learning-paths/${p2.id}/edit`, className: "admin-btn admin-btn-sm", children: "編集" }),
            /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm admin-btn-danger", onClick: () => setDeleteId(p2.id), children: "削除" })
          ] }) })
        ] }, p2.id)) })
      ] }) }),
      totalPages > 1 && /* @__PURE__ */ jsx(Pagination, { page, totalPages, onChange: (p2) => setPage(p2) })
    ] }),
    deleteId && /* @__PURE__ */ jsx("div", { className: "admin-overlay", onClick: () => !deleting && setDeleteId(null), children: /* @__PURE__ */ jsxs("div", { className: "admin-modal", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsx("h3", { children: "学習パスを削除しますか？" }),
      /* @__PURE__ */ jsx("p", { children: "関連する全ステップも削除されます。この操作は取り消せません。" }),
      /* @__PURE__ */ jsxs("div", { className: "admin-modal-actions", children: [
        /* @__PURE__ */ jsx("button", { className: "admin-btn", onClick: () => setDeleteId(null), disabled: deleting, children: "キャンセル" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-danger", onClick: handleDelete, disabled: deleting, children: deleting ? "削除中..." : "削除する" })
      ] })
    ] }) })
  ] });
}
const ACCENT_COLORS = [
  { label: "SAP Green", value: "#5a9d6e" },
  { label: "Orange", value: "#d97548" },
  { label: "Rose", value: "#d96570" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Purple", value: "#8b5cf6" },
  { label: "Pink", value: "#ec4899" }
];
function LearningPathForm() {
  var _a, _b, _c;
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [allCourses, setAllCourses] = useState([]);
  const [allKnowledge, setAllKnowledge] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalStepIdx, setModalStepIdx] = useState(0);
  const [form, setForm] = useState({
    title: "",
    audience: "",
    description: "",
    duration: "",
    accent: "#5a9d6e"
  });
  const [steps, setSteps] = useState([
    { title: "", time: "30 min", course_ids: [], knowledge_ids: [], article_ids: [] }
  ]);
  useEffect(() => {
    api.client.get("/courses", { params: { per_page: 999 } }).then(({ data }) => {
      if (data.success) setAllCourses(data.data || []);
    }).catch(() => {
    });
    api.client.get("/knowledge", { params: { per_page: 999 } }).then(({ data }) => {
      if (data.success) setAllKnowledge(data.data || []);
    }).catch(() => {
    });
    api.client.get("/articles", { params: { per_page: 999 } }).then(({ data }) => {
      if (data.success) setAllArticles(data.data || []);
    }).catch(() => {
    });
  }, []);
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getLearningPath(parseInt(id)).then((res) => {
      if (res.success && res.data) {
        const d = res.data;
        setForm({ title: d.title || "", audience: d.audience || "", description: d.description || "", duration: d.duration || "", accent: d.accent || "#5a9d6e" });
        if (d.steps && d.steps.length > 0) {
          setSteps(d.steps.map((s) => ({
            title: s.title || "",
            time: s.time || "30 min",
            step_id: s.id || s.step_id || 0,
            course_ids: s.course_ids || [],
            knowledge_ids: s.knowledge_ids || [],
            article_ids: s.article_ids || []
          })));
        }
      }
    }).catch(() => setError("読み込みに失敗しました")).finally(() => setLoading(false));
  }, [id]);
  const handleFormChange = (f, v) => setForm((prev) => ({ ...prev, [f]: v }));
  const handleStepChange = (idx, f, v) => setSteps((prev) => prev.map((s, i) => i === idx ? { ...s, [f]: v } : s));
  const addStep = () => setSteps((prev) => [...prev, { title: "", time: "30 min", course_ids: [], knowledge_ids: [], article_ids: [] }]);
  const removeStep = (idx) => setSteps((prev) => prev.filter((_, i) => i !== idx));
  const handleModalAdd = (type, newItems) => {
    setSteps((prev) => prev.map((s, i) => {
      if (i !== modalStepIdx) return s;
      const key = type === "course" ? "course_ids" : type === "knowledge" ? "knowledge_ids" : "article_ids";
      const existing = s[key] || [];
      const newIds = newItems.map((item) => item.id).filter((id2) => !existing.includes(id2));
      return { ...s, [key]: [...existing, ...newIds] };
    }));
  };
  const getAllSelected = (step) => {
    const items = [];
    for (const id2 of step.course_ids || []) {
      const c = allCourses.find((x) => x.id === id2);
      if (c) items.push({ id: c.id, title: c.title, type: "course", color: "#5a9d6e" });
    }
    for (const id2 of step.knowledge_ids || []) {
      const c = allKnowledge.find((x) => x.id === id2);
      if (c) items.push({ id: c.id, title: c.title, type: "knowledge", color: "#3b82f6" });
    }
    for (const id2 of step.article_ids || []) {
      const c = allArticles.find((x) => x.id === id2);
      if (c) items.push({ id: c.id, title: c.title, type: "article", color: "#8b5cf6" });
    }
    return items;
  };
  const removeSelected = (si, t, itemId) => {
    setSteps((prev) => prev.map((s, i) => {
      if (i !== si) return s;
      if (t === "course") return { ...s, course_ids: (s.course_ids || []).filter((id2) => id2 !== itemId) };
      if (t === "knowledge") return { ...s, knowledge_ids: (s.knowledge_ids || []).filter((id2) => id2 !== itemId) };
      return { ...s, article_ids: (s.article_ids || []).filter((id2) => id2 !== itemId) };
    }));
  };
  const moveSelected = (si, t, itemId, dir) => {
    setSteps((prev) => prev.map((s, i) => {
      if (i !== si) return s;
      const key = t === "course" ? "course_ids" : t === "knowledge" ? "knowledge_ids" : "article_ids";
      const ids = [...s[key] || []];
      const idx = ids.indexOf(itemId);
      if (idx < 0) return s;
      if (dir === "up" && idx > 0) [ids[idx - 1], ids[idx]] = [ids[idx], ids[idx - 1]];
      else if (dir === "down" && idx < ids.length - 1) [ids[idx], ids[idx + 1]] = [ids[idx + 1], ids[idx]];
      return { ...s, [key]: ids };
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("タイトルは必須です");
      return;
    }
    const validSteps = steps.filter((s) => s.title.trim());
    if (validSteps.length === 0) {
      setError("少なくとも1つのステップが必要です");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, steps: validSteps.map((s, i) => ({ step_title: s.title, step_time: s.time, step_id: s.step_id || 0, course_ids: s.course_ids || [], knowledge_ids: s.knowledge_ids || [], article_ids: s.article_ids || [] })) };
      if (isEdit) {
        const res = await api.updateLearningPath(parseInt(id), payload);
        if (res.success) navigate("/admin/learning-paths");
        else setError(res.message || "更新に失敗しました");
      } else {
        const res = await api.createLearningPath(payload);
        if (res.success) navigate("/admin/learning-paths");
        else setError(res.message || "作成に失敗しました");
      }
    } catch {
      setError("サーバーエラー");
    } finally {
      setSaving(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "admin-page", children: /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "読み込み中..." }) });
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsx("div", { className: "admin-page-head", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-crumb", children: [
        /* @__PURE__ */ jsx(Link, { to: "/admin/learning-paths", children: "学習パス管理" }),
        /* @__PURE__ */ jsx("span", { className: "sep", children: " › " }),
        /* @__PURE__ */ jsx("span", { children: isEdit ? "編集" : "新規作成" })
      ] }),
      /* @__PURE__ */ jsx("h1", { children: isEdit ? "学習パスを編集" : "新規学習パス作成" })
    ] }) }),
    error && /* @__PURE__ */ jsx("div", { className: "admin-error", children: error }),
    /* @__PURE__ */ jsxs("form", { className: "admin-form", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "基本情報" }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsxs("label", { className: "admin-label", children: [
            "タイトル ",
            /* @__PURE__ */ jsx("span", { className: "admin-required", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "admin-input",
              value: form.title,
              onChange: (e) => handleFormChange("title", e.target.value),
              placeholder: "SAP 超入門パス",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-row", children: [
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "対象者" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "admin-input",
                value: form.audience,
                onChange: (e) => handleFormChange("audience", e.target.value),
                placeholder: "SAP未経験者"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "所要時間" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "admin-input",
                value: form.duration,
                onChange: (e) => handleFormChange("duration", e.target.value),
                placeholder: "2週間"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-row", children: [
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", style: { flex: 3 }, children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "説明" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                className: "admin-input admin-textarea",
                value: form.description,
                onChange: (e) => handleFormChange("description", e.target.value),
                placeholder: "Description...",
                rows: 3
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", style: { flex: 1 }, children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "アクセントカラー" }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }, children: ACCENT_COLORS.map((c) => /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => handleFormChange("accent", c.value),
                style: { width: 32, height: 32, borderRadius: "50%", border: form.accent === c.value ? "3px solid var(--ink-0)" : "2px solid var(--line-2)", background: c.value, cursor: "pointer" }
              },
              c.value
            )) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }, children: [
          /* @__PURE__ */ jsx("h3", { style: { margin: 0 }, children: "学習ステップ" }),
          /* @__PURE__ */ jsx("button", { type: "button", className: "admin-btn admin-btn-sm", onClick: addStep, children: "+ ステップ追加" })
        ] }),
        steps.map((step, si) => {
          const selected = getAllSelected(step);
          return /* @__PURE__ */ jsxs("div", { style: { background: "var(--bg-1)", borderRadius: "var(--r-md)", border: "1px solid var(--line-2)", padding: "16px 18px", marginBottom: 20 }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }, children: [
              /* @__PURE__ */ jsx("span", { style: { width: 28, height: 28, borderRadius: "50%", background: form.accent, color: "white", fontSize: 12, fontWeight: 700, display: "grid", placeItems: "center", flexShrink: 0 }, children: si + 1 }),
              /* @__PURE__ */ jsxs("div", { style: { flex: 1, display: "flex", gap: 10 }, children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    className: "admin-input",
                    value: step.title,
                    onChange: (e) => handleStepChange(si, "title", e.target.value),
                    placeholder: `Step ${si + 1} title`,
                    style: { flex: 2 }
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    className: "admin-input",
                    value: step.time,
                    onChange: (e) => handleStepChange(si, "time", e.target.value),
                    placeholder: "30 min",
                    style: { width: 100 }
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "admin-btn admin-btn-sm admin-btn-danger",
                  onClick: () => removeStep(si),
                  disabled: steps.length <= 1,
                  style: { padding: "4px 10px", fontSize: 12 },
                  children: "×"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { marginBottom: 12 }, children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }, children: [
                /* @__PURE__ */ jsxs("span", { style: { fontSize: 13, fontWeight: 600 }, children: [
                  "選択中: ",
                  selected.length,
                  "件"
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    className: "admin-btn admin-btn-sm admin-btn-primary",
                    onClick: () => {
                      setModalStepIdx(si);
                      setShowModal(true);
                    },
                    children: "📋 コンテンツを選択"
                  }
                )
              ] }),
              selected.length === 0 ? /* @__PURE__ */ jsx("div", { style: { fontSize: 13, color: "var(--ink-3)", padding: "16px 0", textAlign: "center", border: "1px dashed var(--line-2)", borderRadius: "var(--r-md)" }, children: "「コンテンツを選択」からコース・ナレッジ・公開記事を追加してください" }) : /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 3 }, children: selected.map((item, idx) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "var(--bg-card)", borderRadius: "var(--r-sm)", border: "1px solid var(--line-1)" }, children: [
                /* @__PURE__ */ jsx("span", { style: { width: 22, height: 22, borderRadius: "50%", background: form.accent, color: "white", fontSize: 10, fontWeight: 700, display: "grid", placeItems: "center", flexShrink: 0 }, children: idx + 1 }),
                /* @__PURE__ */ jsx("span", { style: { fontSize: 9.5, fontWeight: 700, padding: "1px 7px", borderRadius: "var(--r-pill)", background: item.color + "22", color: item.color, flexShrink: 0 }, children: item.type === "course" ? "コース" : item.type === "knowledge" ? "ナレッジ" : "記事" }),
                /* @__PURE__ */ jsx("span", { style: { flex: 1, fontSize: 12.5, fontWeight: 500 }, children: item.title }),
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 1 }, children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => moveSelected(si, item.type, item.id, "up"),
                      disabled: idx === 0,
                      style: { padding: "1px 4px", border: "none", background: "none", cursor: "pointer", opacity: idx === 0 ? 0.2 : 0.5, fontSize: 12 },
                      children: "▲"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => moveSelected(si, item.type, item.id, "down"),
                      disabled: idx === selected.length - 1,
                      style: { padding: "1px 4px", border: "none", background: "none", cursor: "pointer", opacity: idx === selected.length - 1 ? 0.2 : 0.5, fontSize: 12 },
                      children: "▼"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => removeSelected(si, item.type, item.id),
                    style: { padding: "1px 4px", border: "none", background: "none", cursor: "pointer", opacity: 0.4, fontSize: 12 },
                    children: "✕"
                  }
                )
              ] }, `${item.type}-${item.id}`)) })
            ] })
          ] }, si);
        }),
        /* @__PURE__ */ jsx("div", { style: { textAlign: "center", marginTop: 8 }, children: /* @__PURE__ */ jsx("button", { type: "button", className: "admin-btn", onClick: addStep, children: "+ Step" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-actions", children: [
        /* @__PURE__ */ jsx(Link, { to: "/admin/learning-paths", className: "admin-btn", children: "キャンセル" }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "admin-btn admin-btn-primary", disabled: saving, children: saving ? "保存中..." : isEdit ? "更新する" : "作成する" })
      ] })
    ] }),
    showModal && createPortal(
      /* @__PURE__ */ jsx(
        ContentPicker,
        {
          allCourses,
          allKnowledge,
          allArticles,
          selectedCourseIds: ((_a = steps[modalStepIdx]) == null ? void 0 : _a.course_ids) || [],
          selectedKnowledgeIds: ((_b = steps[modalStepIdx]) == null ? void 0 : _b.knowledge_ids) || [],
          selectedArticleIds: ((_c = steps[modalStepIdx]) == null ? void 0 : _c.article_ids) || [],
          onAdd: handleModalAdd,
          onClose: () => setShowModal(false)
        }
      ),
      document.body
    )
  ] });
}
function ContentPicker({
  allCourses,
  allKnowledge,
  allArticles,
  selectedCourseIds,
  selectedKnowledgeIds,
  selectedArticleIds,
  onAdd,
  onClose
}) {
  const [tab, setTab] = useState("course");
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState({});
  const [filterModules, setFilterModules] = useState([]);
  const [page, setPage] = useState(1);
  const PER_PAGE2 = 10;
  const toggleFilterModule = (slug) => {
    setFilterModules((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]);
    setPage(1);
  };
  const list = tab === "course" ? allCourses : tab === "knowledge" ? allKnowledge : allArticles;
  const selectedIds = tab === "course" ? selectedCourseIds : tab === "knowledge" ? selectedKnowledgeIds : selectedArticleIds;
  const TAB_COLORS = { course: "#5a9d6e", knowledge: "#3b82f6", article: "#8b5cf6" };
  const hue = TAB_COLORS[tab];
  const filtered = list.filter((item) => {
    var _a;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterModules.length > 0) {
      const itemModule = (_a = item.module) == null ? void 0 : _a.slug;
      if (!itemModule || !filterModules.includes(itemModule)) return false;
    }
    return true;
  });
  const totalPages = Math.ceil(filtered.length / PER_PAGE2);
  const paged = filtered.slice((page - 1) * PER_PAGE2, page * PER_PAGE2);
  const doAdd = (type, ids) => {
    const items = list.filter((item) => ids.includes(item.id));
    if (items.length) onAdd(type, items);
    setChecked({});
  };
  return /* @__PURE__ */ jsx("div", { style: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }, onClick: onClose, children: /* @__PURE__ */ jsxs("div", { onClick: (e) => e.stopPropagation(), style: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    width: "min(700px, 94vw)",
    maxHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  }, children: [
    /* @__PURE__ */ jsxs("div", { style: { padding: "20px 24px 0", borderBottom: "1px solid #e0ddd5" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }, children: [
        /* @__PURE__ */ jsx("h3", { style: { margin: 0, fontSize: 18, fontWeight: 700, color: "#2a2317" }, children: "コンテンツを選択" }),
        /* @__PURE__ */ jsx("button", { onClick: onClose, style: { background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#999", padding: "0 4px" }, children: "✕" })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 0 }, children: ["course", "knowledge", "article"].map((t) => {
        const active = tab === t;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              setTab(t);
              setSearch("");
              setChecked({});
              setPage(1);
            },
            style: {
              flex: 1,
              padding: "10px 0",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: active ? 700 : 500,
              color: active ? TAB_COLORS[t] : "#999",
              borderBottom: active ? `2.5px solid ${TAB_COLORS[t]}` : "2.5px solid transparent"
            },
            children: [
              t === "course" ? "📚 コース" : t === "knowledge" ? "📖 ナレッジ" : "📰 公開記事",
              " (",
              list.length,
              ")"
            ]
          },
          t
        );
      }) })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { padding: "12px 20px", borderBottom: "1px solid #f0eee8" }, children: /* @__PURE__ */ jsx(
      "input",
      {
        value: search,
        onChange: (e) => setSearch(e.target.value),
        placeholder: "検索...",
        autoFocus: true,
        style: { width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { style: { padding: "8px 20px", borderBottom: "1px solid #f0eee8" }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontSize: 11, fontWeight: 600, color: "#999", marginBottom: 6 }, children: "モジュールで絞り込み" }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" }, children: [
        SAP_MODULES.map((m) => {
          const active = filterModules.includes(m.slug);
          return /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => toggleFilterModule(m.slug),
              style: {
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: 999,
                border: active ? "none" : "1px solid #ddd",
                background: active ? m.bg_color || "#e8f5e9" : "transparent",
                color: active ? m.color || "#2a2317" : "#999",
                cursor: "pointer"
              },
              children: m.code
            },
            m.slug
          );
        }),
        filterModules.length > 0 && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setFilterModules([]),
            style: { fontSize: 10, padding: "3px 8px", borderRadius: 999, border: "none", background: "#f5f5f5", color: "#999", cursor: "pointer" },
            children: "解除"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { flex: 1, overflowY: "auto", padding: "0 20px 8px", minHeight: 200 }, children: filtered.length === 0 ? /* @__PURE__ */ jsx("div", { style: { textAlign: "center", padding: 40, color: "#999", fontSize: 13 }, children: "該当するコンテンツがありません" }) : paged.map((item) => {
      const sel = selectedIds.includes(item.id);
      const chk = !!checked[String(item.id)];
      return /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "7px 10px",
        borderRadius: 8,
        fontSize: 13,
        marginBottom: 2,
        background: sel ? "#fde8e8" : chk ? "#e8f5e9" : "transparent",
        borderLeft: sel ? "3px solid #dc3545" : "3px solid transparent"
      }, children: [
        !sel ? /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: chk,
            onChange: () => setChecked((prev) => ({ ...prev, [String(item.id)]: !prev[String(item.id)] })),
            style: { accentColor: hue }
          }
        ) : /* @__PURE__ */ jsx("span", { style: { color: "#dc3545", width: 16, textAlign: "center" }, children: "✓" }),
        /* @__PURE__ */ jsx("span", { style: {
          flex: 1,
          cursor: sel ? "default" : "pointer",
          color: sel ? "#dc3545" : "#2a2317",
          fontWeight: sel ? 600 : 400,
          textDecoration: sel ? "none" : "none"
        }, onClick: () => {
          if (!sel) doAdd(tab, [item.id]);
        }, children: item.title }),
        item.module && /* @__PURE__ */ jsx("span", { style: { fontSize: 11, color: "#999" }, children: item.module.name }),
        sel && /* @__PURE__ */ jsx("span", { style: { fontSize: 10, color: "#dc3545", fontWeight: 600 }, children: "追加済 ✓" })
      ] }, item.id);
    }) }),
    totalPages > 1 && /* @__PURE__ */ jsxs("div", { style: { padding: "6px 20px", borderTop: "1px solid #f0eee8", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setPage((p2) => Math.max(1, p2 - 1)),
          disabled: page <= 1,
          style: { padding: "4px 10px", borderRadius: 6, border: "1px solid #ddd", background: page <= 1 ? "#f5f5f5" : "#fff", color: page <= 1 ? "#ccc" : "#2a2317", cursor: page <= 1 ? "default" : "pointer", fontSize: 12 },
          children: "‹ 前へ"
        }
      ),
      Array.from({ length: totalPages }, (_, i) => i + 1).map((p2) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setPage(p2),
          style: {
            width: 28,
            height: 28,
            borderRadius: 6,
            border: p2 === page ? "none" : "1px solid #ddd",
            background: p2 === page ? hue : "#fff",
            color: p2 === page ? "#fff" : "#2a2317",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: p2 === page ? 700 : 400
          },
          children: p2
        },
        p2
      )),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setPage((p2) => Math.min(totalPages, p2 + 1)),
          disabled: page >= totalPages,
          style: { padding: "4px 10px", borderRadius: 6, border: "1px solid #ddd", background: page >= totalPages ? "#f5f5f5" : "#fff", color: page >= totalPages ? "#ccc" : "#2a2317", cursor: page >= totalPages ? "default" : "pointer", fontSize: 12 },
          children: "次へ ›"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { padding: "12px 20px", borderTop: "1px solid #e0ddd5", display: "flex", gap: 8, justifyContent: "flex-end" }, children: [
      /* @__PURE__ */ jsx("button", { onClick: onClose, style: { padding: "8px 20px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: 13 }, children: "キャンセル" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            const ids = Object.entries(checked).filter(([, v]) => v).map(([k]) => parseInt(k));
            if (ids.length) doAdd(tab, ids);
          },
          disabled: !Object.values(checked).some((v) => v),
          style: { padding: "8px 20px", borderRadius: 8, border: "none", background: !Object.values(checked).some((v) => v) ? "#ccc" : hue, color: "#fff", cursor: !Object.values(checked).some((v) => v) ? "default" : "pointer", fontSize: 13, fontWeight: 600 },
          children: [
            "選択を追加 (",
            Object.values(checked).filter((v) => v).length,
            ")"
          ]
        }
      )
    ] })
  ] }) });
}
function AdminModules() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    setLoading(true);
    api.client.get("/modules").then(({ data }) => {
      if (data.success) setModules(data.data || []);
      else setError(data.message || "取得失敗");
    }).catch(() => setError("APIエラー")).finally(() => setLoading(false));
  }, []);
  if (loading) return /* @__PURE__ */ jsx("div", { className: "admin-page", children: /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "読み込み中..." }) });
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsxs("div", { className: "admin-page-head", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { children: "モジュール管理" }),
        /* @__PURE__ */ jsxs("p", { className: "admin-page-desc", children: [
          "全 ",
          modules.length,
          " モジュール"
        ] })
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/admin/modules/new", className: "admin-btn admin-btn-primary", children: "+ 新規モジュール" })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "admin-error", children: error }),
    /* @__PURE__ */ jsx("div", { className: "admin-table-wrap", children: /* @__PURE__ */ jsxs("table", { className: "admin-table", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { children: "コード" }),
        /* @__PURE__ */ jsx("th", { children: "名称 (日本語)" }),
        /* @__PURE__ */ jsx("th", { children: "名称 (英語)" }),
        /* @__PURE__ */ jsx("th", { children: "カラー" }),
        /* @__PURE__ */ jsx("th", { children: "記事数" }),
        /* @__PURE__ */ jsx("th", { children: "コース数" }),
        /* @__PURE__ */ jsx("th", { children: "順序" }),
        /* @__PURE__ */ jsx("th", { children: "操作" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: modules.map((m) => /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("td", { style: { fontWeight: 700 }, children: m.icon }),
        /* @__PURE__ */ jsx("td", { children: m.name_ja }),
        /* @__PURE__ */ jsx("td", { style: { color: "var(--ink-2)", fontSize: 12 }, children: m.name_en }),
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 4, alignItems: "center" }, children: [
          /* @__PURE__ */ jsx("span", { style: { width: 18, height: 18, borderRadius: 4, background: m.color, display: "inline-block" } }),
          /* @__PURE__ */ jsx("span", { style: { width: 18, height: 18, borderRadius: 4, background: m.bg_color, display: "inline-block" } }),
          /* @__PURE__ */ jsx("span", { style: { fontSize: 10.5, color: "var(--ink-3)" }, children: m.color })
        ] }) }),
        /* @__PURE__ */ jsx("td", { children: m.article_count }),
        /* @__PURE__ */ jsx("td", { children: m.course_count }),
        /* @__PURE__ */ jsx("td", { children: m.order || "—" }),
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("div", { className: "admin-actions", children: /* @__PURE__ */ jsx(Link, { to: `/admin/modules/${m.slug}/edit`, className: "admin-btn admin-btn-sm", children: "編集" }) }) })
      ] }, m.slug)) })
    ] }) })
  ] });
}
function ModuleForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEdit = !!slug;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name_ja: "",
    name_en: "",
    description: "",
    color: "#5a9d6e",
    bg_color: "#d8ead9",
    icon: "",
    order: "",
    slug: "",
    levels: []
  });
  const allLevels = ["初級", "中級", "上級"];
  const toggleLevel = (level) => {
    setForm((prev) => ({
      ...prev,
      levels: prev.levels.includes(level) ? prev.levels.filter((l) => l !== level) : [...prev.levels, level]
    }));
  };
  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    api.client.get(`/modules/${slug}`).then(({ data }) => {
      if (data.success && data.data) {
        const m = data.data;
        setForm({
          name_ja: m.name_ja || "",
          name_en: m.name_en || "",
          description: m.description || "",
          color: m.color || "#5a9d6e",
          bg_color: m.bg_color || "#d8ead9",
          icon: m.icon || slug.toUpperCase(),
          order: m.order ? String(m.order) : "",
          slug: m.slug || slug,
          levels: m.levels || []
        });
      }
    }).catch(() => setError("取得失敗")).finally(() => setLoading(false));
  }, [slug, isEdit]);
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name_ja.trim()) {
      setError("名称は必須です。");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (isEdit) {
        const res = await api.client.put(`/modules/${slug}`, form);
        if (res.data.success) navigate("/admin/modules");
        else setError(res.data.message || "更新に失敗");
      } else {
        if (!form.slug.trim()) {
          setError("スラッグは必須です。");
          setSaving(false);
          return;
        }
        const res = await api.client.post("/modules", form);
        if (res.data.success) navigate("/admin/modules");
        else setError(res.data.message || "作成に失敗");
      }
    } catch {
      setError("サーバーエラー");
    } finally {
      setSaving(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "admin-page", children: /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "読み込み中..." }) });
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsx("div", { className: "admin-page-head", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-crumb", children: [
        /* @__PURE__ */ jsx(Link, { to: "/admin/modules", children: "モジュール管理" }),
        /* @__PURE__ */ jsx("span", { className: "sep", children: " › " }),
        /* @__PURE__ */ jsx("span", { children: isEdit ? `編集: ${slug}` : "新規作成" })
      ] }),
      /* @__PURE__ */ jsx("h1", { children: isEdit ? `モジュール編集: ${slug == null ? void 0 : slug.toUpperCase()}` : "新規モジュール作成" })
    ] }) }),
    error && /* @__PURE__ */ jsx("div", { className: "admin-error", children: error }),
    /* @__PURE__ */ jsxs("form", { className: "admin-form", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "admin-form-row", children: [
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsxs("label", { className: "admin-label", children: [
              "名称（日本語） ",
              /* @__PURE__ */ jsx("span", { className: "admin-required", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "admin-input",
                value: form.name_ja,
                onChange: (e) => handleChange("name_ja", e.target.value),
                placeholder: "例: 財務会計",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "名称（英語）" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "admin-input",
                value: form.name_en,
                onChange: (e) => handleChange("name_en", e.target.value),
                placeholder: "例: Financial Accounting"
              }
            )
          ] })
        ] }),
        !isEdit && /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsxs("label", { className: "admin-label", children: [
            "スラッグ ",
            /* @__PURE__ */ jsx("span", { className: "admin-required", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "admin-input",
              value: form.slug,
              onChange: (e) => handleChange("slug", e.target.value),
              placeholder: "例: fi",
              style: { fontFamily: "monospace" },
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-row", children: [
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "コード（表示用）" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "admin-input",
                value: form.icon,
                onChange: (e) => handleChange("icon", e.target.value),
                placeholder: "例: FI",
                style: { fontFamily: "monospace" }
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "表示順序" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                className: "admin-input",
                value: form.order,
                onChange: (e) => handleChange("order", e.target.value),
                min: 0,
                placeholder: "0"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-row", children: [
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "テーマカラー" }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "color",
                  className: "admin-input",
                  value: form.color,
                  onChange: (e) => handleChange("color", e.target.value),
                  style: { width: 48, height: 38, padding: 2 }
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  className: "admin-input",
                  value: form.color,
                  onChange: (e) => handleChange("color", e.target.value),
                  style: { flex: 1, fontFamily: "monospace" }
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "背景カラー" }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "color",
                  className: "admin-input",
                  value: form.bg_color,
                  onChange: (e) => handleChange("bg_color", e.target.value),
                  style: { width: 48, height: 38, padding: 2 }
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  className: "admin-input",
                  value: form.bg_color,
                  onChange: (e) => handleChange("bg_color", e.target.value),
                  style: { flex: 1, fontFamily: "monospace" }
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "説明" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "admin-input admin-textarea",
              value: form.description,
              onChange: (e) => handleChange("description", e.target.value),
              rows: 3,
              placeholder: "モジュールの説明"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "学習レベル（複数選択可）" }),
          /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 12, marginTop: 4 }, children: allLevels.map((level) => /* @__PURE__ */ jsxs("label", { style: {
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            background: form.levels.includes(level) ? "var(--accent-soft)" : "var(--bg-tint)",
            color: form.levels.includes(level) ? "var(--accent-deep)" : "var(--ink-1)",
            border: `1.5px solid ${form.levels.includes(level) ? "var(--accent)" : "var(--line-2)"}`
          }, children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: form.levels.includes(level),
                onChange: () => toggleLevel(level),
                style: { accentColor: "var(--accent)" }
              }
            ),
            level
          ] }, level)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-actions", children: [
        /* @__PURE__ */ jsx(Link, { to: "/admin/modules", className: "admin-btn", children: "キャンセル" }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "admin-btn admin-btn-primary", disabled: saving, children: saving ? "保存中..." : isEdit ? "更新する" : "作成する" })
      ] })
    ] })
  ] });
}
function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showImport, setShowImport] = useState(false);
  const perPage = 20;
  const ARTICLE_COLUMNS = [
    { key: "id", label: "ID", width: 8 },
    { key: "title", label: "タイトル", width: 40 },
    { key: "slug", label: "スラッグ", width: 20 },
    { key: "module_name", label: "モジュール", width: 15 },
    { key: "difficulty_name", label: "難易度", width: 10 },
    { key: "topic_name", label: "トピック", width: 15 },
    { key: "reading_time", label: "読了時間(分)", width: 12 },
    { key: "views", label: "閲覧数", width: 10 },
    { key: "excerpt", label: "摘録", width: 50 },
    { key: "status", label: "ステータス", width: 10 },
    { key: "created_at", label: "作成日", width: 15 }
  ];
  const handleExport = async () => {
    try {
      const { data } = await api.client.get("/articles", { params: { per_page: 9999, status: "all" } });
      const items = data.success ? data.data || [] : [];
      const rows = items.map((a) => {
        var _a, _b, _c, _d;
        return {
          id: a.id,
          title: a.title,
          slug: a.slug,
          module_name: ((_a = a.module) == null ? void 0 : _a.name) || "",
          difficulty_name: ((_b = a.difficulty) == null ? void 0 : _b.name) || "",
          topic_name: ((_c = a.topic) == null ? void 0 : _c.name) || "",
          reading_time: a.reading_time || 5,
          views: a.views || 0,
          excerpt: (a.excerpt || "").replace(/<[^>]*>/g, ""),
          status: a.status || "publish",
          created_at: ((_d = a.created_at) == null ? void 0 : _d.slice(0, 10)) || ""
        };
      });
      exportToExcel(rows, ARTICLE_COLUMNS, `記事一覧_全${rows.length}件_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`);
    } catch {
    }
  };
  const handleImport = async (rows) => {
    var _a, _b, _c;
    let success = 0;
    let failed = 0;
    const errors = [];
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const rowNum = i + 2;
      if (!((_a = r["タイトル"]) == null ? void 0 : _a.trim())) {
        failed++;
        errors.push({ row: rowNum, message: "タイトルが空です" });
        continue;
      }
      try {
        const body = { title: r["タイトル"], excerpt: r["摘録"] || "", reading_time: parseInt(r["読了時間(分)"] || "5") };
        const mod = (r["モジュール"] || "").toString().toLowerCase().trim();
        if (mod && SAP_MODULES.find((m) => {
          var _a2;
          return m.slug === mod || ((_a2 = m.code) == null ? void 0 : _a2.toLowerCase()) === mod;
        })) {
          const slug = SAP_MODULES.find((m) => {
            var _a2;
            return m.slug === mod || ((_a2 = m.code) == null ? void 0 : _a2.toLowerCase()) === mod;
          }).slug;
          body.module = slug;
        }
        const diffMap = { "初級": "beginner", "中級": "intermediate", "上級": "advanced" };
        const diff = (r["難易度"] || "").toString().trim();
        if (diff && diffMap[diff]) body.difficulty = diffMap[diff];
        await api.client.post("/articles", body);
        success++;
      } catch (e) {
        failed++;
        errors.push({ row: rowNum, message: ((_c = (_b = e.response) == null ? void 0 : _b.data) == null ? void 0 : _c.message) || "保存失敗" });
      }
    }
    if (success > 0) fetchArticles();
    return { success, failed, errors };
  };
  const fetchArticles = () => {
    setLoading(true);
    setError("");
    const params = { per_page: perPage, page, status: "all" };
    if (moduleFilter) params.module = moduleFilter;
    api.client.get("/articles", { params }).then(({ data }) => {
      if (data.success) {
        setArticles(data.data || []);
        setTotal(data.total || 0);
      } else setError(data.message || "取得失敗");
    }).catch(() => setError("APIエラー")).finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchArticles();
  }, [page, moduleFilter]);
  useEffect(() => {
    setSelectedIds([]);
  }, [page]);
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    if (!search.trim()) {
      fetchArticles();
      return;
    }
    setLoading(true);
    api.client.get("/articles/search", { params: { q: search, per_page: perPage } }).then(({ data }) => {
      if (data.success) {
        setArticles(data.data);
        setTotal(data.data.length);
      }
    }).catch(() => {
    }).finally(() => setLoading(false));
  };
  const handleBatchStatus = async (statusStr) => {
    for (const id of selectedIds) {
      try {
        await api.client.put(`/articles/${id}`, { status: statusStr });
      } catch {
      }
    }
    setArticles((prev) => prev.map((i) => selectedIds.includes(i.id) ? { ...i, status: statusStr } : i));
    setSelectedIds([]);
  };
  const paginated = articles;
  const allSelected = paginated.length > 0 && paginated.every((i) => selectedIds.includes(i.id));
  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? paginated.map((i) => i.id) : []);
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await api.client.delete(`/articles/${deleteId}`);
      if (res.data.success) {
        setArticles((prev) => prev.filter((a) => a.id !== deleteId));
        setTotal((prev) => Math.max(0, prev - 1));
      }
    } catch {
    }
    setDeleting(false);
    setDeleteId(null);
  };
  const totalPages = Math.ceil(total / perPage);
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsxs("div", { className: "admin-page-head", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { children: "記事管理" }),
        /* @__PURE__ */ jsxs("p", { className: "admin-page-desc", children: [
          "全 ",
          total,
          " 件の記事"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsx("button", { className: "admin-btn", onClick: handleExport, children: "📤 エクスポート" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn", onClick: () => setShowImport(true), children: "📥 インポート" }),
        /* @__PURE__ */ jsx(Link, { to: "/admin/articles/new", className: "admin-btn admin-btn-primary", children: "+ 新規記事" })
      ] })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "admin-error", children: error }),
    /* @__PURE__ */ jsxs("div", { className: "admin-search-bar", children: [
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            className: "admin-input",
            placeholder: "記事を検索...",
            value: search,
            onChange: (e) => setSearch(e.target.value)
          }
        ),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "admin-btn", children: "検索" })
      ] }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          className: "admin-input admin-input-sm",
          value: moduleFilter,
          onChange: (e) => {
            setModuleFilter(e.target.value);
            setPage(1);
          },
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "すべてのモジュール" }),
            SAP_MODULES.map((m) => /* @__PURE__ */ jsx("option", { value: m.slug, children: m.code }, m.slug))
          ]
        }
      )
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "読み込み中..." }) : articles.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "admin-empty", children: [
      /* @__PURE__ */ jsx("div", { className: "admin-empty-icon", children: "🎋" }),
      /* @__PURE__ */ jsx("p", { children: "まだ記事がありません" }),
      /* @__PURE__ */ jsx(Link, { to: "/admin/articles/new", className: "admin-btn admin-btn-primary", children: "最初の記事を作成" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "admin-table-wrap", children: /* @__PURE__ */ jsxs("table", { className: "admin-table", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { style: { width: 36 }, children: /* @__PURE__ */ jsx("input", { type: "checkbox", onChange: (e) => handleSelectAll(e.target.checked), checked: allSelected }) }),
          /* @__PURE__ */ jsx("th", { children: "タイトル" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-mobile", children: "モジュール" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-mobile", children: "難易度" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-tablet", children: "読了時間" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-tablet", children: "閲覧数" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-tablet col-hide-mobile", children: "作成日" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-mobile", children: "ステータス" }),
          /* @__PURE__ */ jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: articles.map((a) => {
          var _a;
          return /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("input", { type: "checkbox", checked: selectedIds.includes(a.id), onChange: (e) => setSelectedIds((prev) => e.target.checked ? [...prev, a.id] : prev.filter((id) => id !== a.id)) }) }),
            /* @__PURE__ */ jsx("td", { className: "admin-cell-title", children: a.title }),
            /* @__PURE__ */ jsx("td", { className: "col-hide-mobile", children: ((_a = a.module) == null ? void 0 : _a.name) || "—" }),
            /* @__PURE__ */ jsx("td", { className: "col-hide-mobile", children: a.difficulty ? /* @__PURE__ */ jsx("span", { className: `admin-diff-lv l${a.difficulty.slug === "beginner" ? 1 : a.difficulty.slug === "intermediate" ? 2 : 3}`, children: a.difficulty.name }) : "—" }),
            /* @__PURE__ */ jsxs("td", { className: "col-hide-tablet", children: [
              a.reading_time || "—",
              " min"
            ] }),
            /* @__PURE__ */ jsx("td", { className: "col-hide-tablet", children: a.views || 0 }),
            /* @__PURE__ */ jsx("td", { className: "admin-cell-date col-hide-tablet col-hide-mobile", children: new Date(a.created_at).toLocaleDateString("ja-JP") }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: "admin-actions", children: [
              /* @__PURE__ */ jsx(Link, { to: `/admin/articles/${a.id}/edit`, className: "admin-btn admin-btn-sm", children: "編集" }),
              /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm admin-btn-danger", onClick: () => setDeleteId(a.id), children: "削除" })
            ] }) })
          ] }, a.id);
        }) })
      ] }) }),
      selectedIds.length > 0 && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "var(--accent-soft)", borderRadius: "var(--r-md)", marginTop: 8 }, children: [
        /* @__PURE__ */ jsxs("span", { style: { fontSize: 13, fontWeight: 600, color: "var(--accent-deep)" }, children: [
          selectedIds.length,
          " 件選択中"
        ] }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm admin-btn-primary", onClick: () => handleBatchStatus("publish"), children: "公開する" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => handleBatchStatus("draft"), children: "下書きにする" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => setSelectedIds([]), style: { marginLeft: "auto" }, children: "解除" })
      ] }),
      totalPages > 1 && /* @__PURE__ */ jsx(Pagination, { page, totalPages, onChange: (p2) => setPage(p2) })
    ] }),
    showImport && /* @__PURE__ */ jsx(
      ImportModal,
      {
        columns: ARTICLE_COLUMNS,
        templateFilename: "記事インポート",
        onImport: handleImport,
        onClose: () => {
          setShowImport(false);
          fetchArticles();
        }
      }
    ),
    deleteId && /* @__PURE__ */ jsx("div", { className: "admin-overlay", onClick: () => !deleting && setDeleteId(null), children: /* @__PURE__ */ jsxs("div", { className: "admin-modal", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsx("h3", { children: "記事を削除しますか？" }),
      /* @__PURE__ */ jsx("p", { children: "この操作は取り消せません。" }),
      /* @__PURE__ */ jsxs("div", { className: "admin-modal-actions", children: [
        /* @__PURE__ */ jsx("button", { className: "admin-btn", onClick: () => setDeleteId(null), disabled: deleting, children: "キャンセル" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-danger", onClick: handleDelete, disabled: deleting, children: deleting ? "削除中..." : "削除する" })
      ] })
    ] }) })
  ] });
}
const DIFFICULTIES$1 = [
  { slug: "beginner", name: "初級" },
  { slug: "intermediate", name: "中級" },
  { slug: "advanced", name: "上級" }
];
const TOPICS = [
  { slug: "basic", name: "基本概念" },
  { slug: "master", name: "マスタ" },
  { slug: "transaction", name: "トランザクション" },
  { slug: "process", name: "プロセス" },
  { slug: "glossary", name: "用語集" },
  { slug: "trends", name: "SAPトレンド" },
  { slug: "career-guide", name: "転職ガイド" }
];
function ArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    module: "",
    difficulty: "",
    topic: "",
    reading_time: 5
  });
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.client.get(`/articles/${id}`).then(({ data }) => {
      var _a, _b, _c;
      if (data.success && data.data) {
        const a = data.data;
        setForm({
          title: a.title || "",
          excerpt: a.excerpt || "",
          content: a.content || "",
          module: ((_a = a.module) == null ? void 0 : _a.slug) || "",
          difficulty: ((_b = a.difficulty) == null ? void 0 : _b.slug) || "",
          topic: ((_c = a.topic) == null ? void 0 : _c.slug) || "",
          reading_time: a.reading_time || 5
        });
      }
    }).catch(() => setError("取得に失敗")).finally(() => setLoading(false));
  }, [id]);
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("タイトルは必須です。");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (isEdit) {
        const res = await api.client.put(`/articles/${id}`, form);
        if (res.data.success) navigate("/admin/articles");
        else setError(res.data.message || "更新失敗");
      } else {
        const res = await api.client.post("/articles", form);
        if (res.data.success) navigate("/admin/articles");
        else setError(res.data.message || "作成失敗");
      }
    } catch {
      setError("サーバーエラー");
    } finally {
      setSaving(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "admin-page", children: /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "読み込み中..." }) });
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsx("div", { className: "admin-page-head", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-crumb", children: [
        /* @__PURE__ */ jsx(Link, { to: "/admin/articles", children: "記事管理" }),
        /* @__PURE__ */ jsx("span", { className: "sep", children: " › " }),
        /* @__PURE__ */ jsx("span", { children: isEdit ? "編集" : "新規作成" })
      ] }),
      /* @__PURE__ */ jsx("h1", { children: isEdit ? "記事を編集" : "新規記事作成" })
    ] }) }),
    error && /* @__PURE__ */ jsx("div", { className: "admin-error", children: error }),
    /* @__PURE__ */ jsxs("form", { className: "admin-form", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsxs("label", { className: "admin-label", children: [
            "タイトル ",
            /* @__PURE__ */ jsx("span", { className: "admin-required", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "admin-input",
              value: form.title,
              onChange: (e) => handleChange("title", e.target.value),
              placeholder: "記事タイトル",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "摘録" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "admin-input admin-textarea",
              value: form.excerpt,
              onChange: (e) => handleChange("excerpt", e.target.value),
              rows: 3,
              placeholder: "短い説明文"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "内容" }),
          /* @__PURE__ */ jsx(HtmlEditor, { value: form.content, onChange: (v) => handleChange("content", v), placeholder: "記事内容を入力..." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "メタ情報" }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-row", children: [
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "モジュール" }),
            /* @__PURE__ */ jsxs("select", { className: "admin-input", value: form.module, onChange: (e) => handleChange("module", e.target.value), children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "選択なし" }),
              SAP_MODULES.map((m) => /* @__PURE__ */ jsxs("option", { value: m.slug, children: [
                m.code,
                " · ",
                m.name_ja
              ] }, m.slug))
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "難易度" }),
            /* @__PURE__ */ jsxs("select", { className: "admin-input", value: form.difficulty, onChange: (e) => handleChange("difficulty", e.target.value), children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "選択なし" }),
              DIFFICULTIES$1.map((d) => /* @__PURE__ */ jsx("option", { value: d.slug, children: d.name }, d.slug))
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "トピック" }),
            /* @__PURE__ */ jsxs("select", { className: "admin-input", value: form.topic, onChange: (e) => handleChange("topic", e.target.value), children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "選択なし" }),
              TOPICS.map((t) => /* @__PURE__ */ jsx("option", { value: t.slug, children: t.name }, t.slug))
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "読了時間 (分)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                className: "admin-input",
                value: form.reading_time,
                onChange: (e) => handleChange("reading_time", parseInt(e.target.value) || 5),
                min: 1,
                max: 120
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-actions", children: [
        /* @__PURE__ */ jsx(Link, { to: "/admin/articles", className: "admin-btn", children: "キャンセル" }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "admin-btn admin-btn-primary", disabled: saving, children: saving ? "保存中..." : isEdit ? "更新する" : "作成する" })
      ] })
    ] })
  ] });
}
const MOD_COLOR$5 = {
  fi: "#2f6d44",
  co: "#2641a1",
  mm: "#a25411",
  sd: "#b62a4a",
  pp: "#4828a8",
  hr: "#8a6212",
  abap: "#1f6f6f",
  basis: "#4a432d",
  s4: "#1864a3"
};
function CasesList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const perPage = 20;
  const fetch2 = () => {
    setLoading(true);
    setError("");
    api.client.get("/cases", { params: { per_page: 100, status: "all" } }).then(({ data }) => {
      if (data.success) setItems(data.data || []);
      else setError(data.message);
    }).catch(() => setError("APIエラー")).finally(() => setLoading(false));
  };
  useEffect(() => {
    fetch2();
  }, []);
  const toggleStatus = async (c) => {
    const ns = c.status === "publish" ? "draft" : "publish";
    try {
      const { data } = await api.client.put(`/cases/${c.id}`, { status: ns });
      if (data.success) setItems((prev) => prev.map((i) => i.id === c.id ? { ...i, status: ns } : i));
    } catch {
    }
  };
  const handleBatchStatus = async (status) => {
    for (const id of selectedIds) {
      try {
        await api.client.put(`/cases/${id}`, { status });
      } catch {
      }
    }
    setItems((prev) => prev.map((i) => selectedIds.includes(i.id) ? { ...i, status } : i));
    setSelectedIds([]);
  };
  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase().trim();
    return items.filter(
      (c) => {
        var _a;
        return c.title.toLowerCase().includes(q) || c.mods.some((m) => m.includes(q)) || c.location.toLowerCase().includes(q) || ((_a = c.company) == null ? void 0 : _a.toLowerCase().includes(q));
      }
    );
  }, [items, search]);
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  useEffect(() => {
    setPage(1);
  }, [search]);
  useEffect(() => {
    setSelectedIds([]);
  }, [page]);
  const allSelected = paginated.length > 0 && paginated.every((c) => selectedIds.includes(c.id));
  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? paginated.map((c) => c.id) : []);
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const { data } = await api.client.delete(`/cases/${deleteId}`);
      if (data.success) setItems((prev) => prev.filter((c) => c.id !== deleteId));
    } catch {
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };
  const toggleStyle = (c) => ({
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "3px 10px",
    borderRadius: 999,
    fontSize: 11.5,
    fontWeight: 600,
    background: c.status === "publish" ? "#d8ead9" : "#f0e7d2",
    color: c.status === "publish" ? "#3e7a52" : "#7a6e58",
    transition: "all .12s",
    userSelect: "none"
  });
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsxs("div", { className: "admin-page-head", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { children: "案件管理" }),
        /* @__PURE__ */ jsxs("p", { className: "admin-page-desc", children: [
          "全 ",
          items.length,
          " 件"
        ] })
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/admin/cases/new", className: "admin-btn admin-btn-primary", children: "+ 新規案件" })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "admin-error", children: error }),
    /* @__PURE__ */ jsxs("div", { className: "admin-search-bar", style: { flexWrap: "nowrap" }, children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          className: "admin-input",
          placeholder: "タイトル・スキル・勤務地を検索...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          style: { minWidth: 200 }
        }
      ),
      /* @__PURE__ */ jsxs("span", { style: { fontSize: 12, color: "var(--ink-3)", alignSelf: "center", whiteSpace: "nowrap" }, children: [
        filtered.length,
        " / ",
        items.length,
        " 件"
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "読み込み中..." }) : items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "admin-empty", children: [
      /* @__PURE__ */ jsx("div", { className: "admin-empty-icon", children: "🎋" }),
      /* @__PURE__ */ jsx("p", { children: "まだ案件がありません" })
    ] }) : filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "admin-empty", children: [
      /* @__PURE__ */ jsx("div", { className: "admin-empty-icon", children: "🔍" }),
      /* @__PURE__ */ jsx("p", { children: "検索条件に一致する案件がありません" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "admin-table-wrap", children: /* @__PURE__ */ jsxs("table", { className: "admin-table", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { style: { width: 36 }, children: /* @__PURE__ */ jsx("input", { type: "checkbox", onChange: (e) => handleSelectAll(e.target.checked), checked: allSelected }) }),
          /* @__PURE__ */ jsx("th", { children: "タイトル" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-mobile", children: "モジュール" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-tablet", children: "単価" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-tablet col-hide-mobile", children: "勤務地" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-tablet col-hide-mobile", children: "期間" }),
          /* @__PURE__ */ jsx("th", { className: "col-hide-mobile", children: "ステータス" }),
          /* @__PURE__ */ jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: paginated.map((c) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("input", { type: "checkbox", checked: selectedIds.includes(c.id), onChange: (e) => setSelectedIds((prev) => e.target.checked ? [...prev, c.id] : prev.filter((id) => id !== c.id)) }) }),
          /* @__PURE__ */ jsx("td", { className: "admin-cell-title", children: c.title }),
          /* @__PURE__ */ jsx("td", { className: "col-hide-mobile", children: /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 3 }, children: c.mods.map((m) => /* @__PURE__ */ jsx("span", { style: {
            display: "inline-block",
            padding: "1px 6px",
            borderRadius: 4,
            background: MOD_COLOR$5[m] || "#5a9d6e",
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            fontFamily: "monospace"
          }, children: m.toUpperCase() }, m)) }) }),
          /* @__PURE__ */ jsxs("td", { className: "col-hide-tablet", style: { fontWeight: 600, color: c.rate_max >= 85 ? "var(--rose)" : "var(--ink-0)" }, children: [
            "〜",
            c.rate_max,
            "万"
          ] }),
          /* @__PURE__ */ jsx("td", { className: "col-hide-tablet col-hide-mobile", children: c.location }),
          /* @__PURE__ */ jsx("td", { className: "col-hide-tablet col-hide-mobile", children: c.period }),
          /* @__PURE__ */ jsx("td", { className: "col-hide-mobile", children: /* @__PURE__ */ jsx(
            "span",
            {
              onClick: () => toggleStatus(c),
              style: toggleStyle(c),
              title: c.status === "publish" ? "クリックで下書きに変更" : "クリックで公開に変更",
              children: c.status === "publish" ? "✅ 公開" : "📝 下書き"
            }
          ) }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: "admin-actions", children: [
            /* @__PURE__ */ jsx(Link, { to: `/admin/cases/${c.id}/edit`, className: "admin-btn admin-btn-sm", children: "編集" }),
            /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm admin-btn-danger", onClick: () => setDeleteId(c.id), children: "削除" })
          ] }) })
        ] }, c.id)) })
      ] }) }),
      selectedIds.length > 0 && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "var(--accent-soft)", borderRadius: "var(--r-md)", marginTop: 8 }, children: [
        /* @__PURE__ */ jsxs("span", { style: { fontSize: 13, fontWeight: 600, color: "var(--accent-deep)" }, children: [
          selectedIds.length,
          " 件選択中"
        ] }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm admin-btn-primary", onClick: () => handleBatchStatus("publish"), children: "公開する" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => handleBatchStatus("draft"), children: "下書きにする" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => setSelectedIds([]), style: { marginLeft: "auto" }, children: "解除" })
      ] }),
      totalPages > 1 && /* @__PURE__ */ jsx(Pagination, { page, totalPages, onChange: (p2) => setPage(p2) })
    ] }),
    deleteId && /* @__PURE__ */ jsx("div", { className: "admin-overlay", onClick: () => !deleting && setDeleteId(null), children: /* @__PURE__ */ jsxs("div", { className: "admin-modal", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsx("h3", { children: "案件を削除しますか？" }),
      /* @__PURE__ */ jsx("p", { children: "この操作は取り消せません。" }),
      /* @__PURE__ */ jsxs("div", { className: "admin-modal-actions", children: [
        /* @__PURE__ */ jsx("button", { className: "admin-btn", onClick: () => setDeleteId(null), disabled: deleting, children: "キャンセル" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-danger", onClick: handleDelete, disabled: deleting, children: deleting ? "削除中..." : "削除する" })
      ] })
    ] }) })
  ] });
}
const MODULES = ["FI", "CO", "MM", "SD", "PP", "HR", "ABAP", "Basis", "S/4"];
const MOD_COLOR$4 = {
  fi: "#2f6d44",
  co: "#2641a1",
  mm: "#a25411",
  sd: "#b62a4a",
  pp: "#4828a8",
  hr: "#8a6212",
  abap: "#1f6f6f",
  basis: "#4a432d",
  s4: "#1864a3",
  "s/4": "#1864a3"
};
function CaseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    blurb: "",
    rate_min: "",
    rate_max: "",
    period: "",
    location: "",
    remote: "",
    utilization: "週5",
    experience: "",
    company: "",
    seats: 1,
    urgent: false,
    scarce: false,
    mods: [],
    skills_must: [],
    skills_want: []
  });
  const [skillMustInput, setSkillMustInput] = useState("");
  const [skillWantInput, setSkillWantInput] = useState("");
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.client.get(`/cases/${id}`).then(({ data }) => {
      var _a, _b;
      if (data.success && data.data) {
        const c = data.data;
        setForm({
          title: c.title || "",
          blurb: c.blurb || "",
          rate_min: ((_a = c.rate_min) == null ? void 0 : _a.toString()) || "",
          rate_max: ((_b = c.rate_max) == null ? void 0 : _b.toString()) || "",
          period: c.period || "",
          location: c.location || "",
          remote: c.remote || "",
          utilization: c.utilization || "週5",
          experience: c.experience || "",
          company: c.company || "",
          seats: c.seats || 1,
          urgent: !!c.urgent,
          scarce: !!c.scarce,
          mods: c.mods || [],
          skills_must: c.skills_must || [],
          skills_want: c.skills_want || []
        });
      }
    }).catch(() => setError("取得失敗")).finally(() => setLoading(false));
  }, [id]);
  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const toggleMod = (m) => {
    setForm((prev) => ({
      ...prev,
      mods: prev.mods.includes(m) ? prev.mods.filter((x) => x !== m) : [...prev.mods, m]
    }));
  };
  const addSkill = (field) => {
    const input = field === "skills_must" ? skillMustInput : skillWantInput;
    if (!input.trim()) return;
    setForm((prev) => ({ ...prev, [field]: [...prev[field], input.trim()] }));
    if (field === "skills_must") setSkillMustInput("");
    else setSkillWantInput("");
  };
  const removeSkill = (field, idx) => {
    setForm((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("タイトルは必須です。");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (isEdit) {
        const { data } = await api.client.put(`/cases/${id}`, form);
        if (data.success) navigate("/admin/cases");
        else setError(data.message || "更新失敗");
      } else {
        const { data } = await api.client.post("/cases", form);
        if (data.success) navigate("/admin/cases");
        else setError(data.message || "作成失敗");
      }
    } catch {
      setError("サーバーエラー");
    } finally {
      setSaving(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "admin-page", children: /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "読み込み中..." }) });
  const inputS = { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid var(--line-2)", fontFamily: "inherit", fontSize: 13, outline: "none" };
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsx("div", { className: "admin-page-head", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-crumb", children: [
        /* @__PURE__ */ jsx(Link, { to: "/admin/cases", children: "案件管理" }),
        /* @__PURE__ */ jsx("span", { className: "sep", children: " › " }),
        /* @__PURE__ */ jsx("span", { children: isEdit ? "編集" : "新規作成" })
      ] }),
      /* @__PURE__ */ jsx("h1", { children: isEdit ? "案件を編集" : "新規案件作成" })
    ] }) }),
    error && /* @__PURE__ */ jsx("div", { className: "admin-error", children: error }),
    /* @__PURE__ */ jsxs("form", { className: "admin-form", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsxs("label", { className: "admin-label", children: [
            "タイトル ",
            /* @__PURE__ */ jsx("span", { className: "admin-required", children: "*" })
          ] }),
          /* @__PURE__ */ jsx("input", { type: "text", style: inputS, value: form.title, onChange: (e) => handleChange("title", e.target.value), placeholder: "案件タイトル", required: true })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "概要（PR文）" }),
          /* @__PURE__ */ jsx("textarea", { style: { ...inputS, minHeight: 70, resize: "vertical" }, value: form.blurb, onChange: (e) => handleChange("blurb", e.target.value), placeholder: "案件の簡単な説明" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "案件詳細" }),
        /* @__PURE__ */ jsx("div", { className: "admin-form-row", children: /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "モジュール" }),
          /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" }, children: MODULES.map((m) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => toggleMod(m),
              style: {
                padding: "4px 10px",
                borderRadius: 999,
                border: "1.5px solid",
                cursor: "pointer",
                fontSize: 11.5,
                fontWeight: 600,
                fontFamily: "inherit",
                background: form.mods.includes(m) ? MOD_COLOR$4[m.toLowerCase()] || "#5a9d6e" : "var(--bg-card)",
                color: form.mods.includes(m) ? "#fff" : "var(--ink-1)",
                borderColor: form.mods.includes(m) ? "transparent" : "var(--line-2)"
              },
              children: m
            },
            m
          )) })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-row", children: [
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "最低単価（万円）" }),
            /* @__PURE__ */ jsx("input", { type: "number", style: inputS, value: form.rate_min, onChange: (e) => handleChange("rate_min", e.target.value), min: 0 })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "最高単価（万円）" }),
            /* @__PURE__ */ jsx("input", { type: "number", style: inputS, value: form.rate_max, onChange: (e) => handleChange("rate_max", e.target.value), min: 0 })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "募集人数" }),
            /* @__PURE__ */ jsx("input", { type: "number", style: inputS, value: form.seats, onChange: (e) => handleChange("seats", parseInt(e.target.value) || 1), min: 1 })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-row", children: [
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "勤務地" }),
            /* @__PURE__ */ jsx("input", { type: "text", style: inputS, value: form.location, onChange: (e) => handleChange("location", e.target.value), placeholder: "東京" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "リモート" }),
            /* @__PURE__ */ jsx("input", { type: "text", style: inputS, value: form.remote, onChange: (e) => handleChange("remote", e.target.value), placeholder: "一部リモート" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "稼働形態" }),
            /* @__PURE__ */ jsx("input", { type: "text", style: inputS, value: form.utilization, onChange: (e) => handleChange("utilization", e.target.value), placeholder: "週5" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-row", children: [
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "期間" }),
            /* @__PURE__ */ jsx("input", { type: "text", style: inputS, value: form.period, onChange: (e) => handleChange("period", e.target.value), placeholder: "6ヶ月〜" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "経験年数" }),
            /* @__PURE__ */ jsx("input", { type: "text", style: inputS, value: form.experience, onChange: (e) => handleChange("experience", e.target.value), placeholder: "3年以上" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "会社名" }),
            /* @__PURE__ */ jsx("input", { type: "text", style: inputS, value: form.company, onChange: (e) => handleChange("company", e.target.value), placeholder: "株式会社〜" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-row", children: [
          /* @__PURE__ */ jsx("div", { className: "admin-form-group", children: /* @__PURE__ */ jsxs("label", { style: { display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--ink-1)" }, children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked: form.urgent, onChange: (e) => handleChange("urgent", e.target.checked) }),
            " 急募"
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "admin-form-group", children: /* @__PURE__ */ jsxs("label", { style: { display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--ink-1)" }, children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked: form.scarce, onChange: (e) => handleChange("scarce", e.target.checked) }),
            " 残り僅か"
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "スキル" }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "必須スキル" }),
          /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }, children: form.skills_must.map((s, i) => /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 999, background: "var(--accent-soft)", color: "var(--accent-deep)", fontSize: 12, fontWeight: 600 }, children: [
            s,
            /* @__PURE__ */ jsx("span", { onClick: () => removeSkill("skills_must", i), style: { cursor: "pointer", fontSize: 14, lineHeight: 1 }, children: "×" })
          ] }, i)) }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 6 }, children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                style: inputS,
                value: skillMustInput,
                onChange: (e) => setSkillMustInput(e.target.value),
                placeholder: "スキル名を入力",
                onKeyDown: (e) => e.key === "Enter" && (e.preventDefault(), addSkill("skills_must"))
              }
            ),
            /* @__PURE__ */ jsx("button", { type: "button", className: "admin-btn admin-btn-sm", onClick: () => addSkill("skills_must"), children: "追加" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "歓迎スキル" }),
          /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }, children: form.skills_want.map((s, i) => /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 999, background: "var(--bg-tint)", color: "var(--ink-1)", fontSize: 12, fontWeight: 600 }, children: [
            s,
            /* @__PURE__ */ jsx("span", { onClick: () => removeSkill("skills_want", i), style: { cursor: "pointer", fontSize: 14, lineHeight: 1 }, children: "×" })
          ] }, i)) }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 6 }, children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                style: inputS,
                value: skillWantInput,
                onChange: (e) => setSkillWantInput(e.target.value),
                placeholder: "スキル名を入力",
                onKeyDown: (e) => e.key === "Enter" && (e.preventDefault(), addSkill("skills_want"))
              }
            ),
            /* @__PURE__ */ jsx("button", { type: "button", className: "admin-btn admin-btn-sm", onClick: () => addSkill("skills_want"), children: "追加" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-actions", children: [
        /* @__PURE__ */ jsx(Link, { to: "/admin/cases", className: "admin-btn", children: "キャンセル" }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "admin-btn admin-btn-primary", disabled: saving, children: saving ? "保存中..." : isEdit ? "更新する" : "作成する" })
      ] })
    ] })
  ] });
}
function VideosList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const perPage = 20;
  const fetch2 = () => {
    setLoading(true);
    setError("");
    api.client.get("/videos", { params: { per_page: 100, status: "all" } }).then(({ data }) => {
      if (data.success) setItems(data.data || []);
      else setError(data.message);
    }).catch(() => setError("APIエラー")).finally(() => setLoading(false));
  };
  useEffect(() => {
    fetch2();
  }, []);
  const toggleStatus = async (v) => {
    const ns = v.status === "publish" ? "draft" : "publish";
    try {
      const { data } = await api.client.put(`/videos/${v.id}`, { status: ns });
      if (data.success) setItems((prev) => prev.map((i) => i.id === v.id ? { ...i, status: ns } : i));
    } catch {
    }
  };
  const handleBatchStatus = async (status) => {
    for (const id of selectedIds) {
      try {
        await api.client.put(`/videos/${id}`, { status });
      } catch {
      }
    }
    setItems((prev) => prev.map((i) => selectedIds.includes(i.id) ? { ...i, status } : i));
    setSelectedIds([]);
  };
  const filtered = useMemo(() => {
    let result = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((v) => v.title.toLowerCase().includes(q));
    }
    if (moduleFilter) result = result.filter((v) => {
      var _a;
      return ((_a = v.module) == null ? void 0 : _a.slug) === moduleFilter;
    });
    return result;
  }, [items, search, moduleFilter]);
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  useEffect(() => {
    setPage(1);
  }, [search, moduleFilter]);
  const allSelected = paginated.length > 0 && paginated.every((v) => selectedIds.includes(v.id));
  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? paginated.map((v) => v.id) : []);
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const { data } = await api.client.delete(`/videos/${deleteId}`);
      if (data.success) setItems((prev) => prev.filter((v) => v.id !== deleteId));
    } catch {
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };
  const toggleStyle = (v) => ({
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "3px 10px",
    borderRadius: 999,
    fontSize: 11.5,
    fontWeight: 600,
    background: v.status === "publish" ? "#d8ead9" : "#f0e7d2",
    color: v.status === "publish" ? "#3e7a52" : "#7a6e58",
    transition: "all .12s",
    userSelect: "none"
  });
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsxs("div", { className: "admin-page-head", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { children: "動画管理" }),
        /* @__PURE__ */ jsxs("p", { className: "admin-page-desc", children: [
          "全 ",
          items.length,
          " 件"
        ] })
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/admin/videos/new", className: "admin-btn admin-btn-primary", children: "+ 新規動画" })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "admin-error", children: error }),
    /* @__PURE__ */ jsxs("div", { className: "admin-search-bar", style: { flexWrap: "nowrap" }, children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          className: "admin-input",
          placeholder: "タイトルを検索...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          style: { minWidth: 160 }
        }
      ),
      /* @__PURE__ */ jsxs("select", { className: "admin-input admin-input-sm", value: moduleFilter, onChange: (e) => setModuleFilter(e.target.value), children: [
        /* @__PURE__ */ jsx("option", { value: "", children: "すべてのモジュール" }),
        SAP_MODULES.map((m) => /* @__PURE__ */ jsx("option", { value: m.slug, children: m.code }, m.slug))
      ] }),
      /* @__PURE__ */ jsxs("span", { style: { fontSize: 12, color: "var(--ink-3)", alignSelf: "center", whiteSpace: "nowrap" }, children: [
        filtered.length,
        " / ",
        items.length,
        " 件"
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "読み込み中..." }) : items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "admin-empty", children: [
      /* @__PURE__ */ jsx("div", { className: "admin-empty-icon", children: "🎋" }),
      /* @__PURE__ */ jsx("p", { children: "まだ動画がありません" })
    ] }) : filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "admin-empty", children: [
      /* @__PURE__ */ jsx("div", { className: "admin-empty-icon", children: "🔍" }),
      /* @__PURE__ */ jsx("p", { children: "検索条件に一致する動画がありません" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "admin-table-wrap", children: /* @__PURE__ */ jsxs("table", { className: "admin-table", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { style: { width: 36 }, children: /* @__PURE__ */ jsx("input", { type: "checkbox", onChange: (e) => handleSelectAll(e.target.checked), checked: allSelected }) }),
          /* @__PURE__ */ jsx("th", { children: "サムネイル" }),
          /* @__PURE__ */ jsx("th", { children: "タイトル" }),
          /* @__PURE__ */ jsx("th", { children: "モジュール" }),
          /* @__PURE__ */ jsx("th", { children: "時間" }),
          /* @__PURE__ */ jsx("th", { children: "再生数" }),
          /* @__PURE__ */ jsx("th", { children: "YouTube" }),
          /* @__PURE__ */ jsx("th", { children: "ステータス" }),
          /* @__PURE__ */ jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: paginated.map((v) => {
          var _a;
          return /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("input", { type: "checkbox", checked: selectedIds.includes(v.id), onChange: (e) => setSelectedIds((prev) => e.target.checked ? [...prev, v.id] : prev.filter((id) => id !== v.id)) }) }),
            /* @__PURE__ */ jsx("td", { children: v.thumbnail ? /* @__PURE__ */ jsx("img", { src: v.thumbnail, alt: "", style: { width: 60, height: 34, borderRadius: 4, objectFit: "cover" } }) : v.youtube_id ? /* @__PURE__ */ jsx("img", { src: `https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`, alt: "", style: { width: 60, height: 34, borderRadius: 4, objectFit: "cover" } }) : /* @__PURE__ */ jsx("span", { style: { fontSize: 18 }, children: "🎬" }) }),
            /* @__PURE__ */ jsx("td", { className: "admin-cell-title", children: v.title }),
            /* @__PURE__ */ jsx("td", { children: ((_a = v.module) == null ? void 0 : _a.name) || "—" }),
            /* @__PURE__ */ jsx("td", { children: v.duration || "—" }),
            /* @__PURE__ */ jsx("td", { children: v.views || 0 }),
            /* @__PURE__ */ jsx("td", { children: v.youtube_id ? /* @__PURE__ */ jsx("a", { href: `https://youtube.com/watch?v=${v.youtube_id}`, target: "_blank", rel: "noopener noreferrer", style: { fontSize: 11, color: "var(--accent-deep)" }, children: "▶ 再生" }) : "—" }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(
              "span",
              {
                onClick: () => toggleStatus(v),
                style: toggleStyle(v),
                title: v.status === "publish" ? "クリックで下書きに変更" : "クリックで公開に変更",
                children: v.status === "publish" ? "✅ 公開" : "📝 下書き"
              }
            ) }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: "admin-actions", children: [
              /* @__PURE__ */ jsx(Link, { to: `/admin/videos/${v.id}/edit`, className: "admin-btn admin-btn-sm", children: "編集" }),
              /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm admin-btn-danger", onClick: () => setDeleteId(v.id), children: "削除" })
            ] }) })
          ] }, v.id);
        }) })
      ] }) }),
      selectedIds.length > 0 && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "var(--accent-soft)", borderRadius: "var(--r-md)", marginTop: 8 }, children: [
        /* @__PURE__ */ jsxs("span", { style: { fontSize: 13, fontWeight: 600, color: "var(--accent-deep)" }, children: [
          selectedIds.length,
          " 件選択中"
        ] }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm admin-btn-primary", onClick: () => handleBatchStatus("publish"), children: "公開する" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => handleBatchStatus("draft"), children: "下書きにする" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => setSelectedIds([]), style: { marginLeft: "auto" }, children: "解除" })
      ] }),
      totalPages > 1 && /* @__PURE__ */ jsx(Pagination, { page, totalPages, onChange: (p2) => setPage(p2) })
    ] }),
    deleteId && /* @__PURE__ */ jsx("div", { className: "admin-overlay", onClick: () => !deleting && setDeleteId(null), children: /* @__PURE__ */ jsxs("div", { className: "admin-modal", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsx("h3", { children: "動画を削除しますか？" }),
      /* @__PURE__ */ jsx("p", { children: "この操作は取り消せません。" }),
      /* @__PURE__ */ jsxs("div", { className: "admin-modal-actions", children: [
        /* @__PURE__ */ jsx("button", { className: "admin-btn", onClick: () => setDeleteId(null), disabled: deleting, children: "キャンセル" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-danger", onClick: handleDelete, disabled: deleting, children: deleting ? "削除中..." : "削除する" })
      ] })
    ] }) })
  ] });
}
function VideoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [duration, setDuration] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [module, setModule] = useState("");
  const [status, setStatus] = useState("publish");
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.client.get(`/videos/${id}`).then(({ data }) => {
      var _a;
      if (data.success && data.data) {
        const v = data.data;
        setTitle(v.title || "");
        setExcerpt(v.excerpt || "");
        setContent(v.content || "");
        setYoutubeId(v.youtube_id || "");
        setDuration(v.duration || "");
        setThumbnail(v.thumbnail || "");
        setModule(((_a = v.module) == null ? void 0 : _a.slug) || "");
        setStatus(v.status || "publish");
      }
    }).catch(() => setError("取得失敗")).finally(() => setLoading(false));
  }, [id]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("タイトルは必須です。");
      return;
    }
    setSaving(true);
    setError("");
    const payload = { title, excerpt, content, youtube_id: youtubeId, duration, thumbnail, module, status };
    try {
      if (isEdit) {
        const { data } = await api.client.put(`/videos/${id}`, payload);
        if (data.success) navigate("/admin/videos");
        else setError(data.message || "更新失敗");
      } else {
        const { data } = await api.client.post("/videos", payload);
        if (data.success) navigate("/admin/videos");
        else setError(data.message || "作成失敗");
      }
    } catch {
      setError("サーバーエラー");
    } finally {
      setSaving(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "admin-page", children: /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "読み込み中..." }) });
  const is = { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid var(--line-2)", fontFamily: "inherit", fontSize: 13, outline: "none" };
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsx("div", { className: "admin-page-head", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-crumb", children: [
        /* @__PURE__ */ jsx(Link, { to: "/admin/videos", children: "動画管理" }),
        /* @__PURE__ */ jsx("span", { className: "sep", children: " › " }),
        /* @__PURE__ */ jsx("span", { children: isEdit ? "編集" : "新規作成" })
      ] }),
      /* @__PURE__ */ jsx("h1", { children: isEdit ? "動画を編集" : "新規動画作成" })
    ] }) }),
    error && /* @__PURE__ */ jsx("div", { className: "admin-error", children: error }),
    /* @__PURE__ */ jsxs("form", { className: "admin-form", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsxs("label", { className: "admin-label", children: [
            "タイトル ",
            /* @__PURE__ */ jsx("span", { className: "admin-required", children: "*" })
          ] }),
          /* @__PURE__ */ jsx("input", { type: "text", style: is, value: title, onChange: (e) => setTitle(e.target.value), placeholder: "動画タイトル", required: true })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "摘録" }),
          /* @__PURE__ */ jsx("textarea", { style: { ...is, minHeight: 60, resize: "vertical" }, value: excerpt, onChange: (e) => setExcerpt(e.target.value), placeholder: "短い説明文" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "説明文" }),
          /* @__PURE__ */ jsx(HtmlEditor, { value: content, onChange: setContent, placeholder: "動画の説明を入力..." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "動画設定" }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-row", children: [
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "YouTube動画ID" }),
            /* @__PURE__ */ jsx("input", { type: "text", style: { ...is, fontFamily: "monospace" }, value: youtubeId, onChange: (e) => setYoutubeId(e.target.value), placeholder: "dQw4w9WgXcQ" }),
            youtubeId && /* @__PURE__ */ jsx("div", { style: { marginTop: 6 }, children: /* @__PURE__ */ jsx("img", { src: `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`, alt: "preview", style: { width: 160, borderRadius: 8, border: "1px solid var(--line-2)" } }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "再生時間" }),
            /* @__PURE__ */ jsx("input", { type: "text", style: is, value: duration, onChange: (e) => setDuration(e.target.value), placeholder: "32:14" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "サムネイルURL" }),
            /* @__PURE__ */ jsx("input", { type: "text", style: { ...is, fontFamily: "monospace", fontSize: 12 }, value: thumbnail, onChange: (e) => setThumbnail(e.target.value), placeholder: "https://example.com/thumb.jpg" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "モジュール" }),
            /* @__PURE__ */ jsxs("select", { style: is, value: module, onChange: (e) => setModule(e.target.value), children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "選択なし" }),
              SAP_MODULES.map((m) => /* @__PURE__ */ jsxs("option", { value: m.slug, children: [
                m.code,
                " · ",
                m.name_ja
              ] }, m.slug))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "ステータス" }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setStatus("publish"),
                style: {
                  flex: 1,
                  padding: "7px 0",
                  borderRadius: 8,
                  border: "1.5px solid",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: 600,
                  background: status === "publish" ? "var(--accent)" : "var(--bg-card)",
                  color: status === "publish" ? "white" : "var(--ink-1)",
                  borderColor: status === "publish" ? "var(--accent)" : "var(--line-2)"
                },
                children: "公開"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setStatus("draft"),
                style: {
                  flex: 1,
                  padding: "7px 0",
                  borderRadius: 8,
                  border: "1.5px solid",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: 600,
                  background: status === "draft" ? "var(--ink-3)" : "var(--bg-card)",
                  color: status === "draft" ? "white" : "var(--ink-1)",
                  borderColor: status === "draft" ? "var(--ink-3)" : "var(--line-2)"
                },
                children: "下書き"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-actions", children: [
        /* @__PURE__ */ jsx(Link, { to: "/admin/videos", className: "admin-btn", children: "キャンセル" }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "admin-btn admin-btn-primary", disabled: saving, children: saving ? "保存中..." : isEdit ? "更新する" : "作成する" })
      ] })
    ] })
  ] });
}
const STATUS_LABELS$1 = {
  pending: "未対応",
  contacted: "連絡済",
  approved: "成約",
  rejected: "不採用"
};
const STATUS_COLORS$1 = {
  pending: "#f0c33c",
  contacted: "#72aee6",
  approved: "#68de7c",
  rejected: "#e65054"
};
function ApplicationsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [detailApp, setDetailApp] = useState(null);
  const perPage = 20;
  const fetchData = () => {
    setLoading(true);
    setError("");
    api.client.get("/applications", { params: { per_page: perPage, page, status: statusFilter || void 0, s: search || void 0 } }).then(({ data }) => {
      if (data.success) {
        setItems(data.data || []);
        setTotal(data.total || 0);
      } else setError(data.message);
    }).catch(() => setError("取得失敗")).finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchData();
  }, [page, statusFilter]);
  useEffect(() => {
    setSelectedIds([]);
  }, [page, statusFilter]);
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };
  const updateStatus = async (id, newStatus) => {
    try {
      const { data } = await api.client.post("/applications", { id, status: newStatus });
      if (data.success) setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: newStatus } : i));
    } catch {
    }
  };
  const handleBatchStatus = async (newStatus) => {
    for (const id of selectedIds) {
      try {
        await api.client.post("/applications", { id, status: newStatus });
      } catch {
      }
    }
    setItems((prev) => prev.map((i) => selectedIds.includes(i.id) ? { ...i, status: newStatus } : i));
    setSelectedIds([]);
  };
  const totalPages = Math.ceil(total / perPage);
  const allSelected = items.length > 0 && items.every((a) => selectedIds.includes(a.id));
  const getSkillModules = (app) => {
    try {
      return JSON.parse(app.skill_modules) || [];
    } catch {
      return [];
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsx("div", { className: "admin-page-head", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { children: "応募管理" }),
      /* @__PURE__ */ jsxs("p", { className: "admin-page-desc", children: [
        "全 ",
        total,
        " 件"
      ] })
    ] }) }),
    error && /* @__PURE__ */ jsx("div", { className: "admin-error", children: error }),
    /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 12, marginBottom: 16 }, children: Object.entries(STATUS_LABELS$1).map(([k, v]) => /* @__PURE__ */ jsxs("div", { style: { flex: 1, padding: "14px 16px", borderRadius: "var(--r-md)", background: "var(--bg-card)", border: "1px solid var(--line-1)", textAlign: "center" }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontSize: 22, fontWeight: 700, color: STATUS_COLORS$1[k] }, children: items.filter((i) => i.status === k).length }),
      /* @__PURE__ */ jsx("div", { style: { fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }, children: v })
    ] }, k)) }),
    /* @__PURE__ */ jsxs("div", { className: "admin-search-bar", children: [
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            className: "admin-input",
            placeholder: "名前・メールを検索...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            style: { minWidth: 200 }
          }
        ),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "admin-btn", children: "検索" })
      ] }),
      /* @__PURE__ */ jsxs("select", { className: "admin-input admin-input-sm", value: statusFilter, onChange: (e) => {
        setStatusFilter(e.target.value);
        setPage(1);
      }, children: [
        /* @__PURE__ */ jsx("option", { value: "", children: "すべて" }),
        Object.entries(STATUS_LABELS$1).map(([k, v]) => /* @__PURE__ */ jsx("option", { value: k, children: v }, k))
      ] }),
      /* @__PURE__ */ jsxs("span", { style: { fontSize: 12, color: "var(--ink-3)", alignSelf: "center" }, children: [
        total,
        " 件"
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "読み込み中..." }) : items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "admin-empty", children: [
      /* @__PURE__ */ jsx("div", { className: "admin-empty-icon", children: "🎋" }),
      /* @__PURE__ */ jsx("p", { children: "応募がありません" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "admin-table-wrap", children: /* @__PURE__ */ jsxs("table", { className: "admin-table", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { style: { width: 36 }, children: /* @__PURE__ */ jsx("input", { type: "checkbox", onChange: (e) => {
            setSelectedIds(e.target.checked ? items.map((a) => a.id) : []);
          }, checked: allSelected }) }),
          /* @__PURE__ */ jsx("th", { children: "応募者" }),
          /* @__PURE__ */ jsx("th", { children: "メール" }),
          /* @__PURE__ */ jsx("th", { children: "案件" }),
          /* @__PURE__ */ jsx("th", { children: "単価" }),
          /* @__PURE__ */ jsx("th", { children: "経験" }),
          /* @__PURE__ */ jsx("th", { children: "ステータス" }),
          /* @__PURE__ */ jsx("th", { children: "応募日" }),
          /* @__PURE__ */ jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: items.map((a) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("input", { type: "checkbox", checked: selectedIds.includes(a.id), onChange: (e) => setSelectedIds((prev) => e.target.checked ? [...prev, a.id] : prev.filter((id) => id !== a.id)) }) }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("strong", { children: a.applicant_name }) }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("a", { href: `mailto:${a.applicant_email}`, style: { color: "var(--accent-deep)", fontSize: 12 }, children: a.applicant_email }) }),
          /* @__PURE__ */ jsx("td", { style: { fontSize: 12, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: a.case_id ? a.case_title || "—" : "汎用登録" }),
          /* @__PURE__ */ jsx("td", { children: a.expected_rate || "—" }),
          /* @__PURE__ */ jsx("td", { children: a.experience_years || "—" }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { style: {
            display: "inline-block",
            padding: "2px 10px",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 600,
            background: STATUS_COLORS$1[a.status] + "22",
            color: STATUS_COLORS$1[a.status]
          }, children: STATUS_LABELS$1[a.status] || a.status }) }),
          /* @__PURE__ */ jsx("td", { className: "admin-cell-date", children: new Date(a.created_at).toLocaleDateString("ja-JP") }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: "admin-actions", style: { flexDirection: "column", gap: 4 }, children: [
            /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => setDetailApp(a), children: "詳細" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                className: "admin-input",
                value: a.status,
                onChange: (e) => updateStatus(a.id, e.target.value),
                style: { fontSize: 11, padding: "2px 6px", borderRadius: 4 },
                children: Object.entries(STATUS_LABELS$1).map(([k, v]) => /* @__PURE__ */ jsx("option", { value: k, children: v }, k))
              }
            )
          ] }) })
        ] }, a.id)) })
      ] }) }),
      selectedIds.length > 0 && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "var(--accent-soft)", borderRadius: "var(--r-md)", marginTop: 8 }, children: [
        /* @__PURE__ */ jsxs("span", { style: { fontSize: 13, fontWeight: 600, color: "var(--accent-deep)" }, children: [
          selectedIds.length,
          " 件選択中"
        ] }),
        Object.entries(STATUS_LABELS$1).map(([k, v]) => /* @__PURE__ */ jsxs(
          "button",
          {
            className: "admin-btn admin-btn-sm",
            onClick: () => handleBatchStatus(k),
            style: { background: STATUS_COLORS$1[k] + "22", color: STATUS_COLORS$1[k], borderColor: STATUS_COLORS$1[k] },
            children: [
              v,
              "に変更"
            ]
          },
          k
        )),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => setSelectedIds([]), style: { marginLeft: "auto" }, children: "解除" })
      ] }),
      totalPages > 1 && /* @__PURE__ */ jsx(Pagination, { page, totalPages, onChange: setPage })
    ] }),
    detailApp && /* @__PURE__ */ jsx("div", { className: "admin-overlay", onClick: () => setDetailApp(null), children: /* @__PURE__ */ jsxs("div", { className: "admin-modal", onClick: (e) => e.stopPropagation(), style: { maxWidth: 560, maxHeight: "80vh", overflowY: "auto" }, children: [
      /* @__PURE__ */ jsx("button", { className: "case-modal-x", onClick: () => setDetailApp(null), "aria-label": "閉じる", children: "×" }),
      /* @__PURE__ */ jsxs("h3", { style: { fontFamily: "var(--font-display)", fontSize: 18, color: "var(--ink-0)", margin: "0 0 16px" }, children: [
        "📋 ",
        detailApp.applicant_name
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 13 }, children: [
        /* @__PURE__ */ jsxs("div", { style: detailRowStyle, children: [
          /* @__PURE__ */ jsx("span", { style: kStyle, children: "メール" }),
          /* @__PURE__ */ jsx("span", { children: detailApp.applicant_email })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: detailRowStyle, children: [
          /* @__PURE__ */ jsx("span", { style: kStyle, children: "電話" }),
          /* @__PURE__ */ jsx("span", { children: detailApp.applicant_phone || "—" })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: detailRowStyle, children: [
          /* @__PURE__ */ jsx("span", { style: kStyle, children: "案件" }),
          /* @__PURE__ */ jsx("span", { children: detailApp.case_title || "汎用登録" })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: detailRowStyle, children: [
          /* @__PURE__ */ jsx("span", { style: kStyle, children: "希望単価" }),
          /* @__PURE__ */ jsx("span", { children: detailApp.expected_rate || "—" })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: detailRowStyle, children: [
          /* @__PURE__ */ jsx("span", { style: kStyle, children: "経験年数" }),
          /* @__PURE__ */ jsx("span", { children: detailApp.experience_years || "—" })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: detailRowStyle, children: [
          /* @__PURE__ */ jsx("span", { style: kStyle, children: "応募日" }),
          /* @__PURE__ */ jsx("span", { children: new Date(detailApp.created_at).toLocaleDateString("ja-JP") })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: detailRowStyle, children: [
          /* @__PURE__ */ jsx("span", { style: kStyle, children: "ステータス" }),
          /* @__PURE__ */ jsx("span", { style: { color: STATUS_COLORS$1[detailApp.status], fontWeight: 600 }, children: STATUS_LABELS$1[detailApp.status] || detailApp.status })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: detailRowStyle, children: [
          /* @__PURE__ */ jsx("span", { style: kStyle, children: "履歴書" }),
          /* @__PURE__ */ jsx("span", { children: detailApp.resume_file ? /* @__PURE__ */ jsx("a", { href: detailApp.resume_file, target: "_blank", rel: "noopener noreferrer", style: { color: "var(--accent-deep)" }, children: "📎 ダウンロード" }) : "—" })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { gridColumn: "1/-1", padding: "8px 0" }, children: [
          /* @__PURE__ */ jsx("strong", { style: kStyle, children: "スキル" }),
          /* @__PURE__ */ jsx("div", { style: { marginTop: 4 }, children: getSkillModules(detailApp).length > 0 ? getSkillModules(detailApp).join("、") : "—" })
        ] })
      ] }),
      detailApp.self_pr && /* @__PURE__ */ jsxs("div", { style: { padding: "8px 0", borderTop: "1px solid var(--line-1)", marginTop: 8 }, children: [
        /* @__PURE__ */ jsx("strong", { style: kStyle, children: "自己PR" }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: "var(--ink-1)", lineHeight: 1.7, margin: "6px 0 0" }, children: detailApp.self_pr })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }, children: /* @__PURE__ */ jsx("button", { className: "btn", onClick: () => setDetailApp(null), children: "閉じる" }) })
    ] }) })
  ] });
}
const detailRowStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  padding: "6px 0",
  borderBottom: "1px solid var(--line-1)"
};
const kStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: "var(--ink-3)",
  letterSpacing: "0.04em",
  textTransform: "uppercase"
};
const ROLE_LABELS = {
  administrator: "管理者",
  editor: "編集者",
  author: "投稿者",
  subscriber: "メンバー"
};
const allRoles = Object.entries(ROLE_LABELS);
function UsersList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [batchRole, setBatchRole] = useState("");
  const [editId, setEditId] = useState(null);
  const [editRole, setEditRole] = useState("");
  const perPage = 20;
  const fetch2 = () => {
    setLoading(true);
    setError("");
    api.client.get("/users", { params: { per_page: perPage, page, s: search || void 0, role: roleFilter || void 0 } }).then(({ data }) => {
      if (data.success) {
        setItems(Array.isArray(data.data) ? data.data : []);
        setTotal(typeof data.total === "number" ? data.total : 0);
      } else setError(data.message || "取得失敗");
    }).catch((err) => {
      var _a, _b;
      return setError(((_b = (_a = err == null ? void 0 : err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || (err == null ? void 0 : err.message) || "APIエラー");
    }).finally(() => setLoading(false));
  };
  useEffect(() => {
    fetch2();
  }, [page, roleFilter]);
  useEffect(() => {
    setSelectedIds([]);
  }, [page, roleFilter]);
  const totalPages = Math.ceil(total / perPage);
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetch2();
  };
  const allSelected = items.length > 0 && items.every((u) => selectedIds.includes(u.id));
  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? items.map((u) => u.id) : []);
  };
  const changeUserRole = async (id, newRole) => {
    try {
      const { data } = await api.client.put(`/users/${id}`, { role: newRole });
      if (data.success) setItems((prev) => prev.map((u) => u.id === id ? { ...u, roles: [newRole] } : u));
    } catch {
    }
  };
  const applyBatchRole = async () => {
    if (!batchRole || selectedIds.length === 0) return;
    for (const id of selectedIds) {
      try {
        await api.client.put(`/users/${id}`, { role: batchRole });
      } catch {
      }
    }
    setItems((prev) => prev.map((u) => selectedIds.includes(u.id) ? { ...u, roles: [batchRole] } : u));
    setSelectedIds([]);
    setBatchRole("");
  };
  const handleBatchDelete = async () => {
    if (!selectedIds.length || !window.confirm(`${selectedIds.length} 人のユーザーを削除しますか？`)) return;
    const errors = [];
    for (const id of selectedIds) {
      try {
        const { data } = await api.client.delete(`/users/${id}`);
        if (!data.success) errors.push(data.message);
      } catch {
        errors.push(`ID ${id}: 削除失敗`);
      }
    }
    if (errors.length) alert(errors.join("\n"));
    setItems((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
    setTotal((prev) => Math.max(0, prev - selectedIds.length));
    setSelectedIds([]);
  };
  const resetPassword = async (id, name) => {
    var _a, _b, _c;
    if (!window.confirm(`${name} のパスワードをリセットし、新しいパスワードをメールで送信しますか？`)) return;
    try {
      const { data } = await api.client.post(`/users/${id}/reset-password`);
      alert(((_a = data.data) == null ? void 0 : _a.message) || "送信しました");
    } catch (err) {
      alert(((_c = (_b = err == null ? void 0 : err.response) == null ? void 0 : _b.data) == null ? void 0 : _c.message) || "リセット失敗");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsx("div", { className: "admin-page-head", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { children: "ユーザー管理" }),
      /* @__PURE__ */ jsxs("p", { className: "admin-page-desc", children: [
        "全 ",
        total,
        " ユーザー"
      ] })
    ] }) }),
    error && /* @__PURE__ */ jsx("div", { className: "admin-error", children: error }),
    /* @__PURE__ */ jsxs("div", { className: "admin-search-bar", children: [
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            className: "admin-input",
            placeholder: "名前・メールを検索...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            style: { minWidth: 200 }
          }
        ),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "admin-btn", children: "検索" })
      ] }),
      /* @__PURE__ */ jsxs("select", { className: "admin-input admin-input-sm", value: roleFilter, onChange: (e) => {
        setRoleFilter(e.target.value);
        setPage(1);
      }, children: [
        /* @__PURE__ */ jsx("option", { value: "", children: "すべてのロール" }),
        allRoles.map(([k, v]) => /* @__PURE__ */ jsx("option", { value: k, children: v }, k))
      ] }),
      /* @__PURE__ */ jsxs("span", { style: { fontSize: 12, color: "var(--ink-3)", alignSelf: "center" }, children: [
        total,
        " 人"
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "読み込み中..." }) : items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "admin-empty", children: [
      /* @__PURE__ */ jsx("div", { className: "admin-empty-icon", children: "🎋" }),
      /* @__PURE__ */ jsx("p", { children: "ユーザーがいません" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "admin-table-wrap", children: /* @__PURE__ */ jsxs("table", { className: "admin-table", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { style: { width: 36 }, children: /* @__PURE__ */ jsx("input", { type: "checkbox", onChange: (e) => handleSelectAll(e.target.checked), checked: allSelected }) }),
          /* @__PURE__ */ jsx("th", { children: "アバター" }),
          /* @__PURE__ */ jsx("th", { children: "名前" }),
          /* @__PURE__ */ jsx("th", { children: "メール" }),
          /* @__PURE__ */ jsx("th", { children: "ロール" }),
          /* @__PURE__ */ jsx("th", { children: "登録日" }),
          /* @__PURE__ */ jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: items.map((u) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("input", { type: "checkbox", checked: selectedIds.includes(u.id), onChange: (e) => setSelectedIds((prev) => e.target.checked ? [...prev, u.id] : prev.filter((id) => id !== u.id)) }) }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("img", { src: u.avatar_url, alt: "", style: { width: 32, height: 32, borderRadius: "50%", objectFit: "cover", background: "var(--bg-tint)" }, onError: (e) => {
            e.target.style.display = "none";
          } }) }),
          /* @__PURE__ */ jsx("td", { style: { fontWeight: 600 }, children: u.display_name }),
          /* @__PURE__ */ jsx("td", { style: { fontSize: 12 }, children: u.email }),
          /* @__PURE__ */ jsx("td", { children: editId === u.id ? /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 4, alignItems: "center" }, children: [
            /* @__PURE__ */ jsx(
              "select",
              {
                className: "admin-input",
                value: editRole,
                onChange: (e) => setEditRole(e.target.value),
                style: { fontSize: 11, padding: "2px 6px", borderRadius: 4 },
                children: allRoles.map(([k, v]) => /* @__PURE__ */ jsx("option", { value: k, children: v }, k))
              }
            ),
            /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => {
              changeUserRole(u.id, editRole);
              setEditId(null);
            }, children: "保存" }),
            /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => setEditId(null), children: "取消" })
          ] }) : /* @__PURE__ */ jsxs(
            "span",
            {
              style: { cursor: "pointer" },
              onClick: () => {
                setEditId(u.id);
                setEditRole(u.roles[0] || "subscriber");
              },
              title: "クリックしてロール変更",
              children: [
                u.roles.map((r) => ROLE_LABELS[r] || r).join(", "),
                " ✏"
              ]
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "admin-cell-date", children: new Date(u.registered_at).toLocaleDateString("ja-JP") }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: "admin-actions", style: { flexDirection: "column", gap: 4 }, children: [
            u.roles.includes("administrator") ? /* @__PURE__ */ jsx("span", { style: { fontSize: 11, color: "var(--ink-3)", padding: "4px 0", display: "inline-block" }, children: "🔒 保護" }) : /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm admin-btn-danger", onClick: async () => {
              var _a, _b;
              if (!window.confirm(`${u.display_name} を削除しますか？`)) return;
              try {
                const { data } = await api.client.delete(`/users/${u.id}`);
                if (!data.success) {
                  alert(data.message);
                  return;
                }
                setItems((prev) => prev.filter((i) => i.id !== u.id));
                setTotal((prev) => prev - 1);
              } catch (err) {
                alert(((_b = (_a = err == null ? void 0 : err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "削除失敗");
              }
            }, children: "削除" }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                className: "admin-btn admin-btn-sm",
                onClick: () => resetPassword(u.id, u.display_name),
                style: { fontSize: 10.5 },
                children: [
                  "🔑 パスワード",
                  /* @__PURE__ */ jsx("br", {}),
                  "リセット"
                ]
              }
            )
          ] }) })
        ] }, u.id)) })
      ] }) }),
      selectedIds.length > 0 && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "var(--accent-soft)", borderRadius: "var(--r-md)", marginTop: 8, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxs("span", { style: { fontSize: 13, fontWeight: 600, color: "var(--accent-deep)" }, children: [
          selectedIds.length,
          " 件選択中"
        ] }),
        /* @__PURE__ */ jsxs("select", { className: "admin-input admin-input-sm", value: batchRole, onChange: (e) => setBatchRole(e.target.value), style: { fontSize: 12 }, children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "ロールを変更" }),
          allRoles.map(([k, v]) => /* @__PURE__ */ jsxs("option", { value: k, children: [
            v,
            "にする"
          ] }, k))
        ] }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm admin-btn-primary", disabled: !batchRole, onClick: applyBatchRole, children: "適用" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm admin-btn-danger", onClick: handleBatchDelete, children: "削除" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => setSelectedIds([]), style: { marginLeft: "auto" }, children: "解除" })
      ] }),
      totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "admin-pagination", children: [
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", disabled: page <= 1, onClick: () => setPage((p2) => p2 - 1), children: "← 前へ" }),
        Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
          let p2;
          if (totalPages <= 10) p2 = i + 1;
          else if (page <= 5) p2 = i + 1;
          else if (page >= totalPages - 4) p2 = totalPages - 9 + i;
          else p2 = page - 5 + i;
          if (p2 >= 1 && p2 <= totalPages) {
            return /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setPage(p2),
                className: "admin-btn admin-btn-sm",
                style: { minWidth: 34, justifyContent: "center", background: p2 === page ? "var(--accent)" : "", color: p2 === page ? "white" : "", borderColor: p2 === page ? "var(--accent)" : "" },
                children: p2
              },
              p2
            );
          }
          return null;
        }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", disabled: page >= totalPages, onClick: () => setPage((p2) => p2 + 1), children: "次へ →" }),
        /* @__PURE__ */ jsxs("span", { style: { fontSize: 12, color: "var(--ink-3)", marginLeft: 8 }, children: [
          page,
          " / ",
          totalPages
        ] })
      ] })
    ] })
  ] });
}
const PAGE_SLUGS = ["about", "team", "privacy", "terms"];
function SitePages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [saving, setSaving] = useState(false);
  const fetchPages = async () => {
    setLoading(true);
    const result = [];
    for (const slug of PAGE_SLUGS) {
      try {
        const { data } = await api.client.get("/pages", { params: { slug } });
        if (data.success && data.data) result.push(data.data);
      } catch {
      }
    }
    setItems(result);
    setLoading(false);
  };
  useEffect(() => {
    fetchPages();
  }, []);
  const openEditor = (p2) => {
    setEditSlug(p2.slug);
    setEditTitle(p2.title || p2.slug);
    setEditContent(p2.content || "");
    setEditSubtitle(p2.subtitle || "");
  };
  const savePage = async () => {
    setSaving(true);
    setError("");
    try {
      const { data } = await api.client.post("/pages", {
        slug: editSlug,
        title: editTitle,
        content: editContent,
        subtitle: editSubtitle
      });
      if (data.success) {
        setItems((prev) => {
          var _a;
          const exists = prev.find((p2) => p2.slug === editSlug);
          if (exists) {
            return prev.map((p2) => p2.slug === editSlug ? { ...p2, title: editTitle, content: editContent, subtitle: editSubtitle, updated_at: (/* @__PURE__ */ new Date()).toISOString() } : p2);
          }
          return [...prev, { id: ((_a = data.data) == null ? void 0 : _a.id) || 0, slug: editSlug, title: editTitle, content: editContent, excerpt: "", subtitle: editSubtitle, meta: "", updated_at: (/* @__PURE__ */ new Date()).toISOString() }];
        });
        setEditSlug("");
      } else setError(data.message || "保存失敗");
    } catch {
      setError("保存失敗");
    } finally {
      setSaving(false);
    }
  };
  const pageLabels = {
    about: "サイトについて",
    team: "執筆メンバー",
    privacy: "プライバシーポリシー",
    terms: "利用規約"
  };
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsx("div", { className: "admin-page-head", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { children: "固定ページ管理" }),
      /* @__PURE__ */ jsx("p", { className: "admin-page-desc", children: "サイトの固定ページ内容を管理します" })
    ] }) }),
    error && /* @__PURE__ */ jsx("div", { className: "admin-error", children: error }),
    loading ? /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "読み込み中..." }) : editSlug ? /* @__PURE__ */ jsxs("div", { className: "admin-form", children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "admin-crumb", style: { marginBottom: 12 }, children: [
          /* @__PURE__ */ jsx("span", { onClick: () => setEditSlug(""), style: { cursor: "pointer", color: "var(--accent-deep)" }, children: "固定ページ管理" }),
          /* @__PURE__ */ jsx("span", { className: "sep", children: " › " }),
          /* @__PURE__ */ jsx("span", { children: pageLabels[editSlug] || editSlug })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }, children: /* @__PURE__ */ jsx("button", { className: "admin-btn", onClick: () => setEditSlug(""), style: { fontSize: 12.5 }, children: "← 一覧に戻る" }) }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "タイトル" }),
          /* @__PURE__ */ jsx("input", { type: "text", className: "admin-input", value: editTitle, onChange: (e) => setEditTitle(e.target.value), style: { width: "100%" } })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "サブタイトル" }),
          /* @__PURE__ */ jsx("input", { type: "text", className: "admin-input", value: editSubtitle, onChange: (e) => setEditSubtitle(e.target.value), style: { width: "100%" } })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "本文" }),
          /* @__PURE__ */ jsx(HtmlEditor, { value: editContent, onChange: setEditContent, placeholder: "ページ内容を入力..." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-actions", children: [
        /* @__PURE__ */ jsx("button", { className: "admin-btn", onClick: () => setEditSlug(""), children: "キャンセル" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-primary", onClick: savePage, disabled: saving, children: saving ? "保存中..." : "保存する" })
      ] })
    ] }) : /* @__PURE__ */ jsx("div", { className: "admin-table-wrap", children: /* @__PURE__ */ jsxs("table", { className: "admin-table", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { children: "スラッグ" }),
        /* @__PURE__ */ jsx("th", { children: "ページ名" }),
        /* @__PURE__ */ jsx("th", { children: "タイトル" }),
        /* @__PURE__ */ jsx("th", { children: "更新日" }),
        /* @__PURE__ */ jsx("th", { children: "操作" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: PAGE_SLUGS.map((slug) => {
        const p2 = items.find((i) => i.slug === slug);
        return /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsxs("td", { style: { fontFamily: "monospace", fontSize: 12 }, children: [
            "/",
            slug
          ] }),
          /* @__PURE__ */ jsx("td", { style: { fontWeight: 600 }, children: pageLabels[slug] || slug }),
          /* @__PURE__ */ jsx("td", { children: (p2 == null ? void 0 : p2.title) || "—" }),
          /* @__PURE__ */ jsx("td", { className: "admin-cell-date", children: (p2 == null ? void 0 : p2.updated_at) ? new Date(p2.updated_at).toLocaleDateString("ja-JP") : "未作成" }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => openEditor(p2 || { slug, title: pageLabels[slug] || slug, content: "", subtitle: "" }), children: "編集" }) })
        ] }, slug);
      }) })
    ] }) })
  ] });
}
const DIFF_LABELS = { beginner: "初級", intermediate: "中級", advanced: "上級" };
const DIFF_OPTIONS = [
  { slug: "beginner", name: "初級" },
  { slug: "intermediate", name: "中級" },
  { slug: "advanced", name: "上級" }
];
function QuizList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [diffFilter, setDiffFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const perPage = 20;
  const fetch2 = () => {
    setLoading(true);
    setError("");
    api.client.get("/quizzes", { params: { per_page: 100 } }).then(({ data }) => {
      if (data.success) setItems(data.data || []);
      else setError(data.message);
    }).catch(() => setError("APIエラー")).finally(() => setLoading(false));
  };
  useEffect(() => {
    fetch2();
  }, []);
  const filtered = useMemo(() => {
    let result = items;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((item) => item.title.toLowerCase().includes(q) || item.explanation.toLowerCase().includes(q));
    }
    if (moduleFilter) result = result.filter((item) => {
      var _a;
      return ((_a = item.module) == null ? void 0 : _a.slug) === moduleFilter;
    });
    if (diffFilter) result = result.filter((item) => item.difficulty === diffFilter);
    if (dateFilter) result = result.filter((item) => (item.date || "") === dateFilter);
    return result;
  }, [items, search, moduleFilter, diffFilter, dateFilter]);
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  useEffect(() => {
    setPage(1);
  }, [search, moduleFilter, diffFilter, dateFilter]);
  useEffect(() => {
    setSelectedIds([]);
  }, [page]);
  const allSelected = paginated.length > 0 && paginated.every((q) => selectedIds.includes(q.id));
  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? paginated.map((q) => q.id) : []);
  };
  const toggleStatus = async (q) => {
    const ns = q.status === "publish" ? "draft" : "publish";
    try {
      const { data } = await api.client.put(`/quizzes/${q.id}`, { status: ns });
      if (data.success) setItems((prev) => prev.map((i) => i.id === q.id ? { ...i, status: ns } : i));
    } catch {
    }
  };
  const handleBatchStatus = async (status) => {
    for (const id of selectedIds) {
      try {
        await api.client.put(`/quizzes/${id}`, { status });
      } catch {
      }
    }
    setItems((prev) => prev.map((i) => selectedIds.includes(i.id) ? { ...i, status } : i));
    setSelectedIds([]);
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const { data } = await api.client.delete(`/quizzes/${deleteId}`);
      if (data.success) setItems((prev) => prev.filter((q) => q.id !== deleteId));
    } catch {
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };
  const toggleStyle = (q) => ({
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "3px 10px",
    borderRadius: 999,
    fontSize: 11.5,
    fontWeight: 600,
    background: q.status === "publish" ? "#d8ead9" : "#f0e7d2",
    color: q.status === "publish" ? "#3e7a52" : "#7a6e58",
    transition: "all .12s",
    userSelect: "none"
  });
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsxs("div", { className: "admin-page-head", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { children: "クイズ管理" }),
        /* @__PURE__ */ jsxs("p", { className: "admin-page-desc", children: [
          "全 ",
          items.length,
          " 問"
        ] })
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/admin/quizzes/new", className: "admin-btn admin-btn-primary", children: "+ 新規クイズ" })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "admin-error", children: error }),
    /* @__PURE__ */ jsxs("div", { className: "admin-search-bar", style: { flexWrap: "nowrap" }, children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          className: "admin-input",
          placeholder: "問題文・解説を検索...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          style: { minWidth: 140 }
        }
      ),
      /* @__PURE__ */ jsxs(
        "select",
        {
          className: "admin-input admin-input-sm",
          value: moduleFilter,
          onChange: (e) => setModuleFilter(e.target.value),
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "すべてのモジュール" }),
            SAP_MODULES.map((m) => /* @__PURE__ */ jsx("option", { value: m.slug, children: m.code }, m.slug))
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "select",
        {
          className: "admin-input admin-input-sm",
          value: diffFilter,
          onChange: (e) => setDiffFilter(e.target.value),
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "すべての難易度" }),
            DIFF_OPTIONS.map((d) => /* @__PURE__ */ jsx("option", { value: d.slug, children: d.name }, d.slug))
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }, children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "date",
            className: "admin-input",
            value: dateFilter,
            onChange: (e) => setDateFilter(e.target.value),
            style: { width: 140, padding: "7px 10px", fontSize: 12 }
          }
        ),
        dateFilter && /* @__PURE__ */ jsx("span", { onClick: () => setDateFilter(""), style: { cursor: "pointer", fontSize: 15, color: "var(--ink-3)", padding: "0 4px", userSelect: "none" }, children: "×" })
      ] }),
      /* @__PURE__ */ jsxs("span", { style: { fontSize: 12, color: "var(--ink-3)", alignSelf: "center", whiteSpace: "nowrap" }, children: [
        filtered.length,
        " / ",
        items.length,
        " 件"
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "読み込み中..." }) : items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "admin-empty", children: [
      /* @__PURE__ */ jsx("div", { className: "admin-empty-icon", children: "🎋" }),
      /* @__PURE__ */ jsx("p", { children: "まだクイズがありません" })
    ] }) : filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "admin-empty", children: [
      /* @__PURE__ */ jsx("div", { className: "admin-empty-icon", children: "🔍" }),
      /* @__PURE__ */ jsx("p", { children: "検索条件に一致するクイズがありません" }),
      /* @__PURE__ */ jsx("button", { className: "admin-btn", style: { marginTop: 12 }, onClick: () => {
        setSearch("");
        setModuleFilter("");
        setDiffFilter("");
        setDateFilter("");
      }, children: "クリア" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "admin-table-wrap", children: /* @__PURE__ */ jsxs("table", { className: "admin-table", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { style: { width: 36 }, children: /* @__PURE__ */ jsx("input", { type: "checkbox", onChange: (e) => handleSelectAll(e.target.checked), checked: allSelected }) }),
          /* @__PURE__ */ jsx("th", { children: "問題文" }),
          /* @__PURE__ */ jsx("th", { children: "正解" }),
          /* @__PURE__ */ jsx("th", { children: "モジュール" }),
          /* @__PURE__ */ jsx("th", { children: "難易度" }),
          /* @__PURE__ */ jsx("th", { children: "実施日" }),
          /* @__PURE__ */ jsx("th", { children: "ステータス" }),
          /* @__PURE__ */ jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: paginated.map((q) => {
          var _a;
          const correctIdx = q.options.findIndex((o) => o.correct);
          return /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("input", { type: "checkbox", checked: selectedIds.includes(q.id), onChange: (e) => setSelectedIds((prev) => e.target.checked ? [...prev, q.id] : prev.filter((id) => id !== q.id)) }) }),
            /* @__PURE__ */ jsx("td", { className: "admin-cell-title", children: q.title }),
            /* @__PURE__ */ jsx("td", { style: { fontSize: 12 }, children: correctIdx >= 0 ? String.fromCharCode(65 + correctIdx) : "—" }),
            /* @__PURE__ */ jsx("td", { children: ((_a = q.module) == null ? void 0 : _a.name) || "—" }),
            /* @__PURE__ */ jsx("td", { children: q.difficulty ? /* @__PURE__ */ jsx("span", { className: `admin-diff-lv l${q.difficulty === "beginner" ? 1 : q.difficulty === "intermediate" ? 2 : 3}`, children: DIFF_LABELS[q.difficulty] }) : "—" }),
            /* @__PURE__ */ jsx("td", { className: "admin-cell-date", children: q.date || "—" }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(
              "span",
              {
                onClick: () => toggleStatus(q),
                style: toggleStyle(q),
                title: q.status === "publish" ? "クリックで下書きに変更" : "クリックで公開に変更",
                children: q.status === "publish" ? "✅ 公開" : "📝 下書き"
              }
            ) }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: "admin-actions", children: [
              /* @__PURE__ */ jsx(Link, { to: `/admin/quizzes/${q.id}/edit`, className: "admin-btn admin-btn-sm", children: "編集" }),
              /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm admin-btn-danger", onClick: () => setDeleteId(q.id), children: "削除" })
            ] }) })
          ] }, q.id);
        }) })
      ] }) }),
      selectedIds.length > 0 && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "var(--accent-soft)", borderRadius: "var(--r-md)", marginTop: 8 }, children: [
        /* @__PURE__ */ jsxs("span", { style: { fontSize: 13, fontWeight: 600, color: "var(--accent-deep)" }, children: [
          selectedIds.length,
          " 件選択中"
        ] }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm admin-btn-primary", onClick: () => handleBatchStatus("publish"), children: "公開する" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => handleBatchStatus("draft"), children: "下書きにする" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => setSelectedIds([]), style: { marginLeft: "auto" }, children: "解除" })
      ] }),
      totalPages > 1 && /* @__PURE__ */ jsx(Pagination, { page, totalPages, onChange: (p2) => setPage(p2) })
    ] }),
    deleteId && /* @__PURE__ */ jsx("div", { className: "admin-overlay", onClick: () => !deleting && setDeleteId(null), children: /* @__PURE__ */ jsxs("div", { className: "admin-modal", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsx("h3", { children: "クイズを削除しますか？" }),
      /* @__PURE__ */ jsx("p", { children: "この操作は取り消せません。" }),
      /* @__PURE__ */ jsxs("div", { className: "admin-modal-actions", children: [
        /* @__PURE__ */ jsx("button", { className: "admin-btn", onClick: () => setDeleteId(null), disabled: deleting, children: "キャンセル" }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-danger", onClick: handleDelete, disabled: deleting, children: deleting ? "削除中..." : "削除する" })
      ] })
    ] }) })
  ] });
}
const DIFFICULTIES = [
  { slug: "beginner", name: "初級" },
  { slug: "intermediate", name: "中級" },
  { slug: "advanced", name: "上級" }
];
function QuizForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState([
    { text: "", correct: false },
    { text: "", correct: false },
    { text: "", correct: false },
    { text: "", correct: false }
  ]);
  const [explanation, setExplanation] = useState("");
  const [date, setDate] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [module, setModule] = useState("");
  const [status, setStatus] = useState("publish");
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.client.get(`/quizzes/${id}`).then(({ data }) => {
      var _a;
      if (data.success && data.data) {
        const q = data.data;
        setTitle(q.title || "");
        setOptions(q.options || [{ text: "", correct: false }, { text: "", correct: false }, { text: "", correct: false }, { text: "", correct: false }]);
        setExplanation(q.explanation || "");
        setDate(q.date || "");
        setDifficulty(q.difficulty || "");
        setModule(((_a = q.module) == null ? void 0 : _a.slug) || "");
      }
    }).catch(() => setError("取得に失敗")).finally(() => setLoading(false));
  }, [id]);
  const handleOptionText = (i, text) => {
    setOptions((prev) => prev.map((o, j) => j === i ? { ...o, text } : o));
  };
  const handleCorrect = (i) => {
    setOptions((prev) => prev.map((o, j) => ({ ...o, correct: j === i })));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("問題文は必須です。");
      return;
    }
    if (options.some((o) => !o.text.trim())) {
      setError("すべての選択肢を入力してください。");
      return;
    }
    if (!options.some((o) => o.correct)) {
      setError("正解を選択してください。");
      return;
    }
    setSaving(true);
    setError("");
    const payload = { title, options, explanation, date, difficulty, module, status };
    try {
      if (isEdit) {
        const { data } = await api.client.put(`/quizzes/${id}`, payload);
        if (data.success) navigate("/admin/quizzes");
        else setError(data.message || "更新失敗");
      } else {
        const { data } = await api.client.post("/quizzes", payload);
        if (data.success) navigate("/admin/quizzes");
        else setError(data.message || "作成失敗");
      }
    } catch {
      setError("サーバーエラー");
    } finally {
      setSaving(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "admin-page", children: /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "読み込み中..." }) });
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsx("div", { className: "admin-page-head", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-crumb", children: [
        /* @__PURE__ */ jsx(Link, { to: "/admin/quizzes", children: "クイズ管理" }),
        /* @__PURE__ */ jsx("span", { className: "sep", children: " › " }),
        /* @__PURE__ */ jsx("span", { children: isEdit ? "編集" : "新規作成" })
      ] }),
      /* @__PURE__ */ jsx("h1", { children: isEdit ? "クイズを編集" : "新規クイズ作成" })
    ] }) }),
    error && /* @__PURE__ */ jsx("div", { className: "admin-error", children: error }),
    /* @__PURE__ */ jsxs("form", { className: "admin-form", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsxs("label", { className: "admin-label", children: [
            "問題文 ",
            /* @__PURE__ */ jsx("span", { className: "admin-required", children: "*" })
          ] }),
          /* @__PURE__ */ jsx("textarea", { className: "admin-input admin-textarea", value: title, onChange: (e) => setTitle(e.target.value), rows: 3, placeholder: "クイズの問題文", required: true })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsxs("label", { className: "admin-label", children: [
            "選択肢 ",
            /* @__PURE__ */ jsx("span", { className: "admin-required", children: "*" })
          ] }),
          options.map((o, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: 13, fontWeight: 700, color: "var(--ink-2)", width: 20 }, children: String.fromCharCode(65 + i) }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "admin-input",
                value: o.text,
                onChange: (e) => handleOptionText(i, e.target.value),
                placeholder: `選択肢 ${String.fromCharCode(65 + i)}`,
                style: { flex: 1 }
              }
            ),
            /* @__PURE__ */ jsxs("label", { style: { display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }, children: [
              /* @__PURE__ */ jsx("input", { type: "radio", name: "correct", checked: o.correct, onChange: () => handleCorrect(i) }),
              "正解"
            ] })
          ] }, i))
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "解説" }),
          /* @__PURE__ */ jsx("textarea", { className: "admin-input admin-textarea", value: explanation, onChange: (e) => setExplanation(e.target.value), rows: 3, placeholder: "正解の解説" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "設定" }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-row", children: [
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "モジュール" }),
            /* @__PURE__ */ jsxs("select", { className: "admin-input", value: module, onChange: (e) => setModule(e.target.value), children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "選択なし" }),
              SAP_MODULES.map((m) => /* @__PURE__ */ jsxs("option", { value: m.slug, children: [
                m.code,
                " · ",
                m.name_ja
              ] }, m.slug))
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "難易度" }),
            /* @__PURE__ */ jsxs("select", { className: "admin-input", value: difficulty, onChange: (e) => setDifficulty(e.target.value), children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "選択なし" }),
              DIFFICULTIES.map((d) => /* @__PURE__ */ jsx("option", { value: d.slug, children: d.name }, d.slug))
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "実施日" }),
            /* @__PURE__ */ jsx("input", { type: "date", className: "admin-input", value: date, onChange: (e) => setDate(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "ステータス" }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8 }, children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setStatus("publish"),
                  style: {
                    flex: 1,
                    padding: "7px 0",
                    borderRadius: 8,
                    border: "1.5px solid",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 13,
                    fontWeight: 600,
                    background: status === "publish" ? "var(--accent)" : "var(--bg-card)",
                    color: status === "publish" ? "white" : "var(--ink-1)",
                    borderColor: status === "publish" ? "var(--accent)" : "var(--line-2)"
                  },
                  children: "公開"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setStatus("draft"),
                  style: {
                    flex: 1,
                    padding: "7px 0",
                    borderRadius: 8,
                    border: "1.5px solid",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 13,
                    fontWeight: 600,
                    background: status === "draft" ? "var(--ink-3)" : "var(--bg-card)",
                    color: status === "draft" ? "white" : "var(--ink-1)",
                    borderColor: status === "draft" ? "var(--ink-3)" : "var(--line-2)"
                  },
                  children: "下書き"
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-actions", children: [
        /* @__PURE__ */ jsx(Link, { to: "/admin/quizzes", className: "admin-btn", children: "キャンセル" }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "admin-btn admin-btn-primary", disabled: saving, children: saving ? "保存中..." : isEdit ? "更新する" : "作成する" })
      ] })
    ] })
  ] });
}
const COUNT_CARDS = [
  { key: "articles", label: "公開記事", icon: "📰", color: "#3b82f6", bg: "#dbeafe", link: "/admin/articles" },
  { key: "courses", label: "コース", icon: "📚", color: "#5a9d6e", bg: "#d8ead9", link: "/admin/courses" },
  { key: "lessons", label: "レッスン", icon: "📝", color: "#d97548", bg: "#fde0c2", link: "/admin/lessons" },
  { key: "knowledge", label: "ナレッジ", icon: "📖", color: "#8b5cf6", bg: "#ede9fe", link: "/admin/knowledge" },
  { key: "videos", label: "動画", icon: "🎬", color: "#ec4899", bg: "#fce7f3", link: "/admin/videos" },
  { key: "quizzes", label: "クイズ", icon: "❓", color: "#f59e0b", bg: "#fef3c7", link: "/admin/quizzes" },
  { key: "cases", label: "案件", icon: "💼", color: "#6366f1", bg: "#e0e7ff", link: "/admin/cases" },
  { key: "users", label: "ユーザー", icon: "👥", color: "#14b8a6", bg: "#ccfbf1", link: "/admin/users" },
  { key: "paths", label: "学習パス", icon: "🎯", color: "#a855f7", bg: "#f3e8ff", link: "/paths" },
  { key: "contact_unread", label: "未読問合せ", icon: "📨", color: "#ef4444", bg: "#fee2e2", link: "/admin/contact", badge: true }
];
function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.client.get("/admin/stats").then(({ data }) => {
      if (data.success) setStats(data.data);
    }).catch(() => {
    }).finally(() => setLoading(false));
  }, []);
  if (loading) return /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "統計データを読み込み中..." });
  if (!stats) return /* @__PURE__ */ jsxs("div", { className: "admin-empty", children: [
    /* @__PURE__ */ jsx("div", { className: "admin-empty-icon", children: "📊" }),
    /* @__PURE__ */ jsx("p", { children: "統計データの取得に失敗しました。" })
  ] });
  const c = stats.counts;
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsx("div", { className: "admin-page-head", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { children: "ダッシュボード" }),
      /* @__PURE__ */ jsx("p", { className: "admin-page-desc", children: "サイト全体の統計データを一覧表示" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginBottom: 28 }, children: COUNT_CARDS.map((card) => {
      const val = c[card.key] ?? 0;
      return /* @__PURE__ */ jsxs(
        Link,
        {
          to: card.link,
          style: {
            display: "flex",
            flexDirection: "column",
            gap: 6,
            padding: "16px 14px",
            borderRadius: 14,
            background: card.bg,
            textDecoration: "none",
            position: "relative",
            overflow: "hidden",
            transition: "transform 0.12s",
            cursor: "pointer"
          },
          onMouseEnter: (e) => e.currentTarget.style.transform = "translateY(-2px)",
          onMouseLeave: (e) => e.currentTarget.style.transform = "translateY(0)",
          children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: 24, lineHeight: 1 }, children: card.icon }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { style: { fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 800, fontSize: 24, color: card.color, lineHeight: 1.2 }, children: [
                val.toLocaleString(),
                card.key === "contact_unread" && val > 0 && /* @__PURE__ */ jsx("span", { style: { fontSize: 12, fontWeight: 700, color: "#ef4444", marginLeft: 4, verticalAlign: "super" }, children: "NEW" })
              ] }),
              /* @__PURE__ */ jsx("div", { style: { fontSize: 11.5, color: "#4a4030", fontWeight: 500 }, children: card.label })
            ] })
          ]
        },
        card.key
      );
    }) }),
    /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }, children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "📰 最近の記事" }),
        stats.recent_articles.length === 0 ? /* @__PURE__ */ jsx("div", { className: "admin-empty", style: { padding: 20 }, children: "まだ記事がありません" }) : /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: stats.recent_articles.map((a) => {
          var _a;
          return /* @__PURE__ */ jsxs(
            Link,
            {
              to: `/admin/articles/${a.id}/edit`,
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 10px",
                borderRadius: 8,
                textDecoration: "none",
                color: "inherit",
                transition: "background 0.1s",
                fontSize: 13
              },
              onMouseEnter: (e) => e.currentTarget.style.background = "var(--bg-tint)",
              onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
              children: [
                /* @__PURE__ */ jsxs("span", { style: { fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }, children: [
                  a.module && /* @__PURE__ */ jsx("span", { style: { fontSize: 10.5, padding: "1px 5px", borderRadius: 3, background: "#d8ead9", color: "#3e7a52", fontWeight: 600, marginRight: 6 }, children: a.module }),
                  a.title
                ] }),
                /* @__PURE__ */ jsxs("span", { style: { fontSize: 11, color: "var(--ink-3)", whiteSpace: "nowrap", marginLeft: 12 }, children: [
                  "👁 ",
                  ((_a = a.views) == null ? void 0 : _a.toLocaleString()) || 0
                ] })
              ]
            },
            a.id
          );
        }) }),
        /* @__PURE__ */ jsx(Link, { to: "/admin/articles", className: "admin-crumb", style: { display: "block", marginTop: 10, fontSize: 12 }, children: "すべての記事を見る →" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "🔥 よく読まれている記事" }),
        stats.popular_articles.length === 0 ? /* @__PURE__ */ jsx("div", { className: "admin-empty", style: { padding: 20 }, children: "データがありません" }) : /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: stats.popular_articles.map((a, i) => {
          var _a;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              style: { display: "flex", alignItems: "center", gap: 10, padding: "6px 10px", borderRadius: 8, fontSize: 13 },
              children: [
                /* @__PURE__ */ jsx("span", { style: {
                  fontFamily: "'Zen Maru Gothic',sans-serif",
                  fontWeight: 800,
                  fontSize: 16,
                  color: i === 0 ? "#f59e0b" : i === 1 ? "#94a3b8" : i === 2 ? "#d97548" : "var(--ink-3)",
                  width: 24,
                  textAlign: "center"
                }, children: i + 1 }),
                /* @__PURE__ */ jsx("span", { style: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: a.title }),
                /* @__PURE__ */ jsxs("span", { style: { fontSize: 11, color: "var(--ink-3)", whiteSpace: "nowrap" }, children: [
                  "👁 ",
                  ((_a = a.views) == null ? void 0 : _a.toLocaleString()) || 0
                ] })
              ]
            },
            a.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsxs("h3", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
          "📨 最近のお問い合わせ",
          c.contact_unread > 0 && /* @__PURE__ */ jsxs("span", { style: { fontSize: 10.5, padding: "2px 8px", borderRadius: 999, background: "#ef4444", color: "white", fontWeight: 700 }, children: [
            c.contact_unread,
            "件未読"
          ] })
        ] }),
        stats.recent_inquiries.length === 0 ? /* @__PURE__ */ jsx("div", { className: "admin-empty", style: { padding: 20 }, children: "お問い合わせはありません" }) : /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: stats.recent_inquiries.map((inq) => /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/admin/contact`,
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 10px",
              borderRadius: 8,
              textDecoration: "none",
              color: "inherit",
              fontSize: 13
            },
            onMouseEnter: (e) => e.currentTarget.style.background = "var(--bg-tint)",
            onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
            children: [
              /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
                /* @__PURE__ */ jsx("span", { style: {
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: inq.status === "unread" ? "#ef4444" : inq.status === "replied" ? "#5a9d6e" : "#94a3b8"
                } }),
                inq.name
              ] }),
              /* @__PURE__ */ jsx("span", { style: { fontSize: 11, color: "var(--ink-3)" }, children: new Date(inq.created_at).toLocaleDateString("ja-JP") })
            ]
          },
          inq.id
        )) }),
        /* @__PURE__ */ jsx(Link, { to: "/admin/contact", className: "admin-crumb", style: { display: "block", marginTop: 10, fontSize: 12 }, children: "すべて見る →" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "👥 最近登録したユーザー" }),
        stats.recent_users.length === 0 ? /* @__PURE__ */ jsx("div", { className: "admin-empty", style: { padding: 20 }, children: "ユーザーがいません" }) : /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: stats.recent_users.map((u) => /* @__PURE__ */ jsxs(
          "div",
          {
            style: { display: "flex", alignItems: "center", gap: 10, padding: "6px 10px", borderRadius: 8, fontSize: 13 },
            children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: u.avatar,
                  alt: "",
                  style: { width: 28, height: 28, borderRadius: "50%", objectFit: "cover", background: "#eee" },
                  onError: (e) => {
                    e.target.style.display = "none";
                  }
                }
              ),
              /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
                /* @__PURE__ */ jsx("div", { style: { fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: u.name }),
                /* @__PURE__ */ jsx("div", { style: { fontSize: 11, color: "var(--ink-3)" }, children: u.email })
              ] }),
              /* @__PURE__ */ jsx("span", { style: { fontSize: 11, color: "var(--ink-3)", whiteSpace: "nowrap" }, children: new Date(u.registered_at).toLocaleDateString("ja-JP") })
            ]
          },
          u.id
        )) }),
        /* @__PURE__ */ jsx(Link, { to: "/admin/users", className: "admin-crumb", style: { display: "block", marginTop: 10, fontSize: 12 }, children: "すべてのユーザーを見る →" })
      ] })
    ] })
  ] });
}
const STATUS_LABELS = { unread: "未読", read: "既読", replied: "返信済" };
const STATUS_COLORS = { unread: "#ef4444", read: "#f59e0b", replied: "#5a9d6e" };
const TYPE_LABELS = {
  general: "一般的なお問い合わせ",
  course: "コースについて",
  case: "案件掲載について",
  partnership: "提携について",
  other: "その他"
};
function ContactInquiriesList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [detail, setDetail] = useState(null);
  const [memo, setMemo] = useState("");
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ total: 0, unread: 0 });
  const load2 = async (status) => {
    setLoading(true);
    try {
      const { data } = await api.client.get("/contact/inquiries", { params: { status, per_page: 100 } });
      if (data.success) {
        setItems(data.data || []);
        setStats({ total: data.total || 0, unread: data.unread_count || 0 });
      }
    } catch (err) {
      console.error("Failed to load inquiry detail:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load2();
  }, []);
  const openDetail = async (id) => {
    try {
      const { data } = await api.client.get(`/contact/inquiries/${id}`);
      if (data.success) {
        setDetail(data.data);
        setMemo(data.data.memo || "");
      }
    } catch (err) {
      console.error("inquiry detail error:", err);
      alert("詳細の取得に失敗しました");
    }
  };
  const updateStatus = async (id, status) => {
    setSaving(true);
    try {
      await api.client.put(`/contact/inquiries/${id}`, { status });
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
      if ((detail == null ? void 0 : detail.id) === id) setDetail((prev) => ({ ...prev, status }));
    } catch {
    } finally {
      setSaving(false);
    }
  };
  const saveMemo = async () => {
    if (!detail) return;
    setSaving(true);
    try {
      await api.client.put(`/contact/inquiries/${detail.id}`, { memo });
    } catch {
    } finally {
      setSaving(false);
    }
  };
  const filtered = filter ? items.filter((i) => i.status === filter) : items;
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsx("div", { className: "admin-page-head", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { children: "お問い合わせ管理" }),
      /* @__PURE__ */ jsx("p", { className: "admin-page-desc", children: "サイト経由のお問い合わせを管理します" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "admin-search-bar", children: [
      { value: "", label: `すべて (${stats.total})` },
      { value: "unread", label: `未読 (${stats.unread})` },
      { value: "read", label: "既読" },
      { value: "replied", label: "返信済" }
    ].map((s) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => {
          setFilter(s.value);
          load2(s.value || void 0);
        },
        className: `admin-btn admin-btn-sm ${filter === s.value ? "admin-btn-primary" : ""}`,
        children: s.label
      },
      s.value
    )) }),
    loading ? /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "読み込み中..." }) : filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "admin-empty", children: [
      /* @__PURE__ */ jsx("div", { className: "admin-empty-icon", children: "📨" }),
      /* @__PURE__ */ jsx("p", { children: "お問い合わせはありません" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "admin-table-wrap", children: /* @__PURE__ */ jsxs("table", { className: "admin-table", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { children: "ステータス" }),
        /* @__PURE__ */ jsx("th", { children: "名前" }),
        /* @__PURE__ */ jsx("th", { children: "種別" }),
        /* @__PURE__ */ jsx("th", { children: "日付" }),
        /* @__PURE__ */ jsx("th", { children: "操作" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: filtered.map((item) => /* @__PURE__ */ jsxs("tr", { style: { opacity: item.status === "unread" ? 1 : 0.7 }, children: [
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { style: {
          fontSize: 10.5,
          padding: "2px 8px",
          borderRadius: 999,
          fontWeight: 700,
          background: STATUS_COLORS[item.status] + "22",
          color: STATUS_COLORS[item.status]
        }, children: STATUS_LABELS[item.status] || item.status }) }),
        /* @__PURE__ */ jsx("td", { style: { fontWeight: item.status === "unread" ? 700 : 500 }, children: item.name }),
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: "admin-type-badge", children: TYPE_LABELS[item.inquiry_type] || item.inquiry_type }) }),
        /* @__PURE__ */ jsx("td", { className: "admin-cell-date", children: new Date(item.created_at).toLocaleDateString("ja-JP") }),
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => openDetail(item.id), children: "詳細" }) })
      ] }, item.id)) })
    ] }) }),
    detail && /* @__PURE__ */ jsx("div", { className: "admin-overlay", onClick: () => setDetail(null), children: /* @__PURE__ */ jsxs("div", { className: "admin-modal", onClick: (e) => e.stopPropagation(), style: { maxWidth: 600, width: "100%" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-modal-head", children: [
        /* @__PURE__ */ jsxs("h3", { style: { margin: 0, fontSize: 17, fontFamily: "'Zen Maru Gothic',sans-serif" }, children: [
          STATUS_LABELS[detail.status] || detail.status,
          " のお問い合わせ"
        ] }),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => setDetail(null), children: "✕" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-modal-body", style: { display: "flex", flexDirection: "column", gap: 12, fontSize: 13.5 }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("strong", { children: "お名前" }),
            /* @__PURE__ */ jsx("br", {}),
            detail.name
          ] }),
          detail.name_kana && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("strong", { children: "フリガナ" }),
            /* @__PURE__ */ jsx("br", {}),
            detail.name_kana
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("strong", { children: "メールアドレス" }),
            /* @__PURE__ */ jsx("br", {}),
            detail.email || "—"
          ] }),
          detail.phone && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("strong", { children: "電話番号" }),
            /* @__PURE__ */ jsx("br", {}),
            detail.phone
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("strong", { children: "種別" }),
            /* @__PURE__ */ jsx("br", {}),
            TYPE_LABELS[detail.inquiry_type] || detail.inquiry_type
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("strong", { children: "受付日時" }),
            /* @__PURE__ */ jsx("br", {}),
            new Date(detail.created_at).toLocaleString("ja-JP")
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { background: "var(--bg-tint)", borderRadius: 8, padding: 12, whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: 13 }, children: detail.message }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "メモ（管理者用）" }),
          /* @__PURE__ */ jsx("textarea", { className: "admin-input admin-textarea", style: { width: "100%", minHeight: 60 }, value: memo, onChange: (e) => setMemo(e.target.value) }),
          /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm admin-btn-primary", onClick: saveMemo, disabled: saving, style: { marginTop: 6 }, children: saving ? "保存中..." : "メモを保存" })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 6, marginTop: 4 }, children: ["unread", "read", "replied"].map((s) => /* @__PURE__ */ jsxs(
          "button",
          {
            className: `admin-btn admin-btn-sm ${detail.status === s ? "admin-btn-primary" : ""}`,
            onClick: () => updateStatus(detail.id, s),
            disabled: detail.status === s,
            children: [
              STATUS_LABELS[s],
              " にする"
            ]
          },
          s
        )) })
      ] })
    ] }) })
  ] });
}
function PluginsManager() {
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [search, setSearch] = useState("");
  const loadPlugins = async () => {
    var _a, _b;
    setLoading(true);
    try {
      const { data } = await api.client.get("/admin/plugins");
      if (data.success) setPlugins(data.data || []);
      else setError(data.message || "取得失敗");
    } catch (err) {
      setError(((_b = (_a = err == null ? void 0 : err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "プラグイン一覧の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadPlugins();
  }, []);
  const togglePlugin = async (plugin) => {
    var _a, _b, _c, _d;
    setProcessing(plugin.file);
    setError("");
    setSuccessMsg("");
    try {
      const endpoint = plugin.active ? "/admin/plugins/deactivate" : "/admin/plugins/activate";
      const { data } = await api.client.post(endpoint, { file: plugin.file });
      if (data.success) {
        setPlugins((prev) => prev.map((p2) => p2.file === plugin.file ? { ...p2, active: !p2.active } : p2));
        setSuccessMsg(`${plugin.name} を${plugin.active ? "無効化" : "有効化"}しました`);
      } else setError(data.message || "操作に失敗しました");
    } catch (err) {
      const statusText = ((_a = err == null ? void 0 : err.response) == null ? void 0 : _a.statusText) || "サーバーエラー";
      const bodyMsg = typeof ((_b = err == null ? void 0 : err.response) == null ? void 0 : _b.data) === "object" ? (_d = (_c = err == null ? void 0 : err.response) == null ? void 0 : _c.data) == null ? void 0 : _d.message : null;
      setError(bodyMsg || statusText);
      console.error("Plugin toggle failed:", (err == null ? void 0 : err.response) || err);
    } finally {
      setProcessing(null);
    }
  };
  const filtered = search ? plugins.filter((p2) => p2.name.toLowerCase().includes(search.toLowerCase()) || p2.description.toLowerCase().includes(search.toLowerCase())) : plugins;
  const activeCount = plugins.filter((p2) => p2.active).length;
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsx("div", { className: "admin-page-head", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { children: "プラグイン管理" }),
      /* @__PURE__ */ jsxs("p", { className: "admin-page-desc", children: [
        "WordPress プラグインの有効/無効を管理します（",
        plugins.length,
        " 個中 ",
        activeCount,
        " 個有効）"
      ] })
    ] }) }),
    error && /* @__PURE__ */ jsx("div", { className: "admin-error", children: error }),
    successMsg && /* @__PURE__ */ jsx("div", { style: { background: "#d8ead9", border: "1px solid rgba(90,157,110,0.3)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#3e7a52", marginBottom: 16 }, children: successMsg }),
    /* @__PURE__ */ jsxs("div", { className: "admin-search-bar", children: [
      /* @__PURE__ */ jsx("input", { className: "admin-input", type: "text", placeholder: "プラグインを検索...", value: search, onChange: (e) => setSearch(e.target.value), style: { minWidth: 250 } }),
      /* @__PURE__ */ jsx("button", { className: "admin-btn", onClick: loadPlugins, disabled: loading, children: "🔄 再読み込み" })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "読み込み中..." }) : /* @__PURE__ */ jsx("div", { className: "admin-table-wrap", children: /* @__PURE__ */ jsxs("table", { className: "admin-table", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { style: { width: 80 }, children: "状態" }),
        /* @__PURE__ */ jsx("th", { children: "プラグイン名" }),
        /* @__PURE__ */ jsx("th", { style: { width: 100 }, children: "バージョン" }),
        /* @__PURE__ */ jsx("th", { children: "説明" }),
        /* @__PURE__ */ jsx("th", { style: { width: 120 }, children: "操作" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: filtered.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, children: /* @__PURE__ */ jsx("div", { className: "admin-empty", style: { padding: 20 }, children: "プラグインが見つかりません" }) }) }) : filtered.map((plugin) => /* @__PURE__ */ jsxs("tr", { style: { opacity: plugin.active ? 1 : 0.55 }, children: [
        /* @__PURE__ */ jsxs("td", { children: [
          /* @__PURE__ */ jsx("span", { style: {
            display: "inline-block",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: plugin.active ? "#5a9d6e" : "#d96570"
          } }),
          /* @__PURE__ */ jsx("span", { style: { fontSize: 11, marginLeft: 6, color: plugin.active ? "#3e7a52" : "#d96570", fontWeight: 600 }, children: plugin.active ? "有効" : "無効" })
        ] }),
        /* @__PURE__ */ jsxs("td", { children: [
          /* @__PURE__ */ jsxs("div", { style: { fontWeight: 600, fontSize: 13.5 }, children: [
            plugin.file.includes("sap-panda-api") && /* @__PURE__ */ jsx("span", { style: { fontSize: 10, padding: "1px 5px", borderRadius: 3, background: "#5a9d6e", color: "white", fontWeight: 700, marginRight: 6 }, children: "コア" }),
            plugin.name
          ] }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: 11, color: "#7a6e58", marginTop: 2 }, children: plugin.author })
        ] }),
        /* @__PURE__ */ jsx("td", { className: "admin-cell-date", children: plugin.version }),
        /* @__PURE__ */ jsx("td", { style: { fontSize: 12, color: "#4a4030", maxWidth: 380, lineHeight: 1.5 }, children: plugin.description }),
        /* @__PURE__ */ jsx("td", { children: plugin.file.includes("sap-panda-api") ? /* @__PURE__ */ jsx("span", { style: { fontSize: 11, color: "#7a6e58" }, children: "必須" }) : /* @__PURE__ */ jsx(
          "button",
          {
            className: `admin-btn admin-btn-sm ${plugin.active ? "" : "admin-btn-primary"}`,
            onClick: () => togglePlugin(plugin),
            disabled: processing === plugin.file,
            children: processing === plugin.file ? "..." : plugin.active ? "無効化" : "有効化"
          }
        ) })
      ] }, plugin.file)) })
    ] }) })
  ] });
}
function SeoGeoManager() {
  const [tab, setTab] = useState("seo");
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [faqForm, setFaqForm] = useState({ question: "", answer: "" });
  const [editingFaq, setEditingFaq] = useState(null);
  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3e3);
  };
  const loadData = useCallback(async () => {
    var _a, _b;
    setLoading(true);
    try {
      const { data: s } = await api.client.get("/admin/seo-settings");
      if (s.success) setSettings(s.data);
      const { data: f } = await api.client.get("/admin/faq-schemas");
      if (f.success) setFaqs(f.data || []);
      const { data: k } = await api.client.get("/admin/seo-keywords");
      if (k.success) setKeywords(k.data || []);
    } catch (err) {
      setError(((_b = (_a = err == null ? void 0 : err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    loadData();
  }, [loadData]);
  const saveSettings = async () => {
    var _a, _b;
    setSaving(true);
    setError("");
    try {
      const { data } = await api.client.put("/admin/seo-settings", settings);
      if (data.success) showSuccess("SEO設定を保存しました");
      else setError(data.message || "保存に失敗しました");
    } catch (err) {
      setError(((_b = (_a = err == null ? void 0 : err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };
  const addKeyword = async () => {
    if (!newKeyword.trim()) return;
    try {
      const { data } = await api.client.post("/admin/seo-keywords", { keyword: newKeyword.trim() });
      if (data.success) {
        setKeywords(data.data);
        setNewKeyword("");
        showSuccess("キーワードを追加しました");
      }
    } catch {
      setError("追加に失敗しました");
    }
  };
  const deleteKeyword = async (kw) => {
    try {
      const { data } = await api.client.delete("/admin/seo-keywords", { data: { keyword: kw } });
      if (data.success) setKeywords(data.data);
    } catch {
      setError("削除に失敗しました");
    }
  };
  const saveFaq = async () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) return;
    setSaving(true);
    try {
      if (editingFaq !== null) {
        const { data } = await api.client.put(`/admin/faq-schemas/${editingFaq}`, faqForm);
        if (data.success) {
          setFaqs((prev) => prev.map((f) => f.id === editingFaq ? { ...f, ...faqForm } : f));
          showSuccess("FAQを更新しました");
        }
      } else {
        const { data } = await api.client.post("/admin/faq-schemas", faqForm);
        if (data.success) {
          setFaqs(data.data);
          showSuccess("FAQを追加しました");
        }
      }
      setFaqForm({ question: "", answer: "" });
      setEditingFaq(null);
    } catch {
      setError("FAQの保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };
  const deleteFaq = async (id) => {
    try {
      const { data } = await api.client.delete(`/admin/faq-schemas/${id}`);
      if (data.success) {
        setFaqs((prev) => prev.filter((f) => f.id !== id));
        showSuccess("FAQを削除しました");
      }
    } catch {
      setError("削除に失敗しました");
    }
  };
  const editFaq = (item) => {
    setFaqForm({ question: item.question, answer: item.answer });
    setEditingFaq(item.id);
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "admin-loading", children: "SEO/GEO設定を読み込み中..." });
  const tabs = [
    { key: "seo", label: "SEO設定", icon: "🔍" },
    { key: "geo", label: "GEO設定", icon: "🤖" },
    { key: "faq", label: "FAQ構造化", icon: "❓" },
    { key: "keywords", label: "キーワード", icon: "🏷️" }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "admin-page", children: [
    /* @__PURE__ */ jsx("div", { className: "admin-page-head", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { children: "SEO / GEO 設定" }),
      /* @__PURE__ */ jsx("p", { className: "admin-page-desc", children: "検索エンジンと生成AI向けのサイト最適化を管理します" })
    ] }) }),
    error && /* @__PURE__ */ jsx("div", { className: "admin-error", children: error }),
    successMsg && /* @__PURE__ */ jsx("div", { className: "admin-success", style: { background: "#d8ead9", border: "1px solid rgba(90,157,110,0.3)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#3e7a52", marginBottom: 16 }, children: successMsg }),
    /* @__PURE__ */ jsx("div", { className: "admin-search-bar", children: tabs.map((t) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setTab(t.key),
        className: `admin-btn admin-btn-sm ${tab === t.key ? "admin-btn-primary" : ""}`,
        children: [
          t.icon,
          " ",
          t.label
        ]
      },
      t.key
    )) }),
    tab === "seo" && /* @__PURE__ */ jsxs("div", { className: "admin-form", children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "🔍 基本SEO設定" }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "サイト名" }),
          /* @__PURE__ */ jsx("input", { className: "admin-input", style: { width: "100%" }, value: settings.site_name || "", onChange: (e) => setSettings({ ...settings, site_name: e.target.value }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "サイト説明文（meta description）" }),
          /* @__PURE__ */ jsx("textarea", { className: "admin-input admin-textarea", style: { width: "100%", minHeight: 60 }, value: settings.site_description || "", onChange: (e) => setSettings({ ...settings, site_description: e.target.value }) }),
          /* @__PURE__ */ jsxs("span", { style: { fontSize: 11, color: "#7a6e58" }, children: [
            "推奨: 120〜160文字 / 現在 ",
            (settings.site_description || "").length,
            "文字"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "デフォルトキーワード（カンマ区切り）" }),
          /* @__PURE__ */ jsx("input", { className: "admin-input", style: { width: "100%" }, value: settings.default_keywords || "", onChange: (e) => setSettings({ ...settings, default_keywords: e.target.value }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-row", children: [
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "OG画像URL" }),
            /* @__PURE__ */ jsx("input", { className: "admin-input", style: { width: "100%" }, value: settings.og_image || "", onChange: (e) => setSettings({ ...settings, og_image: e.target.value }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "Twitterハンドル" }),
            /* @__PURE__ */ jsx("input", { className: "admin-input", style: { width: "100%" }, value: settings.twitter_handle || "", onChange: (e) => setSettings({ ...settings, twitter_handle: e.target.value }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "Google Analytics ID" }),
          /* @__PURE__ */ jsx("input", { className: "admin-input", style: { width: "100%" }, value: settings.google_analytics_id || "", placeholder: "例: G-XXXXXXXXXX", onChange: (e) => setSettings({ ...settings, google_analytics_id: e.target.value }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "📄 robots.txt" }),
        /* @__PURE__ */ jsx("div", { className: "admin-form-group", children: /* @__PURE__ */ jsx("textarea", { className: "admin-input admin-textarea-lg", style: { width: "100%", minHeight: 180 }, value: settings.robots_txt || "", onChange: (e) => setSettings({ ...settings, robots_txt: e.target.value }) }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "admin-form-actions", children: /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-primary", onClick: saveSettings, disabled: saving, children: saving ? "保存中..." : "SEO設定を保存" }) })
    ] }),
    tab === "geo" && /* @__PURE__ */ jsxs("div", { className: "admin-form", children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "🤖 生成AI最適化 (GEO) 設定" }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 12.5, color: "#7a6e58", margin: "-8px 0 16px", lineHeight: 1.7 }, children: "ChatGPT / Gemini / Perplexity 等の生成AI検索向けにサイト情報を最適化します。 構造化データを強化することで、AIの回答に引用される可能性が高まります。" }),
        /* @__PURE__ */ jsx("div", { className: "admin-form-group", children: /* @__PURE__ */ jsxs("label", { style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }, children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", checked: !!settings.geo_enabled, onChange: (e) => setSettings({ ...settings, geo_enabled: e.target.checked }) }),
          /* @__PURE__ */ jsx("span", { style: { fontSize: 13, fontWeight: 600 }, children: "GEO最適化を有効にする" })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "admin-form-group", children: /* @__PURE__ */ jsxs("label", { style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }, children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", checked: !!settings.ai_optimization, onChange: (e) => setSettings({ ...settings, ai_optimization: e.target.checked }) }),
          /* @__PURE__ */ jsx("span", { style: { fontSize: 13, fontWeight: 600 }, children: "AIフレンドリーなHTML構造を出力（見出し・リストの最適化）" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "🏢 組織情報（Organization Schema）" }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "組織名" }),
          /* @__PURE__ */ jsx("input", { className: "admin-input", style: { width: "100%" }, value: settings.organization_name || "", onChange: (e) => setSettings({ ...settings, organization_name: e.target.value }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-row", children: [
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "ロゴURL" }),
            /* @__PURE__ */ jsx("input", { className: "admin-input", style: { width: "100%" }, value: settings.organization_logo || "", onChange: (e) => setSettings({ ...settings, organization_logo: e.target.value }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "admin-label", children: "サイトURL" }),
            /* @__PURE__ */ jsx("input", { className: "admin-input", style: { width: "100%" }, value: settings.organization_url || "", onChange: (e) => setSettings({ ...settings, organization_url: e.target.value }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "SNSリンク（カンマ区切り）" }),
          /* @__PURE__ */ jsx("input", { className: "admin-input", style: { width: "100%" }, placeholder: "https://twitter.com/...,https://youtube.com/...", value: Array.isArray(settings.social_links) ? settings.social_links.join(",") : "", onChange: (e) => setSettings({ ...settings, social_links: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "admin-form-actions", children: /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-primary", onClick: saveSettings, disabled: saving, children: saving ? "保存中..." : "GEO設定を保存" }) })
    ] }),
    tab === "faq" && /* @__PURE__ */ jsxs("div", { className: "admin-form", children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
        /* @__PURE__ */ jsx("h3", { children: editingFaq ? "✏️ FAQを編集" : "➕ FAQを追加" }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "質問" }),
          /* @__PURE__ */ jsx("input", { className: "admin-input", style: { width: "100%" }, value: faqForm.question, onChange: (e) => setFaqForm({ ...faqForm, question: e.target.value }), placeholder: "例: SAPとは何ですか？" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "admin-label", children: "回答" }),
          /* @__PURE__ */ jsx("textarea", { className: "admin-input admin-textarea", style: { width: "100%", minHeight: 80 }, value: faqForm.answer, onChange: (e) => setFaqForm({ ...faqForm, answer: e.target.value }), placeholder: "回答を入力..." })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8 }, children: [
          /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-primary admin-btn-sm", onClick: saveFaq, disabled: saving, children: saving ? "保存中..." : editingFaq ? "更新する" : "追加する" }),
          editingFaq && /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => {
            setEditingFaq(null);
            setFaqForm({ question: "", answer: "" });
          }, children: "キャンセル" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "admin-table-wrap", children: /* @__PURE__ */ jsxs("table", { className: "admin-table", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { style: { width: 40 }, children: "ID" }),
          /* @__PURE__ */ jsx("th", { children: "質問" }),
          /* @__PURE__ */ jsx("th", { children: "回答（プレビュー）" }),
          /* @__PURE__ */ jsx("th", { style: { width: 120 }, children: "操作" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: faqs.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 4, children: /* @__PURE__ */ jsx("div", { className: "admin-empty", style: { padding: 20 }, children: "FAQがありません。上部フォームから追加してください。" }) }) }) : faqs.map((faq) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "admin-cell-id", children: faq.id }),
          /* @__PURE__ */ jsx("td", { style: { fontWeight: 600 }, children: faq.question }),
          /* @__PURE__ */ jsx("td", { style: { fontSize: 12, color: "#7a6e58", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: faq.answer.replace(/<[^>]+>/g, "") }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: "admin-actions", children: [
            /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm", onClick: () => editFaq(faq), children: "編集" }),
            /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-sm admin-btn-danger", onClick: () => deleteFaq(faq.id), children: "削除" })
          ] }) })
        ] }, faq.id)) })
      ] }) }),
      faqs.length > 0 && /* @__PURE__ */ jsxs("div", { style: { fontSize: 12, color: "#7a6e58", marginTop: 8 }, children: [
        "全 ",
        faqs.length,
        " 件のFAQ — サイトに埋め込むと FAQPage 構造化データとして認識されます"
      ] })
    ] }),
    tab === "keywords" && /* @__PURE__ */ jsx("div", { className: "admin-form", children: /* @__PURE__ */ jsxs("div", { className: "admin-form-card", children: [
      /* @__PURE__ */ jsx("h3", { children: "🏷️ トラッキングキーワード" }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "admin-input",
            style: { flex: 1 },
            value: newKeyword,
            onChange: (e) => setNewKeyword(e.target.value),
            placeholder: "新規キーワードを入力...",
            onKeyDown: (e) => e.key === "Enter" && addKeyword()
          }
        ),
        /* @__PURE__ */ jsx("button", { className: "admin-btn admin-btn-primary admin-btn-sm", onClick: addKeyword, disabled: !newKeyword.trim(), children: "追加" })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 16 }, children: keywords.length === 0 ? /* @__PURE__ */ jsx("span", { style: { fontSize: 13, color: "#7a6e58" }, children: "キーワードが登録されていません" }) : keywords.map((kw) => /* @__PURE__ */ jsxs("span", { style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        background: "#e8f0fb",
        color: "#3b82f6",
        fontSize: 12,
        fontWeight: 600
      }, children: [
        kw,
        /* @__PURE__ */ jsx("span", { onClick: () => deleteKeyword(kw), style: { cursor: "pointer", opacity: 0.6, fontSize: 14 }, children: "×" })
      ] }, kw)) })
    ] }) })
  ] });
}
function NoteList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchNotes = () => {
    setLoading(true);
    api.client.get("/notes", { params: { per_page: 999, status: "all" } }).then(({ data }) => {
      if (data.success) setNotes(data.data || []);
    }).catch(() => {
    }).finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchNotes();
  }, []);
  const handleDelete = async (id) => {
    if (!confirm("この記事を削除しますか？")) return;
    const res = await api.deleteNote(id);
    if (res.success) fetchNotes();
  };
  if (loading) return /* @__PURE__ */ jsx("div", { style: { padding: 40, textAlign: "center", color: "var(--ink-3)" }, children: "読み込み中..." });
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }, children: [
      /* @__PURE__ */ jsx("h2", { style: { margin: 0, fontFamily: "var(--font-display)" }, children: "记事一覧" }),
      /* @__PURE__ */ jsx(Link, { to: "/admin/notes/new", className: "btn accent", style: { textDecoration: "none" }, children: "＋ 新規記事追加" })
    ] }),
    notes.length === 0 ? /* @__PURE__ */ jsx("div", { style: { textAlign: "center", padding: 60, color: "var(--ink-3)" }, children: "記事がありません。" }) : /* @__PURE__ */ jsxs("table", { className: "admin-table", style: { width: "100%", borderCollapse: "collapse" }, children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { children: "ID" }),
        /* @__PURE__ */ jsx("th", { children: "タイトル" }),
        /* @__PURE__ */ jsx("th", { children: "モジュール" }),
        /* @__PURE__ */ jsx("th", { children: "作成日" }),
        /* @__PURE__ */ jsx("th", { children: "操作" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: notes.map((n) => {
        var _a, _b;
        return /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { style: { fontFamily: "monospace", fontSize: 12 }, children: n.id }),
          /* @__PURE__ */ jsx("td", { style: { fontWeight: 500 }, children: n.title }),
          /* @__PURE__ */ jsx("td", { children: ((_b = (_a = n.module) == null ? void 0 : _a.slug) == null ? void 0 : _b.toUpperCase()) || "—" }),
          /* @__PURE__ */ jsx("td", { style: { fontSize: 12, color: "var(--ink-2)" }, children: new Date(n.created_at).toLocaleDateString("ja-JP") }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ jsx(Link, { to: `/admin/notes/${n.id}/edit`, className: "btn sm", style: { textDecoration: "none" }, children: "編集" }),
            /* @__PURE__ */ jsx("a", { href: `/note/${n.id}/${n.slug}`, target: "_blank", rel: "noopener noreferrer", className: "btn sm", style: { textDecoration: "none" }, children: "表示" }),
            /* @__PURE__ */ jsx("button", { className: "btn sm danger", onClick: () => handleDelete(n.id), children: "削除" })
          ] }) })
        ] }, n.id);
      }) })
    ] })
  ] });
}
function NoteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    module: "",
    difficulty: ""
  });
  useEffect(() => {
    if (!id) return;
    api.getNote(parseInt(id)).then((res) => {
      var _a, _b;
      if (res.success && res.data) {
        const n = res.data;
        setForm({
          title: n.title || "",
          excerpt: n.excerpt || "",
          content: n.content || "",
          module: ((_a = n.module) == null ? void 0 : _a.slug) || "",
          difficulty: ((_b = n.difficulty) == null ? void 0 : _b.slug) || ""
        });
      }
    }).catch(() => {
    }).finally(() => setLoading(false));
  }, [id]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("タイトルは必須です");
      return;
    }
    setSaving(true);
    setError("");
    try {
      let res;
      if (isEdit) {
        res = await api.updateNote(parseInt(id), form);
      } else {
        res = await api.createNote(form);
      }
      if (res.success) {
        navigate("/admin/notes");
      } else {
        setError(res.message || "保存に失敗しました");
      }
    } catch (err) {
      setError((err == null ? void 0 : err.message) || "保存中にエラーが発生しました");
    } finally {
      setSaving(false);
    }
  };
  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));
  if (loading) return /* @__PURE__ */ jsx("div", { style: { padding: 40, textAlign: "center", color: "var(--ink-3)" }, children: "読み込み中..." });
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }, children: [
      /* @__PURE__ */ jsx(Link, { to: "/admin/notes", style: { color: "var(--ink-2)", textDecoration: "none", fontSize: 20 }, children: "←" }),
      /* @__PURE__ */ jsx("h2", { style: { margin: 0, fontFamily: "var(--font-display)" }, children: isEdit ? "记事編集" : "新規记事作成" })
    ] }),
    error && /* @__PURE__ */ jsx("div", { style: { padding: "12px 16px", background: "#fef2f2", color: "#b91c1c", borderRadius: 8, marginBottom: 16, fontSize: 13 }, children: error }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, style: { maxWidth: 800 }, children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-field", children: [
        /* @__PURE__ */ jsx("label", { children: "タイトル *" }),
        /* @__PURE__ */ jsx("input", { type: "text", value: form.title, onChange: (e) => update("title", e.target.value), placeholder: "记事タイトル", required: true })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-field", children: [
        /* @__PURE__ */ jsx("label", { children: "抜粋" }),
        /* @__PURE__ */ jsx("textarea", { value: form.excerpt, onChange: (e) => update("excerpt", e.target.value), placeholder: "記事の簡単な説明", rows: 2 })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }, children: [
        /* @__PURE__ */ jsxs("div", { className: "admin-field", style: { marginBottom: 0 }, children: [
          /* @__PURE__ */ jsx("label", { children: "モジュール" }),
          /* @__PURE__ */ jsxs("select", { value: form.module, onChange: (e) => update("module", e.target.value), children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "選択してください" }),
            SAP_MODULES.map((m) => /* @__PURE__ */ jsx("option", { value: m.slug, children: m.name_ja || m.name }, m.slug))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "admin-field", style: { marginBottom: 0 }, children: [
          /* @__PURE__ */ jsx("label", { children: "難易度" }),
          /* @__PURE__ */ jsxs("select", { value: form.difficulty, onChange: (e) => update("difficulty", e.target.value), children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "選択してください" }),
            /* @__PURE__ */ jsx("option", { value: "beginner", children: "初級" }),
            /* @__PURE__ */ jsx("option", { value: "intermediate", children: "中級" }),
            /* @__PURE__ */ jsx("option", { value: "advanced", children: "上級" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-field", children: [
        /* @__PURE__ */ jsx("label", { children: "本文 (HTML)" }),
        /* @__PURE__ */ jsx(HtmlEditor, { value: form.content, onChange: (v) => update("content", v), placeholder: "记事内容を入力..." })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12, marginTop: 24 }, children: [
        /* @__PURE__ */ jsx("button", { type: "submit", className: "btn accent", disabled: saving, children: saving ? "保存中..." : isEdit ? "更新する" : "作成する" }),
        /* @__PURE__ */ jsx(Link, { to: "/admin/notes", className: "btn", style: { textDecoration: "none" }, children: "キャンセル" })
      ] })
    ] })
  ] });
}
const SITE_NAME = "SAP パンダ先生 NAVI";
const SITE_NAME_ALT = "SAP Panda Sensei";
const BASE_URL$1 = "https://sap-navi.aladdin-techec.com/sap";
const TWITTER_HANDLE = "@sap_panda";
const DEFAULT_DESC = "SAP のしくみを、パンダ先生がやさしく解説。財務・購買・販売・生産・人事 — むずかしい SAP を、たろうくんと一緒に「わからない…！」から「なるほど！」へ。";
const DEFAULT_KEYWORDS = "SAP,S/4HANA,ERP,会計,ABAP,FI,CO,MM,SD,学習,パンダ先生,ナレッジ,SAP資格,SAPコンサル";
const FOCUS_KEYPHRASES = ["SAP 学習", "SAP 基礎知識", "SAP モジュール解説", "SAP 資格対策", "SAP コンサル転職"];
function upsertLd(id, data) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  const script = document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify({ "@context": "https://schema.org", ...data });
  document.head.appendChild(script);
}
function removeLd(id) {
  var _a;
  (_a = document.getElementById(id)) == null ? void 0 : _a.remove();
}
function setMeta(name, content, property = false) {
  const attr = property ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}
function removeMeta(name, property = false) {
  var _a;
  const attr = property ? "property" : "name";
  (_a = document.querySelector(`meta[${attr}="${name}"]`)) == null ? void 0 : _a.remove();
}
function Seo({
  title,
  description,
  path,
  image,
  type = "website",
  noindex,
  publishedTime,
  modifiedTime,
  author,
  keywords,
  breadcrumbs,
  articleBody,
  pageType = "WebPage"
}) {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const desc = description || DEFAULT_DESC;
  const kw = keywords || DEFAULT_KEYWORDS;
  const url = path ? `${BASE_URL$1}${path}` : BASE_URL$1;
  const img = image || `${BASE_URL$1}/panda-sensei.png`;
  useEffect(() => {
    document.title = pageTitle;
    setMeta("description", desc);
    setMeta("keywords", kw);
    if (noindex) setMeta("robots", "noindex,nofollow");
    else removeMeta("robots");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
    const ensureLink = (rel, hrefLang, href) => {
      const sel = `link[rel="${rel}"][hreflang="${hrefLang}"]`;
      let el = document.querySelector(sel);
      if (!el) {
        el = document.createElement("link");
        el.rel = rel;
        el.hreflang = hrefLang;
        document.head.appendChild(el);
      }
      el.href = href;
    };
    ensureLink("alternate", "ja", url);
    ensureLink("alternate", "x-default", url);
    setMeta("og:title", pageTitle, true);
    setMeta("og:description", desc, true);
    setMeta("og:url", url, true);
    setMeta("og:type", type, true);
    setMeta("og:site_name", SITE_NAME, true);
    setMeta("og:image", img, true);
    setMeta("og:image:width", "1200", true);
    setMeta("og:image:height", "630", true);
    setMeta("og:locale", "ja_JP", true);
    if (type === "article") {
      if (publishedTime) setMeta("article:published_time", publishedTime, true);
      if (modifiedTime) setMeta("article:modified_time", modifiedTime, true);
      if (author) setMeta("article:author", author, true);
    }
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:site", TWITTER_HANDLE);
    setMeta("twitter:title", pageTitle);
    setMeta("twitter:description", desc);
    setMeta("twitter:image", img);
    upsertLd("seo-website-ld", {
      "@type": "WebSite",
      name: SITE_NAME,
      alternateName: SITE_NAME_ALT,
      url: BASE_URL$1,
      description: DEFAULT_DESC,
      inLanguage: "ja-JP",
      isAccessibleForFree: true,
      keywords: DEFAULT_KEYWORDS,
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL$1}/search?q={search_term_string}` },
        "query-input": "required name=search_term_string"
      }
    });
    upsertLd("seo-org-ld", {
      "@type": "Organization",
      name: SITE_NAME,
      alternateName: [SITE_NAME_ALT, "SAP Panda Academy"],
      url: BASE_URL$1,
      logo: `${BASE_URL$1}/panda-sensei.png`,
      description: DEFAULT_DESC,
      foundingDate: "2025",
      sameAs: [
        "https://twitter.com/sap_panda",
        "https://www.youtube.com/@sap-panda"
      ],
      knowsAbout: ["SAP", "ERP", "S/4HANA", "ABAP", "会計システム", "ビジネス改革"]
    });
    upsertLd("seo-sitenav-ld", {
      "@type": "SiteNavigationElement",
      name: SITE_NAME,
      hasPart: [
        { "@type": "WebPage", name: "ホーム", url: `${BASE_URL$1}/` },
        { "@type": "WebPage", name: "モジュール一覧", url: `${BASE_URL$1}/modules` },
        { "@type": "WebPage", name: "学習パス", url: `${BASE_URL$1}/paths` },
        { "@type": "WebPage", name: "用語集", url: `${BASE_URL$1}/glossary` },
        { "@type": "WebPage", name: "SAPトレンド", url: `${BASE_URL$1}/trends` },
        { "@type": "WebPage", name: "転職ガイド", url: `${BASE_URL$1}/career` },
        { "@type": "WebPage", name: "検索", url: `${BASE_URL$1}/search` }
      ]
    });
    if (breadcrumbs && breadcrumbs.length > 0) {
      upsertLd("seo-breadcrumb-ld", {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: `${BASE_URL$1}${b.path}`
        }))
      });
    } else {
      removeLd("seo-breadcrumb-ld");
    }
    if (type === "article" && title) {
      upsertLd("seo-article-ld", {
        "@type": "Article",
        headline: title,
        description: desc,
        image: img,
        author: author ? { "@type": "Person", name: author } : { "@type": "Organization", name: SITE_NAME },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: { "@type": "ImageObject", url: `${BASE_URL$1}/panda-sensei.png` }
        },
        datePublished: publishedTime || (/* @__PURE__ */ new Date()).toISOString(),
        dateModified: modifiedTime || publishedTime || (/* @__PURE__ */ new Date()).toISOString(),
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        inLanguage: "ja-JP",
        isAccessibleForFree: true,
        ...articleBody ? { articleBody } : {}
      });
    } else {
      removeLd("seo-article-ld");
    }
    upsertLd("seo-webpage-ld", {
      "@type": pageType,
      "@id": url,
      url,
      name: pageTitle,
      description: desc,
      inLanguage: "ja-JP",
      isAccessibleForFree: true,
      about: FOCUS_KEYPHRASES.map((kp) => ({ "@type": "Thing", name: kp })),
      mainEntity: type === "article" ? { "@type": "Article", headline: title } : void 0
    });
    if (pageType === "FAQPage" || (breadcrumbs == null ? void 0 : breadcrumbs.some((b) => b.path.includes("faq")))) {
      const faqs = [
        { q: "SAPとは何ですか？", a: "SAPは、ドイツに本社を置く世界最大級のERPソフトウェア企業です。財務会計（FI）、管理会計（CO）、購買管理（MM）、販売管理（SD）などのモジュールで構成されます。" },
        { q: "S/4HANAと従来のSAP ERPの違いは？", a: "S/4HANAは次世代ERPで、インメモリDB（HANA）による高速処理、Fiori UI、AI機能統合が特徴です。" },
        { q: "SAPコンサルタントになるには？", a: "特定モジュールの知識を深め、SAP公式認定資格を取得し、実務経験を積むことが重要です。" }
      ];
      upsertLd("seo-faq-ld", {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a }
        }))
      });
    } else {
      removeLd("seo-faq-ld");
    }
  }, [pageTitle, desc, url, img, type, noindex, kw, publishedTime, modifiedTime, author, breadcrumbs, articleBody, pageType]);
  return null;
}
function LoginModal({ onClose }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirm2, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (tab === "register") {
      if (!name || !email || !password) {
        setError("すべての項目を入力してください。");
        return;
      }
      if (password.length < 6) {
        setError("パスワードは6文字以上で入力してください。");
        return;
      }
      if (password !== confirm2) {
        setError("パスワードが一致しません。");
        return;
      }
    } else {
      if (!email || !password) {
        setError("メールアドレスとパスワードを入力してください。");
        return;
      }
    }
    setLoading(true);
    const ok = tab === "login" ? await login(email, password) : await register(email, password, name);
    setLoading(false);
    if (ok) onClose();
    else setError(tab === "login" ? "メールアドレスまたはパスワードが正しくありません。" : "登録に失敗しました。");
  }
  return /* @__PURE__ */ jsx("div", { className: "case-modal-overlay", onClick: onClose, children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "case-modal",
      style: { maxWidth: 420, padding: 0, overflow: "hidden" },
      onClick: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", borderBottom: "1px solid var(--line-2)" }, children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                setTab("login");
                setError("");
              },
              style: {
                flex: 1,
                padding: "14px 0",
                textAlign: "center",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 15,
                border: "none",
                borderBottom: `2px solid ${tab === "login" ? "var(--accent)" : "transparent"}`,
                background: tab === "login" ? "var(--accent-soft)" : "transparent",
                color: tab === "login" ? "var(--accent-deep)" : "var(--ink-2)",
                transition: "all .15s"
              },
              children: "ログイン"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                setTab("register");
                setError("");
              },
              style: {
                flex: 1,
                padding: "14px 0",
                textAlign: "center",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 15,
                border: "none",
                borderBottom: `2px solid ${tab === "register" ? "var(--accent)" : "transparent"}`,
                background: tab === "register" ? "var(--accent-soft)" : "transparent",
                color: tab === "register" ? "var(--accent-deep)" : "var(--ink-2)",
                transition: "all .15s"
              },
              children: "新規登録"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("button", { className: "case-modal-x", onClick: onClose, children: "×" }),
        /* @__PURE__ */ jsxs("div", { style: { padding: "28px 32px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: 20 }, children: [
            /* @__PURE__ */ jsxs("svg", { width: "52", height: "52", viewBox: "-4 -8 108 108", style: { display: "inline-block" }, children: [
              /* @__PURE__ */ jsx("circle", { cx: "50", cy: "52", r: "46", fill: "#d8ead9" }),
              /* @__PURE__ */ jsx("path", { d: "M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z", fill: "#fdfaf2" }),
              /* @__PURE__ */ jsxs("g", { children: [
                /* @__PURE__ */ jsx("path", { d: "M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z", fill: "#1a1612" }),
                /* @__PURE__ */ jsx("path", { d: "M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z", fill: "#1a1612" })
              ] }),
              /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "3.4", fill: "#fff" }),
              /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "2.4", fill: "#0e0a05" }),
              /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "3.4", fill: "#fff" }),
              /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "2.4", fill: "#0e0a05" }),
              /* @__PURE__ */ jsx("ellipse", { cx: "50", cy: "62", rx: "3.4", ry: "2.5", fill: "#1a1612" }),
              /* @__PURE__ */ jsx("path", { d: "M 42 68 Q 50 78 58 68", fill: "#1a1612" })
            ] }),
            /* @__PURE__ */ jsx("h2", { style: { fontFamily: "var(--font-display)", fontSize: 20, color: "var(--ink-0)", margin: "8px 0 0" }, children: tab === "login" ? "ログイン" : "パンダ先生と一緒に学ぼう 🎋" })
          ] }),
          error && /* @__PURE__ */ jsx("div", { style: { background: "var(--rose-soft)", color: "var(--rose)", padding: "10px 14px", borderRadius: "var(--r-md)", fontSize: 13, marginBottom: 16 }, children: error }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, style: { display: "flex", flexDirection: "column", gap: 14 }, children: [
            tab === "register" && /* @__PURE__ */ jsxs("label", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: 12.5, fontWeight: 600, color: "var(--ink-0)" }, children: "お名前" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: name,
                  onChange: (e) => setName(e.target.value),
                  placeholder: "パンダ 太郎",
                  style: inputStyle$2
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: 12.5, fontWeight: 600, color: "var(--ink-0)" }, children: "メールアドレス" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  placeholder: "you@example.com",
                  style: inputStyle$2
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
              /* @__PURE__ */ jsxs("span", { style: { fontSize: 12.5, fontWeight: 600, color: "var(--ink-0)" }, children: [
                "パスワード",
                tab === "register" && /* @__PURE__ */ jsx("span", { style: { fontWeight: 400, color: "var(--ink-3)", fontSize: 11 }, children: " 6文字以上" })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { position: "relative" }, children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: showPassword ? "text" : "password",
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                    placeholder: "••••••••",
                    style: { ...inputStyle$2, paddingRight: 40 }
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowPassword(!showPassword),
                    style: {
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 4,
                      fontSize: 18,
                      lineHeight: 1,
                      color: "var(--ink-3)"
                    },
                    children: showPassword ? "👁" : "👁‍🗨"
                  }
                )
              ] })
            ] }),
            tab === "register" && /* @__PURE__ */ jsxs("label", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: 12.5, fontWeight: 600, color: "var(--ink-0)" }, children: "パスワード（確認）" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  value: confirm2,
                  onChange: (e) => setConfirm(e.target.value),
                  placeholder: "••••••••",
                  style: { ...inputStyle$2, borderColor: confirm2 && password !== confirm2 ? "var(--rose)" : "var(--line-2)" }
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: loading,
                className: "btn accent",
                style: { width: "100%", justifyContent: "center", padding: 12, fontSize: 15, marginTop: 4 },
                children: loading ? "処理中..." : tab === "login" ? "ログイン" : "無料登録する"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
const inputStyle$2 = {
  padding: "10px 14px",
  border: "1.5px solid var(--line-2)",
  borderRadius: "var(--r-md)",
  fontSize: 14,
  outline: "none",
  fontFamily: "inherit",
  width: "100%"
};
const menuItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 10px",
  borderRadius: "var(--r-sm)",
  color: "var(--ink-1)",
  textDecoration: "none",
  fontSize: 13,
  transition: "background .1s"
};
const menuIconStyle = {
  width: 20,
  textAlign: "center",
  fontSize: 15,
  flexShrink: 0
};
const commonBtnStyle = {
  width: "100%",
  border: "none",
  background: "none",
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: 13,
  textAlign: "left"
};
function HeaderDropdown({ onClose }) {
  var _a;
  const { user, logout } = useAuth();
  const ref = useRef(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [hoverIdx, setHoverIdx] = useState(-1);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  const handleLogout = () => {
    setLoggingOut(true);
    logout();
    onClose();
  };
  if (!user) return null;
  const isAdmin = (_a = user.roles) == null ? void 0 : _a.includes("administrator");
  const items = [
    { type: "link", to: "/profile", icon: "👤", label: "マイプロフィール" },
    { type: "link", to: "/membership", icon: "⭐", label: "会員プラン" },
    { type: "link", to: "/profile?tab=points", icon: "🏆", label: "学習記録・ポイント" }
  ];
  if (isAdmin) {
    items.push({ type: "divider" });
    items.push({ type: "link", to: "/admin/courses", icon: "⚙", label: "管理画面" });
  }
  items.push({ type: "divider" });
  items.push({ type: "btn", icon: "🚪", label: loggingOut ? "ログアウト中..." : "ログアウト", action: handleLogout, color: "var(--rose)" });
  return /* @__PURE__ */ jsxs("div", { ref, style: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "var(--bg-card)",
    borderRadius: "var(--r-lg)",
    border: "1px solid var(--line-2)",
    boxShadow: "var(--sh-3)",
    minWidth: 220,
    padding: "6px",
    zIndex: 100
  }, children: [
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 10px 10px",
      borderBottom: "1px solid var(--line-1)",
      marginBottom: 4
    }, children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: user.avatarUrl || "",
          alt: user.displayName,
          style: { width: 36, height: 36, borderRadius: "50%", objectFit: "cover", background: "var(--bg-tint)" },
          onError: (e) => {
            e.target.style.display = "none";
          }
        }
      ),
      /* @__PURE__ */ jsxs("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: 13, fontWeight: 600, color: "var(--ink-0)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: user.displayName }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: 11, color: "var(--ink-3)" }, children: user.email })
      ] })
    ] }),
    items.map((item, i) => {
      if (item.type === "divider") {
        return /* @__PURE__ */ jsx("div", { style: { borderTop: "1px solid var(--line-1)", margin: "4px 10px" } }, i);
      }
      if (item.type === "btn") {
        return /* @__PURE__ */ jsxs("button", { onClick: item.action, disabled: loggingOut, style: {
          ...menuItemStyle,
          ...commonBtnStyle,
          background: hoverIdx === i ? "var(--bg-tint)" : "transparent",
          color: item.color || "var(--ink-1)"
        }, onMouseEnter: () => setHoverIdx(i), onMouseLeave: () => setHoverIdx(-1), children: [
          /* @__PURE__ */ jsx("span", { style: menuIconStyle, children: item.icon }),
          " ",
          item.label
        ] }, i);
      }
      return /* @__PURE__ */ jsxs(Link, { to: item.to, onClick: onClose, style: {
        ...menuItemStyle,
        background: hoverIdx === i ? "var(--bg-tint)" : "transparent",
        color: item.color || "var(--ink-1)"
      }, onMouseEnter: () => setHoverIdx(i), onMouseLeave: () => setHoverIdx(-1), children: [
        /* @__PURE__ */ jsx("span", { style: menuIconStyle, children: item.icon }),
        " ",
        item.label
      ] }, i);
    })
  ] });
}
function MobileMenu() {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setOpen((prev) => !prev),
        "aria-label": "メニュー",
        style: {
          display: "none",
          /* visible via media query override below */
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 8,
          color: "var(--ink-0)",
          fontSize: 22,
          lineHeight: 1,
          alignItems: "center",
          justifyContent: "center"
        },
        className: "mobile-menu-btn",
        children: open ? "✕" : "☰"
      }
    ),
    open && /* @__PURE__ */ jsxs("div", { style: {
      position: "fixed",
      inset: 0,
      top: 64,
      zIndex: 90,
      background: "var(--bg-card)",
      borderTop: "1px solid var(--line-2)",
      display: "flex",
      flexDirection: "column",
      padding: "16px 20px",
      gap: 4,
      overflowY: "auto",
      animation: "modalIn .15s ease-out"
    }, children: [
      NAV_LINKS.map((l) => /* @__PURE__ */ jsx(
        Link,
        {
          to: l.href,
          onClick: () => setOpen(false),
          style: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 12px",
            borderRadius: "var(--r-md)",
            fontSize: 15,
            fontWeight: 600,
            color: "var(--ink-0)",
            textDecoration: "none",
            minHeight: 48
          },
          children: l.label
        },
        l.id
      )),
      /* @__PURE__ */ jsxs("div", { style: { borderTop: "1px solid var(--line-1)", margin: "8px 0", paddingTop: 12 }, children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/glossary",
            onClick: () => setOpen(false),
            style: { display: "block", padding: "10px 12px", fontSize: 14, color: "var(--ink-1)", textDecoration: "none" },
            children: "📚 用語集"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/trends",
            onClick: () => setOpen(false),
            style: { display: "block", padding: "10px 12px", fontSize: 14, color: "var(--ink-1)", textDecoration: "none" },
            children: "📈 SAPトレンド"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/career",
            onClick: () => setOpen(false),
            style: { display: "block", padding: "10px 12px", fontSize: 14, color: "var(--ink-1)", textDecoration: "none" },
            children: "🎯 転職ガイド"
          }
        )
      ] })
    ] })
  ] });
}
const PandaAvatar$1 = ({ size = 38 }) => /* @__PURE__ */ jsxs("svg", { width: size, height: size, viewBox: "-4 -8 108 108", children: [
  /* @__PURE__ */ jsx("circle", { cx: "50", cy: "52", r: "46", fill: "#e8f0fb", opacity: "0.4" }),
  /* @__PURE__ */ jsxs("g", { transform: "translate(0,0)", children: [
    /* @__PURE__ */ jsxs("g", { style: { transformOrigin: "24px 22px" }, children: [
      /* @__PURE__ */ jsx("ellipse", { cx: "22", cy: "18", rx: "13", ry: "12", fill: "#1a1612" }),
      /* @__PURE__ */ jsx("ellipse", { cx: "22", cy: "20", rx: "6", ry: "5", fill: "#3a2e22" })
    ] }),
    /* @__PURE__ */ jsxs("g", { style: { transformOrigin: "76px 22px", animationDelay: "0.3s" }, children: [
      /* @__PURE__ */ jsx("ellipse", { cx: "78", cy: "18", rx: "13", ry: "12", fill: "#1a1612" }),
      /* @__PURE__ */ jsx("ellipse", { cx: "78", cy: "20", rx: "6", ry: "5", fill: "#3a2e22" })
    ] }),
    /* @__PURE__ */ jsx("path", { d: "M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z", fill: "#fdfaf2" }),
    /* @__PURE__ */ jsxs("g", { children: [
      /* @__PURE__ */ jsx("path", { d: "M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z", fill: "#1a1612" }),
      /* @__PURE__ */ jsx("path", { d: "M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z", fill: "#1a1612" })
    ] }),
    /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "3.4", fill: "#fff" }),
    /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "2.4", fill: "#0e0a05" }),
    /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "3.4", fill: "#fff" }),
    /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "2.4", fill: "#0e0a05" }),
    /* @__PURE__ */ jsx("ellipse", { cx: "18", cy: "64", rx: "5.5", ry: "3", fill: "#f4b8c4", opacity: "0.7" }),
    /* @__PURE__ */ jsx("ellipse", { cx: "82", cy: "64", rx: "5.5", ry: "3", fill: "#f4b8c4", opacity: "0.7" }),
    /* @__PURE__ */ jsx("ellipse", { cx: "50", cy: "62", rx: "3.4", ry: "2.5", fill: "#1a1612" }),
    /* @__PURE__ */ jsx("path", { d: "M 50 64 L 50 67", stroke: "#1a1612", strokeWidth: "1.4", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M 43 70 Q 50 74 57 70", fill: "none", stroke: "#1a1612", strokeWidth: "1.8", strokeLinecap: "round" })
  ] })
] });
function SiteHeader({ active = "home" }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        navigate("/search");
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [navigate]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("header", { className: "site-header", children: /* @__PURE__ */ jsxs("div", { className: "nav-wrap", children: [
      /* @__PURE__ */ jsxs(Link, { className: "brand", to: "/", children: [
        /* @__PURE__ */ jsx("div", { className: "logo-panda", children: /* @__PURE__ */ jsx(PandaAvatar$1, { size: 38 }) }),
        /* @__PURE__ */ jsxs("div", { className: "brand-text", children: [
          /* @__PURE__ */ jsxs("div", { className: "brand-name", children: [
            "パンダ",
            /* @__PURE__ */ jsx("span", { className: "sensei", children: "先生" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "brand-sub", children: "SAP NAVI · パンダ ナビ" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "nav-main", children: NAV_LINKS.map((l) => /* @__PURE__ */ jsx(
        Link,
        {
          to: l.href,
          className: `nav-link ${active === l.id ? "active" : ""}`,
          children: l.label
        },
        l.id
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "nav-right", children: [
        /* @__PURE__ */ jsxs("div", { className: "search-pill", onClick: () => navigate("/search"), style: { cursor: "pointer" }, children: [
          /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", children: [
            /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "7" }),
            /* @__PURE__ */ jsx("path", { d: "m20 20-3.5-3.5" })
          ] }),
          /* @__PURE__ */ jsx("span", { style: { flex: 1, fontSize: 13, color: "var(--ink-3)", userSelect: "none" }, children: "モジュール、用語、エラー番号..." }),
          /* @__PURE__ */ jsx("span", { className: "kbd", children: "⌘K" })
        ] }),
        user ? /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", position: "relative" }, children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              style: { cursor: "pointer", display: "flex", alignItems: "center", gap: 8, userSelect: "none" },
              onClick: () => setShowDropdown((prev) => !prev),
              children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: user.avatarUrl || "",
                    alt: user.displayName,
                    style: { width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--accent-soft)" },
                    onError: (e) => {
                      e.target.style.display = "none";
                    }
                  }
                ),
                /* @__PURE__ */ jsx("span", { style: { fontSize: 13, fontWeight: 600, color: "var(--ink-0)", whiteSpace: "nowrap" }, children: user.displayName })
              ]
            }
          ),
          showDropdown && /* @__PURE__ */ jsx(HeaderDropdown, { onClose: () => setShowDropdown(false) })
        ] }) : /* @__PURE__ */ jsx(
          "button",
          {
            className: "btn sm accent",
            onClick: () => setShowLogin(true),
            style: { border: "none", cursor: "pointer", fontFamily: "inherit" },
            children: "無料登録"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(MobileMenu, {})
    ] }) }),
    showLogin && /* @__PURE__ */ jsx(LoginModal, { onClose: () => setShowLogin(false) })
  ] });
}
const PandaAvatar = ({ size = 38 }) => /* @__PURE__ */ jsxs("svg", { width: size, height: size, viewBox: "-4 -8 108 108", children: [
  /* @__PURE__ */ jsx("circle", { cx: "50", cy: "52", r: "46", fill: "#e8f0fb", opacity: "0.4" }),
  /* @__PURE__ */ jsxs("g", { transform: "translate(0,0)", children: [
    /* @__PURE__ */ jsx("ellipse", { cx: "22", cy: "18", rx: "13", ry: "12", fill: "#1a1612" }),
    /* @__PURE__ */ jsx("ellipse", { cx: "78", cy: "18", rx: "13", ry: "12", fill: "#1a1612" }),
    /* @__PURE__ */ jsx("path", { d: "M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z", fill: "#fdfaf2" }),
    /* @__PURE__ */ jsxs("g", { children: [
      /* @__PURE__ */ jsx("path", { d: "M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z", fill: "#1a1612" }),
      /* @__PURE__ */ jsx("path", { d: "M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z", fill: "#1a1612" })
    ] }),
    /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "3.4", fill: "#fff" }),
    /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "2.4", fill: "#0e0a05" }),
    /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "3.4", fill: "#fff" }),
    /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "2.4", fill: "#0e0a05" }),
    /* @__PURE__ */ jsx("ellipse", { cx: "50", cy: "62", rx: "3.4", ry: "2.5", fill: "#1a1612" }),
    /* @__PURE__ */ jsx("path", { d: "M 43 70 Q 50 74 57 70", fill: "none", stroke: "#1a1612", strokeWidth: "1.8", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M 50 64 L 50 67", stroke: "#1a1612", strokeWidth: "1.4", strokeLinecap: "round" })
  ] })
] });
function SiteFooter() {
  return /* @__PURE__ */ jsxs("footer", { className: "site-footer", children: [
    /* @__PURE__ */ jsxs("div", { className: "foot-wrap", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(Link, { className: "brand", to: "/", style: { marginBottom: 6 }, children: [
          /* @__PURE__ */ jsx("div", { className: "logo-panda", style: { filter: "brightness(1.05)" }, children: /* @__PURE__ */ jsx(PandaAvatar, { size: 38 }) }),
          /* @__PURE__ */ jsxs("div", { className: "brand-text", children: [
            /* @__PURE__ */ jsxs("div", { className: "brand-name", children: [
              "パンダ",
              /* @__PURE__ */ jsx("span", { className: "sensei", style: { color: "#7dd49c" }, children: "先生" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "brand-sub", children: "SAP NAVI" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "foot-about", children: "SAPコンサル、開発者、ユーザー部門 — すべての SAPer のために、 パンダ先生がやさしく解説する SAP ナレッジサイト。" }),
        /* @__PURE__ */ jsx("div", { className: "foot-socials", children: ["X", "YT", "GH", "RSS"].map((s) => /* @__PURE__ */ jsx("a", { href: "#", className: "foot-soc", style: { fontSize: 11, fontWeight: 600 }, children: s }, s)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "foot-col", children: [
        /* @__PURE__ */ jsx("h5", { children: "モジュール" }),
        /* @__PURE__ */ jsx("ul", { children: SAP_MODULES.slice(0, 6).map((m) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { to: `/category/${m.slug}`, children: [
          m.code,
          " · ",
          m.name_ja
        ] }) }, m.code)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "foot-col", children: [
        /* @__PURE__ */ jsx("h5", { children: "コンテンツ" }),
        /* @__PURE__ */ jsxs("ul", { children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/#paths", children: "学習パス" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/#quiz", children: "今日の一問" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/#youtube", children: "動画講座" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/glossary", children: "用語集" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/trends", children: "SAPトレンド" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/career", children: "転職ガイド" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "foot-col", children: [
        /* @__PURE__ */ jsx("h5", { children: "パンダ先生" }),
        /* @__PURE__ */ jsxs("ul", { children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/about", children: "サイトについて" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/team", children: "執筆メンバー" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: "お問い合わせ" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/privacy", children: "プライバシー" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/terms", children: "利用規約" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "foot-bot", children: [
      /* @__PURE__ */ jsx("span", { className: "copy", children: "© 2026 パンダ先生 SAP NAVI. 大好きな SAP を、もっと身近に。" }),
      /* @__PURE__ */ jsx("span", { children: "Made with 🎋 in Tokyo" })
    ] })
  ] });
}
function PandaFloat() {
  return /* @__PURE__ */ jsxs("svg", { viewBox: "-4 -10 108 108", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsx("circle", { cx: "50", cy: "52", r: "48", fill: "#fff", stroke: "#1f4ea3", strokeWidth: "2.5" }),
    /* @__PURE__ */ jsxs("g", { transform: "translate(0,0)", children: [
      /* @__PURE__ */ jsx("ellipse", { cx: "22", cy: "18", rx: "13", ry: "12", fill: "#1a1612" }),
      /* @__PURE__ */ jsx("ellipse", { cx: "78", cy: "18", rx: "13", ry: "12", fill: "#1a1612" }),
      /* @__PURE__ */ jsx("path", { d: "M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z", fill: "#fdfaf2" }),
      /* @__PURE__ */ jsxs("g", { children: [
        /* @__PURE__ */ jsx("path", { d: "M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z", fill: "#1a1612" }),
        /* @__PURE__ */ jsx("path", { d: "M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z", fill: "#1a1612" })
      ] }),
      /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "3.4", fill: "#fff" }),
      /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "2.4", fill: "#0e0a05" }),
      /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "3.4", fill: "#fff" }),
      /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "2.4", fill: "#0e0a05" }),
      /* @__PURE__ */ jsx("ellipse", { cx: "50", cy: "62", rx: "3.4", ry: "2.5", fill: "#1a1612" }),
      /* @__PURE__ */ jsx("path", { d: "M 42 68 Q 50 78 58 68", fill: "#1a1612" })
    ] })
  ] });
}
function FloatingPanda() {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    open && /* @__PURE__ */ jsxs("div", { style: {
      position: "fixed",
      bottom: 96,
      right: 22,
      background: "var(--bg-card)",
      borderRadius: "14px",
      padding: "14px 16px",
      maxWidth: 260,
      boxShadow: "var(--sh-3)",
      border: "1.5px solid var(--accent)",
      zIndex: 40,
      fontSize: 13,
      lineHeight: 1.7
    }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--accent-deep)", marginBottom: 4 }, children: "パンダ先生" }),
      "こんにちは！🎋",
      /* @__PURE__ */ jsx("br", {}),
      "何かわからないこと、ある？",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }, children: ["仕訳", "BAPI", "原価計算", "BOM"].map((t) => /* @__PURE__ */ jsx("span", { style: { fontSize: 11, padding: "3px 8px", background: "var(--accent-soft)", borderRadius: 999, color: "var(--accent-deep)", fontWeight: 600 }, children: t }, t)) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "float-panda", onClick: () => setOpen((o) => !o), title: "パンダ先生に質問", children: /* @__PURE__ */ jsx(PandaFloat, {}) })
  ] });
}
const STORAGE_KEY = "sap_panda_theme";
const DEFAULT = {
  palette: "bamboo",
  reading: 1,
  intensity: "medium",
  showFloatingPanda: true
};
function load() {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
}
function apply(s) {
  const root = document.documentElement;
  root.dataset.theme = s.palette;
  root.style.setProperty("--reading", String(s.reading));
  root.dataset.intensity = s.intensity;
}
function useTheme() {
  const [settings, setSettings] = useState(load);
  useEffect(() => {
    apply(settings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) document.documentElement.dataset.intensity = "off";
    const handler = (e) => {
      document.documentElement.dataset.intensity = e.matches ? "off" : settings.intensity;
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [settings.intensity]);
  const update = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);
  return { settings, updateSetting: update };
}
const FALLBACK_TICKER = [
  { id: 0, mods: ["fi", "co"], title: "グローバル製造業 / S4移行に伴う FI-CO コンサル", rate_min: 85, rate_max: 110, rate_label: "月85〜110万", hi: true, urgent: true, period: "6ヶ月〜", utilization: "週5", location: "東京", remote: "一部リモート", experience: "5年以上", seats: 2, scarce: false, skills_must: ["FI", "CO", "S/4HANA"], skills_want: ["PM経験"], blurb: "大手製造業のS/4HANA移行プロジェクト", company: "", created_at: "" },
  { id: 1, mods: ["abap"], title: "アドオン開発リード / CDS・RAP 中心のモダン ABAP", rate_min: 75, rate_max: 95, rate_label: "月75〜95万", hi: true, urgent: true, period: "長期", utilization: "週5", location: "東京", remote: "フルリモート", experience: "3年以上", seats: 1, scarce: false, skills_must: ["ABAP", "CDS"], skills_want: ["RAP"], blurb: "", company: "", created_at: "" },
  { id: 2, mods: ["mm", "sd"], title: "物流・小売 / MM-SD 保守運用 & 機能改善", rate_min: 65, rate_max: 80, rate_label: "月65〜80万", hi: false, urgent: false, period: "6ヶ月〜", utilization: "週5", location: "大阪", remote: "一部リモート", experience: "3年以上", seats: 1, scarce: false, skills_must: ["MM", "SD"], skills_want: [], blurb: "", company: "", created_at: "" },
  { id: 3, mods: ["s4", "fi"], title: "大手商社 / S/4HANA 導入 PMO・推進支援", rate_min: 90, rate_max: 110, rate_label: "月90〜110万", hi: true, urgent: false, period: "1年〜", utilization: "週5", location: "東京", remote: "一部リモート", experience: "7年以上", seats: 1, scarce: false, skills_must: ["FI", "S/4HANA"], skills_want: ["PMO"], blurb: "", company: "", created_at: "" },
  { id: 4, mods: ["co"], title: "管理会計 / 原価計算まわりの設計支援", rate_min: 70, rate_max: 85, rate_label: "月70〜85万", hi: false, urgent: true, period: "3ヶ月〜", utilization: "週5", location: "名古屋", remote: "一部リモート", experience: "3年以上", seats: 2, scarce: false, skills_must: ["CO", "原価計算"], skills_want: [], blurb: "", company: "", created_at: "" },
  { id: 5, mods: ["basis"], title: "SAP Basis 運用 / 権限・パッチ・監視", rate_min: 60, rate_max: 75, rate_label: "月60〜75万", hi: false, urgent: false, period: "長期", utilization: "週5", location: "東京", remote: "リモート可", experience: "3年以上", seats: 1, scarce: false, skills_must: ["Basis"], skills_want: ["CLOUD"], blurb: "", company: "", created_at: "" },
  { id: 6, mods: ["pp", "mm"], title: "製造業 / PP-MM 生産・購買プロセス改善", rate_min: 72, rate_max: 88, rate_label: "月72〜88万", hi: false, urgent: true, period: "6ヶ月〜", utilization: "週5", location: "福岡", remote: "一部リモート", experience: "3年以上", seats: 1, scarce: false, skills_must: ["PP", "MM"], skills_want: [], blurb: "", company: "", created_at: "" },
  { id: 7, mods: ["sd"], title: "BtoB販売 / SD 受注〜請求の機能拡張", rate_min: 68, rate_max: 82, rate_label: "月68〜82万", hi: false, urgent: false, period: "3ヶ月〜", utilization: "週5", location: "東京", remote: "リモート可", experience: "3年以上", seats: 1, scarce: false, skills_must: ["SD"], skills_want: ["EDI"], blurb: "", company: "", created_at: "" }
];
const MOD_COLOR$3 = {
  fi: "#2f6d44",
  co: "#2641a1",
  mm: "#a25411",
  sd: "#b62a4a",
  pp: "#4828a8",
  hr: "#8a6212",
  abap: "#1f6f6f",
  basis: "#4a432d",
  s4: "#1864a3"
};
function CaseTicker({ cases, onOpen }) {
  const tickerCases = cases && cases.length > 0 ? cases.slice(0, 8) : FALLBACK_TICKER;
  const items = [...tickerCases, ...tickerCases];
  const maxRate = cases && cases.length > 0 ? Math.max(...cases.map((c) => c.rate_max), 0) : Math.max(...FALLBACK_TICKER.map((c) => c.rate_max), 0);
  return /* @__PURE__ */ jsxs("div", { className: "case-ticker", id: "cases-top", children: [
    /* @__PURE__ */ jsxs("div", { className: "ticker-head", children: [
      /* @__PURE__ */ jsxs("div", { className: "ticker-flag", children: [
        /* @__PURE__ */ jsx("span", { className: "pulse" }),
        "SAP案件 募集中"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ticker-count", children: [
        /* @__PURE__ */ jsx("b", { children: (cases == null ? void 0 : cases.length) || FALLBACK_TICKER.length }),
        "件の案件 — ",
        /* @__PURE__ */ jsxs("span", { className: "hi", children: [
          "最高 月",
          maxRate,
          "万円"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "ticker-viewport", children: /* @__PURE__ */ jsx("div", { className: "ticker-track", children: items.map((c, i) => /* @__PURE__ */ jsxs(
      "a",
      {
        className: "ticker-pill",
        style: { cursor: onOpen ? "pointer" : "default" },
        onClick: (e) => {
          if (onOpen) {
            e.preventDefault();
            onOpen(c);
          }
        },
        children: [
          c.urgent && /* @__PURE__ */ jsx("span", { className: "tp-urgent", children: "急募" }),
          /* @__PURE__ */ jsx("span", { className: "tp-mod", style: { background: MOD_COLOR$3[c.mods[0]] || "#5a9d6e" }, children: c.mods[0] }),
          /* @__PURE__ */ jsx("span", { className: "tp-title", children: c.title }),
          /* @__PURE__ */ jsxs("span", { className: `tp-rate${c.hi ? " hi" : ""}`, children: [
            "月",
            c.rate_min,
            "万〜"
          ] })
        ]
      },
      i
    )) }) })
  ] });
}
const MATCH_MODULES$1 = ["FI", "CO", "MM", "SD", "PP", "HR", "ABAP", "Basis", "S/4"];
const MOD_COLOR$2 = {
  fi: "#2f6d44",
  co: "#2641a1",
  mm: "#a25411",
  sd: "#b62a4a",
  pp: "#4828a8",
  hr: "#8a6212",
  abap: "#1f6f6f",
  basis: "#4a432d",
  s4: "#1864a3",
  "s/4": "#1864a3"
};
function SkillMatchBar({ picked, onToggle, matchCount }) {
  return /* @__PURE__ */ jsxs("div", { className: "match-bar", children: [
    /* @__PURE__ */ jsxs("div", { className: "match-left", children: [
      /* @__PURE__ */ jsx("div", { className: "match-q", style: { fontSize: 13, fontWeight: 700, color: "var(--ink-0)", marginBottom: 8 }, children: "あなたの得意モジュールは？" }),
      /* @__PURE__ */ jsx("div", { className: "match-chips", children: MATCH_MODULES$1.map((m) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: `match-chip${picked.includes(m) ? " on" : ""}`,
          style: picked.includes(m) ? { background: MOD_COLOR$2[m.toLowerCase()], borderColor: MOD_COLOR$2[m.toLowerCase()], color: "#fff" } : {},
          onClick: () => onToggle(m),
          children: m
        },
        m
      )) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "match-result", style: { textAlign: "right" }, children: /* @__PURE__ */ jsxs("div", { className: "match-count", children: [
      /* @__PURE__ */ jsx("div", { className: "mc-label", style: { fontSize: 11, color: "var(--ink-3)" }, children: "あなたに合う案件" }),
      /* @__PURE__ */ jsxs("span", { className: "mc-num", style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, color: "var(--accent)" }, children: [
        matchCount,
        /* @__PURE__ */ jsx("small", { style: { fontSize: 14 }, children: "件" })
      ] })
    ] }) })
  ] });
}
const MOD_COLOR$1 = {
  fi: "#2f6d44",
  co: "#2641a1",
  mm: "#a25411",
  sd: "#b62a4a",
  pp: "#4828a8",
  hr: "#8a6212",
  abap: "#1f6f6f",
  basis: "#4a432d",
  s4: "#1864a3"
};
function CaseCard({ c, matched, onOpen }) {
  return /* @__PURE__ */ jsxs("article", { className: `case-card${matched ? " matched" : ""}`, onClick: () => onOpen(c), children: [
    matched && /* @__PURE__ */ jsx("div", { className: "case-match-ribbon", children: "スキル一致" }),
    /* @__PURE__ */ jsxs("div", { className: "case-card-top", children: [
      /* @__PURE__ */ jsx("div", { className: "case-mods", children: c.mods.map((m) => /* @__PURE__ */ jsx("span", { className: "case-mod", style: { background: MOD_COLOR$1[m] }, children: m }, m)) }),
      /* @__PURE__ */ jsxs("div", { className: "case-flags", children: [
        c.urgent && /* @__PURE__ */ jsx("span", { className: "flag urgent", children: "急募" }),
        c.scarce && /* @__PURE__ */ jsxs("span", { className: "flag scarce", children: [
          "残り",
          c.seats,
          "枠"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("h3", { className: "case-title", children: c.title }),
    /* @__PURE__ */ jsxs("div", { className: "case-rate-row", children: [
      /* @__PURE__ */ jsxs("div", { className: `case-rate${c.hi ? " hi" : ""}`, children: [
        /* @__PURE__ */ jsx("span", { className: "unit", children: "月" }),
        /* @__PURE__ */ jsxs("span", { className: "num", children: [
          c.rate_min,
          "〜",
          c.rate_max
        ] }),
        /* @__PURE__ */ jsx("span", { className: "unit", children: "万円" })
      ] }),
      c.hi && /* @__PURE__ */ jsx("span", { className: "case-hi-badge", children: "高単価" })
    ] }),
    /* @__PURE__ */ jsxs("dl", { className: "case-meta", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("dt", { children: "期間" }),
        /* @__PURE__ */ jsx("dd", { children: c.period })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("dt", { children: "勤務地" }),
        /* @__PURE__ */ jsxs("dd", { children: [
          c.location,
          /* @__PURE__ */ jsxs("span", { className: "case-remote", children: [
            " · ",
            c.remote
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("dt", { children: "経験" }),
        /* @__PURE__ */ jsx("dd", { children: c.experience })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "case-skills", children: c.skills_must.slice(0, 2).map((s, i) => /* @__PURE__ */ jsx("span", { className: "case-skill", children: s }, i)) }),
    /* @__PURE__ */ jsxs("div", { className: "case-card-foot", children: [
      /* @__PURE__ */ jsxs("span", { className: "case-seats", children: [
        "募集 ",
        c.seats,
        " 名"
      ] }),
      /* @__PURE__ */ jsx("span", { className: "case-open", children: "詳細を見る →" })
    ] })
  ] });
}
function CaseDetailModal({ c, onClose, onApply }) {
  if (!c) return null;
  return /* @__PURE__ */ jsx("div", { className: "case-modal-overlay", onClick: onClose, children: /* @__PURE__ */ jsxs("div", { className: "case-modal detail", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsx("button", { className: "case-modal-x", onClick: onClose, "aria-label": "閉じる", children: "×" }),
    /* @__PURE__ */ jsxs("div", { className: "case-detail-head", children: [
      /* @__PURE__ */ jsxs("div", { className: "case-mods", children: [
        c.mods.map((m) => /* @__PURE__ */ jsx("span", { className: "case-mod", style: { background: MOD_COLOR$1[m] }, children: m }, m)),
        c.urgent && /* @__PURE__ */ jsx("span", { className: "flag urgent", children: "急募" }),
        c.scarce && /* @__PURE__ */ jsxs("span", { className: "flag scarce", children: [
          "残り",
          c.seats,
          "枠"
        ] })
      ] }),
      /* @__PURE__ */ jsx("h3", { children: c.title }),
      /* @__PURE__ */ jsxs("div", { className: `case-rate big${c.hi ? " hi" : ""}`, children: [
        /* @__PURE__ */ jsx("span", { className: "unit", children: "月額" }),
        /* @__PURE__ */ jsxs("span", { className: "num", children: [
          c.rate_min,
          "〜",
          c.rate_max
        ] }),
        /* @__PURE__ */ jsx("span", { className: "unit", children: "万円" }),
        c.hi && /* @__PURE__ */ jsx("span", { className: "case-hi-badge", children: "高単価" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "case-blurb", children: c.blurb }),
    /* @__PURE__ */ jsxs("div", { className: "case-detail-grid", children: [
      /* @__PURE__ */ jsxs("div", { className: "case-spec", children: [
        /* @__PURE__ */ jsx("span", { className: "k", children: "契約期間" }),
        /* @__PURE__ */ jsx("span", { className: "v", children: c.period })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "case-spec", children: [
        /* @__PURE__ */ jsx("span", { className: "k", children: "稼働形態" }),
        /* @__PURE__ */ jsx("span", { className: "v", children: c.utilization })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "case-spec", children: [
        /* @__PURE__ */ jsx("span", { className: "k", children: "勤務地" }),
        /* @__PURE__ */ jsxs("span", { className: "v", children: [
          c.location,
          "（",
          c.remote,
          "）"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "case-spec", children: [
        /* @__PURE__ */ jsx("span", { className: "k", children: "必要経験" }),
        /* @__PURE__ */ jsx("span", { className: "v", children: c.experience })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "case-spec", children: [
        /* @__PURE__ */ jsx("span", { className: "k", children: "募集人数" }),
        /* @__PURE__ */ jsxs("span", { className: "v", children: [
          c.seats,
          " 名"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "case-skill-block", children: [
      /* @__PURE__ */ jsx("h4", { children: "必須スキル" }),
      /* @__PURE__ */ jsx("ul", { className: "case-skill-list must", children: c.skills_must.map((s, i) => /* @__PURE__ */ jsx("li", { children: s }, i)) }),
      /* @__PURE__ */ jsx("h4", { children: "歓迎スキル" }),
      /* @__PURE__ */ jsx("ul", { className: "case-skill-list want", children: c.skills_want.map((s, i) => /* @__PURE__ */ jsx("li", { children: s }, i)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "case-sensei-note", children: [
      /* @__PURE__ */ jsx("div", { className: "case-sensei-svg", children: /* @__PURE__ */ jsxs("svg", { width: "48", height: "48", viewBox: "0 0 100 100", children: [
        /* @__PURE__ */ jsx("circle", { cx: "50", cy: "52", r: "46", fill: "#d8ead9" }),
        /* @__PURE__ */ jsx("circle", { cx: "50", cy: "52", r: "42", fill: "#fff" }),
        /* @__PURE__ */ jsx("path", { d: "M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z", fill: "#fdfaf2" }),
        /* @__PURE__ */ jsxs("g", { children: [
          /* @__PURE__ */ jsx("path", { d: "M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z", fill: "#1a1612" }),
          /* @__PURE__ */ jsx("path", { d: "M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z", fill: "#1a1612" })
        ] }),
        /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "3.4", fill: "#fff" }),
        /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "2.4", fill: "#0e0a05" }),
        /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "3.4", fill: "#fff" }),
        /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "2.4", fill: "#0e0a05" }),
        /* @__PURE__ */ jsx("ellipse", { cx: "50", cy: "62", rx: "3.4", ry: "2.5", fill: "#1a1612" }),
        /* @__PURE__ */ jsx("path", { d: "M 42 68 Q 50 78 58 68", fill: "#1a1612" })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("strong", { children: "パンダ先生より" }),
        "この案件、あなたの経歴と相性が良さそう。まずは応募して話を聞いてみよう。",
        /* @__PURE__ */ jsx("b", { children: "応募 = 即決定ではない" }),
        "から、気軽に第一歩を踏み出してOKだよ。🎋"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "case-modal-foot", children: [
      /* @__PURE__ */ jsx("button", { className: "btn", type: "button", onClick: onClose, children: "一覧に戻る" }),
      /* @__PURE__ */ jsxs("button", { className: "btn accent", type: "button", onClick: () => onApply(c), children: [
        "この案件に応募する",
        /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", children: /* @__PURE__ */ jsx("path", { d: "M5 12h14M13 6l6 6-6 6" }) })
      ] })
    ] })
  ] }) });
}
const MATCH_MODULES = ["FI", "CO", "MM", "SD", "PP", "HR", "ABAP", "Basis", "S/4"];
function ApplyForm({ c, onClose }) {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [skills, setSkills] = useState(c ? c.mods.slice() : []);
  const [fileName, setFileName] = useState("");
  if (!c) return null;
  function toggleSkill(m) {
    setSkills((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : prev.concat(m));
  }
  async function submit(e) {
    e.preventDefault();
    if (!c) return;
    setSubmitting(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    skills.forEach((s) => fd.append("skill_modules[]", s));
    try {
      const res = await api.applyToCase(c.id, fd);
      if (res.success) setDone(true);
      else setError(res.message || "応募に失敗しました。");
    } catch {
      setError("サーバーエラーが発生しました。");
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsx("div", { className: "case-modal-overlay", onClick: onClose, children: /* @__PURE__ */ jsxs("div", { className: "case-modal apply", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsx("button", { className: "case-modal-x", onClick: onClose, "aria-label": "閉じる", children: "×" }),
    !done ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "apply-head", children: [
        /* @__PURE__ */ jsx("div", { className: "apply-step", children: "応募フォーム" }),
        /* @__PURE__ */ jsx("h3", { children: c.title }),
        /* @__PURE__ */ jsxs("div", { className: "apply-target-rate", children: [
          "月",
          c.rate_min,
          "〜",
          c.rate_max,
          "万円 · ",
          c.remote
        ] })
      ] }),
      error && /* @__PURE__ */ jsx("div", { style: {
        background: "var(--rose-soft)",
        color: "var(--rose)",
        padding: "10px 14px",
        borderRadius: "var(--r-md)",
        fontSize: 13,
        marginBottom: 16
      }, children: error }),
      /* @__PURE__ */ jsxs("form", { className: "apply-form", onSubmit: submit, children: [
        /* @__PURE__ */ jsx("input", { type: "hidden", name: "case_id", value: c.id }),
        /* @__PURE__ */ jsxs("div", { className: "apply-row", children: [
          /* @__PURE__ */ jsxs("label", { className: "apply-field", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "お名前 ",
              /* @__PURE__ */ jsx("i", { children: "必須" })
            ] }),
            /* @__PURE__ */ jsx("input", { type: "text", name: "name", required: true, placeholder: "山田 太郎" })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "apply-field", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "メール ",
              /* @__PURE__ */ jsx("i", { children: "必須" })
            ] }),
            /* @__PURE__ */ jsx("input", { type: "email", name: "email", required: true, placeholder: "you@example.com" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "apply-row", children: [
          /* @__PURE__ */ jsxs("label", { className: "apply-field", children: [
            /* @__PURE__ */ jsx("span", { children: "電話番号" }),
            /* @__PURE__ */ jsx("input", { type: "tel", name: "phone", placeholder: "090-1234-5678" })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "apply-field", children: [
            /* @__PURE__ */ jsx("span", { children: "希望単価（月）" }),
            /* @__PURE__ */ jsx("input", { type: "text", name: "expected_rate", defaultValue: `${c.rate_min}〜${c.rate_max}万円` })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "apply-row", children: [
          /* @__PURE__ */ jsxs("label", { className: "apply-field", children: [
            /* @__PURE__ */ jsx("span", { children: "稼働開始" }),
            /* @__PURE__ */ jsxs("select", { name: "start_timing", defaultValue: "1m", children: [
              /* @__PURE__ */ jsx("option", { value: "now", children: "すぐに" }),
              /* @__PURE__ */ jsx("option", { value: "2w", children: "2週間以内" }),
              /* @__PURE__ */ jsx("option", { value: "1m", children: "1ヶ月以内" }),
              /* @__PURE__ */ jsx("option", { value: "2m", children: "2ヶ月以降" }),
              /* @__PURE__ */ jsx("option", { value: "ask", children: "相談したい" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "apply-field", children: [
            /* @__PURE__ */ jsx("span", { children: "経験年数" }),
            /* @__PURE__ */ jsxs("select", { name: "experience_years", defaultValue: "3", children: [
              /* @__PURE__ */ jsx("option", { value: "1", children: "1〜2年" }),
              /* @__PURE__ */ jsx("option", { value: "3", children: "3〜5年" }),
              /* @__PURE__ */ jsx("option", { value: "6", children: "6〜9年" }),
              /* @__PURE__ */ jsx("option", { value: "10", children: "10年以上" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "apply-field", children: [
          /* @__PURE__ */ jsx("span", { children: "得意なモジュール" }),
          /* @__PURE__ */ jsx("div", { className: "apply-skill-chips", children: MATCH_MODULES.map((m) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: `apply-chip${skills.includes(m) ? " on" : ""}`,
              onClick: () => toggleSkill(m),
              children: m
            },
            m
          )) })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "apply-field", children: [
          /* @__PURE__ */ jsx("span", { children: "自己PR・希望条件" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              name: "self_pr",
              rows: 3,
              placeholder: "これまでのご経験、得意領域、稼働・働き方の希望などを自由にご記入ください。"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "apply-field", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "履歴書・職務経歴書を添付 ",
            /* @__PURE__ */ jsx("i", { className: "opt", children: "任意" })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "apply-file", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                name: "resume",
                accept: ".pdf,.doc,.docx,.xls,.xlsx",
                onChange: (e) => {
                  var _a, _b;
                  return setFileName(((_b = (_a = e.target.files) == null ? void 0 : _a[0]) == null ? void 0 : _b.name) || "");
                }
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "apply-file-text", children: fileName || "PDF / Word をドラッグ＆ドロップ、またはクリック" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "apply-agree", children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", required: true }),
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("a", { href: "#", children: "利用規約・個人情報の取り扱い" }),
            "に同意します"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("button", { className: "btn accent apply-submit", type: "submit", disabled: submitting, children: [
          submitting ? "送信中..." : "この内容で応募する",
          /* @__PURE__ */ jsx("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", children: /* @__PURE__ */ jsx("path", { d: "M5 12h14M13 6l6 6-6 6" }) })
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "apply-done", children: [
      /* @__PURE__ */ jsx("div", { className: "apply-done-svg", children: /* @__PURE__ */ jsxs("svg", { width: "80", height: "80", viewBox: "0 0 100 100", children: [
        /* @__PURE__ */ jsx("circle", { cx: "50", cy: "52", r: "46", fill: "#d8ead9" }),
        /* @__PURE__ */ jsx("path", { d: "M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z", fill: "#fdfaf2" }),
        /* @__PURE__ */ jsxs("g", { children: [
          /* @__PURE__ */ jsx("path", { d: "M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z", fill: "#1a1612" }),
          /* @__PURE__ */ jsx("path", { d: "M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z", fill: "#1a1612" })
        ] }),
        /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "4", fill: "#fff" }),
        /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "2.8", fill: "#0e0a05" }),
        /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "4", fill: "#fff" }),
        /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "2.8", fill: "#0e0a05" }),
        /* @__PURE__ */ jsx("ellipse", { cx: "50", cy: "62", rx: "3.4", ry: "2.5", fill: "#1a1612" }),
        /* @__PURE__ */ jsx("path", { d: "M 40 67 Q 50 82 60 67 Q 50 70 40 67 Z", fill: "#1a1612" })
      ] }) }),
      /* @__PURE__ */ jsx("h3", { children: "応募ありがとう！🎋" }),
      /* @__PURE__ */ jsxs("p", { children: [
        /* @__PURE__ */ jsx("b", { children: c.title }),
        " への応募を受け付けました。",
        /* @__PURE__ */ jsx("br", {}),
        "担当から",
        /* @__PURE__ */ jsx("b", { children: "1営業日以内" }),
        "にご連絡します。"
      ] }),
      /* @__PURE__ */ jsx("button", { className: "btn primary", type: "button", onClick: onClose, children: "案件一覧に戻る" })
    ] })
  ] }) });
}
const RATE_RANGES = [
  { value: "〜60", label: "60万未満", min: 0, max: 59 },
  { value: "60-80", label: "60〜80万", min: 60, max: 80 },
  { value: "80-100", label: "80〜100万", min: 81, max: 100 },
  { value: "100〜", label: "100万以上", min: 100, max: 999 }
];
function normalizeLocation(loc) {
  const l = loc.trim();
  if (l.includes("東京") || l === "Tokyo") return "東京";
  if (l.includes("大阪")) return "大阪";
  if (l.includes("名古屋")) return "名古屋";
  if (l.includes("福岡")) return "福岡";
  if (l.includes("横浜")) return "横浜";
  return l;
}
function parseExperienceNum(exp) {
  const m = exp.match(/(\d+)/);
  return m ? parseInt(m[1]) : 0;
}
function matchPeriod(period, filter) {
  if (!period) return false;
  const p2 = period.trim();
  if (filter === "〜3ヶ月") return p2.includes("3ヶ月") && (p2.includes("未満") || p2.includes("以内"));
  if (filter === "3-6ヶ月") return (p2.includes("3ヶ月") || p2.includes("半年")) && !p2.includes("未満") && !p2.includes("1年");
  if (filter === "6-12ヶ月") return (p2.includes("6ヶ月") || p2.includes("半年") || p2.includes("1年")) && !p2.includes("未満") || p2.includes("1年") && p2.includes("未満");
  if (filter === "1年〜") return p2.includes("1年〜") || p2.includes("1年以上");
  if (filter === "長期") return p2 === "長期" || p2.includes("長期");
  return false;
}
function CasesSection({ allCases: externalCases, loading: externalLoading, onOpen: externalOnOpen }) {
  const [internalCases, setInternalCases] = useState([]);
  const [internalLoading, setInternalLoading] = useState(true);
  const [picked, setPicked] = useState([]);
  const [filters, setFilters] = useState({ location: "", rate: "", period: "", exp: "" });
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const [applyFor, setApplyFor] = useState(null);
  const perPage = 20;
  const usesExternal = !!externalCases;
  const allCases = usesExternal ? externalCases : internalCases;
  const loading = usesExternal ? externalLoading ?? false : internalLoading;
  useEffect(() => {
    if (usesExternal) return;
    api.getCases({ per_page: 200 }).then((res) => {
      if (res.success) setInternalCases(res.data);
    }).finally(() => setInternalLoading(false));
  }, []);
  useEffect(() => {
    document.body.style.overflow = detail || applyFor ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [detail, applyFor]);
  const locationOptions = useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    allCases.forEach((c) => {
      if (c.location) set.add(normalizeLocation(c.location));
    });
    return Array.from(set).sort();
  }, [allCases]);
  const isMatched = (c) => picked.length > 0 && c.mods.some((m) => picked.map((p2) => p2.toLowerCase()).includes(m.toLowerCase()));
  const setFilter = useCallback((cat, val) => {
    setFilters((prev) => ({ ...prev, [cat]: val }));
    setPage(1);
  }, []);
  const clearFilters = useCallback(() => {
    setFilters({ location: "", rate: "", period: "", exp: "" });
    setPicked([]);
    setPage(1);
  }, []);
  const hasActiveFilters = !!filters.location || !!filters.rate || !!filters.period || !!filters.exp || picked.length > 0;
  const filtered = useMemo(() => {
    let result = allCases;
    if (filters.location) {
      result = result.filter((c) => normalizeLocation(c.location) === filters.location);
    }
    if (filters.rate) {
      const range = RATE_RANGES.find((r) => r.value === filters.rate);
      if (range) result = result.filter((c) => c.rate_max >= range.min && c.rate_min <= range.max);
    }
    if (filters.period) {
      result = result.filter((c) => matchPeriod(c.period, filters.period));
    }
    if (filters.exp) {
      result = result.filter((c) => {
        const years = parseExperienceNum(c.experience);
        if (filters.exp === "〜3年") return years <= 3;
        if (filters.exp === "3〜5年") return years >= 3 && years <= 5;
        if (filters.exp === "5〜7年") return years >= 5 && years <= 7;
        if (filters.exp === "7年以上") return years >= 7;
        return false;
      });
    }
    return [...result].sort((a, b) => (isMatched(b) ? 1 : 0) - (isMatched(a) ? 1 : 0));
  }, [allCases, filters, picked]);
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const matchCount = picked.length === 0 ? filtered.length : filtered.filter(isMatched).length;
  const handleOpen = (c) => {
    if (externalOnOpen) {
      externalOnOpen(c);
      return;
    }
    setDetail(c);
  };
  if (loading) {
    return /* @__PURE__ */ jsx("section", { className: "section", id: "cases", style: { textAlign: "center", color: "var(--ink-3)" }, children: "読み込み中..." });
  }
  const selectStyle = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "var(--r-md)",
    border: "1.5px solid var(--line-2)",
    background: "var(--bg-card)",
    fontFamily: "inherit",
    fontSize: 13,
    color: "var(--ink-1)",
    outline: "none",
    cursor: "pointer"
  };
  return /* @__PURE__ */ jsxs("section", { className: "section", id: "cases", children: [
    /* @__PURE__ */ jsxs("div", { className: "section-head", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "label", children: "SAP Freelance · 案件情報" }),
        /* @__PURE__ */ jsxs("h2", { children: [
          "学んだら、稼ごう",
          /* @__PURE__ */ jsx("span", { className: "accent-mark", children: "。" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "desc", children: [
        "パンダ先生で学んだ知識を、そのまま収入に。",
        /* @__PURE__ */ jsx("br", {}),
        "元請直請・中間マージン最小の SAP 常駐／フリーランス案件を厳選掲載。"
      ] })
    ] }),
    /* @__PURE__ */ jsx(SkillMatchBar, { picked, onToggle: (m) => {
      setPicked((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]);
      setPage(1);
    }, matchCount }),
    /* @__PURE__ */ jsxs("div", { style: {
      marginTop: 16,
      padding: "16px 18px",
      background: "var(--bg-card)",
      borderRadius: "var(--r-lg)",
      border: "1px solid var(--line-1)"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }, children: [
        /* @__PURE__ */ jsx("span", { style: { fontSize: 12, fontWeight: 700, color: "var(--ink-2)", letterSpacing: "0.06em", textTransform: "uppercase" }, children: "🔍 絞り込み検索" }),
        hasActiveFilters && /* @__PURE__ */ jsx("button", { onClick: clearFilters, style: { background: "none", border: "none", color: "var(--accent-deep)", cursor: "pointer", fontFamily: "inherit", fontSize: 12, textDecoration: "underline", padding: 0 }, children: "クリア" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10 }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: 11, fontWeight: 700, color: "var(--ink-3)", marginBottom: 4 }, children: "勤務地" }),
          /* @__PURE__ */ jsxs("select", { style: selectStyle, value: filters.location, onChange: (e) => setFilter("location", e.target.value), children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "すべて" }),
            locationOptions.map((o) => /* @__PURE__ */ jsx("option", { value: o, children: o }, o))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: 11, fontWeight: 700, color: "var(--ink-3)", marginBottom: 4 }, children: "月給" }),
          /* @__PURE__ */ jsxs("select", { style: selectStyle, value: filters.rate, onChange: (e) => setFilter("rate", e.target.value), children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "すべて" }),
            RATE_RANGES.map((r) => /* @__PURE__ */ jsx("option", { value: r.value, children: r.label }, r.value))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: 11, fontWeight: 700, color: "var(--ink-3)", marginBottom: 4 }, children: "期間" }),
          /* @__PURE__ */ jsxs("select", { style: selectStyle, value: filters.period, onChange: (e) => setFilter("period", e.target.value), children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "すべて" }),
            /* @__PURE__ */ jsx("option", { value: "〜3ヶ月", children: "〜3ヶ月" }),
            /* @__PURE__ */ jsx("option", { value: "3-6ヶ月", children: "3ヶ月〜6ヶ月" }),
            /* @__PURE__ */ jsx("option", { value: "6-12ヶ月", children: "6ヶ月〜1年" }),
            /* @__PURE__ */ jsx("option", { value: "1年〜", children: "1年〜" }),
            /* @__PURE__ */ jsx("option", { value: "長期", children: "長期" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: 11, fontWeight: 700, color: "var(--ink-3)", marginBottom: 4 }, children: "経験年数" }),
          /* @__PURE__ */ jsxs("select", { style: selectStyle, value: filters.exp, onChange: (e) => setFilter("exp", e.target.value), children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "すべて" }),
            /* @__PURE__ */ jsx("option", { value: "〜3年", children: "〜3年" }),
            /* @__PURE__ */ jsx("option", { value: "3〜5年", children: "3〜5年" }),
            /* @__PURE__ */ jsx("option", { value: "5〜7年", children: "5〜7年" }),
            /* @__PURE__ */ jsx("option", { value: "7年以上", children: "7年以上" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { fontSize: 12.5, color: "var(--ink-3)", marginTop: 16, marginBottom: 8 }, children: [
      /* @__PURE__ */ jsx("strong", { style: { color: "var(--ink-0)" }, children: filtered.length }),
      " 件の案件",
      hasActiveFilters && /* @__PURE__ */ jsxs("span", { children: [
        " （",
        /* @__PURE__ */ jsx("button", { onClick: clearFilters, style: { background: "none", border: "none", color: "var(--accent-deep)", cursor: "pointer", fontFamily: "inherit", fontSize: 12, textDecoration: "underline", padding: 0 }, children: "条件を解除" }),
        "）"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "case-grid", children: paginated.length === 0 ? /* @__PURE__ */ jsxs("div", { style: { gridColumn: "1/-1", textAlign: "center", padding: 60, color: "var(--ink-3)" }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontSize: 48, marginBottom: 12 }, children: "🔍" }),
      /* @__PURE__ */ jsx("p", { children: "検索条件に一致する案件がありません" })
    ] }) : paginated.map((c) => /* @__PURE__ */ jsx(CaseCard, { c, matched: isMatched(c), onOpen: handleOpen }, c.id)) }),
    totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "admin-pagination", style: { marginTop: 24 }, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "btn sm",
          disabled: page <= 1,
          onClick: () => setPage((p2) => p2 - 1),
          style: { opacity: page <= 1 ? 0.4 : 1, cursor: page <= 1 ? "not-allowed" : "pointer" },
          children: "← 前へ"
        }
      ),
      Array.from({ length: totalPages }, (_, i) => i + 1).map((p2) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setPage(p2),
          className: "btn sm",
          style: {
            minWidth: 36,
            justifyContent: "center",
            background: p2 === page ? "var(--accent)" : "var(--bg-card)",
            color: p2 === page ? "white" : "var(--ink-1)",
            borderColor: p2 === page ? "var(--accent)" : "var(--line-2)"
          },
          children: p2
        },
        p2
      )),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "btn sm",
          disabled: page >= totalPages,
          onClick: () => setPage((p2) => p2 + 1),
          style: { opacity: page >= totalPages ? 0.4 : 1, cursor: page >= totalPages ? "not-allowed" : "pointer" },
          children: "次へ →"
        }
      ),
      /* @__PURE__ */ jsxs("span", { style: { fontSize: 12, color: "var(--ink-3)", marginLeft: 8 }, children: [
        page,
        " / ",
        totalPages,
        " ページ"
      ] })
    ] }),
    !externalOnOpen && detail && /* @__PURE__ */ jsx(
      CaseDetailModal,
      {
        c: detail,
        onClose: () => setDetail(null),
        onApply: (c) => {
          setDetail(null);
          setApplyFor(c);
        }
      }
    ),
    !externalOnOpen && applyFor && /* @__PURE__ */ jsx(ApplyForm, { c: applyFor, onClose: () => setApplyFor(null) })
  ] });
}
const MOD_COLOR = {
  fi: "#2f6d44",
  co: "#2641a1",
  mm: "#a25411",
  sd: "#b62a4a",
  pp: "#4828a8",
  hr: "#8a6212",
  abap: "#1f6f6f",
  basis: "#4a432d",
  s4: "#1864a3"
};
const SKILL_OPTIONS = ["FI", "CO", "MM", "SD", "PP", "HR", "ABAP", "Basis", "S/4"];
const WORRIES = [
  { q: "案件探しが、とにかく大変…", a: "希望条件を一度登録すれば、合う案件だけスカウトでお届け。探す時間をゼロに。", tag: "探す手間" },
  { q: "単価交渉、正直ニガテ。", a: "相場と実績をもとに、担当が代わりに交渉。「言い出せず安く受ける」をなくします。", tag: "単価" },
  { q: "ブランク・年齢が不安。", a: "40代・復帰組の決定実績多数。経験の棚卸しから一緒に。學び直しはパンダ先生で。", tag: "キャリア" },
  { q: "自分の市場価値がわからない。", a: "登録すると無料で「単価診断」。今のスキルがいくらになるか、客観的に把握できます。", tag: "価値" }
];
function FreelanceWorries() {
  const { user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pendingRegister, setPendingRegister] = useState(false);
  const prevUser = useRef(user);
  useEffect(() => {
    if (pendingRegister && user && !prevUser.current) {
      setShowRegister(true);
      setPendingRegister(false);
    }
    prevUser.current = user;
  }, [user, pendingRegister]);
  const handleRegisterClick = () => {
    if (!user) {
      setShowLogin(true);
      setPendingRegister(true);
      return;
    }
    setShowRegister(true);
  };
  return /* @__PURE__ */ jsxs("section", { className: "section", id: "worries", children: [
    /* @__PURE__ */ jsxs("div", { className: "section-head", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "label", children: "Freelancer's Real Talk" }),
        /* @__PURE__ */ jsxs("h2", { children: [
          "フリーランスSAPerの、ほんとの悩み",
          /* @__PURE__ */ jsx("span", { className: "accent-mark", children: "。" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "desc", children: [
        "一人で抱えがちな不安、ぜんぶ言葉にしてみました。",
        /* @__PURE__ */ jsx("br", {}),
        "パンダ先生のチームが、ひとつずつ解きほぐします。"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "worries-grid", children: WORRIES.map((w, i) => /* @__PURE__ */ jsxs("div", { className: "worry-card", children: [
      /* @__PURE__ */ jsx("span", { className: "worry-tag", children: w.tag }),
      /* @__PURE__ */ jsxs("div", { className: "worry-q", children: [
        "「",
        w.q,
        "」"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "worry-a", children: [
        /* @__PURE__ */ jsx("span", { style: { fontWeight: 600, color: "var(--accent-deep)", display: "block", marginBottom: 4 }, children: "パンダ先生の答え" }),
        w.a
      ] })
    ] }, i)) }),
    /* @__PURE__ */ jsxs("div", { className: "worries-cta", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("svg", { width: "80", height: "80", viewBox: "0 0 100 100", children: [
        /* @__PURE__ */ jsx("circle", { cx: "50", cy: "52", r: "46", fill: "#d8ead9" }),
        /* @__PURE__ */ jsxs("g", { transform: "translate(25,20)", children: [
          /* @__PURE__ */ jsx("path", { d: "M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z", fill: "#fdfaf2" }),
          /* @__PURE__ */ jsxs("g", { children: [
            /* @__PURE__ */ jsx("path", { d: "M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z", fill: "#1a1612" }),
            /* @__PURE__ */ jsx("path", { d: "M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z", fill: "#1a1612" })
          ] }),
          /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "4", fill: "#fff" }),
          /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "2.8", fill: "#0e0a05" }),
          /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "4", fill: "#fff" }),
          /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "2.8", fill: "#0e0a05" }),
          /* @__PURE__ */ jsx("ellipse", { cx: "50", cy: "62", rx: "3.4", ry: "2.5", fill: "#1a1612" }),
          /* @__PURE__ */ jsx("path", { d: "M 42 68 Q 50 78 58 68", fill: "#1a1612" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { style: { flex: 1 }, children: [
        /* @__PURE__ */ jsx("div", { className: "wc-eyebrow", style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-deep)" }, children: "まずは登録だけでもOK 🎋" }),
        /* @__PURE__ */ jsx("h3", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--ink-0)", margin: "8px 0" }, children: "「いつか」を、今日の一歩に。" }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7 }, children: "登録は無料・3分。合わなければ断ってOK。あなたの SAP スキルは、ちゃんとお金になります。" }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12, marginTop: 16 }, children: [
          /* @__PURE__ */ jsx("button", { className: "btn accent", type: "button", onClick: handleRegisterClick, children: "案件を見て登録する →" }),
          /* @__PURE__ */ jsx(Link, { to: "/paths", className: "btn ghost", style: { textDecoration: "none" }, children: "まず学習パスでスキルを固める" })
        ] })
      ] })
    ] }),
    showLogin && /* @__PURE__ */ jsx(LoginModal, { onClose: () => setShowLogin(false) }),
    showRegister && /* @__PURE__ */ jsx(RegisterModal, { onClose: () => setShowRegister(false) })
  ] });
}
function RegisterModal({ onClose }) {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: (user == null ? void 0 : user.displayName) || "",
    email: (user == null ? void 0 : user.email) || "",
    phone: "",
    expected_rate: "",
    experience_years: "",
    self_pr: ""
  });
  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const toggleSkill = (m) => setSkills((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]);
  const handleSubmit = async (e) => {
    var _a;
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError("名前とメールアドレスは必須です。");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("expected_rate", form.expected_rate);
      formData.append("experience_years", form.experience_years);
      formData.append("skill_modules", JSON.stringify(skills));
      formData.append("self_pr", form.self_pr);
      const files = document.getElementById("register-resume");
      if ((_a = files == null ? void 0 : files.files) == null ? void 0 : _a[0]) formData.append("resume", files.files[0]);
      const res = await api.client.post("/cases/0/apply", formData, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.data.success) setDone(true);
      else setError(res.data.message || "送信に失敗しました。");
    } catch {
      setError("サーバーエラーが発生しました。");
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "case-modal-overlay", onClick: onClose, children: /* @__PURE__ */ jsxs("div", { className: "case-modal", onClick: (e) => e.stopPropagation(), style: { maxWidth: 560 }, children: [
    /* @__PURE__ */ jsx("button", { className: "case-modal-x", onClick: onClose, "aria-label": "閉じる", children: "×" }),
    done ? /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", padding: "40px 20px" }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontSize: 64, marginBottom: 12 }, children: "🎋" }),
      /* @__PURE__ */ jsx("h2", { style: { fontFamily: "var(--font-display)", fontSize: 22, color: "var(--ink-0)", margin: "0 0 8px" }, children: "登録ありがとうございます！" }),
      /* @__PURE__ */ jsxs("p", { style: { fontSize: 14, color: "var(--ink-2)", lineHeight: 1.8 }, children: [
        "担当から1営業日以内にご連絡します。",
        /* @__PURE__ */ jsx("br", {}),
        "まずは気軽に話を聞いてみてくださいね。"
      ] }),
      /* @__PURE__ */ jsx("button", { className: "btn primary", onClick: onClose, style: { marginTop: 20 }, children: "閉じる" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("h3", { style: { fontFamily: "var(--font-display)", fontSize: 20, color: "var(--ink-0)", margin: "0 0 4px" }, children: "フリーランス登録" }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: 12.5, color: "var(--ink-2)", margin: "0 0 16px" }, children: "3分で完了。合わなければ断ってOKです。" }),
      error && /* @__PURE__ */ jsx("div", { style: { background: "#fbe3e6", border: "1px solid rgba(217,101,112,0.3)", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#d96570", marginBottom: 14 }, children: error }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: 12 }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: 11.5, fontWeight: 600, color: "var(--ink-2)", display: "block", marginBottom: 3 }, children: "お名前 *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: form.name,
                  onChange: (e) => handleChange("name", e.target.value),
                  required: true,
                  placeholder: "山田 太郎",
                  style: { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid var(--line-2)", fontFamily: "inherit", fontSize: 13 }
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: 11.5, fontWeight: 600, color: "var(--ink-2)", display: "block", marginBottom: 3 }, children: "メールアドレス *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  value: form.email,
                  onChange: (e) => handleChange("email", e.target.value),
                  required: true,
                  placeholder: "your@email.com",
                  style: { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid var(--line-2)", fontFamily: "inherit", fontSize: 13 }
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: 11.5, fontWeight: 600, color: "var(--ink-2)", display: "block", marginBottom: 3 }, children: "電話番号" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: form.phone,
                  onChange: (e) => handleChange("phone", e.target.value),
                  placeholder: "080-xxxx-xxxx",
                  style: { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid var(--line-2)", fontFamily: "inherit", fontSize: 13 }
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: 11.5, fontWeight: 600, color: "var(--ink-2)", display: "block", marginBottom: 3 }, children: "希望単価 (月/万)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: form.expected_rate,
                  onChange: (e) => handleChange("expected_rate", e.target.value),
                  placeholder: "80",
                  style: { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid var(--line-2)", fontFamily: "inherit", fontSize: 13 }
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: 11.5, fontWeight: 600, color: "var(--ink-2)", display: "block", marginBottom: 3 }, children: "経験年数" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: form.experience_years,
                  onChange: (e) => handleChange("experience_years", e.target.value),
                  placeholder: "5年",
                  style: { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid var(--line-2)", fontFamily: "inherit", fontSize: 13 }
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: 11.5, fontWeight: 600, color: "var(--ink-2)", display: "block", marginBottom: 3 }, children: "得意モジュール（複数選択可）" }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" }, children: SKILL_OPTIONS.map((m) => /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => toggleSkill(m),
                style: {
                  padding: "4px 10px",
                  borderRadius: 999,
                  border: "1.5px solid",
                  fontSize: 11.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  background: skills.includes(m) ? MOD_COLOR[m.toLowerCase()] || "#5a9d6e" : "var(--bg-card)",
                  color: skills.includes(m) ? "#fff" : "var(--ink-1)",
                  borderColor: skills.includes(m) ? "transparent" : "var(--line-2)"
                },
                children: m
              },
              m
            )) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: 11.5, fontWeight: 600, color: "var(--ink-2)", display: "block", marginBottom: 3 }, children: "自己PR" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: form.self_pr,
                onChange: (e) => handleChange("self_pr", e.target.value),
                rows: 3,
                placeholder: "経歴や強みを簡単に",
                style: { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid var(--line-2)", fontFamily: "inherit", fontSize: 13, resize: "vertical" }
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: 11.5, fontWeight: 600, color: "var(--ink-2)", display: "block", marginBottom: 3 }, children: "履歴書・職務経歴書（任意）" }),
            /* @__PURE__ */ jsx("input", { type: "file", id: "register-resume", accept: ".pdf,.doc,.docx", style: { fontSize: 12 } })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 18 }, children: [
          /* @__PURE__ */ jsx("button", { type: "button", className: "btn", onClick: onClose, children: "キャンセル" }),
          /* @__PURE__ */ jsx("button", { type: "submit", className: "btn accent", disabled: submitting, children: submitting ? "送信中..." : "登録する" })
        ] })
      ] })
    ] })
  ] }) });
}
function PandaHeadV2({ mood = "smile", wiggleEars = true, lookDir = "fwd", noCap = false, size = 100 }) {
  const offsets = { fwd: [0, 0], up: [0, -1], down: [0, 1.4], left: [-1.5, 0], right: [1.5, 0] };
  const [dx, dy] = offsets[lookDir] || [0, 0];
  const s = size / 100;
  return /* @__PURE__ */ jsxs("g", { transform: `scale(${s})`, children: [
    /* @__PURE__ */ jsxs("g", { className: wiggleEars ? "ear-wiggle" : "", style: { transformOrigin: "24px 22px" }, children: [
      /* @__PURE__ */ jsx("ellipse", { cx: "22", cy: "18", rx: "13", ry: "12", fill: "#1a1612" }),
      /* @__PURE__ */ jsx("ellipse", { cx: "22", cy: "20", rx: "6", ry: "5", fill: "#3a2e22" })
    ] }),
    /* @__PURE__ */ jsxs("g", { className: wiggleEars ? "ear-wiggle" : "", style: { transformOrigin: "76px 22px", animationDelay: "0.3s" }, children: [
      /* @__PURE__ */ jsx("ellipse", { cx: "78", cy: "18", rx: "13", ry: "12", fill: "#1a1612" }),
      /* @__PURE__ */ jsx("ellipse", { cx: "78", cy: "20", rx: "6", ry: "5", fill: "#3a2e22" })
    ] }),
    /* @__PURE__ */ jsx("path", { d: "M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z", fill: "#fdfaf2" }),
    /* @__PURE__ */ jsxs("g", { children: [
      /* @__PURE__ */ jsx("path", { d: "M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z", fill: "#1a1612" }),
      /* @__PURE__ */ jsx("path", { d: "M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z", fill: "#1a1612" })
    ] }),
    /* @__PURE__ */ jsxs("g", { children: [
      /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "11.5", fill: "rgba(255,255,255,0.06)", stroke: "#0e0a05", strokeWidth: "2" }),
      /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "11.5", fill: "rgba(255,255,255,0.06)", stroke: "#0e0a05", strokeWidth: "2" }),
      /* @__PURE__ */ jsx("path", { d: "M 41 44 L 59 44", stroke: "#0e0a05", strokeWidth: "2" }),
      /* @__PURE__ */ jsx("path", { d: "M 22 38 Q 27 35 33 38", fill: "none", stroke: "#fff", strokeOpacity: "0.8", strokeWidth: "2", strokeLinecap: "round" }),
      /* @__PURE__ */ jsx("path", { d: "M 62 38 Q 67 35 73 38", fill: "none", stroke: "#fff", strokeOpacity: "0.8", strokeWidth: "2", strokeLinecap: "round" })
    ] }),
    /* @__PURE__ */ jsxs("g", { className: "eye-blink", style: { transformOrigin: "30px 44px" }, children: [
      /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "3.4", fill: "#fff" }),
      /* @__PURE__ */ jsx("circle", { cx: 30 + dx, cy: 44 + dy, r: "2.4", fill: "#0e0a05" }),
      /* @__PURE__ */ jsx("circle", { cx: 30 + dx - 0.6, cy: 44 + dy - 0.8, r: "0.9", fill: "#fff" })
    ] }),
    /* @__PURE__ */ jsxs("g", { className: "eye-blink", style: { transformOrigin: "70px 44px", animationDelay: "0.1s" }, children: [
      /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "3.4", fill: "#fff" }),
      /* @__PURE__ */ jsx("circle", { cx: 70 + dx, cy: 44 + dy, r: "2.4", fill: "#0e0a05" }),
      /* @__PURE__ */ jsx("circle", { cx: 70 + dx - 0.6, cy: 44 + dy - 0.8, r: "0.9", fill: "#fff" })
    ] }),
    /* @__PURE__ */ jsx("ellipse", { cx: "18", cy: "64", rx: "5.5", ry: "3", fill: "#f4b8c4", opacity: "0.7" }),
    /* @__PURE__ */ jsx("ellipse", { cx: "82", cy: "64", rx: "5.5", ry: "3", fill: "#f4b8c4", opacity: "0.7" }),
    /* @__PURE__ */ jsx("ellipse", { cx: "50", cy: "62", rx: "3.4", ry: "2.5", fill: "#1a1612" }),
    /* @__PURE__ */ jsx("path", { d: "M 50 64 L 50 67", stroke: "#1a1612", strokeWidth: "1.4", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M 42 68 Q 50 78 58 68", fill: "#1a1612" }),
    /* @__PURE__ */ jsx("path", { d: "M 44 70 Q 50 73 56 70", fill: "#ff9eb5" }),
    !noCap && /* @__PURE__ */ jsxs("g", { children: [
      /* @__PURE__ */ jsx("ellipse", { cx: "50", cy: "14", rx: "32", ry: "6", fill: "#163a78" }),
      /* @__PURE__ */ jsx("path", { d: "M 14 10 L 50 -4 L 86 10 L 50 24 Z", fill: "#1f4ea3", stroke: "#163a78", strokeWidth: "1.2" }),
      /* @__PURE__ */ jsx("circle", { cx: "50", cy: "10", r: "2.5", fill: "#e8c244" }),
      /* @__PURE__ */ jsx("path", { d: "M 50 10 Q 70 14 76 24 L 76 32", fill: "none", stroke: "#e8c244", strokeWidth: "2" }),
      /* @__PURE__ */ jsxs("g", { transform: "translate(76 32)", children: [
        /* @__PURE__ */ jsx("ellipse", { cx: "0", cy: "0", rx: "3.5", ry: "2.5", fill: "#e8c244" }),
        /* @__PURE__ */ jsx("line", { x1: "-2", y1: "2", x2: "-2", y2: "10", stroke: "#e8c244", strokeWidth: "1" }),
        /* @__PURE__ */ jsx("line", { x1: "0", y1: "2", x2: "0", y2: "11", stroke: "#e8c244", strokeWidth: "1" }),
        /* @__PURE__ */ jsx("line", { x1: "2", y1: "2", x2: "2", y2: "10", stroke: "#e8c244", strokeWidth: "1" })
      ] })
    ] })
  ] });
}
function PandaSensei() {
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 360 460", "aria-label": "SAPパンダ先生", children: [
    /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("radialGradient", { id: "shadow", cx: "0.5", cy: "0.5", r: "0.5", children: [
      /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "rgba(0,0,0,0.22)" }),
      /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "rgba(0,0,0,0)" })
    ] }) }),
    /* @__PURE__ */ jsx("ellipse", { cx: "180", cy: "438", rx: "110", ry: "10", fill: "url(#shadow)" }),
    /* @__PURE__ */ jsxs("g", { children: [
      /* @__PURE__ */ jsx("path", { d: "M 78 252 Q 50 280 46 340 L 80 348 Q 90 296 110 268 Z", fill: "#2e63bd", stroke: "#163a78", strokeWidth: "2" }),
      /* @__PURE__ */ jsx("ellipse", { cx: "60", cy: "346", rx: "16", ry: "14", fill: "#1a1612" }),
      /* @__PURE__ */ jsxs("g", { transform: "translate(20 322) rotate(-10)", children: [
        /* @__PURE__ */ jsx("rect", { width: "58", height: "42", rx: "3", fill: "#fff", stroke: "#9a8252", strokeWidth: "1.8" }),
        /* @__PURE__ */ jsx("rect", { width: "58", height: "9", fill: "#1f4ea3" }),
        /* @__PURE__ */ jsx("text", { x: "29", y: "7", fontSize: "6", fontWeight: "800", fill: "#fff", textAnchor: "middle", fontFamily: "Inter", children: "SAP BOOK" }),
        /* @__PURE__ */ jsx("rect", { x: "5", y: "16", width: "48", height: "2.5", fill: "#cbb98a" }),
        /* @__PURE__ */ jsx("rect", { x: "5", y: "22", width: "38", height: "2", fill: "#dac9a0" }),
        /* @__PURE__ */ jsx("rect", { x: "5", y: "28", width: "44", height: "2", fill: "#dac9a0" }),
        /* @__PURE__ */ jsx("rect", { x: "5", y: "34", width: "32", height: "2", fill: "#dac9a0" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("g", { children: [
      /* @__PURE__ */ jsx("path", { d: "M 242 252 Q 274 240 286 200 L 264 184 Q 246 220 230 244 Z", fill: "#2e63bd", stroke: "#163a78", strokeWidth: "2" }),
      /* @__PURE__ */ jsx("ellipse", { cx: "282", cy: "196", rx: "14", ry: "13", fill: "#1a1612" }),
      /* @__PURE__ */ jsxs("g", { transform: "translate(286 192) rotate(-32)", className: "hand-wave", style: { transformOrigin: "0px 0px" }, children: [
        /* @__PURE__ */ jsx("rect", { x: "0", y: "-3", width: "100", height: "6", rx: "2.5", fill: "#a8763e" }),
        /* @__PURE__ */ jsx("rect", { x: "0", y: "-3", width: "100", height: "2.5", fill: "#c69258" }),
        /* @__PURE__ */ jsx("circle", { cx: "98", cy: "0", r: "6", fill: "#d97548" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("path", { d: "M 100 240 Q 80 240 70 260 L 60 360 Q 60 400 90 408 L 230 408 Q 260 400 260 360 L 250 260 Q 240 240 220 240 Z", fill: "#1f4ea3", stroke: "#163a78", strokeWidth: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M 160 240 L 160 408", stroke: "#163a78", strokeOpacity: "0.3", strokeWidth: "0.8" }),
    /* @__PURE__ */ jsx("path", { d: "M 110 330 L 210 330 L 220 380 L 100 380 Z", fill: "#163a78", opacity: "0.35" }),
    /* @__PURE__ */ jsx("text", { x: "160", y: "320", textAnchor: "middle", fontFamily: "Inter, sans-serif", fontWeight: "900", fontSize: "44", fill: "#fff", letterSpacing: "2", children: "SAP" }),
    /* @__PURE__ */ jsx("path", { d: "M 90 250 Q 100 232 130 232 L 190 232 Q 220 232 230 250 L 220 264 Q 160 256 100 264 Z", fill: "#163a78" }),
    /* @__PURE__ */ jsx("path", { d: "M 140 250 L 138 274", stroke: "#fff", strokeWidth: "2", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M 180 250 L 182 274", stroke: "#fff", strokeWidth: "2", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("circle", { cx: "138", cy: "276", r: "2.6", fill: "#fff" }),
    /* @__PURE__ */ jsx("circle", { cx: "182", cy: "276", r: "2.6", fill: "#fff" }),
    /* @__PURE__ */ jsx("g", { transform: "translate(90 128)", children: /* @__PURE__ */ jsx(PandaHeadV2, { mood: "happy", wiggleEars: true, size: 140 }) })
  ] });
}
function StudentHead({ mood = "smile", lookDir = "fwd" }) {
  const offsets = { fwd: [0, 0], up: [0, -1], down: [0, 1.4], left: [-1.5, 0], right: [1.5, 0] };
  const [dx, dy] = offsets[lookDir] || [0, 0];
  return /* @__PURE__ */ jsxs("g", { children: [
    /* @__PURE__ */ jsx("ellipse", { cx: "86", cy: "54", rx: "4", ry: "6", fill: "#f4d8c0", stroke: "#c89884", strokeWidth: "0.8" }),
    /* @__PURE__ */ jsx("path", { d: "M 50 22 C 28 22 20 38 20 56 C 20 76 32 88 50 88 C 68 88 80 76 80 56 C 80 38 72 22 50 22 Z", fill: "#f4d8c0" }),
    /* @__PURE__ */ jsx("path", { d: "M 64 36 Q 78 50 74 70 Q 70 84 56 87", fill: "none", stroke: "#e8b89c", strokeWidth: "0.8", opacity: "0.5" }),
    /* @__PURE__ */ jsx("path", { d: "M 18 50 Q 18 16 50 14 Q 84 16 84 52 Q 80 38 70 32 Q 64 42 56 36 Q 52 44 44 36 Q 38 44 30 36 Q 24 44 18 50 Z", fill: "#1e1610" }),
    /* @__PURE__ */ jsx("path", { d: "M 30 30 Q 36 22 42 32 Q 48 24 54 32 Q 60 22 66 32", fill: "none", stroke: "#1e1610", strokeWidth: "3", strokeLinecap: "round" }),
    /* @__PURE__ */ jsxs("g", { className: "eye-blink", style: { transformOrigin: "38px 56px" }, children: [
      /* @__PURE__ */ jsx("ellipse", { cx: "38", cy: "56", rx: "2.6", ry: "3.6", fill: "#0e0a05" }),
      /* @__PURE__ */ jsx("circle", { cx: 37 + dx * 0.6, cy: 55 + dy * 0.6, r: "0.9", fill: "#fff" })
    ] }),
    /* @__PURE__ */ jsxs("g", { className: "eye-blink", style: { transformOrigin: "62px 56px", animationDelay: "0.1s" }, children: [
      /* @__PURE__ */ jsx("ellipse", { cx: "62", cy: "56", rx: "2.6", ry: "3.6", fill: "#0e0a05" }),
      /* @__PURE__ */ jsx("circle", { cx: 61 + dx * 0.6, cy: 55 + dy * 0.6, r: "0.9", fill: "#fff" })
    ] }),
    /* @__PURE__ */ jsx("path", { d: "M 32 48 Q 38 46 44 48", fill: "none", stroke: "#1e1610", strokeWidth: "2.2", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M 56 48 Q 62 46 68 48", fill: "none", stroke: "#1e1610", strokeWidth: "2.2", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("ellipse", { cx: "28", cy: "68", rx: "4", ry: "2.5", fill: "#f4a8b0", opacity: "0.55" }),
    /* @__PURE__ */ jsx("ellipse", { cx: "72", cy: "68", rx: "4", ry: "2.5", fill: "#f4a8b0", opacity: "0.55" }),
    /* @__PURE__ */ jsx("path", { d: "M 50 60 Q 49 64 50 66", fill: "none", stroke: "#c89884", strokeWidth: "1.4", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M 42 72 Q 50 82 58 72", fill: "#0e0a05" }),
    /* @__PURE__ */ jsx("path", { d: "M 44 74 Q 50 78 56 74", fill: "#ff9eb5" })
  ] });
}
function StudentTaro() {
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 320 460", "aria-label": "たろうくん", children: [
    /* @__PURE__ */ jsx("ellipse", { cx: "160", cy: "438", rx: "90", ry: "8", fill: "#000", opacity: "0.18" }),
    /* @__PURE__ */ jsxs("g", { children: [
      /* @__PURE__ */ jsx("path", { d: "M 232 254 Q 264 220 254 168 L 232 172 Q 224 220 214 244 Z", fill: "#5aa0e6", stroke: "#3a78b8", strokeWidth: "2" }),
      /* @__PURE__ */ jsx("circle", { cx: "244", cy: "170", r: "14", fill: "#f4d8c0", stroke: "#c89884", strokeWidth: "1" }),
      /* @__PURE__ */ jsx("path", { d: "M 238 164 Q 244 160 250 164", fill: "none", stroke: "#c89884", strokeWidth: "1" })
    ] }),
    /* @__PURE__ */ jsxs("g", { children: [
      /* @__PURE__ */ jsx("path", { d: "M 88 254 Q 64 296 78 348 L 110 350 Q 110 304 122 270 Z", fill: "#5aa0e6", stroke: "#3a78b8", strokeWidth: "2" }),
      /* @__PURE__ */ jsx("circle", { cx: "88", cy: "348", r: "13", fill: "#f4d8c0", stroke: "#c89884", strokeWidth: "1" })
    ] }),
    /* @__PURE__ */ jsx("path", { d: "M 100 240 Q 84 244 76 260 L 66 360 Q 66 400 96 408 L 224 408 Q 254 400 254 360 L 244 260 Q 236 244 220 240 Z", fill: "#5aa0e6", stroke: "#3a78b8", strokeWidth: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M 90 252 Q 100 232 130 232 L 190 232 Q 220 232 230 252 L 222 268 Q 160 256 98 268 Z", fill: "#3a78b8" }),
    /* @__PURE__ */ jsx("path", { d: "M 112 332 L 208 332 L 218 380 L 102 380 Z", fill: "#3a78b8", opacity: "0.4" }),
    /* @__PURE__ */ jsx("path", { d: "M 142 252 L 140 276", stroke: "#fff", strokeWidth: "2", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M 178 252 L 180 276", stroke: "#fff", strokeWidth: "2", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("circle", { cx: "140", cy: "278", r: "2.4", fill: "#fff" }),
    /* @__PURE__ */ jsx("circle", { cx: "180", cy: "278", r: "2.4", fill: "#fff" }),
    /* @__PURE__ */ jsx("rect", { x: "142", y: "228", width: "36", height: "20", fill: "#f4d8c0", stroke: "#c89884", strokeWidth: "0.8" }),
    /* @__PURE__ */ jsx("g", { transform: "translate(110 150)", children: /* @__PURE__ */ jsx(StudentHead, { mood: "happy" }) })
  ] });
}
function ChalkBoard() {
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 200 160", preserveAspectRatio: "xMidYMid meet", style: { width: "100%", height: "100%" }, children: [
    /* @__PURE__ */ jsx("text", { x: "20", y: "26", fontSize: "13", fill: "rgba(255,240,200,0.95)", fontFamily: "Caveat, cursive", fontWeight: "700", children: "📐 今日のテーマ" }),
    /* @__PURE__ */ jsx("text", { x: "20", y: "44", fontSize: "11", fill: "rgba(255,240,200,0.85)", fontFamily: "Caveat, cursive", children: "仕訳のしくみ" }),
    /* @__PURE__ */ jsx("line", { x1: "100", y1: "54", x2: "100", y2: "140", stroke: "rgba(255,255,255,0.6)", strokeWidth: "1" }),
    /* @__PURE__ */ jsx("line", { x1: "20", y1: "72", x2: "180", y2: "72", stroke: "rgba(255,255,255,0.6)", strokeWidth: "1" }),
    /* @__PURE__ */ jsx("text", { x: "50", y: "68", fontSize: "10", fill: "rgba(255,224,132,0.95)", fontFamily: "Caveat, cursive", textAnchor: "middle", children: "借方" }),
    /* @__PURE__ */ jsx("text", { x: "150", y: "68", fontSize: "10", fill: "rgba(255,179,196,0.95)", fontFamily: "Caveat, cursive", textAnchor: "middle", children: "貸方" }),
    /* @__PURE__ */ jsx("text", { x: "36", y: "94", fontSize: "9", fill: "rgba(255,255,255,0.85)", fontFamily: "Caveat, cursive", textAnchor: "middle", children: "現金 100" }),
    /* @__PURE__ */ jsx("text", { x: "164", y: "94", fontSize: "9", fill: "rgba(184,232,176,0.95)", fontFamily: "Caveat, cursive", textAnchor: "middle", children: "売上 100" }),
    /* @__PURE__ */ jsx("text", { x: "36", y: "118", fontSize: "9", fill: "rgba(255,255,255,0.75)", fontFamily: "Caveat, cursive", textAnchor: "middle", children: "受取手形 50" }),
    /* @__PURE__ */ jsx("text", { x: "164", y: "118", fontSize: "9", fill: "rgba(184,232,176,0.85)", fontFamily: "Caveat, cursive", textAnchor: "middle", children: "受取利息 50" }),
    /* @__PURE__ */ jsx("path", { d: "M 56 126 Q 86 138 116 126", fill: "none", stroke: "rgba(255,255,255,0.4)", strokeWidth: "0.8", strokeDasharray: "3,3" })
  ] });
}
function FloatingCallouts() {
  return /* @__PURE__ */ jsxs("div", { className: "hero-callouts", children: [
    /* @__PURE__ */ jsxs("div", { className: "callout c1", children: [
      /* @__PURE__ */ jsx("div", { className: "em", style: { background: "#2f6d44" }, children: "FI" }),
      /* @__PURE__ */ jsxs("div", { children: [
        "財務会計",
        /* @__PURE__ */ jsx("small", { children: "新着 3 本" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "callout c2", children: [
      /* @__PURE__ */ jsx("div", { className: "em", style: { background: "#1f6f6f" }, children: "<>" }),
      /* @__PURE__ */ jsxs("div", { children: [
        "ABAP入門",
        /* @__PURE__ */ jsx("small", { children: "初心者向け" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "callout c3", children: [
      /* @__PURE__ */ jsx("div", { className: "em", style: { background: "#b62a4a" }, children: "SD" }),
      /* @__PURE__ */ jsxs("div", { children: [
        "受注プロセス",
        /* @__PURE__ */ jsx("small", { children: "人気 ★" })
      ] })
    ] })
  ] });
}
function HeroScene() {
  return /* @__PURE__ */ jsxs("div", { className: "hero-scene", children: [
    /* @__PURE__ */ jsx("div", { className: "floor" }),
    /* @__PURE__ */ jsx("div", { className: "blackboard", children: /* @__PURE__ */ jsx(ChalkBoard, {}) }),
    /* @__PURE__ */ jsx("div", { className: "hero-panda-wrap", children: /* @__PURE__ */ jsx(PandaSensei, {}) }),
    /* @__PURE__ */ jsx("div", { className: "hero-student-wrap", children: /* @__PURE__ */ jsx(StudentTaro, {}) }),
    /* @__PURE__ */ jsx(FloatingCallouts, {})
  ] });
}
function QuizCard() {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [picked, setPicked] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [animKey, setAnimKey] = useState(0);
  const loadQuiz = async () => {
    setLoading(true);
    setPicked(null);
    setResult(null);
    setError("");
    setAnimKey((k) => k + 1);
    try {
      const res = await api.getTodayQuiz();
      if (res.success) {
        setQuiz(res.data);
      } else {
        setError(res.message || "問題の読み込みに失敗しました。");
      }
    } catch {
      setQuiz({
        id: 0,
        question: "次のうち、SAP FI モジュールの主要な仕訳タイプとして「ない」ものはどれ？",
        options: ["SA：一般仕訳", "KR：仕入先請求書", "DR：得意先請求書", "XX：在庫移動仕訳"],
        explanation: "「XX」というドキュメントタイプは標準にはありません。在庫移動は MM 領域です。"
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadQuiz();
  }, []);
  const pickAnswer = async (i) => {
    if (picked !== null) return;
    setPicked(i);
    if (quiz && quiz.id > 0) {
      try {
        const res = await api.submitQuizAnswer(quiz.id, i);
        if (res.success) {
          setResult(res.data);
          return;
        }
      } catch {
      }
    }
    const correct = i === 3 ? 3 : i === 1 ? 1 : 3;
    setResult({
      correct: i === correct,
      correctAnswer: correct,
      explanation: (quiz == null ? void 0 : quiz.explanation) || "解説は準備中です。"
    });
  };
  const next = loadQuiz;
  if (loading) {
    return /* @__PURE__ */ jsxs("section", { className: "section", id: "quiz", children: [
      /* @__PURE__ */ jsx("div", { className: "section-head", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "label", children: "Daily Quiz" }),
        /* @__PURE__ */ jsxs("h2", { children: [
          "パンダ先生の",
          /* @__PURE__ */ jsx("span", { className: "accent-mark", children: "今日の一問" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { style: { textAlign: "center", padding: 60, color: "var(--ink-3)" }, children: "読み込み中..." })
    ] });
  }
  if (error && !quiz) {
    return /* @__PURE__ */ jsxs("section", { className: "section", id: "quiz", children: [
      /* @__PURE__ */ jsx("div", { className: "section-head", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "label", children: "Daily Quiz" }),
        /* @__PURE__ */ jsxs("h2", { children: [
          "パンダ先生の",
          /* @__PURE__ */ jsx("span", { className: "accent-mark", children: "今日の一問" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { style: { textAlign: "center", padding: 60, color: "var(--ink-3)" }, children: error })
    ] });
  }
  return /* @__PURE__ */ jsxs("section", { className: "section", id: "quiz", children: [
    /* @__PURE__ */ jsxs("div", { className: "section-head", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "label", children: "Daily Quiz" }),
        /* @__PURE__ */ jsxs("h2", { children: [
          "パンダ先生の",
          /* @__PURE__ */ jsx("span", { className: "accent-mark", children: "今日の一問" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "desc", children: [
        "5秒でわかる、SAP のあるあるクイズ。",
        /* @__PURE__ */ jsx("br", {}),
        "連続正解で「パンダバッジ」がもらえるよ。"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "quiz-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "quiz-left", children: [
        /* @__PURE__ */ jsx("div", { className: "quiz-eyebrow", children: "☀ 今日の問題" }),
        /* @__PURE__ */ jsx("h3", { children: (quiz == null ? void 0 : quiz.question) || "" }),
        /* @__PURE__ */ jsx("div", { className: "quiz-options", children: quiz == null ? void 0 : quiz.options.map((opt, i) => {
          const reveal = result !== null;
          const isCorrect = (result == null ? void 0 : result.correctAnswer) === i;
          let cls = "quiz-opt";
          if (reveal) {
            if (i === picked && isCorrect) cls += " selected correct";
            else if (i === picked && !isCorrect) cls += " selected wrong";
            else if (isCorrect) cls += " show-correct";
          }
          return /* @__PURE__ */ jsxs("button", { className: cls, onClick: () => pickAnswer(i), type: "button", children: [
            /* @__PURE__ */ jsx("span", { className: "letter", children: String.fromCharCode(65 + i) }),
            /* @__PURE__ */ jsx("span", { children: opt }),
            reveal && isCorrect && /* @__PURE__ */ jsx("span", { className: "check", children: "✓" }),
            reveal && i === picked && !isCorrect && /* @__PURE__ */ jsx("span", { className: "check", children: "✕" })
          ] }, i);
        }) }),
        result && /* @__PURE__ */ jsxs("div", { className: "quiz-explain", children: [
          /* @__PURE__ */ jsx("div", { style: { width: 32, height: 32, flexShrink: 0 }, children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 100 100", children: [
            /* @__PURE__ */ jsx("circle", { cx: "50", cy: "52", r: "46", fill: "#d8ead9" }),
            /* @__PURE__ */ jsx("circle", { cx: "50", cy: "52", r: "42", fill: "#fff" }),
            /* @__PURE__ */ jsx("path", { d: "M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z", fill: "#fdfaf2" }),
            /* @__PURE__ */ jsxs("g", { children: [
              /* @__PURE__ */ jsx("path", { d: "M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z", fill: "#1a1612" }),
              /* @__PURE__ */ jsx("path", { d: "M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z", fill: "#1a1612" })
            ] }),
            /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "3.4", fill: "#fff" }),
            /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "2.4", fill: "#0e0a05" }),
            /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "3.4", fill: "#fff" }),
            /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "2.4", fill: "#0e0a05" }),
            /* @__PURE__ */ jsx("ellipse", { cx: "50", cy: "62", rx: "3.4", ry: "2.5", fill: "#1a1612" }),
            result.correct ? /* @__PURE__ */ jsx("path", { d: "M 42 68 Q 50 78 58 68", fill: "#1a1612" }) : /* @__PURE__ */ jsx("line", { x1: "44", y1: "71", x2: "56", y2: "71", stroke: "#1a1612", strokeWidth: "2", strokeLinecap: "round" })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("strong", { children: result.correct ? "正解！🎋 " : "おしい！" }),
            result.explanation
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "quiz-bot", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "正解率：",
            /* @__PURE__ */ jsx("strong", { style: { color: "var(--ink-0)" }, children: "62%" })
          ] }),
          /* @__PURE__ */ jsx("span", { children: "·" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "連続正解 ",
            /* @__PURE__ */ jsx("span", { className: "streak", children: "0問" })
          ] }),
          /* @__PURE__ */ jsx("span", { style: { marginLeft: "auto" }, children: result && /* @__PURE__ */ jsx("button", { className: "btn sm primary", onClick: next, type: "button", children: "次の問題 →" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "quiz-right", children: [
        /* @__PURE__ */ jsx("div", { className: "thought", children: "パンダ先生と一緒に考えよう！" }),
        /* @__PURE__ */ jsxs("svg", { viewBox: "-4 -8 108 108", style: { width: 140, height: 140 }, children: [
          /* @__PURE__ */ jsx("circle", { cx: "50", cy: "52", r: "46", fill: "#e8f0fb", opacity: "0.2" }),
          /* @__PURE__ */ jsx("ellipse", { cx: "22", cy: "18", rx: "13", ry: "12", fill: "#1a1612", opacity: "0.7" }),
          /* @__PURE__ */ jsx("ellipse", { cx: "78", cy: "18", rx: "13", ry: "12", fill: "#1a1612", opacity: "0.7" }),
          /* @__PURE__ */ jsx("path", { d: "M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z", fill: "#fdfaf2", opacity: "0.35" }),
          /* @__PURE__ */ jsxs("g", { opacity: "0.5", children: [
            /* @__PURE__ */ jsx("path", { d: "M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z", fill: "#1a1612" }),
            /* @__PURE__ */ jsx("path", { d: "M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z", fill: "#1a1612" })
          ] }),
          /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "3.4", fill: "#fff", opacity: "0.6" }),
          /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "2.4", fill: "#0e0a05", opacity: "0.6" }),
          /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "3.4", fill: "#fff", opacity: "0.6" }),
          /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "2.4", fill: "#0e0a05", opacity: "0.6" }),
          /* @__PURE__ */ jsx("ellipse", { cx: "18", cy: "64", rx: "5.5", ry: "3", fill: "#f4b8c4", opacity: "0.4" }),
          /* @__PURE__ */ jsx("ellipse", { cx: "82", cy: "64", rx: "5.5", ry: "3", fill: "#f4b8c4", opacity: "0.4" }),
          /* @__PURE__ */ jsx("ellipse", { cx: "50", cy: "62", rx: "3.4", ry: "2.5", fill: "#1a1612", opacity: "0.6" }),
          /* @__PURE__ */ jsx("path", { d: "M 50 64 L 50 67", stroke: "#1a1612", strokeWidth: "1.4", strokeLinecap: "round", opacity: "0.6" }),
          /* @__PURE__ */ jsx("path", { d: "M 43 70 Q 50 74 57 70", fill: "none", stroke: "#1a1612", strokeWidth: "1.8", strokeLinecap: "round", opacity: "0.6" })
        ] })
      ] })
    ] }, animKey)
  ] });
}
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!ref.current) {
      setShown(true);
      return;
    }
    const safety = setTimeout(() => setShown(true), 200);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setTimeout(() => setShown(true), delay);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    obs.observe(ref.current);
    return () => {
      clearTimeout(safety);
      obs.disconnect();
    };
  }, [delay]);
  return /* @__PURE__ */ jsx("div", { ref, className: `reveal${shown ? " in" : ""}`, children });
}
function Hero() {
  const [stats, setStats] = useState({ articles: 0, courses: 0, knowledge: 0, modules: 0, readers: "24,800" });
  useEffect(() => {
    Promise.all([
      api.client.get("/articles", { params: { per_page: 1 } }).then(({ data }) => {
        if (data.success && data.total) setStats((prev) => ({ ...prev, articles: data.total }));
      }).catch(() => {
      }),
      api.getModules().then((res) => {
        if (res.success && res.data) setStats((prev) => ({ ...prev, modules: res.data.length }));
      }).catch(() => {
      }),
      api.client.get("/courses", { params: { per_page: 1 } }).then(({ data }) => {
        if (data.success && data.total) setStats((prev) => ({ ...prev, courses: data.total }));
      }).catch(() => {
      }),
      api.client.get("/knowledge", { params: { per_page: 1 } }).then(({ data }) => {
        if (data.success && data.total) setStats((prev) => ({ ...prev, knowledge: data.total }));
      }).catch(() => {
      })
    ]);
  }, []);
  return /* @__PURE__ */ jsxs("section", { className: "hero", children: [
    /* @__PURE__ */ jsxs("div", { className: "hero-text", children: [
      /* @__PURE__ */ jsxs("div", { className: "hero-eyebrow", children: [
        /* @__PURE__ */ jsx("span", { className: "ico", children: "P" }),
        "パンダ先生 × たろうくんと、SAPを学ぼう"
      ] }),
      /* @__PURE__ */ jsxs("h1", { children: [
        "SAPの世界を、",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "wave-under", children: "もっと身近に" }),
        "。"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "lead", children: "財務・購買・販売・生産・人事 — むずかしい SAP のしくみを、 パンダ先生がやさしく解説。たろうくん（24歳・SAP学習中）と一緒に、 「わからない…！」から「なるほど！」へ。" }),
      /* @__PURE__ */ jsxs("div", { className: "hero-ctas", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/paths", className: "btn primary", style: { textDecoration: "none" }, children: [
          "学習パスを見る",
          /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", children: /* @__PURE__ */ jsx("path", { d: "M5 12h14M13 6l6 6-6 6" }) })
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/modules", className: "btn", style: { textDecoration: "none" }, children: [
          /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", children: [
            /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "7" }),
            /* @__PURE__ */ jsx("path", { d: "m20 20-3.5-3.5" })
          ] }),
          "記事を探す"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hero-stats", children: [
        /* @__PURE__ */ jsxs("div", { className: "hero-stat", children: [
          /* @__PURE__ */ jsxs("div", { className: "v", children: [
            stats.articles.toLocaleString(),
            /* @__PURE__ */ jsx("small", { children: "本" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "l", children: "公開記事" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hero-stat", children: [
          /* @__PURE__ */ jsxs("div", { className: "v", children: [
            stats.modules,
            /* @__PURE__ */ jsx("small", { children: "モジュール" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "l", children: "主要モジュール網羅" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hero-stat", children: [
          /* @__PURE__ */ jsxs("div", { className: "v", children: [
            stats.courses.toLocaleString(),
            /* @__PURE__ */ jsx("small", { children: "コース" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "l", children: "専門コース" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hero-stat", children: [
          /* @__PURE__ */ jsxs("div", { className: "v", children: [
            stats.readers,
            /* @__PURE__ */ jsx("small", { children: "+" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "l", children: "月間読者" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(HeroScene, {})
  ] });
}
function ModulesSection() {
  const [modules, setModules] = useState(SAP_MODULES);
  useEffect(() => {
    api.getModules().then((res) => {
      if (res.success && res.data.length >= 9) setModules(res.data);
    }).catch(() => {
    });
  }, []);
  return /* @__PURE__ */ jsxs("section", { className: "section", id: "modules", children: [
    /* @__PURE__ */ jsxs("div", { className: "section-head", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "label", children: "Modules Guide" }),
        /* @__PURE__ */ jsxs("h2", { children: [
          "モジュール別ガイド",
          /* @__PURE__ */ jsx("span", { className: "accent-mark", children: "." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "desc", children: [
        "SAP の世界は広い。",
        /* @__PURE__ */ jsx("br", {}),
        "でも大丈夫、パンダ先生がモジュールごとに案内します。"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "module-grid", children: modules.map((m) => /* @__PURE__ */ jsxs(
      Link,
      {
        to: `/category/${m.slug}`,
        className: "mod-card",
        style: { "--card-color": m.color, "--card-bg": m.bg_color },
        children: [
          /* @__PURE__ */ jsx("div", { className: "mod-top", children: /* @__PURE__ */ jsx("div", { className: "mod-icon", children: m.code }) }),
          /* @__PURE__ */ jsx("div", { className: "mod-name-ja", children: m.name_ja }),
          /* @__PURE__ */ jsxs("div", { className: "mod-code", children: [
            m.name_en,
            " · ",
            m.code
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mod-desc", children: m.description }),
          /* @__PURE__ */ jsxs("div", { className: "mod-foot", children: [
            /* @__PURE__ */ jsxs("span", { className: "count", children: [
              m.article_count,
              "本"
            ] }),
            /* @__PURE__ */ jsx("span", { children: "の記事" }),
            /* @__PURE__ */ jsx("div", { className: "level-tags", children: m.levels.map((lv, j) => /* @__PURE__ */ jsx("span", { className: `level-pill l${j + 1}`, children: lv }, j)) })
          ] })
        ]
      },
      m.slug
    )) })
  ] });
}
function PathsSection() {
  const [paths, setPaths] = useState(LEARNING_PATHS);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.getLearningPaths().then((res) => {
      if (res.success && res.data.length >= 3) setPaths(res.data);
    }).catch(() => {
    }).finally(() => setLoading(false));
  }, []);
  return /* @__PURE__ */ jsxs("section", { className: "section", id: "paths", children: [
    /* @__PURE__ */ jsxs("div", { className: "section-head", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "label", children: "Learning Path" }),
        /* @__PURE__ */ jsxs("h2", { children: [
          "あなたに合わせた学習パス",
          /* @__PURE__ */ jsx("span", { className: "accent-mark", children: "." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "desc", children: [
        "バラバラの記事じゃなくて、目的別に組まれたコース。",
        /* @__PURE__ */ jsx("br", {}),
        "順番に読めば、自然と SAP がわかってくる。"
      ] })
    ] }),
    /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx("div", { className: "path-grid", children: paths.map((p2, i) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: `path-card p${i + 1}`,
        style: { "--accent-color": p2.accent || (i === 0 ? "#5a9d6e" : i === 1 ? "#d97548" : "#d96570") },
        children: [
          /* @__PURE__ */ jsx("div", { className: "num", children: String(i + 1).padStart(2, "0") }),
          /* @__PURE__ */ jsx("div", { className: "audience", children: p2.audience }),
          /* @__PURE__ */ jsx("h3", { children: p2.title }),
          /* @__PURE__ */ jsx("p", { children: p2.description }),
          /* @__PURE__ */ jsx("div", { className: "path-steps", children: (p2.steps || []).slice(0, 4).map((s, j) => /* @__PURE__ */ jsxs(Link, { to: s.id ? `/step/${s.id}` : `/learning/${p2.id}`, className: "path-step", children: [
            /* @__PURE__ */ jsx("span", { className: "step-num", children: j + 1 }),
            /* @__PURE__ */ jsx("span", { className: "step-title", children: s.title }),
            /* @__PURE__ */ jsx("span", { className: "step-time", children: s.time })
          ] }, j)) }),
          /* @__PURE__ */ jsxs("div", { className: "path-meta", children: [
            /* @__PURE__ */ jsx("span", { children: p2.duration }),
            /* @__PURE__ */ jsx(Link, { to: `/learning/${p2.id}`, className: "arrow", style: { textDecoration: "none" }, children: "パスを開始 →" })
          ] })
        ]
      },
      p2.id || i
    )) }) })
  ] });
}
function ArticlesSection() {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    api.getArticles({ per_page: 3 }).then((res) => {
      if (res.success && res.data) setArticles(res.data);
    }).catch(() => {
    });
  }, []);
  return /* @__PURE__ */ jsxs("section", { className: "section", id: "articles", children: [
    /* @__PURE__ */ jsxs("div", { className: "section-head", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "label", children: "Latest Articles" }),
        /* @__PURE__ */ jsxs("h2", { children: [
          "新着記事",
          /* @__PURE__ */ jsx("span", { className: "accent-mark", children: "." })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "desc", children: "毎週更新。読むだけで SAP 力が上がる記事を厳選。" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "articles-grid", children: [
      /* @__PURE__ */ jsx("div", { className: "article-list", children: articles.length === 0 ? /* @__PURE__ */ jsx("div", { style: { padding: 40, textAlign: "center", color: "var(--ink-3)", fontSize: 13 }, children: "読み込み中..." }) : articles.map((a) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return /* @__PURE__ */ jsxs(Link, { to: `/article/${a.id}/${a.slug}`, className: "article-row", style: { textDecoration: "none", display: "block" }, children: [
          /* @__PURE__ */ jsx("div", { className: "article-thumb", children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 120 88", style: { width: "100%", height: "100%" }, children: [
            /* @__PURE__ */ jsx("rect", { width: "120", height: "88", fill: ((_b = (_a = a.modules) == null ? void 0 : _a[0]) == null ? void 0 : _b.slug) ? "var(--accent-soft)" : "var(--bg-tint)" }),
            /* @__PURE__ */ jsx("text", { x: "60", y: "48", fontSize: "22", fontWeight: "800", fill: "var(--accent-deep)", textAnchor: "middle", fontFamily: "monospace", children: ((_e = (_d = (_c = a.modules) == null ? void 0 : _c[0]) == null ? void 0 : _d.slug) == null ? void 0 : _e.toUpperCase()) || "?" })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
            /* @__PURE__ */ jsxs("div", { className: "article-meta-top", children: [
              ((_f = a.modules) == null ? void 0 : _f[0]) && /* @__PURE__ */ jsx("span", { className: `tag-mod ${a.modules[0].slug}`, children: (_g = a.modules[0].slug) == null ? void 0 : _g.toUpperCase() }),
              a.difficulty && /* @__PURE__ */ jsx("span", { className: `tag-diff l${a.difficulty.slug === "beginner" ? 1 : a.difficulty.slug === "intermediate" ? 2 : 3}`, children: a.difficulty.slug === "beginner" ? "初級" : a.difficulty.slug === "intermediate" ? "中級" : "上級" })
            ] }),
            /* @__PURE__ */ jsx("h3", { children: a.title }),
            /* @__PURE__ */ jsx("div", { className: "excerpt", children: a.excerpt }),
            /* @__PURE__ */ jsxs("div", { className: "article-meta-bot", children: [
              /* @__PURE__ */ jsx("span", { children: ((_h = a.author) == null ? void 0 : _h.display_name) || "パンダ先生" }),
              /* @__PURE__ */ jsx("span", { children: "·" }),
              /* @__PURE__ */ jsx("span", { children: new Date(a.created_at).toLocaleDateString("ja-JP") }),
              /* @__PURE__ */ jsx("span", { children: "·" }),
              /* @__PURE__ */ jsxs("span", { children: [
                a.reading_time || 5,
                " min read"
              ] })
            ] })
          ] })
        ] }, a.id);
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "top10", children: [
        /* @__PURE__ */ jsxs("div", { className: "top10-head", children: [
          /* @__PURE__ */ jsx("span", { className: "badge", children: "RANKING" }),
          /* @__PURE__ */ jsx("h3", { children: "よく読まれている記事" })
        ] }),
        TOP10.map((t, i) => /* @__PURE__ */ jsxs("a", { href: "#", className: "top10-item", children: [
          /* @__PURE__ */ jsx("div", { className: "rank-num", children: String(i + 1).padStart(2, "0") }),
          /* @__PURE__ */ jsx("div", { children: t })
        ] }, i))
      ] })
    ] })
  ] });
}
function YouTubeSection() {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    api.getVideos({ per_page: 8 }).then((res) => {
      if (res.success) setVideos(res.data);
    }).catch(() => {
    });
  }, []);
  if (!videos.length) return null;
  return /* @__PURE__ */ jsxs("section", { className: "section", id: "video", children: [
    /* @__PURE__ */ jsxs("div", { className: "section-head", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "label", children: "YouTube" }),
        /* @__PURE__ */ jsxs("h2", { children: [
          "パンダ先生の動画講座",
          /* @__PURE__ */ jsx("span", { className: "accent-mark", children: "." })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "desc", children: "SAP の操作画面を動画で確認。通勤・隙間時間に。" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "yt-grid", children: videos.map((v) => /* @__PURE__ */ jsxs("a", { href: v.youtube_id ? `https://youtube.com/watch?v=${v.youtube_id}` : "#", target: "_blank", rel: "noopener noreferrer", className: "yt-vid", style: { textDecoration: "none", cursor: "pointer" }, children: [
      /* @__PURE__ */ jsx("div", { className: "vid-thumb", children: v.youtube_id ? /* @__PURE__ */ jsx("img", { src: `https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`, alt: v.title, style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ jsx("div", { style: { width: "100%", height: "100%", background: "var(--bg-tint)", display: "grid", placeItems: "center", color: "var(--ink-3)", fontSize: 24 }, children: "📹" }) }),
      /* @__PURE__ */ jsxs("div", { className: "vid-info", children: [
        /* @__PURE__ */ jsx("h4", { children: v.title }),
        /* @__PURE__ */ jsx("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.5)" }, children: v.duration || "" })
      ] })
    ] }, v.id)) })
  ] });
}
function NewsletterSection() {
  const [email, setEmail] = useState("");
  return /* @__PURE__ */ jsx("section", { className: "section", children: /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("div", { className: "newsletter", children: [
    /* @__PURE__ */ jsx("div", { className: "nl-mascot", children: /* @__PURE__ */ jsxs("svg", { width: "80", height: "80", viewBox: "-4 -8 108 108", children: [
      /* @__PURE__ */ jsx("circle", { cx: "50", cy: "52", r: "46", fill: "#e8f0fb", opacity: "0.4" }),
      /* @__PURE__ */ jsx("path", { d: "M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z", fill: "#fdfaf2" }),
      /* @__PURE__ */ jsxs("g", { children: [
        /* @__PURE__ */ jsx("path", { d: "M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z", fill: "#1a1612" }),
        /* @__PURE__ */ jsx("path", { d: "M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z", fill: "#1a1612" })
      ] }),
      /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "3.4", fill: "#fff" }),
      /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "2.4", fill: "#0e0a05" }),
      /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "3.4", fill: "#fff" }),
      /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "2.4", fill: "#0e0a05" }),
      /* @__PURE__ */ jsx("ellipse", { cx: "50", cy: "62", rx: "3.4", ry: "2.5", fill: "#1a1612" }),
      /* @__PURE__ */ jsx("path", { d: "M 42 68 Q 50 78 58 68", fill: "#1a1612" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "nl-text", children: [
      /* @__PURE__ */ jsx("h3", { children: "週末のニュースレター 🎋" }),
      /* @__PURE__ */ jsx("p", { children: "一週間の SAP ニュース、新着記事、パンダ先生の独り言を、土曜の朝にお届け。" })
    ] }),
    /* @__PURE__ */ jsxs("form", { className: "nl-form", onSubmit: (e) => {
      e.preventDefault();
      alert("登録ありがとう！🎋");
      setEmail("");
    }, children: [
      /* @__PURE__ */ jsx("input", { type: "email", placeholder: "your@email.com", value: email, onChange: (e) => setEmail(e.target.value), required: true }),
      /* @__PURE__ */ jsx("button", { className: "btn primary", type: "submit", children: "登録" })
    ] })
  ] }) }) });
}
function TweaksPanel({ settings, updateSetting }) {
  return /* @__PURE__ */ jsxs("div", { className: "tweaks-panel", children: [
    /* @__PURE__ */ jsxs("div", { className: "tweak-section", children: [
      /* @__PURE__ */ jsx("div", { className: "tweak-label", children: "カラーテーマ" }),
      /* @__PURE__ */ jsx("div", { className: "tweak-radio", children: ["bamboo", "warm", "fresh"].map((p2) => /* @__PURE__ */ jsx(
        "button",
        {
          className: settings.palette === p2 ? "active" : "",
          onClick: () => updateSetting("palette", p2),
          children: p2 === "bamboo" ? "竹林" : p2 === "warm" ? "温暖" : "清新"
        },
        p2
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "tweak-section", children: [
      /* @__PURE__ */ jsx("div", { className: "tweak-label", children: "アニメ強度" }),
      /* @__PURE__ */ jsx("div", { className: "tweak-radio", children: ["off", "light", "medium"].map((v) => /* @__PURE__ */ jsx(
        "button",
        {
          className: settings.intensity === v ? "active" : "",
          onClick: () => updateSetting("intensity", v),
          children: v === "off" ? "OFF" : v === "light" ? "弱" : "中"
        },
        v
      )) })
    ] })
  ] });
}
function HomePage() {
  const { settings, updateSetting } = useTheme();
  const [showTweaks, setShowTweaks] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "SAP学習プラットフォーム",
        description: "SAP のしくみを、パンダ先生がやさしく解説。財務会計(FI)・管理会計(CO)・購買(MM)・販売(SD)・生産(PP)・ABAP — 初心者から SAP コンサルまで、無料で学べる SAP 知識サイト。",
        path: "/"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, { active: "home" }),
    /* @__PURE__ */ jsxs("main", { style: { position: "relative", zIndex: 2 }, children: [
      /* @__PURE__ */ jsx(Hero, {}),
      /* @__PURE__ */ jsx(CaseTicker, {}),
      /* @__PURE__ */ jsx(CasesSection, {}),
      /* @__PURE__ */ jsx(FreelanceWorries, {}),
      /* @__PURE__ */ jsx(ModulesSection, {}),
      /* @__PURE__ */ jsx(PathsSection, {}),
      /* @__PURE__ */ jsx(ArticlesSection, {}),
      /* @__PURE__ */ jsx(QuizCard, {}),
      /* @__PURE__ */ jsx(YouTubeSection, {}),
      /* @__PURE__ */ jsx(NewsletterSection, {})
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {}),
    settings.showFloatingPanda && /* @__PURE__ */ jsx(FloatingPanda, {}),
    /* @__PURE__ */ jsx("div", { className: "tweaks-btn", children: /* @__PURE__ */ jsxs("button", { className: "btn sm", onClick: () => setShowTweaks(!showTweaks), children: [
      "🎨 ",
      showTweaks ? "✕" : "テーマ"
    ] }) }),
    showTweaks && /* @__PURE__ */ jsx(TweaksPanel, { settings, updateSetting })
  ] });
}
function scrollToHeading(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: "smooth" });
}
function throttle(fn, ms) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  };
}
function formatDate$1(article) {
  const raw = article.createdAt || article.created_at;
  if (!raw) return "";
  try {
    return new Date(raw).toLocaleDateString("ja-JP");
  } catch {
    return "";
  }
}
const MODULE_COLORS$1 = {
  fi: "#2f6d44",
  co: "#2641a1",
  mm: "#a25411",
  sd: "#b62a4a",
  pp: "#4828a8",
  hr: "#8a6212",
  abap: "#1f6f6f",
  basis: "#4a432d",
  s4: "#1864a3"
};
const MODULE_NAMES = {
  fi: "FI · 財務会計",
  co: "CO · 管理会計",
  mm: "MM · 購買・在庫",
  sd: "SD · 販売管理",
  pp: "PP · 生産計画",
  hr: "HR · 人事管理",
  abap: "ABAP · 開発言語",
  basis: "Basis · 基盤管理",
  s4: "S/4 · S/4HANA"
};
function buildTOC(content) {
  const ids = [];
  const re = /<h([23])[^>]*id=["']([^"']+)["'][^>]*>([^<]+)<\/h[23]>/gi;
  let m;
  while ((m = re.exec(content)) !== null) {
    ids.push({ id: m[2], label: m[3].replace(/&\w+;/g, "") });
  }
  if (ids.length === 0) {
    const h2re = /<h2[^>]*>([^<]+)<\/h2>/gi;
    let i = 0;
    while ((m = h2re.exec(content)) !== null) {
      ids.push({ id: `s${++i}`, label: m[1].replace(/&\w+;/g, "") });
    }
  }
  return ids;
}
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}
function estimateReadingTime(content) {
  const text = content.replace(/<[^>]+>/g, "").trim();
  const jp = (text.match(/[぀-ゟ゠-ヿ一-鿿]/g) || []).length;
  const other = text.replace(/[぀-ゟ゠-ヿ一-鿿\s]/g, "").length;
  return Math.max(1, Math.round(jp / 500 + other / 200));
}
function ArticlePage() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
  const { id, slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeToc, setActiveToc] = useState("");
  const { settings } = useTheme();
  const [showTweaks, setShowTweaks] = useState(false);
  useEffect(() => {
    if (!id || !/^\d+$/.test(id)) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setNotFound(false);
    api.getArticle(parseInt(id, 10)).then((res) => {
      if (res.success && res.data) {
        setArticle(res.data);
      } else {
        setNotFound(true);
      }
    }).catch(() => {
      setNotFound(true);
    }).finally(() => setLoading(false));
  }, [id]);
  const content = (article == null ? void 0 : article.content) || "";
  const TOC = useMemo(() => buildTOC(content), [content]);
  const readingTime = (article == null ? void 0 : article.reading_time) || estimateReadingTime(content);
  const modSlug = ((_b = (_a = article == null ? void 0 : article.modules) == null ? void 0 : _a[0]) == null ? void 0 : _b.slug) || "fi";
  const modColor2 = MODULE_COLORS$1[modSlug] || "#5a9d6e";
  const topicLabel = ((_c = article == null ? void 0 : article.topic) == null ? void 0 : _c.name) || "";
  const diffLabel = ((_d = article == null ? void 0 : article.difficulty) == null ? void 0 : _d.slug) === "beginner" ? "初級" : ((_e = article == null ? void 0 : article.difficulty) == null ? void 0 : _e.slug) === "intermediate" ? "中級" : ((_f = article == null ? void 0 : article.difficulty) == null ? void 0 : _f.slug) === "advanced" ? "上級" : "";
  const diffLevel = ((_g = article == null ? void 0 : article.difficulty) == null ? void 0 : _g.slug) === "beginner" ? 1 : ((_h = article == null ? void 0 : article.difficulty) == null ? void 0 : _h.slug) === "intermediate" ? 2 : ((_i = article == null ? void 0 : article.difficulty) == null ? void 0 : _i.slug) === "advanced" ? 3 : 0;
  useEffect(() => {
    if (TOC.length === 0) return;
    const onScroll = throttle(() => {
      var _a2;
      const viewTop = window.scrollY + 160;
      let active = ((_a2 = TOC[0]) == null ? void 0 : _a2.id) || "";
      for (const t of TOC) {
        const el = document.getElementById(t.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= viewTop) active = t.id;
        }
      }
      setActiveToc(active);
    }, 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [TOC]);
  if (loading) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "page-bg" }),
      /* @__PURE__ */ jsx(SiteHeader, { active: "modules" }),
      /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", padding: "120px 20px", color: "var(--ink-3)" }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: 40, marginBottom: 16 }, children: "🐼" }),
        /* @__PURE__ */ jsx("div", { children: "読み込み中..." })
      ] }),
      /* @__PURE__ */ jsx(SiteFooter, {}),
      settings.showFloatingPanda && /* @__PURE__ */ jsx(FloatingPanda, {})
    ] });
  }
  if (notFound || !article) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "page-bg" }),
      /* @__PURE__ */ jsx(SiteHeader, { active: "modules" }),
      /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", padding: "120px 20px" }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: 64, marginBottom: 16 }, children: "🔍" }),
        /* @__PURE__ */ jsx("h2", { style: { fontFamily: "var(--font-display)", color: "var(--ink-0)" }, children: "記事が見つかりませんでした" }),
        /* @__PURE__ */ jsx("p", { style: { color: "var(--ink-2)", margin: "12px 0 24px" }, children: "お探しの記事は存在しないか、移動した可能性があります。" }),
        /* @__PURE__ */ jsx(Link, { to: "/", className: "btn accent", style: { textDecoration: "none" }, children: "ホームに戻る" })
      ] }),
      /* @__PURE__ */ jsx(SiteFooter, {}),
      settings.showFloatingPanda && /* @__PURE__ */ jsx(FloatingPanda, {})
    ] });
  }
  const articleTitle = article.title || "";
  const articleExcerpt = article.excerpt || "";
  const articleDate = formatDate(article.created_at || article.createdAt || "");
  const modName = MODULE_NAMES[modSlug] || ((_k = (_j = article == null ? void 0 : article.modules) == null ? void 0 : _j[0]) == null ? void 0 : _k.name) || "";
  const authorName = ((_l = article.author) == null ? void 0 : _l.display_name) || ((_m = article.author) == null ? void 0 : _m.displayName) || "パンダ先生";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: articleTitle,
        description: articleExcerpt || articleTitle,
        path: id && slug ? `/article/${id}/${slug}` : "/article",
        type: "article",
        publishedTime: article.created_at || article.createdAt,
        author: authorName,
        breadcrumbs: [
          { name: "ホーム", path: "/" },
          { name: modName || "モジュール", path: `/category/${modSlug}` },
          { name: articleTitle, path: id && slug ? `/article/${id}/${slug}` : "/article" }
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, { active: "modules" }),
    /* @__PURE__ */ jsxs("article", { className: "art-hero", children: [
      /* @__PURE__ */ jsxs("div", { className: "crumb", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", children: "ホーム" }),
        /* @__PURE__ */ jsx("span", { className: "sep", children: "›" }),
        /* @__PURE__ */ jsx(Link, { to: `/category/${modSlug}`, children: modName }),
        /* @__PURE__ */ jsx("span", { className: "sep", children: "›" }),
        /* @__PURE__ */ jsx("span", { className: "now", children: articleTitle })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "meta-top", style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", fontSize: 12.5, marginBottom: 16 }, children: [
        /* @__PURE__ */ jsx("span", { className: `tag-mod ${modSlug}`, children: modSlug.toUpperCase() }),
        diffLevel > 0 && /* @__PURE__ */ jsx("span", { className: `tag-diff l${diffLevel}`, children: diffLabel }),
        topicLabel && /* @__PURE__ */ jsxs("span", { style: { color: "var(--ink-3)" }, children: [
          "· ",
          topicLabel
        ] }),
        articleDate && /* @__PURE__ */ jsxs("span", { style: { color: "var(--ink-3)" }, children: [
          "· ",
          articleDate
        ] }),
        /* @__PURE__ */ jsxs("span", { style: { color: "var(--ink-3)" }, children: [
          "· ",
          readingTime,
          " min read"
        ] })
      ] }),
      /* @__PURE__ */ jsx("h1", { children: articleTitle }),
      articleExcerpt && /* @__PURE__ */ jsx("p", { className: "lead", children: articleExcerpt }),
      /* @__PURE__ */ jsx("div", { className: "art-hero-cover", children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 720 320", style: { width: "100%", height: "100%" }, children: [
        /* @__PURE__ */ jsx("rect", { width: "720", height: "320", fill: modColor2 + "22" }),
        /* @__PURE__ */ jsxs("text", { x: "360", y: "160", textAnchor: "middle", fontSize: "48", fontWeight: "700", fill: modColor2, fontFamily: "Zen Maru Gothic", children: [
          modSlug.toUpperCase(),
          " · ",
          ((_n = modName.split("·")[1]) == null ? void 0 : _n.trim()) || modName
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "art-body-wrap", children: [
      /* @__PURE__ */ jsxs("div", { className: "art-content", children: [
        /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: content } }),
        /* @__PURE__ */ jsx("div", { style: { marginTop: 48 }, children: /* @__PURE__ */ jsxs("div", { style: {
          padding: "24px 26px",
          background: "var(--bg-card)",
          borderRadius: "var(--r-lg)",
          border: "1px solid var(--line-2)",
          display: "flex",
          alignItems: "center",
          gap: 14
        }, children: [
          /* @__PURE__ */ jsxs("svg", { width: "56", height: "56", viewBox: "-4 -8 108 108", children: [
            /* @__PURE__ */ jsx("circle", { cx: "50", cy: "52", r: "46", fill: "#e8f0fb", opacity: "0.4" }),
            /* @__PURE__ */ jsx("path", { d: "M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z", fill: "#fdfaf2" }),
            /* @__PURE__ */ jsxs("g", { children: [
              /* @__PURE__ */ jsx("path", { d: "M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z", fill: "#1a1612" }),
              /* @__PURE__ */ jsx("path", { d: "M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z", fill: "#1a1612" })
            ] }),
            /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "3.4", fill: "#fff" }),
            /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "2.4", fill: "#0e0a05" }),
            /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "3.4", fill: "#fff" }),
            /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "2.4", fill: "#0e0a05" }),
            /* @__PURE__ */ jsx("ellipse", { cx: "50", cy: "62", rx: "3.4", ry: "2.5", fill: "#1a1612" }),
            /* @__PURE__ */ jsx("path", { d: "M 42 68 Q 50 78 58 68", fill: "#1a1612" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-0)", marginBottom: 2 }, children: "この記事、役に立った？" }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: 13, color: "var(--ink-2)" }, children: "反応をくれると、パンダ先生のやる気が +100 します。" })
          ] }),
          /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 6 }, children: ["👍", "❤", "🎋", "🙏"].map((e) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              style: { width: 44, height: 44, borderRadius: "50%", border: "1.5px solid var(--line-2)", background: "var(--bg-1)", fontSize: 20, cursor: "pointer" },
              children: e
            },
            e
          )) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "art-side", children: [
        TOC.length > 0 && /* @__PURE__ */ jsxs("div", { className: "toc-card", children: [
          /* @__PURE__ */ jsx("h5", { children: "目次" }),
          /* @__PURE__ */ jsx("ul", { className: "toc-list", children: TOC.map((t) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            "a",
            {
              href: `#${t.id}`,
              className: activeToc === t.id ? "active" : "",
              onClick: (e) => {
                e.preventDefault();
                scrollToHeading(t.id);
              },
              children: t.label
            }
          ) }, t.id)) })
        ] }),
        article.related_articles && article.related_articles.length > 0 && /* @__PURE__ */ jsxs("div", { className: "toc-card", children: [
          /* @__PURE__ */ jsx("h5", { children: "📚 関連記事" }),
          /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: article.related_articles.slice(0, 4).map((ra) => /* @__PURE__ */ jsxs(
            Link,
            {
              to: `/article/${ra.id}/${ra.slug}`,
              style: {
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                background: "var(--bg-1)",
                borderRadius: "var(--r-md)",
                textDecoration: "none",
                fontSize: 13,
                transition: "all .15s"
              },
              children: [
                /* @__PURE__ */ jsx("div", { style: {
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  background: modColor2 + "22",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 11,
                  color: modColor2,
                  flexShrink: 0
                }, children: modSlug.toUpperCase() }),
                /* @__PURE__ */ jsx("div", { style: { flex: 1, minWidth: 0 }, children: /* @__PURE__ */ jsx("div", { style: { fontWeight: 600, color: "var(--ink-0)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: ra.title }) }),
                /* @__PURE__ */ jsx("span", { style: { color: "var(--ink-3)", fontSize: 14, flexShrink: 0 }, children: "→" })
              ]
            },
            ra.id
          )) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {}),
    settings.showFloatingPanda && /* @__PURE__ */ jsx(FloatingPanda, {})
  ] });
}
const BASE_URL = "https://sap-navi.aladdin-techec.com/sap";
const MODULE_COLORS = {
  fi: "#2f6d44",
  co: "#2641a1",
  mm: "#a25411",
  sd: "#b62a4a",
  pp: "#4828a8",
  hr: "#8a6212",
  abap: "#1f6f6f",
  basis: "#4a432d",
  s4: "#1864a3"
};
function CategoryPage() {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const { module: moduleSlug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("articles");
  const [diff, setDiff] = useState("all");
  const { settings } = useTheme();
  const { user } = useAuth();
  const isAdmin = (_a = user == null ? void 0 : user.roles) == null ? void 0 : _a.includes("administrator");
  const activeModule = SAP_MODULES.find((m) => m.slug === moduleSlug);
  const color = MODULE_COLORS[moduleSlug || "fi"] || "#5a9d6e";
  useEffect(() => {
    if (!moduleSlug) return;
    setLoading(true);
    api.getModuleContent(moduleSlug).then((res) => {
      if (res.success) setData(res.data);
    }).catch(() => {
    }).finally(() => setLoading(false));
  }, [moduleSlug]);
  const counts = ((_b = data == null ? void 0 : data.module) == null ? void 0 : _b.counts) || {};
  const tabItems = [
    { key: "articles", label: "記事", count: counts.articles || 0 },
    { key: "courses", label: "コース", count: counts.courses || 0 },
    { key: "knowledge", label: "ナレッジ", count: counts.knowledge || 0 }
  ];
  const filteredArticles = ((data == null ? void 0 : data.articles) || []).filter((a) => {
    var _a2;
    if (diff === "all") return true;
    return ((_a2 = a.difficulty) == null ? void 0 : _a2.slug) === diff;
  });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: activeModule ? `${activeModule.name_ja} (${activeModule.code}) — 記事・コース一覧` : "モジュール詳細",
        description: activeModule ? `${activeModule.name_ja}（${activeModule.name_en}）の解説記事・コース・ナレッジをまとめました。${activeModule.description} パンダ先生がわかりやすく解説。` : "SAP モジュール別の記事一覧ページです。",
        path: `/category/${moduleSlug}`,
        breadcrumbs: [
          { name: "ホーム", path: "/" },
          { name: "モジュール", path: "/modules" },
          { name: (activeModule == null ? void 0 : activeModule.name_ja) || moduleSlug || "", path: `/category/${moduleSlug}` }
        ],
        image: activeModule ? `${BASE_URL}/og-${moduleSlug}.png` : void 0
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, { active: "modules" }),
    /* @__PURE__ */ jsx("section", { className: "cat-hero", children: /* @__PURE__ */ jsxs("div", { className: "cat-hero-wrap", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "crumb", children: [
          /* @__PURE__ */ jsx(Link, { to: "/", children: "ホーム" }),
          /* @__PURE__ */ jsx("span", { className: "sep", children: "›" }),
          /* @__PURE__ */ jsx(Link, { to: "/modules", children: "モジュール" }),
          /* @__PURE__ */ jsx("span", { className: "sep", children: "›" }),
          /* @__PURE__ */ jsxs("span", { className: "now", children: [
            activeModule == null ? void 0 : activeModule.code,
            " · ",
            activeModule == null ? void 0 : activeModule.name_ja
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "cat-title-row", children: [
          /* @__PURE__ */ jsx("div", { className: "cat-big-icon", style: { background: color }, children: activeModule == null ? void 0 : activeModule.code }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { children: activeModule == null ? void 0 : activeModule.name_ja }),
            /* @__PURE__ */ jsxs("span", { className: "code", children: [
              activeModule == null ? void 0 : activeModule.name_en,
              " · ",
              activeModule == null ? void 0 : activeModule.code
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "cat-desc", children: [
          activeModule == null ? void 0 : activeModule.description,
          "パンダ先生がわかりやすく解説します。"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "cat-stats", children: [
          /* @__PURE__ */ jsxs("div", { className: "stat", children: [
            /* @__PURE__ */ jsxs("div", { className: "v", children: [
              counts.articles || "…",
              /* @__PURE__ */ jsx("small", { style: { fontSize: 13, color: "var(--ink-2)" }, children: "本" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "l", children: "公開記事" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "stat", children: [
            /* @__PURE__ */ jsxs("div", { className: "v", children: [
              counts.courses || 0,
              /* @__PURE__ */ jsx("small", { style: { fontSize: 13, color: "var(--ink-2)" }, children: "件" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "l", children: "コース" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "stat", children: [
            /* @__PURE__ */ jsxs("div", { className: "v", children: [
              counts.knowledge || 0,
              /* @__PURE__ */ jsx("small", { style: { fontSize: 13, color: "var(--ink-2)" }, children: "件" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "l", children: "ナレッジ" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "cat-mascot", children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 200 200", width: "200", height: "200", children: [
        /* @__PURE__ */ jsx("circle", { cx: "100", cy: "100", r: "80", fill: "#fdfaf2" }),
        /* @__PURE__ */ jsxs("g", { children: [
          /* @__PURE__ */ jsx("path", { d: "M 68 76 Q 72 68 82 70 Q 92 72 92 84 Q 92 96 82 98 Q 70 98 66 90 Q 64 82 68 76 Z", fill: "#1a1612" }),
          /* @__PURE__ */ jsx("path", { d: "M 132 76 Q 128 68 118 70 Q 108 72 108 84 Q 108 96 118 98 Q 130 98 134 90 Q 136 82 132 76 Z", fill: "#1a1612" })
        ] }),
        /* @__PURE__ */ jsx("circle", { cx: "78", cy: "86", r: "5", fill: "#fff" }),
        /* @__PURE__ */ jsx("circle", { cx: "78", cy: "86", r: "3.5", fill: "#0e0a05" }),
        /* @__PURE__ */ jsx("circle", { cx: "122", cy: "86", r: "5", fill: "#fff" }),
        /* @__PURE__ */ jsx("circle", { cx: "122", cy: "86", r: "3.5", fill: "#0e0a05" }),
        /* @__PURE__ */ jsx("ellipse", { cx: "100", cy: "110", rx: "5", ry: "3.5", fill: "#1a1612" }),
        /* @__PURE__ */ jsx("path", { d: "M 92 118 Q 100 126 108 118", fill: "none", stroke: "#1a1612", strokeWidth: "3", strokeLinecap: "round" }),
        /* @__PURE__ */ jsx("text", { x: "160", y: "50", fontSize: "32", fill: "#d97548", opacity: "0.6", fontFamily: "Zen Maru Gothic", children: "?" }),
        /* @__PURE__ */ jsx("text", { x: "30", y: "160", fontSize: "26", fill: "#1f4ea3", opacity: "0.5", fontFamily: "Zen Maru Gothic", children: "?" })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxs("main", { className: "cat-body", children: [
      /* @__PURE__ */ jsxs("aside", { className: "cat-sidebar", children: [
        /* @__PURE__ */ jsxs("div", { className: "filter-block", children: [
          /* @__PURE__ */ jsx("h5", { children: "ナレッジタイプ" }),
          /* @__PURE__ */ jsx("div", { className: "filter-list", children: tabItems.map((t) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: `filter-item ${tab === t.key ? "active" : ""}`,
              onClick: () => setTab(t.key),
              children: [
                /* @__PURE__ */ jsx("span", { children: t.label }),
                /* @__PURE__ */ jsx("span", { className: "cnt", children: t.count })
              ]
            },
            t.key
          )) })
        ] }),
        tab === "articles" && /* @__PURE__ */ jsxs("div", { className: "filter-block", children: [
          /* @__PURE__ */ jsx("h5", { children: "難易度で絞り込む" }),
          /* @__PURE__ */ jsx("div", { className: "filter-list", children: [
            { id: "all", label: "すべて", c: ((_c = data == null ? void 0 : data.articles) == null ? void 0 : _c.length) || 0 },
            { id: "beginner", label: "初級", c: ((_d = data == null ? void 0 : data.articles) == null ? void 0 : _d.filter((a) => {
              var _a2;
              return ((_a2 = a.difficulty) == null ? void 0 : _a2.slug) === "beginner";
            }).length) || 0 },
            { id: "intermediate", label: "中級", c: ((_e = data == null ? void 0 : data.articles) == null ? void 0 : _e.filter((a) => {
              var _a2;
              return ((_a2 = a.difficulty) == null ? void 0 : _a2.slug) === "intermediate";
            }).length) || 0 },
            { id: "advanced", label: "上級", c: ((_f = data == null ? void 0 : data.articles) == null ? void 0 : _f.filter((a) => {
              var _a2;
              return ((_a2 = a.difficulty) == null ? void 0 : _a2.slug) === "advanced";
            }).length) || 0 }
          ].map((d) => /* @__PURE__ */ jsxs("div", { className: `filter-item ${diff === d.id ? "active" : ""}`, onClick: () => setDiff(d.id), children: [
            /* @__PURE__ */ jsx("span", { className: "swatch", style: {
              width: 14,
              height: 14,
              borderRadius: 4,
              background: d.id === "beginner" ? "var(--accent-soft)" : d.id === "intermediate" ? "var(--accent-2-soft)" : d.id === "advanced" ? "var(--rose-soft)" : "var(--line-2)",
              flexShrink: 0
            } }),
            /* @__PURE__ */ jsx("span", { children: d.label }),
            /* @__PURE__ */ jsx("span", { className: "cnt", children: d.c })
          ] }, d.id)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "filter-block", style: { background: "linear-gradient(135deg, var(--accent-soft), var(--bg-card))", borderColor: "var(--accent)" }, children: [
          /* @__PURE__ */ jsx("h5", { style: { color: "var(--accent-deep)" }, children: "📘 学習パス" }),
          /* @__PURE__ */ jsxs("div", { style: { fontSize: 12.5, color: "var(--ink-1)", lineHeight: 1.7, marginBottom: 10 }, children: [
            activeModule == null ? void 0 : activeModule.code,
            " を体系的に学ぶなら、パスから始めよう。"
          ] }),
          /* @__PURE__ */ jsx(Link, { to: "/#paths", className: "btn sm accent", style: { width: "100%", justifyContent: "center", textDecoration: "none" }, children: "学習パスを見る →" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "cat-content", children: loading ? /* @__PURE__ */ jsx("div", { style: { textAlign: "center", padding: 60, color: "var(--ink-3)" }, children: "読み込み中..." }) : !data ? /* @__PURE__ */ jsx("div", { style: { textAlign: "center", padding: 60, color: "var(--ink-3)" }, children: "データがありません。" }) : tab === "articles" ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "cat-toolbar", style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }, children: /* @__PURE__ */ jsxs("div", { className: "count", children: [
          /* @__PURE__ */ jsx("strong", { children: filteredArticles.length }),
          " 件 の記事"
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "card-grid", children: [
          filteredArticles.length === 0 && /* @__PURE__ */ jsx("div", { style: { gridColumn: "1/-1", textAlign: "center", padding: 40, color: "var(--ink-3)" }, children: "まだ記事がありません。" }),
          filteredArticles.map((a) => /* @__PURE__ */ jsxs(Link, { className: "art-card", to: `/article/${a.id}/${a.slug}`, children: [
            /* @__PURE__ */ jsx("div", { className: "cover", children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 160 90", style: { width: "100%", height: "100%" }, children: [
              /* @__PURE__ */ jsx("rect", { width: "160", height: "90", fill: color + "22" }),
              /* @__PURE__ */ jsx("text", { x: "80", y: "52", fontSize: "28", fontWeight: "800", fill: color, textAnchor: "middle", fontFamily: "Zen Maru Gothic", children: activeModule == null ? void 0 : activeModule.code })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "body", children: [
              /* @__PURE__ */ jsxs("div", { className: "tags-row", style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 11, color: "var(--ink-3)" }, children: [
                /* @__PURE__ */ jsx("span", { className: `tag-mod ${moduleSlug}`, children: activeModule == null ? void 0 : activeModule.code }),
                a.difficulty && /* @__PURE__ */ jsx("span", { className: `tag-diff l${a.difficulty.slug === "beginner" ? 1 : a.difficulty.slug === "intermediate" ? 2 : 3}`, children: a.difficulty.slug === "beginner" ? "初級" : a.difficulty.slug === "intermediate" ? "中級" : "上級" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "· ",
                  new Date(a.created_at).toLocaleDateString("ja-JP")
                ] })
              ] }),
              /* @__PURE__ */ jsx("h3", { children: a.title }),
              /* @__PURE__ */ jsx("p", { className: "excerpt", children: a.excerpt }),
              /* @__PURE__ */ jsxs("div", { className: "foot", children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  "📖 ",
                  a.reading_time,
                  " min"
                ] }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "👁 ",
                  a.views
                ] }),
                /* @__PURE__ */ jsx("span", { className: "read", style: { marginLeft: "auto", color: "var(--accent-deep)", fontWeight: 700 }, children: "読む →" })
              ] })
            ] })
          ] }, a.id))
        ] })
      ] }) : tab === "courses" ? /* @__PURE__ */ jsxs(Fragment, { children: [
        isAdmin && /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "flex-end", marginBottom: 12 }, children: /* @__PURE__ */ jsx(Link, { to: "/admin/courses", className: "btn sm ghost", style: { textDecoration: "none", fontSize: 11.5, color: "var(--accent-deep)" }, children: "⚙ コースを管理する →" }) }),
        /* @__PURE__ */ jsxs("div", { className: "card-grid", children: [
          (!data.courses || data.courses.length === 0) && /* @__PURE__ */ jsx("div", { style: { gridColumn: "1/-1", textAlign: "center", padding: 40, color: "var(--ink-3)" }, children: "まだコースがありません。" }),
          (_g = data.courses) == null ? void 0 : _g.map((c) => {
            var _a2;
            return /* @__PURE__ */ jsxs(Link, { to: `/course/${c.id}`, className: "art-card", children: [
              /* @__PURE__ */ jsx("div", { className: "cover", children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 160 90", style: { width: "100%", height: "100%" }, children: [
                /* @__PURE__ */ jsx("rect", { width: "160", height: "90", fill: color + "22" }),
                /* @__PURE__ */ jsx("text", { x: "80", y: "52", fontSize: "28", fontWeight: "800", fill: color, textAnchor: "middle", fontFamily: "Zen Maru Gothic", children: activeModule == null ? void 0 : activeModule.code })
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "body", children: [
                /* @__PURE__ */ jsxs("div", { className: "tags-row", style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 11, color: "var(--ink-3)" }, children: [
                  /* @__PURE__ */ jsx("span", { className: `tag-mod ${moduleSlug}`, children: activeModule == null ? void 0 : activeModule.code }),
                  ((_a2 = c.difficulty) == null ? void 0 : _a2.slug) && /* @__PURE__ */ jsx("span", { className: `tag-diff l${c.difficulty.slug === "beginner" ? 1 : c.difficulty.slug === "intermediate" ? 2 : 3}`, children: c.difficulty.slug === "beginner" ? "初級" : c.difficulty.slug === "intermediate" ? "中級" : "上級" }),
                  c.created_at && /* @__PURE__ */ jsxs("span", { children: [
                    "· ",
                    new Date(c.created_at).toLocaleDateString("ja-JP")
                  ] })
                ] }),
                /* @__PURE__ */ jsx("h3", { children: c.title }),
                c.excerpt && /* @__PURE__ */ jsx("p", { className: "excerpt", children: c.excerpt }),
                /* @__PURE__ */ jsxs("div", { className: "foot", children: [
                  c.duration && /* @__PURE__ */ jsxs("span", { children: [
                    "⏱ ",
                    c.duration
                  ] }),
                  c.price > 0 && /* @__PURE__ */ jsxs("span", { style: { fontWeight: 700, color: "var(--accent-deep)" }, children: [
                    "¥",
                    c.price.toLocaleString()
                  ] }),
                  c.price === 0 && /* @__PURE__ */ jsx("span", { style: { color: "var(--accent)" }, children: "無料" }),
                  /* @__PURE__ */ jsx("span", { className: "read", style: { marginLeft: "auto", color: "var(--accent-deep)", fontWeight: 700 }, children: "詳細 →" })
                ] })
              ] })
            ] }, c.id);
          })
        ] })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        isAdmin && /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "flex-end", marginBottom: 12 }, children: /* @__PURE__ */ jsx(Link, { to: "/admin/knowledge", className: "btn sm ghost", style: { textDecoration: "none", fontSize: 11.5, color: "var(--accent-deep)" }, children: "⚙ ナレッジを管理する →" }) }),
        /* @__PURE__ */ jsxs("div", { className: "card-grid", children: [
          (!data.knowledge || data.knowledge.length === 0) && /* @__PURE__ */ jsx("div", { style: { gridColumn: "1/-1", textAlign: "center", padding: 40, color: "var(--ink-3)" }, children: "まだナレッジがありません。" }),
          (_h = data.knowledge) == null ? void 0 : _h.map((k) => /* @__PURE__ */ jsxs(Link, { to: `/knowledge/${k.id}/${k.slug}`, className: "art-card", children: [
            /* @__PURE__ */ jsx("div", { className: "cover", children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 160 90", style: { width: "100%", height: "100%" }, children: [
              /* @__PURE__ */ jsx("rect", { width: "160", height: "90", fill: color + "22" }),
              /* @__PURE__ */ jsx("text", { x: "80", y: "52", fontSize: "28", fontWeight: "800", fill: color, textAnchor: "middle", fontFamily: "Zen Maru Gothic", children: activeModule == null ? void 0 : activeModule.code })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "body", children: [
              /* @__PURE__ */ jsxs("div", { className: "tags-row", style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 11, color: "var(--ink-3)" }, children: [
                /* @__PURE__ */ jsx("span", { className: `tag-mod ${moduleSlug}`, children: activeModule == null ? void 0 : activeModule.code }),
                k.type && /* @__PURE__ */ jsx("span", { style: { fontSize: 10.5, padding: "1px 6px", borderRadius: 4, background: "var(--bg-tint)", color: "var(--ink-2)", fontWeight: 600 }, children: k.type }),
                k.created_at && /* @__PURE__ */ jsxs("span", { children: [
                  "· ",
                  new Date(k.created_at).toLocaleDateString("ja-JP")
                ] })
              ] }),
              /* @__PURE__ */ jsx("h3", { children: k.title }),
              k.excerpt && /* @__PURE__ */ jsx("p", { className: "excerpt", children: k.excerpt }),
              /* @__PURE__ */ jsxs("div", { className: "foot", children: [
                /* @__PURE__ */ jsx("span", { style: { color: "var(--ink-3)" }, children: new Date(k.created_at).toLocaleDateString("ja-JP") }),
                /* @__PURE__ */ jsx("span", { className: "read", style: { marginLeft: "auto", color: "var(--accent-deep)", fontWeight: 700 }, children: "読む →" })
              ] })
            ] })
          ] }, k.id))
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {}),
    settings.showFloatingPanda && /* @__PURE__ */ jsx(FloatingPanda, {})
  ] });
}
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      setErrMsg("メールアドレスとパスワードを入力してください。");
      return;
    }
    setSubmitting(true);
    setErrMsg("");
    const ok = await login(email, password);
    setSubmitting(false);
    if (ok) navigate("/");
    else setErrMsg("メールアドレスまたはパスワードが正しくありません。");
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "ログイン — SAP パンダ先生",
        description: "SAP パンダ先生 NAVI にログイン。会員限定の学習機能、案件応募、学習進度の管理が利用できます。",
        path: "/login",
        noindex: true
      }
    ),
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsx("main", { style: { position: "relative", zIndex: 2, minHeight: "60vh", display: "grid", placeItems: "center" }, children: /* @__PURE__ */ jsxs("div", { style: {
      background: "var(--bg-card)",
      borderRadius: "var(--r-xl)",
      border: "1px solid var(--line-2)",
      padding: "40px 48px",
      maxWidth: 420,
      width: "100%",
      margin: "40px 20px"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: 28 }, children: [
        /* @__PURE__ */ jsxs("svg", { width: "56", height: "56", viewBox: "-4 -8 108 108", style: { margin: "0 auto 12px", display: "block" }, children: [
          /* @__PURE__ */ jsx("circle", { cx: "50", cy: "52", r: "46", fill: "#d8ead9" }),
          /* @__PURE__ */ jsx("path", { d: "M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z", fill: "#fdfaf2" }),
          /* @__PURE__ */ jsxs("g", { children: [
            /* @__PURE__ */ jsx("path", { d: "M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z", fill: "#1a1612" }),
            /* @__PURE__ */ jsx("path", { d: "M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z", fill: "#1a1612" })
          ] }),
          /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "3.4", fill: "#fff" }),
          /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "2.4", fill: "#0e0a05" }),
          /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "3.4", fill: "#fff" }),
          /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "2.4", fill: "#0e0a05" }),
          /* @__PURE__ */ jsx("ellipse", { cx: "50", cy: "62", rx: "3.4", ry: "2.5", fill: "#1a1612" }),
          /* @__PURE__ */ jsx("path", { d: "M 42 68 Q 50 78 58 68", fill: "#1a1612" })
        ] }),
        /* @__PURE__ */ jsx("h1", { style: { fontFamily: "var(--font-display)", fontSize: 24, color: "var(--ink-0)", margin: 0 }, children: "ログイン" })
      ] }),
      errMsg && /* @__PURE__ */ jsx("div", { style: { background: "var(--rose-soft)", color: "var(--rose)", padding: "10px 14px", borderRadius: "var(--r-md)", fontSize: 13, marginBottom: 16 }, children: errMsg }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, style: { display: "flex", flexDirection: "column", gap: 16 }, children: [
        /* @__PURE__ */ jsxs("label", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
          /* @__PURE__ */ jsx("span", { style: { fontSize: 12.5, fontWeight: 600, color: "var(--ink-0)" }, children: "メールアドレス" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: "you@example.com",
              required: true,
              style: { padding: "10px 14px", border: "1.5px solid var(--line-2)", borderRadius: "var(--r-md)", fontSize: 14, outline: "none" },
              onFocus: (e) => e.target.style.borderColor = "var(--accent)",
              onBlur: (e) => e.target.style.borderColor = "var(--line-2)"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("label", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
          /* @__PURE__ */ jsx("span", { style: { fontSize: 12.5, fontWeight: 600, color: "var(--ink-0)" }, children: "パスワード" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              placeholder: "••••••••",
              required: true,
              style: { padding: "10px 14px", border: "1.5px solid var(--line-2)", borderRadius: "var(--r-md)", fontSize: 14, outline: "none" },
              onFocus: (e) => e.target.style.borderColor = "var(--accent)",
              onBlur: (e) => e.target.style.borderColor = "var(--line-2)"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: submitting,
            className: "btn primary",
            style: { width: "100%", justifyContent: "center", padding: 12, fontSize: 15 },
            children: submitting ? "ログイン中..." : "ログイン"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { marginTop: 20, textAlign: "center", fontSize: 13, color: "var(--ink-2)" }, children: [
        "アカウントをお持ちでない方は",
        /* @__PURE__ */ jsx(Link, { to: "/register", style: { color: "var(--accent-deep)", fontWeight: 600, marginLeft: 4 }, children: "新規登録" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
}
function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm2, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    setErrMsg("");
    if (!email || !password || !name) {
      setErrMsg("すべての項目を入力してください。");
      return;
    }
    if (password.length < 6) {
      setErrMsg("パスワードは6文字以上で入力してください。");
      return;
    }
    if (password !== confirm2) {
      setErrMsg("パスワードが一致しません。");
      return;
    }
    setSubmitting(true);
    const ok = await register(email, password, name);
    setSubmitting(false);
    if (ok) navigate("/");
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "新規登録 — SAP パンダ先生",
        description: "SAP パンダ先生 NAVI に無料登録。記事の保存、学習進度の記録、每日クイズの解答履歴、案件への応募が可能になります。",
        path: "/register",
        noindex: true
      }
    ),
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsx("main", { style: { position: "relative", zIndex: 2, minHeight: "60vh", display: "grid", placeItems: "center" }, children: /* @__PURE__ */ jsxs("div", { style: {
      background: "var(--bg-card)",
      borderRadius: "var(--r-xl)",
      border: "1px solid var(--line-2)",
      padding: "40px 48px",
      maxWidth: 420,
      width: "100%",
      margin: "40px 20px"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: 28 }, children: [
        /* @__PURE__ */ jsxs("svg", { width: "56", height: "56", viewBox: "-4 -8 108 108", style: { margin: "0 auto 12px", display: "block" }, children: [
          /* @__PURE__ */ jsx("circle", { cx: "50", cy: "52", r: "46", fill: "#d8ead9" }),
          /* @__PURE__ */ jsx("path", { d: "M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z", fill: "#fdfaf2" }),
          /* @__PURE__ */ jsxs("g", { children: [
            /* @__PURE__ */ jsx("path", { d: "M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z", fill: "#1a1612" }),
            /* @__PURE__ */ jsx("path", { d: "M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z", fill: "#1a1612" })
          ] }),
          /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "4", fill: "#fff" }),
          /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "2.8", fill: "#0e0a05" }),
          /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "4", fill: "#fff" }),
          /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "2.8", fill: "#0e0a05" }),
          /* @__PURE__ */ jsx("ellipse", { cx: "50", cy: "62", rx: "3.4", ry: "2.5", fill: "#1a1612" }),
          /* @__PURE__ */ jsx("path", { d: "M 40 67 Q 50 82 60 67 Q 50 70 40 67 Z", fill: "#1a1612" })
        ] }),
        /* @__PURE__ */ jsx("h1", { style: { fontFamily: "var(--font-display)", fontSize: 24, color: "var(--ink-0)", margin: 0 }, children: "新規登録" }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: "var(--ink-2)", marginTop: 8 }, children: "パンダ先生と一緒にSAPを学びましょう 🎋" })
      ] }),
      errMsg && /* @__PURE__ */ jsx("div", { style: { background: "var(--rose-soft)", color: "var(--rose)", padding: "10px 14px", borderRadius: "var(--r-md)", fontSize: 13, marginBottom: 16 }, children: errMsg }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, style: { display: "flex", flexDirection: "column", gap: 16 }, children: [
        /* @__PURE__ */ jsxs("label", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
          /* @__PURE__ */ jsx("span", { style: { fontSize: 12.5, fontWeight: 600, color: "var(--ink-0)" }, children: "お名前" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: name,
              onChange: (e) => setName(e.target.value),
              placeholder: "パンダ 太郎",
              required: true,
              style: inputStyle$1
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("label", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
          /* @__PURE__ */ jsx("span", { style: { fontSize: 12.5, fontWeight: 600, color: "var(--ink-0)" }, children: "メールアドレス" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: "you@example.com",
              required: true,
              style: inputStyle$1
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("label", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
          /* @__PURE__ */ jsxs("span", { style: { fontSize: 12.5, fontWeight: 600, color: "var(--ink-0)" }, children: [
            "パスワード ",
            /* @__PURE__ */ jsx("span", { style: { fontWeight: 400, color: "var(--ink-3)" }, children: "6文字以上" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              placeholder: "••••••••",
              required: true,
              minLength: 6,
              style: inputStyle$1
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("label", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
          /* @__PURE__ */ jsx("span", { style: { fontSize: 12.5, fontWeight: 600, color: "var(--ink-0)" }, children: "パスワード（確認）" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "password",
              value: confirm2,
              onChange: (e) => setConfirm(e.target.value),
              placeholder: "••••••••",
              required: true,
              style: {
                ...inputStyle$1,
                borderColor: confirm2 && password !== confirm2 ? "var(--rose)" : "var(--line-2)"
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: submitting,
            className: "btn accent",
            style: { width: "100%", justifyContent: "center", padding: 12, fontSize: 15 },
            children: submitting ? "登録中..." : "無料登録する"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { marginTop: 20, textAlign: "center", fontSize: 13, color: "var(--ink-2)" }, children: [
        "すでにアカウントをお持ちの方",
        /* @__PURE__ */ jsx(Link, { to: "/login", style: { color: "var(--accent-deep)", fontWeight: 600, marginLeft: 4 }, children: "ログイン" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
}
const inputStyle$1 = {
  padding: "10px 14px",
  border: "1.5px solid var(--line-2)",
  borderRadius: "var(--r-md)",
  fontSize: 14,
  outline: "none",
  fontFamily: "inherit"
};
function StatCard({ label, value, unit }) {
  return /* @__PURE__ */ jsxs("div", { style: {
    background: "var(--bg-card)",
    border: "1px solid var(--line-1)",
    borderRadius: "var(--r-lg)",
    padding: "18px 20px",
    textAlign: "center"
  }, children: [
    /* @__PURE__ */ jsxs("div", { style: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "var(--accent-deep)", lineHeight: 1 }, children: [
      value,
      /* @__PURE__ */ jsx("span", { style: { fontSize: 14, fontWeight: 500, color: "var(--ink-2)" }, children: unit })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { fontSize: 11.5, color: "var(--ink-3)", marginTop: 4, letterSpacing: "0.04em" }, children: label })
  ] });
}
function PointsHistory() {
  const [history, setHistory] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimMsg, setClaimMsg] = useState("");
  const [claimErr, setClaimErr] = useState(false);
  const fetchPoints = () => {
    api.getPoints().then((res) => {
      if (res.success) {
        setTotal(res.data.total);
        setHistory(res.data.history || []);
      }
    }).finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchPoints();
  }, []);
  async function claimDaily() {
    var _a;
    setClaiming(true);
    setClaimMsg("");
    try {
      const res = await api.claimDailyPoints();
      if (res.success) {
        setClaimMsg(((_a = res.data) == null ? void 0 : _a.message) || "10ポイント獲得！");
        setClaimErr(false);
        fetchPoints();
      } else {
        setClaimMsg(res.message || "本日は既に受取済みです。");
        setClaimErr(true);
      }
    } catch {
      setClaimMsg("エラーが発生しました。");
      setClaimErr(true);
    } finally {
      setClaiming(false);
      setTimeout(() => setClaimMsg(""), 3e3);
    }
  }
  return /* @__PURE__ */ jsxs("div", { style: { marginTop: 24 }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }, children: [
      /* @__PURE__ */ jsx("h3", { style: { fontFamily: "var(--font-display)", fontSize: 18, color: "var(--ink-0)", margin: 0 }, children: "獲得ポイント" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "btn sm",
          onClick: claimDaily,
          disabled: claiming,
          style: { fontSize: 12, whiteSpace: "nowrap" },
          children: claiming ? "受取中..." : "📅 デイリーボーナス"
        }
      )
    ] }),
    claimMsg && /* @__PURE__ */ jsx("div", { style: {
      padding: "6px 12px",
      borderRadius: "var(--r-sm)",
      fontSize: 12,
      marginBottom: 10,
      background: claimErr ? "var(--rose-soft)" : "var(--accent-soft)",
      color: claimErr ? "var(--rose)" : "var(--accent-deep)"
    }, children: claimMsg }),
    /* @__PURE__ */ jsxs("div", { style: { fontSize: 36, fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--ink-0)", marginBottom: 16 }, children: [
      total,
      /* @__PURE__ */ jsx("span", { style: { fontSize: 16, fontWeight: 500, color: "var(--ink-2)" }, children: " pt" })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { style: { color: "var(--ink-3)", fontSize: 13 }, children: "読み込み中..." }) : history.length === 0 ? /* @__PURE__ */ jsx("div", { style: { color: "var(--ink-3)", fontSize: 13 }, children: "まだポイント履歴がありません。" }) : /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: history.map((h, i) => {
      var _a;
      return /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "8px 12px",
        background: "var(--bg-1)",
        borderRadius: "var(--r-sm)",
        fontSize: 13
      }, children: [
        /* @__PURE__ */ jsxs("span", { style: {
          background: h.points > 0 ? "var(--accent-soft)" : "var(--bg-tint)",
          color: h.points > 0 ? "var(--accent-deep)" : "var(--ink-3)",
          fontWeight: 700,
          padding: "2px 8px",
          borderRadius: "var(--r-sm)",
          fontVariantNumeric: "tabular-nums",
          minWidth: 48,
          textAlign: "right"
        }, children: [
          h.points > 0 ? "+" : "",
          h.points
        ] }),
        /* @__PURE__ */ jsx("span", { style: { flex: 1, color: "var(--ink-1)" }, children: h.description }),
        /* @__PURE__ */ jsx("span", { style: { color: "var(--ink-3)", fontSize: 11 }, children: (_a = h.created_at) == null ? void 0 : _a.slice(0, 10) })
      ] }, i);
    }) })
  ] });
}
function ProfilePage() {
  var _a, _b, _c, _d, _e, _f, _g;
  const { user, loading, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);
  useEffect(() => {
    if (editing && user) {
      setName(user.displayName);
      setBio(user.description || "");
    }
  }, [editing, user]);
  if (loading || !user) return null;
  async function handleSave() {
    setSaving(true);
    const ok = await updateProfile({ displayName: name, description: bio });
    setSaving(false);
    if (ok) {
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2e3);
    }
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "プロフィール — SAP パンダ先生",
        description: "学習統計、進捗管理、設定変更。SAP パンダ先生 NAVI のプロフィールページ。",
        path: "/profile",
        noindex: true
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxs("main", { style: { position: "relative", zIndex: 2, maxWidth: 880, margin: "0 auto", padding: "40px 28px 80px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        background: "var(--bg-card)",
        borderRadius: "var(--r-xl)",
        border: "1px solid var(--line-1)",
        padding: "32px 36px",
        display: "flex",
        gap: 24,
        alignItems: "center",
        flexWrap: "wrap"
      }, children: [
        /* @__PURE__ */ jsx("div", { style: { position: "relative" }, children: /* @__PURE__ */ jsx(
          "img",
          {
            src: user.avatarUrl,
            alt: user.displayName,
            style: { width: 88, height: 88, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--accent-soft)" },
            onError: (e) => {
              e.target.style.display = "none";
            }
          }
        ) }),
        /* @__PURE__ */ jsx("div", { style: { flex: 1, minWidth: 200 }, children: !editing ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsx("h1", { style: { fontFamily: "var(--font-display)", fontSize: 26, color: "var(--ink-0)", margin: 0 }, children: user.displayName }),
            /* @__PURE__ */ jsx("span", { style: { fontSize: 11, padding: "2px 8px", borderRadius: "var(--r-pill)", background: "var(--accent-soft)", color: "var(--accent-deep)", fontWeight: 600, letterSpacing: "0.06em" }, children: ((_a = user.roles) == null ? void 0 : _a.includes("administrator")) ? "管理者" : ((_b = user.roles) == null ? void 0 : _b.includes("subscriber")) ? "メンバー" : "" })
          ] }),
          user.description && /* @__PURE__ */ jsx("p", { style: { fontSize: 13.5, color: "var(--ink-2)", margin: "8px 0 0", lineHeight: 1.7 }, children: user.description }),
          /* @__PURE__ */ jsxs("div", { style: { fontSize: 12, color: "var(--ink-3)", marginTop: 8 }, children: [
            "登録: ",
            user.memberSince,
            " · ",
            user.email
          ] })
        ] }) : /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              value: name,
              onChange: (e) => setName(e.target.value),
              placeholder: "表示名",
              style: inputStyle
            }
          ),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: bio,
              onChange: (e) => setBio(e.target.value),
              placeholder: "自己紹介",
              rows: 3,
              style: { ...inputStyle, resize: "vertical" }
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("div", { style: { marginLeft: "auto" }, children: !editing ? /* @__PURE__ */ jsx("button", { className: "btn sm", onClick: () => setEditing(true), children: "プロフィール編集" }) : /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8 }, children: [
          /* @__PURE__ */ jsx("button", { className: "btn sm ghost", onClick: () => setEditing(false), children: "キャンセル" }),
          /* @__PURE__ */ jsx("button", { className: "btn sm primary", onClick: handleSave, disabled: saving, children: saving ? "保存中..." : saved ? "✓ 保存完了" : "保存" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginTop: 24 }, children: [
        /* @__PURE__ */ jsx(StatCard, { label: "閲覧記事", value: ((_c = user.stats) == null ? void 0 : _c.articlesRead) || 0, unit: " 本" }),
        /* @__PURE__ */ jsx(StatCard, { label: "回答数", value: ((_d = user.stats) == null ? void 0 : _d.quizzesAnswered) || 0, unit: " 問" }),
        /* @__PURE__ */ jsx(StatCard, { label: "正解率", value: ((_e = user.stats) == null ? void 0 : _e.quizAccuracy) || 0, unit: "%" }),
        /* @__PURE__ */ jsx(StatCard, { label: "ブックマーク", value: ((_f = user.stats) == null ? void 0 : _f.bookmarks) || 0, unit: " 件" })
      ] }),
      /* @__PURE__ */ jsx(PointsHistory, {}),
      /* @__PURE__ */ jsxs("div", { style: { marginTop: 24, padding: "18px 20px", background: "var(--bg-card)", border: "1px solid var(--line-1)", borderRadius: "var(--r-lg)" }, children: [
        /* @__PURE__ */ jsx("h3", { style: { fontFamily: "var(--font-display)", fontSize: 16, color: "var(--ink-0)", margin: "0 0 8px" }, children: "📑 保存した記事" }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: "var(--ink-2)", margin: 0 }, children: ((_g = user.stats) == null ? void 0 : _g.bookmarks) ? `${user.stats.bookmarks} 件の記事を保存しています。` : "まだ記事を保存していません。" })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { marginTop: 32, textAlign: "center" }, children: /* @__PURE__ */ jsx(
        "button",
        {
          className: "btn",
          style: { color: "var(--rose)", borderColor: "var(--rose-soft)" },
          onClick: () => {
            api.logout();
            window.location.href = p("/");
          },
          children: "ログアウト"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
}
const inputStyle = {
  padding: "8px 12px",
  border: "1.5px solid var(--line-2)",
  borderRadius: "var(--r-md)",
  fontSize: 13.5,
  outline: "none",
  fontFamily: "inherit",
  width: "100%",
  background: "var(--bg-1)"
};
function MembershipPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    Promise.all([
      api.getMembershipPlans(),
      user ? api.getCurrentMembership().catch(() => ({ data: null })) : Promise.resolve({ data: null })
    ]).then(([plansRes, currentRes]) => {
      if (plansRes.success) setPlans(plansRes.data);
      if (currentRes == null ? void 0 : currentRes.data) setCurrent(currentRes.data);
    }).finally(() => setLoading(false));
  }, [user]);
  async function subscribe(planId) {
    var _a;
    if (!user) {
      setErr("ログインが必要です。");
      return;
    }
    setSubscribing(planId);
    setErr("");
    try {
      const res = await api.subscribeMembership(planId);
      if (res.success) {
        if (res.data.checkout_url) {
          window.location.href = res.data.checkout_url;
        } else {
          setCurrent({
            plan_id: planId,
            plan_name: ((_a = plans.find((p2) => p2.id === planId)) == null ? void 0 : _a.name) || "",
            status: "active",
            expires: res.data.expires
          });
        }
      } else {
        setErr(res.message || "登録に失敗しました。");
      }
    } catch {
      setErr("サーバーエラーが発生しました。");
    } finally {
      setSubscribing(null);
    }
  }
  const isCurrentPlan = (planId) => (current == null ? void 0 : current.status) === "active" && current.plan_id === planId;
  const intervalLabel = (i) => i === "year" ? "年額" : "月額";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "会員プラン — SAP パンダ先生",
        description: "SAP パンダ先生 NAVI の会員プラン一覧。プレミアムプランでは AI 質問機能、非公開案件アクセス、学習進度詳細レポートが利用可能。",
        path: "/membership"
      }
    ),
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxs("main", { style: { position: "relative", zIndex: 2, maxWidth: 960, margin: "0 auto", padding: "40px 28px 80px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: 36 }, children: [
        /* @__PURE__ */ jsxs("h1", { style: { fontFamily: "var(--font-display)", fontSize: 32, color: "var(--ink-0)", margin: "0 0 8px" }, children: [
          "会員プラン",
          /* @__PURE__ */ jsx("span", { className: "accent-mark", children: "." })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 14, color: "var(--ink-2)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }, children: "パンダ先生の全コンテンツにアクセス。AI アシスタントや修了証など、 プレミアム機能をすべてお使いいただけます。" })
      ] }),
      err && /* @__PURE__ */ jsx("div", { style: {
        background: "var(--rose-soft)",
        color: "var(--rose)",
        padding: "10px 14px",
        borderRadius: "var(--r-md)",
        fontSize: 13,
        marginBottom: 16,
        textAlign: "center"
      }, children: err }),
      (current == null ? void 0 : current.status) === "active" && !subscribing && /* @__PURE__ */ jsxs("div", { style: {
        background: "var(--accent-soft)",
        border: "1px solid var(--accent)",
        borderRadius: "var(--r-lg)",
        padding: "14px 20px",
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontSize: 13,
        color: "var(--accent-deep)"
      }, children: [
        /* @__PURE__ */ jsx("span", { style: { fontSize: 20 }, children: "🎋" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("strong", { children: current.plan_name }),
          " にご登録済みです。",
          current.expires && /* @__PURE__ */ jsxs(Fragment, { children: [
            " 有効期限: ",
            current.expires.slice(0, 10)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, alignItems: "start" }, children: loading ? /* @__PURE__ */ jsx("div", { style: { textAlign: "center", gridColumn: "1/-1", color: "var(--ink-3)" }, children: "読み込み中..." }) : plans.length === 0 ? /* @__PURE__ */ jsx("div", { style: { textAlign: "center", gridColumn: "1/-1", color: "var(--ink-3)" }, children: "プランがありません。" }) : plans.map((plan) => {
        const isActive = isCurrentPlan(plan.id);
        return /* @__PURE__ */ jsxs("div", { style: {
          background: "var(--bg-card)",
          borderRadius: "var(--r-xl)",
          border: isActive ? "2px solid var(--accent-deep)" : plan.popular ? "2px solid var(--accent)" : "1px solid var(--line-2)",
          padding: "28px 24px",
          position: "relative",
          boxShadow: isActive ? "var(--sh-soft)" : plan.popular ? "var(--sh-soft)" : "none"
        }, children: [
          isActive && /* @__PURE__ */ jsx("span", { style: {
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--accent-deep)",
            color: "white",
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "4px 14px",
            borderRadius: "var(--r-pill)"
          }, children: "契約中" }),
          !isActive && plan.popular && /* @__PURE__ */ jsx("span", { style: {
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--accent)",
            color: "white",
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "4px 14px",
            borderRadius: "var(--r-pill)"
          }, children: "おすすめ" }),
          /* @__PURE__ */ jsx("h3", { style: { fontFamily: "var(--font-display)", fontSize: 20, color: "var(--ink-0)", margin: "0 0 4px" }, children: plan.name }),
          plan.description && /* @__PURE__ */ jsx("p", { style: { fontSize: 12.5, color: "var(--ink-2)", margin: "0 0 16px", lineHeight: 1.6 }, children: plan.description }),
          /* @__PURE__ */ jsxs("div", { style: { marginBottom: 20 }, children: [
            /* @__PURE__ */ jsxs("span", { style: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 36, color: "var(--ink-0)" }, children: [
              "¥",
              plan.price.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxs("span", { style: { fontSize: 13, color: "var(--ink-2)", marginLeft: 4 }, children: [
              "/",
              intervalLabel(plan.interval)
            ] })
          ] }),
          /* @__PURE__ */ jsx("ul", { style: { listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 8 }, children: plan.features.map((f, i) => /* @__PURE__ */ jsxs("li", { style: { fontSize: 13, color: "var(--ink-1)", display: "flex", alignItems: "center", gap: 8 }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "var(--accent)" }, children: "✓" }),
            " ",
            f
          ] }, i)) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `btn ${isActive ? "ghost" : plan.popular ? "accent" : ""}`,
              style: { width: "100%", justifyContent: "center" },
              onClick: () => subscribe(plan.id),
              disabled: subscribing === plan.id || isActive,
              children: isActive ? "✓ 登録済み" : subscribing === plan.id ? "処理中..." : "このプランに登録"
            }
          )
        ] }, plan.id);
      }) })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
}
function CasesPage() {
  const { settings } = useTheme();
  const [allCases, setAllCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [applyFor, setApplyFor] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    api.getCases({ per_page: 200 }).then((res) => {
      if (res.success) setAllCases(res.data);
    }).finally(() => setLoading(false));
  }, [refreshKey]);
  useEffect(() => {
    document.body.style.overflow = detail || applyFor ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [detail, applyFor]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "SAP 案件・求人情報",
        description: "SAP コンサルタント・SAP エンジニアの案件情報。FI/CO/MM/SD/ABAP などモジュール別に検索可能。SAP パンダ先生 NAVI の案件マッチングで、あなたに合った SAP 案件を見つけよう。",
        path: "/cases"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, { active: "cases" }),
    /* @__PURE__ */ jsxs("main", { style: { position: "relative", zIndex: 2 }, children: [
      /* @__PURE__ */ jsx(CaseTicker, { cases: allCases, onOpen: setDetail }),
      /* @__PURE__ */ jsx(
        CasesSection,
        {
          allCases,
          loading,
          onOpen: setDetail
        }
      ),
      /* @__PURE__ */ jsx(FreelanceWorries, {})
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {}),
    settings.showFloatingPanda && /* @__PURE__ */ jsx(FloatingPanda, {}),
    detail && /* @__PURE__ */ jsx(
      CaseDetailModal,
      {
        c: detail,
        onClose: () => setDetail(null),
        onApply: (c) => {
          setDetail(null);
          setApplyFor(c);
        }
      }
    ),
    applyFor && /* @__PURE__ */ jsx(ApplyForm, { c: applyFor, onClose: () => setApplyFor(null) })
  ] });
}
function ModulesPage() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const { settings } = useTheme();
  useEffect(() => {
    api.getModules().then((res) => {
      if (res.success && res.data) setModules(res.data);
    }).catch(() => {
    }).finally(() => setLoading(false));
  }, []);
  const filtered = modules.filter((m) => {
    const matchSearch = !search || m.name_ja.includes(search) || m.name_en.toLowerCase().includes(search.toLowerCase()) || m.code.toLowerCase().includes(search.toLowerCase());
    const matchLevel = filterLevel === "all" || m.levels.includes(filterLevel);
    return matchSearch && matchLevel;
  });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "SAP モジュール一覧",
        description: "SAP の全 9 モジュールを解説。FI(財務会計)・CO(管理会計)・MM(購買管理)・SD(販売管理)・PP(生産計画)・HR(人事)・ABAP(開発)・Basis(基盤)・S/4HANA。初心者向け入門記事から上級者向けテクニックまで、モジュール別に学べる SAP 知識サイト。",
        path: "/modules"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, { active: "modules" }),
    /* @__PURE__ */ jsx("main", { style: { position: "relative", zIndex: 2 }, children: /* @__PURE__ */ jsxs("section", { className: "section", id: "modules-page", children: [
      /* @__PURE__ */ jsxs("div", { className: "section-head", style: { marginBottom: 20 }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "label", children: "Module Guide" }),
          /* @__PURE__ */ jsxs("h2", { children: [
            "モジュール一覧",
            /* @__PURE__ */ jsx("span", { className: "accent-mark", children: "." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "desc", children: [
          "SAP の 9 大モジュールを網羅。",
          /* @__PURE__ */ jsx("br", {}),
          "気になるモジュールから始めよう。"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        gap: 12,
        marginBottom: 24,
        flexWrap: "wrap",
        alignItems: "center"
      }, children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "モジュール名・キーワードで検索...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            style: {
              flex: 1,
              minWidth: 240,
              padding: "10px 14px",
              border: "1.5px solid var(--line-2)",
              borderRadius: "var(--r-pill)",
              fontSize: 13.5,
              fontFamily: "inherit",
              background: "var(--bg-card)",
              outline: "none"
            },
            onFocus: (e) => e.target.style.borderColor = "var(--accent)",
            onBlur: (e) => e.target.style.borderColor = "var(--line-2)"
          }
        ),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 4 }, children: [
          { id: "all", label: "すべて" },
          { id: "初級", label: "初級" },
          { id: "中級", label: "中級" },
          { id: "上級", label: "上級" }
        ].map((l) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setFilterLevel(l.id),
            style: {
              padding: "6px 14px",
              borderRadius: "var(--r-pill)",
              border: "1.5px solid var(--line-2)",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "inherit",
              background: filterLevel === l.id ? "var(--accent)" : "var(--bg-card)",
              color: filterLevel === l.id ? "#fff" : "var(--ink-1)",
              transition: "all .15s"
            },
            children: l.label
          },
          l.id
        )) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "module-grid", children: filtered.length === 0 ? /* @__PURE__ */ jsx("div", { style: { gridColumn: "1/-1", textAlign: "center", padding: 60, color: "var(--ink-3)" }, children: "該当するモジュールが見つかりませんでした。" }) : filtered.map((m) => /* @__PURE__ */ jsxs(
        Link,
        {
          to: `/category/${m.slug}`,
          className: "mod-card",
          style: { "--card-color": m.color, "--card-bg": m.bg_color },
          children: [
            /* @__PURE__ */ jsx("div", { className: "mod-top", children: /* @__PURE__ */ jsx("div", { className: "mod-icon", children: m.code }) }),
            /* @__PURE__ */ jsx("div", { className: "mod-name-ja", children: m.name_ja }),
            /* @__PURE__ */ jsx("div", { className: "mod-code", children: m.name_en }),
            /* @__PURE__ */ jsx("div", { className: "mod-desc", children: m.description }),
            /* @__PURE__ */ jsxs("div", { className: "mod-foot", children: [
              /* @__PURE__ */ jsxs("span", { className: "count", children: [
                m.article_count,
                "本"
              ] }),
              /* @__PURE__ */ jsx("span", { children: "の記事" }),
              /* @__PURE__ */ jsx("div", { className: "level-tags", children: m.levels.map((lv, j) => /* @__PURE__ */ jsx("span", { className: `level-pill l${j + 1}`, children: lv }, j)) })
            ] })
          ]
        },
        m.code
      )) })
    ] }) }),
    /* @__PURE__ */ jsx(SiteFooter, {}),
    settings.showFloatingPanda && /* @__PURE__ */ jsx(FloatingPanda, {})
  ] });
}
const MAX_STEPS = 6;
const ACCENTS = ["#5a9d6e", "#d97548", "#d96570", "#3b82f6", "#8b5cf6", "#ec4899"];
function PathHero({ paths }) {
  const total = paths.length;
  return /* @__PURE__ */ jsx("section", { style: { background: "linear-gradient(135deg, var(--accent-soft) 0%, var(--bg-1) 100%)", padding: "48px 28px 40px", borderBottom: "1px solid var(--line-1)" }, children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: 1280, margin: "0 auto" }, children: [
    /* @__PURE__ */ jsxs("div", { className: "crumb", style: { marginBottom: 16 }, children: [
      /* @__PURE__ */ jsx(Link, { to: "/", style: { color: "var(--ink-2)" }, children: "ホーム" }),
      /* @__PURE__ */ jsx("span", { className: "sep", children: " › " }),
      /* @__PURE__ */ jsx("span", { style: { color: "var(--ink-0)", fontWeight: 600 }, children: "学習パス" })
    ] }),
    /* @__PURE__ */ jsxs("h1", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(28px, 3.5vw, 42px)", color: "var(--ink-0)", margin: "0 0 8px" }, children: [
      "あなたに合わせた学習パス",
      /* @__PURE__ */ jsx("span", { className: "accent-mark", children: "." })
    ] }),
    /* @__PURE__ */ jsx("p", { style: { fontSize: 15, color: "var(--ink-2)", lineHeight: 1.8, maxWidth: 560 }, children: "目的別コースで順番に学べば自然と SAP がわかる。" }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 28, marginTop: 20 }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { style: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: "var(--accent-deep)" }, children: total }),
        /* @__PURE__ */ jsx("span", { style: { fontSize: 12, color: "var(--ink-2)", marginLeft: 4 }, children: "パス" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { style: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: "var(--accent-deep)" }, children: paths.reduce((s, p2) => {
          var _a;
          return s + (((_a = p2.steps) == null ? void 0 : _a.length) || 0);
        }, 0) }),
        /* @__PURE__ */ jsx("span", { style: { fontSize: 12, color: "var(--ink-2)", marginLeft: 4 }, children: "ステップ" })
      ] })
    ] })
  ] }) });
}
function StepRow({ step, accent, index }) {
  var _a, _b, _c, _d, _e, _f;
  const itemCount = (((_a = step.courses) == null ? void 0 : _a.length) || 0) + (((_b = step.knowledge) == null ? void 0 : _b.length) || 0) + (((_c = step.articles) == null ? void 0 : _c.length) || 0);
  return /* @__PURE__ */ jsx(Link, { to: step.id ? `/step/${step.id}` : "#", style: { textDecoration: "none", display: "block" }, children: /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 12px",
        borderRadius: "var(--r-md)",
        transition: "all .12s",
        background: "var(--bg-1)",
        border: "1px solid var(--line-1)",
        cursor: "pointer"
      },
      onMouseEnter: (e) => e.currentTarget.style.borderColor = accent,
      onMouseLeave: (e) => e.currentTarget.style.borderColor = "var(--line-1)",
      children: [
        /* @__PURE__ */ jsx("span", { style: {
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: accent,
          color: "white",
          fontSize: 10,
          fontWeight: 700,
          display: "grid",
          placeItems: "center",
          flexShrink: 0
        }, children: index + 1 }),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: 13, fontWeight: 500, color: "var(--ink-0)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: step.title }),
          itemCount > 0 && /* @__PURE__ */ jsxs("div", { style: { fontSize: 10.5, color: "var(--ink-3)", marginTop: 1 }, children: [
            "📚",
            ((_d = step.courses) == null ? void 0 : _d.length) || 0,
            " 📖",
            ((_e = step.knowledge) == null ? void 0 : _e.length) || 0,
            " 📰",
            ((_f = step.articles) == null ? void 0 : _f.length) || 0
          ] })
        ] }),
        step.time && /* @__PURE__ */ jsx("span", { style: { fontSize: 10.5, color: "var(--ink-3)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }, children: step.time }),
        /* @__PURE__ */ jsx("span", { style: { fontSize: 14, color: accent, flexShrink: 0 }, children: "→" })
      ]
    }
  ) });
}
function PathCard({ path, index }) {
  const accent = path.accent || ACCENTS[index % ACCENTS.length];
  const steps = (path.steps || []).slice(0, MAX_STEPS);
  return /* @__PURE__ */ jsxs("div", { style: { background: "var(--bg-card)", border: "1px solid var(--line-1)", borderRadius: "var(--r-xl)", overflow: "hidden", boxShadow: "var(--sh-1)", display: "flex", flexDirection: "column" }, children: [
    /* @__PURE__ */ jsx("div", { style: { height: 4, background: `linear-gradient(90deg, ${accent}, ${accent}88)` } }),
    /* @__PURE__ */ jsxs("div", { style: { padding: "22px 22px 20px", flex: 1, display: "flex", flexDirection: "column" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }, children: [
        /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ jsx("span", { style: { fontSize: 10.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: accent }, children: path.audience }),
          /* @__PURE__ */ jsx("h2", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-0)", margin: "4px 0 0", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }, children: path.title })
        ] }),
        /* @__PURE__ */ jsx("span", { style: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 40, lineHeight: 0.85, color: "transparent", WebkitTextStroke: `2px ${accent}`, whiteSpace: "nowrap", flexShrink: 0 }, children: String(index + 1).padStart(2, "0") })
      ] }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7, margin: "10px 0 14px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", wordBreak: "break-word" }, children: path.description }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 14, flex: 1 }, children: [
        steps.map((s, j) => /* @__PURE__ */ jsx(StepRow, { step: s, accent, index: j }, j)),
        (path.steps || []).length > MAX_STEPS && /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", fontSize: 11, color: "var(--ink-3)", padding: 4 }, children: [
          "+ ",
          (path.steps || []).length - MAX_STEPS,
          " ステップ"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", paddingTop: 12, borderTop: "1px dashed var(--line-2)", marginTop: "auto" }, children: [
        /* @__PURE__ */ jsxs("span", { style: { fontSize: 11.5, color: "var(--ink-3)" }, children: [
          "⏱ ",
          path.duration
        ] }),
        /* @__PURE__ */ jsxs("span", { style: { fontSize: 11.5, color: "var(--ink-3)" }, children: [
          "🎯 ",
          (path.steps || []).length,
          "ステップ"
        ] }),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: `/learning/${path.id}`,
            style: { marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 14px", borderRadius: "var(--r-pill)", background: accent, color: "white", fontSize: 12, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" },
            onMouseEnter: (e) => e.currentTarget.style.opacity = "0.85",
            onMouseLeave: (e) => e.currentTarget.style.opacity = "1",
            children: "開始 →"
          }
        )
      ] })
    ] })
  ] });
}
function ModuleGrid() {
  const [modules, setModules] = useState([]);
  useEffect(() => {
    api.getModules().then((r) => {
      if (r.success) setModules(r.data);
    }).catch(() => {
    });
  }, []);
  if (!modules.length) return null;
  return /* @__PURE__ */ jsxs("section", { className: "section", children: [
    /* @__PURE__ */ jsxs("div", { className: "section-head", style: { marginBottom: 20 }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "label", children: "Module Paths" }),
        /* @__PURE__ */ jsxs("h2", { children: [
          "モジュールから探す",
          /* @__PURE__ */ jsx("span", { className: "accent-mark", children: "." })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "desc", children: "気になるモジュールの記事一覧へ" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "module-grid", children: modules.slice(0, 9).map((m) => /* @__PURE__ */ jsxs(Link, { to: `/category/${m.slug}`, className: "mod-card", style: { "--card-color": m.color, "--card-bg": m.bg_color }, children: [
      /* @__PURE__ */ jsx("div", { className: "mod-top", children: /* @__PURE__ */ jsx("div", { className: "mod-icon", children: m.code }) }),
      /* @__PURE__ */ jsx("div", { className: "mod-name-ja", children: m.name_ja }),
      /* @__PURE__ */ jsx("div", { className: "mod-code", children: m.name_en }),
      /* @__PURE__ */ jsx("div", { className: "mod-desc", children: m.description }),
      /* @__PURE__ */ jsxs("div", { className: "mod-foot", children: [
        /* @__PURE__ */ jsxs("span", { className: "count", children: [
          m.article_count,
          "本"
        ] }),
        /* @__PURE__ */ jsx("span", { children: "の記事" }),
        /* @__PURE__ */ jsx("div", { className: "level-tags", children: m.levels.map((lv, j) => /* @__PURE__ */ jsx("span", { className: `level-pill l${j + 1}`, children: lv }, j)) })
      ] })
    ] }, m.slug)) })
  ] });
}
function PathsPage() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const { settings } = useTheme();
  useEffect(() => {
    api.getLearningPaths().then((res) => {
      if (res.success && res.data) {
        const valid = res.data.filter((p2) => {
          var _a;
          return ((_a = p2.steps) == null ? void 0 : _a.length) > 0;
        });
        setPaths(valid.length > 0 ? valid : res.data.slice(-6));
      }
    }).catch(() => {
    }).finally(() => setLoading(false));
  }, []);
  const audiences = ["all", ...new Set(paths.map((p2) => p2.audience).filter(Boolean))];
  const filtered = activeFilter === "all" ? paths : paths.filter((p2) => p2.audience === activeFilter);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "SAP 学習パス一覧",
        description: "目的別に組まれた SAP 学習パス。新人向け入門コース、コンサル中級向け設計力、ABAP/S/4HANA モダン開発 — あなたに合わせた学習ロードマップで SAP をマスター。",
        path: "/paths",
        breadcrumbs: [{ name: "ホーム", path: "/" }, { name: "学習パス", path: "/paths" }]
      }
    ),
    /* @__PURE__ */ jsx(SiteHeader, { active: "paths" }),
    /* @__PURE__ */ jsxs("main", { style: { position: "relative", zIndex: 2 }, children: [
      /* @__PURE__ */ jsx(PathHero, { paths }),
      /* @__PURE__ */ jsx("section", { className: "section", style: { paddingTop: 28, paddingBottom: 0 }, children: /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }, children: audiences.map((a) => /* @__PURE__ */ jsx("button", { onClick: () => setActiveFilter(a), style: { padding: "7px 18px", borderRadius: "var(--r-pill)", border: "1.5px solid", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, borderColor: activeFilter === a ? "var(--accent)" : "var(--line-2)", background: activeFilter === a ? "var(--accent-soft)" : "var(--bg-card)", color: activeFilter === a ? "var(--accent-deep)" : "var(--ink-1)" }, children: a === "all" ? "すべて" : a }, a)) }) }),
      /* @__PURE__ */ jsx("section", { className: "section", style: { paddingTop: 0 }, children: loading ? /* @__PURE__ */ jsx("div", { style: { textAlign: "center", padding: 80, color: "var(--ink-3)" }, children: "読み込み中..." }) : filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", padding: 80, color: "var(--ink-3)" }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: 48, marginBottom: 12 }, children: "🎋" }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: 16, fontWeight: 700, color: "var(--ink-0)", marginBottom: 6 }, children: "まだ学習パスがありません" }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: 13 }, children: "準備中です。お楽しみに！" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "path-grid", style: { alignItems: "start" }, children: filtered.map((p2, i) => /* @__PURE__ */ jsx(PathCard, { path: p2, index: i }, p2.id)) }) }),
      /* @__PURE__ */ jsx(ModuleGrid, {})
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {}),
    settings.showFloatingPanda && /* @__PURE__ */ jsx(FloatingPanda, {})
  ] });
}
function QuizPage() {
  const { settings } = useTheme();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "SAP 每日一問",
        description: "SAP 学習者のための每日一問クイズ。FI/CO/MM/SD/ABAP/S/4HANA など各モジュールから出題。パンダ先生の解説付きで、空き時間に SAP 力をアップ。",
        path: "/quiz-page"
      }
    ),
    /* @__PURE__ */ jsx(SiteHeader, { active: "quiz" }),
    /* @__PURE__ */ jsx("main", { style: { position: "relative", zIndex: 2 }, children: /* @__PURE__ */ jsx("div", { style: { paddingTop: 20 }, children: /* @__PURE__ */ jsx(QuizCard, {}) }) }),
    /* @__PURE__ */ jsx(SiteFooter, {}),
    settings.showFloatingPanda && /* @__PURE__ */ jsx(FloatingPanda, {})
  ] });
}
function LearningPage() {
  const { id } = useParams();
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const { settings } = useTheme();
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getLearningPath(parseInt(id)).then((res) => {
      if (res.success) setPath(res.data);
    }).catch(() => {
    }).finally(() => setLoading(false));
  }, [id]);
  if (loading) return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Seo, { title: "学習パスを読み込み中", description: "SAP 学習パスの詳細を読み込み中です。", path: `/learning/${id}` }),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsx("main", { style: { textAlign: "center", padding: 80, color: "var(--ink-3)" }, children: "読み込み中..." }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
  if (!path) return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Seo, { title: "学習パスが見つかりません", description: "お探しの学習パスは存在しないか、削除されました。", path: "/learning/" + String(id) }),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxs("main", { style: { textAlign: "center", padding: 80 }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontSize: 48, marginBottom: 12 }, children: "🎋" }),
      /* @__PURE__ */ jsx("h2", { style: { fontFamily: "var(--font-display)", fontSize: 22, color: "var(--ink-0)" }, children: "学習パスが見つかりません" }),
      /* @__PURE__ */ jsx(Link, { to: "/paths", className: "btn", style: { marginTop: 20, display: "inline-flex", textDecoration: "none" }, children: "一覧に戻る" })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
  const accent = path.accent || "#5a9d6e";
  const pathTitle = (path == null ? void 0 : path.title) || "";
  const pathDesc = (path == null ? void 0 : path.description) || "";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: `${pathTitle} — SAP学習パス`,
        description: pathDesc || `SAP 学習パス「${pathTitle}」。${path.duration || ""}・${(path.steps || []).length}ステップ。`,
        path: "/learning/" + String(id),
        breadcrumbs: [
          { name: "ホーム", path: "/" },
          { name: "学習パス", path: "/paths" },
          { name: pathTitle, path: "/learning/" + String(id) }
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxs("main", { style: { position: "relative", zIndex: 2 }, children: [
      /* @__PURE__ */ jsx("section", { style: { background: `linear-gradient(135deg, ${accent}22, var(--bg-1) 60%)`, padding: "40px 28px", borderBottom: "1px solid var(--line-1)" }, children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: 880, margin: "0 auto" }, children: [
        /* @__PURE__ */ jsxs("div", { className: "crumb", style: { marginBottom: 12 }, children: [
          /* @__PURE__ */ jsx(Link, { to: "/", style: { color: "var(--ink-2)" }, children: "ホーム" }),
          /* @__PURE__ */ jsx("span", { className: "sep", children: " › " }),
          /* @__PURE__ */ jsx(Link, { to: "/paths", style: { color: "var(--ink-2)" }, children: "学習パス" }),
          /* @__PURE__ */ jsx("span", { className: "sep", children: " › " }),
          /* @__PURE__ */ jsx("span", { style: { color: "var(--ink-0)", fontWeight: 600 }, children: path.title })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }, children: /* @__PURE__ */ jsx("span", { style: { fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: accent }, children: path.audience }) }),
        /* @__PURE__ */ jsx("h1", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(26px, 3vw, 36px)", color: "var(--ink-0)", margin: "0 0 8px" }, children: path.title }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 14.5, color: "var(--ink-2)", lineHeight: 1.8, maxWidth: 600 }, children: path.description }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 20, marginTop: 16 }, children: [
          /* @__PURE__ */ jsxs("span", { style: { fontSize: 13, color: "var(--ink-2)" }, children: [
            "⏱ ",
            path.duration
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { fontSize: 13, color: "var(--ink-2)" }, children: [
            "📄 ",
            path.article_count,
            "記事"
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { fontSize: 13, color: "var(--ink-2)" }, children: [
            "🎯 ",
            (path.steps || []).length,
            "ステップ"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { style: { maxWidth: 880, margin: "0 auto", padding: "32px 28px 64px", display: "grid", gridTemplateColumns: "1fr 280px", gap: 40 }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h2", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-0)", margin: "0 0 20px" }, children: [
            "学習ステップ ",
            /* @__PURE__ */ jsxs("span", { style: { fontSize: 14, color: "var(--ink-3)", fontWeight: 500 }, children: [
              "全",
              (path.steps || []).length,
              "ステップ"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: (path.steps || []).map((s, i) => {
            var _a, _b, _c;
            return /* @__PURE__ */ jsxs(
              Link,
              {
                to: `/step/${s.id}`,
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 18px",
                  borderRadius: "var(--r-lg)",
                  border: `1.5px solid ${i === currentStep ? accent : "var(--line-1)"}`,
                  background: i === currentStep ? `${accent}0a` : "var(--bg-card)",
                  cursor: "pointer",
                  transition: "all .15s",
                  textDecoration: "none"
                },
                onMouseEnter: (e) => {
                  if (i !== currentStep) e.currentTarget.style.borderColor = accent;
                },
                onMouseLeave: (e) => {
                  if (i !== currentStep) e.currentTarget.style.borderColor = "var(--line-1)";
                },
                children: [
                  /* @__PURE__ */ jsx("span", { style: {
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: i === currentStep ? accent : "var(--bg-tint)",
                    color: i === currentStep ? "white" : "var(--ink-2)",
                    fontSize: 13,
                    fontWeight: 700,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0
                  }, children: i + 1 }),
                  /* @__PURE__ */ jsxs("div", { style: { flex: 1 }, children: [
                    /* @__PURE__ */ jsx("div", { style: { fontSize: 14.5, fontWeight: 600, color: "var(--ink-0)" }, children: s.title }),
                    /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 10, marginTop: 3, fontSize: 11.5 }, children: [
                      (((_a = s.courses) == null ? void 0 : _a.length) || 0) > 0 && /* @__PURE__ */ jsxs("span", { style: { color: "#5a9d6e" }, children: [
                        "📚 ",
                        (s.courses || []).length
                      ] }),
                      (((_b = s.knowledge) == null ? void 0 : _b.length) || 0) > 0 && /* @__PURE__ */ jsxs("span", { style: { color: "#3b82f6" }, children: [
                        "📖 ",
                        (s.knowledge || []).length
                      ] }),
                      (((_c = s.articles) == null ? void 0 : _c.length) || 0) > 0 && /* @__PURE__ */ jsxs("span", { style: { color: "#8b5cf6" }, children: [
                        "📰 ",
                        (s.articles || []).length
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", whiteSpace: "nowrap" }, children: s.time }),
                  /* @__PURE__ */ jsx("span", { style: { fontSize: 18, color: "var(--accent)" }, children: "→" })
                ]
              },
              i
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxs("aside", { style: { position: "sticky", top: 80, alignSelf: "start" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { background: "var(--bg-card)", borderRadius: "var(--r-lg)", border: "1px solid var(--line-1)", padding: "18px 20px", marginBottom: 14 }, children: [
            /* @__PURE__ */ jsx("h5", { style: { fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: accent, margin: "0 0 12px" }, children: "📚 関連記事" }),
            !path.related_articles || path.related_articles.length === 0 ? /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: "var(--ink-3)" }, children: "関連記事がまだ設定されていません。" }) : /* @__PURE__ */ jsx("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }, children: path.related_articles.map((a) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: `/article/${a.id}/${a.slug}`, style: { fontSize: 13, color: "var(--ink-1)", textDecoration: "none", lineHeight: 1.5, display: "block", padding: "6px 10px", borderRadius: "var(--r-sm)", background: "var(--bg-1)" }, children: a.title }) }, a.id)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { background: "var(--bg-card)", borderRadius: "var(--r-lg)", border: "1px solid var(--line-1)", padding: "18px 20px", marginBottom: 14 }, children: [
            /* @__PURE__ */ jsx("h5", { style: { fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700, color: "var(--ink-0)", margin: "0 0 10px" }, children: "🎯 学習状況" }),
            /* @__PURE__ */ jsx("div", { style: { height: 6, background: "var(--bg-tint)", borderRadius: 3, overflow: "hidden", marginBottom: 8 }, children: /* @__PURE__ */ jsx("div", { style: { height: "100%", background: accent, borderRadius: 3, width: "0%" } }) }),
            /* @__PURE__ */ jsxs("div", { style: { fontSize: 12, color: "var(--ink-2)" }, children: [
              (path.steps || []).length,
              " ステップ"
            ] })
          ] }),
          /* @__PURE__ */ jsx(Link, { to: "/paths", className: "btn sm", style: { width: "100%", justifyContent: "center", textDecoration: "none" }, children: "← 一覧に戻る" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {}),
    settings.showFloatingPanda && /* @__PURE__ */ jsx(FloatingPanda, {})
  ] });
}
function extractToc$3(html) {
  const toc = [];
  const regex = /<h([23])(?:\s[^>]*)?>(.+?)<\/h\1>/gi;
  let match = null;
  let index = 0;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const label = match[2].replace(/<[^>]+>/g, "").trim();
    if (label) {
      const id = `step-heading-${index++}`;
      toc.push({ id, label, level });
    }
  }
  return toc;
}
const TYPE_UI = {
  courses: { label: "コース", color: "#5a9d6e", icon: "📚", linkPrefix: "/course/" },
  knowledge: { label: "ナレッジ", color: "#3b82f6", icon: "📖", linkPrefix: "/knowledge/" },
  articles: { label: "記事", color: "#8b5cf6", icon: "📰", linkPrefix: "/article/" }
};
function StepPage() {
  const { id } = useParams();
  const [step, setStep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeToc, setActiveToc] = useState("");
  const { settings } = useTheme();
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getStep(parseInt(id)).then((res) => {
      if (res.success) setStep(res.data);
    }).catch(() => {
    }).finally(() => setLoading(false));
  }, [id]);
  const htmlContent = (step == null ? void 0 : step.content) || "";
  const tocItems = useMemo(() => extractToc$3(htmlContent), [htmlContent]);
  const contentWithIds = useMemo(() => {
    let idx = 0;
    return htmlContent.replace(/<h([23])(\s[^>]*)?>/gi, (_m, level, attrs) => {
      const id2 = `step-heading-${idx++}`;
      return `<h${level}${attrs || ""} id="${id2}">`;
    });
  }, [htmlContent]);
  useEffect(() => {
    if (tocItems.length === 0) return;
    const onScroll = () => {
      const viewTop = window.scrollY + 160;
      let active = tocItems[0].id;
      for (const t of tocItems) {
        const el = document.getElementById(t.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= viewTop) active = t.id;
        }
      }
      setActiveToc(active);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [tocItems]);
  const pathItems = (step == null ? void 0 : step.path_items) || {};
  const contentGroups = useMemo(() => {
    const groups = [];
    for (const [key, ui] of Object.entries(TYPE_UI)) {
      const items = pathItems[key] || [];
      if (items.length > 0) {
        groups.push({ ...ui, items });
      }
    }
    return groups;
  }, [pathItems]);
  const totalItems = Object.values(pathItems).reduce((sum, arr) => sum + ((arr == null ? void 0 : arr.length) || 0), 0);
  if (loading) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Seo, { title: "ステップ詳細", description: "学習ステップを読み込み中です。", path: "/step/" + String(id) }),
      /* @__PURE__ */ jsx("div", { className: "page-bg" }),
      /* @__PURE__ */ jsx(SiteHeader, {}),
      /* @__PURE__ */ jsx("main", { style: { textAlign: "center", padding: 80, color: "var(--ink-3)" }, children: "読み込み中..." }),
      /* @__PURE__ */ jsx(SiteFooter, {})
    ] });
  }
  if (!step) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Seo, { title: "ステップが見つかりません", description: "お探しのステップは存在しないか、削除されました。", path: "/step/" + String(id) }),
      /* @__PURE__ */ jsx("div", { className: "page-bg" }),
      /* @__PURE__ */ jsx(SiteHeader, {}),
      /* @__PURE__ */ jsxs("main", { style: { textAlign: "center", padding: 80 }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: 48, marginBottom: 12 }, children: "🎋" }),
        /* @__PURE__ */ jsx("h2", { style: { fontFamily: "var(--font-display)", fontSize: 22, color: "var(--ink-0)" }, children: "ステップが見つかりません" }),
        /* @__PURE__ */ jsx(Link, { to: "/paths", className: "btn", style: { marginTop: 20, display: "inline-flex", textDecoration: "none" }, children: "学習パス一覧へ" })
      ] }),
      /* @__PURE__ */ jsx(SiteFooter, {})
    ] });
  }
  const stepTitle = (step == null ? void 0 : step.title) || "";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: `${stepTitle} — SAP学習ステップ`,
        description: (step == null ? void 0 : step.excerpt) || `SAP 学習ステップ「${stepTitle}」。${step.step_time || ""}`,
        path: "/step/" + String(id),
        type: "article",
        breadcrumbs: [
          { name: "ホーム", path: "/" },
          { name: "学習パス", path: "/paths" },
          ...step.path_id ? [{ name: step.path_title || "学習パス", path: "/learning/" + String(step.path_id) }] : [],
          { name: stepTitle, path: "/step/" + String(id) }
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxs("main", { style: { position: "relative", zIndex: 2 }, children: [
      /* @__PURE__ */ jsxs("article", { className: "art-hero", style: { maxWidth: 1080 }, children: [
        /* @__PURE__ */ jsxs("div", { className: "crumb", children: [
          /* @__PURE__ */ jsx(Link, { to: "/", children: "ホーム" }),
          /* @__PURE__ */ jsx("span", { className: "sep", children: " › " }),
          /* @__PURE__ */ jsx(Link, { to: "/paths", children: "学習パス" }),
          /* @__PURE__ */ jsx("span", { className: "sep", children: " › " }),
          step.path_id && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Link, { to: `/learning/${step.path_id}`, children: step.path_title }),
            /* @__PURE__ */ jsx("span", { className: "sep", children: " › " })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "now", children: step.title })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "meta-top", style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", fontSize: 12.5, marginBottom: 16 }, children: [
          step.step_order && /* @__PURE__ */ jsxs("span", { className: "tag-mod fi", children: [
            "Step ",
            step.step_order
          ] }),
          step.step_time && /* @__PURE__ */ jsxs("span", { style: { color: "var(--ink-3)" }, children: [
            "⏱ ",
            step.step_time
          ] }),
          step.path_title && /* @__PURE__ */ jsxs("span", { style: { color: "var(--ink-3)" }, children: [
            "📚 ",
            step.path_title
          ] })
        ] }),
        /* @__PURE__ */ jsx("h1", { children: step.title }),
        step.excerpt && /* @__PURE__ */ jsx("p", { className: "lead", children: step.excerpt })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "art-body-wrap", children: [
        /* @__PURE__ */ jsxs("div", { className: "art-content", children: [
          /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: contentWithIds || '<p style="color:var(--ink-3);text-align:center;">コンテンツは準備中です🎋</p>' } }),
          totalItems > 0 && /* @__PURE__ */ jsxs("div", { style: { marginTop: 40, paddingTop: 28, borderTop: "1.5px solid var(--line-1)" }, children: [
            /* @__PURE__ */ jsxs("h2", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--ink-0)", margin: "0 0 18px" }, children: [
              "🎯 このステップの学習コンテンツ",
              /* @__PURE__ */ jsxs("span", { style: { fontSize: 13, color: "var(--ink-3)", fontWeight: 500, marginLeft: 8 }, children: [
                totalItems,
                "件"
              ] })
            ] }),
            contentGroups.map((group) => /* @__PURE__ */ jsxs("div", { style: { marginBottom: 20 }, children: [
              /* @__PURE__ */ jsxs("h3", { style: { fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: group.color, margin: "0 0 8px", display: "flex", alignItems: "center", gap: 6 }, children: [
                /* @__PURE__ */ jsx("span", { children: group.icon }),
                /* @__PURE__ */ jsx("span", { children: group.label }),
                /* @__PURE__ */ jsxs("span", { style: { fontSize: 11, fontWeight: 500, color: "var(--ink-3)" }, children: [
                  group.items.length,
                  "件"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: group.items.map((item) => {
                var _a;
                let url = group.linkPrefix + item.id;
                if (group.linkPrefix === "/knowledge/" && item.slug) url += "/" + item.slug;
                else if (group.linkPrefix === "/article/" && item.slug) url += "/" + item.slug;
                return /* @__PURE__ */ jsxs(
                  Link,
                  {
                    to: url,
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 14px",
                      borderRadius: "var(--r-md)",
                      background: "var(--bg-1)",
                      border: "1px solid var(--line-1)",
                      textDecoration: "none",
                      transition: "all .12s"
                    },
                    onMouseEnter: (e) => e.currentTarget.style.borderColor = group.color,
                    onMouseLeave: (e) => e.currentTarget.style.borderColor = "var(--line-1)",
                    children: [
                      /* @__PURE__ */ jsx("span", { style: {
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "var(--r-pill)",
                        background: group.color + "22",
                        color: group.color,
                        flexShrink: 0
                      }, children: group.label }),
                      /* @__PURE__ */ jsx("span", { style: { flex: 1, fontSize: 13.5, fontWeight: 500, color: "var(--ink-0)" }, children: item.title }),
                      ((_a = item.module) == null ? void 0 : _a.slug) && /* @__PURE__ */ jsx("span", { style: {
                        fontSize: 11,
                        padding: "1px 6px",
                        borderRadius: 4,
                        background: "var(--accent-soft)",
                        color: "var(--accent-deep)",
                        flexShrink: 0
                      }, children: item.module.slug.toUpperCase() }),
                      /* @__PURE__ */ jsx("span", { style: { fontSize: 16, color: group.color, flexShrink: 0 }, children: "→" })
                    ]
                  },
                  `${group.label}-${item.id}`
                );
              }) })
            ] }, group.label))
          ] }),
          step.notes && step.notes.length > 0 && /* @__PURE__ */ jsxs("div", { style: { marginTop: 32, paddingTop: 20, borderTop: "1px dashed var(--line-2)" }, children: [
            /* @__PURE__ */ jsx("h3", { style: { fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--ink-0)", margin: "0 0 12px" }, children: "📝 ノート" }),
            step.notes.map((n, i) => /* @__PURE__ */ jsxs("div", { style: { padding: "12px 16px", background: "var(--bg-card)", borderRadius: "var(--r-md)", border: "1px solid var(--line-1)", marginBottom: 8 }, children: [
              n.title && /* @__PURE__ */ jsx("div", { style: { fontWeight: 600, fontSize: 13, color: "var(--ink-0)", marginBottom: 4 }, children: n.title }),
              n.content && /* @__PURE__ */ jsx("div", { style: { fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7 }, children: n.content })
            ] }, i))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("aside", { className: "art-side", children: [
          tocItems.length > 0 && /* @__PURE__ */ jsxs("div", { className: "toc-card", style: { marginBottom: 14 }, children: [
            /* @__PURE__ */ jsx("h5", { children: "📖 目次" }),
            /* @__PURE__ */ jsx("ul", { className: "toc-list", children: tocItems.map((t, i) => /* @__PURE__ */ jsx("li", { className: t.level === 3 ? "sub" : "", children: /* @__PURE__ */ jsx(
              "a",
              {
                href: `#${t.id}`,
                className: activeToc === t.id ? "active" : "",
                onClick: (e) => {
                  var _a;
                  e.preventDefault();
                  (_a = document.getElementById(t.id)) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
                  setActiveToc(t.id);
                },
                children: t.label
              }
            ) }, i)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "toc-card", children: [
            /* @__PURE__ */ jsx("h5", { children: "📚 所属パス" }),
            step.path_id ? /* @__PURE__ */ jsxs(Link, { to: `/learning/${step.path_id}`, style: { display: "block", padding: "8px 10px", background: "var(--accent-soft)", borderRadius: "var(--r-sm)", fontSize: 13, color: "var(--accent-deep)", fontWeight: 600, textDecoration: "none" }, children: [
              step.path_title,
              " →"
            ] }) : /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: "var(--ink-3)" }, children: "未所属" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "toc-card", style: { marginBottom: 14 }, children: [
            /* @__PURE__ */ jsx("h5", { children: "⏱ 学習時間" }),
            /* @__PURE__ */ jsx("p", { style: { fontSize: 16, fontWeight: 700, color: "var(--ink-0)", fontFamily: "var(--font-display)" }, children: step.step_time || "—" })
          ] }),
          totalItems > 0 && /* @__PURE__ */ jsxs("div", { className: "toc-card", style: { marginBottom: 14 }, children: [
            /* @__PURE__ */ jsx("h5", { children: "📋 コンテンツ" }),
            contentGroups.map((g) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--ink-1)", padding: "2px 0" }, children: [
              /* @__PURE__ */ jsxs("span", { children: [
                g.icon,
                " ",
                g.label
              ] }),
              /* @__PURE__ */ jsx("span", { style: { fontWeight: 700, color: g.color }, children: g.items.length })
            ] }, g.label))
          ] }),
          /* @__PURE__ */ jsx(Link, { to: "/paths", className: "btn sm", style: { width: "100%", justifyContent: "center", textDecoration: "none" }, children: "← 学習パス一覧" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {}),
    settings.showFloatingPanda && /* @__PURE__ */ jsx(FloatingPanda, {})
  ] });
}
const PER_PAGE = 20;
function VideoPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [moduleFilter, setModuleFilter] = useState("");
  const [showIframe, setShowIframe] = useState(false);
  const [sticky, setSticky] = useState(false);
  const { settings } = useTheme();
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const loadVideos = (mod, pg) => {
    setLoading(true);
    const p2 = pg || page;
    api.getVideos({ per_page: PER_PAGE, page: p2, ...mod ? { module: mod } : {} }).then((res) => {
      if (res.success) {
        setVideos(res.data);
        setTotal(res.total || 0);
        if (res.data.length > 0 && !currentVideo) setCurrentVideo(res.data[0]);
      }
    }).catch(() => {
    }).finally(() => setLoading(false));
  };
  useEffect(() => {
    loadVideos();
  }, []);
  useEffect(() => {
    if (!currentVideo) return;
    const handleScroll = () => {
      const shouldStick = window.scrollY > 180;
      setSticky((prev) => prev !== shouldStick ? shouldStick : prev);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentVideo]);
  const openVideo = (v) => {
    setCurrentVideo(v);
    setShowIframe(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setShowIframe(true), 400);
  };
  const filterByModule = (m) => {
    setModuleFilter(m);
    setPage(1);
    setCurrentVideo(null);
    loadVideos(m || void 0, 1);
  };
  const goToPage = (p2) => {
    if (p2 < 1 || p2 > totalPages) return;
    setPage(p2);
    setCurrentVideo(null);
    loadVideos(moduleFilter || void 0, p2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "SAP 動画講座一覧",
        description: "SAP パンダ先生の動画講座一覧。モジュール別にフィルタ可能。YouTube 動画で SAP の操作画面を確認しながら学習。",
        path: "/video"
      }
    ),
    /* @__PURE__ */ jsx(SiteHeader, { active: "yt" }),
    /* @__PURE__ */ jsxs("main", { style: { position: "relative", zIndex: 2 }, children: [
      currentVideo && /* @__PURE__ */ jsx(
        "div",
        {
          style: {
            background: "#1a1208",
            position: "sticky",
            top: 0,
            zIndex: 30,
            padding: sticky ? "12px 28px" : "28px 28px 24px",
            transition: "padding .15s",
            boxShadow: sticky ? "0 4px 20px rgba(0,0,0,0.3)" : "none"
          },
          children: /* @__PURE__ */ jsx("div", { style: {
            maxWidth: sticky ? 1280 : 960,
            margin: "0 auto",
            display: sticky ? "flex" : "block",
            gap: 20,
            alignItems: "center"
          }, children: sticky ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { style: { width: 200, flexShrink: 0, cursor: "pointer" }, onClick: () => {
              setSticky(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }, children: showIframe && currentVideo.youtube_id ? /* @__PURE__ */ jsx("div", { style: { position: "relative", paddingBottom: "56.25%", borderRadius: 6, overflow: "hidden", background: "#000" }, children: /* @__PURE__ */ jsx("iframe", { src: `https://www.youtube.com/embed/${currentVideo.youtube_id}?autoplay=1`, style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }, frameBorder: "0", allow: "autoplay; encrypted-media", allowFullScreen: true }) }) : /* @__PURE__ */ jsxs("div", { style: { aspectRatio: "16/9", background: "#1a1208", borderRadius: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", overflow: "hidden" }, onClick: () => setShowIframe(true), children: [
              (currentVideo.thumbnail || currentVideo.youtube_id) && /* @__PURE__ */ jsx("img", { src: currentVideo.thumbnail || `https://img.youtube.com/vi/${currentVideo.youtube_id}/mqdefault.jpg`, alt: "", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } }),
              /* @__PURE__ */ jsx("div", { style: { fontSize: 32, opacity: 0.8, lineHeight: 1, position: "relative", zIndex: 2 }, children: "▶" })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
              /* @__PURE__ */ jsx("h2", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "white", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: currentVideo.title }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12, fontSize: 11.5, color: "rgba(255,255,255,0.5)", marginTop: 4 }, children: [
                currentVideo.module && /* @__PURE__ */ jsx("span", { children: currentVideo.module.name }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "⏱ ",
                  currentVideo.duration || "--"
                ] }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "👁 ",
                  currentVideo.views ? `${(currentVideo.views / 1e3).toFixed(1)}k` : "0",
                  " views"
                ] })
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsxs("div", { style: { maxWidth: 960, margin: "0 auto" }, children: [
            /* @__PURE__ */ jsxs("div", { className: "crumb", style: { marginBottom: 12 }, children: [
              /* @__PURE__ */ jsx(Link, { to: "/", style: { color: "rgba(255,255,255,0.6)" }, children: "ホーム" }),
              /* @__PURE__ */ jsx("span", { className: "sep", style: { color: "rgba(255,255,255,0.4)" }, children: " › " }),
              /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.9)", fontWeight: 600 }, children: "動画" })
            ] }),
            showIframe && currentVideo.youtube_id ? /* @__PURE__ */ jsx("div", { style: { position: "relative", paddingBottom: "56.25%", height: 0, marginBottom: 16, borderRadius: "var(--r-lg)", overflow: "hidden" }, children: /* @__PURE__ */ jsx("iframe", { src: `https://www.youtube.com/embed/${currentVideo.youtube_id}?autoplay=1`, style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }, frameBorder: "0", allow: "autoplay; encrypted-media", allowFullScreen: true }) }) : /* @__PURE__ */ jsxs("div", { style: { aspectRatio: "16/9", background: "#1a1208", borderRadius: "var(--r-lg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 16, cursor: "pointer", width: "100%", position: "relative", overflow: "hidden" }, onClick: () => setShowIframe(true), children: [
              (currentVideo.thumbnail || currentVideo.youtube_id) && /* @__PURE__ */ jsx("img", { src: currentVideo.thumbnail || `https://img.youtube.com/vi/${currentVideo.youtube_id}/mqdefault.jpg`, alt: currentVideo.title ? `${currentVideo.title} - SAP パンダ先生動画講座` : "SAP パンダ先生動画講座", loading: "lazy", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 } }),
              /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", color: "white", position: "relative", zIndex: 2 }, children: [
                /* @__PURE__ */ jsx("div", { style: { fontSize: 64, marginBottom: 8, opacity: 0.9, lineHeight: 1 }, children: "▶" }),
                /* @__PURE__ */ jsx("div", { style: { fontSize: 13, opacity: 0.7 }, children: "クリックして再生" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("h1", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "white", margin: "0 0 6px" }, children: currentVideo.title }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 16, fontSize: 12.5, color: "rgba(255,255,255,0.5)" }, children: [
              currentVideo.module && /* @__PURE__ */ jsx("span", { children: currentVideo.module.name }),
              /* @__PURE__ */ jsxs("span", { children: [
                "⏱ ",
                currentVideo.duration || "--"
              ] }),
              /* @__PURE__ */ jsxs("span", { children: [
                "👁 ",
                currentVideo.views ? `${(currentVideo.views / 1e3).toFixed(1)}k` : "0",
                " views"
              ] })
            ] })
          ] }) })
        }
      ),
      /* @__PURE__ */ jsxs("section", { className: "section", style: { paddingTop: 24 }, children: [
        /* @__PURE__ */ jsxs("div", { className: "section-head", style: { marginBottom: 20 }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "label", children: "Video Library" }),
            /* @__PURE__ */ jsxs("h2", { children: [
              "動画一覧",
              /* @__PURE__ */ jsx("span", { className: "accent-mark", children: "." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "desc", children: [
            "パンダ先生のSAP解説動画。",
            /* @__PURE__ */ jsx("br", {}),
            "見て聞いて理解しよう。"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }, children: [{ slug: "", name: "すべて" }, { slug: "fi", name: "FI" }, { slug: "co", name: "CO" }, { slug: "mm", name: "MM" }, { slug: "sd", name: "SD" }, { slug: "abap", name: "ABAP" }, { slug: "s4", name: "S/4" }].map((m) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => filterByModule(m.slug),
            style: { padding: "6px 16px", borderRadius: "var(--r-pill)", border: "1.5px solid", cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, fontWeight: 600, borderColor: moduleFilter === m.slug ? "var(--accent)" : "var(--line-2)", background: moduleFilter === m.slug ? "var(--accent-soft)" : "var(--bg-card)", color: moduleFilter === m.slug ? "var(--accent-deep)" : "var(--ink-1)" },
            children: m.name
          },
          m.slug || "all"
        )) }),
        loading ? /* @__PURE__ */ jsx("div", { style: { textAlign: "center", padding: 60, color: "var(--ink-3)" }, children: "読み込み中..." }) : videos.length === 0 ? /* @__PURE__ */ jsx("div", { style: { textAlign: "center", padding: 60, color: "var(--ink-3)" }, children: "動画がまだありません。" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "yt-videos", style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }, children: videos.map((v) => {
            var _a, _b, _c, _d;
            return /* @__PURE__ */ jsxs("div", { className: "yt-vid", onClick: () => openVideo(v), style: { cursor: "pointer" }, children: [
              /* @__PURE__ */ jsxs("div", { className: "thumb", style: { aspectRatio: "16/9", width: "100%", background: `linear-gradient(135deg, ${((_a = v.module) == null ? void 0 : _a.slug) === "fi" ? "#2f6d44" : ((_b = v.module) == null ? void 0 : _b.slug) === "abap" ? "#1f6f6f" : ((_c = v.module) == null ? void 0 : _c.slug) === "mm" ? "#a25411" : "#2c1d4a"}, ${((_d = v.module) == null ? void 0 : _d.slug) === "fi" ? "#5a9d6e" : "#5a3a8a"})`, borderRadius: "var(--r-md)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }, children: [
                v.thumbnail ? /* @__PURE__ */ jsx("img", { src: v.thumbnail, alt: "", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } }) : v.youtube_id ? /* @__PURE__ */ jsx("img", { src: `https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`, alt: v.title ? `${v.title} - SAP パンダ先生` : "SAP パンダ先生動画講座", loading: "lazy", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } }) : null,
                v.youtube_id && /* @__PURE__ */ jsx("div", { style: { width: 48, height: 48, borderRadius: "50%", background: "rgba(255,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 2 }, children: /* @__PURE__ */ jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "white", children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" }) }) }),
                v.duration && /* @__PURE__ */ jsx("span", { style: { position: "absolute", right: 8, bottom: 8, background: "rgba(0,0,0,0.75)", color: "white", fontSize: 11, fontFamily: "var(--font-mono)", padding: "2px 6px", borderRadius: 4, zIndex: 2 }, children: v.duration })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "vid-info", style: { padding: "12px 0" }, children: [
                /* @__PURE__ */ jsx("h4", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-0)", margin: "0 0 4px", lineHeight: 1.4 }, children: v.title }),
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 10, fontSize: 11.5, color: "var(--ink-3)" }, children: [
                  v.module && /* @__PURE__ */ jsx("span", { children: v.module.name }),
                  v.views > 0 && /* @__PURE__ */ jsxs("span", { children: [
                    "👁 ",
                    (v.views / 1e3).toFixed(1),
                    "k views"
                  ] })
                ] })
              ] })
            ] }, v.id);
          }) }),
          totalPages > 1 && /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 32 }, children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => goToPage(page - 1),
                disabled: page <= 1,
                style: { padding: "8px 14px", borderRadius: "var(--r-sm)", border: "1px solid var(--line-2)", background: "var(--bg-card)", cursor: page <= 1 ? "default" : "pointer", opacity: page <= 1 ? 0.4 : 1, fontSize: 13, fontWeight: 600, fontFamily: "inherit" },
                children: "‹"
              }
            ),
            Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
              let p2;
              if (totalPages <= 10) p2 = i + 1;
              else if (page <= 5) p2 = i + 1;
              else if (page >= totalPages - 4) p2 = totalPages - 9 + i;
              else p2 = page - 5 + i;
              if (p2 >= 1 && p2 <= totalPages) {
                return /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => goToPage(p2),
                    style: {
                      minWidth: 36,
                      height: 36,
                      borderRadius: "var(--r-sm)",
                      border: "1px solid",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: "inherit",
                      borderColor: page === p2 ? "var(--accent)" : "var(--line-2)",
                      background: page === p2 ? "var(--accent-soft)" : "var(--bg-card)",
                      color: page === p2 ? "var(--accent-deep)" : "var(--ink-1)"
                    },
                    children: p2
                  },
                  p2
                );
              }
              return null;
            }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => goToPage(page + 1),
                disabled: page >= totalPages,
                style: { padding: "8px 14px", borderRadius: "var(--r-sm)", border: "1px solid var(--line-2)", background: "var(--bg-card)", cursor: page >= totalPages ? "default" : "pointer", opacity: page >= totalPages ? 0.4 : 1, fontSize: 13, fontWeight: 600, fontFamily: "inherit" },
                children: "›"
              }
            ),
            /* @__PURE__ */ jsxs("span", { style: { fontSize: 12, color: "var(--ink-3)", marginLeft: 8 }, children: [
              page,
              "/",
              totalPages
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {}),
    settings.showFloatingPanda && /* @__PURE__ */ jsx(FloatingPanda, {})
  ] });
}
function CoursePage() {
  var _a, _b, _c, _d;
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lessonPage, setLessonPage] = useState(1);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const { settings } = useTheme();
  const { user } = useAuth();
  const isAdmin = (_a = user == null ? void 0 : user.roles) == null ? void 0 : _a.includes("administrator");
  const perPage = 20;
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      api.getCourse(parseInt(id)).then((res) => {
        if (res.success) setCourse(res.data);
      }),
      api.client.get(`/courses/${id}/lessons`).then(({ data }) => {
        if (data.success) setLessons(data.data || []);
      })
    ]).catch(() => {
    }).finally(() => setLoading(false));
  }, [id]);
  useEffect(() => {
    var _a2;
    if (!((_a2 = course == null ? void 0 : course.module) == null ? void 0 : _a2.slug)) return;
    api.client.get("/courses", { params: { module: course.module.slug, per_page: 6 } }).then(({ data }) => {
      if (data.success) setRelatedCourses((data.data || []).filter((c) => c.id !== parseInt(id)));
    }).catch(() => {
    });
  }, [course]);
  const totalPages = Math.ceil(lessons.length / perPage);
  const paginatedLessons = lessons.slice((lessonPage - 1) * perPage, lessonPage * perPage);
  const activeModule = SAP_MODULES.find((m) => {
    var _a2;
    return m.slug === ((_a2 = course == null ? void 0 : course.module) == null ? void 0 : _a2.slug);
  });
  ((_b = course == null ? void 0 : course.module) == null ? void 0 : _b.slug) ? (activeModule == null ? void 0 : activeModule.color) || "#5a9d6e" : "#5a9d6e";
  const modName = ((_c = course == null ? void 0 : course.module) == null ? void 0 : _c.name) || (activeModule == null ? void 0 : activeModule.name_ja) || "";
  const modSlug = ((_d = course == null ? void 0 : course.module) == null ? void 0 : _d.slug) || "";
  if (loading) return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Seo, { title: "コースを読み込み中", path: `/course/${id}` }),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsx("main", { style: { textAlign: "center", padding: 80, color: "var(--ink-3)" }, children: "読み込み中..." }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
  if (!course) return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Seo, { title: "コースが見つかりません", description: "お探しのコースは存在しないか、削除された可能性があります。", path: `/course/${id}` }),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxs("main", { style: { textAlign: "center", padding: 80 }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontSize: 48, marginBottom: 12 }, children: "🎋" }),
      /* @__PURE__ */ jsx("h2", { style: { fontFamily: "var(--font-display)", fontSize: 22, color: "var(--ink-0)" }, children: "コースが見つかりません" }),
      /* @__PURE__ */ jsx(Link, { to: "/modules", className: "btn", style: { marginTop: 20, display: "inline-flex", textDecoration: "none" }, children: "モジュール一覧に戻る" })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: `${course.title} — SAPコース詳細`,
        description: course.excerpt || `${course.title}。${modName}分野のSAP学習コース。${course.price > 0 ? `¥${course.price.toLocaleString()}` : "無料"}・${course.duration || ""}・${lessons.length}レッスン。`,
        path: `/course/${id}`,
        type: "article",
        breadcrumbs: [
          { name: "ホーム", path: "/" },
          { name: "モジュール", path: "/modules" },
          ...modSlug ? [{ name: modName, path: `/category/${modSlug}` }] : [],
          { name: course.title, path: `/course/${id}` }
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxs("main", { style: { position: "relative", zIndex: 2 }, children: [
      /* @__PURE__ */ jsx("section", { className: "cat-hero", children: /* @__PURE__ */ jsxs("div", { className: "cat-hero-wrap", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "crumb", children: [
            /* @__PURE__ */ jsx(Link, { to: "/", children: "ホーム" }),
            /* @__PURE__ */ jsx("span", { className: "sep", children: "›" }),
            /* @__PURE__ */ jsx(Link, { to: "/modules", children: "モジュール" }),
            modSlug && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "sep", children: "›" }),
              /* @__PURE__ */ jsx(Link, { to: `/category/${modSlug}`, style: { color: "var(--ink-2)" }, children: modName })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "sep", children: "›" }),
            /* @__PURE__ */ jsx("span", { className: "now", children: course.title })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginTop: 12, marginBottom: 6, flexWrap: "wrap" }, children: [
            modSlug && /* @__PURE__ */ jsx("span", { className: `tag-mod ${modSlug}`, children: modSlug.toUpperCase() }),
            course.difficulty && /* @__PURE__ */ jsx("span", { className: `tag-diff l${course.difficulty.slug === "beginner" ? 1 : course.difficulty.slug === "intermediate" ? 2 : 3}`, children: course.difficulty.name || (course.difficulty.slug === "beginner" ? "初級" : course.difficulty.slug === "intermediate" ? "中級" : "上級") }),
            course.price > 0 ? /* @__PURE__ */ jsxs("span", { style: { fontWeight: 700, color: "var(--accent-deep)" }, children: [
              "¥",
              course.price.toLocaleString()
            ] }) : /* @__PURE__ */ jsx("span", { style: { color: "var(--accent)" }, children: "無料" }),
            course.duration && /* @__PURE__ */ jsxs("span", { style: { color: "var(--ink-3)" }, children: [
              "⏱ ",
              course.duration
            ] }),
            /* @__PURE__ */ jsxs("span", { style: { color: "var(--ink-3)" }, children: [
              "📖 ",
              lessons.length,
              "レッスン"
            ] })
          ] }),
          /* @__PURE__ */ jsx("h1", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(26px, 3vw, 36px)", color: "var(--ink-0)", margin: "0 0 8px" }, children: course.title }),
          course.excerpt && /* @__PURE__ */ jsx("p", { style: { fontSize: 14.5, color: "var(--ink-2)", lineHeight: 1.8, maxWidth: 600 }, children: course.excerpt })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "cat-mascot", children: /* @__PURE__ */ jsxs("svg", { viewBox: "-4 -8 108 128", width: "180", height: "200", children: [
          /* @__PURE__ */ jsx("path", { d: "M 22 40 L 50 24 L 78 40 L 50 56 Z", fill: "#2a2317" }),
          /* @__PURE__ */ jsx("path", { d: "M 20 42 L 20 50 Q 50 66 80 50 L 80 42", fill: "none", stroke: "#2a2317", strokeWidth: "2.5" }),
          /* @__PURE__ */ jsx("rect", { x: "44", y: "55", width: "12", height: "8", rx: "2", fill: "#d97548" }),
          /* @__PURE__ */ jsx("line", { x1: "50", y1: "63", x2: "50", y2: "70", stroke: "#d97548", strokeWidth: "2", strokeLinecap: "round" }),
          /* @__PURE__ */ jsx("circle", { cx: "50", cy: "52", r: "46", fill: "#fdfaf2" }),
          /* @__PURE__ */ jsx("ellipse", { cx: "22", cy: "18", rx: "13", ry: "12", fill: "#1a1612" }),
          /* @__PURE__ */ jsx("ellipse", { cx: "78", cy: "18", rx: "13", ry: "12", fill: "#1a1612" }),
          /* @__PURE__ */ jsx("path", { d: "M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z", fill: "#1a1612" }),
          /* @__PURE__ */ jsx("path", { d: "M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z", fill: "#1a1612" }),
          /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "3.4", fill: "#fff" }),
          /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "2.4", fill: "#0e0a05" }),
          /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "3.4", fill: "#fff" }),
          /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "2.4", fill: "#0e0a05" }),
          /* @__PURE__ */ jsx("ellipse", { cx: "18", cy: "64", rx: "5.5", ry: "3", fill: "#f4b8c4", opacity: "0.7" }),
          /* @__PURE__ */ jsx("ellipse", { cx: "82", cy: "64", rx: "5.5", ry: "3", fill: "#f4b8c4", opacity: "0.7" }),
          /* @__PURE__ */ jsx("ellipse", { cx: "50", cy: "62", rx: "3.4", ry: "2.5", fill: "#1a1612" }),
          /* @__PURE__ */ jsx("path", { d: "M 50 64 L 50 67", stroke: "#1a1612", strokeWidth: "1.4", strokeLinecap: "round" }),
          /* @__PURE__ */ jsx("path", { d: "M 43 70 Q 50 74 57 70", fill: "none", stroke: "#1a1612", strokeWidth: "1.8", strokeLinecap: "round" })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "art-body-wrap", style: { gridTemplateColumns: "1fr 220px" }, children: [
        /* @__PURE__ */ jsxs("div", { className: "art-content", style: { minHeight: 200 }, children: [
          course.content ? /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: course.content } }) : lessons.length === 0 ? /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", padding: 60, color: "var(--ink-3)" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: 48, marginBottom: 12 }, children: "🎋" }),
            /* @__PURE__ */ jsx("p", { children: "コンテンツは準備中です。" })
          ] }) : null,
          lessons.length > 0 && /* @__PURE__ */ jsxs("div", { style: { marginTop: 48, paddingTop: 32, borderTop: "1.5px dashed var(--line-2)" }, children: [
            /* @__PURE__ */ jsxs("h2", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-0)", margin: "0 0 4px" }, children: [
              "レッスン一覧 ",
              /* @__PURE__ */ jsxs("span", { style: { fontSize: 14, color: "var(--ink-3)", fontWeight: 500 }, children: [
                "全",
                lessons.length,
                "レッスン"
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: "var(--ink-2)", margin: "0 0 18px" }, children: "コースの各レッスンを順番に学習しましょう。" }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: paginatedLessons.map((l, i) => /* @__PURE__ */ jsxs(
              Link,
              {
                to: `/lesson/${l.id}/${l.slug}`,
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "13px 18px",
                  borderRadius: "var(--r-lg)",
                  border: "1.5px solid var(--line-1)",
                  background: "var(--bg-card)",
                  textDecoration: "none",
                  transition: "all .15s"
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.background = "var(--accent-soft)";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.borderColor = "var(--line-1)";
                  e.currentTarget.style.background = "var(--bg-card)";
                },
                children: [
                  /* @__PURE__ */ jsx("span", { style: {
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    color: "white",
                    fontSize: 12,
                    fontWeight: 700,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0
                  }, children: l.order || i + 1 }),
                  /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
                    /* @__PURE__ */ jsx("div", { style: { fontSize: 14, fontWeight: 600, color: "var(--ink-0)" }, children: l.title }),
                    l.excerpt && /* @__PURE__ */ jsx("div", { style: { fontSize: 12, color: "var(--ink-2)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: l.excerpt })
                  ] }),
                  /* @__PURE__ */ jsx("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", whiteSpace: "nowrap" }, children: l.time }),
                  /* @__PURE__ */ jsx("span", { style: { fontSize: 18, color: "var(--accent)" }, children: "→" })
                ]
              },
              l.id
            )) }),
            totalPages > 1 && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 20 }, children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "btn sm",
                  disabled: lessonPage <= 1,
                  onClick: () => setLessonPage((p2) => p2 - 1),
                  style: { opacity: lessonPage <= 1 ? 0.4 : 1, cursor: lessonPage <= 1 ? "not-allowed" : "pointer" },
                  children: "← 前へ"
                }
              ),
              Array.from({ length: totalPages }, (_, i) => i + 1).map((p2) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setLessonPage(p2),
                  className: "btn sm",
                  style: {
                    minWidth: 36,
                    justifyContent: "center",
                    background: p2 === lessonPage ? "var(--accent)" : "var(--bg-card)",
                    color: p2 === lessonPage ? "white" : "var(--ink-1)",
                    borderColor: p2 === lessonPage ? "var(--accent)" : "var(--line-2)"
                  },
                  children: p2
                },
                p2
              )),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "btn sm",
                  disabled: lessonPage >= totalPages,
                  onClick: () => setLessonPage((p2) => p2 + 1),
                  style: { opacity: lessonPage >= totalPages ? 0.4 : 1, cursor: lessonPage >= totalPages ? "not-allowed" : "pointer" },
                  children: "次へ →"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("aside", { className: "art-side", children: [
          /* @__PURE__ */ jsxs("div", { className: "toc-card", children: [
            /* @__PURE__ */ jsx("h5", { children: "📌 詳細" }),
            /* @__PURE__ */ jsxs("div", { style: { fontSize: 13, color: "var(--ink-1)", lineHeight: 1.8 }, children: [
              course.duration && /* @__PURE__ */ jsxs("div", { children: [
                "⏱ ",
                course.duration
              ] }),
              course.price > 0 ? /* @__PURE__ */ jsxs("div", { children: [
                "💴 ¥",
                course.price.toLocaleString()
              ] }) : /* @__PURE__ */ jsx("div", { children: "🎉 無料" }),
              /* @__PURE__ */ jsxs("div", { children: [
                "📅 ",
                new Date(course.created_at).toLocaleDateString("ja-JP")
              ] })
            ] })
          ] }),
          relatedCourses.length > 0 && /* @__PURE__ */ jsxs("div", { className: "toc-card", children: [
            /* @__PURE__ */ jsx("h5", { children: "📚 関連コース" }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: relatedCourses.map((rc) => /* @__PURE__ */ jsxs(
              Link,
              {
                to: `/course/${rc.id}`,
                style: {
                  display: "block",
                  padding: "7px 10px",
                  borderRadius: "var(--r-sm)",
                  fontSize: 12.5,
                  color: "var(--ink-1)",
                  textDecoration: "none",
                  background: "var(--bg-1)",
                  transition: "background .12s"
                },
                onMouseEnter: (e) => e.currentTarget.style.background = "var(--accent-soft)",
                onMouseLeave: (e) => e.currentTarget.style.background = "var(--bg-1)",
                children: [
                  /* @__PURE__ */ jsx("div", { style: { fontWeight: 600, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: rc.title }),
                  /* @__PURE__ */ jsxs("div", { style: { fontSize: 10.5, color: "var(--ink-3)" }, children: [
                    rc.duration ? `⏱ ${rc.duration}` : "",
                    rc.price > 0 ? ` · ¥${rc.price.toLocaleString()}` : rc.price === 0 ? " · 無料" : ""
                  ] })
                ]
              },
              rc.id
            )) })
          ] }),
          modSlug && /* @__PURE__ */ jsxs("div", { className: "toc-card", children: [
            /* @__PURE__ */ jsx("h5", { children: "📂 モジュール" }),
            /* @__PURE__ */ jsxs(Link, { to: `/category/${modSlug}`, style: { fontSize: 13, color: "var(--accent-deep)", textDecoration: "none", display: "block", padding: "4px 0" }, children: [
              "← ",
              modName,
              "に戻る"
            ] })
          ] }),
          isAdmin && /* @__PURE__ */ jsxs("div", { className: "toc-card", children: [
            /* @__PURE__ */ jsx("h5", { children: "⚙ 管理" }),
            /* @__PURE__ */ jsx(Link, { to: `/admin/courses/${course.id}/edit`, className: "btn sm", style: { width: "100%", justifyContent: "center", textDecoration: "none", fontSize: 11.5 }, children: "このコースを編集" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {}),
    settings.showFloatingPanda && /* @__PURE__ */ jsx(FloatingPanda, {})
  ] });
}
function extractToc$2(html) {
  const toc = [];
  const regex = /<h([23])(?:\s[^>]*)?>(.+?)<\/h\1>/gi;
  let match = null;
  let index = 0;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const label = match[2].replace(/<[^>]+>/g, "").trim();
    if (label) {
      const id = `knowledge-heading-${index++}`;
      toc.push({ id, label, level });
    }
  }
  return toc;
}
function truncateContent$2(html, pct = 30) {
  const textLen = html.replace(/<[^>]+>/g, "").length;
  if (textLen < 200) return html;
  const blocks = html.split(/(?=<\/?(?:p|div|h[1-6]|section|ul|ol|table)[^>]*>)/i);
  let cumulative = 0;
  const threshold = textLen * pct / 100;
  const result = [];
  for (const block of blocks) {
    const cleanLen = block.replace(/<[^>]+>/g, "").length;
    cumulative += cleanLen;
    if (cumulative > threshold) break;
    result.push(block);
  }
  return result.join("");
}
function knowledgeJsonLd(k) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: k.title,
    description: k.excerpt || `${k.title} のSAPナレッジ`,
    datePublished: k.created_at,
    dateModified: k.updated_at,
    author: { "@type": "Person", name: "パンダ先生" },
    provider: { "@type": "Organization", name: "SAP Panda Academy" }
  });
}
function KnowledgePage() {
  var _a, _b, _c, _d;
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [knowledge, setKnowledge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeToc, setActiveToc] = useState("");
  const { settings } = useTheme();
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const isAdmin = (_a = user == null ? void 0 : user.roles) == null ? void 0 : _a.includes("administrator");
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getKnowledge(parseInt(id)).then((res) => {
      if (res.success && res.data) {
        const k = res.data;
        if (!slug && k.slug) {
          navigate(`/knowledge/${id}/${k.slug}`, { replace: true });
        }
        setKnowledge(k);
      }
    }).catch(() => {
    }).finally(() => setLoading(false));
  }, [id, slug, navigate]);
  const fullContent = (knowledge == null ? void 0 : knowledge.content) || "";
  const isRestricted = !isLoggedIn && !isAdmin;
  const displayContent = isRestricted ? truncateContent$2(fullContent, 30) : fullContent;
  const tocItems = useMemo(() => extractToc$2(fullContent), [fullContent]);
  const contentWithIds = useMemo(() => {
    let idx = 0;
    return displayContent.replace(/<h([23])(\s[^>]*)?>/gi, (_m, level, attrs) => {
      const id2 = `knowledge-heading-${idx++}`;
      return `<h${level}${attrs || ""} id="${id2}">`;
    });
  }, [displayContent]);
  useEffect(() => {
    if (tocItems.length === 0) return;
    const onScroll = throttle(() => {
      const viewTop = window.scrollY + 160;
      let active = tocItems[0].id;
      for (const t of tocItems) {
        const el = document.getElementById(t.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= viewTop) active = t.id;
        }
      }
      setActiveToc(active);
    }, 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [tocItems]);
  const activeModule = SAP_MODULES.find((m) => {
    var _a2;
    return m.slug === ((_a2 = knowledge == null ? void 0 : knowledge.module) == null ? void 0 : _a2.slug);
  });
  ((_b = knowledge == null ? void 0 : knowledge.module) == null ? void 0 : _b.slug) ? (activeModule == null ? void 0 : activeModule.color) || "#5a9d6e" : "#5a9d6e";
  const kTitle = (knowledge == null ? void 0 : knowledge.title) || "";
  const kExcerpt = (knowledge == null ? void 0 : knowledge.excerpt) || "";
  const pageUrl = id && (knowledge == null ? void 0 : knowledge.slug) ? `/knowledge/${id}/${knowledge.slug}` : `/knowledge/${id}`;
  if (loading) return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Seo, { title: "ナレッジ詳細", description: "SAP ナレッジベースの記事を読み込み中。", path: `/knowledge/${id}` }),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsx("main", { style: { textAlign: "center", padding: 80, color: "var(--ink-3)" }, children: "読み込み中..." }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
  if (!knowledge) return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Seo, { title: "ナレッジが見つかりません", description: "お探しのナレッジ記事は存在しないか、削除されました。", path: `/knowledge/${id}` }),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxs("main", { style: { textAlign: "center", padding: 80 }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontSize: 48, marginBottom: 12 }, children: "🎋" }),
      /* @__PURE__ */ jsx("h2", { style: { fontFamily: "var(--font-display)", fontSize: 22, color: "var(--ink-0)" }, children: "ナレッジが見つかりません" }),
      /* @__PURE__ */ jsx(Link, { to: "/modules", className: "btn", style: { marginTop: 20, display: "inline-flex", textDecoration: "none" }, children: "モジュール一覧に戻る" })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
  const modName = ((_c = knowledge.module) == null ? void 0 : _c.name) || (activeModule == null ? void 0 : activeModule.name_ja) || "";
  const modSlug = ((_d = knowledge.module) == null ? void 0 : _d.slug) || "";
  const typeLabel = knowledge.type === "tips" ? "💡 TIPS" : knowledge.type === "faq" ? "❓ FAQ" : knowledge.type === "glossary" ? "📖 用語" : knowledge.type || "";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: knowledgeJsonLd(knowledge) } }),
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: `${kTitle} — SAPナレッジ`,
        description: kExcerpt || `SAP ナレッジ「${kTitle}」。${modName}分野の SAP 知識をわかりやすく解説。`,
        path: pageUrl,
        type: "article",
        publishedTime: knowledge.created_at,
        breadcrumbs: [
          { name: "ホーム", path: "/" },
          { name: "モジュール", path: "/modules" },
          ...modSlug ? [{ name: modName, path: `/category/${modSlug}` }] : [],
          { name: kTitle, path: pageUrl }
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxs("main", { style: { position: "relative", zIndex: 2 }, children: [
      /* @__PURE__ */ jsx("section", { className: "cat-hero", children: /* @__PURE__ */ jsxs("div", { className: "cat-hero-wrap", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "crumb", children: [
            /* @__PURE__ */ jsx(Link, { to: "/", children: "ホーム" }),
            /* @__PURE__ */ jsx("span", { className: "sep", children: "›" }),
            /* @__PURE__ */ jsx(Link, { to: "/modules", children: "モジュール" }),
            modSlug && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "sep", children: "›" }),
              /* @__PURE__ */ jsx(Link, { to: `/category/${modSlug}`, style: { color: "var(--ink-2)" }, children: modName })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "sep", children: "›" }),
            /* @__PURE__ */ jsx("span", { className: "now", children: knowledge.title })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginTop: 12, marginBottom: 6, flexWrap: "wrap" }, children: [
            modSlug && /* @__PURE__ */ jsx("span", { className: `tag-mod ${modSlug}`, children: modSlug.toUpperCase() }),
            typeLabel && /* @__PURE__ */ jsx("span", { style: { fontSize: 10.5, padding: "2px 7px", borderRadius: 4, background: "var(--bg-tint)", color: "var(--ink-2)", fontWeight: 600 }, children: typeLabel }),
            knowledge.difficulty && /* @__PURE__ */ jsx("span", { className: `tag-diff l${knowledge.difficulty.slug === "beginner" ? 1 : knowledge.difficulty.slug === "intermediate" ? 2 : 3}`, children: knowledge.difficulty.name || (knowledge.difficulty.slug === "beginner" ? "初級" : knowledge.difficulty.slug === "intermediate" ? "中級" : "上級") }),
            /* @__PURE__ */ jsxs("span", { style: { color: "var(--ink-3)" }, children: [
              "📅 ",
              new Date(knowledge.created_at).toLocaleDateString("ja-JP")
            ] })
          ] }),
          /* @__PURE__ */ jsx("h1", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(26px, 3vw, 36px)", color: "var(--ink-0)", margin: "0 0 8px" }, children: knowledge.title }),
          knowledge.excerpt && /* @__PURE__ */ jsx("p", { style: { fontSize: 14.5, color: "var(--ink-2)", lineHeight: 1.8, maxWidth: 600 }, children: knowledge.excerpt })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "cat-mascot", children: /* @__PURE__ */ jsxs("svg", { viewBox: "-4 -8 108 128", width: "180", height: "200", children: [
          /* @__PURE__ */ jsx("path", { d: "M 22 40 L 50 24 L 78 40 L 50 56 Z", fill: "#2a2317" }),
          /* @__PURE__ */ jsx("path", { d: "M 20 42 L 20 50 Q 50 66 80 50 L 80 42", fill: "none", stroke: "#2a2317", strokeWidth: "2.5" }),
          /* @__PURE__ */ jsx("rect", { x: "44", y: "55", width: "12", height: "8", rx: "2", fill: "#d97548" }),
          /* @__PURE__ */ jsx("line", { x1: "50", y1: "63", x2: "50", y2: "70", stroke: "#d97548", strokeWidth: "2", strokeLinecap: "round" }),
          /* @__PURE__ */ jsx("circle", { cx: "50", cy: "52", r: "46", fill: "#fdfaf2" }),
          /* @__PURE__ */ jsx("ellipse", { cx: "22", cy: "18", rx: "13", ry: "12", fill: "#1a1612" }),
          /* @__PURE__ */ jsx("ellipse", { cx: "78", cy: "18", rx: "13", ry: "12", fill: "#1a1612" }),
          /* @__PURE__ */ jsx("path", { d: "M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z", fill: "#1a1612" }),
          /* @__PURE__ */ jsx("path", { d: "M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z", fill: "#1a1612" }),
          /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "3.4", fill: "#fff" }),
          /* @__PURE__ */ jsx("circle", { cx: "30", cy: "44", r: "2.4", fill: "#0e0a05" }),
          /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "3.4", fill: "#fff" }),
          /* @__PURE__ */ jsx("circle", { cx: "70", cy: "44", r: "2.4", fill: "#0e0a05" }),
          /* @__PURE__ */ jsx("ellipse", { cx: "18", cy: "64", rx: "5.5", ry: "3", fill: "#f4b8c4", opacity: "0.7" }),
          /* @__PURE__ */ jsx("ellipse", { cx: "82", cy: "64", rx: "5.5", ry: "3", fill: "#f4b8c4", opacity: "0.7" }),
          /* @__PURE__ */ jsx("ellipse", { cx: "50", cy: "62", rx: "3.4", ry: "2.5", fill: "#1a1612" }),
          /* @__PURE__ */ jsx("path", { d: "M 50 64 L 50 67", stroke: "#1a1612", strokeWidth: "1.4", strokeLinecap: "round" }),
          /* @__PURE__ */ jsx("path", { d: "M 43 70 Q 50 74 57 70", fill: "none", stroke: "#1a1612", strokeWidth: "1.8", strokeLinecap: "round" })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "art-body-wrap", style: { gridTemplateColumns: "1fr 220px" }, children: [
        /* @__PURE__ */ jsxs("div", { className: "art-content", style: { minHeight: 200 }, children: [
          displayContent ? /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: contentWithIds } }) : /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", padding: 60, color: "var(--ink-3)" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: 48, marginBottom: 12 }, children: "🎋" }),
            /* @__PURE__ */ jsx("p", { children: "コンテンツは準備中です。" })
          ] }),
          isRestricted && /* @__PURE__ */ jsxs("div", { style: {
            marginTop: 32,
            padding: "32px 24px",
            textAlign: "center",
            background: "linear-gradient(135deg, var(--accent-soft) 0%, var(--bg-1) 100%)",
            borderRadius: "var(--r-lg)",
            border: "1.5px solid var(--accent-line)"
          }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: 40, marginBottom: 12 }, children: "🐼" }),
            /* @__PURE__ */ jsx("h3", { style: { fontFamily: "var(--font-display)", fontSize: 18, color: "var(--ink-0)", margin: "0 0 8px" }, children: "続きを読むにはログインが必要です" }),
            /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: "var(--ink-2)", margin: "0 0 20px", lineHeight: 1.7 }, children: "このナレッジの残り内容を表示するには、アカウントにログインしてください。" }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12, justifyContent: "center" }, children: [
              /* @__PURE__ */ jsx(Link, { to: "/login", className: "btn accent", style: { textDecoration: "none" }, children: "ログイン" }),
              /* @__PURE__ */ jsx(Link, { to: "/register", className: "btn", style: { textDecoration: "none" }, children: "新規登録" })
            ] })
          ] }),
          knowledge.references && knowledge.references.length > 0 && /* @__PURE__ */ jsxs("div", { style: { marginTop: 40, paddingTop: 24, borderTop: "1.5px dashed var(--line-2)" }, children: [
            /* @__PURE__ */ jsx("h3", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-0)", margin: "0 0 12px" }, children: "🔗 参考リンク" }),
            /* @__PURE__ */ jsx("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }, children: knowledge.references.map((r, i) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
              "a",
              {
                href: r.url,
                target: "_blank",
                rel: "noopener noreferrer",
                style: { display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: "var(--r-md)", background: "var(--bg-card)", border: "1px solid var(--line-1)", textDecoration: "none", fontSize: 13, color: "var(--accent-deep)", transition: "background .12s" },
                onMouseEnter: (e) => e.currentTarget.style.background = "var(--accent-soft)",
                onMouseLeave: (e) => e.currentTarget.style.background = "var(--bg-card)",
                children: [
                  /* @__PURE__ */ jsx("span", { children: "🔗" }),
                  /* @__PURE__ */ jsx("span", { children: r.label || r.url })
                ]
              }
            ) }, i)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("aside", { className: "art-side", children: [
          tocItems.length > 0 && /* @__PURE__ */ jsxs("div", { className: "toc-card", children: [
            /* @__PURE__ */ jsx("h5", { children: "📖 目次" }),
            /* @__PURE__ */ jsx("ul", { className: "toc-list", children: tocItems.map((t) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              "a",
              {
                href: `#${t.id}`,
                className: activeToc === t.id ? "active" : "",
                style: { paddingLeft: t.level === 3 ? 22 : 10 },
                onClick: (e) => {
                  e.preventDefault();
                  scrollToHeading(t.id);
                  setActiveToc(t.id);
                },
                children: t.label
              }
            ) }, t.id)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "toc-card", children: [
            /* @__PURE__ */ jsx("h5", { children: "📌 詳細" }),
            /* @__PURE__ */ jsxs("div", { style: { fontSize: 13, color: "var(--ink-1)", lineHeight: 1.8 }, children: [
              /* @__PURE__ */ jsxs("div", { children: [
                "📅 ",
                new Date(knowledge.created_at).toLocaleDateString("ja-JP")
              ] }),
              knowledge.updated_at && /* @__PURE__ */ jsxs("div", { children: [
                "🔄 ",
                new Date(knowledge.updated_at).toLocaleDateString("ja-JP")
              ] }),
              typeLabel && /* @__PURE__ */ jsxs("div", { children: [
                "🏷️ ",
                typeLabel
              ] })
            ] })
          ] }),
          modSlug && /* @__PURE__ */ jsxs("div", { className: "toc-card", children: [
            /* @__PURE__ */ jsx("h5", { children: "📂 モジュール" }),
            /* @__PURE__ */ jsxs(Link, { to: `/category/${modSlug}`, style: { fontSize: 13, color: "var(--accent-deep)", textDecoration: "none", display: "block", padding: "4px 0" }, children: [
              "← ",
              modName,
              "に戻る"
            ] })
          ] }),
          isAdmin && /* @__PURE__ */ jsxs("div", { className: "toc-card", children: [
            /* @__PURE__ */ jsx("h5", { children: "⚙ 管理" }),
            /* @__PURE__ */ jsx(Link, { to: `/admin/knowledge/${knowledge.id}/edit`, className: "btn sm", style: { width: "100%", justifyContent: "center", textDecoration: "none", fontSize: 11.5 }, children: "このナレッジを編集" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {}),
    settings.showFloatingPanda && /* @__PURE__ */ jsx(FloatingPanda, {})
  ] });
}
function extractToc$1(html) {
  const toc = [];
  const regex = /<h([23])(?:\s[^>]*)?>(.+?)<\/h\1>/gi;
  let match = null;
  let index = 0;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const label = match[2].replace(/<[^>]+>/g, "").trim();
    if (label) {
      const id = `lesson-heading-${index++}`;
      toc.push({ id, label, level });
    }
  }
  return toc;
}
function truncateContent$1(html, pct = 30) {
  const textLen = html.replace(/<[^>]+>/g, "").length;
  if (textLen < 200) return html;
  const blocks = html.split(/(?=<\/?(?:p|div|h[1-6]|section|ul|ol|table)[^>]*>)/i);
  let cumulative = 0;
  const threshold = textLen * pct / 100;
  const result = [];
  for (const block of blocks) {
    const cleanLen = block.replace(/<[^>]+>/g, "").length;
    cumulative += cleanLen;
    if (cumulative > threshold) break;
    result.push(block);
  }
  return result.join("");
}
function lessonJsonLd(lesson) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: lesson.title,
    description: lesson.excerpt || `${lesson.title} のSAPレッスン`,
    datePublished: lesson.created_at,
    author: { "@type": "Person", name: "パンダ先生" },
    provider: { "@type": "Organization", name: "SAP Panda Academy" }
  });
}
function LessonPage() {
  var _a;
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeToc, setActiveToc] = useState("");
  const { settings } = useTheme();
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const isAdmin = (_a = user == null ? void 0 : user.roles) == null ? void 0 : _a.includes("administrator");
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.client.get(`/lessons/${id}`).then(({ data }) => {
      if (data.success) {
        const l = data.data;
        if (!slug && l.slug) {
          navigate(`/lesson/${id}/${l.slug}`, { replace: true });
        }
        setLesson(l);
      }
    }).catch(() => {
    }).finally(() => setLoading(false));
  }, [id, slug, navigate]);
  const fullContent = (lesson == null ? void 0 : lesson.content) || "";
  const isRestricted = !isLoggedIn && !isAdmin;
  const displayContent = isRestricted ? truncateContent$1(fullContent, 30) : fullContent;
  const tocItems = useMemo(() => extractToc$1(fullContent), [fullContent]);
  const contentWithIds = useMemo(() => {
    let idx = 0;
    return displayContent.replace(/<h([23])(\s[^>]*)?>/gi, (_m, level, attrs) => {
      const id2 = `lesson-heading-${idx++}`;
      return `<h${level}${attrs || ""} id="${id2}">`;
    });
  }, [displayContent]);
  useEffect(() => {
    if (tocItems.length === 0) return;
    const onScroll = throttle(() => {
      const viewTop = window.scrollY + 160;
      let active = tocItems[0].id;
      for (const t of tocItems) {
        const el = document.getElementById(t.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= viewTop) active = t.id;
        }
      }
      setActiveToc(active);
    }, 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [tocItems]);
  const lessonTitle = (lesson == null ? void 0 : lesson.title) || "";
  const lessonExcerpt = (lesson == null ? void 0 : lesson.excerpt) || "";
  const pageUrl = id && (lesson == null ? void 0 : lesson.slug) ? `/lesson/${id}/${lesson.slug}` : `/lesson/${id}`;
  if (loading) return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Seo, { title: "レッスンを読み込み中", path: `/lesson/${id}` }),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsx("main", { style: { textAlign: "center", padding: 80, color: "var(--ink-3)" }, children: "読み込み中..." }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
  if (!lesson) return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Seo, { title: "レッスンが見つかりません", description: "お探しのレッスンは存在しないか、削除された可能性があります。", path: `/lesson/${id}` }),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxs("main", { style: { textAlign: "center", padding: 80 }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontSize: 48, marginBottom: 12 }, children: "🎋" }),
      /* @__PURE__ */ jsx("h2", { style: { fontFamily: "var(--font-display)", fontSize: 22, color: "var(--ink-0)" }, children: "レッスンが見つかりません" }),
      /* @__PURE__ */ jsx(Link, { to: "/courses", className: "btn", style: { marginTop: 20, display: "inline-flex", textDecoration: "none" }, children: "コース一覧に戻る" })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: lessonJsonLd(lesson) } }),
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: `${lessonTitle} — SAPレッスン`,
        description: lessonExcerpt || `SAP 学習レッスン「${lessonTitle}」。${lesson.time || ""}で学べる実践的な SAP トレーニングコンテンツ。`,
        path: pageUrl,
        type: "article",
        publishedTime: lesson.created_at,
        breadcrumbs: [
          { name: "ホーム", path: "/" },
          { name: "モジュール", path: "/modules" },
          ...lesson.course_id ? [{ name: lesson.course_title || "コース", path: `/course/${lesson.course_id}` }] : [],
          { name: lessonTitle, path: pageUrl }
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxs("main", { style: { position: "relative", zIndex: 2 }, children: [
      /* @__PURE__ */ jsx("section", { className: "cat-hero", children: /* @__PURE__ */ jsx("div", { className: "cat-hero-wrap", style: { gridTemplateColumns: "1fr" }, children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "crumb", children: [
          /* @__PURE__ */ jsx(Link, { to: "/", children: "ホーム" }),
          /* @__PURE__ */ jsx("span", { className: "sep", children: "›" }),
          /* @__PURE__ */ jsx(Link, { to: "/modules", children: "モジュール" }),
          lesson.course_id ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "sep", children: "›" }),
            /* @__PURE__ */ jsx(Link, { to: `/course/${lesson.course_id}`, style: { color: "var(--ink-2)" }, children: lesson.course_title })
          ] }) : null,
          /* @__PURE__ */ jsx("span", { className: "sep", children: "›" }),
          /* @__PURE__ */ jsx("span", { className: "now", children: lesson.title })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginTop: 12, marginBottom: 6, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxs("span", { className: "tag-diff l1", style: { fontSize: 10.5 }, children: [
            "レッスン ",
            lesson.order
          ] }),
          lesson.time && /* @__PURE__ */ jsxs("span", { style: { color: "var(--ink-3)" }, children: [
            "⏱ ",
            lesson.time
          ] })
        ] }),
        /* @__PURE__ */ jsx("h1", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(24px, 2.5vw, 32px)", color: "var(--ink-0)", margin: "0 0 8px" }, children: lesson.title }),
        lesson.excerpt && /* @__PURE__ */ jsx("p", { style: { fontSize: 14, color: "var(--ink-2)", lineHeight: 1.8, maxWidth: 600 }, children: lesson.excerpt })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "art-body-wrap", style: { gridTemplateColumns: "1fr 220px" }, children: [
        /* @__PURE__ */ jsxs("div", { className: "art-content", style: { minHeight: 200 }, children: [
          displayContent ? /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: contentWithIds } }) : /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", padding: 60, color: "var(--ink-3)" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: 48, marginBottom: 12 }, children: "🎋" }),
            /* @__PURE__ */ jsx("p", { children: "コンテンツは準備中です。" })
          ] }),
          isRestricted && /* @__PURE__ */ jsxs("div", { style: {
            marginTop: 32,
            padding: "32px 24px",
            textAlign: "center",
            background: "linear-gradient(135deg, var(--accent-soft) 0%, var(--bg-1) 100%)",
            borderRadius: "var(--r-lg)",
            border: "1.5px solid var(--accent-line)"
          }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: 40, marginBottom: 12 }, children: "🐼" }),
            /* @__PURE__ */ jsx("h3", { style: { fontFamily: "var(--font-display)", fontSize: 18, color: "var(--ink-0)", margin: "0 0 8px" }, children: "続きを読むにはログインが必要です" }),
            /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: "var(--ink-2)", margin: "0 0 20px", lineHeight: 1.7 }, children: "このレッスンの残り内容を表示するには、アカウントにログインしてください。" }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12, justifyContent: "center" }, children: [
              /* @__PURE__ */ jsx(Link, { to: "/login", className: "btn accent", style: { textDecoration: "none" }, children: "ログイン" }),
              /* @__PURE__ */ jsx(Link, { to: "/register", className: "btn", style: { textDecoration: "none" }, children: "新規登録" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("aside", { className: "art-side", children: [
          tocItems.length > 0 && /* @__PURE__ */ jsxs("div", { className: "toc-card", children: [
            /* @__PURE__ */ jsx("h5", { children: "📖 目次" }),
            /* @__PURE__ */ jsx("ul", { className: "toc-list", children: tocItems.map((t) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              "a",
              {
                href: `#${t.id}`,
                className: activeToc === t.id ? "active" : "",
                style: { paddingLeft: t.level === 3 ? 22 : 10 },
                onClick: (e) => {
                  e.preventDefault();
                  scrollToHeading(t.id);
                  setActiveToc(t.id);
                },
                children: t.label
              }
            ) }, t.id)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "toc-card", children: [
            /* @__PURE__ */ jsx("h5", { children: "📌 詳細" }),
            /* @__PURE__ */ jsxs("div", { style: { fontSize: 13, color: "var(--ink-1)", lineHeight: 1.8 }, children: [
              /* @__PURE__ */ jsxs("div", { children: [
                "📖 レッスン ",
                lesson.order
              ] }),
              lesson.time && /* @__PURE__ */ jsxs("div", { children: [
                "⏱ ",
                lesson.time
              ] })
            ] })
          ] }),
          lesson.course_id ? /* @__PURE__ */ jsxs("div", { className: "toc-card", children: [
            /* @__PURE__ */ jsx("h5", { children: "📂 コース" }),
            /* @__PURE__ */ jsxs(Link, { to: `/course/${lesson.course_id}`, style: { fontSize: 13, color: "var(--accent-deep)", textDecoration: "none", display: "block", padding: "4px 0" }, children: [
              "← ",
              lesson.course_title,
              "に戻る"
            ] })
          ] }) : null,
          isAdmin && /* @__PURE__ */ jsxs("div", { className: "toc-card", children: [
            /* @__PURE__ */ jsx("h5", { children: "⚙ 管理" }),
            /* @__PURE__ */ jsx(Link, { to: `/admin/lessons/${lesson.id}/edit`, className: "btn sm", style: { width: "100%", justifyContent: "center", textDecoration: "none", fontSize: 11.5 }, children: "このレッスンを編集" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {}),
    settings.showFloatingPanda && /* @__PURE__ */ jsx(FloatingPanda, {})
  ] });
}
function extractToc(html) {
  const toc = [];
  const regex = /<h([23])(?:\s[^>]*)?>(.+?)<\/h\1>/gi;
  let match = null;
  let index = 0;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const label = match[2].replace(/<[^>]+>/g, "").trim();
    if (label) {
      toc.push({ id: `note-heading-${index++}`, label, level });
    }
  }
  return toc;
}
function truncateContent(html, pct = 30) {
  const textLen = html.replace(/<[^>]+>/g, "").length;
  if (textLen < 200) return html;
  const blocks = html.split(/(?=<\/?(?:p|div|h[1-6]|section|ul|ol|table)[^>]*>)/i);
  let cumulative = 0;
  const threshold = textLen * pct / 100;
  const result = [];
  for (const block of blocks) {
    const cleanLen = block.replace(/<[^>]+>/g, "").length;
    cumulative += cleanLen;
    if (cumulative > threshold) break;
    result.push(block);
  }
  return result.join("");
}
function noteJsonLd(note) {
  var _a;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: note.title,
    description: note.excerpt || `${note.title} — SAP Panda Academy 记事`,
    datePublished: note.created_at,
    author: { "@type": "Person", name: ((_a = note.author) == null ? void 0 : _a.display_name) || "パンダ先生" },
    provider: { "@type": "Organization", name: "SAP Panda Academy" }
  });
}
function NotePage() {
  var _a, _b, _c, _d, _e;
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeToc, setActiveToc] = useState("");
  const { settings } = useTheme();
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const isAdmin = (_a = user == null ? void 0 : user.roles) == null ? void 0 : _a.includes("administrator");
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getNote(parseInt(id)).then((res) => {
      if (res.success && res.data) {
        const n = res.data;
        if (!slug && n.slug) {
          navigate(`/note/${id}/${n.slug}`, { replace: true });
        }
        setNote(n);
      }
    }).catch(() => {
    }).finally(() => setLoading(false));
  }, [id, slug, navigate]);
  const fullContent = (note == null ? void 0 : note.content) || "";
  const isRestricted = !isLoggedIn && !isAdmin;
  const displayContent = isRestricted ? truncateContent(fullContent, 30) : fullContent;
  const tocItems = useMemo(() => extractToc(fullContent), [fullContent]);
  const contentWithIds = useMemo(() => {
    let idx = 0;
    return displayContent.replace(/<h([23])(\s[^>]*)?>/gi, (_m, level, attrs) => {
      const id2 = `note-heading-${idx++}`;
      return `<h${level}${attrs || ""} id="${id2}">`;
    });
  }, [displayContent]);
  useEffect(() => {
    if (tocItems.length === 0) return;
    const onScroll = throttle(() => {
      const viewTop = window.scrollY + 160;
      let active = tocItems[0].id;
      for (const t of tocItems) {
        const el = document.getElementById(t.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= viewTop) active = t.id;
        }
      }
      setActiveToc(active);
    }, 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [tocItems]);
  const activeModule = SAP_MODULES.find((m) => {
    var _a2;
    return m.slug === ((_a2 = note == null ? void 0 : note.module) == null ? void 0 : _a2.slug);
  });
  (activeModule == null ? void 0 : activeModule.color) || "#5a9d6e";
  const modName = ((_b = note == null ? void 0 : note.module) == null ? void 0 : _b.name) || (activeModule == null ? void 0 : activeModule.name_ja) || "";
  const modSlug = ((_c = note == null ? void 0 : note.module) == null ? void 0 : _c.slug) || "";
  const pageUrl = id && (note == null ? void 0 : note.slug) ? `/note/${id}/${note.slug}` : `/note/${id}`;
  if (loading) return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Seo, { title: "记事を読み込み中", path: `/note/${id}` }),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsx("main", { style: { textAlign: "center", padding: 80, color: "var(--ink-3)" }, children: "読み込み中..." }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
  if (!note) return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Seo, { title: "记事が見つかりません", description: "お探しの記事は存在しないか、削除されました。", path: `/note/${id}` }),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxs("main", { style: { textAlign: "center", padding: 80 }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontSize: 48, marginBottom: 12 }, children: "🔍" }),
      /* @__PURE__ */ jsx("h2", { style: { fontFamily: "var(--font-display)", fontSize: 22, color: "var(--ink-0)" }, children: "记事が見つかりません" }),
      /* @__PURE__ */ jsx("p", { style: { color: "var(--ink-2)", margin: "12px 0 24px" }, children: "お探しの記事は存在しないか、移動した可能性があります。" }),
      /* @__PURE__ */ jsx(Link, { to: "/", className: "btn accent", style: { textDecoration: "none" }, children: "ホームに戻る" })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: noteJsonLd(note) } }),
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: `${note.title} — SAP记事`,
        description: note.excerpt || `SAP 记事「${note.title}」。`,
        path: pageUrl,
        type: "article",
        publishedTime: note.created_at,
        author: ((_d = note.author) == null ? void 0 : _d.display_name) || "パンダ先生",
        breadcrumbs: [
          { name: "ホーム", path: "/" },
          ...modSlug ? [{ name: modName, path: `/category/${modSlug}` }] : [],
          { name: note.title, path: pageUrl }
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxs("main", { style: { position: "relative", zIndex: 2 }, children: [
      /* @__PURE__ */ jsx("section", { className: "cat-hero", children: /* @__PURE__ */ jsx("div", { className: "cat-hero-wrap", style: { gridTemplateColumns: "1fr" }, children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "crumb", children: [
          /* @__PURE__ */ jsx(Link, { to: "/", children: "ホーム" }),
          modSlug && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "sep", children: "›" }),
            /* @__PURE__ */ jsx(Link, { to: `/category/${modSlug}`, style: { color: "var(--ink-2)" }, children: modName })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "sep", children: "›" }),
          /* @__PURE__ */ jsx("span", { className: "now", children: note.title })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginTop: 12, marginBottom: 6, flexWrap: "wrap" }, children: [
          modSlug && /* @__PURE__ */ jsx("span", { className: `tag-mod ${modSlug}`, children: modSlug.toUpperCase() }),
          note.difficulty && /* @__PURE__ */ jsx("span", { className: `tag-diff l${note.difficulty.slug === "beginner" ? 1 : note.difficulty.slug === "intermediate" ? 2 : 3}`, children: note.difficulty.name || (note.difficulty.slug === "beginner" ? "初級" : "中級") }),
          /* @__PURE__ */ jsxs("span", { style: { color: "var(--ink-3)" }, children: [
            "📅 ",
            new Date(note.created_at).toLocaleDateString("ja-JP")
          ] })
        ] }),
        /* @__PURE__ */ jsx("h1", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(24px, 2.5vw, 32px)", color: "var(--ink-0)", margin: "0 0 8px" }, children: note.title }),
        note.excerpt && /* @__PURE__ */ jsx("p", { style: { fontSize: 14, color: "var(--ink-2)", lineHeight: 1.8, maxWidth: 600 }, children: note.excerpt })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "art-body-wrap", style: { gridTemplateColumns: "1fr 220px" }, children: [
        /* @__PURE__ */ jsxs("div", { className: "art-content", style: { minHeight: 200 }, children: [
          displayContent ? /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: contentWithIds } }) : /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", padding: 60, color: "var(--ink-3)" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: 48, marginBottom: 12 }, children: "📝" }),
            /* @__PURE__ */ jsx("p", { children: "コンテンツは準備中です。" })
          ] }),
          isRestricted && /* @__PURE__ */ jsxs("div", { style: {
            marginTop: 32,
            padding: "32px 24px",
            textAlign: "center",
            background: "linear-gradient(135deg, var(--accent-soft) 0%, var(--bg-1) 100%)",
            borderRadius: "var(--r-lg)",
            border: "1.5px solid var(--accent-line)"
          }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: 40, marginBottom: 12 }, children: "🐼" }),
            /* @__PURE__ */ jsx("h3", { style: { fontFamily: "var(--font-display)", fontSize: 18, color: "var(--ink-0)", margin: "0 0 8px" }, children: "続きを読むにはログインが必要です" }),
            /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: "var(--ink-2)", margin: "0 0 20px", lineHeight: 1.7 }, children: "この記事の残り内容を表示するには、アカウントにログインしてください。" }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12, justifyContent: "center" }, children: [
              /* @__PURE__ */ jsx(Link, { to: "/login", className: "btn accent", style: { textDecoration: "none" }, children: "ログイン" }),
              /* @__PURE__ */ jsx(Link, { to: "/register", className: "btn", style: { textDecoration: "none" }, children: "新規登録" })
            ] })
          ] }),
          note.references && note.references.length > 0 && /* @__PURE__ */ jsxs("div", { style: { marginTop: 40, paddingTop: 24, borderTop: "1.5px dashed var(--line-2)" }, children: [
            /* @__PURE__ */ jsx("h3", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-0)", margin: "0 0 12px" }, children: "🔗 参考リンク" }),
            /* @__PURE__ */ jsx("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }, children: note.references.map((r, i) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("a", { href: r.url, target: "_blank", rel: "noopener noreferrer", style: { display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: "var(--r-md)", background: "var(--bg-card)", border: "1px solid var(--line-1)", textDecoration: "none", fontSize: 13, color: "var(--accent-deep)" }, children: [
              /* @__PURE__ */ jsx("span", { children: "🔗" }),
              /* @__PURE__ */ jsx("span", { children: r.label || r.url })
            ] }) }, i)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("aside", { className: "art-side", children: [
          tocItems.length > 0 && /* @__PURE__ */ jsxs("div", { className: "toc-card", children: [
            /* @__PURE__ */ jsx("h5", { children: "📖 目次" }),
            /* @__PURE__ */ jsx("ul", { className: "toc-list", children: tocItems.map((t) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              "a",
              {
                href: `#${t.id}`,
                className: activeToc === t.id ? "active" : "",
                style: { paddingLeft: t.level === 3 ? 22 : 10 },
                onClick: (e) => {
                  e.preventDefault();
                  scrollToHeading(t.id);
                  setActiveToc(t.id);
                },
                children: t.label
              }
            ) }, t.id)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "toc-card", children: [
            /* @__PURE__ */ jsx("h5", { children: "📌 詳細" }),
            /* @__PURE__ */ jsxs("div", { style: { fontSize: 13, color: "var(--ink-1)", lineHeight: 1.8 }, children: [
              /* @__PURE__ */ jsxs("div", { children: [
                "📅 ",
                new Date(note.created_at).toLocaleDateString("ja-JP")
              ] }),
              note.updated_at && /* @__PURE__ */ jsxs("div", { children: [
                "🔄 ",
                new Date(note.updated_at).toLocaleDateString("ja-JP")
              ] }),
              ((_e = note.author) == null ? void 0 : _e.display_name) && /* @__PURE__ */ jsxs("div", { children: [
                "✍️ ",
                note.author.display_name
              ] })
            ] })
          ] }),
          isAdmin && /* @__PURE__ */ jsxs("div", { className: "toc-card", children: [
            /* @__PURE__ */ jsx("h5", { children: "⚙ 管理" }),
            /* @__PURE__ */ jsx(Link, { to: `/admin/notes/${note.id}/edit`, className: "btn sm", style: { width: "100%", justifyContent: "center", textDecoration: "none", fontSize: 11.5 }, children: "この記事を編集" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {}),
    settings.showFloatingPanda && /* @__PURE__ */ jsx(FloatingPanda, {})
  ] });
}
const modColor = {
  fi: "#2f6d44",
  co: "#2641a1",
  mm: "#a25411",
  sd: "#b62a4a",
  pp: "#4828a8",
  hr: "#8a6212",
  abap: "#1f6f6f",
  basis: "#4a432d",
  s4: "#1864a3"
};
const diffStyle = (slug) => {
  const map = {
    beginner: { background: "var(--accent-soft)", color: "var(--accent-deep)" },
    intermediate: { background: "var(--accent-2-soft)", color: "var(--accent-2)" },
    advanced: { background: "var(--rose-soft)", color: "var(--rose)" }
  };
  return map[slug] || map.beginner;
};
function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);
  const { settings } = useTheme();
  const timerRef = useRef();
  const doSearch = async (q) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.searchArticles(q.trim(), { per_page: 20 });
      setResults(res.success && res.data ? res.data : []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };
  useEffect(() => {
    var _a;
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      doSearch(q);
    }
    (_a = inputRef.current) == null ? void 0 : _a.focus();
  }, []);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    timerRef.current = setTimeout(() => {
      setSearchParams(query ? { q: query.trim() } : {}, { replace: true });
      doSearch(query.trim());
    }, 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: query ? `「${query}」の検索結果` : "記事検索",
        description: "SAPパンダ先生の記事を検索",
        path: "/search"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, { active: "" }),
    /* @__PURE__ */ jsx("main", { style: { position: "relative", zIndex: 2 }, children: /* @__PURE__ */ jsxs("section", { className: "section", style: { paddingTop: 32 }, children: [
      /* @__PURE__ */ jsx("div", { style: {
        maxWidth: 720,
        margin: "0 auto 32px"
      }, children: /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "var(--bg-card)",
            border: "2px solid var(--line-2)",
            borderRadius: "var(--r-pill)",
            padding: "12px 20px",
            transition: "border-color .15s",
            boxShadow: "var(--sh-1)"
          },
          onFocusCapture: (e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
          },
          onBlurCapture: (e) => {
            e.currentTarget.style.borderColor = "var(--line-2)";
          },
          children: [
            /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "var(--ink-3)", strokeWidth: "2.4", strokeLinecap: "round", children: [
              /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "7" }),
              /* @__PURE__ */ jsx("path", { d: "m20 20-3.5-3.5" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: inputRef,
                value: query,
                onChange: (e) => setQuery(e.target.value),
                placeholder: "モジュール名、用語、エラー番号で検索...",
                style: {
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: 16,
                  fontFamily: "inherit",
                  color: "var(--ink-0)",
                  background: "transparent"
                }
              }
            ),
            loading && /* @__PURE__ */ jsx("span", { style: { fontSize: 12, color: "var(--ink-3)", whiteSpace: "nowrap" }, children: "検索中..." }),
            query && !loading && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  var _a;
                  setQuery("");
                  setResults([]);
                  setSearched(false);
                  (_a = inputRef.current) == null ? void 0 : _a.focus();
                },
                style: { background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "var(--ink-3)", padding: 0, lineHeight: 1 },
                children: "✕"
              }
            )
          ]
        }
      ) }),
      /* @__PURE__ */ jsx("div", { style: { maxWidth: 720, margin: "0 auto" }, children: !searched ? /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", padding: 60, color: "var(--ink-3)", fontSize: 14, lineHeight: 2 }, children: [
        /* @__PURE__ */ jsx("span", { style: { fontSize: 40, display: "block", marginBottom: 12 }, children: "🔍" }),
        "キーワードを入力して記事を検索",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { style: { fontSize: 12, color: "var(--ink-4)" }, children: "例: FI, 決算, 購買, BOM, ALV, 会計伝票" })
      ] }) : loading ? /* @__PURE__ */ jsx("div", { style: { textAlign: "center", padding: 40, color: "var(--ink-3)" }, children: "検索中..." }) : results.length === 0 ? /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", padding: 60, color: "var(--ink-3)", fontSize: 14, lineHeight: 2 }, children: [
        /* @__PURE__ */ jsx("span", { style: { fontSize: 40, display: "block", marginBottom: 12 }, children: "😕" }),
        "「",
        query,
        "」に一致する記事が見つかりませんでした",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { style: { fontSize: 12, color: "var(--ink-4)" }, children: "別のキーワードで試してみてください" })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { style: { fontSize: 13, color: "var(--ink-3)", marginBottom: 16 }, children: [
          "「",
          query,
          "」の検索結果: ",
          /* @__PURE__ */ jsx("strong", { children: results.length }),
          " 件"
        ] }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 2 }, children: results.map((article) => {
          var _a, _b, _c;
          return /* @__PURE__ */ jsxs(
            Link,
            {
              to: `/article/${article.id}/${article.slug}`,
              style: {
                display: "flex",
                gap: 16,
                padding: "16px 20px",
                background: "var(--bg-card)",
                borderRadius: "var(--r-lg)",
                border: "1px solid var(--line-1)",
                textDecoration: "none",
                transition: "all .15s"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.transform = "translateX(2px)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.borderColor = "var(--line-1)";
                e.currentTarget.style.transform = "none";
              },
              children: [
                /* @__PURE__ */ jsx("div", { style: {
                  width: 48,
                  height: 48,
                  borderRadius: "var(--r-sm)",
                  flexShrink: 0,
                  background: ((_a = article.modules[0]) == null ? void 0 : _a.slug) ? modColor[article.modules[0].slug] || "var(--accent-soft)" : "var(--bg-tint)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#fff"
                }, children: ((_c = (_b = article.modules[0]) == null ? void 0 : _b.slug) == null ? void 0 : _c.toUpperCase()) || "?" }),
                /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }, children: [
                    article.modules[0] && /* @__PURE__ */ jsx("span", { style: { fontSize: 10.5, fontWeight: 700, padding: "1px 7px", borderRadius: 4, background: "var(--accent-soft)", color: "var(--accent-deep)" }, children: article.modules[0].name }),
                    article.difficulty && /* @__PURE__ */ jsx("span", { style: { fontSize: 10, padding: "1px 7px", borderRadius: 999, ...diffStyle(article.difficulty.slug) }, children: article.difficulty.name }),
                    /* @__PURE__ */ jsxs("span", { style: { fontSize: 11.5, color: "var(--ink-3)", marginLeft: "auto" }, children: [
                      article.readingTime,
                      "分"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { style: { fontWeight: 600, fontSize: 15, color: "var(--ink-0)", lineHeight: 1.45, marginBottom: 4 }, children: article.title }),
                  article.excerpt && /* @__PURE__ */ jsx("div", { style: { fontSize: 13, color: "var(--ink-2)", lineHeight: 1.65, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }, children: article.excerpt.replace(/<[^>]*>/g, "") }),
                  /* @__PURE__ */ jsx("div", { style: { fontSize: 11, color: "var(--ink-3)", marginTop: 6 }, children: formatDate$1(article) })
                ] })
              ]
            },
            article.id
          );
        }) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx(SiteFooter, {}),
    settings.showFloatingPanda && /* @__PURE__ */ jsx(FloatingPanda, {})
  ] });
}
const TOPIC_META = {
  "glossary": { label: "用語集", icon: "📚", desc: "SAP関連の専門用語をわかりやすく解説。", color: "#2f6d44", bg: "#d8ead9" },
  "trends": { label: "SAPトレンド", icon: "📈", desc: "SAP業界の最新動向・トピックス。", color: "#2641a1", bg: "#dde4fc" },
  "career-guide": { label: "転職ガイド", icon: "🎯", desc: "SAPコンサルタントへの転職・キャリア情報。", color: "#8a6212", bg: "#fee9b3" }
};
function TopicPage() {
  const location = useLocation();
  const topic = useMemo(() => location.pathname.replace(/\/+$/, "").split("/").pop() || "glossary", [location.pathname]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useTheme();
  const meta = topic ? TOPIC_META[topic] : null;
  const title = meta ? meta.label : topic || "トピック";
  const icon = meta ? meta.icon : "📄";
  const desc = meta ? meta.desc : "";
  const color = meta ? meta.color : "#5a9d6e";
  const bg = meta ? meta.bg : "#d8ead9";
  useEffect(() => {
    if (!topic) return;
    setLoading(true);
    api.getArticles({ topic, per_page: 50 }).then((res) => {
      if (res.success && res.data) setArticles(res.data);
      else setArticles([]);
    }).catch(() => setArticles([])).finally(() => setLoading(false));
  }, [topic]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Seo, { title: `${title} — SAPパンダ先生`, description: desc || `${title}に関する記事一覧`, path: `/${topic}` }),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, { active: "" }),
    /* @__PURE__ */ jsxs("main", { style: { position: "relative", zIndex: 2 }, children: [
      /* @__PURE__ */ jsx("section", { className: "cat-hero", style: { padding: "24px 28px 20px" }, children: /* @__PURE__ */ jsxs("div", { className: "cat-hero-wrap", style: { gridTemplateColumns: "1fr auto", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "crumb", style: { marginBottom: 6, fontSize: 12 }, children: [
            /* @__PURE__ */ jsx(Link, { to: "/", children: "ホーム" }),
            /* @__PURE__ */ jsx("span", { className: "sep", children: "›" }),
            /* @__PURE__ */ jsx("span", { className: "now", children: title })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "cat-title-row", style: { gap: 12, marginBottom: 4 }, children: [
            /* @__PURE__ */ jsx("div", { className: "cat-big-icon", style: { background: bg, fontSize: 22, width: 52, height: 52 }, children: icon }),
            /* @__PURE__ */ jsx("h1", { style: { fontSize: 26, margin: 0 }, children: title })
          ] }),
          desc && /* @__PURE__ */ jsx("p", { className: "cat-desc", style: { fontSize: 13.5, color: "var(--ink-1)", maxWidth: 560, lineHeight: 1.7, marginBottom: 6 }, children: desc })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "cat-stats", style: { gap: 12, textAlign: "right", flexDirection: "column" }, children: /* @__PURE__ */ jsxs("div", { className: "stat", children: [
          /* @__PURE__ */ jsx("div", { className: "v", style: { fontSize: 32 }, children: articles.length }),
          /* @__PURE__ */ jsx("div", { className: "l", style: { fontSize: 11 }, children: "記事" })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "section", style: { paddingTop: 32 }, children: loading ? /* @__PURE__ */ jsx("div", { style: { textAlign: "center", padding: 60, color: "var(--ink-3)" }, children: "読み込み中..." }) : articles.length === 0 ? /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", padding: 60, color: "var(--ink-3)" }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: 48, marginBottom: 16 }, children: icon }),
        /* @__PURE__ */ jsxs("p", { style: { fontSize: 16, lineHeight: 1.8 }, children: [
          "ただいま記事を準備中です。",
          /* @__PURE__ */ jsx("br", {}),
          "公開までしばらくお待ちください。"
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/", className: "btn", style: { marginTop: 20, textDecoration: "none" }, children: "トップページに戻る" })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "section-head", style: { marginBottom: 20 }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "label", children: topic === "glossary" ? "Glossary" : topic === "trends" ? "Trends" : "Career" }),
            /* @__PURE__ */ jsxs("h2", { children: [
              title,
              /* @__PURE__ */ jsx("span", { className: "accent-mark", children: "." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "desc", children: [
            articles.length,
            " 件の記事"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "module-grid", children: articles.map((a, idx) => {
          var _a, _b;
          return /* @__PURE__ */ jsxs(
            Link,
            {
              to: `/article/${a.id}/${a.slug}`,
              className: "mod-card",
              style: { "--card-color": color, "--card-bg": bg },
              children: [
                /* @__PURE__ */ jsxs("div", { className: "mod-top", children: [
                  /* @__PURE__ */ jsx("div", { className: "mod-icon", children: ((_b = (_a = a.modules[0]) == null ? void 0 : _a.slug) == null ? void 0 : _b.toUpperCase()) || icon }),
                  /* @__PURE__ */ jsxs("span", { style: { fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--font-mono)" }, children: [
                    a.readingTime,
                    "分"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "mod-name-ja", style: {
                  fontSize: 15,
                  marginTop: 12,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }, children: a.title }),
                a.excerpt && /* @__PURE__ */ jsx("div", { className: "mod-desc", style: {
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }, children: a.excerpt.replace(/<[^>]*>/g, "") }),
                /* @__PURE__ */ jsxs("div", { className: "mod-foot", style: { marginTop: "auto" }, children: [
                  a.difficulty && /* @__PURE__ */ jsx("span", { className: `level-pill l${a.difficulty.slug === "beginner" ? 1 : a.difficulty.slug === "intermediate" ? 2 : 3}`, children: a.difficulty.slug === "beginner" ? "初級" : a.difficulty.slug === "intermediate" ? "中級" : "上級" }),
                  /* @__PURE__ */ jsx("span", { style: { marginLeft: "auto", fontSize: 11, color: "var(--ink-3)" }, children: formatDate$1(a) })
                ] })
              ]
            },
            a.id
          );
        }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {}),
    settings.showFloatingPanda && /* @__PURE__ */ jsx(FloatingPanda, {})
  ] });
}
function About() {
  useTheme();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Seo, { title: "サイトについて", description: "SAP パンダ先生 NAVI のサイト概要。ミッション・運営情報をご紹介。FI/CO/MM/SD/ABAP など SAP 学習者向けの総合ナレッジサイトです。", path: "/about", breadcrumbs: [{ name: "ホーム", path: "/" }, { name: "サイトについて", path: "/about" }] }),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxs("main", { style: { position: "relative", zIndex: 2, maxWidth: 720, margin: "0 auto", padding: "48px 28px 80px" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "crumb", style: { marginBottom: 16 }, children: [
        /* @__PURE__ */ jsx(Link, { to: "/", style: { color: "var(--ink-2)" }, children: "ホーム" }),
        /* @__PURE__ */ jsx("span", { className: "sep", children: " › " }),
        /* @__PURE__ */ jsx("span", { className: "now", children: "サイトについて" })
      ] }),
      /* @__PURE__ */ jsx("h1", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 32, color: "var(--ink-0)", margin: "0 0 24px" }, children: "サイトについて" }),
      /* @__PURE__ */ jsxs("div", { className: "art-content", children: [
        /* @__PURE__ */ jsx("p", { children: "SAP パンダ先生 NAVI は、SAP に関わるすべての人に向けた総合ナレッジサイトです。" }),
        /* @__PURE__ */ jsx("h2", { children: "私たちのミッション" }),
        /* @__PURE__ */ jsx("p", { children: "SAP の世界は広く、専門用語も多く、「どこから始めればいいのかわからない」という声をよく聞きます。パンダ先生 NAVI は、そんな迷える SAPer のために、やさしく・わかりやすい解説を提供します。" }),
        /* @__PURE__ */ jsx("h2", { children: "カバーする領域" }),
        /* @__PURE__ */ jsxs("ul", { children: [
          /* @__PURE__ */ jsx("li", { children: "FI（財務会計）、CO（管理会計）、MM（購買管理）、SD（販売管理）" }),
          /* @__PURE__ */ jsx("li", { children: "PP（生産計画）、HR（人事管理）、ABAP（開発）、Basis（基盤）" }),
          /* @__PURE__ */ jsx("li", { children: "S/4HANA、Fiori、クラウド、最新トピック" })
        ] }),
        /* @__PURE__ */ jsx("h2", { children: "運営情報" }),
        /* @__PURE__ */ jsxs("p", { children: [
          "運営: パンダ先生プロジェクトチーム",
          /* @__PURE__ */ jsx("br", {}),
          "連絡先: お問い合わせフォームよりご連絡ください。"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
}
function StaticPage({ title, breadcrumb, description, path, children }) {
  useTheme();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Seo, { title, description: description || `${title} — SAP パンダ先生 NAVI`, path: path || `/${title.toLowerCase()}` }),
    /* @__PURE__ */ jsx("div", { className: "page-bg" }),
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxs("main", { style: { position: "relative", zIndex: 2, maxWidth: 720, margin: "0 auto", padding: "48px 28px 80px" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "crumb", style: { marginBottom: 16 }, children: [
        /* @__PURE__ */ jsx(Link, { to: "/", style: { color: "var(--ink-2)" }, children: "ホーム" }),
        /* @__PURE__ */ jsx("span", { className: "sep", children: " › " }),
        /* @__PURE__ */ jsx("span", { className: "now", children: breadcrumb || title })
      ] }),
      /* @__PURE__ */ jsx("h1", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 32, color: "var(--ink-0)", margin: "0 0 24px" }, children: title }),
      /* @__PURE__ */ jsx("div", { className: "art-content", children })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
}
const MEMBERS = [
  { name: "パンダ先生", role: "SAP マスター講師", bio: "SAP歴20年のベテラン。難しい概念をやさしく解説するのが得意。趣味は竹を食べること。", emoji: "🐼" },
  { name: "たろうくん", role: "SAP 学習者代表", bio: "24歳・SAP学習中の若手。読者の目線で「わからない」を代弁する。", emoji: "👨‍💻" },
  { name: "タナカ", role: "ABAP エンジニア", bio: "バックエンド開発が専門。ABAP パフォーマンス改善の記事を担当。", emoji: "⚡" },
  { name: "サトウ", role: "PM / コンサルタント", bio: "S/4HANA 移行プロジェクトを多数手がける。プロジェクト管理の記事を執筆。", emoji: "📋" }
];
function Team() {
  return /* @__PURE__ */ jsxs(StaticPage, { title: "執筆メンバー", description: "SAP パンダ先生 NAVI の執筆メンバー紹介。パンダ先生、たろうくん、ABAP エンジニア、PM コンサルタントが SAP 学習をサポートします。", path: "/team", children: [
    /* @__PURE__ */ jsx("p", { children: "SAP パンダ先生 NAVI は、現役 SAP コンサルタントやエンジニアが執筆しています。" }),
    /* @__PURE__ */ jsx("div", { style: { display: "grid", gap: 16, marginTop: 24 }, children: MEMBERS.map((m) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 16, padding: "16px 20px", background: "var(--bg-card)", borderRadius: "var(--r-lg)", border: "1px solid var(--line-1)" }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontSize: 40, lineHeight: 1 }, children: m.emoji }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { style: { fontWeight: 700, color: "var(--ink-0)" }, children: m.name }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: 12, color: "var(--accent-deep)", marginBottom: 4 }, children: m.role }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7 }, children: m.bio })
      ] })
    ] }, m.name)) }),
    /* @__PURE__ */ jsx("p", { style: { marginTop: 24, fontSize: 13, color: "var(--ink-2)" }, children: "随時メンバー募集中です。お問い合わせフォームからご連絡ください。" })
  ] });
}
const INQUIRY_TYPES = [
  { value: "general", label: "一般的なお問い合わせ" },
  { value: "course", label: "コースについて" },
  { value: "case", label: "案件掲載について" },
  { value: "partnership", label: "提携について" },
  { value: "other", label: "その他" }
];
function Contact() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [pageContent, setPageContent] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState({
    name: "",
    name_kana: "",
    email: "",
    phone: "",
    inquiry_type: "general",
    message: "",
    agreed_privacy: false,
    website: ""
    // honeypot
  });
  useEffect(() => {
    api.client.get("/pages", { params: { slug: "contact" } }).then(({ data }) => {
      var _a;
      if (data.success && ((_a = data.data) == null ? void 0 : _a.content)) {
        setPageContent(data.data.content);
      }
    }).catch(() => {
    }).finally(() => setLoaded(true));
  }, []);
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const handleSubmit = async (e) => {
    var _a, _b, _c;
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("必須項目（お名前・メールアドレス・お問い合わせ内容）を入力してください。");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("正しいメールアドレス形式で入力してください。");
      return;
    }
    if (!form.agreed_privacy) {
      setError("プライバシーポリシーに同意してください。");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.client.post("/contact", form);
      const data = res.data;
      if (data.success) {
        setSent(true);
      } else {
        setError(data.message || "送信に失敗しました。");
      }
    } catch (err) {
      const msg = ((_b = (_a = err == null ? void 0 : err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || (err == null ? void 0 : err.message) || "サーバーとの通信に失敗しました";
      setError("送信エラー: " + msg);
      console.error("Contact submit error:", ((_c = err == null ? void 0 : err.response) == null ? void 0 : _c.data) || err);
    } finally {
      setSubmitting(false);
    }
  };
  if (sent) return /* @__PURE__ */ jsx(StaticPage, { title: "お問い合わせ", description: "SAP パンダ先生 NAVI へのお問い合わせありがとうございます。", path: "/contact", children: /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", padding: "40px 0" }, children: [
    /* @__PURE__ */ jsx("div", { style: { fontSize: 64, marginBottom: 12 }, children: "🎋" }),
    /* @__PURE__ */ jsx("h2", { children: "お問い合わせを受け付けました" }),
    /* @__PURE__ */ jsxs("p", { style: { color: "var(--ink-2)", lineHeight: 1.8, maxWidth: 480, margin: "0 auto" }, children: [
      "内容を確認の上、担当者からご連絡いたします。",
      /* @__PURE__ */ jsx("br", {}),
      "通常1〜3営業日以内に返信いたしますので、今しばらくお待ちください。"
    ] })
  ] }) });
  const is = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid var(--line-2)", fontFamily: "inherit", fontSize: 14, outline: "none", background: "var(--bg-1)", color: "var(--ink-0)", transition: "border-color 0.15s" };
  const labelStyle = { fontSize: 12.5, fontWeight: 600, display: "block", marginBottom: 4, color: "var(--ink-0)" };
  const requiredMark = { color: "#e74c3c", marginLeft: 2, fontSize: 12 };
  const selectStyle = { ...is, cursor: "pointer" };
  return /* @__PURE__ */ jsxs(StaticPage, { title: "お問い合わせ", description: "SAP パンダ先生 NAVI へのお問い合わせフォーム。SAP 学習に関するご質問、案件掲載のお問い合わせなど、お気軽にご連絡ください。", path: "/contact", children: [
    !loaded ? /* @__PURE__ */ jsx("div", { style: { color: "var(--ink-3)", padding: 20 }, children: "読み込み中..." }) : pageContent ? /* @__PURE__ */ jsx("div", { className: "art-content", dangerouslySetInnerHTML: { __html: pageContent } }) : /* @__PURE__ */ jsx("p", { children: "SAP パンダ先生 NAVI に関するお問い合わせは、以下のフォームからご連絡ください。" }),
    error && /* @__PURE__ */ jsx("div", { style: { padding: "12px 16px", background: "#fff0f0", color: "#c0392b", borderRadius: 8, fontSize: 13, marginTop: 16, border: "1px solid #f5c6cb" }, children: error }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, style: { display: "flex", flexDirection: "column", gap: 18, marginTop: 24 }, children: [
      /* @__PURE__ */ jsxs("div", { style: { position: "absolute", left: "-9999px" }, "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("label", { children: "ウェブサイト" }),
        /* @__PURE__ */ jsx("input", { type: "text", name: "website", value: form.website, onChange: (e) => update("website", e.target.value), tabIndex: -1, autoComplete: "off" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { style: labelStyle, children: [
            "お名前 ",
            /* @__PURE__ */ jsx("span", { style: requiredMark, children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              style: is,
              value: form.name,
              onChange: (e) => update("name", e.target.value),
              placeholder: "例：山田 太郎",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { style: labelStyle, children: "フリガナ" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              style: is,
              value: form.name_kana,
              onChange: (e) => update("name_kana", e.target.value),
              placeholder: "例：ヤマダ タロウ"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { style: labelStyle, children: [
            "メールアドレス ",
            /* @__PURE__ */ jsx("span", { style: requiredMark, children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              style: is,
              value: form.email,
              onChange: (e) => update("email", e.target.value),
              placeholder: "例：example@sap-panda.com",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { style: labelStyle, children: "電話番号" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "tel",
              style: is,
              value: form.phone,
              onChange: (e) => update("phone", e.target.value),
              placeholder: "例：03-1234-5678"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { style: labelStyle, children: [
          "お問い合わせ種別 ",
          /* @__PURE__ */ jsx("span", { style: requiredMark, children: "*" })
        ] }),
        /* @__PURE__ */ jsx("select", { style: selectStyle, value: form.inquiry_type, onChange: (e) => update("inquiry_type", e.target.value), children: INQUIRY_TYPES.map((t) => /* @__PURE__ */ jsx("option", { value: t.value, children: t.label }, t.value)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { style: labelStyle, children: [
          "お問い合わせ内容 ",
          /* @__PURE__ */ jsx("span", { style: requiredMark, children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            style: { ...is, minHeight: 180, resize: "vertical" },
            value: form.message,
            onChange: (e) => update("message", e.target.value),
            placeholder: "お問い合わせ内容を詳しくご記入ください。",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("label", { style: { display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6 }, children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: form.agreed_privacy,
            onChange: (e) => update("agreed_privacy", e.target.checked),
            style: { marginTop: 3, width: 16, height: 16, cursor: "pointer" }
          }
        ),
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("a", { href: p("/privacy"), target: "_blank", style: { color: "var(--accent-deep)", textDecoration: "underline" }, children: "プライバシーポリシー" }),
          "に同意する ",
          /* @__PURE__ */ jsx("span", { style: requiredMark, children: "*" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12, alignItems: "center", marginTop: 4 }, children: [
        /* @__PURE__ */ jsx("button", { type: "submit", className: "btn primary", disabled: submitting, style: { textDecoration: "none", minWidth: 160, justifyContent: "center" }, children: submitting ? "送信中..." : "送信する" }),
        /* @__PURE__ */ jsx("span", { style: { fontSize: 11.5, color: "var(--ink-3)" }, children: "※ 送信後、確認メールをお送りします" })
      ] })
    ] })
  ] });
}
const DEFAULT_CONTENT$1 = `
  <h2>個人情報の収集について</h2>
  <p>当サイトでは、お問い合わせフォームの送信時に、お名前・メールアドレス等の個人情報をご提供いただく場合がございます。これらの情報は、お問い合わせへの回答のみに利用し、同意なく第三者に提供することはありません。</p>
  <h2>アクセス解析について</h2>
  <p>当サイトでは、サービス向上のためアクセスログを収集することがあります。収集される情報には、閲覧されたページ、日時、ブラウザの種類などが含まれますが、個人を特定する目的では使用しません。</p>
  <h2>Cookie について</h2>
  <p>当サイトでは、ユーザー体験向上のために Cookie を使用することがあります。ブラウザの設定で Cookie を無効にすることも可能です。</p>
  <h2>免責事項</h2>
  <p>当サイトに掲載されている情報の正確性には細心の注意を払っていますが、その完全性・正確性を保証するものではありません。当サイトの情報を利用したことによる損害について、運営者は一切の責任を負いかねます。</p>
  <h2>お問い合わせ</h2>
  <p>プライバシーポリシーに関するお問い合わせは、お問い合わせフォームよりご連絡ください。</p>
`.trim();
function Privacy() {
  const [content, setContent] = useState(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    api.client.get("/pages", { params: { slug: "privacy" } }).then(({ data }) => {
      var _a;
      if (data.success && ((_a = data.data) == null ? void 0 : _a.content)) {
        setContent(data.data.content);
      }
    }).catch(() => {
    }).finally(() => setLoaded(true));
  }, []);
  return /* @__PURE__ */ jsx(StaticPage, { title: "プライバシーポリシー", description: "SAP パンダ先生 NAVI（sap-navi.aladdin-techec.com）のプライバシーポリシー。個人情報の取り扱い、Cookie ポリシーについて説明します。", path: "/privacy", children: !loaded ? /* @__PURE__ */ jsx("div", { style: { color: "var(--ink-3)", padding: 20 }, children: "読み込み中..." }) : /* @__PURE__ */ jsx("div", { className: "art-content", dangerouslySetInnerHTML: { __html: content || DEFAULT_CONTENT$1 } }) });
}
const DEFAULT_CONTENT = `
  <h2>はじめに</h2>
  <p>本規約は、SAP パンダ先生 NAVI（以下「当サイト」）の利用条件を定めるものです。当サイトをご利用になることで、本規約に同意したものとみなします。</p>
  <h2>知的財産権</h2>
  <p>当サイトに掲載されている記事、画像、ロゴ等のコンテンツは、特別な断りがない限り運営者に帰属します。無断転載・複製を禁止します。</p>
  <h2>禁止行為</h2>
  <p>当サイトのご利用にあたり、以下の行為を禁止します：</p>
  <ul><li>他のユーザーまたは第三者に迷惑・不利益を与える行為</li><li>当サイトの運営を妨害する行為</li><li>法令または公序良俗に違反する行為</li><li>当サイトのコンテンツを無断で転載・複製する行為</li></ul>
  <h2>免責事項</h2>
  <p>当サイトの情報は、SAP に関する学習・参考を目的として提供されています。実際のシステム設定や運用は、必ず公式ドキュメントや専門家の指導のもとで行ってください。</p>
  <h2>規約の変更</h2>
  <p>当サイトは、予告なく本規約を変更することがあります。変更後の規約は、当サイトに掲載された時点で効力を生じるものとします。</p>
  <p style="margin-top:24px;color:var(--ink-2);font-size:13px">制定日: 2026年1月1日</p>
`.trim();
function Terms() {
  const [content, setContent] = useState(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    api.client.get("/pages", { params: { slug: "terms" } }).then(({ data }) => {
      var _a;
      if (data.success && ((_a = data.data) == null ? void 0 : _a.content)) {
        setContent(data.data.content);
      }
    }).catch(() => {
    }).finally(() => setLoaded(true));
  }, []);
  return /* @__PURE__ */ jsx(StaticPage, { title: "利用規約", description: "SAP パンダ先生 NAVI の利用規約。サイトご利用にあたっての条件、免責事項、禁止事項を定めます。", path: "/terms", children: !loaded ? /* @__PURE__ */ jsx("div", { style: { color: "var(--ink-3)", padding: 20 }, children: "読み込み中..." }) : /* @__PURE__ */ jsx("div", { className: "art-content", dangerouslySetInnerHTML: { __html: content || DEFAULT_CONTENT } }) });
}
const NAV_ITEMS = [
  { to: "/", label: "ホーム", icon: "🏠", activeIcon: "🏠" },
  { to: "/modules", label: "モジュール", icon: "🧩", activeIcon: "🧩" },
  { to: "/paths", label: "学習パス", icon: "🎯", activeIcon: "🎯" },
  { to: "/cases", label: "案件", icon: "💼", activeIcon: "💼" }
];
function MobileBottomNav() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  if (pathname.startsWith("/admin")) return null;
  return /* @__PURE__ */ jsxs("nav", { className: "mob-bottom-nav", children: [
    NAV_ITEMS.map((item) => {
      const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
      return /* @__PURE__ */ jsxs(
        Link,
        {
          to: item.to,
          className: `mob-nav-item ${active ? "active" : ""}`,
          children: [
            /* @__PURE__ */ jsx("span", { className: "mob-nav-icon", children: active ? item.activeIcon : item.icon }),
            /* @__PURE__ */ jsx("span", { className: "mob-nav-label", children: item.label })
          ]
        },
        item.to
      );
    }),
    user ? /* @__PURE__ */ jsxs(Link, { to: "/profile", className: `mob-nav-item ${pathname.startsWith("/profile") ? "active" : ""}`, children: [
      /* @__PURE__ */ jsx("span", { className: "mob-nav-icon", children: "👤" }),
      /* @__PURE__ */ jsx("span", { className: "mob-nav-label", children: "マイページ" })
    ] }) : /* @__PURE__ */ jsxs(Link, { to: "/login", className: "mob-nav-item", children: [
      /* @__PURE__ */ jsx("span", { className: "mob-nav-icon", children: "🔑" }),
      /* @__PURE__ */ jsx("span", { className: "mob-nav-label", children: "ログイン" })
    ] })
  ] });
}
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
function App() {
  return /* @__PURE__ */ jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsx(ScrollToTop, {}),
    /* @__PURE__ */ jsxs(Routes, { children: [
      /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(HomePage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/article/:id/:slug", element: /* @__PURE__ */ jsx(ArticlePage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/category/:module", element: /* @__PURE__ */ jsx(CategoryPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/login", element: /* @__PURE__ */ jsx(LoginPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/register", element: /* @__PURE__ */ jsx(RegisterPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/profile", element: /* @__PURE__ */ jsx(ProfilePage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/membership", element: /* @__PURE__ */ jsx(MembershipPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/paths", element: /* @__PURE__ */ jsx(PathsPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/quiz-page", element: /* @__PURE__ */ jsx(QuizPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/learning/:id", element: /* @__PURE__ */ jsx(LearningPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/step/:id", element: /* @__PURE__ */ jsx(StepPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/about", element: /* @__PURE__ */ jsx(About, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/team", element: /* @__PURE__ */ jsx(Team, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/contact", element: /* @__PURE__ */ jsx(Contact, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/privacy", element: /* @__PURE__ */ jsx(Privacy, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/terms", element: /* @__PURE__ */ jsx(Terms, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/course/:id", element: /* @__PURE__ */ jsx(CoursePage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/knowledge/:id/:slug", element: /* @__PURE__ */ jsx(KnowledgePage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/lesson/:id/:slug", element: /* @__PURE__ */ jsx(LessonPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/note/:id/:slug", element: /* @__PURE__ */ jsx(NotePage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/video", element: /* @__PURE__ */ jsx(VideoPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/search", element: /* @__PURE__ */ jsx(SearchPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/glossary", element: /* @__PURE__ */ jsx(TopicPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/trends", element: /* @__PURE__ */ jsx(TopicPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/career", element: /* @__PURE__ */ jsx(TopicPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/modules", element: /* @__PURE__ */ jsx(ModulesPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/cases", element: /* @__PURE__ */ jsx(CasesPage, {}) }),
      /* @__PURE__ */ jsxs(Route, { path: "/admin", element: /* @__PURE__ */ jsx(AdminLayout, {}), children: [
        /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(Dashboard, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "articles", element: /* @__PURE__ */ jsx(ArticlesList, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "articles/new", element: /* @__PURE__ */ jsx(ArticleForm, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "articles/:id/edit", element: /* @__PURE__ */ jsx(ArticleForm, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "modules", element: /* @__PURE__ */ jsx(AdminModules, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "modules/new", element: /* @__PURE__ */ jsx(ModuleForm, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "modules/:slug/edit", element: /* @__PURE__ */ jsx(ModuleForm, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "courses", element: /* @__PURE__ */ jsx(CoursesList, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "courses/new", element: /* @__PURE__ */ jsx(CourseForm, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "courses/:id/edit", element: /* @__PURE__ */ jsx(CourseForm, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "lessons", element: /* @__PURE__ */ jsx(LessonsList, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "lessons/new", element: /* @__PURE__ */ jsx(LessonForm, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "lessons/:id/edit", element: /* @__PURE__ */ jsx(LessonForm, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "knowledge", element: /* @__PURE__ */ jsx(KnowledgeList, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "knowledge/new", element: /* @__PURE__ */ jsx(KnowledgeForm, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "knowledge/:id/edit", element: /* @__PURE__ */ jsx(KnowledgeForm, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "cases", element: /* @__PURE__ */ jsx(CasesList, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "cases/new", element: /* @__PURE__ */ jsx(CaseForm, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "cases/:id/edit", element: /* @__PURE__ */ jsx(CaseForm, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "videos", element: /* @__PURE__ */ jsx(VideosList, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "videos/new", element: /* @__PURE__ */ jsx(VideoForm, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "videos/:id/edit", element: /* @__PURE__ */ jsx(VideoForm, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "applications", element: /* @__PURE__ */ jsx(ApplicationsList, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "users", element: /* @__PURE__ */ jsx(UsersList, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "pages", element: /* @__PURE__ */ jsx(SitePages, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "quizzes", element: /* @__PURE__ */ jsx(QuizList, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "quizzes/new", element: /* @__PURE__ */ jsx(QuizForm, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "quizzes/:id/edit", element: /* @__PURE__ */ jsx(QuizForm, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "learning-paths", element: /* @__PURE__ */ jsx(LearningPathsList, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "learning-paths/new", element: /* @__PURE__ */ jsx(LearningPathForm, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "learning-paths/:id/edit", element: /* @__PURE__ */ jsx(LearningPathForm, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "contact", element: /* @__PURE__ */ jsx(ContactInquiriesList, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "notes", element: /* @__PURE__ */ jsx(NoteList, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "notes/new", element: /* @__PURE__ */ jsx(NoteForm, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "notes/:id/edit", element: /* @__PURE__ */ jsx(NoteForm, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "plugins", element: /* @__PURE__ */ jsx(PluginsManager, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "seo-geo", element: /* @__PURE__ */ jsx(SeoGeoManager, {}) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(MobileBottomNav, {})
  ] });
}
function render(options) {
  const { path, basename = "" } = options;
  const appHtml = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(StaticRouter, { location: path, basename, children: /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(App, {}) }) })
  );
  return { html: appHtml };
}
export {
  render
};
//# sourceMappingURL=entry-server.js.map
