"use client";

import React, { useState } from "react";
import { Search, Send, MoreVertical, Phone, Video, Image as ImageIcon, Paperclip, Smile, User, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardHeader } from "@/components/DashboardHeader";

const CONVERSATIONS = [
  { id: "mock-1", name: "Amara Okoro", lastMsg: "The 5km run felt incredible today!", time: "12m", active: true, online: true, initials: "AO", color: "#10b981", photo: "https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?w=150&h=150&fit=crop" },
  { id: "mock-3", name: "Zola Abara", lastMsg: "I'm feeling a bit sore in my lower back.", time: "1h", active: false, online: false, initials: "ZA", color: "#ef4444", photo: "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=150&h=150&fit=crop" },
  { id: "mock-2", name: "Kofi Mensah", lastMsg: "Sent you the meal plan photos. Check them out!", time: "3h", active: false, online: true, initials: "KM", color: "#f59e0b", photo: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&h=150&fit=crop" },
  { id: 4, name: "Chidi Eze", lastMsg: "Can we reschedule our check-in to 5 PM?", time: "5h", active: false, online: false, initials: "CE", color: "#a78bfa", photo: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=150&h=150&fit=crop" },
  { id: 5, name: "Tay Abiola", lastMsg: "Thanks for the tips on the bench press!", time: "Yesterday", active: false, online: true, initials: "TA", color: "#fb923c" },
];

const MESSAGES = [
  { id: 1, sender: "Amara Okoro", text: "Hey Coach! The 5km run felt incredible today! I managed to hit the PR we talked about (22:45).", time: "11:42 AM", mine: false },
  { id: 2, sender: "Me", text: "That's incredible news, Amara! 22:45 is a massive milestone. How did the pacing feel in the final 1km?", time: "11:45 AM", mine: true },
  { id: 3, sender: "Amara Okoro", text: "Pacing was solid. I felt strong enough for a sprint finish. No knee pain at all!", time: "11:48 AM", mine: false },
  { id: 4, sender: "Me", text: "Perfect. Recovery is key today. Let's keep the intensity low for tomorrow's active recovery walk.", time: "11:50 AM", mine: true },
];

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<string | number>("mock-1");

  return (
    <div className="flex flex-col h-screen" style={{ background: "var(--background)" }}>
      <DashboardHeader title="Messages" showInvite={false} />
      
      <div className="flex-1 p-4 flex gap-4 overflow-hidden relative">
        {/* Overlay Coming Soon */}
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-[2px] pointer-events-none">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 px-8 py-3 rounded-2xl shadow-2xl shadow-indigo-500/40 border border-white/20 animate-in zoom-in-95 duration-500">
            <p className="text-white font-black tracking-widest uppercase text-sm">Coming Soon</p>
          </div>
        </div>

        {/* Sidebar - Conversations List */}
      <Card className="w-80 flex flex-col border-none shadow-xl overflow-hidden" style={{ background: 'var(--card)' }}>
        <div className="p-6 border-b border-border/50">
          <h2 className="text-2xl font-black mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <Input 
              placeholder="Search conversations..." 
              className="pl-9 rounded-xl bg-muted/50 border-none focus-visible:ring-1 ring-indigo-500/30 h-10 text-xs"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {CONVERSATIONS.map((conv) => (
            <div 
              key={conv.id}
              onClick={() => setActiveTab(conv.id)}
              className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition-all ${activeTab === conv.id ? 'bg-indigo-500/10' : 'hover:bg-muted/50'}`}
            >
              <div className="relative">
                {conv.photo ? (
                  <div className="w-11 h-11 rounded-xl overflow-hidden shadow-md">
                    <img src={conv.photo} alt={conv.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div 
                    className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${conv.color}, ${conv.color}dd)` }}
                  >
                    {conv.initials}
                  </div>
                )}
                {conv.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 bg-emerald-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`font-bold text-sm truncate ${activeTab === conv.id ? 'text-indigo-400' : ''}`}>{conv.name}</span>
                  <span className="text-[10px] opacity-40 font-bold uppercase">{conv.time}</span>
                </div>
                <p className="text-xs opacity-50 truncate leading-tight">{conv.lastMsg}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col border-none shadow-2xl overflow-hidden relative" style={{ background: 'var(--card)' }}>
        {/* Header */}
        <div className="p-4 px-6 border-b border-border/50 flex items-center justify-between bg-muted/20 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-md"
                style={{ background: `linear-gradient(135deg, #6366f1, #a78bfa)` }}
            >
              CW
            </div>
            <div>
              <p className="font-black text-base leading-tight">Casey Ward</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Circle size={8} fill="#10b981" className="text-emerald-500" />
                <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider">Online Now</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
 <Button variant="ghost" size="icon" className=" hover:bg-muted">
              <Phone size={18} className="text-muted-foreground" />
            </Button>
 <Button variant="ghost" size="icon" className=" hover:bg-muted">
              <Video size={18} className="text-muted-foreground" />
            </Button>
 <Button variant="ghost" size="icon" className=" hover:bg-muted">
              <MoreVertical size={18} className="text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 flex flex-col">
          {MESSAGES.map((msg) => (
            <div 
              key={msg.id}
              className={`flex flex-col max-w-[70%] ${msg.mine ? 'self-end items-end' : 'self-start items-start'}`}
            >
              <div 
                className={`p-4 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm ${
                  msg.mine 
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/10' 
                    : 'bg-muted/50 border border-border/30 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] mt-1.5 opacity-30 font-black uppercase tracking-tighter">
                {msg.time}
              </span>
            </div>
          ))}
          <div className="py-4 flex items-center gap-4">
             <div className="h-px flex-1 bg-border/20" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-20">Today</span>
             <div className="h-px flex-1 bg-border/20" />
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-6 bg-muted/20">
          <div className="relative flex items-center gap-3 bg-card border border-border/50 rounded-2xl p-2.5 px-4 shadow-xl shadow-black/5">
 <Button variant="ghost" size="icon" className=" h-10 w-10 text-muted-foreground hover:bg-muted">
              <ImageIcon size={18} />
            </Button>
 <Button variant="ghost" size="icon" className=" h-10 w-10 text-muted-foreground hover:bg-muted">
              <Paperclip size={18} />
            </Button>
            <div className="h-6 w-px bg-border/50 mx-1" />
            <Input 
              placeholder="Type your message here..." 
              className="flex-1 bg-transparent border-none focus-visible:ring-0 text-sm font-medium h-10 p-0"
            />
 <Button variant="ghost" size="icon" className=" h-10 w-10 text-muted-foreground hover:bg-muted">
              <Smile size={18} />
            </Button>
 <Button className=" h-10 w-10 shadow-lg shadow-indigo-500/20" style={{ background: 'var(--foreground)', color: 'var(--card)' }}>
              <Send size={16} />
            </Button>
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
}
