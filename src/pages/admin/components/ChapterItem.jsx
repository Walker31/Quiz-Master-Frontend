import {
  FolderOpen as FolderOpenIcon,
  Quiz as QuizIcon,
  DeleteOutlined as DeleteOutlinedIcon
} from "@mui/icons-material";

export function ChapterItem({ chapter, color, quizCount, liveCount, onManageQuestions, onDelete }) {
  return (
    <div className="rounded-xl bg-(--color-bg-secondary) p-4 hover:bg-(--color-bg-tertiary) transition-all flex items-start justify-between group border border-transparent hover:border-(--color-border)">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
            <FolderOpenIcon style={{ fontSize: 18, color: color }} />
          </div>
          <span className="theme-heading text-sm font-bold truncate">{chapter.name}</span>
        </div>
        <div className="flex items-center gap-3 mt-2 ml-11">
          <div className="flex items-center gap-1">
            <QuizIcon style={{ fontSize: 12 }} className="theme-text-muted" />
            <span className="text-[11px] font-medium theme-text-muted">
              {quizCount} quiz{quizCount !== 1 ? "zes" : ""}
            </span>
          </div>
          {liveCount > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
              {liveCount} live
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-1 ml-4">
        <button
          onClick={() => onManageQuestions(chapter.id)}
          className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-(--color-accent-light) text-(--color-accent) transition-all"
          title="Manage questions"
        >
          <QuizIcon fontSize="small" />
        </button>
        <button
          onClick={() => onDelete(chapter.id)}
          className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-(--color-text-muted) hover:text-red-500 transition-all"
          title="Delete chapter"
        >
          <DeleteOutlinedIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
}
