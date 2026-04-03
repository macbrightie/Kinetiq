"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Filter, ChevronDown, Sparkles, Activity, CheckCircle2, TriangleAlert, AlertCircle as Danger } from "lucide-react";
import { FitnessFigure } from "@/components/FitnessFigure";
import { getActivityType } from "@/lib/fitnessUtils";

// Types
export interface ActivityItem { name: string; icon: string; pct: number; color: string; }
export interface ClientType {
    id: number; name: string; initials: string; score: number; status: string;
    lastActive: string; workouts: string; color: string; photo: string;
    origin: string; week: number[]; topActivities: ActivityItem[];
    calories: number; weightChange: number; aiMsg: string; tip: string; actionLabel: string;
    connectedChannels: string[];
}
export type SortMode = "all" | "best" | "worst" | "warning";

export const STATUS_CFG: Record<string, { color: string; bg: string; label: string; icon: React.ReactNode }> = {
    "Healthy": { color: "#10b981", bg: "rgba(16,185,129,0.12)", label: "Healthy", icon: <FitnessFigure type="healthy" size={14}  /> },
    "Warning": { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "Warning", icon: <FitnessFigure type="warning" size={14}  /> },
    "At Risk": { color: "#ef4444", bg: "rgba(239,68,68,0.12)", label: "At Risk", icon: <FitnessFigure type="at-risk" size={14}  /> },
};

export const getStatusConfig = (status: string) => {
    return STATUS_CFG[status] || { 
        color: "#94a3b8", 
        bg: "rgba(148,163,184,0.12)", 
        label: status || "Unknown", 
        icon: <Activity size={14} /> 
    };
};

export const FILTER_LABELS: Record<SortMode, string> = { all: "All Clients", best: "Best Performance", worst: "Struggling", warning: "Needs Attention" };

export function Hatch({ id, color }: { id: string; color: string }) {
    return (
        <pattern id={id} width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke={color} strokeWidth="2.5" opacity="0.3" />
        </pattern>
    );
}

export function OutlineLightButton({ label, onClick }: { label: string; onClick?: () => void }) {
    return (
        <button onClick={onClick} className="px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 hover:bg-white hover:text-black transition-all shadow-xl shadow-indigo-500/10 active:scale-95"
            style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)" }}>
            {label}
        </button>
    );
}

