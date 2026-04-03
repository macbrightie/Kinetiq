"use client";

import React, { useState } from "react";
import { UserPlus, Mail, Instagram, Phone, Send, Plus as Add, CheckCircle2 as CheckCircle, Sparkles, X, ArrowRight, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "@/components/ui/card";
import { getActivityType } from "@/lib/fitnessUtils";

interface InviteClientModalProps {
  onClose: () => void;
}

export function InviteClientModal({ onClose }: InviteClientModalProps) {
  const [form, setForm] = useState({ name: "", email: "", ig: "", x: "", whatsapp: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setToken(data.token);
        setSent(true);
      } else {
        setError(data?.error || `Server error (${res.status}). Please try again.`);
      }
    } catch (err) {
      console.error(err);
      setError("Can't reach the server. Check your database connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (!token) return;
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/client-setup/${token}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const XIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.629L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );

  if (sent) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
        <CreditCard className="w-full max-w-[400px] p-10 text-center shadow-2xl flex flex-col items-center border-none rounded-[26px] animate-in zoom-in-95 duration-300"
          style={{ background: "var(--card)", color: "var(--foreground)" }}>
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <h3 className="text-xl font-medium mb-2 font-plus-jakarta">Invitation Sent!</h3>
          <p className="text-[14px] leading-relaxed mb-6 opacity-70">
            We've sent an invitation to <strong className="font-semibold text-indigo-500">{form.email}</strong>.
            You can also manually copy the setup link below.
          </p>
          
          <div className="w-full space-y-4 mb-4">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-muted/50 border border-border">
                <input 
                    readOnly 
                    value={token ? `${window.location.origin}/client-setup/${token}` : "Generating link..."}
                    className="bg-transparent border-none outline-none text-[14px] font-medium text-muted-foreground w-full px-2"
                />
                <Button 
                    onClick={copyLink} 
                    size="sm"
                    className="shrink-0 h-8 rounded-lg px-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/10"
                >
                    {copied ? <CheckCircle size={14} /> : <Add size={14} style={{transform: "rotate(45deg)"}} />}
                </Button>
            </div>

            <div className="pt-2">
                <Button 
                    onClick={onClose} 
                    variant="outline"
                    size="lg"
                    className="w-full rounded-2xl h-12 font-medium text-[14px]"
                >
                    Awesome, thanks!
                </Button>
            </div>
          </div>
        </CreditCard>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <CreditCard className="w-full max-w-[480px] overflow-hidden shadow-2xl flex flex-col relative border-none rounded-[26px] animate-in zoom-in-95 duration-300"
        style={{ background: "var(--card)", color: "var(--foreground)" }}>
        
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="modalDots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#modalDots)" />
          </svg>
        </div>

        {/* Top Gradient Highlight */}
        <div className="absolute top-0 left-0 right-0 h-1.5 z-10" 
          style={{ background: "linear-gradient(90deg, #6366f1, #a78bfa, #f43f5e)" }} />

        {/* Header Section */}
        <div className="px-8 pt-10 pb-6 flex flex-col items-center text-center relative z-20">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-indigo-500/10 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
            <UserPlus size={26} className="text-indigo-500" />
          </div>
          <h3 className="text-2xl font-medium tracking-tight leading-tight font-plus-jakarta">
            Invite New Client
          </h3>
          <p className="text-sm mt-1.5 font-medium opacity-60 max-w-[320px]">
            They'll receive a personal invite to set up their account and start their journey.
          </p>
          
          <Button 
            variant="ghost" 
            size="icon-sm" 
            onClick={onClose}
            className="absolute top-6 right-6 rounded-full"
          >
            <X size={16} />
          </Button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleInvite} className="px-8 pb-8 space-y-6 relative z-20">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[12px] font-medium uppercase tracking-widest opacity-60 ml-1">Full Name</Label>
              <Input 
                id="name"
                required 
                placeholder="e.g. Sam Patel"
                value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="h-12 rounded-xl bg-muted/50 border-border/50 focus:bg-muted focus:border-indigo-500/50 transition-all text-sm font-semibold text-foreground placeholder:opacity-30"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[12px] font-medium uppercase tracking-widest opacity-60 ml-1">Email Address</Label>
              <Input 
                id="email"
                required 
                type="email" 
                placeholder="sam@example.com"
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="h-12 rounded-xl bg-muted/50 border-border/50 focus:bg-muted focus:border-indigo-500/50 transition-all text-sm font-semibold text-foreground placeholder:opacity-30"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[12px] font-medium uppercase tracking-widest opacity-60 ml-1 block">Social Handles (Optional)</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Instagram size={14} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
                  <Input 
                    placeholder="Instagram"
                    value={form.ig} 
                    onChange={e => setForm({ ...form, ig: e.target.value })}
                    className="h-12 rounded-xl pl-10 bg-muted/50 border-border/50 focus:bg-muted focus:border-indigo-500/50 transition-all text-sm font-medium placeholder:opacity-30"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">
                    <XIcon />
                  </span>
                  <Input 
                    placeholder="X / Twitter"
                    value={form.x} 
                    onChange={e => setForm({ ...form, x: e.target.value })}
                    className="h-12 rounded-xl pl-10 bg-muted/50 border-border/50 focus:bg-muted focus:border-indigo-500/50 transition-all text-sm font-medium placeholder:opacity-30"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-[12px] font-medium uppercase tracking-widest opacity-60 ml-1">WhatsApp Number (Optional)</Label>
              <div className="relative">
                <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
                <Input 
                  id="whatsapp"
                  placeholder="+1 (555) 000-0000"
                  value={form.whatsapp} 
                  onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                  className="h-12 rounded-xl pl-10 bg-muted/50 border-border/50 focus:bg-muted focus:border-indigo-500/50 transition-all text-sm font-medium placeholder:opacity-30"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {error && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm font-medium"
                style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                <span className="mt-0.5 shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                type="button"
                variant="outline" 
                size="lg"
                onClick={onClose}
                className="w-full"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                size="lg"
                className="w-full shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={15} />
                    Send Invitation
                  </>
                )}
              </Button>
            </div>
            <div className="flex justify-center mt-3">
              <span className="flex items-center text-[12px] font-medium text-muted-foreground opacity-90">
                <BadgeCheck size={14} className="mr-1.5 opacity-60" />
                Link expires in 7 days • Premium Security
              </span>
            </div>
          </div>
        </form>
      </CreditCard>

      <style jsx>{`
        .font-plus-jakarta {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
      `}</style>
    </div>
  );
}
