"use client";

import React, { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { 
    Sun, 
    Moon, 
    Bell, 
    Users, 
    Activity, 
    TriangleAlert, 
    CheckCircle2 as CheckCircle, 
    TrendingUp, 
    TrendingDown,
    Filter,
    ChevronDown,
    Sparkles,
    MessageCircle,
    Phone,
    LayoutDashboard,
    Plus,
    UserPlus,
    Send,
    Zap,
    AlertCircle,
    Instagram,
    Mail
} from "lucide-react";
import { InviteClientModal } from "@/components/InviteClientModal";
import { Loader } from "@/components/Loader";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, BookmarkIcon, ArrowUpRightIcon } from "lucide-react";

import ClientHealthChart, { ClientType, SortMode, STATUS_CFG } from "@/components/ClientHealthChart";
import { FitnessFigure } from "@/components/FitnessFigure";
import { getActivityType } from "@/lib/fitnessUtils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── Clients ──────────────────────────────────────────────────────────────────

// ─── Clients ──────────────────────────────────────────────────────────────────
// CLIENTS mock data removed - now fetched from API

// ─── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
    const w = 80, h = 36;
    const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
    const pts = data.map((v, i) => [
        (i / (data.length - 1)) * w,
        h * 0.1 + ((1 - (v - min) / range) * h * 0.8),
    ] as [number, number]);
    const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
    const area = `${path}L${w},${h}L0,${h}Z`;
    const peakIdx = data.indexOf(max);
    const gid = `sg${color.replace(/[^a-z0-9]/gi, "")}`;
    return (
        <svg width={w} height={h} style={{ overflow: "visible" }}>
            <defs>
                <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={area} fill={`url(#${gid})`} />
            <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={pts[peakIdx][0]} cy={pts[peakIdx][1]} r="3.5" fill={color} />
        </svg>
    );
}

// ─── Count-up ────────────────────────────────────────────────────────────────
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const inc = target / (1200 / 16);
        const id = setInterval(() => {
            start += inc;
            if (start >= target) { setCount(target); clearInterval(id); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(id);
    }, [target]);
    return <>{count}{suffix}</>;
}

// ─── Ring ────────────────────────────────────────────────────────────────────
function Ring({ pct, color, size = 48 }: { pct: number; color: string; size?: number }) {
    const r = (size - 6) / 2, c = 2 * Math.PI * r;
    return (
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3.5" />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="3.5"
                strokeDasharray={`${(pct / 100) * c} ${c}`} strokeLinecap="round" />
        </svg>
    );
}

// ─── Hatch defs ───────────────────────────────────────────────────────────────
function Hatch({ id, color }: { id: string; color: string }) {
    return (
        <defs>
            <pattern id={id} patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="10" stroke={color} strokeWidth="2.5" strokeOpacity="0.15" />
            </pattern>
        </defs>
    );
}

// ─── Stat card stripe pattern ───────────────────────────────────────────────
function CreditCardPattern({ id }: { id: string }) {
    return (
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            <defs>
                <pattern id={id} patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(255,255,255,0.09)" strokeWidth="5" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${id})`} />
        </svg>
    );
}

// ─── Outline animated button ─────────────────────────────────────────────────
function OutlineLightButton({ label }: { label: string }) {
    return (
        <div className="shrink-0 rounded-xl cursor-pointer p-px"
            style={{ background: "linear-gradient(90deg,#6366f1,#a78bfa,#ec4899,#f59e0b,#6366f1)", backgroundSize: "300% 100%", animation: "movingBorder 3s linear infinite" }}>
            <div className="flex items-center gap-1.5 px-5 py-2.5 rounded-[11px] text-xs font-medium tracking-wide active:scale-95"
                style={{ background: "rgba(10,10,20,0.92)", color: "#a78bfa" }}>
                {label}
            </div>
        </div>
    );
}

