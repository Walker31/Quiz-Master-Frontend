import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import HomePage from "@/pages/public/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminOverview from "@/pages/admin/AdminOverview";
import ManageSubjects from "@/pages/admin/ManageSubjects";
import ManageQuestions from "@/pages/admin/ManageQuestions";
import ManageQuizzes from "@/pages/admin/ManageQuizzes";
import AdminSummary from "@/pages/admin/AdminSummary";
import GenerateQuestionPaper from "@/pages/admin/GenerateQuestionPaper";
import UserDashboard from "@/pages/user/UserDashboard";
import QuizTaking from "@/pages/user/QuizTaking";
import UserScores from "@/pages/user/UserScores";
import NotFoundPage from "@/pages/NotFoundPage";

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin nested routes - Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="subjects" element={<ManageSubjects />} />
          <Route path="questions/:chapterId" element={<ManageQuestions />} />
          <Route path="quizzes" element={<ManageQuizzes />} />
          <Route path="summary" element={<AdminSummary />} />
          <Route path="question-paper" element={<GenerateQuestionPaper />} />
        </Route>

        {/* User routes */}
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/take-quiz/:id" element={<QuizTaking />} />
        <Route path="/scores" element={<UserScores />} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
