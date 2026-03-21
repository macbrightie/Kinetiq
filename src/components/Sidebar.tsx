"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
    LayoutDashboard, Users, AlertTriangle, MessageSquare,
    BarChart2, Settings, HelpCircle, Activity, Search, Zap,
    ChevronLeft, ChevronRight, MoreHorizontal,
    User, LogOut, Shield, CreditCard
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { SignOutButton } from "@clerk/nextjs";

const NAV_MAIN = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/clients", icon: Users, label: "Clients", badge: 24 },
    { href: "/dashboard/alerts", icon: AlertTriangle, label: "Alerts", badge: 3, badgeRed: true },
    { href: "/dashboard/messages", icon: MessageSquare, label: "Messages", badgeText: "Soon", disabled: true },
    { href: "/dashboard/analytics", icon: BarChart2, label: "Analytics" },
];

const NAV_SETTINGS = [
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
    { href: "/dashboard/help", icon: HelpCircle, label: "Help" },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user } = useUser();
    const [collapsed, setCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const isActive = (href: string) =>
        href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

    const filteredNav = NAV_MAIN.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredSettings = NAV_SETTINGS.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const w = collapsed ? "w-[68px]" : "w-60";

    const userName = user?.fullName || user?.firstName || "Coach";
    const userEmail = user?.primaryEmailAddress?.emailAddress || "coach@kinetiq.app";
    const userImage = user?.imageUrl;
    const userInitial = userName[0].toUpperCase();

    return (
        <aside
            className={`relative flex flex-col h-screen shrink-0 border-r transition-all duration-300 select-none ${w}`}
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
            {/* Collapse toggle */}
            <button
                onClick={() => setCollapsed((c) => !c)}
                className="absolute -right-4 top-[72px] z-50 w-8 h-8 rounded-full border-2 shadow-md flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
                style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--muted-foreground)",
                }}
            >
                {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
            </button>

            <div
                className="flex items-center gap-2.5 border-b overflow-hidden"
                style={{ borderColor: "var(--border)", padding: collapsed ? "20px 20px" : "16px 20px" }}
            >
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20"
                    style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)" }}
                >
                    <Activity size={20} className="text-white" />
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <p className="font-black text-[13px] tracking-tight text-foreground uppercase">Kinetiq</p>
                        <p className="text-[10px] font-bold text-muted-foreground opacity-60">Coach Dashboard</p>
                    </div>
                )}
            </div>

            {/* Search */}
            {!collapsed && (
                <div className="px-3 py-3">
                    <div
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm group focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all"
                        style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                    >
                        <Search size={14} className="opacity-40 group-focus-within:opacity-100 transition-opacity" />
                        <input 
                            type="text"
                            placeholder="Search clients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-xs font-semibold placeholder:opacity-30"
                        />
                        <kbd className="text-[9px] opacity-20 font-black border px-1 rounded border-current lowercase">⌘K</kbd>
                    </div>
                </div>
            )}
            {collapsed && (
                <div className="px-3 py-3 flex justify-center">
                    <button
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                    >
                        <Search size={15} />
                    </button>
                </div>
            )}

            {/* Main nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-1">
                {!collapsed && (
                    <p className="text-xs font-semibold uppercase tracking-wider px-2 py-2" style={{ color: "var(--muted-foreground)" }}>
                        Main Menu
                    </p>
                )}
                <ul className="space-y-0.5">
                    {filteredNav.map(({ href, icon: Icon, label, badge, badgeRed }) => {
                        const active = isActive(href);
                        return (
                            <li key={href}>
                                <Link
                                    href={href}
                                    onClick={(e) => {
                                        if ((NAV_MAIN.find(item => item.href === href) as any)?.disabled) {
                                            e.preventDefault();
                                        }
                                    }}
                                    title={collapsed ? label : undefined}
                                    className={`flex items-center rounded-lg text-sm font-medium transition-all duration-150 group ${collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2"} ${(NAV_MAIN.find(item => item.href === href) as any)?.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                    style={{
                                        background: active ? "var(--foreground)" : "transparent",
                                        color: active ? "var(--card)" : "var(--muted-foreground)",
                                    }}
                                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                        const item = NAV_MAIN.find(i => i.href === href) as any;
                                        if (!active && !item?.disabled) {
                                            (e.currentTarget as HTMLAnchorElement).style.background = "var(--muted)";
                                            (e.currentTarget as HTMLAnchorElement).style.color = "var(--foreground)";
                                        }
                                    }}
                                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                        const item = NAV_MAIN.find(i => i.href === href) as any;
                                        if (!active && !item?.disabled) {
                                            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                                            (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted-foreground)";
                                        }
                                    }}
                                >
                                    <Icon size={16} className="shrink-0" />
                                    {!collapsed && <span className="flex-1">{label}</span>}
                                    {!collapsed && ((NAV_MAIN.find(item => item.href === href) as any)?.badge || (NAV_MAIN.find(item => item.href === href) as any)?.badgeText) && (
                                        <span
                                            className="text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter"
                                            style={{
                                                background: badgeRed
                                                    ? (active ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.1)")
                                                    : (active ? "rgba(255,255,255,0.2)" : "var(--muted)"),
                                                color: badgeRed ? "#ef4444" : (active ? "var(--card)" : "var(--muted-foreground)"),
                                            }}
                                        >
                                            {(NAV_MAIN.find(item => item.href === href) as any)?.badgeText || (NAV_MAIN.find(item => item.href === href) as any)?.badge}
                                        </span>
                                    )}
                                    {collapsed && badge && badgeRed && (
                                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {!collapsed && filteredSettings.length > 0 && (
                    <p className="text-xs font-semibold uppercase tracking-wider px-2 py-2 mt-4" style={{ color: "var(--muted-foreground)" }}>
                        Settings
                    </p>
                )}
                <ul className={`space-y-0.5 ${collapsed ? "mt-2" : ""}`}>
                    {filteredSettings.map(({ href, icon: Icon, label }) => {
                        const active = isActive(href);
                        return (
                            <li key={href}>
                                <Link
                                    href={href}
                                    title={collapsed ? label : undefined}
                                    className={`flex items-center rounded-lg text-sm font-medium transition-all ${collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2"}`}
                                    style={{
                                        background: active ? "var(--foreground)" : "transparent",
                                        color: active ? "var(--card)" : "var(--muted-foreground)",
                                    }}
                                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                        if (!active) {
                                            (e.currentTarget as HTMLAnchorElement).style.background = "var(--muted)";
                                            (e.currentTarget as HTMLAnchorElement).style.color = "var(--foreground)";
                                        }
                                    }}
                                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                        if (!active) {
                                            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                                            (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted-foreground)";
                                        }
                                    }}
                                >
                                    <Icon size={16} />
                                    {!collapsed && label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom section */}
            {!collapsed && (
                <div className="px-3 pb-3">
                    <div className="rounded-xl p-3 mb-3" style={{ background: "var(--muted)" }}>
                        <div className="flex items-center gap-2 mb-1">
                            <Zap size={13} style={{ color: "var(--primary)" }} />
                            <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Get Pro Features</p>
                        </div>
                        <p className="text-xs mb-2.5" style={{ color: "var(--muted-foreground)" }}>
                            Unlock AI insights and unlimited clients.
                        </p>
                        <button
                            className="w-full py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90"
                            style={{ background: "var(--foreground)", color: "var(--card)" }}
                        >
                            Upgrade Plan
                        </button>
                    </div>
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <div
                                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl cursor-pointer transition-all hover:bg-muted/50 border border-transparent hover:border-border/50 group"
                                style={{ color: "var(--foreground)" }}
                            >
                                {userImage ? (
                                    <img src={userImage} className="w-9 h-9 rounded-xl object-cover shrink-0 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform" alt="Profile" />
                                ) : (
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0 shadow-xl shadow-indigo-500/20 group-hover:scale-105 transition-transform"
                                        style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)" }}
                                    >
                                        {userInitial}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-black truncate" style={{ color: "var(--foreground)" }}>{userName}</p>
                                    <p className="text-[10px] font-bold truncate opacity-50" style={{ color: "var(--muted-foreground)" }}>{userEmail}</p>
                                </div>
                                <MoreHorizontal size={14} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content 
                                sideOffset={8}
                                align="center"
                                className="z-[200] min-w-[200px] bg-[#1c1c24] border border-white/5 rounded-2xl p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                            >
                                <div className="px-3 py-2 border-b border-white/5 mb-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Coach Account</p>
                                    <p className="text-xs font-bold text-white truncate">{userEmail}</p>
                                </div>

                                <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl outline-none cursor-pointer mb-0.5">
                                    <User size={14} />
                                    Profile Settings
                                </DropdownMenu.Item>

                                <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl outline-none cursor-pointer mb-0.5">
                                    <Shield size={14} />
                                    Security & Identity
                                </DropdownMenu.Item>

                                <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl outline-none cursor-pointer mb-1">
                                    <CreditCard size={14} />
                                    Billing & Subscription
                                </DropdownMenu.Item>

                                <div className="pt-1 border-t border-white/5">
                                    <SignOutButton>
                                        <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl outline-none cursor-pointer">
                                            <LogOut size={14} />
                                            Log Out
                                        </DropdownMenu.Item>
                                    </SignOutButton>
                                </div>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
            )}
            {collapsed && (
                <div className="flex flex-col items-center gap-2 pb-4 px-3">
                    {userImage ? (
                        <img src={userImage} className="w-9 h-9 rounded-xl object-cover cursor-pointer shadow-lg shadow-indigo-500/20" alt="Profile" title={userName} />
                    ) : (
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white cursor-pointer shadow-lg shadow-indigo-500/20"
                            style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)" }}
                            title={userName}
                        >
                            {userInitial}
                        </div>
                    )}
                </div>
            )}
        </aside>
    );
}
