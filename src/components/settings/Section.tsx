// components/settings/Section.tsx
import React from "react";

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)" }}>
      <h2 className="text-sm font-bold mb-1" style={{ color: "var(--text-primary)" }}>{title}</h2>
      <div>{children}</div>
    </div>
  );
}