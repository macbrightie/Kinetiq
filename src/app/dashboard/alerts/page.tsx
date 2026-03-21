"use client";

import React, { useState } from "react";
import { AlertTriangle, Bell, MessageSquare, ChevronRight, Activity, Zap, CheckCircle2, X, Send, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/DashboardHeader";

const INITIAL_ALERTS = [
  {
    id: "mock-3",
    client: "Zola Abara",
    type: "CRITICAL",
    message: "Inactive for 4 days. Activity score dropped by 65%.",
    time: "2h ago",
    initials: "ZA",
    color: "#ef4444",
    photo: "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=150&h=150&fit=crop",
    origin: "Nairobi, Kenya",
    score: 34,
    workouts: "1/5",
    aiMsg: "Zola has been inactive for 4 days. Immediate outreach needed.",
  },
  {
    id: "mock-2",
    client: "Kofi Mensah",
    type: "WARNING",
    message: "Daily step goal missed 3 days in a row.",
    time: "5h ago",
    initials: "KM",
    color: "#f59e0b",
    photo: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&h=150&fit=crop",
    origin: "Accra, Ghana",
    score: 88,
    workouts: "5/5",
    aiMsg: "Kofi's steps are slightly down. A quick check-in would help maintain momentum.",
  },
  {
    id: "mock-5",
    client: "Chidi Eze",
    type: "WARNING",
    message: "Sleep quality consistently below 6 hours.",
    time: "2 days ago",
    initials: "CE",
    color: "#f59e0b",
    photo: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=150&h=150&fit=crop",
    origin: "Enugu, Nigeria",
    score: 61,
    workouts: "2/5",
    aiMsg: "Sleep quality is a concern. Recommend adding a wind-down routine.",
  },
  {
    id: "mock-9",
    client: "Kwame Osei",
    type: "CRITICAL",
    message: "6 days inactive. High dropout risk flagged by AI.",
    time: "3 days ago",
    initials: "KO",
    color: "#ef4444",
    photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop",
    origin: "Tamale, Ghana",
    score: 45,
    workouts: "1/5",
    aiMsg: "Kwame hasn't logged activity in 6 days. Risk of dropout is very high.",
  },
];

// ─── Message Modal ────────────────────────────────────────────────────────────
function MessageModal({ alert, onClose }: { alert: typeof INITIAL_ALERTS[0]; onClose: () => void }) {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!text.trim()) return;
    setSent(true);
    setTimeout(() => onClose(), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
      <Card className="w-full max-w-md p-6 border shadow-2xl animate-in zoom-in-95 duration-300" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-4 mb-6">
          <img src={alert.photo} alt={alert.client} className="w-12 h-12 rounded-xl object-cover" style={{ border: `2px solid ${alert.color}` }} />
          <div>
            <h3 className="font-black text-lg" style={{ color: "var(--foreground)" }}>{alert.client}</h3>
            <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>{alert.origin}</p>
          </div>
          <button onClick={onClose} className="ml-auto w-8 h-8 rounded-xl flex items-center justify-center hover:bg-muted transition-all" style={{ color: "var(--muted-foreground)" }}>
            <X size={16} />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-emerald-500" />
            </div>
            <p className="font-black text-emerald-500">Message Sent!</p>
          </div>
        ) : (
          <>
            <div className="p-3 rounded-xl mb-4 text-xs font-medium" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
              💡 <strong>AI Insight:</strong> {alert.aiMsg}
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={`Message ${alert.client}...`}
              rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none resize-none focus:ring-2 focus:ring-indigo-500/30"
              style={{ background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }}
            />
            <div className="flex gap-3 mt-4">
              <Button onClick={handleSend} className="flex-1 rounded-xl font-black h-11" style={{ background: "var(--foreground)", color: "var(--card)" }}>
                <Send size={15} className="mr-2" /> Send Message
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1 rounded-xl font-bold h-11">Cancel</Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

// ─── Client Sidebar Panel ─────────────────────────────────────────────────────
function ClientSidePanel({ alert, onClose }: { alert: typeof INITIAL_ALERTS[0]; onClose: () => void }) {
  const STATUS_COLOR: Record<string, string> = { CRITICAL: "#ef4444", WARNING: "#f59e0b", INFO: "#10b981" };
  const color = STATUS_COLOR[alert.type];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div
        className="h-full w-full max-w-sm shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        style={{ background: "var(--card)", borderLeft: "1px solid var(--border)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
          <h3 className="font-black text-lg" style={{ color: "var(--foreground)" }}>Client Overview</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-muted transition-all" style={{ color: "var(--muted-foreground)" }}>
            <X size={16} />
          </button>
        </div>

        {/* Profile */}
        <div className="p-6 flex flex-col items-center text-center" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="relative mb-4">
            <img src={alert.photo} alt={alert.client} className="w-24 h-24 rounded-3xl object-cover shadow-xl" style={{ border: `3px solid ${color}` }} />
            <span className="absolute -top-1 -right-1 text-lg">{alert.type === "CRITICAL" ? "🚨" : alert.type === "WARNING" ? "⚠️" : "✅"}</span>
          </div>
          <h2 className="text-xl font-black" style={{ color: "var(--foreground)" }}>{alert.client}</h2>
          <p className="text-sm font-medium mb-4" style={{ color: "var(--muted-foreground)" }}>{alert.origin}</p>
          <span className="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest" style={{ background: `${color}15`, color }}>
            {alert.type}
          </span>
        </div>

        {/* Stats */}
        <div className="p-6 flex-1 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: "var(--muted-foreground)" }}>Quick Stats</p>
          {[
            { label: "Health Score", value: `${alert.score}%` },
            { label: "Sessions This Week", value: alert.workouts },
            { label: "Last Alert", value: alert.time },
          ].map(stat => (
            <div key={stat.label} className="flex items-center justify-between py-3 px-4 rounded-xl" style={{ background: "var(--muted)" }}>
              <span className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>{stat.label}</span>
              <span className="text-sm font-black" style={{ color: "var(--foreground)" }}>{stat.value}</span>
            </div>
          ))}

          <div className="p-4 rounded-xl mt-4" style={{ background: `${color}10`, border: `1px solid ${color}30` }}>
            <p className="text-xs font-bold mb-1" style={{ color }}>AI Insight</p>
            <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{alert.aiMsg}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 space-y-3" style={{ borderTop: "1px solid var(--border)" }}>
          <Link href={`/dashboard/clients/${alert.id}`} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-sm transition-all hover:opacity-90" style={{ background: "var(--foreground)", color: "var(--card)" }}>
            <User size={15} /> View Full Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Alerts Page ─────────────────────────────────────────────────────────
export default function AlertsPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [messageAlert, setMessageAlert] = useState<typeof INITIAL_ALERTS[0] | null>(null);
  const [sideAlert, setSideAlert] = useState<typeof INITIAL_ALERTS[0] | null>(null);

  const dismissAlert = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--background)" }}>
      <DashboardHeader title="Alerts Center" showInvite={false} />

      <main className="flex-1 p-8 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <Bell size={16} className="text-indigo-500" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-500 opacity-80">Monitoring System</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight leading-none" style={{ color: "var(--foreground)" }}>
              Critical Updates
            </h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl font-bold h-11 px-6 transition-all" onClick={() => setAlerts([])}>
              Mark all read
            </Button>
            <Link href="/dashboard/settings">
              <Button className="rounded-xl font-black shadow-lg h-11 px-6 active:scale-95 transition-all" style={{ background: "var(--foreground)", color: "var(--card)" }}>
                System Settings
              </Button>
            </Link>
          </div>
        </div>

        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 rounded-[30px] bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 size={36} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black" style={{ color: "var(--foreground)" }}>All Clear!</h2>
            <p className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>No active alerts right now. Great job staying on top of things.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card
                key={alert.id}
                onClick={() => router.push(`/dashboard/clients/${alert.id}`)}
                className="group relative overflow-hidden transition-all hover:scale-[1.005] hover:shadow-2xl cursor-pointer active:scale-[0.995]"
                style={{ background: "var(--card)", border: `1px solid var(--border)` }}
              >
                {/* Status bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 z-10" style={{ background: alert.color }} />

                <div className="p-6 md:p-8 flex items-center gap-6 md:gap-8">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-[22px] overflow-hidden shadow-xl transition-all group-hover:scale-105 duration-300 relative z-20"
                      style={{ border: `2.5px solid ${alert.color}` }}>
                      <img src={alert.photo} alt={alert.client} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 blur-xl opacity-20 scale-75 z-10" style={{ background: alert.color }} />
                    {alert.type === "CRITICAL" && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping z-30" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-black text-xl tracking-tight" style={{ color: "var(--foreground)" }}>{alert.client}</span>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border"
                        style={{ borderColor: `${alert.color}40`, color: alert.color, background: `${alert.color}15` }}>
                        {alert.type}
                      </span>
                      <span className="text-xs ml-auto font-bold uppercase tracking-[0.1em]" style={{ color: "var(--muted-foreground)" }}>{alert.time}</span>
                    </div>
                    <p className="font-medium text-base truncate pr-16" style={{ color: "var(--muted-foreground)" }}>
                      {alert.message}
                    </p>
                  </div>

                  {/* Action buttons – always visible, more prominent */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => dismissAlert(alert.id, e)}
                      title="Dismiss alert"
                      className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/30"
                      style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
                      <CheckCircle2 size={17} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setMessageAlert(alert); }}
                      title="Send message"
                      className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all hover:bg-indigo-500/10 hover:text-indigo-500 hover:border-indigo-500/30"
                      style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
                      <MessageSquare size={17} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSideAlert(alert); }}
                      title="View details"
                      className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all hover:bg-muted group-hover:translate-x-0.5"
                      style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 border-none bg-indigo-500/[0.06] relative overflow-hidden group">
            <Activity size={48} className="absolute -right-4 -bottom-4 text-indigo-500/10 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-3 opacity-60">Pulse Rate</p>
            <p className="text-4xl font-black tracking-tighter" style={{ color: "var(--foreground)" }}>98.4%</p>
            <p className="text-xs mt-2 font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>System Uptime</p>
          </Card>
          <Card className="p-8 border-none bg-emerald-500/[0.06] relative overflow-hidden group">
            <CheckCircle2 size={48} className="absolute -right-4 -bottom-4 text-emerald-500/10 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-3 opacity-60">Resolution</p>
            <p className="text-4xl font-black tracking-tighter" style={{ color: "var(--foreground)" }}>12m</p>
            <p className="text-xs mt-2 font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Avg. Response Time</p>
          </Card>
          <Card className="p-8 border-none bg-orange-500/[0.06] relative overflow-hidden group">
            <Zap size={48} className="absolute -right-4 -bottom-4 text-orange-500/10 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-3 opacity-60">Efficiency</p>
            <p className="text-4xl font-black tracking-tighter" style={{ color: "var(--foreground)" }}>+24%</p>
            <p className="text-xs mt-2 font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Client Success Rate</p>
          </Card>
        </div>
      </main>

      {/* Modals */}
      {messageAlert && <MessageModal alert={messageAlert} onClose={() => setMessageAlert(null)} />}
      {sideAlert && <ClientSidePanel alert={sideAlert} onClose={() => setSideAlert(null)} />}
    </div>
  );
}
