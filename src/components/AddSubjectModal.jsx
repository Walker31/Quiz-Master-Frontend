import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DescriptionIcon from "@mui/icons-material/Description";
import CategoryIcon from "@mui/icons-material/Category";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

const PRESET_CATEGORIES = [
  { id: "math", label: "Mathematics", icon: "📐", color: "#2b73d0" },
  { id: "science", label: "Science", icon: "🔬", color: "#27ae60" },
  { id: "english", label: "English", icon: "📚", color: "#8b5cf6" },
  { id: "history", label: "History", icon: "📜", color: "#f59e0b" },
  { id: "geography", label: "Geography", icon: "🗺️", color: "#06b6d4" },
  { id: "cs", label: "Computer Science", icon: "💻", color: "#e74c3c" },
];

function AddSubjectModal({ open, onClose, onSubmit }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    difficulty: "intermediate",
    icon: "",
  });
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (categoryId) => {
    const category = PRESET_CATEGORIES.find((c) => c.id === categoryId);
    setSelectedCategory(categoryId);
    setForm((prev) => ({ ...prev, category: categoryId, icon: category.icon }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
    setStep(1);
    setForm({ name: "", description: "", category: "", difficulty: "intermediate", icon: "" });
    setSelectedCategory(null);
  };

  const handleClose = () => {
    setStep(1);
    setForm({ name: "", description: "", category: "", difficulty: "intermediate", icon: "" });
    setSelectedCategory(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        className={`rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden transition-all ${
          isDark ? "bg-[#1d2332] border border-[#2d3748]" : "bg-white border border-[#e0e4ec]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-(--color-border) bg-linear-to-r from-(--color-accent-light) to-transparent">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-(--color-accent) flex items-center justify-center text-white text-lg">
              📚
            </div>
            <div>
              <h2 className="theme-heading text-xl font-bold">Create New Subject</h2>
              <p className="text-xs theme-text-muted mt-0.5">Step {step} of 2</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-(--color-bg-tertiary) rounded-lg transition-colors"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-(--color-bg-tertiary) flex">
          <div
            className="bg-(--color-accent) transition-all duration-300"
            style={{ width: `${(step / 2) * 100}%` }}
          ></div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {step === 1 ? (
            <div className="space-y-6">
              {/* Subject Name */}
              <div>
                <label className="flex items-center gap-2 theme-text-secondary text-sm font-semibold mb-3">
                  <BookmarkIcon fontSize="small" />
                  Subject Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Advanced Mathematics, Web Development"
                  className="theme-input w-full px-4 py-3 text-sm rounded-xl border border-(--color-border) focus:ring-2 focus:ring-(--color-accent) focus:border-transparent"
                />
                <p className="text-xs theme-text-muted mt-2">Give your subject a clear, descriptive name</p>
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 theme-text-secondary text-sm font-semibold mb-3">
                  <DescriptionIcon fontSize="small" />
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What's this subject about? Include topics covered, target audience, etc."
                  rows={4}
                  className="theme-input w-full px-4 py-3 text-sm rounded-xl border border-(--color-border) focus:ring-2 focus:ring-(--color-accent) focus:border-transparent resize-none"
                />
                <p className="text-xs theme-text-muted mt-2">Help admins and students understand the content</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="flex items-center gap-2 theme-text-secondary text-sm font-semibold mb-4">
                  <CategoryIcon fontSize="small" />
                  Choose a Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PRESET_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`p-4 rounded-xl transition-all border-2 text-center ${
                        selectedCategory === cat.id
                          ? `border-(--color-accent) bg-(--color-accent-light)`
                          : `border-(--color-border) hover:border-(--color-accent-light)`
                      }`}
                    >
                      <div className="text-3xl mb-2">{cat.icon}</div>
                      <p className="text-sm font-medium theme-heading">{cat.label}</p>
                      {selectedCategory === cat.id && (
                        <CheckCircleIcon
                          className="absolute top-2 right-2"
                          style={{ color: "var(--color-accent)" }}
                          fontSize="small"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="theme-text-secondary text-sm font-semibold mb-3 block">Difficulty Level</label>
                <div className="flex gap-3">
                  {[
                    { value: "beginner", label: "Beginner", emoji: "🌱" },
                    { value: "intermediate", label: "Intermediate", emoji: "📈" },
                    { value: "advanced", label: "Advanced", emoji: "🚀" },
                  ].map((level) => (
                    <label
                      key={level.value}
                      className={`flex-1 p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${
                        form.difficulty === level.value
                          ? "border-(--color-accent) bg-(--color-accent-light)"
                          : "border-(--color-border) hover:border-(--color-accent-light)"
                      }`}
                    >
                      <input
                        type="radio"
                        name="difficulty"
                        value={level.value}
                        checked={form.difficulty === level.value}
                        onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                        className="hidden"
                      />
                      <span className="text-2xl block mb-1">{level.emoji}</span>
                      <p className="text-sm font-medium theme-heading">{level.label}</p>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-(--color-border) bg-(--color-bg-tertiary)/50">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 text-sm font-medium rounded-lg theme-text-secondary hover:bg-(--color-bg-tertiary) transition-colors"
            >
              Back
            </button>
          )}
          <div className="flex-1" />
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 text-sm font-medium rounded-lg theme-text-secondary hover:bg-(--color-bg-tertiary) transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={(e) => {
              if (step === 1) {
                setStep(2);
              } else {
                handleSubmit(e);
              }
            }}
            className="px-6 py-2.5 text-sm font-medium rounded-lg bg-(--color-accent) text-white hover:bg-(--color-accent-hover) transition-colors flex items-center gap-2"
          >
            {step === 1 ? "Next" : "Create Subject"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddSubjectModal;
