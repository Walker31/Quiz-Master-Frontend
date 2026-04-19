import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizService } from "@/services/quizService";
import AddQuestionModal from "@/components/AddQuestionModal";
import EmptyState from "@/components/EmptyState";
import StatCard from "@/components/StatCard";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SearchIcon from "@mui/icons-material/Search";
import QuizIcon from "@mui/icons-material/Quiz";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const QUESTION_TYPE_LABELS = {
  mcq: "Multiple Choice",
  true_false: "True/False",
  short_answer: "Short Answer",
  essay: "Essay",
  fill_blank: "Fill Blank",
};

const QUESTION_TYPE_ICONS = {
  mcq: "📋",
  true_false: "✓✗",
  short_answer: "📝",
  essay: "📄",
  fill_blank: "___",
};

const DIFFICULTY_COLORS = {
  easy: { color: "#27ae60", bg: "rgba(39,174,96,0.12)" },
  medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  hard: { color: "#e74c3c", bg: "rgba(231,76,60,0.12)" },
};

function getDifficultyFromRating(rating) {
  if (rating <= 3) return "easy";
  if (rating <= 6) return "medium";
  return "hard";
}

function ManageQuestions() {
  const { chapterId } = useParams();
  const navigate = useNavigate();

  const [chapter, setChapter] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch chapter data
      const chaptersRes = await quizService.getChapters();
      const chap = chaptersRes.data.find((c) => c.id === parseInt(chapterId));
      setChapter(chap);

      // Fetch questions for this chapter
      const questionsRes = await quizService.getQuestions?.();
      if (questionsRes) {
        const chapterQuestions = questionsRes.data.filter((q) => q.chapter === parseInt(chapterId));
        setQuestions(chapterQuestions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId]);

  const handleAddQuestion = async (formData) => {
    try {
      await quizService.createQuestion?.({ ...formData, chapter: parseInt(chapterId) });
      setShowAddModal(false);
      fetchData();
    } catch (e) {
      console.error(e);
      alert("Failed to add question");
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!confirm("Delete this question?")) return;
    try {
      await quizService.deleteQuestion?.(id);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-(--color-accent) border-t-transparent animate-spin" />
          <p className="theme-text-muted text-sm">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/admin/subjects")}
          className="p-2 hover:bg-(--color-bg-tertiary) rounded-lg transition-colors"
          title="Go back"
        >
          <ArrowBackIcon />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="theme-heading text-2xl font-bold">
              {chapter?.name || "Chapter"} - Questions
            </h1>
          </div>
          <p className="theme-text-muted text-sm">Manage quiz questions for this chapter</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="theme-btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"
        >
          <AddIcon fontSize="small" /> Add Question
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          icon={<QuizIcon />}
          iconColor="#2b73d0"
          iconBg="rgba(43,115,208,0.12)"
          value={questions.length}
          label="Total Questions"
        />
        <StatCard
          icon={<AssignmentIcon />}
          iconColor="#8b5cf6"
          iconBg="rgba(139,92,246,0.12)"
          value={questions.filter((q) => getDifficultyFromRating(q.difficulty || 5) === "easy").length}
          label="Easy Questions"
        />
        <StatCard
          icon={<TrendingUpIcon />}
          iconColor="#f59e0b"
          iconBg="rgba(245,158,11,0.12)"
          value={questions.filter((q) => getDifficultyFromRating(q.difficulty || 5) === "medium").length}
          label="Medium Questions"
        />
        <StatCard
          icon={<CheckCircleIcon />}
          iconColor="#e74c3c"
          iconBg="rgba(231,76,60,0.12)"
          value={questions.filter((q) => getDifficultyFromRating(q.difficulty || 5) === "hard").length}
          label="Hard Questions"
        />
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <SearchIcon
          fontSize="small"
          className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted"
        />
        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="theme-input w-full pl-10 pr-4 py-2.5 text-sm rounded-lg"
        />
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <EmptyState
          icon={<QuizIcon style={{ fontSize: 32 }} />}
          title={searchQuery ? "No questions found" : "No questions yet"}
          description={searchQuery
            ? `No questions match "${searchQuery}". Try a different search.`
            : "Add your first question to this chapter."}
          action={
            !searchQuery && (
              <button
                onClick={() => setShowAddModal(true)}
                className="theme-btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"
              >
                <AddIcon fontSize="small" /> Add First Question
              </button>
            )
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((question, index) => {
            const diffCategory = getDifficultyFromRating(question.difficulty || 5);
            const diffColor = DIFFICULTY_COLORS[diffCategory];

            return (
              <div key={question.id} className="theme-card overflow-hidden">
                {/* Question Header */}
                <div className="p-5">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      {/* Question Number and Type */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold theme-text-muted">Q{index + 1}</span>
                        <span className="text-lg">{QUESTION_TYPE_ICONS[question.type || "mcq"]}</span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-(--color-bg-secondary) theme-heading">
                          {QUESTION_TYPE_LABELS[question.type || "mcq"]}
                        </span>
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: diffColor.bg, color: diffColor.color }}
                        >
                          {question.difficulty || 5}/10
                        </span>
                        <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-(--color-bg-secondary) theme-heading">
                          {question.marks || 1} marks
                        </span>
                      </div>

                      {/* Question Text */}
                      <p className="theme-heading text-base font-semibold mb-3 leading-relaxed">
                        {question.text}
                      </p>

                      {/* Options for MCQ */}
                      {question.type === "mcq" && question.options?.length > 0 && (
                        <div className="mt-3 pl-6 space-y-1.5 mb-3">
                          {question.options.map((option, idx) => (
                            <div
                              key={idx}
                              className={`text-sm p-2 rounded-lg ${
                                idx === parseInt(question.correct_answer || 0)
                                  ? "bg-[rgba(39,174,96,0.15)] text-[#27ae60] font-semibold"
                                  : "theme-text-secondary"
                              }`}
                            >
                              {idx === parseInt(question.correct_answer || 0) ? "✓" : "○"} {option}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Explanation */}
                      {question.explanation && (
                        <div className="mt-3 p-3 rounded-lg bg-(--color-bg-secondary) border-l-2 border-(--color-accent)">
                          <p className="text-xs font-semibold theme-text-secondary mb-1">Explanation:</p>
                          <p className="theme-text-muted text-sm">{question.explanation}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="p-2 rounded-lg hover:bg-[rgba(231,76,60,0.1)] text-(--color-text-muted) hover:text-[#e74c3c] transition-colors"
                        title="Delete question"
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Question Modal */}
      <AddQuestionModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddQuestion}
        chapterName={chapter?.name || "Chapter"}
      />
    </>
  );
}

export default ManageQuestions;
