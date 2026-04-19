import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

// Public pages
import HomePage from "@/pages/public/HomePage";

// Auth pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";

// Admin pages
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminOverview from "@/pages/admin/AdminOverview";
import ManageSubjects from "@/pages/admin/ManageSubjects";
import ManageQuestions from "@/pages/admin/ManageQuestions";
import ManageQuizzes from "@/pages/admin/ManageQuizzes";
import AdminSummary from "@/pages/admin/AdminSummary";
import GenerateQuestionPaper from "@/pages/admin/GenerateQuestionPaper";
import ExamTypesPage from "@/pages/admin/ExamTypesPage";
import ChaptersPage from "@/pages/admin/ChaptersPage";
import BulkImportQuestionsPage from "@/pages/admin/BulkImportQuestionsPage";
import QuizBuilderPage from "@/pages/admin/QuizBuilderPage";
import QuizPreviewPage from "@/pages/admin/QuizPreviewPage";
import QuizAssignmentsPage from "@/pages/admin/QuizAssignmentsPage";
import BatchesPage from "@/pages/admin/BatchesPage";
import StudentsPage from "@/pages/admin/StudentsPage";
import StudentDetailPage from "@/pages/admin/StudentDetailPage";
import QuizAnalyticsPage from "@/pages/admin/QuizAnalyticsPage";
import StudentAnalyticsPage from "@/pages/admin/StudentAnalyticsPage";
import LeaderboardPage from "@/pages/admin/LeaderboardPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import AdminProfilePage from "@/pages/admin/AdminProfilePage";

// Student/User pages
import UserDashboard from "@/pages/user/UserDashboard";
import QuizTaking from "@/pages/user/QuizTaking";
import UserScores from "@/pages/user/UserScores";
import AllQuizzesPage from "@/pages/user/AllQuizzesPage";
import MyAssignmentsPage from "@/pages/user/MyAssignmentsPage";
import QuizDetailPage from "@/pages/user/QuizDetailPage";
import QuizAttemptWindow from "@/pages/user/QuizAttemptWindow";
import QuizResultPage from "@/pages/user/QuizResultPage";
import SolutionReviewPage from "@/pages/user/SolutionReviewPage";
import AttemptHistoryPage from "@/pages/user/AttemptHistoryPage";
import UserAnalyticsPage from "@/pages/user/UserAnalyticsPage";
import StudentLeaderboardPage from "@/pages/user/StudentLeaderboardPage";
import StudentProfilePage from "@/pages/user/StudentProfilePage";

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
        <Route path="/student/attempt/:id" element={<ProtectedRoute><QuizAttemptWindow /></ProtectedRoute>} />
        <Route path="/student/result/:id" element={<ProtectedRoute><QuizResultPage /></ProtectedRoute>} />
        <Route path="/student/review/:id" element={<ProtectedRoute><SolutionReviewPage /></ProtectedRoute>} />
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
