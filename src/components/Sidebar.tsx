"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser, useClerk, SignInButton } from "@clerk/nextjs";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { SignOutButton } from "@clerk/nextjs";
import { 
    LayoutDashboard, 
    Users, 
    TriangleAlert, 
    MessageCircle as Message, 
    BarChart2 as Chart, 
    Settings, 
    HelpCircle as MessageQuestion, 
    Search, 
    Zap as Flash, 
    ChevronLeft, 
    ChevronRight, 
    MoreHorizontal as More, 
    User, 
    LogOut as Logout, 
    ShieldCheck, 
    CreditCard, 
    Bell, 
    Sun, 
    Moon, 
    UserPlus,
    Award,
    LayoutGrid,
    CheckCircle2 as CheckCircle,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_MAIN = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/clients", icon: Users, label: "Clients", badge: 24 },
    { href: "/dashboard/alerts", icon: TriangleAlert, label: "Alerts", badge: 3, badgeRed: true },
    { href: "/dashboard/messages", icon: Message, label: "Messages", badgeText: "Soon", disabled: true },
    { href: "/dashboard/analytics", icon: Chart, label: "Analytics" },
];

const NAV_SETTINGS = [
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
    { href: "/dashboard/help", icon: MessageQuestion, label: "Help" },
];

