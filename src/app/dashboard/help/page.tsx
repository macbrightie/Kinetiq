"use client";

import React from "react";
import { Search, MessageSquare, Book, MessageCircle as Message, LifeBuoy, ChevronRight, Zap, ExternalLink, HelpCircle } from "lucide-react";
import { CreditCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardHeader } from "@/components/DashboardHeader";

const CATEGORIES = [
  { title: "Getting Started", icon: Zap, count: 12, color: "#6366f1" },
  { title: "Client Management", icon: Book, count: 8, color: "#10b981" },
  { title: "Dashboard & Stats", icon: HelpCircle, count: 15, color: "#f59e0b" },
  { title: "Billing & Plans", icon: LifeBuoy, count: 6, color: "#a78bfa" },
];

const FAQS = [
  { q: "How do I connect a client's Strava account?", a: "Go to the Clients page, select the client, and click 'Send Integration Invite' to have them authorize their Strava data." },
  { q: "Can I export my analytics reports?", a: "Yes, head over to the Analytics Hub and click the 'Export Data' button at the top right to download a CSV summary." },
  { q: "What does the 'At Risk' status mean?", a: "Our AI flags clients as 'At Risk' if their activity levels drop significantly or if they haven't logged a workout in over 4 days." },
];

export default function HelpPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--background)" }}>
      <DashboardHeader title="Help Center" showInvite={false} />
      <div className="flex-1 p-8 max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <LifeBuoy size={16} className="text-indigo-500" />
          </div>
          <span className="text-[12px] font-medium uppercase tracking-[0.2em] text-indigo-500 opacity-80">Support Center</span>
        </div>
        <h1 className="text-6xl font-medium tracking-tight font-plus-jakarta leading-none mb-6">
          How can we help?
        </h1>
        <div className="max-w-2xl mx-auto relative mt-10">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground opacity-40" size={20} />
          <Input 
            placeholder="Search for articles, guides, or keywords..." 
            className="h-16 pl-14 pr-6 rounded-2xl bg-card border-none shadow-2xl text-lg font-medium focus-visible:ring-1 ring-indigo-500/30"
          />
        </div>
      </div>

      {/* LayoutDashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {CATEGORIES.map((cat, i) => (
          <CreditCard key={i} className="p-6 border-none shadow-xl hover:shadow-2xl transition-all cursor-pointer group hover:-translate-y-1 duration-300" style={{ background: 'var(--card)' }}>
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
              style={{ background: `${cat.color}15`, color: cat.color }}
            >
              <cat.icon size={24} />
            </div>
            <h3 className="font-medium text-lg mb-1">{cat.title}</h3>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{cat.count} Articles</p>
          </CreditCard>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <h3 className="text-2xl font-medium mb-6">Popular Questions</h3>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <CreditCard key={i} className="p-6 border-none shadow-lg hover:shadow-xl transition-all cursor-pointer group" style={{ background: 'var(--card)' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-[17px] mb-2 group-hover:text-indigo-500 transition-colors">{faq.q}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">{faq.a}</p>
                  </div>
                  <ChevronRight size={20} className="text-muted-foreground/20 group-hover:text-muted-foreground transition-all ml-4 shrink-0" />
                </div>
              </CreditCard>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <CreditCard className="p-8 border-none bg-indigo-600 text-white relative overflow-hidden group">
            <MessageSquare size={80} className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform" />
            <h4 className="text-xl font-medium mb-2">Speak to Us</h4>
            <p className="text-sm text-indigo-100 mb-6 font-medium leading-relaxed">
              Can't find what you need? Our team is available 24/7 for premium support.
            </p>
 <Button className="w-full font-medium bg-white text-indigo-600 hover:bg-slate-100 shadow-xl transition-all">
              Live Chat
            </Button>
          </CreditCard>

          <CreditCard className="p-8 border-none bg-muted/30 border border-border/20">
            <h4 className="font-medium text-lg mb-4">Official Documentation</h4>
            <ul className="space-y-4">
              {['API Reference', 'Developer Guide', 'Brand Assets', 'Privacy Policy'].map((link) => (
                <li key={link}>
                  <a href="#" className="flex items-center justify-between group hover:text-indigo-500 transition-colors">
                    <span className="text-sm font-medium">{link}</span>
                    <ExternalLink size={14} className="opacity-20 group-hover:opacity-100 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </CreditCard>
        </div>
      </div>

      <style jsx>{`
        .font-plus-jakarta {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
      `}</style>
      </div>
    </div>
  );
}
