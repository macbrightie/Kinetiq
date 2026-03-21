"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    ArrowRight,
    Sparkles,
    Heart,
    Smartphone,
    Activity,
    Instagram,
    User,
    Camera,
    ChevronRight,
    Zap,
    ShieldCheck,
    Moon,
    Sun,
    Loader2
} from 'lucide-react';
import { Loader } from '@/components/Loader';

const MotionCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`bg-white/80 dark:bg-[#1a1a20]/80 backdrop-blur-xl border border-white dark:border-white/5 p-8 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(37,99,235,0.08)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] ${className}`}
    >
        {children}
    </motion.div>
);

export default function ClientSetupPage() {
    const { token } = useParams();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [inviteData, setInviteData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: "",
        photoUrl: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [connecting, setConnecting] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvite = async () => {
            try {
                const res = await fetch(`/api/invitations/${token}`);
                if (res.ok) {
                    const data = await res.json();
                    setInviteData(data);
                    setForm({ name: data.name, photoUrl: "" });
                } else {
                    setError("This invitation link is invalid or has expired.");
                }
            } catch (err) {
                setError("Something went wrong. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchInvite();
    }, [token]);

    useEffect(() => {
        // Check for success redirect from Strava
        const { searchParams } = new URL(window.location.href);
        if (searchParams.get('success') === 'strava') {
            console.log("[Flow] Strava connected successfully");
            setConnecting(null);
            // Optionally show a toast or message
        }
    }, []);

    const handleStravaConnect = () => {
        if (connecting) return;
        setConnecting('strava');
        console.log(`[Flow] Redirecting to Strava Auth`);
        window.location.href = `/api/strava/auth?referenceId=${token}`;
    };

    const handleComplete = async () => {
        setSubmitting(true);
        try {
            const res = await fetch(`/api/invitations/${token}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    photoUrl: form.photoUrl,
                }),
            });
            if (res.ok) {
                router.push('/dashboard');
            } else {
                console.error("Failed to complete onboarding");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleNext = () => {
        console.log("[Flow] Moving to next step");
        setStep(s => s + 1);
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0e0e11] gap-6">
            <Loader />
            <p className="text-sm font-black uppercase tracking-[0.2em] text-indigo-500 opacity-60">Preparing your experience...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-[#0e0e11] text-center">
            <MotionCard className="max-w-md">
                <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/30 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <Smartphone className="text-rose-500" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Wait a second...</h1>
                <p className="text-gray-500 dark:text-gray-400">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-8 px-8 py-4 bg-gray-900 dark:bg-blue-600 text-white font-bold rounded-2xl transition-transform active:scale-95">
                    Try Again
                </button>
            </MotionCard>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-600 bg-white dark:bg-[#0e0e11] transition-colors duration-700">
            
            {/* Dots Background */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1] pointer-events-none z-0" 
                 style={{ backgroundImage: 'radial-gradient(#3b82f6 1.5px, transparent 0)', backgroundSize: '32px 32px' }} />
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-50/50 dark:from-blue-500/10 to-transparent blur-[120px] rounded-full pointer-events-none" />

            {/* Navigation / Progress */}
            <header className="fixed top-0 inset-x-0 p-8 z-[100] flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Zap className="text-white fill-current" size={16} />
                    </div>
                    <span className="font-black text-xl tracking-tight text-gray-900 dark:text-white">KINETIQ</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex gap-1.5 backdrop-blur-md bg-white/10 dark:bg-white/5 p-1.5 rounded-full border border-black/5 dark:border-white/5">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'w-8 bg-blue-600' : 'w-1.5 bg-gray-300 dark:bg-gray-800'}`} />
                        ))}
                    </div>
                </div>
            </header>

            <main className="w-full max-w-lg relative z-[50] pt-16">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <MotionCard key="step1">
                            <div className="space-y-8">
                                <div className="text-center">
                                    <motion.div 
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-2xl text-[11px] font-black uppercase tracking-widest mb-8"
                                    >
                                        <Sparkles size={14} className="animate-pulse" />
                                        Personal Invitation
                                    </motion.div>
                                    <h1 className="text-[40px] font-black tracking-tight text-gray-900 dark:text-white leading-[1.1] mb-6">
                                        Your coach is <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">waiting for you.</span>
                                    </h1>
                                    <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                                        Hey <strong>{inviteData?.name || 'Friend'}!</strong> I'm <strong>{inviteData?.coachName}</strong>. I've been looking forward to working with you on Kinetiq. Let's get you set up so we can start crushing your goals together!
                                    </p>
                                </div>

                                <div className="p-2 bg-gray-50/50 dark:bg-white/5 rounded-[32px] border border-gray-100 dark:border-white/5">
                                    <div className="flex items-center gap-5 p-5 bg-white dark:bg-[#1c1c21] rounded-[26px] shadow-sm border border-gray-100 dark:border-white/5">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 p-[3px] shadow-lg shadow-blue-500/20">
                                            <div className="w-full h-full rounded-[13px] bg-white dark:bg-[#0e0e11] flex items-center justify-center overflow-hidden">
                                                {inviteData?.coachAvatar ? (
                                                    <img src={inviteData.coachAvatar} alt={inviteData.coachName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="font-black text-2xl text-blue-600 dark:text-blue-400">{inviteData?.coachName?.[0]}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-lg font-black text-gray-900 dark:text-white">{inviteData?.coachName}</p>
                                            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                                                <ShieldCheck size={14} fill="currentColor" className="text-white dark:text-[#0e0e11]" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Verified Coach</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={handleNext}
                                    className="w-full py-6 rounded-[28px] bg-gray-900 dark:bg-blue-600 text-white font-black text-lg shadow-2xl shadow-gray-900/10 dark:shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group relative z-[60]">
                                    Let's Go
                                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </MotionCard>
                    )}

                    {step === 2 && (
                        <MotionCard key="step2">
                            <div className="space-y-8">
                                <div className="text-center">
                                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">One quick check.</h2>
                                    <p className="mt-3 text-gray-500 dark:text-gray-400 font-medium italic">"Is this the name your coach calls you?"</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex flex-col items-center gap-8">
                                        <div className="relative group">
                                            <motion.div 
                                                whileHover={{ scale: 1.05 }}
                                                className="w-32 h-32 rounded-[40px] bg-white dark:bg-[#1c1c21] border-2 border-dashed border-blue-200 dark:border-blue-500/30 p-2 transform rotate-3"
                                            >
                                                <div className="w-full h-full rounded-[32px] bg-gray-50 dark:bg-[#0e0e11] flex items-center justify-center overflow-hidden relative group-hover:bg-blue-50 dark:group-hover:bg-blue-950/20 transition-colors">
                                                    {form.photoUrl ? (
                                                        <img src={form.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="text-blue-200 dark:text-blue-500/30" size={48} />
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Camera size={24} className="text-white" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                            <div className="absolute -top-3 -right-3 w-10 h-10 bg-blue-600 text-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-white dark:border-[#0e0e11]">
                                                <Camera size={18} />
                                            </div>
                                        </div>

                                        <div className="w-full space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 ml-1">Preferred Name</label>
                                            <input 
                                                type="text" 
                                                value={form.name} 
                                                onChange={e => setForm({ ...form, name: e.target.value })}
                                                className="w-full py-5 px-8 bg-gray-50 dark:bg-[#1a1a20] border-2 border-transparent rounded-[24px] outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-[#1c1c21] transition-all font-bold text-xl text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
                                                placeholder="e.g. Alex" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button onClick={handleNext}
                                    className="w-full py-6 rounded-[28px] bg-gray-900 dark:bg-blue-600 text-white font-black text-lg shadow-2xl shadow-gray-900/10 dark:shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group relative z-[60]">
                                    Next Step
                                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </MotionCard>
                    )}

                    {step === 3 && (
                        <MotionCard key="step3" className="overflow-visible">
                            <div className="space-y-8">
                                <div className="text-center">
                                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">Connect your signals.</h2>
                                    <p className="mt-3 text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                        For now, we are integrating with **Strava** to track your heart rate and fitness metrics in real-time.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-5">
                                    {/* Apple Health - Coming Soon */}
                                    <div className="group relative flex items-center gap-5 p-6 bg-gray-50/50 dark:bg-white/5 border-2 border-transparent rounded-[35px] opacity-60 grayscale cursor-not-allowed overflow-hidden">
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-black text-[9px] font-black uppercase tracking-widest rounded-full z-10">
                                            Coming Soon
                                        </div>
                                        <div className="w-16 h-16 rounded-[22px] bg-white dark:bg-[#1c1c21] flex items-center justify-center shadow-sm">
                                            <Heart className="text-gray-300 dark:text-gray-600" size={30} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black text-gray-400 dark:text-gray-500 text-lg">Apple Health</p>
                                            <p className="text-xs text-gray-400/60 dark:text-gray-600/60 font-black uppercase tracking-widest">iPhone & Apple Watch</p>
                                        </div>
                                    </div>

                                    {/* Strava - Primary Connection */}
                                    <motion.button 
                                        whileHover={{ y: -4, scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleStravaConnect}
                                        disabled={!!connecting}
                                        className="group relative flex items-center gap-5 p-6 bg-orange-50/30 dark:bg-orange-500/5 border-2 border-orange-100 dark:border-orange-500/20 rounded-[35px] hover:border-orange-500 transition-all text-left z-[60] disabled:opacity-50"
                                    >
                                        <div className="w-16 h-16 rounded-[22px] bg-white dark:bg-[#1c1c21] flex items-center justify-center shadow-lg shadow-orange-200/50 dark:shadow-orange-900/20 text-orange-600 dark:text-orange-400">
                                            {connecting === 'strava' ? (
                                                <Loader2 className="animate-spin text-orange-500" size={30} />
                                            ) : (
                                                <Activity size={30} strokeWidth={3} />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black text-gray-900 dark:text-white text-lg">Connect Strava</p>
                                            <p className="text-xs text-orange-600/60 dark:text-orange-400/60 font-black uppercase tracking-widest">Sync Your Workouts</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#1a1a20] border border-orange-100 dark:border-white/5 flex items-center justify-center shadow-sm">
                                            <ChevronRight size={20} className="text-orange-400" />
                                        </div>
                                    </motion.button>
                                </div>

                                <div className="pt-4 space-y-6">
                                    <button onClick={handleComplete} disabled={submitting}
                                        className="w-full py-6 rounded-[28px] bg-blue-600 text-white font-black text-xl shadow-[0_20px_40px_-10px_rgba(37,99,235,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 relative z-[60]">
                                        {submitting ? "Almost there..." : "Finish Onboarding"}
                                        <CheckCircle2 size={24} />
                                    </button>
                                    <div className="px-8 flex items-start gap-3 opacity-40 hover:opacity-100 transition-opacity">
                                        <ShieldCheck size={16} className="mt-1 shrink-0 dark:text-blue-400" />
                                        <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-wider">
                                            Privacy first: Only the data relevant to your fitness goals will be shared with your coach.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </MotionCard>
                    )}
                </AnimatePresence>
            </main>

            <footer className="fixed bottom-0 inset-x-0 p-12 pointer-events-none opacity-20">
                <p className="text-center text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-gray-600">Powered by Kinetiq AI</p>
            </footer>
        </div>
    );
}
