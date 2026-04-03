"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { 
  Users, 
  Search, 
  Filter, 
  ChevronDown, 
  LayoutGrid as Grid,
  LayoutGrid, 
  List, 
  UserPlus as UserAdd, 
  MessageCircle, 
  TriangleAlert, 
  Phone as Call, 
  Plus as Add, 
  Sparkles, 
  TrendingUp as TrendUp, 
  TrendingDown as TrendDown, 
  MoreHorizontal, 
  Activity, 
  ChevronUp as ArrowUp2, 
  Eye, 
  Trash2 as Trash, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle as Danger,
  Instagram,
  Twitter,
  Phone,
  MessageCircle as Message,
  Zap,
  X
} from "lucide-react";
import { InviteClientModal } from "@/components/InviteClientModal";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FitnessFigure } from "@/components/FitnessFigure";
import { getActivityType } from "@/lib/fitnessUtils";


// ─── Types & Constants ────────────────────────────────────────────────────────
interface ActivityItem { name: string; icon: string; pct: number; color: string; }
interface ClientType {
    id: string; name: string; initials: string; score: number; status: string;
    lastActive: string; workouts: string; color: string; photo: string;
    origin: string; week: number[]; topActivities: ActivityItem[];
    calories: number; weightChange: number; aiMsg: string; tip: string; actionLabel: string;
    connectedChannels: string[];
    igHandle?: string;
    xHandle?: string;
    whatsapp?: string;
}
type SortMode = "name" | "score" | "active";
type RiskFilter = "all" | "Healthy" | "Warning" | "At Risk";

