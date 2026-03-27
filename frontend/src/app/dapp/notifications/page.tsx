"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, AlertTriangle, Wrench, Coins, Shield, CheckCircle2, Trash2, CalendarCheck, Receipt, Star } from "lucide-react";
import { SharedNotificationCard } from "@/components/ui/SharedNotificationCard";
import { useBooking } from "@/context/BookingContext";

const initialNotifications = [
  { id: 1, type: "ai_alert", title: "CVT Belt — Risiko Tinggi", message: "Prediksi kegagalan dalam 45 hari. Segera jadwalkan inspeksi.", time: "2 jam lalu", read: false },
  { id: 2, type: "token_reward", title: "+25 $NOC Earned", message: "Reward dari servis Oil Change di Bengkel Hendra Motor.", time: "5 jam lalu", read: false },
  { id: 3, type: "maintenance_due", title: "Servis Berikutnya: Air Filter", message: "Penggantian air filter disarankan dalam 2 minggu.", time: "1 hari lalu", read: true },
  { id: 4, type: "system", title: "NOC ID v2.1 Released", message: "Fitur baru: Interior 3D view dan BMW M4 model.", time: "2 hari lalu", read: true },
  { id: 5, type: "ai_alert", title: "Brake Fluid — Risiko Sedang", message: "Brake fluid flush direkomendasikan dalam 90 hari.", time: "3 hari lalu", read: true },
  { id: 6, type: "token_reward", title: "+30 $NOC Earned", message: "Reward dari Full Inspection di Bengkel Jaya Motor.", time: "1 minggu lalu", read: true },
  { id: 7, type: "maintenance_due", title: "Reminder: Ganti oli 40,000 km", message: "Odometer Anda mendekati 40,000 km. Jadwalkan servis.", time: "2 minggu lalu", read: true },
];

const typeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  ai_alert: { icon: <AlertTriangle className="w-5 h-5" />, color: "#F97316" },
  maintenance_due: { icon: <Wrench className="w-5 h-5" />, color: "var(--solana-cyan)" },
  token_reward: { icon: <Coins className="w-5 h-5" />, color: "var(--solana-green)" },
  system: { icon: <Shield className="w-5 h-5" />, color: "var(--solana-purple)" },
  // Booking notification types
  booking_pending: { icon: <CalendarCheck className="w-5 h-5" />, color: "#FACC15" },
  booking_accepted: { icon: <CheckCircle2 className="w-5 h-5" />, color: "var(--solana-green)" },
  booking_rejected: { icon: <AlertTriangle className="w-5 h-5" />, color: "#EF4444" },
  booking_service: { icon: <Wrench className="w-5 h-5" />, color: "var(--solana-cyan)" },
  booking_invoice: { icon: <Receipt className="w-5 h-5" />, color: "#F97316" },
  booking_paid: { icon: <CheckCircle2 className="w-5 h-5" />, color: "var(--solana-green)" },
  booking_completed: { icon: <Star className="w-5 h-5" />, color: "var(--solana-purple)" },
};

export default function NotificationsPage() {
  const bookingCtx = useBooking();
  const [staticNotifications, setStaticNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<string>("all");

  // Merge static + booking notifications (user-side only)
  const userBookingNotifs = (bookingCtx?.bookingNotifications || [])
    .filter(n => n.targetRole === "user")
    .map(n => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      time: n.time,
      read: n.read,
    }));

  const allNotifications = [...userBookingNotifs, ...staticNotifications];

  const markAllRead = () => {
    setStaticNotifications(staticNotifications.map(n => ({ ...n, read: true })));
    bookingCtx?.markAllNotificationsRead("user");
  };

  const deleteNotif = (id: number | string) => {
    // Check if it's a booking notification
    if (typeof id === "string" && id.startsWith("BN-")) {
      bookingCtx?.deleteNotification(id);
    } else {
      setStaticNotifications(staticNotifications.filter(n => n.id !== Number(id)));
    }
  };

  const unreadCount = allNotifications.filter(n => !n.read).length;

  const isBookingType = (type: string) => type.startsWith("booking_");

  const filtered = filter === "all"
    ? allNotifications
    : filter === "booking"
    ? allNotifications.filter(n => isBookingType(n.type))
    : allNotifications.filter(n => n.type === filter);

  return (
    <div>
      <div className="page-header">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="flex items-center gap-3">
              <Bell className="w-7 h-7" style={{ color: "var(--solana-purple)" }} />
              Notifications
              {unreadCount > 0 && (
                <span className="badge badge-green text-xs">{unreadCount} baru</span>
              )}
            </h1>
            <p>Alerts, rewards, and maintenance reminders</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl transition-colors cursor-pointer" style={{ background: "rgba(153,69,255,0.1)", color: "var(--solana-purple)" }}>
              <CheckCircle2 className="w-4 h-4" /> Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { key: "all", label: "All" },
          { key: "booking", label: "Booking" },
          { key: "ai_alert", label: "AI Alerts" },
          { key: "maintenance_due", label: "Maintenance" },
          { key: "token_reward", label: "Rewards" },
          { key: "system", label: "System" },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer" style={{ background: filter === f.key ? "rgba(153,69,255,0.15)" : "rgba(20,20,40,0.5)", border: `1px solid ${filter === f.key ? "var(--solana-purple)" : "rgba(153,69,255,0.15)"}`, color: filter === f.key ? "var(--solana-purple)" : "var(--solana-text-muted)" }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="glass-card-static p-16 text-center">
            <Bell className="w-16 h-16 mx-auto mb-6" style={{ color: "var(--solana-text-muted)", opacity: 0.3 }} />
            <p className="text-lg" style={{ color: "var(--solana-text-muted)" }}>No notifications</p>
          </div>
        ) : (
          filtered.map((n, i) => {
            const config = typeConfig[n.type] || typeConfig.system;
            return (
              <SharedNotificationCard
                key={n.id}
                id={n.id}
                index={i}
                title={n.title}
                message={n.message}
                time={n.time}
                read={n.read}
                icon={config.icon}
                color={config.color}
                onDelete={deleteNotif}
                onClick={
                  isBookingType(n.type) && typeof n.id === "string"
                    ? () => bookingCtx?.markNotificationRead(n.id as string)
                    : undefined
                }
              />
            );
          })
        )}
      </div>
    </div>
  );
}
