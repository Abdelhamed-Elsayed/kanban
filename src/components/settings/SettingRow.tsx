// components/settings/SettingRow.tsx
import React from "react";

export function SettingRow({ icon: Icon, label, sub, children }: { icon: any; label: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3.5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center mt-0.5" style={{ background: "var(--bg-surface-2)" }}>
          <Icon size={15} style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{sub}</p>
        </div>
      </div>
      {children}
    </div>
  );
}