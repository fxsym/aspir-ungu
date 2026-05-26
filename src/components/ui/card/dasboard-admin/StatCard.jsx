'use client'
import { useRouter } from "next/navigation"

export default function StatCard({
  title,
  count,
  icon,
  variant = "primary",
  href,          // ← URL tujuan, misal "/admin/aspirasi?status=verified"
}) {
  const router = useRouter()

  const variants = {
    primary: { bg: "bg-primary/10",  text: "text-primary"  },
    success: { bg: "bg-success/10",  text: "text-success"  },
    warning: { bg: "bg-warning/10",  text: "text-warning"  },
    danger:  { bg: "bg-danger/10",   text: "text-danger"   },
  }
  const selected = variants[variant]

  return (
    <div
      onClick={() => href && router.push(href)}
      className={`w-full bg-card border border-border rounded-2xl p-5 gap-4 flex items-center justify-between shadow-sm hover:shadow-md transition
        ${href ? "cursor-pointer hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]" : ""}
      `}
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted text-left">{title}</p>
        <h2 className="text-2xl font-semibold text-foreground text-left">{count}</h2>
        {href && (
          <span className="text-xs text-primary/70 mt-0.5">Lihat semua →</span>
        )}
      </div>
      <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${selected.bg} ${selected.text}`}>
        {icon}
      </div>
    </div>
  )
}