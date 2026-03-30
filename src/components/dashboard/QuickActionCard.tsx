import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  route: string;
  shadow?: string;
}

export default function QuickActionCard({
  title,
  description,
  icon,
  color,
  bgColor,
  route,
  shadow,
}: QuickActionCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(route)}
      className="flex items-center justify-between p-4 rounded-xl transition-all duration-150 text-left group"
      style={{
        background: bgColor,
        border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
        minHeight: "80px", // زيادة ارتفاع الكارت
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.boxShadow =
          shadow || "var(--shadow-accent)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.boxShadow = "none")
      }
    >
      <div className="flex items-center gap-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: color }}
        >
          {icon}
        </div>

        <div className="flex flex-col justify-center">
          <p className="font-semibold text-sm" style={{ color }}>
            {title}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            {description}
          </p>
        </div>
      </div>

      <ArrowRight
        size={16}
        style={{ color }}
        className="group-hover:translate-x-1 transition-transform"
      />
    </button>
  );
}