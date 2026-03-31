"use client";

import { TrendingUp, Users, DollarSign, Activity, ChevronUp, ChevronDown, Target, Share, Download, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Area, AreaChart
} from "recharts";
import { CreditCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/DashboardHeader";
import ClientHealthChart, { ClientType } from "@/components/ClientHealthChart";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch clients");
        return res.json();
      })
      .then(data => {
        if (data && Array.isArray(data.clients)) {
          setClients(data.clients);
        }
      })
      .catch(console.error);
  }, []);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,Month,Revenue\n"
      + REVENUE_DATA.map(d => `${d.name},${d.value}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "kinetiq_revenue_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              <span className="text-[12px] font-medium uppercase tracking-[0.2em] text-emerald-500 opacity-80">Performance Metrics</span>
            </div>
            <h1 className="text-4xl font-medium tracking-tight leading-none" style={{ color: "var(--foreground)" }}>
              Coach Insights
            </h1>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExport} className="font-medium h-11 px-6 rounded-full transition-all">
              <Download size={16} className="mr-2" />
              Export Report
            </Button>
            <Button className="font-medium h-11 px-6 shadow-lg shadow-indigo-500/10 rounded-full active:scale-95 transition-all" style={{ background: "var(--foreground)", color: "var(--card)" }}>
              <Icon icon="iconly:light/refresh" width={16} className="mr-2" />
              Refresh Insights
            </Button>
          </div>
        </div>

        {/* Stat CreditCards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat, i) => (
            <CreditCard key={i} className="p-6 border relative overflow-hidden group" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-widest mb-1" style={{ color: "var(--muted-foreground)" }}>{stat.label}</p>
                  <p className="text-3xl font-medium" style={{ color: "var(--foreground)" }}>{stat.value}</p>
                </div>
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ background: `${stat.color}15`, color: stat.color }}
                >
                  <stat.icon size={20} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 relative z-10">
                <div className={`flex items-center gap-0.5 text-xs font-medium ${stat.trend === "up" ? "text-emerald-500" : "text-orange-500"}`}>
                  {stat.trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
                </div>
                <span className="text-[12px] font-medium uppercase tracking-tighter" style={{ color: "var(--muted-foreground)" }}>vs last month</span>
              </div>
            </CreditCard>
          ))}
        </div>

        {/* Charts — Stacked Full Width */}
        <div className="flex flex-col gap-6">
          {/* Client Health */}
          <div className="w-full">
            <ClientHealthChart 
              selectedClient={selectedClient} 
              onSelect={setSelectedClient} 
              clients={clients} 
              mode="analytics" 
            />
          </div>

          {/* Revenue Trend */}
          <CreditCard className="p-8 border shadow-sm" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-medium" style={{ color: "var(--foreground)" }}>Revenue Momentum</h3>
                <p className="text-sm font-medium mt-1" style={{ color: "var(--muted-foreground)" }}>6-month performance trend</p>
              </div>
              <div className="flex gap-1">
                <Tabs defaultValue="6M" className="w-[180px]">
                  <TabsList className="grid w-full grid-cols-4 rounded-full p-1 h-[34px]" style={{ background: "var(--muted)" }}>
                    {["1M", "3M", "6M", "1Y"].map(t => (
                      <TabsTrigger key={t} value={t} className="rounded-full text-[11px] font-medium data-[state=active]:bg-[var(--foreground)] data-[state=active]:text-[var(--card)] data-[state=active]:shadow-md hover:text-[var(--foreground)] transition-all">
                        {t}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fontWeight: 700, fill: "var(--muted-foreground)" }} 
                    dy={12}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fontWeight: 700, fill: "var(--muted-foreground)" }} 
                    width={50}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip 
                    cursor={{ stroke: "var(--border)", strokeWidth: 2, strokeDasharray: "4 4" }}
                    contentStyle={{ background: "var(--card)", borderRadius: "14px", border: "1px solid var(--border)", fontSize: "13px", fontWeight: "900", color: "var(--foreground)", padding: "10px 14px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                    itemStyle={{ color: "#6366f1", fontWeight: "900" }}
                    formatter={(val: any) => [`$${Number(val || 0).toLocaleString()}`, "Revenue"]}
                    labelStyle={{ color: "var(--muted-foreground)", marginBottom: "4px", fontWeight: "700" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#6366f1" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                    activeDot={{ r: 7, strokeWidth: 3, stroke: "var(--card)", fill: "#6366f1" }} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CreditCard>
        </div>
      </main>
    </div>
  );
}
