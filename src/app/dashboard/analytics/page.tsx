"use client";

import { 
  TrendingUp, Users, DollarSign, Activity, ArrowUpRight, 
  ArrowDownRight, Target, Share2, Download 
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Area, Line, ComposedChart as ReComposedChart
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/DashboardHeader";
import ClientHealthChart, { ClientType } from "@/components/ClientHealthChart";
import React, { useState, useEffect } from "react";

const REVENUE_DATA = [
  { name: "Jan", value: 4200 },
  { name: "Feb", value: 3800 },
  { name: "Mar", value: 5100 },
  { name: "Apr", value: 4900 },
  { name: "May", value: 6200 },
  { name: "Jun", value: 7500 },
];

const RETENTION_DATA = [
  { name: "Week 1", value: 98 },
  { name: "Week 2", value: 96 },
  { name: "Week 3", value: 97 },
  { name: "Week 4", value: 94 },
  { name: "Week 5", value: 95 },
  { name: "Week 6", value: 96 },
];

const STATS = [
  { label: "Total Revenue", value: "$12,450", change: "+12.5%", trend: "up", icon: DollarSign, color: "#10b981" },
  { label: "Active Clients", value: "42", change: "+4", trend: "up", icon: Users, color: "#6366f1" },
  { label: "Completion Rate", value: "94%", change: "-2.1%", trend: "down", icon: Target, color: "#f59e0b" },
  { label: "Avg. Session", value: "54m", change: "+8m", trend: "up", icon: Activity, color: "#a78bfa" },
];

export default function AnalyticsPage() {
  const [clients, setClients] = useState<ClientType[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);

  useEffect(() => {
    fetch("/api/coach/clients")
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--background)" }}>
      <DashboardHeader title="Analytics Hub" showInvite={false} />

      <main className="flex-1 p-8 max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp size={16} className="text-emerald-500" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500 opacity-80">Performance Metrics</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight leading-none" style={{ color: "var(--foreground)" }}>
              Coach Insights
            </h1>
          </div>

          <div className="flex gap-3">
 <Button variant="outline" className=" font-bold h-11 px-6 transition-all">
              <Download size={16} className="mr-2" />
              Export Data
            </Button>
 <Button className=" font-black h-11 px-6 active:scale-95 transition-all" style={{ background: "var(--foreground)", color: "var(--card)" }}>
              Refresh Insights
            </Button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat, i) => (
            <Card key={i} className="p-6 border relative overflow-hidden group" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: "var(--muted-foreground)" }}>{stat.label}</p>
                  <p className="text-3xl font-black" style={{ color: "var(--foreground)" }}>{stat.value}</p>
                </div>
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ background: `${stat.color}15`, color: stat.color }}
                >
                  <stat.icon size={20} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 relative z-10">
                <div className={`flex items-center gap-0.5 text-xs font-black ${stat.trend === "up" ? "text-emerald-500" : "text-orange-500"}`}>
                  {stat.trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: "var(--muted-foreground)" }}>vs last month</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts — Client Health is the hero (wider), Revenue is the sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Client Health — main/hero */}
          <div className="lg:col-span-8">
            <ClientHealthChart 
              selectedClient={selectedClient} 
              onSelect={setSelectedClient} 
              clients={clients} 
              mode="analytics" 
            />
          </div>

          {/* Revenue Momentum — compact sidebar */}
          <Card className="lg:col-span-4 p-6 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black" style={{ color: "var(--foreground)" }}>Revenue</h3>
                <p className="text-sm font-medium mt-0.5" style={{ color: "var(--muted-foreground)" }}>6-month trend</p>
              </div>
              <div className="flex gap-1 p-1 rounded-lg" style={{ background: "var(--muted)" }}>
                {["6M", "1Y"].map((t) => (
 <button key={t} 
                    className={`px-2.5 py-1 text-[10px] font-black rounded-md transition-all ${t === "6M" ? "shadow-sm" : ""}`}
                    style={{ 
                      background: t === "6M" ? "var(--foreground)" : "transparent",
                      color: t === "6M" ? "var(--card)" : "var(--muted-foreground)"
                    }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ReComposedChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: "var(--muted-foreground)" }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: "var(--muted-foreground)" }} 
                    width={45}
                  />
                  <Tooltip 
                    contentStyle={{ background: "var(--card)", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "12px", fontWeight: "bold", color: "var(--foreground)" }}
                    itemStyle={{ color: "var(--foreground)" }}
                  />
                  <Area type="monotone" dataKey="value" stroke="none" fillOpacity={1} fill="url(#colorRev)" />
                  <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{ r: 3, fill: "#6366f1", strokeWidth: 2, stroke: "var(--card)" }} activeDot={{ r: 6 }} />
                </ReComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
