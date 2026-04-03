"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2, ChevronRight, Sparkles, Heart, Smartphone,
    Activity, Instagram, User, Camera, Zap, ShieldCheck, Moon, Sun,
    MessageCircle, Phone, Twitter, AtSign, PartyPopper
} from "lucide-react";
import { Loader } from '@/components/Loader';
import confetti from 'canvas-confetti';

// ─── Theme (mirrors ThemeProvider — uses same localStorage key + class pattern) ─
function useClientTheme() {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    // On mount: read saved preference (same as ThemeProvider)
    useEffect(() => {
        const saved = localStorage.getItem('kinetiq-theme') as 'dark' | 'light' | null;
        const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const initial = saved || preferred;
        setTheme(initial);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(initial);
    }, []);

    const toggle = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        localStorage.setItem('kinetiq-theme', next);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(next);
    };

    return { theme, toggle };
}

// ─── MotionCard ───────────────────────────────────────────────────────────────
function MotionCard({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
    return (
        <motion.div
            key={id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`bg-white dark:bg-[#1a1a20] border border-black/5 dark:border-white/5 p-8 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(37,99,235,0.08)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] ${className}`}
        >
            {children}
        </motion.div>
    );
}

// ─── Communication channels ───────────────────────────────────────────────────
const COMM_CHANNELS = [
    { id: 'whatsapp', label: 'WhatsApp', icon: Phone, placeholder: '+1 (555) 000-0000', color: '#25D366', hint: 'Phone number with country code' },
    { id: 'instagram', label: 'Instagram', icon: Instagram, placeholder: '@username', color: '#E1306C', hint: 'Your Instagram handle' },
    { id: 'x', label: 'X / Twitter', icon: Twitter, placeholder: '@handle', color: '#0C0C0C', hint: 'Your X username' },
    { id: 'email', label: 'Email', icon: AtSign, placeholder: 'you@example.com', color: '#6366f1', hint: 'Best email to reach you' },
];

// ─── Confetti burst ───────────────────────────────────────────────────────────
function fireConfetti() {
    const colors = ['#6366f1', '#a78bfa', '#34d399', '#fbbf24', '#f472b6'];
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors });
    setTimeout(() => confetti({ particleCount: 60, spread: 90, origin: { y: 0.5, x: 0.2 }, colors }), 200);
    setTimeout(() => confetti({ particleCount: 60, spread: 90, origin: { y: 0.5, x: 0.8 }, colors }), 350);
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ClientSetupPage() {
    const { token } = useParams();
    const router = useRouter();
    const { theme, toggle } = useClientTheme();

    const [step, setStep] = useState(1);
    const [inviteData, setInviteData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    // Step 2: profile
    const [name, setName] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [photoPreview, setPhotoPreview] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Step 3: communication
    const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
    const [channelValue, setChannelValue] = useState('');

    // Step 4: integrations
    const [connecting, setConnecting] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // TOTAL_STEPS = 4 (welcome, profile, comms, apps) + congrats
    const TOTAL_STEPS = 4;

    useEffect(() => {
        if (!token) return;
        fetch(`/api/invitations/${token}`)
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(d => { setInviteData(d); setName(d.name || ''); })
            .catch(() => setError("This invitation link is invalid or has expired."))
            .finally(() => setLoading(false));
    }, [token]);

    useEffect(() => {
        const sp = new URL(window.location.href).searchParams;
        if (sp.get('success') === 'strava') setConnecting(null);
    }, []);

    // Photo picker
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            const result = ev.target?.result as string;
            setPhotoPreview(result);
            setPhotoUrl(result); // In prod, upload to storage and use URL
        };
        reader.readAsDataURL(file);
    };

    const handleStravaConnect = () => {
        if (connecting) return;
        setConnecting('strava');
        window.location.href = `/api/strava/auth?referenceId=${token}`;
    };

    const handleComplete = async () => {
        setSubmitting(true);
        try {
            const commData: Record<string, string> = {};
            if (selectedChannel && channelValue) commData[selectedChannel] = channelValue;

            const res = await fetch(`/api/invitations/${token}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, photoUrl, ...commData }),
            });
            if (res.ok) {
                setDone(true);
                fireConfetti();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const nextStep = () => setStep(s => s + 1);

    // ── Loading / Error ──────────────────────────────────────────────────────
    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0e0e11] gap-6">
            <Loader />
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-500 opacity-60">Preparing your experience...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-[#0e0e11] text-center">
            <MotionCard className="max-w-md" id="error">
                <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/30 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <Smartphone className="text-rose-500" />
                </div>
                <h1 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">Wait a second...</h1>
                <p className="text-gray-500 dark:text-gray-400">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-8 px-8 py-4 rounded-2xl bg-gray-900 dark:bg-blue-600 text-white font-medium transition-all active:scale-95">
                    Try Again
                </button>
            </MotionCard>
        </div>
    );

    // ── Congrats Screen ──────────────────────────────────────────────────────
    if (done) return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-[#0e0e11]">
            <MotionCard className="max-w-lg w-full text-center" id="done">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/30"
                >
                    <PartyPopper size={44} className="text-white" />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl text-[12px] font-medium uppercase tracking-widest mb-6">
                        <CheckCircle2 size={14} />
                        You're all set
                    </div>
                    <h1 className="text-4xl font-medium tracking-tight text-gray-900 dark:text-white leading-tight mb-4">
                        You're in! Congrats 🎉
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-8 max-w-sm mx-auto">
                        You've given <strong className="text-gray-900 dark:text-white">{inviteData?.coachName}</strong> permission to help you stay motivated and consistent. Your journey starts now!
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[
                            { emoji: '🏋️', label: 'Workouts tracked' },
                            { emoji: '📊', label: 'Progress visible' },
                            { emoji: '💬', label: 'Coach connected' },
                        ].map(item => (
                            <div key={item.label} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5">
                                <div className="text-2xl mb-1">{item.emoji}</div>
                                <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">{item.label}</p>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={fireConfetti}
                        className="w-full py-5 rounded-[28px] bg-gray-900 dark:bg-indigo-600 text-white font-medium text-lg shadow-2xl active:scale-[0.98] transition-all mb-3"
                    >
                        🎊 Celebrate Again!
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full py-3 rounded-[28px] text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        Close this page
                    </button>
                </motion.div>
            </MotionCard>
        </div>
    );

    // ── Main Flow ────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden font-sans bg-white dark:bg-[#0e0e11] transition-colors duration-500">

            {/* Dots bg */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#3b82f6 1.5px, transparent 0)', backgroundSize: '32px 32px' }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-blue-50/50 dark:from-blue-500/10 to-transparent blur-[120px] rounded-full pointer-events-none" />

            {/* Header */}
            <header className="fixed top-0 inset-x-0 px-6 py-5 z-[100] flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Zap className="text-white" size={16} />
                    </div>
                    <span className="font-medium text-xl tracking-tight text-gray-900 dark:text-white">KINETIQ</span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Theme toggle */}
                    <button
                        onClick={toggle}
                        className="w-9 h-9 rounded-full flex items-center justify-center border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:scale-110 transition-transform"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </button>

                    {/* Progress dots */}
                    <div className="flex gap-1.5 bg-white/10 dark:bg-white/5 backdrop-blur-md p-1.5 rounded-full border border-black/5 dark:border-white/5">
                        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step > i + 1 ? 'w-4 bg-emerald-500' : step === i + 1 ? 'w-8 bg-blue-600' : 'w-1.5 bg-gray-300 dark:bg-gray-700'}`} />
                        ))}
                    </div>
                </div>
            </header>

            <main className="w-full max-w-lg relative z-[50] pt-20">
                <AnimatePresence mode="wait">

                    {/* ── Step 1: Welcome ── */}
                    {step === 1 && (
                        <MotionCard id="step1">
                            <div className="space-y-8">
                                <div className="text-center">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-2xl text-[12px] font-medium uppercase tracking-widest mb-8"
                                    >
                                        <Sparkles size={14} className="animate-pulse" />
                                        Personal Invitation
                                    </motion.div>
                                    <h1 className="text-[40px] font-medium tracking-tight text-gray-900 dark:text-white leading-[1.1] mb-6">
                                        Your coach is{' '}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">waiting for you.</span>
                                    </h1>
                                    <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                                        Hey <strong className="text-gray-900 dark:text-white">{inviteData?.name || 'Friend'}!</strong> I'm <strong className="text-gray-900 dark:text-white">{inviteData?.coachName}</strong>. Let's get you set up so we can start crushing your goals together!
                                    </p>
                                </div>

                                {/* Coach card */}
                                <div className="p-2 bg-gray-50/50 dark:bg-white/5 rounded-[32px] border border-gray-100 dark:border-white/5">
                                    <div className="flex items-center gap-5 p-5 bg-white dark:bg-[#1c1c21] rounded-[26px] shadow-sm border border-gray-100 dark:border-white/5">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 p-[3px] shadow-lg shadow-blue-500/20 shrink-0">
                                            <div className="w-full h-full rounded-[13px] bg-white dark:bg-[#0e0e11] flex items-center justify-center overflow-hidden">
                                                {inviteData?.coachAvatar
                                                    ? <img src={inviteData.coachAvatar} alt={inviteData.coachName} className="w-full h-full object-cover" />
                                                    : <span className="font-medium text-2xl text-blue-600 dark:text-blue-400">{inviteData?.coachName?.[0]}</span>
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-lg font-medium text-gray-900 dark:text-white">{inviteData?.coachName}</p>
                                            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                                                <ShieldCheck size={14} />
                                                <span className="text-[12px] font-medium uppercase tracking-widest">Verified Coach</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={nextStep}
                                    className="w-full py-5 rounded-[28px] bg-gray-900 dark:bg-blue-600 text-white font-medium text-lg shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 group">
                                    Let's Go
                                    <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </MotionCard>
                    )}

                    {/* ── Step 2: Profile ── */}
                    {step === 2 && (
                        <MotionCard id="step2">
                            <div className="space-y-8">
                                <div className="text-center">
                                    <h2 className="text-3xl font-medium text-gray-900 dark:text-white tracking-tight">Your profile</h2>
                                    <p className="mt-2 text-gray-500 dark:text-gray-400">Add a photo and confirm your name.</p>
                                </div>

                                {/* Photo picker */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <div className="w-32 h-32 rounded-[32px] overflow-hidden bg-gray-100 dark:bg-[#1c1c21] border-2 border-dashed border-blue-300 dark:border-blue-500/40 flex items-center justify-center shadow-xl">
                                            {photoPreview
                                                ? <img src={photoPreview} alt="Your photo" className="w-full h-full object-cover" />
                                                : <User className="text-blue-300 dark:text-blue-500/40" size={48} />
                                            }
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[32px]">
                                                <Camera size={24} className="text-white" />
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-2xl shadow-xl flex items-center justify-center border-[3px] border-white dark:border-[#1a1a20]">
                                            <Camera size={16} />
                                        </div>
                                    </div>
                                    <p className="text-[12px] font-medium text-gray-400 uppercase tracking-widest">Tap to add photo</p>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                                </div>

                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="text-[12px] font-medium uppercase tracking-[0.2em] text-blue-500 ml-1 block">
                                        Preferred Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full py-5 px-6 bg-gray-50 dark:bg-[#1a1a20] border-2 border-transparent rounded-[24px] outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-[#1c1c21] transition-all font-medium text-xl text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
                                        placeholder="e.g. Alex"
                                    />
                                </div>

                                <button onClick={nextStep}
                                    className="w-full py-5 rounded-[28px] bg-gray-900 dark:bg-blue-600 text-white font-medium text-lg shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 group">
                                    Next Step
                                    <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </MotionCard>
                    )}

                    {/* ── Step 3: Communication ── */}
                    {step === 3 && (
                        <MotionCard id="step3">
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h2 className="text-3xl font-medium text-gray-900 dark:text-white tracking-tight">How should we reach you?</h2>
                                    <p className="mt-2 text-gray-500 dark:text-gray-400 leading-relaxed">
                                        Pick your preferred channel — your coach will use this to check in and keep you on track.
                                    </p>
                                </div>

                                {/* Channel selection */}
                                <div className="grid grid-cols-2 gap-3">
                                    {COMM_CHANNELS.map(ch => {
                                        const isSelected = selectedChannel === ch.id;
                                        return (
                                            <button
                                                key={ch.id}
                                                onClick={() => { setSelectedChannel(ch.id); setChannelValue(''); }}
                                                className={`flex items-center gap-3 p-4 rounded-[24px] border-2 text-left transition-all active:scale-[0.97] ${isSelected
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                                                    : 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/3 hover:border-gray-200 dark:hover:border-white/10'}`}
                                            >
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                                    style={{ background: isSelected ? `${ch.color}20` : 'rgba(120,120,120,0.08)', color: isSelected ? ch.color : '#9ca3af' }}>
                                                    <ch.icon size={18} />
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-semibold ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>{ch.label}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Detail input */}
                                <AnimatePresence mode="wait">
                                    {selectedChannel && (
                                        <motion.div
                                            key={selectedChannel}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            {(() => {
                                                const ch = COMM_CHANNELS.find(c => c.id === selectedChannel)!;
                                                return (
                                                    <div className="space-y-2 pt-2">
                                                        <label className="text-[12px] font-medium uppercase tracking-widest ml-1 block text-gray-400">{ch.hint}</label>
                                                        <div className="relative">
                                                            <div className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color: ch.color }}>
                                                                <ch.icon size={16} />
                                                            </div>
                                                            <input
                                                                type={ch.id === 'email' ? 'email' : 'text'}
                                                                value={channelValue}
                                                                onChange={e => setChannelValue(e.target.value)}
                                                                placeholder={ch.placeholder}
                                                                className="w-full py-4 pl-12 pr-5 bg-gray-50 dark:bg-[#1a1a20] border-2 border-transparent rounded-[20px] outline-none focus:border-blue-500 transition-all font-medium text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex gap-3 pt-2">
                                    <button onClick={() => setStep(s => s - 1)}
                                        className="px-6 py-4 rounded-[24px] border-2 border-gray-100 dark:border-white/10 text-gray-500 dark:text-gray-400 font-medium text-sm hover:border-gray-200 dark:hover:border-white/20 transition-all">
                                        Back
                                    </button>
                                    <button onClick={nextStep}
                                        className="flex-1 py-4 rounded-[24px] bg-gray-900 dark:bg-blue-600 text-white font-medium shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                                        {selectedChannel ? 'Continue' : 'Skip for now'}
                                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </MotionCard>
                    )}

                    {/* ── Step 4: Connect apps ── */}
                    {step === 4 && (
                        <MotionCard id="step4" className="overflow-visible">
                            <div className="space-y-8">
                                <div className="text-center">
                                    <h2 className="text-3xl font-medium text-gray-900 dark:text-white tracking-tight">Connect your apps.</h2>
                                    <p className="mt-2 text-gray-500 dark:text-gray-400 leading-relaxed">
                                        Sync your fitness data so your coach can see your real progress.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {/* Apple Health – coming soon */}
                                    <div className="relative flex items-center gap-5 p-5 bg-gray-50/50 dark:bg-white/3 border-2 border-transparent rounded-[28px] opacity-50 grayscale cursor-not-allowed">
                                        <div className="absolute top-4 right-4 px-2.5 py-1 bg-gray-900 dark:bg-white text-white dark:text-black text-[9px] font-medium uppercase tracking-widest rounded-full">
                                            Coming Soon
                                        </div>
                                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#1c1c21] flex items-center justify-center shadow-sm shrink-0">
                                            <Heart className="text-gray-300 dark:text-gray-600" size={26} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-700 dark:text-gray-300 text-base">Apple Health</p>
                                            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-0.5">iPhone & Apple Watch</p>
                                        </div>
                                    </div>

                                    {/* Strava */}
                                    <motion.button
                                        whileHover={{ y: -3 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleStravaConnect}
                                        disabled={!!connecting}
                                        className="w-full relative flex items-center gap-5 p-5 bg-orange-50/30 dark:bg-orange-500/5 border-2 border-orange-100 dark:border-orange-500/20 rounded-[28px] hover:border-orange-400 transition-all text-left disabled:opacity-50"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#1c1c21] flex items-center justify-center shadow-md shadow-orange-100 dark:shadow-orange-900/20 text-orange-500 shrink-0">
                                            {connecting === 'strava'
                                                ? <div className="w-7 h-7 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                                : <Activity size={28} strokeWidth={2.5} />
                                            }
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white text-base">Connect Strava</p>
                                            <p className="text-xs text-orange-500/70 font-medium uppercase tracking-widest mt-0.5">Sync Your Workouts</p>
                                        </div>
                                        <ChevronRight size={20} className="text-orange-400 shrink-0" />
                                    </motion.button>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={handleComplete}
                                        disabled={submitting}
                                        className="w-full py-5 rounded-[28px] bg-blue-600 text-white font-medium text-lg shadow-[0_20px_40px_-10px_rgba(37,99,235,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60"
                                    >
                                        {submitting
                                            ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            : <><CheckCircle2 size={22} /> Finish Onboarding</>
                                        }
                                    </button>
                                    <button onClick={() => setStep(s => s - 1)}
                                        className="w-full py-3 rounded-[28px] text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                        ← Go back
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 opacity-30 hover:opacity-70 transition-opacity">
                                    <ShieldCheck size={14} className="text-blue-500 shrink-0" />
                                    <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Privacy first: Only fitness data is shared with your coach.
                                    </p>
                                </div>
                            </div>
                        </MotionCard>
                    )}

                </AnimatePresence>
            </main>

            <footer className="fixed bottom-0 inset-x-0 p-8 pointer-events-none opacity-20">
                <p className="text-center text-[11px] font-medium uppercase tracking-[0.4em] text-gray-400 dark:text-gray-600">Powered by Kinetiq AI</p>
            </footer>
        </div>
    );
}
