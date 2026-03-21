"use client";

import React, { useState } from "react";
import { 
  User, Bell, Shield, Wallet, Globe, Moon, 
  HelpCircle, LogOut, ChevronRight, Camera, Zap,
  Check, X, Eye, EyeOff, Sun
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useTheme } from "@/components/ThemeProvider";
import { useRef } from "react";

// ─── Sub-panels ───────────────────────────────────────────────────────────────
function ProfilePanel({ user, onClose }: { user: any; onClose: () => void }) {
  const [name, setName] = useState(user?.fullName || "");
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
      <Card className="w-full max-w-lg p-8 border shadow-2xl animate-in zoom-in-95 duration-300" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black" style={{ color: "var(--foreground)" }}>Profile Information</h2>
 <button onClick={onClose} className="w-9 h-9 flex items-center justify-center transition-all hover:bg-muted" style={{ color: "var(--muted-foreground)" }}><X size={18} /></button>
        </div>
        <div className="space-y-5">
          <div>
            <label className="text-xs font-black uppercase tracking-widest mb-2 block" style={{ color: "var(--muted-foreground)" }}>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-indigo-500/30"
              style={{ background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-widest mb-2 block" style={{ color: "var(--muted-foreground)" }}>Email Address</label>
            <input value={user?.primaryEmailAddress?.emailAddress || ""} readOnly
              className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none opacity-50 cursor-not-allowed"
              style={{ background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
            <p className="text-xs mt-1.5" style={{ color: "var(--muted-foreground)" }}>Email is managed by your login provider.</p>
          </div>
        </div>
        <div className="flex gap-3 mt-8">
 <Button onClick={handleSave} className="flex-1 font-black h-11 transition-all" style={{ background: saved ? "#10b981" : "var(--foreground)", color: "var(--card)" }}>
            {saved ? <><Check size={16} className="mr-2" />Saved!</> : "Save Changes"}
          </Button>
 <Button onClick={onClose} variant="outline" className="flex-1 font-bold h-11">Cancel</Button>
        </div>
      </Card>
    </div>
  );
}

function PasswordPanel({ onClose }: { onClose: () => void }) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [current, setCurrent] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => { setSaved(false); onClose(); }, 2000); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
      <Card className="w-full max-w-lg p-8 border shadow-2xl animate-in zoom-in-95 duration-300" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black" style={{ color: "var(--foreground)" }}>Security & Password</h2>
 <button onClick={onClose} className="w-9 h-9 flex items-center justify-center transition-all hover:bg-muted" style={{ color: "var(--muted-foreground)" }}><X size={18} /></button>
        </div>
        <div className="space-y-5">
          <div>
            <label className="text-xs font-black uppercase tracking-widest mb-2 block" style={{ color: "var(--muted-foreground)" }}>Current Password</label>
            <div className="relative">
              <input type={showCurrent ? "text" : "password"} value={current} onChange={e => setCurrent(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/30 pr-12"
                style={{ background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
 <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }}>
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-widest mb-2 block" style={{ color: "var(--muted-foreground)" }}>New Password</label>
            <div className="relative">
              <input type={showNew ? "text" : "password"} value={newPwd} onChange={e => setNewPwd(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/30 pr-12"
                style={{ background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
 <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }}>
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="p-4 rounded-xl" style={{ background: "var(--muted)" }}>
            <p className="text-xs font-bold" style={{ color: "var(--muted-foreground)" }}>2FA is managed via your Clerk account settings. For added security, enable it at <span className="text-indigo-500">accounts.kinetiq.app</span>.</p>
          </div>
        </div>
        <div className="flex gap-3 mt-8">
 <Button onClick={handleSave} className="flex-1 font-black h-11" style={{ background: saved ? "#10b981" : "var(--foreground)", color: "var(--card)" }}>
            {saved ? <><Check size={16} className="mr-2" />Updated!</> : "Update Password"}
          </Button>
 <Button onClick={onClose} variant="outline" className="flex-1 font-bold h-11">Cancel</Button>
        </div>
      </Card>
    </div>
  );
}

function BillingPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
      <Card className="w-full max-w-lg p-8 border shadow-2xl animate-in zoom-in-95 duration-300" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black" style={{ color: "var(--foreground)" }}>Billing & Subscription</h2>
 <button onClick={onClose} className="w-9 h-9 flex items-center justify-center transition-all hover:bg-muted" style={{ color: "var(--muted-foreground)" }}><X size={18} /></button>
        </div>
        <div className="p-6 rounded-2xl mb-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)" }}>
          <p className="text-xs font-black uppercase tracking-widest text-white/70 mb-1">Current Plan</p>
          <p className="text-3xl font-black text-white">Pro Coach</p>
          <p className="text-sm text-white/70 mt-2 font-medium">Renews on April 21, 2026 · $49/mo</p>
        </div>
        <div className="space-y-3 mb-8">
          {[
            { label: "Unlimited Clients", check: true },
            { label: "AI Recommendations", check: true },
            { label: "Strava Integration", check: true },
            { label: "Custom Branding", check: false },
          ].map(f => (
            <div key={f.label} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${f.check ? "bg-emerald-500" : "bg-muted"}`}>
                {f.check ? <Check size={12} className="text-white" /> : <X size={10} className="text-muted-foreground" />}
              </div>
              <span className={`text-sm font-medium ${f.check ? "" : "opacity-40"}`} style={{ color: "var(--foreground)" }}>{f.label}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
 <Button className="flex-1 font-black h-11" style={{ background: "var(--foreground)", color: "var(--card)" }}>Manage Plan</Button>
 <Button onClick={onClose} variant="outline" className="flex-1 font-bold h-11">Close</Button>
        </div>
      </Card>
    </div>
  );
}

function LocalizationPanel({ onClose }: { onClose: () => void }) {
  const [lang, setLang] = useState("en");
  const [tz, setTz] = useState("Africa/Lagos");
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => { setSaved(false); onClose(); }, 2000); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
      <Card className="w-full max-w-lg p-8 border shadow-2xl animate-in zoom-in-95 duration-300" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black" style={{ color: "var(--foreground)" }}>Localization</h2>
 <button onClick={onClose} className="w-9 h-9 flex items-center justify-center transition-all hover:bg-muted" style={{ color: "var(--muted-foreground)" }}><X size={18} /></button>
        </div>
        <div className="space-y-5">
          <div>
            <label className="text-xs font-black uppercase tracking-widest mb-2 block" style={{ color: "var(--muted-foreground)" }}>Language</label>
            <select value={lang} onChange={e => setLang(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none" style={{ background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
              <option value="en">English (US)</option>
              <option value="en-gb">English (GB)</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
              <option value="pt">Português</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-widest mb-2 block" style={{ color: "var(--muted-foreground)" }}>Timezone</label>
            <select value={tz} onChange={e => setTz(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none" style={{ background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
              <option value="Africa/Lagos">Africa/Lagos (WAT, UTC+1)</option>
              <option value="Africa/Accra">Africa/Accra (GMT)</option>
              <option value="Africa/Nairobi">Africa/Nairobi (EAT, UTC+3)</option>
              <option value="Europe/London">Europe/London (GMT/BST)</option>
              <option value="America/New_York">America/New_York (EST, UTC-5)</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-8">
 <Button onClick={handleSave} className="flex-1 font-black h-11" style={{ background: saved ? "#10b981" : "var(--foreground)", color: "var(--card)" }}>
            {saved ? <><Check size={16} className="mr-2" />Saved!</> : "Save Preferences"}
          </Button>
 <Button onClick={onClose} variant="outline" className="flex-1 font-bold h-11">Cancel</Button>
        </div>
      </Card>
    </div>
  );
}

// ─── Main Settings Page ───────────────────────────────────────────────────────
type PanelType = "profile" | "password" | "billing" | "localization" | null;

export default function SettingsPage() {
  const { user } = useUser();
  const { theme, toggle } = useTheme();
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [notificationsOn, setNotificationsOn] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      try {
        await user?.setProfileImage({ file });
      } catch (error) {
        console.error("Failed to upload profile image:", error);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--background)" }}>
      <DashboardHeader title="Settings" showInvite={false} />
      
      <div className="flex-1 p-8 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Profile Card */}
        <Card className="p-8 mb-10 border shadow-xl relative overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          <div className="flex items-center gap-8 relative z-10">
            <div className="relative group/avatar">
              <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-indigo-500/10 transition-all group-hover/avatar:ring-indigo-500/30">
                {photoPreview ? (
                  <img src={photoPreview} className="w-full h-full object-cover" alt="Profile" />
                ) : user?.imageUrl ? (
                  <img src={user.imageUrl} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white" style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)" }}>
                    {user?.firstName?.[0] || "C"}
                  </div>
                )}
              </div>
 <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl border-4 hover:scale-110 transition-all"
                style={{ background: "var(--foreground)", color: "var(--card)", borderColor: "var(--card)" }}>
                <Camera size={16} />
              </button>
            </div>
            
            <div className="flex-1">
              <h3 className="text-2xl font-black" style={{ color: "var(--foreground)" }}>{user?.fullName || "Coach"}</h3>
              <p className="font-medium" style={{ color: "var(--muted-foreground)" }}>{user?.primaryEmailAddress?.emailAddress}</p>
              <div className="flex gap-2 mt-4">
 <Button size="sm" variant="outline" className=" font-bold" onClick={() => setActivePanel("profile")}>Edit Profile</Button>
                <SignOutButton>
 <Button size="sm" variant="ghost" className=" font-bold text-red-500 hover:bg-red-500/10 hover:text-red-500">
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </Button>
                </SignOutButton>
              </div>
            </div>
          </div>
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-indigo-500/5 blur-3xl" />
        </Card>

        <div className="space-y-8">
          {/* Account */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] px-4 mb-3" style={{ color: "var(--muted-foreground)" }}>Account</h4>
            <Card className="border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div>
                {[
                  { label: "Profile Information", icon: User, desc: "Name, email, and personal details", action: () => setActivePanel("profile") },
                  { label: "Security & Password", icon: Shield, desc: "2FA and login history", action: () => setActivePanel("password") },
                  { label: "Billing & Subscription", icon: Wallet, desc: "Manage your Pro plan", action: () => setActivePanel("billing") },
                ].map((item, j, arr) => (
                  <>
 <button key={j} onClick={item.action} className="w-full p-5 px-6 flex items-center justify-between hover:bg-muted/30 transition-all cursor-pointer group text-left">
                      <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 duration-200" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                          <item.icon size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-[15px]" style={{ color: "var(--foreground)" }}>{item.label}</p>
                          <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" style={{ color: "var(--muted-foreground)" }} />
                    </button>
                    {j < arr.length - 1 && <div className="mx-6 h-px" style={{ background: "var(--border)", opacity: 0.5 }} />}
                  </>
                ))}
              </div>
            </Card>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] px-4 mb-3" style={{ color: "var(--muted-foreground)" }}>Platform</h4>
            <Card className="border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div>
                <div className="p-5 px-6 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                      <Bell size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-[15px]" style={{ color: "var(--foreground)" }}>Notifications</p>
                      <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Alerts and email preferences</p>
                    </div>
                  </div>
                  <Switch checked={notificationsOn} onCheckedChange={setNotificationsOn} />
                </div>
                <div className="mx-6 h-px" style={{ background: "var(--border)", opacity: 0.4 }} />
                <div className="p-5 px-6 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                      {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
                    </div>
                    <div>
                      <p className="font-bold text-[15px]" style={{ color: "var(--foreground)" }}>Dark Mode</p>
                      <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Currently: {theme === "dark" ? "Dark" : "Light"} theme</p>
                    </div>
                  </div>
                  <Switch checked={theme === "dark"} onCheckedChange={() => toggle()} />
                </div>
                <div className="mx-6 h-px" style={{ background: "var(--border)", opacity: 0.4 }} />
 <button onClick={() => setActivePanel("localization")} className="w-full p-5 px-6 flex items-center justify-between hover:bg-muted/30 transition-all group text-left">
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                      <Globe size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-[15px]" style={{ color: "var(--foreground)" }}>Localization</p>
                      <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Language and timezone</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" style={{ color: "var(--muted-foreground)" }} />
                </button>
              </div>
            </Card>
          </div>

          {/* Help */}
 <button className="w-full p-6 text-left border transition-all hover:bg-orange-500/10 group flex items-center justify-between" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <HelpCircle size={24} />
              </div>
              <div>
                <p className="font-black text-lg" style={{ color: "var(--foreground)" }}>Need some help?</p>
                <p className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>Check our FAQs or talk to a human.</p>
              </div>
            </div>
            <span className="text-orange-500 font-black text-[10px] uppercase tracking-widest">Open Support →</span>
          </button>
        </div>
      </div>

      {/* Panels */}
      {activePanel === "profile" && <ProfilePanel user={user} onClose={() => setActivePanel(null)} />}
      {activePanel === "password" && <PasswordPanel onClose={() => setActivePanel(null)} />}
      {activePanel === "billing" && <BillingPanel onClose={() => setActivePanel(null)} />}
      {activePanel === "localization" && <LocalizationPanel onClose={() => setActivePanel(null)} />}
    </div>
  );
}
