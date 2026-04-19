import api from "./api";

/**
 * Content Bank Management (v1)
 * Hierarchy: ExamType -> Subject -> Chapter -> Question -> Option
 */
export const contentService = {
  // ── Exam Types ──────────────────────────────────────────────────────────────
  getExamTypes: (params) => api.get("/api/v1/content/exam-types/", { params }),
  createExamType: (data) => api.post("/api/v1/content/exam-types/", data),
  updateExamType: (id, data) => api.patch(`/api/v1/content/exam-types/${id}/`, data),
  deleteExamType: (id) => api.delete(`/api/v1/content/exam-types/${id}/`),

  // ── Subjects ────────────────────────────────────────────────────────────────
  getSubjects: (params) => api.get("/api/v1/content/subjects/", { params }),
  createSubject: (data) => api.post("/api/v1/content/subjects/", data),
  updateSubject: (id, data) => api.patch(`/api/v1/content/subjects/${id}/`, data),
  deleteSubject: (id) => api.delete(`/api/v1/content/subjects/${id}/`),

  // ── Chapters ────────────────────────────────────────────────────────────────
  getChapters: (params) => api.get("/api/v1/content/chapters/", { params }),
  createChapter: (data) => api.post("/api/v1/content/chapters/", data),
  updateChapter: (id, data) => api.patch(`/api/v1/content/chapters/${id}/`, data),
  deleteChapter: (id) => api.delete(`/api/v1/content/chapters/${id}/`),

  // ── Questions ───────────────────────────────────────────────────────────────
  getQuestions: (params) => api.get("/api/v1/content/questions/", { params }),
  getQuestionDetails: (id) => api.get(`/api/v1/content/questions/${id}/`),
  createQuestion: (data) => api.post("/api/v1/content/questions/", data),
  updateQuestion: (id, data) => api.patch(`/api/v1/content/questions/${id}/`, data),
  deleteQuestion: (id) => api.delete(`/api/v1/content/questions/${id}/`),

  /**
   * Bulk import questions via CSV
   * @param {File} file - CSV file
   */
  bulkImport: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/v1/content/questions/bulk-import/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // ── Tags ───────────────────────────────────────────────────────────────────
  getTags: (params) => api.get("/api/v1/content/tags/", { params }),
  createTag: (data) => api.post("/api/v1/content/tags/", data),
};

export default contentService;
