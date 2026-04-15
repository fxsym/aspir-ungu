import React from "react";

export default function StatCard({
  title,
  count,
  icon,
  variant = "primary",
}) {
  const variants = {
    primary: {
      bg: "bg-primary/10",
      text: "text-primary",
    },
    success: {
      bg: "bg-success/10",
      text: "text-success",
    },
    warning: {
      bg: "bg-warning/10",
      text: "text-warning",
    },
    danger: {
      bg: "bg-danger/10",
      text: "text-danger",
    },
  };

  const selected = variants[variant];

  return (
    <div className="w-full bg-card border border-border rounded-2xl p-5 gap-4 flex items-center justify-between shadow-sm hover:shadow-md transition">
      
      {/* LEFT CONTENT */}
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted text-left">{title}</p>
        <h2 className="text-2xl font-semibold text-foreground text-left">
          {count}
        </h2>
      </div>

      {/* ICON */}
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-xl ${selected.bg} ${selected.text}`}
      >
        {icon}
      </div>
    </div>
  );
}