import { useState } from "react";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const QUESTION_TYPES = [
  { id: "mcq", label: "Multiple Choice", icon: "📋", desc: "Select one correct answer" },
  { id: "true_false", label: "True / False", icon: "✓✗", desc: "Simple true or false" },
  { id: "short_answer", label: "Short Answer", icon: "📝", desc: "Type a brief answer" },
  { id: "essay", label: "Essay", icon: "📄", desc: "Long-form answer" },
  { id: "fill_blank", label: "Fill in Blank", icon: "___", desc: "Complete the sentence" },
];

function AddQuestionModal({ open, onClose, onSubmit, chapterName }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    text: "",
    type: "mcq",
    difficulty: 5,
    marks: 1,
    options: ["", ""],
    correct_answer: "0",
    explanation: "",
  });

  const handleTypeSelect = (typeId) => {
    setForm((prev) => ({ ...prev, type: typeId }));
    if (typeId !== "mcq") {
      setForm((prev) => ({ ...prev, options: [] }));
    }
  };

  const handleAddOption = () => {
    setForm((prev) => ({ ...prev, options: [...prev.options, ""] }));
  };

  const handleRemoveOption = (index) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm((prev) => ({ ...prev, options: newOptions }));
  };

  const getDifficultyLabel = (value) => {
    if (value <= 3) return "Easy";
    if (value <= 6) return "Medium";
    return "Hard";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.text.trim()) {
      alert("Please enter the question text");
      return;
    }
    if (form.type === "mcq" && form.options.some((opt) => !opt.trim())) {
      alert("Please fill all options");
      return;
    }
    onSubmit(form);
    resetForm();
  };

  const resetForm = () => {
    setStep(1);
    setForm({
      text: "",
      type: "mcq",
      difficulty: 5,
      marks: 1,
      options: ["", ""],
      correct_answer: "0",
      explanation: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden transition-all bg-white dark:bg-[#1d2332] border border-[#e0e4ec] dark:border-[#2d3748]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-(--color-border) bg-linear-to-r from-(--color-accent-light) to-transparent">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-(--color-accent) flex items-center justify-center text-white text-lg">
              ❓
            </div>
            <div>
              <h2 className="theme-heading text-xl font-bold">Add Question</h2>
              <p className="text-xs theme-text-muted mt-0.5">
                {chapterName} • Step {step} of 3
              </p>
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
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {step === 1 ? (
            <div className="space-y-6">
              {/* Question Text */}
              <div>
                <label className="flex items-center gap-2 theme-text-secondary text-sm font-semibold mb-3">
                  <BookmarkIcon fontSize="small" />
                  Question Text *
                </label>
                <textarea
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  placeholder="Enter the question here... Use $equation$ for inline math or $$equation$$ for display math (LaTeX)"
                  rows={4}
                  className="theme-input w-full px-4 py-3 text-sm rounded-xl border border-(--color-border) focus:ring-2 focus:ring-(--color-accent) focus:border-transparent resize-none"
                />
                <div className="mt-2 p-3 bg-(--color-bg-secondary) rounded-lg text-xs theme-text-muted space-y-1">
                  <p className="font-semibold theme-text-secondary">💡 Math Equations Support:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Inline: use $equation$</li>
                    <li>Display: use $$equation$$</li>
                    <li>Examples: $x^2 + y^2 = z^2$, $$\frac{'a'}{'b'}$$, $\sqrt{'4'} = 2$</li>
                  </ul>
                </div>
              </div>

              {/* Question Type */}
              <div>
                <label className="flex items-center gap-2 theme-text-secondary text-sm font-semibold mb-4">
                  📌 Question Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {QUESTION_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleTypeSelect(type.id)}
                      className={`p-3 rounded-xl transition-all border-2 text-center ${
                        form.type === type.id
                          ? "border-(--color-accent) bg-(--color-accent-light)"
                          : "border-(--color-border) hover:border-(--color-accent-light)"
                      }`}
                      title={type.desc}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <p className="text-xs font-medium theme-heading">{type.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : step === 2 ? (
            <div className="space-y-6">
              {/* Difficulty */}
              <div>
                <label className="theme-text-secondary text-sm font-semibold mb-3 block">
                  Difficulty Level (1-10)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: parseInt(e.target.value) })}
                    className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-(--color-bg-secondary)"
                    style={{
                      background: `linear-gradient(to right, #27ae60 0%, #27ae60 ${((form.difficulty - 1) / 9) * 100}%, var(--color-bg-secondary) ${((form.difficulty - 1) / 9) * 100}%, var(--color-bg-secondary) 100%)`,
                    }}
                  />
                  <div className="flex items-center gap-2 min-w-max">
                    <span className="text-2xl font-bold theme-heading">{form.difficulty}</span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-(--color-bg-secondary) theme-text-secondary">
                      {getDifficultyLabel(form.difficulty)}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex justify-between text-xs theme-text-muted">
                  <span>Easy (1-3)</span>
                  <span>Medium (4-6)</span>
                  <span>Hard (7-10)</span>
                </div>
              </div>

              {/* Marks */}
              <div>
                <label className="theme-text-secondary text-sm font-semibold mb-3 block">Marks</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={form.marks}
                  onChange={(e) => setForm({ ...form, marks: parseInt(e.target.value) || 1 })}
                  className="theme-input w-full px-4 py-3 text-sm rounded-xl border border-(--color-border) focus:ring-2 focus:ring-(--color-accent)"
                />
              </div>

              {/* Options for MCQ */}
              {form.type === "mcq" && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="theme-text-secondary text-sm font-semibold">Options *</label>
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="flex items-center gap-1 text-xs font-semibold text-(--color-accent) hover:text-(--color-accent-hover)"
                    >
                      <AddIcon style={{ fontSize: 14 }} /> Add Option
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.options.map((option, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correct"
                          value={idx.toString()}
                          checked={form.correct_answer === idx.toString()}
                          onChange={(e) => setForm({ ...form, correct_answer: e.target.value })}
                          className="mt-2"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(idx, e.target.value)}
                          placeholder={`Option ${idx + 1}`}
                          className="flex-1 theme-input px-3 py-2 text-sm rounded-lg border border-(--color-border)"
                        />
                        {form.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(idx)}
                            className="p-2 rounded-lg hover:bg-[rgba(231,76,60,0.1)] text-[#e74c3c] transition-colors"
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Explanation */}
              <div>
                <label className="flex items-center gap-2 theme-text-secondary text-sm font-semibold mb-3">
                  <DescriptionIcon fontSize="small" />
                  Explanation (Optional)
                </label>
                <textarea
                  value={form.explanation}
                  onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                  placeholder="Provide an explanation for the correct answer..."
                  rows={4}
                  className="theme-input w-full px-4 py-3 text-sm rounded-xl border border-(--color-border) focus:ring-2 focus:ring-(--color-accent) focus:border-transparent resize-none"
                />
              </div>

              {/* Review */}
              <div className="bg-(--color-bg-secondary) rounded-lg p-4">
                <p className="text-xs font-semibold theme-text-secondary mb-3">Question Summary</p>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="theme-text-muted">Type:</span>
                    <span className="ml-2 font-semibold theme-heading">
                      {QUESTION_TYPES.find((t) => t.id === form.type)?.label}
                    </span>
                  </p>
                  <p>
                    <span className="theme-text-muted">Difficulty:</span>
                    <span className="ml-2 font-semibold theme-heading">
                      {form.difficulty}/10 ({getDifficultyLabel(form.difficulty)})
                    </span>
                  </p>
                  <p>
                    <span className="theme-text-muted">Marks:</span>
                    <span className="ml-2 font-semibold theme-heading">{form.marks}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-(--color-border) bg-(--color-bg-tertiary)/50">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
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
              if (step < 3) {
                setStep(step + 1);
              } else {
                handleSubmit(e);
              }
            }}
            className="px-6 py-2.5 text-sm font-medium rounded-lg bg-(--color-accent) text-white hover:bg-(--color-accent-hover) transition-colors flex items-center gap-2"
          >
            {step === 3 ? (
              <>
                <CheckCircleIcon style={{ fontSize: 16 }} /> Add Question
              </>
            ) : (
              "Next"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddQuestionModal;
