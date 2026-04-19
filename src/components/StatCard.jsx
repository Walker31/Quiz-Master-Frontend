import { useTheme } from "@/context/ThemeContext";

/**
 * Reusable stat card with icon, value, label, and optional badge.
 * Props:
 *   icon (JSX) - icon element
 *   iconColor (string) - hex color for the icon
 *   iconBg (string) - background color for icon container
 *   value (string|number) - main number
 *   label (string) - description text
 *   badge (string) - optional badge text
 *   badgeColor (string) - badge text and bg color
 */
function StatCard({ icon, iconColor, iconBg, value, label, badge, badgeColor }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="theme-card p-5 group hover:translate-y-[-2px] transition-transform duration-200">
      <div className="flex items-start justify-between mb-4">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          {icon}
        </div>
        {badge && (
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: isDark ? `${badgeColor}22` : `${badgeColor}18`,
              color: badgeColor,
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <p className="theme-heading text-3xl font-bold">{value}</p>
      <p className="theme-text-muted text-sm mt-1">{label}</p>
    </div>
  );
}

export default StatCard;
