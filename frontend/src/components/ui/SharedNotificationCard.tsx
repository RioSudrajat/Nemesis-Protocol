"use client";

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

export interface SharedNotificationCardProps {
  id: string | number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ReactNode;
  color: string;
  index: number;
  onDelete?: (id: string | number) => void;
  onClick?: (id: string | number) => void;
}

export function SharedNotificationCard({
  id,
  title,
  message,
  time,
  read,
  icon,
  color,
  index,
  onDelete,
  onClick
}: SharedNotificationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`glass-card-static p-6 flex items-start gap-5 ${onClick ? "cursor-pointer hover:bg-white/5 transition-colors" : ""}`}
      style={{
        borderLeft: !read ? `4px solid ${color}` : `1px solid rgba(94, 234, 212,0.15)`,
        opacity: read ? 0.7 : 1
      }}
      onClick={() => onClick && onClick(id)}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}15`, color: color }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-base" style={{ color: read ? "var(--solana-text-muted)" : "white" }}>
          {title}
        </p>
        <p className="text-sm mt-2" style={{ color: !read ? "#cbd5e1" : "var(--solana-text-muted)" }}>
          {message}
        </p>
        <p className="text-xs mono mt-3" style={{ color: "var(--solana-text-muted)", opacity: 0.7 }}>
          {time}
        </p>
      </div>
      {onDelete && (
        <button
          onClick={(e) => {
             e.stopPropagation();
             onDelete(id);
          }}
          className="p-3 rounded-lg hover:bg-white/5 transition-colors shrink-0"
        >
          <Trash2 className="w-5 h-5" style={{ color: "var(--solana-text-muted)" }} />
        </button>
      )}
    </motion.div>
  );
}
