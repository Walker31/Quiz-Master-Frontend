import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { quizService, contentService } from "@/services/quizService";

// UI Components
import Modal from "@/components/Modal";
import EmptyState from "@/components/EmptyState";
import StatCard from "@/components/StatCard";
import { SubjectCard } from "./components/SubjectCard";
import { AddSubjectModal } from "./components/AddSubjectModal";

// Icons
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import QuizIcon from "@mui/icons-material/Quiz";
import SchoolIcon from "@mui/icons-material/School";
import DescriptionIcon from "@mui/icons-material/Description";
import FilterListIcon from "@mui/icons-material/FilterList";

const SUBJECT_COLORS = [
  { color: "#2b73d0", bg: "rgba(43,115,208,0.12)" },
  { color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
  { color: "#27ae60", bg: "rgba(39,174,96,0.12)" },
  { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  { color: "#e74c3c", bg: "rgba(231,76,60,0.12)" },
  { color: "#06b6d4", bg: "rgba(6,182,212,0.12)" },
];

function ManageSubjects() {
  const navigate = useNavigate();
  
  // Data State
  const [examTypes, setExamTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("all");
  
  // Modal State
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [activeSubjectId, setActiveSubjectId] = useState(null);
  const [chapterForm, setChapterForm] = useState({ name: "", description: "" });

  const fetchData = async () => {
    try {
      const [etRes, sRes, cRes, qRes] = await Promise.all([
        contentService.getExamTypes(),
        quizService.getSubjects(),
        quizService.getChapters(),
        quizService.getQuizzes(), // Legacy
      ]);
      setExamTypes(etRes.data);
      setSubjects(sRes.data);
      setChapters(cRes.data);
      setQuizzes(qRes.data);
    } catch (e) {
      console.error("Failed to fetch data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  const handleAddSubject = async (formData) => {
    try {
      await quizService.createSubject(formData);
      setShowSubjectModal(false);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleAddChapter = async (e) => {
    e.preventDefault();
    try {
      await quizService.createChapter({ ...chapterForm, subject: activeSubjectId });
      setChapterForm({ name: "", description: "" });
      setShowChapterModal(false);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleDeleteSubject = async (id) => {
    if (!confirm("Are you sure? This will delete all chapters and content related to this subject.")) return;
    try {
      await quizService.deleteSubject(id);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleDeleteChapter = async (id) => {
    if (!confirm("Are you sure? This will delete all questions in this chapter.")) return;
    try {
      await quizService.deleteChapter(id);
      fetchData();
    } catch (e) { console.error(e); }
  };

  // Filtering Logic
  const filteredSubjects = subjects.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesExam = selectedExamType === "all" || s.exam_type === parseInt(selectedExamType);
    return matchesSearch && matchesExam;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-(--color-accent) border-t-transparent animate-spin" />
        <p className="theme-text-muted text-sm font-medium">Preparing your workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 theme-text-accent text-xs font-black uppercase tracking-widest mb-2">
            <div className="h-1 w-6 bg-(--color-accent) rounded-full" />
            Curriculum Manager
          </div>
          <h1 className="theme-heading text-4xl font-black tracking-tight">Subjects & Chapters</h1>
          <p className="theme-text-muted text-sm mt-2 max-w-md">
            Manage your educational hierarchy. Organize subjects under exam types and build comprehensive chapters.
          </p>
        </div>
        <button
          onClick={() => setShowSubjectModal(true)}
          className="theme-btn-primary flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-black shadow-lg shadow-(--color-accent)/20"
        >
          <AddIcon fontSize="small" /> Create Subject
        </button>
      </div>

      {/* ── Stats Dashboard ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<SchoolIcon />}
          iconColor="#2b73d0"
          iconBg="rgba(43,115,208,0.12)"
          value={examTypes.length}
          label="Exam Types"
        />
        <StatCard
          icon={<MenuBookIcon />}
          iconColor="#8b5cf6"
          iconBg="rgba(139,92,246,0.12)"
          value={subjects.length}
          label="Subjects"
        />
        <StatCard
          icon={<FolderOpenIcon />}
          iconColor="#27ae60"
          iconBg="rgba(39,174,96,0.12)"
          value={chapters.length}
          label="Chapters"
        />
        <StatCard
          icon={<QuizIcon />}
          iconColor="#f59e0b"
          iconBg="rgba(245,158,11,0.12)"
          value={quizzes.length}
          label="Total Quizzes"
        />
      </div>

      {/* ── Filters & Search ── */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center bg-(--color-bg-tertiary)/30 p-2 rounded-2xl border border-(--color-border)">
        <div className="relative flex-1 group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 theme-text-muted group-focus-within:theme-text-accent transition-colors" fontSize="small" />
          <input
            type="text"
            placeholder="Search by subject name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="theme-input w-full pl-11 pr-4 py-3 text-sm rounded-xl border-transparent bg-transparent focus:bg-white dark:focus:bg-black transition-all"
          />
        </div>
        <div className="flex items-center gap-2 px-4 lg:border-l border-(--color-border)">
          <FilterListIcon className="theme-text-muted" fontSize="small" />
          <select
            value={selectedExamType}
            onChange={(e) => setSelectedExamType(e.target.value)}
            className="bg-transparent theme-heading text-sm font-bold focus:outline-none py-2 cursor-pointer"
          >
            <option value="all">All Exams</option>
            {examTypes.map(et => (
              <option key={et.id} value={et.id}>{et.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Content Grid ── */}
      {filteredSubjects.length === 0 ? (
        <EmptyState
          icon={<MenuBookIcon style={{ fontSize: 48 }} className="theme-text-muted opacity-20" />}
          title={searchQuery ? "No matches found" : "No subjects registered"}
          description={searchQuery 
            ? `We couldn't find any subjects matching "${searchQuery}".` 
            : "Get started by creating your first subject for the curriculum."}
          action={!searchQuery && (
            <button onClick={() => setShowSubjectModal(true)} className="theme-btn-primary px-6 py-2.5 text-sm">
              Add First Subject
            </button>
          )}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSubjects.map((subject, idx) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              colorSet={SUBJECT_COLORS[idx % SUBJECT_COLORS.length]}
              chapters={chapters.filter(c => c.subject === subject.id)}
              quizzes={quizzes}
              onDelete={handleDeleteSubject}
              onDeleteChapter={handleDeleteChapter}
              onAddChapter={(sid) => {
                setActiveSubjectId(sid);
                setShowChapterModal(true);
              }}
              onManageQuestions={(cid) => navigate(`/admin/questions/${cid}`)}
            />
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      <AddSubjectModal
        open={showSubjectModal}
        onClose={() => setShowSubjectModal(false)}
        onSubmit={handleAddSubject}
      />

      <Modal open={showChapterModal} onClose={() => setShowChapterModal(false)} title="Create New Chapter">
        <form onSubmit={handleAddChapter} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 theme-text-secondary text-sm font-black mb-3">
              <FolderOpenIcon fontSize="small" />
              Chapter Name *
            </label>
            <input
              value={chapterForm.name}
              onChange={(e) => setChapterForm({ ...chapterForm, name: e.target.value })}
              placeholder="e.g. Thermodynamics, Linear Algebra"
              required
              className="theme-input w-full px-4 py-3.5 text-sm rounded-xl border border-(--color-border) focus:ring-2 focus:ring-(--color-accent)"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 theme-text-secondary text-sm font-black mb-3">
              <DescriptionIcon fontSize="small" />
              Brief Description
            </label>
            <textarea
              value={chapterForm.description}
              onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })}
              placeholder="What topics will be covered in this chapter?"
              rows={3}
              className="theme-input w-full px-4 py-3.5 text-sm rounded-xl border border-(--color-border) focus:ring-2 focus:ring-(--color-accent) resize-none"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-(--color-border)">
            <button
              type="button"
              onClick={() => setShowChapterModal(false)}
              className="px-5 py-2.5 text-sm font-bold rounded-lg theme-text-secondary hover:bg-(--color-bg-tertiary)"
            >
              Cancel
            </button>
            <button type="submit" className="theme-btn-primary px-8 py-3 text-sm font-black flex items-center gap-2">
              <AddIcon fontSize="small" /> Create Chapter
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ManageSubjects;
