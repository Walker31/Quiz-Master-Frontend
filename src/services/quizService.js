import api from "./api";

/**
 * Quiz Builder & Assignment Service (v1)
 * Manages the creation of Quizzes, Sections, and their distribution.
 */
export const quizService = {
  // ── Quizzes ─────────────────────────────────────────────────────────────────
  getQuizzes: (params) => api.get("/api/v1/quiz/quizzes/", { params }),
  getQuizDetails: (id) => api.get(`/api/v1/quiz/quizzes/${id}/`),
  createQuiz: (data) => api.post("/api/v1/quiz/quizzes/", data),
  updateQuiz: (id, data) => api.patch(`/api/v1/quiz/quizzes/${id}/`, data),
  deleteQuiz: (id) => api.delete(`/api/v1/quiz/quizzes/${id}/`),
  
  publishQuiz: (id) => api.post(`/api/v1/quiz/quizzes/${id}/publish/`),

  // ── Quiz Sections ──────────────────────────────────────────────────────────
  // Per-subject sections within a quiz (e.g. Physics Section)
  getSections: (params) => api.get("/api/v1/quiz/sections/", { params }),
  createSection: (data) => api.post("/api/v1/quiz/sections/", data),
  updateSection: (id, data) => api.patch(`/api/v1/quiz/sections/${id}/`, data),
  deleteSection: (id) => api.delete(`/api/v1/quiz/sections/${id}/`),

  // ── Quiz Questions (The mapping) ───────────────────────────────────────────
  // Links a question bank item into a specific quiz section
  addQuestionToSection: (data) => api.post("/api/v1/quiz/questions/", data),
  updateQuizQuestion: (id, data) => api.patch(`/api/v1/quiz/questions/${id}/`, data),
  removeQuestionFromSection: (id) => api.delete(`/api/v1/quiz/questions/${id}/`),

  // ── Assignments ────────────────────────────────────────────────────────────
  getAssignments: (params) => api.get("/api/v1/quiz/assignments/", { params }),
  createAssignment: (data) => api.post("/api/v1/quiz/assignments/", data),
  deleteAssignment: (id) => api.delete(`/api/v1/quiz/assignments/${id}/`),
};

export default quizService;
