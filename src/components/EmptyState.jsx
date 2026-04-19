import { useTheme } from "@/context/ThemeContext";

/**
 * Reusable empty state placeholder.
 * Props:
 *   icon (JSX element) - large icon to display
 *   title (string) - main message
 *   description (string) - secondary text
 *   action (JSX element) - optional action button
 */
function EmptyState({ icon, title, description, action }) {
  return (
    <div className="theme-card flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-accent-light)] text-[var(--color-accent)] mb-5">
        {icon}
      </div>
      <h3 className="theme-heading text-lg font-semibold mb-2">{title}</h3>
      <p className="theme-text-muted text-sm max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}

export default EmptyState;
