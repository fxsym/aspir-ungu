'use client'
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function StatCard({
  title,
  count,
  icon,
  variant = "primary",
  href,
}) {
  const router = useRouter()

  const variants = {
    primary: { 
      iconBg: "bg-primary/10", 
      iconText: "text-primary",
      hoverBorder: "group-hover:border-primary/30",
      hoverBg: "group-hover:bg-primary/[0.02]",
      accent: "bg-primary"
    },
    success: { 
      iconBg: "bg-success/10", 
      iconText: "text-success",
      hoverBorder: "group-hover:border-success/30",
      hoverBg: "group-hover:bg-success/[0.02]",
      accent: "bg-success"
    },
    warning: { 
      iconBg: "bg-warning/10", 
      iconText: "text-warning",
      hoverBorder: "group-hover:border-warning/30",
      hoverBg: "group-hover:bg-warning/[0.02]",
      accent: "bg-warning"
    },
    danger: { 
      iconBg: "bg-danger/10", 
      iconText: "text-danger",
      hoverBorder: "group-hover:border-danger/30",
      hoverBg: "group-hover:bg-danger/[0.02]",
      accent: "bg-danger"
    },
  }

  const s = variants[variant] || variants.primary

  return (
    <motion.div
      whileHover={{ y: -14 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => href && router.push(href)}
      className={`group relative w-full bg-card border border-border rounded-2xl p-5 flex items-center justify-between 
        shadow-sm transition-all duration-300
        ${href ? `cursor-pointer ${s.hoverBorder} ${s.hoverBg}` : ""}
      `}
    >
      {/* Left Accent Line */}
      <div className={`absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full transition-all duration-300 opacity-0 group-hover:opacity-100 ${s.accent}`} />

      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{title}</p>
        <h2 className="text-3xl font-bold text-foreground leading-none my-1">{count}</h2>
        {href && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-primary/60 group-hover:text-primary transition-colors mt-1 uppercase tracking-tighter">
            Detail Laporan <span>→</span>
          </div>
        )}
      </div>

      <div className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${s.iconBg} ${s.iconText}`}>
        {icon}
      </div>
    </motion.div>
  )
}