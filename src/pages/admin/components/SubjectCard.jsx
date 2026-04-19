import { useState } from "react";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import QuizIcon from "@mui/icons-material/Quiz";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ChapterItem } from "./ChapterItem";

export function SubjectCard({ 
  subject, 
  chapters, 
  quizzes, 
  colorSet, 
  onDelete, 
  onAddChapter,
  onManageQuestions,
  onDeleteChapter
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const subjectQuizzes = quizzes.filter(q => q.subject === subject.id);
  const liveCount = subjectQuizzes.filter(q => q.is_live).length;

  return (
    <div 
      className={`theme-card overflow-hidden transition-all duration-300 border border-(--color-border) hover:border-(--color-accent-light) shadow-xs hover:shadow-md ${
        isExpanded ? "md:col-span-2 lg:col-span-3" : ""
      }`}
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start gap-5">
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl font-black shrink-0 shadow-inner"
            style={{ backgroundColor: colorSet.bg, color: colorSet.color }}
          >
            {subject.name.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-3 mb-1.5">
              <h3 className="theme-heading text-lg font-bold truncate">{subject.name}</h3>
              {liveCount > 0 && (
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Has live quizzes" />
              )}
              {subject.exam_type_name && (
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-(--color-bg-tertiary) theme-text-muted border border-(--color-border)">
                  {subject.exam_type_name}
                </span>
              )}
            </div>
            <p className="theme-text-muted text-sm line-clamp-2 leading-relaxed">
              {subject.description || "No description provided."}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(subject.id); }}
              className="p-2.5 rounded-xl hover:bg-red-500/10 text-(--color-text-muted) hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
              title="Delete subject"
            >
              <DeleteOutlinedIcon fontSize="small" />
            </button>
          </div>
        </div>

        {/* Stats & Toggle */}
        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-(--color-border)/50">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider theme-text-muted mb-0.5">Chapters</span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: colorSet.color }} />
                <span className="text-sm font-black theme-heading">{chapters.length}</span>
              </div>
            </div>
            <div className="h-8 w-px bg-(--color-border)/50" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider theme-text-muted mb-0.5">Quizzes</span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span className="text-sm font-black theme-heading">{subjectQuizzes.length}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl theme-text-secondary hover:bg-(--color-bg-secondary) transition-all text-xs font-bold border border-(--color-border) hover:border-(--color-accent-light)"
          >
            {isExpanded ? (
              <>Close Panel <KeyboardArrowUpIcon fontSize="inherit" /></>
            ) : (
              <>View Chapters <KeyboardArrowDownIcon fontSize="inherit" /></>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="bg-(--color-bg-tertiary)/30 border-t border-(--color-border)">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="theme-heading text-sm font-black">Course Curriculum</h4>
                <p className="text-[11px] theme-text-muted font-medium">Manage chapters and question banks for this subject</p>
              </div>
              <button
                onClick={() => onAddSubjectChapter(subject.id)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-(--color-accent) text-white hover:bg-(--color-accent-hover) transition-all shadow-sm hover:shadow-md"
              >
                <AddIcon style={{ fontSize: 16 }} /> New Chapter
              </button>
            </div>

            {chapters.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-(--color-border) p-10 text-center bg-white/50 dark:bg-black/50">
                <div className="h-12 w-12 rounded-full bg-(--color-bg-secondary) flex items-center justify-center mx-auto mb-4">
                  <FolderOpenIcon className="theme-text-muted" />
                </div>
                <h5 className="theme-heading text-sm font-bold mb-1">No chapters found</h5>
                <p className="theme-text-muted text-xs mb-5 max-w-[200px] mx-auto">Start by adding your first chapter to this subject.</p>
                <button
                  onClick={() => onAddChapter(subject.id)}
                  className="text-xs font-bold text-(--color-accent) hover:underline"
                >
                  + Create Chapter
                </button>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {chapters.map((ch) => (
                  <ChapterItem
                    key={ch.id}
                    chapter={ch}
                    color={colorSet.color}
                    quizCount={quizzes.filter(q => q.chapter === ch.id).length}
                    liveCount={quizzes.filter(q => q.chapter === ch.id && q.is_live).length}
                    onManageQuestions={onManageQuestions}
                    onDelete={onDeleteChapter}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
