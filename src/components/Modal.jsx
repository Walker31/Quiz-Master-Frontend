import { useTheme } from "@/context/ThemeContext";
import CloseIcon from '@mui/icons-material/Close';

/**
 * Reusable modal dialog with backdrop overlay.
 * Props:
 *   open (bool) - controls visibility
 *   onClose (fn) - called when backdrop or X is clicked
 *   title (string) - modal heading
 *   children - modal content
 *   maxWidth (string) - optional max-width class (default: "max-w-lg")
 */
function Modal({ open, onClose, title, children, maxWidth = "max-w-lg" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`relative w-full ${maxWidth} rounded-xl shadow-2xl border transition-all
          ${isDark ? 'bg-[#1d2332] border-[#2d3748]' : 'bg-white border-[#e0e4ec]'}`}
        style={{ animation: "modalFadeIn 0.2s ease" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="theme-heading text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[var(--color-bg-tertiary)] theme-text-muted"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Modal;
