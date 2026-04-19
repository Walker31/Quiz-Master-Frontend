import { useState, useEffect } from "react";
import { contentService } from "@/services/quizService";
import Modal from "@/components/Modal";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DescriptionIcon from "@mui/icons-material/Description";
import SchoolIcon from "@mui/icons-material/School";
import AddIcon from "@mui/icons-material/Add";

export function AddSubjectModal({ open, onClose, onSubmit }) {
  const [examTypes, setExamTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    exam_type: "",
    code: ""
  });

  useEffect(() => {
    if (open) {
      const fetchExamTypes = async () => {
        setLoading(true);
        try {
          const res = await contentService.getExamTypes();
          setExamTypes(res.data);
          if (res.data.length > 0) {
            setForm(prev => ({ ...prev, exam_type: res.data[0].id }));
          }
        } catch (e) {
          console.error("Failed to fetch exam types", e);
        } finally {
          setLoading(false);
        }
      };
      fetchExamTypes();
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ name: "", description: "", exam_type: examTypes[0]?.id || "", code: "" });
  };

  return (
    <Modal open={open} onClose={onClose} title="Add New Subject">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="flex items-center gap-2 theme-text-secondary text-sm font-bold mb-2">
            <SchoolIcon fontSize="small" />
            Exam Type *
          </label>
          <select
            value={form.exam_type}
            onChange={(e) => setForm({ ...form, exam_type: e.target.value })}
            required
            className="theme-input w-full px-4 py-3 text-sm rounded-xl border border-(--color-border) focus:ring-2 focus:ring-(--color-accent)"
          >
            {loading ? <option>Loading...</option> : null}
            {examTypes.map(et => (
              <option key={et.id} value={et.id}>{et.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 theme-text-secondary text-sm font-bold mb-2">
            <BookmarkIcon fontSize="small" />
            Subject Name *
          </label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Physics, Quantitative Aptitude"
            required
            className="theme-input w-full px-4 py-3 text-sm rounded-xl border border-(--color-border) focus:ring-2 focus:ring-(--color-accent)"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 theme-text-secondary text-sm font-bold mb-2">
            <DescriptionIcon fontSize="small" />
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Provide a brief overview of this subject..."
            rows={3}
            className="theme-input w-full px-4 py-3 text-sm rounded-xl border border-(--color-border) focus:ring-2 focus:ring-(--color-accent) resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-(--color-border)">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium rounded-lg theme-text-secondary hover:bg-(--color-bg-tertiary)"
          >
            Cancel
          </button>
          <button type="submit" className="theme-btn-primary px-6 py-2.5 text-sm font-bold flex items-center gap-2">
            <AddIcon fontSize="small" />
            Create Subject
          </button>
        </div>
      </form>
    </Modal>
  );
}
