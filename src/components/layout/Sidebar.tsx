import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  KanbanSquare,
  BarChart3,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const links = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/board", icon: KanbanSquare, label: "Board" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const content = (
    <div
      className="flex flex-col h-full"
      style={{
        width: 240,
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-between px-5 py-5"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "var(--accent-light)",
              color: "var(--accent)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <KanbanSquare size={18} strokeWidth={2.4} />
          </div>

          <span
            className="font-bold text-base tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Kanban-Board
          </span>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg"
            style={{ color: "var(--text-muted)" }}
          >
            <X size={17} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive ? "sidebar-active" : "sidebar-idle"
              }`
            }
            style={({ isActive }) =>
              isActive
                ? { background: "var(--accent-light)", color: "var(--accent)" }
                : { color: "var(--text-secondary)" }
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="px-3 py-4"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "var(--bg-surface-hover)";
            (e.currentTarget as HTMLElement).style.color = "var(--danger)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
          }}
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </div>
  );

  if (open === undefined) {
    return (
      <aside className="hidden md:flex h-screen sticky top-0">{content}</aside>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 md:hidden ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 transition-opacity duration-200"
        style={{ background: "rgba(0,0,0,0.5)", opacity: open ? 1 : 0 }}
        onClick={onClose}
      />
      <div
        className="absolute left-0 top-0 h-full transition-transform duration-300"
        style={{ transform: open ? "translateX(0)" : "translateX(-100%)" }}
      >
        {content}
      </div>
    </div>
  );
}