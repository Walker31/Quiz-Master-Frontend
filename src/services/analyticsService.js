import api from "./api";

/**
 * Analytics & Statistics Service (v1)
 * Used for Dashboards, Leaderboards, and Performance tracking.
 */
export const analyticsService = {
  /**
   * Fetch aggregated stats for the Admin Dashboard.
   * Returns: { total_students, total_quizzes, total_questions, active_exams, avg_score }
   */
  getAdminDashboardStats: () => api.get("/api/v1/analytics/dashboard-stats/"),

  /**
   * Fetch top 10 performers for a specific quiz.
   * @param {number} quizId 
   */
  getLeaderboard: (quizId) => api.get(`/api/v1/analytics/leaderboard/${quizId}/`),

  /**
   * Fetch the current student's performance history.
   * Returns: { history: [...], total_exams, avg_percentage }
   */
  getStudentPerformance: () => api.get("/api/v1/analytics/performance/"),
};

export default analyticsService;