import { useTheme } from "@/components/ThemeProvider";

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useUser();
    const { openSignIn } = useClerk();
    const [collapsed, setCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { theme, toggle } = useTheme();
    const onInviteClick = () => console.log("Invite Client clicked"); // Placeholder for invite action

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
                className="flex items-center border-b overflow-hidden"
                style={{ borderColor: "var(--border)", padding: collapsed ? "20px 20px" : "16px 20px", gap: "6px" }}
            >
                <div className="w-10 h-10 flex items-center justify-center shrink-0 border border-white/5 rounded-xl bg-white/5 group-hover:scale-110 transition-transform duration-300">
                    <img 
                        src={theme === "dark" ? "/Icon-logo-light.svg" : "/Icon-logo-dark.svg"} 
                        alt="Kinetiq Logo" 
                        style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                    />
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <p className="font-medium text-[13px] tracking-tight text-foreground uppercase">Kinetiq</p>
                        <p className="text-[12px] font-medium text-muted-foreground opacity-60 uppercase tracking-widest">Coach Dashboard</p>
                    </div>
                )}
            </div>

            {/* Search */}
            {!collapsed && (
                <div className="px-3 py-3">
                    <div
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm group focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all shadow-sm"
                        style={{ background: "var(--muted)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
                    >
                        <Search size={14} className="opacity-40 group-focus-within:opacity-100 transition-opacity" />
                        <input 
                            type="text"
                            placeholder="Search clients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-xs font-medium placeholder:opacity-30"
                        />
                        <kbd className="text-[12px] opacity-20 font-medium border px-1 rounded border-current lowercase">⌘K</kbd>
                    </div>
                </div>
            )}

            {/* Main nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-1">
                {!collapsed && (
                    <p className="text-[12px] font-bold uppercase tracking-widest px-2 py-2" style={{ color: "var(--muted-foreground)" }}>
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
                                    className={`flex items-center rounded-full text-sm font-semibold transition-all duration-150 group ${collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2"} ${(NAV_MAIN.find(item => item.href === href) as any)?.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
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
                                    <Icon size={16}  className="shrink-0" />
                                    {!collapsed && <span className="flex-1">{label}</span>}
                                    {!collapsed && ((NAV_MAIN.find(item => item.href === href) as any)?.badge || (NAV_MAIN.find(item => item.href === href) as any)?.badgeText) && (
                                        <span
                                            className="text-[9px] font-medium px-1.5 py-0.5 rounded-full uppercase tracking-tighter"
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
                    <p className="text-[12px] font-bold uppercase tracking-widest px-2 py-2 mt-4" style={{ color: "var(--muted-foreground)" }}>
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
                                    className={`flex items-center rounded-full text-sm font-semibold transition-all ${collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2"}`}
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
                                    <Icon size={16}  />
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
                    <div className="rounded-2xl p-4 mb-3" style={{ background: "var(--muted)" }}>
                        <div className="flex items-center gap-1.5 mb-2.5">
                            <Award size={16} className="text-blue-500" />
                            <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                                Upgrade to <span className="inline-block bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold ml-0.5 leading-tight">Premium</span>
                            </p>
                        </div>
                        <p className="text-[13px] font-medium leading-relaxed mb-4 text-muted-foreground">
                            Unlock advanced AI insights and unlimited clients.
                        </p>
                        <button onClick={onInviteClick}
                            className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all cursor-pointer active:scale-95"
                            style={{ background: "var(--foreground)", color: "var(--card)" }}>
                            Upgrade Now
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
                                        className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-medium text-white shrink-0 shadow-xl shadow-indigo-500/20 group-hover:scale-105 transition-transform"
                                        style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)" }}
                                    >
                                        {userInitial}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>{userName}</p>
                                    <p className="text-[12px] font-medium truncate opacity-50" style={{ color: "var(--muted-foreground)" }}>{userEmail}</p>
                                </div>
                                <More size={14} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content 
                                sideOffset={8}
                                align="center"
                                className="z-[200] min-w-[200px] bg-[#1c1c24] border border-white/5 rounded-2xl p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                            >
                                <div className="px-3 py-2 border-b border-white/5 mb-1">
                                    <p className="text-[12px] font-bold uppercase tracking-widest text-white/40 mb-1">Coach Account</p>
                                    <p className="text-xs font-medium text-white truncate">{userEmail}</p>
                                </div>

                                <DropdownMenu.Item 
                                    onClick={() => router.push("/dashboard/settings")}
                                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl outline-none cursor-pointer mb-0.5"
                                >
                                    <User size={14}  />
                                    Profile Settings
                                </DropdownMenu.Item>

                                <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl outline-none cursor-pointer mb-0.5">
                                    <ShieldCheck size={14}  />
                                    Security & Identity
                                </DropdownMenu.Item>

                                <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl outline-none cursor-pointer mb-1">
                                    <CreditCard size={14}  />
                                    Billing & Subscription
                                </DropdownMenu.Item>

                                <DropdownMenu.Sub>
                                    <DropdownMenu.SubTrigger className="flex items-center justify-between w-full px-3 py-2.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-xl outline-none cursor-pointer group transition-all">
                                        <div className="flex items-center gap-2">
                                            <LayoutGrid size={14}  />
                                            Switch Account
                                        </div>
                                        <ChevronRight size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                                    </DropdownMenu.SubTrigger>
                                    <DropdownMenu.Portal>
                                        <DropdownMenu.SubContent 
                                            className="z-[210] min-w-[200px] bg-[#1c1c24] border border-white/5 rounded-2xl p-2 shadow-2xl animate-in fade-in slide-in-from-left-2 duration-200"
                                            sideOffset={8}
                                        >
                                            <div className="px-3 py-1.5 mb-1">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Managed Accounts</p>
                                            </div>
                                            <DropdownMenu.Item className="flex items-center justify-between px-3 py-3 text-xs font-medium text-white bg-white/5 rounded-xl outline-none cursor-default mb-1">
                                                <div className="flex items-center gap-3">
                                                    {userImage ? (
                                                        <img src={userImage} alt="" className="w-5 h-5 rounded-full ring-1 ring-white/10" />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                        </div>
                                                    )}
                                                    Kinetiq Admin
                                                </div>
                                                <CheckCircle size={14} className="text-emerald-500" />
                                            </DropdownMenu.Item>
                                        </DropdownMenu.SubContent>
                                    </DropdownMenu.Portal>
                                </DropdownMenu.Sub>

                                <div className="pt-1 border-t border-white/5">
                                    <SignOutButton>
                                        <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl outline-none cursor-pointer">
                                            <Logout size={14}  />
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
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-medium text-white cursor-pointer shadow-lg shadow-indigo-500/20"
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