// ─── Push-layout right panel (inline card, no overlay) ───────────────────────
function ClientSidePanel({ client, onClose, onCheckIn }: { client: ClientType; onClose: () => void; onCheckIn: () => void }) {
    const cfg = STATUS_CFG[client.status];
    const [msg, setMsg] = useState(client.aiMsg);
    useEffect(() => { setMsg(client.aiMsg); }, [client.aiMsg]);

    return (
        <div
            className="flex flex-col overflow-hidden"
            style={{
                width: 360,
                flexShrink: 0,
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 24,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                position: "sticky",
                top: 80,
                maxHeight: "calc(100vh - 96px)",
                overflowY: "auto",
                animation: "slideInRight .28s cubic-bezier(0.34,1.2,0.64,1)",
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 shrink-0"
                style={{ borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "var(--border)" }}>
                <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                        <img src={client.photo} alt={client.name} className="avatar-sq"
                            style={{ width: 56, height: 56, boxShadow: `0 0 0 2.5px var(--card), 0 0 0 4px ${cfg.color}` }} />
                        <span className="absolute -bottom-0.5 -right-0.5 text-base">{cfg.icon}</span>
                    </div>
                    <div>
                        <p className="font-medium text-sm leading-tight" style={{ color: "var(--foreground)" }}>{client.name}</p>
                        <p className="text-[12px] mt-0.5 font-medium" style={{ color: "var(--muted-foreground)" }}>{client.origin} · {client.lastActive}</p>
                        <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full inline-block mt-1.5"
                            style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                    </div>
                </div>
                 <button onClick={onClose}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:opacity-60"
                    style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                    <Plus style={{transform: "rotate(45deg)"}} size={14} />
                </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Score ring card */}
                <div className="rounded-2xl p-5 flex items-center gap-4"
                    style={{ background: `${client.color}10`, border: `1px solid ${client.color}22` }}>
                    <div className="relative flex items-center justify-center shrink-0">
                        <Ring pct={client.score} color={client.color} size={72} />
                        <span className="absolute text-xl font-medium" style={{ color: client.color }}>{client.score}</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-[12px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--muted-foreground)" }}>Health Score</p>
                        <p className="font-medium text-sm" style={{ color: "var(--foreground)" }}>{client.workouts} workouts</p>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                                style={{ background: client.weightChange > 0 ? "rgba(245,158,11,0.12)" : "rgba(16,185,129,0.12)", color: client.weightChange > 0 ? "#f59e0b" : "#10b981" }}>
                                {client.weightChange > 0 ? "▲" : "▼"} {Math.abs(client.weightChange)}kg weight
                            </span>
                        </div>
                    </div>
                </div>

                {/* This week heatmap */}
                <div>
                    <p className="text-[12px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>This Week</p>
                    <div className="flex items-end gap-2 justify-between">
                        {client.week.map((v, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div className="rounded-md w-7 hover:brightness-125 transition-all cursor-pointer"
                                    style={{ height: v === 0 ? 6 : Math.max(8, (v / 10) * 56), background: v === 0 ? "rgba(255,255,255,0.06)" : client.color, opacity: v === 0 ? 1 : 0.25 + (v / 10) * 0.75 }} />
                                <span className="text-[12px]" style={{ color: "var(--muted-foreground)", opacity: 0.5 }}>{DAYS[i].slice(0, 1)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity breakdown */}
                <div>
                    <p className="text-[12px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>Activity Breakdown</p>
                    <div className="space-y-3">
                        {client.topActivities.map((a, i) => (
                            <div key={i}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>{a.icon} {a.name}</span>
                                    <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{a.pct > 0 ? `${a.pct}%` : "—"}</span>
                                </div>
                                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                                    <div className="h-full rounded-full transition-all duration-700"
                                        style={{ width: `${a.pct}%`, background: a.color, opacity: a.pct === 0 ? 0 : 1 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calories */}
                <div className="flex items-center justify-between rounded-xl px-4 py-3"
                    style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.15)" }}>
                    <div className="flex items-center gap-2">
                        <Zap size={14} style={{ color: "#f97316" }} />
                        <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Avg Daily Calories</span>
                    </div>
                    <span className="font-medium" style={{ color: "#f97316" }}>{client.calories} kcal</span>
                </div>

                {/* Sidebar footer nudge — not a dupe: points to bottom floating bar */}
                <div className="rounded-2xl p-4 text-center" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                    <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>💬 Ready to reach out?</p>
                    <p className="text-xs mt-1 opacity-70" style={{ color: "var(--muted-foreground)" }}>Hit <strong>Personalize &amp; Send</strong> at the bottom of the screen to personalise and choose a channel.</p>
                </div>
            </div>
        </div>
    );
}

// ─── Activity Section ─────────────────────────────────────────────────────────
function ActivitySection({ onCheckIn, clients }: { onCheckIn: (c: ClientType) => void; clients: ClientType[] }) {
    const [tooltip, setTooltip] = useState<{ text: string; status: string; x: number; y: number } | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [search, setSearch] = useState("");

    const filtered = useMemo(() =>
        clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.status.toLowerCase().includes(search.toLowerCase()) ||
            c.origin.toLowerCase().includes(search.toLowerCase())
        ), [search, clients]);

    const handleMouseMove = (e: React.MouseEvent, client: ClientType) => {
        const x = e.clientX;
        const y = e.clientY;
        setTooltip({ text: client.tip, status: client.status, x, y });
    };

    const tipIcon = (s: string) => {
        if (s === "At Risk") return <AlertCircle size={15} color="#ef4444" />;
        if (s === "Warning") return <Phone size={15} color="#f59e0b" />;
        return <MessageCircle size={15} color="#10b981" />;
    };
    const tipBg = (s: string) => s === "At Risk" ? "rgba(239,68,68,0.1)" : s === "Warning" ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)";
    const tipAction = (s: string) => s === "At Risk" ? "Action: Contact immediately" : s === "Warning" ? "Action: Schedule a call" : "Action: Keep the momentum going";

    return (
        <div>
            {/* Header row — title left, controls right */}
            <div className="flex items-center justify-between mb-5 gap-3">
                <div>
                    <h2 className="text-base font-medium" style={{ color: "var(--foreground)" }}>Client Activity</h2>
                    <p className="text-xs mt-0.5 font-medium" style={{ color: "var(--muted-foreground)" }}>Weekly overview · {filtered.length} clients</p>
                </div>

                {/* Controls — pushed right */}
                <div className="flex items-center gap-2.5 shrink-0">
                    {/* Search bar */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-full"
                        style={{ background: "var(--card)", border: "1px solid var(--border)", width: 230 }}>
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--muted-foreground)", opacity: 0.5, flexShrink: 0 }}>
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search clients…"
                            className="flex-1 bg-transparent outline-none text-xs"
                            style={{ color: "var(--foreground)" }} />
                        {search && (
                            <Button 
                                variant="ghost" 
                                size="icon-xs" 
                                onClick={() => setSearch("")} 
                                className="opacity-50 hover:opacity-100"
                            >
                                <Plus style={{transform: "rotate(45deg)"}} size={12} />
                            </Button>
                        )}
                    </div>

                    {/* Grid / List toggle */}
                    <div className="flex items-center rounded-full p-0.5 gap-0.5"
                        style={{ background: "var(--muted)" }}>
                         {(["grid", "list"] as const).map((v) => (
                            <Button 
                                key={v} 
                                onClick={() => setViewMode(v)}
                                variant={viewMode === v ? "secondary" : "ghost"}
                                size="sm"
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold uppercase transition-all shadow-none",
                                    viewMode === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                                )}
                            >
                                {v === "grid" ? (
                                    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                                        <rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" />
                                        <rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                                        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                                    </svg>
                                )}
                                {v}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Floating tooltip with boundary detection */}
            {tooltip && (
                <div className="fixed z-[100] pointer-events-none"
                    style={{
                        left: tooltip.x > window.innerWidth - 300 ? tooltip.x - 260 : tooltip.x + 14,
                        top: tooltip.y > window.innerHeight - 150 ? tooltip.y - 140 : tooltip.y - 12,
                        animation: "tooltipIn .2s cubic-bezier(0.34,1.56,0.64,1)",
                        transform: tooltip.y > window.innerHeight - 150 ? "none" : "translateY(-100%)"
                    }}>
                    <div className="relative" style={{ background: "#fff", borderRadius: 16, padding: "12px 16px", boxShadow: "0 8px 40px rgba(0,0,0,0.18)", maxWidth: 240, border: "1px solid rgba(0,0,0,0.04)" }}>
                        <div className="flex items-start gap-3">
                            <div className="rounded-lg p-1.5 shrink-0" style={{ background: tipBg(tooltip.status) }}>{tipIcon(tooltip.status)}</div>
                            <p style={{ color: "#111", fontSize: 12, fontWeight: 500, lineHeight: 1.5 }}>{tooltip.text}</p>
                        </div>
                        <p style={{ color: "#999", fontSize: 10, marginTop: 8, fontWeight: 600 }}>{tipAction(tooltip.status)}</p>
                        {/* Tail */}
                        <div style={{
                            position: "absolute",
                            bottom: tooltip.y > window.innerHeight - 150 ? "auto" : -5,
                            top: tooltip.y > window.innerHeight - 150 ? -5 : "auto",
                            left: tooltip.x > window.innerWidth - 300 ? "auto" : 26,
                            right: tooltip.x > window.innerWidth - 300 ? 26 : "auto",
                            width: 10, height: 10, background: "#fff", transform: "rotate(45deg)",
                            boxShadow: "2px 2px 5px rgba(0,0,0,0.05)"
                        }} />
                    </div>
                </div>
            )}

            {filtered.length === 0 && (
                <div className="text-center py-12" style={{ color: "var(--muted-foreground)" }}>
                    <p className="text-3xl mb-2">🔍</p>
                    <p className="text-sm font-medium">No clients match "{search}"</p>
 <button onClick={() => setSearch("")} className="text-xs mt-2 underline opacity-60">Clear search</button>
                </div>
            )}

            {/* ── GRID VIEW ── */}
            {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {filtered.map((client) => {
                        const cfg = STATUS_CFG[client.status];
                        return (
                            <div key={client.id}
                                className="rounded-2xl flex flex-col overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1"
                                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                                onClick={() => onCheckIn(client)}
                                onMouseEnter={(e) => handleMouseMove(e, client)}
                                onMouseMove={(e) => handleMouseMove(e, client)}
                                onMouseLeave={() => setTooltip(null)}>
                                <div className="p-5 flex flex-col gap-4 flex-1">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="relative shrink-0">
                                                <img src={client.photo} alt={client.name} className="avatar-sq"
                                                    style={{ width: 48, height: 48, boxShadow: `0 0 0 2px var(--card), 0 0 0 3.5px ${cfg.color}` }} />
                                                {(client.lastActive.includes("m ago") || client.lastActive.includes("1h") || client.lastActive.includes("2h")) && (
                                                    <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full" style={{ background: "#10b981", border: "1.5px solid var(--card)" }} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium leading-tight" style={{ color: "var(--foreground)" }}>{client.name}</p>
                                                <p className="text-[12px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>{client.lastActive}</p>
                                                <p className="text-[12px] opacity-50 font-medium" style={{ color: "var(--muted-foreground)" }}>{client.origin}</p>
                                            </div>
                                        </div>
                                        <div className="relative flex items-center justify-center shrink-0">
                                            <Ring pct={client.score} color={client.color} size={44} />
                                            <span className="absolute text-[12px] font-semibold" style={{ color: "var(--foreground)" }}>{client.score}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        {client.topActivities.map((a, i) => (
                                            <div key={i}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>{a.icon} {a.name}</span>
                                                    <span className="text-[12px] font-semibold" style={{ color: "var(--foreground)" }}>{a.pct > 0 ? `${a.pct}%` : "—"}</span>
                                                </div>
                                                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                                                    <div className="h-full rounded-full transition-all duration-700"
                                                        style={{ width: `${a.pct}%`, background: a.color, opacity: a.pct === 0 ? 0 : 1 }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1.5">
                                            {DAYS.map((d) => <span key={d} className="text-[12px]" style={{ color: "var(--muted-foreground)", opacity: 0.4 }}>{d.slice(0, 1)}</span>)}
                                        </div>
                                        <div className="flex items-end gap-[3px]">
                                            {client.week.map((v, i) => (
                                                <div key={i} className="flex-1 rounded-sm hover:scale-110 transition-transform"
                                                    style={{ height: v === 0 ? 4 : Math.max(6, (v / 10) * 22), background: v === 0 ? "rgba(255,255,255,0.05)" : client.color, opacity: v === 0 ? 1 : 0.2 + (v / 10) * 0.8 }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="px-5 py-3.5 flex items-center justify-between"
                                    style={{ background: `linear-gradient(135deg, ${cfg.color}18 0%, ${cfg.color}30 100%)`, borderTop: `1px solid ${cfg.color}28` }}>
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0" style={{ background: `${cfg.color}28` }}>{cfg.icon}</div>
                                        <div>
                                            <p className="text-[12px] font-semibold leading-tight" style={{ color: cfg.color }}>{cfg.label}</p>
                                            <p className="text-[12px] mt-0.5 font-medium" style={{ color: "var(--muted-foreground)" }}>{client.workouts} sessions</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{client.calories}</p>
                                        <p className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>kcal/day</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── LIST VIEW ── */}
            {viewMode === "list" && (
                <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                    {/* Table head */}
                    <div className="grid px-5 py-3 text-[12px] font-semibold uppercase tracking-wider" style={{
                        gridTemplateColumns: "2fr 1fr 1.5fr 1fr 1fr 80px",
                        color: "var(--muted-foreground)", borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "var(--border)", background: "var(--muted)",
                    }}>
                        <span>Client</span><span>Score</span><span>Top Activity</span><span>Sessions</span><span>Calories</span><span>Status</span>
                    </div>
                    {filtered.map((client, i) => {
                        const cfg = STATUS_CFG[client.status];
                        const topAct = client.topActivities[0];
                        return (
                            <div key={client.id}
                                className="grid items-center px-5 py-3.5 transition-colors hover:opacity-90 cursor-pointer"
                                style={{
                                    gridTemplateColumns: "2fr 1fr 1.5fr 1fr 1fr 80px",
                                    borderBottomWidth: i < filtered.length - 1 ? 1 : 0,
                                    borderBottomStyle: "solid",
                                    borderBottomColor: "var(--border)",
                                }}
                                onClick={() => onCheckIn(client)}
                                onMouseEnter={(e) => handleMouseMove(e, client)}
                                onMouseMove={(e) => handleMouseMove(e, client)}
                                onMouseLeave={() => setTooltip(null)}>
                                {/* Name */}
                                <div className="flex items-center gap-3">
                                    <div className="relative shrink-0">
                                        <img src={client.photo} alt={client.name} className="avatar-sq-sm"
                                            style={{ width: 36, height: 36, boxShadow: `0 0 0 2px var(--card), 0 0 0 3px ${cfg.color}` }} />
                                        {(client.lastActive.includes("m ago") || client.lastActive.includes("1h") || client.lastActive.includes("2h")) && (
                                            <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full" style={{ background: "#10b981", border: "1.5px solid var(--card)" }} />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{client.name}</p>
                                        <p className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>{client.lastActive} · {client.origin}</p>
                                    </div>
                                </div>
                                {/* Score */}
                                <div className="flex items-center gap-2">
                                    <div className="relative flex items-center justify-center shrink-0">
                                        <Ring pct={client.score} color={client.color} size={32} />
                                        <span className="absolute text-[12px] font-semibold" style={{ color: "var(--foreground)" }}>{client.score}</span>
                                    </div>
                                </div>
                                {/* Top activity */}
                                <div className="flex items-center gap-2">
                                    <FitnessFigure type={getActivityType(topAct.icon)} size={16} />
                                    <div className="flex-1">
                                        <p className="text-[12px] font-semibold" style={{ color: "var(--foreground)" }}>{topAct.name}</p>
                                        <div className="h-1 rounded-full overflow-hidden mt-1" style={{ background: "rgba(255,255,255,0.06)", maxWidth: 80 }}>
                                            <div className="h-full rounded-full" style={{ width: `${topAct.pct}%`, background: topAct.color }} />
                                        </div>
                                    </div>
                                </div>
                                {/* Sessions */}
                                <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{client.workouts}</p>
                                {/* Calories */}
                                <p className="text-xs font-medium" style={{ color: "#f97316" }}>{client.calories} kcal</p>
                                 {/* Status badge */}
                                 <Badge 
                                     variant="secondary"
                                     className="w-[100px] justify-center border-none shadow-none"
                                     style={{ background: cfg.bg, color: cfg.color }}
                                 >
                                     {cfg.icon} {cfg.label}
                                 </Badge>
                             </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ─── Social Channel SVG Icons ──────────────────────────────────────────────
const WhatsAppIcon = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>;
const InstagramIcon = () => <svg viewBox="0 0 24 24" width="22" height="22"><defs><radialGradient id="igG2" cx="30%" cy="107%" r="150%"><stop offset="0%" stopColor="#fdf497" /><stop offset="5%" stopColor="#fdf497" /><stop offset="45%" stopColor="#fd5949" /><stop offset="60%" stopColor="#d6249f" /><stop offset="90%" stopColor="#285AEB" /></radialGradient></defs><path fill="url(#igG2)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>;
const XIcon = ({ dark }: { dark: boolean }) => <svg viewBox="0 0 24 24" width="22" height="22" fill={dark ? "#fff" : "#000"}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.629L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" /></svg>;
const KinetiqEmailIcon = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="#8b5cf6"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>;

// ─── Check-In Modal ──────────────────────────────────────────────────────────
function CheckInModal({ client, onClose, onSend }: { client: ClientType; onClose: () => void; onSend: (channel: string) => void }) {
    const { theme } = useTheme();
    const dark = theme === "dark";
    const [msg, setMsg] = useState(client.aiMsg);
    const cfg = STATUS_CFG[client.status];

    const border = "var(--border)";
    const textMuted = "var(--muted-foreground)";

    const allChannels = [
        { id: "whatsapp", label: "WhatsApp", icon: <WhatsAppIcon />, glow: "#25d366" },
        { id: "instagram", label: "Instagram DM", icon: <InstagramIcon />, glow: "#e1306c" },
        { id: "x", label: "X (Twitter) DM", icon: <XIcon dark={dark} />, glow: dark ? "#fff" : "#111" },
        { id: "kinetiq", label: "Kinetiq Email", icon: <KinetiqEmailIcon />, glow: "#8b5cf6" },
    ];

    const channels = allChannels.filter(c => client.connectedChannels.includes(c.id));

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0C0C0C]/60 backdrop-blur-md"
            style={{ animation: "fadeIn .18s ease-out" }}>
            <div className="rounded-[32px] w-full max-w-[500px] overflow-hidden shadow-2xl flex flex-col"
                style={{ background: "var(--card)", border: "1px solid var(--border)", maxHeight: "92vh", animation: "pop .22s cubic-bezier(0.34,1.56,0.64,1)" }}>

                {/* Decorative gradient strip */}
                <div className="h-1 w-full shrink-0"
                    style={{ background: `linear-gradient(90deg, ${client.color}, ${cfg.color}, #8b5cf6)` }} />

                {/* Header */}
                <div className="px-8 pt-7 pb-6 flex items-start justify-between shrink-0">
                    <div className="flex items-center gap-5">
                        {/* Square avatar with 16px radius */}
                        <div className="relative shrink-0">
                            <img src={client.photo} alt={client.name} className="avatar-sq"
                                style={{ width: 60, height: 60, border: `2.5px solid ${cfg.color}` }} />
                            <span className="absolute -bottom-1 -right-1 text-sm">{cfg.icon}</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-medium tracking-tight leading-tight" style={{ color: "var(--foreground)" }}>
                                Check in with {client.name.split(" ")[0]}
                            </h3>
                                <Badge 
                                    variant="secondary"
                                    className="mt-2.5 border-none shadow-none"
                                    style={{ background: cfg.bg, color: cfg.color }}
                                >
                                    {cfg.icon} {cfg.label} · Score {client.score}
                                </Badge>
                            </div>
                        </div>
                    <Button 
                        variant="ghost" 
                        size="icon-sm" 
                        onClick={onClose}
                        className="rounded-full"
                    >
                        <Plus style={{transform: "rotate(45deg)"}} size={14} />
                    </Button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-6">

                    {/* Coaching tip */}
                    <div className="rounded-2xl p-4 flex items-start gap-3"
                        style={{ background: `${cfg.color}12`, border: `1px solid ${cfg.color}25` }}>
                        <Sparkles size={14}  className="mt-0.5 shrink-0" style={{ color: cfg.color }} />
                        <p className="text-xs font-medium leading-relaxed" style={{ color: cfg.color }}>{client.tip}</p>
                    </div>

                    {/* Message box */}
                    <div className="space-y-2.5">
                        <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest" style={{ color: textMuted }}>
                            <span>Your Message</span>
                            <span>✏️</span>
                        </label>
                        <textarea value={msg} onChange={(e) => setMsg(e.target.value)}
                            className="w-full rounded-[24px] p-5 text-sm font-medium outline-none resize-none leading-relaxed transition-all"
                            style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)", minHeight: 100 }}
                            placeholder="Add your personal touch — skip the AI tone…" />
                        <p className="text-xs italic" style={{ color: textMuted }}>Coaches who personalise get 3× better responses.</p>
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: border }} />

                    {/* Channel buttons */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest" style={{ color: textMuted }}>
                            <span>Where to Send?</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {channels.map((c) => (
                                <Button 
                                    key={c.id} 
                                    onClick={() => onSend(c.id)}
                                    variant="outline"
                                    size="lg"
                                    className="group flex flex-col h-auto items-center gap-3 p-6 transition-all duration-300 hover:border-indigo-500/50 rounded-[32px]"
                                    style={{ 
                                        boxShadow: `0 8px 16px ${c.glow}08`,
                                        borderColor: border
                                    }}
                                >
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                                        style={{ background: `${c.glow}15`, color: c.glow }}>
                                        {c.icon}
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                                        {c.label.split(" ")[0]}
                                    </span>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Celebration Overlay ─────────────────────────────────────────────────────
function CelebrationOverlay({ clientName = "your client" }: { clientName?: string }) {
    const colors = ["#6366f1", "#a78bfa", "#f59e0b", "#10b981", "#f43f5e", "#38bdf8", "#fb923c"];

    useEffect(() => {
        // Quick cheer tones
        try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const now = ctx.currentTime;
            [0, 0.1, 0.2].forEach((delay, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(660 + i * 220, now + delay);
                osc.frequency.exponentialRampToValueAtTime(1100 + i * 220, now + delay + 0.18);
                gain.gain.setValueAtTime(0.09, now + delay);
                gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.35);
                osc.connect(gain); gain.connect(ctx.destination);
                osc.start(now + delay); osc.stop(now + delay + 0.45);
            });
        } catch (_) { }
    }, []);

    return (
        <div className="fixed inset-0 z-[200] pointer-events-none flex flex-col items-center justify-center"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)", animation: "fadeIn 0.3s ease-out" }}>
            {/* Confetti */}
            {Array.from({ length: 55 }).map((_, i) => (
                <div key={i} className="absolute top-0"
                    style={{
                        left: `${Math.random() * 100}%`,
                        background: colors[Math.floor(Math.random() * colors.length)],
                        width: Math.random() * 10 + 4,
                        height: Math.random() * 14 + 5,
                        borderRadius: Math.random() > 0.5 ? "50%" : "3px",
                        animationName: "confettiDrop",
                        animationDuration: `${Math.random() * 2 + 2.2}s`,
                        animationTimingFunction: "ease-in",
                        animationDelay: `${Math.random() * 1.4}s`,
                        animationFillMode: "forwards",
                    }} />
            ))}
            {/* Celebration card */}
            <div className="bg-[#0f0f1a]/95 border border-white/10 rounded-[32px] px-10 py-8 text-center shadow-2xl max-w-sm"
                style={{ animation: "celebrate 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
                <div className="text-[72px] leading-none mb-4"
                    style={{ animation: "clapHands 0.4s ease-in-out infinite alternate" }}>
                    👏
                </div>
                <h3 className="text-2xl font-medium text-white tracking-tight">You did it, Coach!</h3>
                <p className="text-sm text-white/55 mt-2 leading-relaxed">
                    You just checked in with <strong className="text-white/90">{clientName}</strong>.<br />
                    Personal messages like this build real trust and momentum.
                </p>
                <div className="mt-6 flex justify-center">
                    <Badge variant="secondary" className="gap-2 px-4 py-2 text-[12px] text-[#10b981] bg-[#10b981]/10 border-none shadow-none">
                        <BadgeCheck size={14} data-icon="inline-start" />
                        Impact Verified · Trust Multiplied 🚀
                    </Badge>
                </div>
            </div>
        </div>
    );
}


// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
    const { theme, toggle } = useTheme();
    const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    const [hoveredStat, setHoveredStat] = useState<string | null>(null);
    const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);
    const [buzz, setBuzz] = useState(false);
    const [showCheckIn, setShowCheckIn] = useState<ClientType | null>(null);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [celebrating, setCelebrating] = useState(false);
    
    // Real Data State
    const [clients, setClients] = useState<ClientType[]>([]);
    const [dashboardStats, setDashboardStats] = useState({
        totalClients: "0",
        avgScore: "0%",
        atRisk: "0",
        activeEngage: "0%"
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch('/api/coach/clients');
                if (res.ok) {
                    const data = await res.json();
                    setClients(data.clients);
                    setDashboardStats(data.stats);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Trigger buzz when selected client changes
    useEffect(() => {
        if (selectedClient) {
            setBuzz(true);
            const t = setTimeout(() => setBuzz(false), 800);
            return () => clearTimeout(t);
        }
    }, [selectedClient?.id]);

    const handleAction = () => {
        if (selectedClient) setShowCheckIn(selectedClient);
    };

    const handleSend = (channel: string) => {
        setShowCheckIn(null);
        setCelebrating(true);
        setTimeout(() => setCelebrating(false), 3000);
    };

    const displayStats = [
        { label: "Total Clients", value: dashboardStats.totalClients, badge: "+2 this month", trend: "up", icon: Users, color: "#6366f1" },
        { label: "Avg. Health Score", value: dashboardStats.avgScore, badge: "Live data", trend: "up", icon: Activity, color: "#0ea5e9" },
        { label: "At Risk", value: dashboardStats.atRisk, badge: "Needs attention", trend: "down", icon: TriangleAlert, color: "#f43f5e" },
        { label: "Active This Week", value: dashboardStats.activeEngage, badge: "Engagement", trend: "up", icon: CheckCircle, color: "#10b981" },
    ];

    return (
        <div className="flex flex-col min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
            {/* Header */}
            <DashboardHeader 
                title="Dashboard" 
                onInviteClick={() => setShowInviteModal(true)} 
            />

            {/* ── Main Dashboard Content ── */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-[1600px] mx-auto p-8 pt-6 space-y-10">
                    
                    {/* Page Headings */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                    <LayoutDashboard size={16} className="text-indigo-500" />
                                </div>
                                <span className="text-[12px] font-medium uppercase tracking-[0.2em] text-indigo-500 opacity-80">Your Daily Overview</span>
                            </div>
                            <h1 className="text-4xl font-medium tracking-tight leading-none" style={{ color: "var(--foreground)" }}>
                                Dashboard
                            </h1>
                        </div>
                    </div>

                    {/* Stat CreditCards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {displayStats.map((stat, i) => (
                            <div key={i} className="relative rounded-3xl p-6 overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-default"
                                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                                onMouseEnter={() => setHoveredStat(stat.label)} onMouseLeave={() => setHoveredStat(null)}>
                                <CreditCardPattern id={`cp${i}`} />
                                <div className="relative z-10 flex items-start justify-between">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                                        style={{ background: `${stat.color}15`, color: stat.color }}>
                                        <stat.icon size={24}  />
                                    </div>
                                    <Badge 
                                        variant="secondary"
                                        className="gap-1.5 px-2.5 py-1 text-[12px] font-bold uppercase tracking-widest border-none shadow-none"
                                        style={{ background: stat.trend === "up" ? "rgba(16,185,129,0.12)" : "rgba(244,63,94,0.12)", color: stat.trend === "up" ? "#10b981" : "#f43f5e" }}
                                    >
                                        {stat.trend === "up" ? <TrendingUp size={11}  /> : <TrendingDown size={11}  />}
                                        {stat.badge}
                                    </Badge>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-[12px] font-semibold uppercase tracking-widest leading-none mb-1" style={{ color: "var(--muted-foreground)" }}>{stat.label}</p>
                                    <h3 className="text-3xl font-black tracking-tighter" style={{ color: "var(--foreground)" }}>
                                        {loading ? "..." : (
                                            <CountUp 
                                                target={parseInt(stat.value.replace("%", "")) || 0} 
                                                suffix={stat.value.includes("%") ? "%" : ""} 
                                            />
                                        )}
                                    </h3>
                                    <div className="mt-4 h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                                        <div className="h-full rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: loading ? "0%" : "65%", background: stat.color, boxShadow: `0 0 12px ${stat.color}88` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-6">
                            <Loader />
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-500 opacity-60">Syncing Team Data...</p>
                        </div>
                    ) : clients.length === 0 ? (
                        <div className="text-center py-20 rounded-[40px]" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                            <div className="w-20 h-20 rounded-[30px] bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
                                <Users size={40}  className="text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-medium text-foreground mb-2">No clients yet</h2>
                            <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                                It's time to invite your first client and start tracking their progress with Kinetiq AI.
                            </p>
                            <Button 
                                onClick={() => setShowInviteModal(true)}
                                size="lg"
                                className="shadow-xl rounded-full px-8 py-6 font-bold active:scale-95 transition-all"
                            >
                                <UserPlus size={18} className="mr-2" />
                                Invite Your First Client
                            </Button>
                        </div>
                    ) : (
                        <div className={`flex gap-8 transition-all duration-500`}>
                            {/* Left: Main sections */}
                            <div className="flex-1 space-y-10 min-w-0">
                                <ClientHealthChart selectedClient={selectedClient} onSelect={setSelectedClient} clients={clients} />
                                <ActivitySection onCheckIn={setShowCheckIn} clients={clients} />
                            </div>

                            {/* Right: Side panel — only when a client is selected */}
                            {selectedClient && (
                                <ClientSidePanel 
                                    client={selectedClient} 
                                    onClose={() => setSelectedClient(null)} 
                                    onCheckIn={() => setShowCheckIn(selectedClient)}
                                />
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* ── Overlays ── */}
            {showCheckIn && <CheckInModal client={showCheckIn} onClose={() => setShowCheckIn(null)} onSend={handleSend} />}
            {showInviteModal && <InviteClientModal onClose={() => setShowInviteModal(false)} />}
            {celebrating && <CelebrationOverlay clientName={selectedClient?.name.split(" ")[0] ?? "your client"} />}

            {/* Floating Kinetiq AI Bar — z-[90] to sit above panels but below modals */}
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] transition-all duration-500 ${selectedClient ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-20 opacity-0 pointer-events-none"} ${buzz ? "ai-buzz" : ""}`}>
                <div className="rounded-full backdrop-blur-2xl border border-white/10 p-2 shadow-2xl flex items-center gap-4 pl-6 pr-2"
                     style={{ background: "#0C0C0Cee" }}>
                    <div className="flex items-center gap-2">
                        <Sparkles size={14}  className="text-purple-400" />
                        <span className="text-xs font-bold text-white tracking-tight">Kinetiq AI Ready</span>
                    </div>
                    <div className="h-4 w-px bg-white/20" />
                    <p className="text-xs text-white/60 font-medium tracking-tight">Personalized message for {selectedClient?.name.split(" ")[0]}</p>
                    <Button 
                        onClick={handleAction} 
                        size="sm" 
                        className="bg-white rounded-full font-bold h-9 px-5 active:scale-95 transition-all"
                        style={{ color: "#0C0C0C" }}
                    >
                        Send Now
                        <Send size={14} className="ml-2" />
                    </Button>
                </div>
            </div>

            <style>{`
                .ai-buzz { animation: aiBuzz 0.6s cubic-bezier(.36,.07,.19,.97) both; }
                @keyframes clapHands {
                    from { transform: scale(1) rotate(-8deg); }
                    to   { transform: scale(1.15) rotate(8deg); }
                }
            `}</style>
        </div>
    );
}
