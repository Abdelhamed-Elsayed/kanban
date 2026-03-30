// pages/SettingsPage.tsx
import { useState } from "react";
import { Moon, Sun, Bell, Mail, Shield, Globe, Clock, Zap, CheckCircle2, Save } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { useSettingsStore } from "../store/useSettingsStore";
import { Toggle } from "../components/settings/Toggle";
import { SettingRow } from "../components/settings/SettingRow";
import { Section } from "../components/settings/Section";

export default function SettingsPage() {
  const { dark, toggle } = useThemeStore();
  const {
    autoSave, notifications, emailDigest, compactMode, language, timezone,
    toggleAutoSave, toggleNotifications, toggleEmailDigest, toggleCompactMode,
    setLanguage, setTimezone,
  } = useSettingsStore();

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="animate-fadeInUp max-w-2xl mx-auto space-y-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Manage your workspace preferences</p>
      </div>

      {/* Appearance */}
      <Section title="Appearance">
        <SettingRow icon={dark ? Moon : Sun} label="Dark Mode" sub="Toggle deep sea dark theme">
          <Toggle checked={dark} onChange={toggle} />
        </SettingRow>
        <SettingRow icon={Zap} label="Auto Save" sub="Automatically save changes to local storage">
          <Toggle checked={autoSave} onChange={toggleAutoSave} />
        </SettingRow>
        <SettingRow icon={Shield} label="Compact Mode" sub="Reduce card spacing for denser layout (visual only)">
          <Toggle checked={compactMode} onChange={toggleCompactMode} />
        </SettingRow>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <SettingRow icon={Bell} label="Push Notifications" sub="Browser push alerts for task updates">
          <Toggle checked={notifications} onChange={toggleNotifications} />
        </SettingRow>
        <SettingRow icon={Mail} label="Weekly Email Digest" sub="Receive a weekly summary of your board">
          <Toggle checked={emailDigest} onChange={toggleEmailDigest} />
        </SettingRow>
      </Section>

      {/* Localization */}
      <Section title="Localization">
        <SettingRow icon={Globe} label="Language" sub="Interface display language">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm rounded-lg px-3 py-1.5 outline-none"
            style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
          </select>
        </SettingRow>
        <SettingRow icon={Clock} label="Timezone" sub="Used for date display on tasks">
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="text-sm rounded-lg px-3 py-1.5 outline-none"
            style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
          >
            <option value="UTC+2">Cairo (UTC+2)</option>
            <option value="UTC+0">London (UTC+0)</option>
            <option value="UTC+3">Riyadh (UTC+3)</option>
            <option value="UTC-5">New York (UTC-5)</option>
          </select>
        </SettingRow>
      </Section>

      {/* Account */}
      <Section title="Account">
        <SettingRow icon={Shield} label="Two-Factor Authentication" sub="Add an extra security layer to your account">
          <button
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition"
            style={{ background: "var(--accent-light)", color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)" }}
          >
            Enable
          </button>
        </SettingRow>
        <SettingRow icon={Mail} label="Email Address" sub="user@deepboard.app">
          <button
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition"
            style={{ background: "var(--bg-surface-2)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
          >
            Change
          </button>
        </SettingRow>
      </Section>

      {/* Save button */}
      <div className="flex justify-end pt-2 pb-6">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            background: saved ? "var(--success)" : "var(--accent)",
            color: "#fff",
            boxShadow: saved ? "0 4px 16px color-mix(in srgb, var(--success) 35%, transparent)" : "var(--shadow-accent)",
          }}
        >
          {saved ? <><CheckCircle2 size={16} /> Saved!</> : <><Save size={16} /> Save Settings</>}
        </button>
      </div>
    </div>
  );
}