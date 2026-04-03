"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Activity, ChevronRight, ChevronLeft, Sun, Moon, Users, BarChart2, CheckCircle2 as CheckCircle } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Step = 1 | 2 | 3;

// ─── Animated Client Graph (Left Panel Visual) ────────────────────────────────
const features = [
    {
        title: "Predictive Intelligence",
        desc: "Stay ahead of the curve. Our AI analyzes subtle shifts in behavior to predict risk before it happens, keeping your roster full.",
        video: "/Onboarding-assets/intelligence.mp4"
    },
    {
        title: "Stop Client Churn",
        desc: "Protect your revenue. By identifying lagging engagement early, you can intervene and save clients before they quit.",
        video: "/Onboarding-assets/Stop%20churn.mp4"
    },
    {
        title: "Seamless Strava Sync",
        desc: "Automatic data collection. Sync heart rate and workout data directly for a complete, human-centric view of health.",
        video: "/Onboarding-assets/Strava.mp4"
    }
];

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepDots({ step }: { step: Step }) {
    return (
        <div className="flex gap-1.5">
            {([1, 2, 3] as Step[]).map((s) => (
                <div
                    key={s}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                        width: s === step ? 24 : 8,
                        background: s <= step ? "var(--primary)" : "var(--border)",
                    }}
                />
            ))}
        </div>
    );
}

