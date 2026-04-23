import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

// Public pages
import HomePage from "@/pages/public/HomePage";

// Auth pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";

// Admin pages - Layout
import AdminLayout from "@/pages/admin/AdminLayout";

// Admin Dashboard
import AdminOverview from "@/pages/admin/dashboard/AdminOverview";
import AdminSummary from "@/pages/admin/dashboard/AdminSummary";

// Admin Content Management
import ExamTypesPage from "@/pages/admin/content/ExamTypesPage";
import ManageSubjects from "@/pages/admin/content/ManageSubjects";
import ChaptersPage from "@/pages/admin/content/ChaptersPage";
import ManageQuestions from "@/pages/admin/content/ManageQuestions";
import BulkImportQuestionsPage from "@/pages/admin/content/BulkImportQuestionsPage";

// Admin Quiz Management
import ManageQuizzes from "@/pages/admin/quiz/ManageQuizzes";
import QuizBuilderPage from "@/pages/admin/quiz/QuizBuilderPage";
import QuizPreviewPage from "@/pages/admin/quiz/QuizPreviewPage";
import QuizAssignmentsPage from "@/pages/admin/quiz/QuizAssignmentsPage";
import GenerateQuestionPaper from "@/pages/admin/quiz/GenerateQuestionPaper";

// Admin Users & Batches
import BatchesPage from "@/pages/admin/users/BatchesPage";
import StudentsPage from "@/pages/admin/users/StudentsPage";
import StudentDetailPage from "@/pages/admin/users/StudentDetailPage";

// Admin Analytics
import QuizAnalyticsPage from "@/pages/admin/analytics/QuizAnalyticsPage";
import StudentAnalyticsPage from "@/pages/admin/analytics/StudentAnalyticsPage";
import LeaderboardPage from "@/pages/admin/analytics/LeaderboardPage";

// Admin Settings
import SettingsPage from "@/pages/admin/settings/SettingsPage";
import AdminProfilePage from "@/pages/admin/settings/AdminProfilePage";

// Student/User Dashboard
import UserDashboard from "@/pages/user/dashboard/UserDashboard";
import AllQuizzesPage from "@/pages/user/dashboard/AllQuizzesPage";
import MyAssignmentsPage from "@/pages/user/dashboard/MyAssignmentsPage";

// Student Quiz
import QuizDetailPage from "@/pages/user/quiz/QuizDetailPage";
import QuizAttemptWindow from "@/pages/user/quiz/QuizAttemptWindow";

// Student Results & Review
import QuizResultPage from "@/pages/user/results/QuizResultPage";
import SolutionReviewPage from "@/pages/user/results/SolutionReviewPage";
import AttemptHistoryPage from "@/pages/user/results/AttemptHistoryPage";

// Student Analytics
import UserAnalyticsPage from "@/pages/user/analytics/UserAnalyticsPage";
import StudentLeaderboardPage from "@/pages/user/analytics/StudentLeaderboardPage";

// Student Profile
import StudentProfilePage from "@/pages/user/profile/StudentProfilePage";

// Legacy Student pages (backward compatibility)
import QuizTaking from "@/pages/user/QuizTaking";
import UserScores from "@/pages/user/UserScores";

// Other pages
import NotFoundPage from "@/pages/NotFoundPage";

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Admin Nested Routes - Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<AdminOverview />} />

          {/* Content Management */}
          <Route path="exam-types" element={<ExamTypesPage />} />
          <Route path="subjects" element={<ManageSubjects />} />
          <Route path="chapters" element={<ChaptersPage />} />
          <Route path="questions/:chapterId" element={<ManageQuestions />} />
          <Route path="bulk-import" element={<BulkImportQuestionsPage />} />

          {/* Quiz Management */}
          <Route path="quizzes" element={<ManageQuizzes />} />
          <Route path="quiz-builder" element={<QuizBuilderPage />} />
          <Route path="quiz-preview" element={<QuizPreviewPage />} />
          <Route path="quiz-assignments" element={<QuizAssignmentsPage />} />
          <Route path="question-paper" element={<GenerateQuestionPaper />} />

          {/* Batch & Student Management */}
          <Route path="batches" element={<BatchesPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="students/:id" element={<StudentDetailPage />} />

          {/* Analytics */}
          <Route path="quiz-analytics" element={<QuizAnalyticsPage />} />
          <Route path="student-analytics" element={<StudentAnalyticsPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />

          {/* Settings */}
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="summary" element={<AdminSummary />} />
        </Route>

        {/* Student/User Routes */}
        <Route path="/student" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/student/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/student/all-quizzes" element={<ProtectedRoute><AllQuizzesPage /></ProtectedRoute>} />
        <Route path="/student/my-assignments" element={<ProtectedRoute><MyAssignmentsPage /></ProtectedRoute>} />
        <Route path="/student/quiz/:id" element={<ProtectedRoute><QuizDetailPage /></ProtectedRoute>} />
        <Route path="/student/attempt/:attemptId" element={<ProtectedRoute><QuizAttemptWindow /></ProtectedRoute>} />
        <Route path="/student/result/:attemptId" element={<ProtectedRoute><QuizResultPage /></ProtectedRoute>} />
        <Route path="/student/review/:attemptId" element={<ProtectedRoute><SolutionReviewPage /></ProtectedRoute>} />
        <Route path="/student/attempts" element={<ProtectedRoute><AttemptHistoryPage /></ProtectedRoute>} />
        <Route path="/student/analytics" element={<ProtectedRoute><UserAnalyticsPage /></ProtectedRoute>} />
        <Route path="/student/leaderboard" element={<ProtectedRoute><StudentLeaderboardPage /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute><StudentProfilePage /></ProtectedRoute>} />

        {/* Legacy Student Routes (Keep for backward compatibility) */}
        <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/take-quiz/:id" element={<ProtectedRoute><QuizTaking /></ProtectedRoute>} />
        <Route path="/scores" element={<ProtectedRoute><UserScores /></ProtectedRoute>} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
