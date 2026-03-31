"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, ChevronRight, ChevronLeft, Sun, Moon, Users, PieChart, CheckCircle2 as CheckCircle } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Step = 1 | 2 | 3;

// ─── Animated Client Graph (Left Panel Visual) ────────────────────────────────
function ClientGraph() {
    const nodes = [
        { cx: "50%", cy: "12%", delay: "0s", size: 36 },
        { cx: "82%", cy: "30%", delay: "0.5s", size: 32 },
        { cx: "88%", cy: "62%", delay: "1s", size: 28 },
        { cx: "68%", cy: "86%", delay: "1.5s", size: 32 },
        { cx: "32%", cy: "86%", delay: "2s", size: 28 },
        { cx: "12%", cy: "62%", delay: "2.5s", size: 32 },
        { cx: "18%", cy: "30%", delay: "3s", size: 36 },
    ];

    const initials = ["AR", "JD", "KL", "MP", "SR", "TN", "WP"];
    const colors = [
        "bg-violet-500", "bg-emerald-500", "bg-amber-500",
        "bg-rose-500", "bg-sky-500", "bg-fuchsia-500", "bg-teal-500"
    ];

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Outer dashed ring */}
            <div
                className="ring-spin absolute rounded-full border border-dashed opacity-20"
                style={{ width: "85%", maxWidth: 380, aspectRatio: "1", borderColor: "var(--primary)" }}
            />
            {/* Middle dashed ring */}
            <div
                className="ring-spin-reverse absolute rounded-full border border-dashed opacity-15"
                style={{ width: "60%", maxWidth: 270, aspectRatio: "1", borderColor: "var(--primary)" }}
            />

            {/* Center coach node */}
            <div className="absolute float-anim flex flex-col items-center gap-1.5 z-10">
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-medium text-lg shadow-lg"
                    style={{ background: "var(--primary)", boxShadow: "0 0 32px color-mix(in srgb, var(--primary) 60%, transparent)" }}
                >
                    YOU
                </div>
                <span className="text-xs font-medium opacity-60" style={{ color: "var(--foreground)" }}>
                    Coach
                </span>
            </div>

            {/* Satellite client nodes */}
            {nodes.map((node, i) => (
                <div
                    key={i}
                    className="node-pulse absolute z-10 flex items-center justify-center rounded-full text-white text-xs font-medium shadow-md select-none"
                    style={{
                        left: node.cx,
                        top: node.cy,
                        width: node.size,
                        height: node.size,
                        transform: "translate(-50%, -50%)",
                        animationDelay: node.delay,
                    }}
                >
                    <div
                        className={`w-full h-full rounded-full flex items-center justify-center text-white text-xs font-medium ${colors[i]}`}
                    >
                        {initials[i]}
                    </div>
                </div>
            ))}
        </div>
    );
}

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
            className="px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200"
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
    const router = useRouter();

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
        { icon: <PieChart size={14}  />, label: "Risk alerts caught early", value: "94%" },
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
                className="hidden lg:flex flex-col justify-between w-2/5 relative overflow-hidden p-10"
                style={{
                    background: "var(--panel-bg)",
                    borderRight: "1px solid var(--panel-border)",
                }}
            >
                {/* Logo */}
                <div className="flex items-center gap-2 z-10">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: "var(--primary)" }}
                    >
                        <Activity size={16} className="text-white" />
                    </div>
                    <span className="font-medium text-lg" style={{ color: "var(--foreground)" }}>
                        Kinetiq
                    </span>
                </div>

                {/* Animated Graph */}
                <div className="flex-1 flex items-center justify-center py-8 relative">
                    <div className="w-full max-w-xs aspect-square">
                        <ClientGraph />
                    </div>
                </div>

                {/* Stats */}
                <div className="z-10 space-y-3">
                    <p className="text-xs uppercase tracking-widest font-medium mb-4" style={{ color: "var(--muted-foreground)" }}>
                        Trusted by elite coaches
                    </p>
                    {panelStats.map((stat, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2" style={{ color: "var(--muted-foreground)" }}>
                                {stat.icon}
                                <span className="text-xs">{stat.label}</span>
                            </div>
                            <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                                {stat.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── RIGHT PANEL ─────────────────────────────────────── */}
            <div className="flex-1 flex flex-col">
                {/* Top bar */}
                <div className="flex items-center justify-between px-8 py-5" style={{ borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "var(--panel-border)" }}>
                    <StepDots step={step} />
 <button
                        onClick={toggleTheme}
                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                        style={{
                            background: "var(--muted)",
                            color: "var(--muted-foreground)",
                        }}
                    >
                        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                </div>

                {/* Form body */}
                <div className="flex-1 flex items-center justify-center px-8 py-12">
                    <div className="w-full max-w-md">
                        {/* Icon */}
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow"
                            style={{ background: "color-mix(in srgb, var(--primary) 15%, transparent)" }}
                        >
                            <Activity size={22} style={{ color: "var(--primary)" }} />
                        </div>

                        {/* Step 1: Coach type */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-medium mb-1" style={{ color: "var(--foreground)" }}>
                                        What kind of coach are you?
                                    </h2>
                                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                                        We'll tailor your experience and dashboard to fit your style.
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "var(--muted-foreground)" }}>
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
                                    <h2 className="text-2xl font-medium mb-1" style={{ color: "var(--foreground)" }}>
                                        How many clients do you manage?
                                    </h2>
                                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                                        This helps us understand your scale and set up your dashboard.
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "var(--muted-foreground)" }}>
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
                                    <h2 className="text-2xl font-medium mb-1" style={{ color: "var(--foreground)" }}>
                                        Add your first client
                                    </h2>
                                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                                        Invite a client now and start monitoring their health signals immediately.
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
                                            className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
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
                                            className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
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
                                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                                    You can skip this step and add clients from your dashboard.
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
                            className="px-4 py-2 rounded-lg text-xs font-medium border transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            style={{
                                color: "var(--muted-foreground)",
                                borderColor: "var(--border)",
                            }}
                        >
                            Skip for now (Dev)
                        </button>

 <button
                            onClick={handleNext}
                            disabled={!canContinue}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all"
                            style={{
                                background: canContinue ? "var(--primary)" : "var(--muted)",
                                color: canContinue ? "var(--primary-foreground)" : "var(--muted-foreground)",
                                cursor: canContinue ? "pointer" : "not-allowed",
                                opacity: canContinue ? 1 : 0.6,
                            }}
                        >
                            {step === 3 ? "Finish & Open Dashboard" : "Continue"}
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