const STATUS_CFG: Record<string, { color: string; bg: string; label: string; icon: React.ReactNode }> = {
    "Healthy": { color: "#10b981", bg: "rgba(16,185,129,0.12)", label: "Healthy", icon: <FitnessFigure type="healthy" size={14}  /> },
    "Warning": { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "Warning", icon: <FitnessFigure type="warning" size={14}  /> },
    "At Risk": { color: "#ef4444", bg: "rgba(239,68,68,0.12)", label: "At Risk", icon: <FitnessFigure type="at-risk" size={14}  /> },
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

function CreditCardPattern({ id }: { id: string }) {
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
                <div className="p-6 flex items-center justify-between" style={{ borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "var(--border)" }}>
                    <h3 className="font-medium text-lg" style={{ color: "var(--foreground)" }}>Client Profile</h3>
 <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-all" style={{ color: "var(--muted-foreground)" }}>
                        <Add style={{transform: "rotate(45deg)"}} size={16} />
                    </button>
                </div>

                <div className="p-6 flex flex-col items-center text-center" style={{ borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "var(--border)" }}>
                    <div className="relative mb-4">
                        <img src={client.photo} alt={client.name} className="w-24 h-24 rounded-3xl object-cover shadow-md" style={{ border: `3px solid ${cfg.color}` }} />
                    </div>
                    <h2 className="text-xl font-medium" style={{ color: "var(--foreground)" }}>{client.name}</h2>
                    <p className="text-sm font-medium mb-3" style={{ color: "var(--muted-foreground)" }}>{client.origin}</p>
                    <Badge variant={client.status === "Healthy" ? "success" : client.status === "Warning" ? "warning" : "destructive"}>
                        {cfg.label}
                    </Badge>
                </div>

                <div className="p-6 flex-1 overflow-y-auto space-y-3">
                    <p className="text-[12px] font-medium uppercase tracking-widest mb-4" style={{ color: "var(--muted-foreground)" }}>Quick Stats</p>
                    {[
                        { label: "Health Score", value: `${client.score}%` },
                        { label: "Sessions", value: client.workouts },
                        { label: "Last Active", value: client.lastActive },
                        { label: "Calories", value: `${client.calories} kcal` },
                    ].map(stat => (
                        <div key={stat.label} className="flex items-center justify-between py-3 px-4 rounded-xl" style={{ background: "var(--muted)" }}>
                            <span className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>{stat.label}</span>
                            <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{stat.value}</span>
                        </div>
                    ))}

                    <div className="mt-4">
                        <p className="text-[12px] font-medium uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>Top Activities</p>
                        {client.topActivities.slice(0, 3).map((a, i) => (
                            <div key={i} className="mb-3">
                                <div className="flex justify-between text-[13px] font-bold uppercase tracking-wider mb-2">
                          <span className="flex items-center gap-2.5">
                            <FitnessFigure type={getActivityType(a.icon)} size={18} /> 
                            <span>{a.name}</span>
                          </span>
                                    <span className="font-black">{a.pct}%</span>
                                </div>
                                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                                    <div className="h-full rounded-full" style={{ width: `${a.pct}%`, background: a.color }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {client.aiMsg && (
                        <div className="p-4 rounded-xl mt-2" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                            <p className="text-xs font-medium mb-1 text-indigo-500">✨ AI Insight</p>
                            <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>{client.aiMsg}</p>
                        </div>
                    )}
                </div>

                <div className="p-6" style={{ borderTop: "1px solid var(--border)" }}>
                <button onClick={() => { alert(`Full profile for ${client.name} — extended profile page coming soon!`); }}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full font-medium text-sm transition-all hover:opacity-80"
                        style={{ background: "var(--foreground)", color: "var(--card)" }}>
                        View Full Profile <ChevronRight size={14} />
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
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-500 opacity-60">Initializing Roster...</p>
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
            <div className="px-8 py-4 sticky top-[69px] z-20 flex items-center gap-4" style={{ background: "var(--background)", borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "var(--border)" }}>
                <div className="flex items-center gap-2.5 flex-1 max-w-xl group">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full flex-1 transition-all border border-border bg-card focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/40">
                        <Search size={16} className="text-muted-foreground opacity-50" />
                        <div className="flex-1 py-1.5 px-0.5">
                            <input 
                                type="text" 
                                value={search} 
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, origin..."
                                className="bg-transparent outline-none text-[14px] w-full font-medium text-foreground placeholder:text-muted-foreground/50" 
                            />
                        </div>
                    </div>
                    <div className="relative">
                        <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value as RiskFilter)}
                            className="appearance-none bg-transparent pl-4 pr-10 py-2.5 rounded-full text-sm font-medium border cursor-pointer outline-none transition-all hover:border-indigo-500/50"
                            style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                            <option value="all">Every Status</option>
                            <option value="Healthy">💚 Healthy</option>
                            <option value="Warning">⚠️ Warning</option>
                            <option value="At Risk">🚨 At Risk</option>
                        </select>
                        <ChevronDown size={14}  className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                    </div>
                </div>

                <p className="text-xs font-medium ml-auto" style={{ color: "var(--muted-foreground)" }}>
                    {filteredAndSortedClients.length} of {clients.length} clients
                </p>

                <div className="flex items-center gap-2 p-1 rounded-full" style={{ background: "var(--muted)" }}>
 <button onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-full transition-all ${viewMode === "grid" ? "bg-foreground text-card shadow-lg" : "text-muted-foreground hover:text-foreground"}`}>
                        <Grid size={18}  />
                    </button>
 <button onClick={() => setViewMode("list")}
                        className={`p-2 rounded-full transition-all ${viewMode === "list" ? "bg-foreground text-card shadow-lg" : "text-muted-foreground hover:text-foreground"}`}>
                        <List size={18}  />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {/* Page Headings */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                <Users size={16} className="text-indigo-500" />
                            </div>
                            <span className="text-[12px] font-medium uppercase tracking-[0.2em] text-indigo-500 opacity-80">Your Client List</span>
                        </div>
                        <h1 className="text-4xl font-medium tracking-tight leading-none" style={{ color: "var(--foreground)" }}>
                            Active Clients
                        </h1>
                    </div>
                </div>
                {filteredAndSortedClients.length === 0 ? (
                    <div className="text-center py-20 rounded-[40px]" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                        <div className="w-20 h-20 rounded-[30px] bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
                            <Users size={40}  className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-2xl font-medium text-foreground mb-2">No matching clients</h2>
                        <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                            Try adjusting your search filters or invite a new client to your roster.
                        </p>
 <Button onClick={() => {setSearch(""); setRiskFilter("all");}}
                            className="gap-2 px-8 py-4 font-medium">
                            Clear Filters
                        </Button>
                    </div>
                ) : viewMode === "grid" ? (
                    // Grid view — coming soon, list view is preferred
                    <div className="text-center py-20 rounded-[40px]" style={{ background: "var(--card)", borderWidth: "1px", borderStyle: "solid", borderColor: "var(--border)" }}>
                        <div className="w-16 h-16 rounded-[20px] bg-muted flex items-center justify-center mx-auto mb-4">
                            <LayoutGrid size={28} className="text-muted-foreground" />
                        </div>
                        <h2 className="text-lg font-medium text-foreground mb-2">Grid View Coming Soon</h2>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">Switch to List view for the full client experience.</p>
                        <button onClick={() => setViewMode("list")} className="px-6 py-2 rounded-full text-sm font-medium transition-all hover:opacity-80" style={{ background: "var(--foreground)", color: "var(--card)" }}>Switch to List</button>
                    </div>
                ) : (
                    <div className="rounded-[24px] overflow-hidden border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b" style={{ borderColor: "var(--border)", background: "var(--muted)" }}>
                                    <th className="px-6 py-4">
                                        <input type="checkbox" checked={selectedClients.length === filteredAndSortedClients.length} onChange={toggleSelectAll}
                                            className="w-4 h-4 rounded accent-foreground" />
                                    </th>
                                    <th className="px-6 py-4 text-[12px] font-medium uppercase tracking-widest text-muted-foreground">Client</th>
                                    <th className="px-6 py-4 text-[12px] font-medium uppercase tracking-widest text-muted-foreground">Status</th>
                                    <th className="px-6 py-4 text-[12px] font-medium uppercase tracking-widest text-muted-foreground">Score</th>
                                    <th className="px-6 py-4 text-[12px] font-medium uppercase tracking-widest text-muted-foreground">Activity</th>
                                    <th className="px-6 py-4 text-[12px] font-medium uppercase tracking-widest text-muted-foreground">Sessions</th>
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
                                                    className="w-4 h-4 rounded accent-foreground" />
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <img src={client.photo} alt={client.name} className="w-10 h-10 rounded-xl" />
                                                    <div>
                                                        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{client.name}</p>
                                                        <p className="text-xs text-muted-foreground">{client.origin} · {client.lastActive}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <Badge variant={client.status === "Healthy" ? "success" : client.status === "Warning" ? "warning" : "destructive"}>
                                                    {cfg.label}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-10 h-1 rounded-full bg-muted overflow-hidden">
                                                        <div className="h-full rounded-full" style={{ width: `${client.score}%`, background: client.color }} />
                                                    </div>
                                                    <span className="text-xs font-medium">{client.score}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {client.topActivities.slice(0, 2).map((a, i) => (
                                                        <Badge key={i} variant="outline">
                                                            {a.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-sm font-medium">{client.workouts}</p>
                                            </td>
                                            <td className="px-6 py-5 text-right relative" ref={openMenuId === client.id ? menuRef : null}>
 <button
                                                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === client.id ? null : client.id); }}
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
                                                    <MoreHorizontal size={18}  />
                                                </button>
                                                {openMenuId === client.id && (
                                                    <div className="absolute right-4 top-full mt-1 w-44 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                                                        style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
 <button onClick={() => { setProfileClient(client); setOpenMenuId(null); }}
                                                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors text-left"
                                                            style={{ color: "var(--foreground)" }}>
                                                            <Eye size={15}  /> View Profile
                                                        </button>
  <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#6366f1] opacity-70 bg-indigo-500/5">⚡️ Personalize & Send</div>
                                                        {client.igHandle && (
                                                            <button 
                                                                onClick={() => { window.open(`https://instagram.com/${client.igHandle?.replace('@', '')}`, '_blank'); setOpenMenuId(null); }}
                                                                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors text-left"
                                                                style={{ color: "var(--foreground)" }}
                                                            >
                                                                <Instagram size={15}  /> Instagram
                                                            </button>
                                                        )}
                                                        {client.whatsapp && (
                                                            <button 
                                                                onClick={() => { window.open(`https://wa.me/${client.whatsapp?.replace(/[^0-9]/g, '')}`, '_blank'); setOpenMenuId(null); }}
                                                                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors text-left"
                                                                style={{ color: "var(--foreground)" }}
                                                            >
                                                                <Phone size={15}  /> WhatsApp
                                                            </button>
                                                        )}
                                                        {client.xHandle && (
                                                            <button 
                                                                onClick={() => { window.open(`https://x.com/${client.xHandle?.replace('@', '')}`, '_blank'); setOpenMenuId(null); }}
                                                                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors text-left"
                                                                style={{ color: "var(--foreground)" }}
                                                            >
                                                                <Twitter size={15}  /> X / Twitter
                                                            </button>
                                                        )}
                                                        {!client.igHandle && !client.whatsapp && !client.xHandle && (
                                                             <button onClick={() => { alert(`Message ${client.name} — coming soon!`); setOpenMenuId(null); }}
                                                                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors text-left opacity-50"
                                                                style={{ color: "var(--foreground)" }}>
                                                                <MessageCircle size={15}  /> Message Client
                                                            </button>
                                                        )}
                                                        <div className="my-1 h-px" style={{ background: "var(--border)" }} />
 <button onClick={() => { setClients(prev => prev.filter(c => c.id !== client.id)); setOpenMenuId(null); }}
                                                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium hover:bg-red-500/10 transition-colors text-left text-red-500">
                                                            <Trash size={15}  /> Remove
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

            {/* Bulk Actions Bar */}
            {selectedClients.length > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-8 duration-500 ease-out">
                    <div className="flex items-center gap-6 px-6 py-4 rounded-[32px] bg-[#0C0C0C] text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-[12px] font-bold text-white shadow-lg shadow-indigo-500/40">
                                {selectedClients.length}
                            </div>
                            <span className="text-sm font-semibold tracking-tight">Selected</span>
                        </div>
                        
                        <div className="w-px h-6 bg-white/10" />
                        
                        <div className="flex items-center gap-2">
           <button onClick={() => alert("Bulk messaging coming soon!")} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-white/5 hover:bg-white/10 transition-all border border-white/5">
                                <Message size={14} className="text-indigo-400" /> Message
                            </button>
           <button onClick={() => alert("Bulk status update coming soon!")} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-white/5 hover:bg-white/10 transition-all border border-white/5">
                                <Zap size={14} className="text-amber-400" /> Update Status
                            </button>
           <button onClick={() => {
                if(confirm(`Are you sure you want to remove ${selectedClients.length} clients?`)) {
                    setClients(prev => prev.filter(c => !selectedClients.includes(c.id)));
                    setSelectedClients([]);
                }
           }} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all border border-rose-500/20">
                                <Trash size={14} /> Remove
                            </button>
                        </div>
                        
                        <div className="w-px h-6 bg-white/10" />
                        
       <button onClick={() => setSelectedClients([])} className="p-2 rounded-full hover:bg-white/10 transition-all text-white/40 hover:text-white">
                            <X size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