// ─── Choice Chip ──────────────────────────────────────────────────────────────
function Chip({
    label, selected, onClick,
}: {
    label: string; selected: boolean; onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="px-5 h-[44px] rounded-full border text-sm font-normal transition-all duration-200"
            style={{
                borderColor: selected ? "var(--primary)" : "var(--border)",
                background: selected ? "color-mix(in srgb, var(--primary) 12%, transparent)" : "var(--input)",
                color: selected ? "var(--primary)" : "var(--muted-foreground)",
            }}
        >
            {label}
        </button>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OnboardingPage() {
    const [step, setStep] = useState<Step>(1);
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const [coachType, setCoachType] = useState("");
    const [clientCount, setClientCount] = useState("");
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [featureIndex, setFeatureIndex] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            setFeatureIndex((prev) => (prev + 1) % features.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const toggleTheme = () =>
        setTheme((t) => (t === "dark" ? "light" : "dark"));

    const canContinue =
        (step === 1 && !!coachType) ||
        (step === 2 && !!clientCount) ||
        step === 3;

    const handleNext = () => {
        if (step < 3) setStep((s) => (s + 1) as Step);
        else router.push("/dashboard");
    };

    const handleBack = () => {
        if (step > 1) setStep((s) => (s - 1) as Step);
    };

    const panelStats = [
        { icon: <Users size={14}  />, label: "Avg. clients per coach", value: "18" },
        { icon: <BarChart2 size={14}  />, label: "Risk alerts caught early", value: "94%" },
        { icon: <CheckCircle size={14}  />, label: "Retention improvement", value: "+37%" },
    ];

    return (
        <div
            className={theme}
            style={{
                minHeight: "100vh",
                display: "flex",
                background: "var(--background)",
                color: "var(--foreground)",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
        >
            {/* ─── LEFT PANEL ──────────────────────────────────────── */}
            <div
                className="hidden lg:flex flex-col justify-end w-1/2 relative overflow-hidden p-16"
                style={{
                    background: "#0C0C0C",
                    borderRight: "1px solid rgba(255,255,255,0.05)",
                }}
            >
                {/* Cinematic Background Videos */}
                <div className="absolute inset-0 z-0">
                    {features.map((feature, idx) => (
                        <video
                            key={feature.video}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${idx === featureIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                        >
                            <source src={feature.video} type="video/mp4" />
                        </video>
                    ))}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 z-20" />
                </div>

                {/* Top Logo Overlay */}
                <div className="absolute top-12 left-16 z-30">
                    <img src="/Logo-main-white.svg" className="h-8 w-auto" alt="Logo" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-30">
                    <div className="flex gap-2 mb-6">
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/80">
                            Elite Coaching
                        </span>
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/80">
                            AI Intelligence
                        </span>
                    </div>
                    
                    <h2 className="text-5xl font-black tracking-tighter mb-4 text-white uppercase italic leading-none">
                        {features[featureIndex].title}
                    </h2>
                    <p className="text-lg text-white/60 font-medium max-w-md leading-relaxed mb-12">
                        {features[featureIndex].desc}
                    </p>

                    {/* Progress Indicators */}
                    <div className="flex gap-2 relative">
                        {features.map((_, i) => (
                            <div key={i} className="h-[2px] flex-1 bg-white/10 rounded-full overflow-hidden">
                                {i === featureIndex && (
                                    <div className="h-full bg-white/60 rounded-full animate-progress-bar" />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4">
                        {features.map((f, i) => (
                            <p key={i} className={`text-[9px] font-bold uppercase tracking-widest transition-all duration-300 ${i === featureIndex ? 'text-white' : 'text-white/20'}`}>
                                {f.title}
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── RIGHT PANEL ─────────────────────────────────────── */}
            <div className="flex-1 flex flex-col">
                {/* Top bar */}
                <div className="flex items-center justify-between px-8 py-5" style={{ borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "var(--panel-border)" }}>
                    <StepDots step={step} />
  <button
                        onClick={toggleTheme}
                        className="w-[44px] h-[44px] rounded-full flex items-center justify-center transition-colors shadow-sm"
                        style={{
                            background: "var(--muted)",
                            color: "var(--muted-foreground)",
                        }}
                    >
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>

                {/* Form body */}
                <div className="flex-1 flex items-center justify-center px-8 py-12">
                    <div className="w-full max-w-md">
                        {/* Icon */}
                        <div
                            className="mb-8"
                        >
                             <img 
                                src={theme === "dark" ? "/Logo-main-white.svg" : "/Logo-main.svg"} 
                                alt="Kinetiq Logo" 
                                className="h-8 w-auto"
                            />
                        </div>

                        {/* Step 1: Coach type */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight mb-2 uppercase italic" style={{ color: "var(--foreground)" }}>
                                        What kind of coach are you?
                                    </h2>
                                    <p className="text-sm font-normal" style={{ color: "var(--muted-foreground)" }}>
                                        Join the inner circle of data-driven fitness coaches. Save money by reducing churn and preventing departures before they start.
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[12px] font-normal uppercase tracking-widest mb-4" style={{ color: "var(--muted-foreground)" }}>
                                        Coaching type
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {["Online Coach", "Personal Trainer", "Hybrid Coach", "Strength & Conditioning", "Nutrition Coach"].map((t) => (
                                            <Chip key={t} label={t} selected={coachType === t} onClick={() => setCoachType(t)} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Client count */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight mb-2 uppercase italic" style={{ color: "var(--foreground)" }}>
                                        Scale your impact.
                                    </h2>
                                    <p className="text-sm font-normal" style={{ color: "var(--muted-foreground)" }}>
                                        This helps us understand your roster size and optimize your baseline health algorithm for predictive insights.
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[12px] font-normal uppercase tracking-widest mb-4" style={{ color: "var(--muted-foreground)" }}>
                                        Client range
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {["1–10", "10–50", "50–100", "100+"].map((c) => (
                                            <Chip key={c} label={`${c} Clients`} selected={clientCount === c} onClick={() => setClientCount(c)} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Add first client */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight mb-2 uppercase italic" style={{ color: "var(--foreground)" }}>
                                        Add your first client.
                                    </h2>
                                    <p className="text-sm font-normal" style={{ color: "var(--muted-foreground)" }}>
                                        Invite a client now and start monitoring their heart rate, activity, and health signals immediately.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-medium uppercase tracking-wider block mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                                            Client name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. John Doe"
                                            value={clientName}
                                            onChange={(e) => setClientName(e.target.value)}
                                            className="w-full h-[44px] px-5 rounded-full text-sm outline-none transition-all placeholder:opacity-30"
                                            style={{
                                                background: "var(--input)",
                                                border: "1px solid var(--border)",
                                                color: "var(--foreground)",
                                            }}
                                            onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                                            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium uppercase tracking-wider block mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                                            Client email
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="e.g. john@example.com"
                                            value={clientEmail}
                                            onChange={(e) => setClientEmail(e.target.value)}
                                            className="w-full h-[44px] px-5 rounded-full text-sm outline-none transition-all placeholder:opacity-30"
                                            style={{
                                                background: "var(--input)",
                                                border: "1px solid var(--border)",
                                                color: "var(--foreground)",
                                            }}
                                            onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                                            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                                        />
                                    </div>
                                </div>
                                <p className="text-[12px] font-normal" style={{ color: "var(--muted-foreground)" }}>
                                    You can skip this step and add dozens of clients from your dashboard later.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer nav */}
                <div
                    className="flex items-center justify-between px-8 py-5"
                    style={{ borderTop: "1px solid var(--panel-border)" }}
                >
 <button
                        onClick={handleBack}
                        className="flex items-center gap-1.5 text-sm font-medium transition-opacity"
                        style={{
                            color: "var(--muted-foreground)",
                            opacity: step === 1 ? 0.3 : 1,
                            pointerEvents: step === 1 ? "none" : "auto",
                        }}
                    >
                        <ChevronLeft size={16} />
                        Go back
                    </button>

                    <div className="flex items-center gap-3">
  <button
                            onClick={() => router.push("/dashboard")}
                            className="h-[44px] px-6 rounded-full text-xs font-bold border transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 uppercase tracking-widest"
                            style={{
                                color: "var(--muted-foreground)",
                                borderColor: "var(--border)",
                            }}
                        >
                            Skip for now
                        </button>

  <button
                            onClick={handleNext}
                            disabled={!canContinue}
                            className="flex items-center gap-2 h-[44px] px-8 rounded-full text-sm font-bold uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20"
                            style={{
                                background: canContinue ? "var(--primary)" : "var(--muted)",
                                color: canContinue ? "var(--primary-foreground)" : "var(--muted-foreground)",
                                cursor: canContinue ? "pointer" : "not-allowed",
                                opacity: canContinue ? 1 : 0.6,
                            }}
                        >
                            {step === 3 ? "Open Dashboard" : "Continue"}
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
            <style jsx global>{`
                @keyframes progress-bar {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .animate-progress-bar {
                    animation: progress-bar 5s linear infinite;
                }
            `}</style>
        </div>
    );
}
