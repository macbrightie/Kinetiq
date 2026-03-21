"use client";

import React from "react";
import { Bell, Sun, Moon, UserPlus } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface DashboardHeaderProps {
    title: string;
    showInvite?: boolean;
    onInviteClick?: () => void;
}

export function DashboardHeader({ title, showInvite = true, onInviteClick }: DashboardHeaderProps) {
    const { theme, toggle } = useTheme();
    const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

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
                <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>{title}</h1>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: "var(--muted-foreground)", opacity: 0.6 }}>{today}</p>
            </div>
            <div className="flex items-center gap-3">
                <button className="relative w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:bg-muted active:scale-95" 
                    style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                    <Bell size={16} />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-[var(--card)]" style={{ background: "#ef4444" }} />
                </button>
                <button onClick={toggle} className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:bg-muted active:scale-95" 
                    style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                    {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                {showInvite && (
                    <button onClick={onInviteClick}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-indigo-500/10 active:scale-95"
                        style={{ background: "var(--foreground)", color: "var(--card)" }}>
                        <UserPlus size={16} />
                        Invite Client
                    </button>
                )}
            </div>
        </header>
    );
}
