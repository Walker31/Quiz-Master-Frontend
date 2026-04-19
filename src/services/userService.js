import api from "./api";

/**
 * User & Batch Management (v1)
 * Used by Admins to manage students and by students to see their batches.
 */
export const userService = {
  // ── Batches ─────────────────────────────────────────────────────────────────
  getBatches: (params) => api.get("/api/v1/admin/batches/", { params }),
  getBatchDetails: (id) => api.get(`/api/v1/admin/batches/${id}/`),
  createBatch: (data) => api.post("/api/v1/admin/batches/", data),
  updateBatch: (id, data) => api.patch(`/api/v1/admin/batches/${id}/`, data),
  deleteBatch: (id) => api.delete(`/api/v1/admin/batches/${id}/`),

  addStudentToBatch: (batchId, studentId) => 
    api.post(`/api/v1/admin/batches/${batchId}/add-student/`, { student_id: studentId }),
  
  removeStudentFromBatch: (batchId, studentId) => 
    api.post(`/api/v1/admin/batches/${batchId}/remove-student/`, { student_id: studentId }),

  // ── Admin-User Listing ──────────────────────────────────────────────────────
  // Superadmin sees all; Admin sees students in their batches.
  getUsers: (params) => api.get("/api/v1/admin/users/", { params }),
  createUser: (data) => api.post("/api/v1/admin/users/", data), // Superadmin only
  updateUser: (id, data) => api.patch(`/api/v1/admin/users/${id}/`, data),
  deleteUser: (id) => api.delete(`/api/v1/admin/users/${id}/`),
};

export default userService;
