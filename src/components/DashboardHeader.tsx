"use client";

import React, { useState } from "react";
import { Bell, Sun, Moon, UserPlus, Check, Settings } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
    title: string;
    showInvite?: boolean;
    onInviteClick?: () => void;
}

export function DashboardHeader({ title, showInvite = true, onInviteClick }: DashboardHeaderProps) {
    const { theme, toggle } = useTheme();
    const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

    // Notifications state
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "Caitlyn",
            action: "commented in",
            badge: "Dashboard 2.0",
            badgeVariant: "info",
            desc: "Could we figure out a way to let people switch between gross and net revenue from this screen?",
            time: "2 hours ago",
            date: "Friday 3:12 PM",
            avatar: "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=150&h=150&fit=crop",
            read: false,
        },
        {
            id: 2,
            title: "Mathilde",
            action: "followed you",
            time: "2 hours ago",
            date: "Friday 3:04 PM",
            avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&h=150&fit=crop",
            read: false,
        },
        {
            id: 3,
            title: "Zaid",
            action: "invited you to",
            badge: "Blog design",
            badgeVariant: "success",
            time: "3 hours ago",
            date: "Friday 2:22 PM",
            avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop",
            read: false,
            actions: true,
        }
    ]);

    const [notifTab, setNotifTab] = useState<"all" | "messages" | "alerts">("all");

    const unreadCount = notifications.filter(n => !n.read).length;
    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    const filteredNotifications = notifications.filter(n => {
        if (notifTab === "messages") return n.action.includes("commented") || n.action.includes("message");
        if (notifTab === "alerts") return n.badgeVariant === "success" || n.badgeVariant === "destructive";
        return true;
    });

    return (
        <header className="flex items-center justify-between px-8 py-4 sticky top-0 z-30"
            style={{ 
                background: "var(--card)", 
                borderBottomWidth: "1px", 
                borderBottomStyle: "solid", 
                borderBottomColor: "var(--border)",
                backdropFilter: "blur(12px)"
            }}>
            <div>
                <h1 className="text-xl font-medium tracking-tight" style={{ color: "var(--foreground)" }}>{title}</h1>
                <p className="text-[12px] font-medium uppercase tracking-[0.2em] mt-1 opacity-80" style={{ color: "var(--muted-foreground)" }}>{today}</p>
            </div>
            <div className="flex items-center gap-3">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button className="relative w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-muted active:scale-95 outline-none border border-border/50 shadow-sm" 
                            style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                            <Bell size={16}  />
                            {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-[var(--card)]" style={{ background: "#ef4444" }} />}
                        </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content 
                            align="end" 
                            sideOffset={12}
                            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                            className="w-[420px] rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 duration-200 z-50 text-sm"
                        >
                            <div className="p-5" style={{ background: "var(--card)" }}>
                                {/* Header */}
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="font-bold text-base tracking-tight" style={{ color: "var(--foreground)" }}>Notifications</h3>
                                    <div className="flex items-center gap-2" style={{ color: "var(--muted-foreground)" }}>
                                        <button onClick={markAllRead} className="w-7 h-7 flex items-center justify-center hover:bg-muted rounded-full transition-colors tooltip" title="Mark all read">
                                            <Check size={16} />
                                        </button>
                                        <button onClick={() => setNotifications([])} className="w-7 h-7 flex items-center justify-center hover:bg-muted rounded-full transition-colors" title="Settings / Clear">
                                            <Settings size={15} />
                                        </button>
                                    </div>
                                </div>

                                {/* Tabs */}
                                    <div className="flex items-center p-1 rounded-full mb-5" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
                                        <button onClick={() => setNotifTab("all")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold shadow-sm shrink-0 transition-colors ${notifTab === "all" ? "bg-[var(--card)] text-[var(--foreground)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}>
                                            View all <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{notifications.length}</span>
                                        </button>
                                        <button onClick={() => setNotifTab("messages")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors shrink-0 ${notifTab === "messages" ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}>
                                            Messages
                                        </button>
                                        <button onClick={() => setNotifTab("alerts")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors shrink-0 ${notifTab === "alerts" ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}>
                                            Alerts <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{notifications.filter(n => n.badgeVariant === "success" || n.badgeVariant === "destructive").length}</span>
                                        </button>
                                    </div>

                                {/* List Container */}
                                <div className="max-h-[400px] overflow-y-auto pr-1">
                                    {filteredNotifications.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <div className="w-16 h-16 rounded-[24px] bg-muted flex items-center justify-center mb-4">
                                                <Bell size={24} className="text-muted-foreground opacity-30" />
                                            </div>
                                            <p className="font-semibold text-base" style={{ color: "var(--foreground)" }}>All caught up</p>
                                            <p className="text-[13px] mt-1.5" style={{ color: "var(--muted-foreground)" }}>No notifications here.</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col">
                                            {filteredNotifications.map((n, i) => (
                                                <div key={n.id} className="relative group py-4 transition-colors hover:bg-muted/30 px-2 -mx-2 rounded-2xl" 
                                                     style={{ borderBottom: i < filteredNotifications.length - 1 ? "1px dashed var(--border)" : "none" }}>
                                                    <div className="flex gap-4">
                                                        <div className="relative shrink-0">
                                                            <img src={n.avatar} className="w-9 h-9 rounded-full object-cover shadow-sm bg-muted" alt="Author" />
                                                            {!n.read && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[2.5px] border-[var(--card)]" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start gap-2 mb-0.5">
                                                                <p className="text-[13px] leading-snug" style={{ color: "var(--muted-foreground)" }}>
                                                                    <strong className="font-bold" style={{ color: "var(--foreground)" }}>{n.title}</strong> {n.action}{" "}
                                                                    {n.badge && <Badge variant={n.badgeVariant as any} showClose={false} className="ml-1 leading-none py-0.5 px-2 text-[10px] shadow-sm">{n.badge}</Badge>}
                                                                </p>
                                                                <span className="shrink-0 text-[11px] font-medium mt-0.5" style={{ color: "var(--muted-foreground)" }}>{n.time}</span>
                                                            </div>
                                                            <p className="text-[11px] font-medium opacity-70 mb-2" style={{ color: "var(--muted-foreground)" }}>{n.date}</p>
                                                            
                                                            {n.desc && (
                                                                <div className="p-3.5 rounded-[14px] mt-1 mb-2 text-[13px] font-medium leading-relaxed border shadow-sm" style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}>
                                                                    {n.desc}
                                                                </div>
                                                            )}

                                                            {n.actions && (
                                                                <div className="flex items-center gap-2 mt-2.5">
                                                                    <button className="px-5 py-[7px] text-[12px] font-bold rounded-full border hover:bg-muted transition-colors active:scale-95" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
                                                                        Decline
                                                                    </button>
                                                                    <button className="px-5 py-[7px] text-[12px] font-bold rounded-full shadow-md shadow-indigo-500/10 active:scale-95 transition-all" style={{ background: "var(--foreground)", color: "var(--card)" }}>
                                                                        Accept
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
                <button onClick={toggle} className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:bg-muted active:scale-95" 
                    style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                    {theme === "dark" ? <Sun size={16}  /> : <Moon size={16}  />}
                </button>
                {showInvite && (
                    <Button 
                        onClick={onInviteClick}
                        size="default"
                        className="shadow-lg shadow-indigo-500/10"
                    >
                        <UserPlus size={16}  />
                        Invite Client
                    </Button>
                )}
            </div>
        </header>
    );
}
