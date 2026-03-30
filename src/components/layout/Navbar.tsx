import { Menu, Sun, Moon, Bell } from "../../lib/icons";
import { useThemeStore } from "../../store/useThemeStore";

export default function Navbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { dark, toggle } = useThemeStore();

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-6 h-14"
      style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <button
        className="md:hidden p-2 rounded-xl transition"
        style={{ color: "var(--text-secondary)" }}
        onClick={onOpenSidebar}
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>

      <div className="hidden md:block" />

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          className="p-2 rounded-xl transition"
          style={{ color: "var(--text-muted)" }}
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={18} />
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className="p-2 rounded-xl transition"
          style={{ color: "var(--text-secondary)" }}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          title={dark ? "Light mode" : "Dark mode"}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ml-1"
          style={{ background: "#0d2137", color: "#ffffff" }}
        >
          AE
        </div>
      </div>
    </header>
  );
}
