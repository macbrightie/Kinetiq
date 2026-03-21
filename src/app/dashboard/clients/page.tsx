"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import {
    Users, Search, Filter, ChevronDown, Grid, List, 
    UserPlus, MessageCircle, AlertCircle, Phone, 
    X, Sparkles, TrendingUp, TrendingDown, MoreHorizontal,
    Activity, ArrowUpRight, ArrowDownRight, Eye, Trash2, ChevronRight
} from "lucide-react";
import { InviteClientModal } from "@/components/InviteClientModal";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";


// ─── Types & Constants ────────────────────────────────────────────────────────
interface ActivityItem { name: string; icon: string; pct: number; color: string; }
interface ClientType {
    id: string; name: string; initials: string; score: number; status: string;
    lastActive: string; workouts: string; color: string; photo: string;
    origin: string; week: number[]; topActivities: ActivityItem[];
    calories: number; weightChange: number; aiMsg: string; tip: string; actionLabel: string;
    connectedChannels: string[];
}
type SortMode = "name" | "score" | "active";
type RiskFilter = "all" | "Healthy" | "Warning" | "At Risk";

const STATUS_CFG: Record<string, { color: string; bg: string; label: string; icon: string }> = {
    "Healthy": { color: "#10b981", bg: "rgba(16,185,129,0.12)", label: "Healthy", icon: "💚" },
    "Warning": { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "Warning", icon: "⚠️" },
    "At Risk": { color: "#ef4444", bg: "rgba(239,68,68,0.12)", label: "At Risk", icon: "🚨" },
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── Helper Components ────────────────────────────────────────────────────────
function Ring({ pct, color, size = 40 }: { pct: number; color: string; size?: number }) {
    const r = (size - 6) / 2, c = 2 * Math.PI * r;
    return (
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="3"
                strokeDasharray={`${(pct / 100) * c} ${c}`} strokeLinecap="round" />
        </svg>
    );
}

function CardPattern({ id }: { id: string }) {
    return (
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            <defs>
                <pattern id={id} patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${id})`} />
        </svg>
    );
}

// ─── Client Profile Side Panel ────────────────────────────────────────────────
function ClientProfilePanel({ client, onClose }: { client: ClientType; onClose: () => void }) {
    const cfg = STATUS_CFG[client.status];
    return (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }} onClick={onClose}>
            <div
                className="h-full w-full max-w-sm flex flex-col animate-in slide-in-from-right duration-300"
                style={{ background: "var(--card)", borderLeft: "1px solid var(--border)" }}
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
                    <h3 className="font-black text-lg" style={{ color: "var(--foreground)" }}>Client Profile</h3>
 <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-all" style={{ color: "var(--muted-foreground)" }}>
                        <X size={16} />
                    </button>
                </div>

                <div className="p-6 flex flex-col items-center text-center" style={{ borderBottom: "1px solid var(--border)" }}>
                    <div className="relative mb-4">
                        <img src={client.photo} alt={client.name} className="w-24 h-24 rounded-3xl object-cover shadow-md" style={{ border: `3px solid ${cfg.color}` }} />
                    </div>
                    <h2 className="text-xl font-black" style={{ color: "var(--foreground)" }}>{client.name}</h2>
                    <p className="text-sm font-medium mb-3" style={{ color: "var(--muted-foreground)" }}>{client.origin}</p>
                    <span className="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest" style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.icon} {cfg.label}
                    </span>
                </div>

                <div className="p-6 flex-1 overflow-y-auto space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: "var(--muted-foreground)" }}>Quick Stats</p>
                    {[
                        { label: "Health Score", value: `${client.score}%` },
                        { label: "Sessions", value: client.workouts },
                        { label: "Last Active", value: client.lastActive },
                        { label: "Calories", value: `${client.calories} kcal` },
                    ].map(stat => (
                        <div key={stat.label} className="flex items-center justify-between py-3 px-4 rounded-xl" style={{ background: "var(--muted)" }}>
                            <span className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>{stat.label}</span>
                            <span className="text-sm font-black" style={{ color: "var(--foreground)" }}>{stat.value}</span>
                        </div>
                    ))}

                    <div className="mt-4">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>Top Activities</p>
                        {client.topActivities.slice(0, 3).map((a, i) => (
                            <div key={i} className="mb-3">
                                <div className="flex justify-between text-xs font-bold mb-1" style={{ color: "var(--foreground)" }}>
                                    <span>{a.icon} {a.name}</span><span>{a.pct}%</span>
                                </div>
                                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                                    <div className="h-full rounded-full" style={{ width: `${a.pct}%`, background: a.color }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {client.aiMsg && (
                        <div className="p-4 rounded-xl mt-2" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                            <p className="text-xs font-bold mb-1 text-indigo-500">✨ AI Insight</p>
                            <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>{client.aiMsg}</p>
                        </div>
                    )}
                </div>

                <div className="p-6" style={{ borderTop: "1px solid var(--border)" }}>
 <button onClick={() => { alert(`Full profile for ${client.name} — extended profile page coming soon!`); }}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-sm transition-all hover:opacity-90"
                        style={{ background: "var(--foreground)", color: "var(--card)" }}>
                        View Full Profile <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Clients Page ────────────────────────────────────────────────────────
export default function ClientsPage() {
    const { theme, toggle } = useTheme();
    const [clients, setClients] = useState<ClientType[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [search, setSearch] = useState("");
    const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");
    const [sortBy, setSortBy] = useState<SortMode>("score");
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedClients, setSelectedClients] = useState<string[]>([]);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [profileClient, setProfileClient] = useState<ClientType | null>(null);
    const menuRef = useRef<HTMLTableDataCellElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await fetch('/api/coach/clients');
                if (res.ok) {
                    const data = await res.json();
                    setClients(data.clients);
                }
            } catch (error) {
                console.error("Failed to fetch clients:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    const filteredAndSortedClients = useMemo(() => {
        let result = clients.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                                 c.origin.toLowerCase().includes(search.toLowerCase());
            const matchesRisk = riskFilter === "all" || c.status === riskFilter;
            return matchesSearch && matchesRisk;
        });

        if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));
        if (sortBy === "score") result.sort((a, b) => b.score - a.score);
        if (sortBy === "active") result.sort((a, b) => a.lastActive.localeCompare(b.lastActive)); // TODO: Proper date sort

        return result;
    }, [clients, search, riskFilter, sortBy]);

    const toggleSelectAll = () => {
        if (selectedClients.length === filteredAndSortedClients.length) setSelectedClients([]);
        else setSelectedClients(filteredAndSortedClients.map(c => c.id));
    };

    const toggleSelect = (id: string) => {
        setSelectedClients(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center" style={{ background: "var(--background)" }}>
                <div className="flex flex-col items-center gap-6">
                    <Loader />
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-indigo-500 opacity-60">Initializing Roster...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
            <DashboardHeader
                title="Manage Clients"
                showInvite={true}
                onInviteClick={() => setShowInviteModal(true)}
            />

            {/* Filters bar */}
            <div className="px-8 py-4 sticky top-[69px] z-20 flex items-center gap-4" style={{ background: "var(--background)", borderBottom: "1px solid var(--border)" }}>
                <div className="flex items-center gap-2.5 flex-1 max-w-xl">
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1"
                        style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                        <Search size={16} className="text-muted-foreground opacity-50" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, origin..."
                            className="bg-transparent outline-none text-sm w-full font-medium" />
                    </div>
                    <div className="relative">
                        <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value as RiskFilter)}
                            className="appearance-none bg-transparent pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold border cursor-pointer outline-none transition-all hover:border-indigo-500/50"
                            style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                            <option value="all">Every Status</option>
                            <option value="Healthy">💚 Healthy</option>
                            <option value="Warning">⚠️ Warning</option>
                            <option value="At Risk">🚨 At Risk</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                    </div>
                </div>

                <p className="text-xs font-medium ml-auto" style={{ color: "var(--muted-foreground)" }}>
                    {filteredAndSortedClients.length} of {clients.length} clients
                </p>

                <div className="flex items-center gap-2 p-1 rounded-xl" style={{ background: "var(--muted)" }}>
 <button onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-foreground text-card shadow-lg" : "text-muted-foreground hover:text-foreground"}`}>
                        <Grid size={18} />
                    </button>
 <button onClick={() => setViewMode("list")}
                        className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-foreground text-card shadow-lg" : "text-muted-foreground hover:text-foreground"}`}>
                        <List size={18} />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {filteredAndSortedClients.length === 0 ? (
                    <div className="text-center py-20 rounded-[40px]" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                        <div className="w-20 h-20 rounded-[30px] bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
                            <Users size={40} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-2xl font-black text-foreground mb-2">No matching clients</h2>
                        <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                            Try adjusting your search filters or invite a new client to your roster.
                        </p>
 <Button onClick={() => {setSearch(""); setRiskFilter("all");}}
                            className="gap-2 px-8 py-4 font-black">
                            Clear Filters
                        </Button>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredAndSortedClients.map((client) => {
                            const cfg = STATUS_CFG[client.status];
                            return (
                                <div key={client.id} onClick={() => setProfileClient(client)} className="group relative rounded-[32px] overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer"
                                    style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                                    <CardPattern id={`cp-${client.id}`} />
                                    
                                    <div className="p-6 relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="relative">
                                                <img src={client.photo} alt={client.name} className="w-16 h-16 rounded-2xl object-cover shadow-xl"
                                                    style={{ border: `2.5px solid ${cfg.color}` }} />
                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-white dark:bg-zinc-900 border border-border flex items-center justify-center text-xs shadow-lg">
                                                    {cfg.icon}
                                                </div>
                                            </div>
                                            <div className="relative flex items-center justify-center">
                                                <Ring pct={client.score} color={client.color} size={48} />
                                                <span className="absolute text-xs font-black">{client.score}</span>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <h3 className="text-lg font-black tracking-tight leading-tight mb-1" style={{ color: "var(--foreground)" }}>{client.name}</h3>
                                            <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>{client.origin} · {client.lastActive}</p>
                                        </div>

                                        <div className="space-y-4 mb-6">
                                            {client.topActivities.slice(0, 2).map((a, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-1.5 opacity-60">
                                                        <span>{a.icon} {a.name}</span>
                                                        <span>{a.pct}%</span>
                                                    </div>
                                                    <div className="h-1.5 rounded-full overflow-hidden bg-muted/30">
                                                        <div className="h-full rounded-full transition-all duration-1000"
                                                            style={{ width: `${a.pct}%`, background: a.color }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="flex-1 py-3 rounded-xl bg-muted text-[11px] font-black uppercase tracking-widest text-center" style={{ color: "var(--foreground)" }}>
                                                View Profile
                                            </span>
                                            <span
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-11 h-11 rounded-xl bg-muted hover:bg-muted/70 flex items-center justify-center transition-all"
                                                style={{ color: "var(--muted-foreground)" }}>
                                                <MessageCircle size={18} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-[32px] overflow-hidden border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b" style={{ borderColor: "var(--border)", background: "var(--muted)" }}>
                                    <th className="px-6 py-4">
                                        <input type="checkbox" checked={selectedClients.length === filteredAndSortedClients.length} onChange={toggleSelectAll}
                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                    </th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Client</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Score</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Activity</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sessions</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAndSortedClients.map((client) => {
                                    const cfg = STATUS_CFG[client.status];
                                    return (
                                        <tr key={client.id} className="border-b hover:bg-muted/30 transition-colors last:border-0" style={{ borderColor: "var(--border)" }}>
                                            <td className="px-6 py-4">
                                                <input type="checkbox" checked={selectedClients.includes(client.id)} onChange={() => toggleSelect(client.id)}
                                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <img src={client.photo} alt={client.name} className="w-10 h-10 rounded-xl" />
                                                    <div>
                                                        <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{client.name}</p>
                                                        <p className="text-xs text-muted-foreground">{client.origin} · {client.lastActive}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
                                                    style={{ background: cfg.bg, color: cfg.color }}>
                                                    {cfg.icon} {cfg.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-10 h-1 rounded-full bg-muted overflow-hidden">
                                                        <div className="h-full rounded-full" style={{ width: `${client.score}%`, background: client.color }} />
                                                    </div>
                                                    <span className="text-xs font-bold">{client.score}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {client.topActivities.slice(0, 2).map((a, i) => (
                                                        <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                                                            {a.icon} {a.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-sm font-bold">{client.workouts}</p>
                                            </td>
                                            <td className="px-6 py-5 text-right relative" ref={openMenuId === client.id ? menuRef : null}>
 <button
                                                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === client.id ? null : client.id); }}
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                                {openMenuId === client.id && (
                                                    <div className="absolute right-4 top-full mt-1 w-44 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                                                        style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
 <button onClick={() => { setProfileClient(client); setOpenMenuId(null); }}
                                                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold hover:bg-muted/50 transition-colors text-left"
                                                            style={{ color: "var(--foreground)" }}>
                                                            <Eye size={15} /> View Profile
                                                        </button>
 <button onClick={() => { alert(`Message ${client.name} — coming soon!`); setOpenMenuId(null); }}
                                                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold hover:bg-muted/50 transition-colors text-left"
                                                            style={{ color: "var(--foreground)" }}>
                                                            <MessageCircle size={15} /> Message Client
                                                        </button>
                                                        <div className="my-1 h-px" style={{ background: "var(--border)" }} />
 <button onClick={() => { setClients(prev => prev.filter(c => c.id !== client.id)); setOpenMenuId(null); }}
                                                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold hover:bg-red-500/10 transition-colors text-left text-red-500">
                                                            <Trash2 size={15} /> Remove
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {showInviteModal && <InviteClientModal onClose={() => setShowInviteModal(false)} />}
            {profileClient && <ClientProfilePanel client={profileClient} onClose={() => setProfileClient(null)} />}
        </div>
    );
}
