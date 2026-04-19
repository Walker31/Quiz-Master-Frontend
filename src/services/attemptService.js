import api from "./api";

/**
 * Exam Engine Service (v1)
 * Used by students during an active quiz session.
 */
export const attemptService = {
  /**
   * Fetches previous attempts or list of available attempts.
   */
  getAttempts: (params) => api.get("/api/v1/attempt/attempts/", { params }),

  /**
   * Fetches a specific attempt's results (if submitted) or state.
   */
  getAttemptDetails: (id) => api.get(`/api/v1/attempt/attempts/${id}/`),

  /**
   * Starts a new attempt for a quiz.
   * @param {number} quizId 
   */
  startAttempt: (quizId) => api.post("/api/v1/attempt/attempts/start/", { quiz_id: quizId }),

  /**
   * Heartbeat to sync time with the server.
   * Should be called every 30-60 seconds.
   */
  syncHeartbeat: (attemptId, elapsedSecs) => 
    api.post(`/api/v1/attempt/attempts/${attemptId}/heartbeat/`, { elapsed_secs: elapsedSecs }),

  /**
   * Save an answer for a specific question.
   * @param {number} attemptId 
   * @param {object} data - { quiz_question_id, visit_status, selected_options, integer_answer, time_spent_secs }
   */
  saveResponse: (attemptId, data) => 
    api.post(`/api/v1/attempt/attempts/${attemptId}/respond/`, data),

  /**
   * Log a proctoring event (tab switch, etc.)
   * @param {number} attemptId 
   * @param {string} type - 'TAB_SWITCH' | 'FULLSCREEN_EXIT'
   */
  logProctorEvent: (attemptId, type) => 
    api.post(`/api/v1/attempt/attempts/${attemptId}/proctor-event/`, { type }),

  /**
   * Submit the entire attempt for evaluation.
   */
  submitAttempt: (attemptId) => 
    api.post(`/api/v1/attempt/attempts/${attemptId}/submit/`),
};

export default attemptService;
