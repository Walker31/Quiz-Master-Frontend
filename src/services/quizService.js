import api from "./api";

// ── Content endpoints (v1) ────────────────────────────────────────────────────
const C = "/api/v1/content";

// ── Legacy quiz endpoints (kept until quiz/attempt apps are fully wired) ──────
const L = "/api/quizzes";

export const contentService = {
  // ExamTypes
  getExamTypes:    (params) => api.get(`${C}/exam-types/`, { params }),
  createExamType:  (data)   => api.post(`${C}/exam-types/`, data),
  updateExamType:  (id, data) => api.patch(`${C}/exam-types/${id}/`, data),
  deleteExamType:  (id)     => api.delete(`${C}/exam-types/${id}/`),

  // Subjects
  getSubjects:     (params) => api.get(`${C}/subjects/`, { params }),
  createSubject:   (data)   => api.post(`${C}/subjects/`, data),
  updateSubject:   (id, data) => api.patch(`${C}/subjects/${id}/`, data),
  deleteSubject:   (id)     => api.delete(`${C}/subjects/${id}/`),

  // Chapters
  getChapters:     (params) => api.get(`${C}/chapters/`, { params }),
  createChapter:   (data)   => api.post(`${C}/chapters/`, data),
  updateChapter:   (id, data) => api.patch(`${C}/chapters/${id}/`, data),
  deleteChapter:   (id)     => api.delete(`${C}/chapters/${id}/`),

  // Questions
  getQuestions:    (params) => api.get(`${C}/questions/`, { params }),
  createQuestion:  (data)   => api.post(`${C}/questions/`, data),
  updateQuestion:  (id, data) => api.patch(`${C}/questions/${id}/`, data),
  deleteQuestion:  (id)     => api.delete(`${C}/questions/${id}/`),
  bulkImport:      (file)   => {
    const form = new FormData();
    form.append("file", file);
    return api.post(`${C}/questions/bulk-import/`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Tags
  getTags:         (params) => api.get(`${C}/tags/`, { params }),
  createTag:       (data)   => api.post(`${C}/tags/`, data),
};

/**
 * quizService — wraps both v1 (content) and legacy endpoints.
 * Legacy endpoints are kept to avoid breaking the existing admin UI
 * until quiz/attempt apps are fully wired.
 */
export const quizService = {
  // ── Admin — subjects / chapters (now served from v1 content API) ──────────
  getSubjects:    (params) => api.get(`${C}/subjects/`, { params }),
  createSubject:  (data)   => api.post(`${C}/subjects/`, data),
  updateSubject:  (id, data) => api.patch(`${C}/subjects/${id}/`, data),
  deleteSubject:  (id)     => api.delete(`${C}/subjects/${id}/`),

  getChapters:    (params) => api.get(`${C}/chapters/`, { params }),
  createChapter:  (data)   => api.post(`${C}/chapters/`, data),
  updateChapter:  (id, data) => api.patch(`${C}/chapters/${id}/`, data),
  deleteChapter:  (id)     => api.delete(`${C}/chapters/${id}/`),

  // ── Admin — quizzes (still on legacy until quiz/ views are wired) ─────────
  getQuizzes:     () => api.get(`${L}/quizzes/`),
  createQuiz:     (data) => api.post(`${L}/quizzes/`, data),
  updateQuiz:     (id, data) => api.patch(`${L}/quizzes/${id}/`, data),
  deleteQuiz:     (id) => api.delete(`${L}/quizzes/${id}/`),
  toggleLive:     (id, is_live) => api.patch(`${L}/quizzes/${id}/`, { is_live }),

  // ── Admin — questions (now served from v1 content API) ────────────────────
  getQuestions:   (params) => api.get(`${C}/questions/`, { params }),
  createQuestion: (data) => api.post(`${C}/questions/`, data),
  updateQuestion: (id, data) => api.patch(`${C}/questions/${id}/`, data),
  deleteQuestion: (id) => api.delete(`${C}/questions/${id}/`),
  bulkImport:     (file) => contentService.bulkImport(file),

  // ── Student — quiz discovery (legacy for now) ─────────────────────────────
  getLiveQuizzes: () => api.get(`${L}/quizzes/live/`),
  getQuizDetails: (id) => api.get(`${L}/quizzes/${id}/`),

  // ── Scores (legacy) ───────────────────────────────────────────────────────
  getScores:      () => api.get(`${L}/scores/`),
  submitScore:    (data) => api.post(`${L}/scores/`, data),
};

export default quizService;