export default function ClientHealthChart({
    selectedClient,
    onSelect,
    clients,
    mode = "dashboard",
}: {
    selectedClient: ClientType | null;
    onSelect: (c: ClientType | null) => void;
    clients: ClientType[];
    mode?: "dashboard" | "analytics";
}) {
    const [hovered, setHovered] = useState<number | null>(null);
    const [sortMode, setSortMode] = useState<SortMode>("all");
    const [aiMsg, setAiMsg] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);

    useEffect(() => { setAiMsg(selectedClient ? selectedClient.aiMsg : ""); }, [selectedClient]);

    const sorted = useMemo(() => {
        const c = [...clients];
        if (sortMode === "best") return c.sort((a, b) => b.score - a.score);
        if (sortMode === "worst") return c.sort((a, b) => a.score - b.score);
        if (sortMode === "warning") return c.filter((x) => x.status !== "Healthy");
        return c;
    }, [sortMode, clients]);

    const CHART_H = 240;

    const healthyCount = clients.filter(c => c.status === "Healthy").length;
    const warningCount = clients.filter(c => c.status === "Warning").length;
    const riskCount = clients.filter(c => c.status === "At Risk").length;

    return (
        <div className="rounded-2xl overflow-visible relative" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between px-7 py-5" style={{ borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "var(--border)" }}>
                <div>
                    <h2 className="text-xl font-medium" style={{ color: "var(--foreground)" }}>Client Health</h2>
                    <p className="text-xs mt-0.5 font-medium" style={{ color: "var(--muted-foreground)" }}>Click a bar to open the client detail panel →</p>
                </div>
                <div className="flex items-center gap-3">
                    {[{ label: "Healthy", count: healthyCount, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
                    { label: "Warning", count: warningCount, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
                    { label: "At Risk", count: riskCount, color: "#ef4444", bg: "rgba(239,68,68,0.1)" }].map((s) => (
                        <div key={s.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: s.bg }}>
                            <span className="text-xs font-medium" style={{ color: s.color }}>{s.count}</span>
                            <span className="text-[12px] font-medium" style={{ color: s.color }}>{s.label}</span>
                        </div>
                    ))}
                    <div className="relative">
                        <button onClick={() => setFilterOpen((o) => !o)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80 cursor-pointer"
                            style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                            <Filter size={12}  /> {FILTER_LABELS[sortMode]} <ChevronDown size={11}  />
                        </button>
                        {filterOpen && (
                            <div className="absolute right-0 top-full mt-1 z-50 rounded-xl overflow-hidden shadow-2xl"
                                style={{ background: "var(--card)", border: "1px solid var(--border)", minWidth: 175 }}>
                                {(["all", "best", "worst", "warning"] as SortMode[]).map((m) => (
                                    <button key={m} className="w-full text-left px-4 py-2.5 text-xs font-medium cursor-pointer"
                                        style={{ background: sortMode === m ? "var(--muted)" : "transparent", color: "var(--foreground)" }}
                                        onClick={() => { setSortMode(m); setFilterOpen(false); }}>{FILTER_LABELS[m]}</button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="relative px-7 pt-10 pb-0" style={{ height: CHART_H + 54 }}>
                <div className="absolute left-7 top-10 flex flex-col justify-between pointer-events-none"
                    style={{ height: CHART_H, fontSize: 11, color: "var(--muted-foreground)", opacity: 0.35 }}>
                    {["100", "75", "50", "25", "0"].map((v) => <span key={v}>{v}</span>)}
                </div>
                <div className="absolute inset-x-14 top-10 flex flex-col justify-between pointer-events-none" style={{ height: CHART_H }}>
                    {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ height: 1, background: "var(--border)", opacity: 0.4 }} />)}
                </div>
                <div className="absolute left-14 right-7 top-10 flex items-end gap-2" style={{ height: CHART_H }}>
                    {sorted.map((client, i) => {
                        const barH = Math.max(6, (client.score / 100) * CHART_H);
                        const isSel = selectedClient?.id === sorted[i].id;
                        const isHov = hovered === i;
                        const cfg = getStatusConfig(client.status);
                        return (
                            <div key={client.id} className="relative flex-1 flex flex-col items-center cursor-pointer"
                                style={{ height: "100%", justifyContent: "flex-end" }}
                                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                                onClick={() => { onSelect(isSel ? null : sorted[i]); }}>
                                {(isHov || isSel) && (
                                    <div className="absolute bottom-full mb-2 px-2.5 py-1 rounded-full text-[12px] font-medium text-white z-10 shadow-lg whitespace-nowrap"
                                        style={{ background: client.color, boxShadow: `0 4px 14px ${client.color}55`, animation: "pop .15s ease-out" }}>
                                        {client.score}
                                    </div>
                                )}
                                <div className="w-full overflow-hidden relative"
                                    style={{
                                        height: barH, borderRadius: "8px 8px 0 0",
                                        background: isSel ? `linear-gradient(180deg,${client.color} 0%,${client.color}bb 100%)` : isHov ? `linear-gradient(180deg,${client.color}dd 0%,${client.color}77 100%)` : "transparent",
                                        borderWidth: "1.5px 1.5px 0 1.5px",
                                        borderStyle: "solid",
                                        borderColor: isSel || isHov ? client.color : "rgba(255,255,255,0.08)",
                                        boxShadow: isSel ? `0 -8px 32px ${client.color}55` : isHov ? `0 -4px 18px ${client.color}33` : "none",
                                        transform: isHov && !isSel ? "translateY(-4px)" : "translateY(0)",
                                        transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                                    }}>
                                    {!isHov && !isSel && (
                                        <svg width="100%" height="100%" className="absolute inset-0" preserveAspectRatio="none">
                                            <Hatch id={`h${i}`} color="#6b7280" />
                                            <rect width="100%" height="100%" fill={`url(#h${i})`} />
                                        </svg>
                                    )}
                                    {(isHov || isSel) && <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)" }} />}
                                    {isSel && <div className="absolute top-0 left-2 right-2 h-px rounded-full" style={{ background: "rgba(255,255,255,0.5)" }} />}
                                </div>
                                <div className="mt-2.5 text-center">
                                    <p className="text-[12px] font-medium truncate transition-all duration-200"
                                        style={{ color: isSel || isHov ? "var(--foreground)" : "var(--muted-foreground)", opacity: isSel || isHov ? 1 : 0.5 }}>
                                        {client.name.split(" ")[0]}
                                    </p>
                                    <div className="w-1.5 h-1.5 rounded-full mx-auto mt-1" style={{ background: cfg.color }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* AI Footer */}
            {mode === "dashboard" ? (
                <div className="mx-5 mb-5 mt-2 rounded-2xl overflow-hidden"
                    style={{
                        background: "rgba(6,6,14,0.72)", backdropFilter: "blur(24px) saturate(200%)",
                        WebkitBackdropFilter: "blur(24px) saturate(200%)",
                        border: "1px solid rgba(139,92,246,0.22)",
                        boxShadow: "0 12px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
                        animation: "gentleBounce 3.5s ease-in-out infinite",
                    }}>
                    <div className="flex items-center gap-3 px-5 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg,#6366f1,#a78bfa)" }}>
                            <Sparkles size={14} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-white leading-tight">Kinetiq AI</p>
                            <p className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>Select a client bar → get a pre-written coaching summary</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.28)" }}>Live</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-5 py-3.5">
                        <Activity size={13} style={{ color: "#a78bfa", opacity: 0.65, flexShrink: 0 }} />
                        <input type="text" value={aiMsg} onChange={(e) => setAiMsg(e.target.value)}
                            placeholder="Click a client bar above to load their AI message…"
                            className="flex-1 bg-transparent outline-none text-sm"
                            style={{ color: aiMsg ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.22)" }} />
                        {aiMsg && <OutlineLightButton label={selectedClient?.actionLabel ?? "📞 Reach Out"} />}
                    </div>
                </div>
            ) : (
                <div className="mx-5 mb-5 mt-2 rounded-2xl overflow-hidden"
                    style={{
                        background: "var(--background)",
                        border: "1px solid var(--border)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    }}>
                    <div className="flex items-center gap-3 px-5 pt-4 pb-3" style={{ borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "var(--border)" }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg,#6366f1,#a78bfa)" }}>
                            <Sparkles size={14} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-extrabold leading-tight" style={{ color: "var(--foreground)"}}>AI Summary</p>
                            <p className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>Performance breakdown</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-5 py-4">
                        <Activity size={18} className="text-indigo-500 shrink-0" />
                        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                            {selectedClient ? (
                                <>
                                    <span className="font-bold text-indigo-500">{selectedClient.name}: </span>
                                    {selectedClient.aiMsg}
                                </>
                            ) : (
                                <>
                                    Overall client health is up by <span className="text-emerald-500 font-medium">12%</span> this month. {warningCount + riskCount} clients are currently flagged for intervention, primarily due to recent inactivity.
                                </>
                            )}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
