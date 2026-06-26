import { Routes, Route, useLocation } from 'react-router-dom'
import './styles/admin.css'
import AdminLayout from './pages/admin/AdminLayout'
import CoursesList from './pages/admin/CoursesList'
import CourseForm from './pages/admin/CourseForm'
import KnowledgeList from './pages/admin/KnowledgeList'
import KnowledgeForm from './pages/admin/KnowledgeForm'
import LessonsList from './pages/admin/LessonsList'
import LessonForm from './pages/admin/LessonForm'
import LearningPathsList from './pages/admin/LearningPathsList'
import LearningPathForm from './pages/admin/LearningPathForm'
import AdminModules from './pages/admin/AdminModules'
import ModuleForm from './pages/admin/ModuleForm'
import ArticlesList from './pages/admin/ArticlesList'
import ArticleForm from './pages/admin/ArticleForm'
import CasesList from './pages/admin/CasesList'
import CaseForm from './pages/admin/CaseForm'
import VideosList from './pages/admin/VideosList'
import VideoForm from './pages/admin/VideoForm'
import ApplicationsList from './pages/admin/ApplicationsList'
import UsersList from './pages/admin/UsersList'
import SitePages from './pages/admin/SitePages'
import QuizList from './pages/admin/QuizList'
import QuizForm from './pages/admin/QuizForm'
import Dashboard from './pages/admin/Dashboard'
import ContactInquiriesList from './pages/admin/ContactInquiriesList'
import PluginsManager from './pages/admin/PluginsManager'
import SeoGeoManager from './pages/admin/SeoGeoManager'
import NoteList from './pages/admin/NoteList'
import NoteForm from './pages/admin/NoteForm'
import { useEffect } from 'react'
import { AuthProvider } from './hooks/useAuth'
import HomePage from './pages/Home'
import ArticlePage from './pages/Article'
import CategoryPage from './pages/Category'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import ProfilePage from './pages/Profile'
import MembershipPage from './pages/Membership'
import CasesPage from './pages/Cases'
import ModulesPage from './pages/Modules'
import PathsPage from './pages/PathsPage'
import QuizPage from './pages/QuizPage'
import LearningPage from './pages/LearningPage'
import StepPage from './pages/StepPage'
import VideoPage from './pages/VideoPage'
import CoursePage from './pages/CoursePage'
import KnowledgePage from './pages/KnowledgePage'
import LessonPage from './pages/LessonPage'
import NotePage from './pages/NotePage'
import SearchPage from './pages/SearchPage'
import TopicPage from './pages/TopicPage'
import About from './pages/About'
import Team from './pages/Team'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import MobileBottomNav from './components/layout/MobileBottomNav'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/article/:id/:slug" element={<ArticlePage />} />
        <Route path="/category/:module" element={<CategoryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/paths" element={<PathsPage />} />
        <Route path="/quiz-page" element={<QuizPage />} />
        <Route path="/learning/:id" element={<LearningPage />} />
        <Route path="/step/:id" element={<StepPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/team" element={<Team />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/course/:id" element={<CoursePage />} />
        <Route path="/knowledge/:id/:slug" element={<KnowledgePage />} />
        <Route path="/lesson/:id/:slug" element={<LessonPage />} />
        <Route path="/note/:id/:slug" element={<NotePage />} />
        <Route path="/video" element={<VideoPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/glossary" element={<TopicPage />} />
        <Route path="/trends" element={<TopicPage />} />
        <Route path="/career" element={<TopicPage />} />
        <Route path="/modules" element={<ModulesPage />} />
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="articles" element={<ArticlesList />} />
          <Route path="articles/new" element={<ArticleForm />} />
          <Route path="articles/:id/edit" element={<ArticleForm />} />
          <Route path="modules" element={<AdminModules />} />
          <Route path="modules/new" element={<ModuleForm />} />
          <Route path="modules/:slug/edit" element={<ModuleForm />} />
          <Route path="courses" element={<CoursesList />} />
          <Route path="courses/new" element={<CourseForm />} />
          <Route path="courses/:id/edit" element={<CourseForm />} />
          <Route path="lessons" element={<LessonsList />} />
          <Route path="lessons/new" element={<LessonForm />} />
          <Route path="lessons/:id/edit" element={<LessonForm />} />
          <Route path="knowledge" element={<KnowledgeList />} />
          <Route path="knowledge/new" element={<KnowledgeForm />} />
          <Route path="knowledge/:id/edit" element={<KnowledgeForm />} />
          <Route path="cases" element={<CasesList />} />
          <Route path="cases/new" element={<CaseForm />} />
          <Route path="cases/:id/edit" element={<CaseForm />} />
          <Route path="videos" element={<VideosList />} />
          <Route path="videos/new" element={<VideoForm />} />
          <Route path="videos/:id/edit" element={<VideoForm />} />
          <Route path="applications" element={<ApplicationsList />} />
          <Route path="users" element={<UsersList />} />
          <Route path="pages" element={<SitePages />} />
          <Route path="quizzes" element={<QuizList />} />
          <Route path="quizzes/new" element={<QuizForm />} />
          <Route path="quizzes/:id/edit" element={<QuizForm />} />
          <Route path="learning-paths" element={<LearningPathsList />} />
          <Route path="learning-paths/new" element={<LearningPathForm />} />
          <Route path="learning-paths/:id/edit" element={<LearningPathForm />} />
          <Route path="contact" element={<ContactInquiriesList />} />
          <Route path="notes" element={<NoteList />} />
          <Route path="notes/new" element={<NoteForm />} />
          <Route path="notes/:id/edit" element={<NoteForm />} />
          <Route path="plugins" element={<PluginsManager />} />
          <Route path="seo-geo" element={<SeoGeoManager />} />
        </Route>
      </Routes>
      <MobileBottomNav />
    </AuthProvider>
  )
}
