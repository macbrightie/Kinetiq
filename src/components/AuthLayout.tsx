"use client";

import React from "react";
import { Sparkles, Zap as Flash } from "lucide-react";

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
}

const features = [
    {
        title: "Predictive Intelligence",
        desc: "Stay ahead of the curve. Our AI analyzes subtle shifts in behavior to predict risk before it happens, keeping your roster full.",
        image: "/auth-hero.jpg"
    },
    {
        title: "Stop Client Churn",
        desc: "Protect your revenue. By identifying lagging engagement early, you can intervene and save clients before they quit.",
        video: "/Onbaording-assets/Stop churn.mp4"
    },
    {
        title: "Seamless Strava Sync",
        desc: "Automatic data collection. Sync heart rate and workout data directly for a complete, human-centric view of health.",
        video: "/Onbaording-assets/Strava.mp4"
    }
];

export function AuthLayout({ children, title = "Welcome to Kinetiq", subtitle = "Sign in to your coaching dashboard" }: AuthLayoutProps) {
    const [featureIndex, setFeatureIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setFeatureIndex((prev) => (prev + 1) % features.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex min-h-screen bg-black text-white font-sans overflow-hidden">
            {/* Left Section: Form */}
            <div className="w-full lg:w-[550px] flex flex-col justify-between p-8 lg:p-16 relative z-10 shrink-0">
                <div className="flex-1 flex flex-col justify-center max-w-[400px] mx-auto w-full">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="w-12 h-12 rounded-2xl bg-fuchsia-600 flex items-center justify-center mb-6 shadow-xl shadow-fuchsia-600/20 mx-auto lg:mx-0">
                            <Flash  size={24} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight mb-3">{title}</h1>
                        <p className="text-neutral-400 font-bold">{subtitle}</p>
                    </div>

                    <div className="space-y-6">
                        {children}
                    </div>
                </div>

                {/* Footer terms */}
                <div className="mt-12 text-center lg:text-left">
                    <p className="text-[12px] text-neutral-500 max-w-[400px] mx-auto lg:mx-0 leading-relaxed uppercase tracking-widest font-medium">
                        By continuing, I acknowledge the Privacy Policy and agree to the Terms of Service.
                    </p>
                </div>
            </div>

            {/* Right Section: Hero Image (Higgsfield inspired) */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden my-3 mr-3 rounded-[32px] bg-neutral-900">
                {features[featureIndex].video ? (
                    <video
                        key={features[featureIndex].video}
                        src={features[featureIndex].video}
                        className="absolute inset-0 w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{ filter: "brightness(0.8)" }}
                    />
                ) : (
                    <img 
                        key={features[featureIndex].image}
                        src={features[featureIndex].image || "/auth-hero.jpg"} 
                        className="absolute inset-0 w-full h-full object-cover" 
                        alt="Fitness Excellence"
                    />
                )}
                
                {/* Intensified bottom gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-16 left-16 right-16">
                    <div className="flex gap-2 mb-6">
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[12px] font-medium uppercase tracking-widest text-white/80">
                            Elite Coaching
                        </span>
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[12px] font-medium uppercase tracking-widest text-white/80">
                            AI Intelligence
                        </span>
                    </div>
                    
                    <h2 className="text-5xl font-black tracking-tighter mb-4 text-white uppercase italic">
                        {features[featureIndex].title}
                    </h2>
                    <p className="text-xl text-white/60 font-medium max-w-xl leading-relaxed">
                        {features[featureIndex].desc}
                    </p>

                    {/* Progress Bars */}
                    <div className="flex gap-2 mt-12 overflow-hidden">
                        {features.map((_, i) => (
                            <div key={i} className="h-1 flex-1 bg-white/10 rounded-full relative">
                                {i === featureIndex && (
                                    <div className="absolute inset-0 bg-white/60 rounded-full animate-[progress_5s_linear_infinite]" />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-3">
                        {features.map((f, i) => (
                            <p key={i} className={`text-[9px] font-medium uppercase tracking-widest transition-opacity duration-300 ${i === featureIndex ? 'text-white' : 'text-white/20'}`}>
                                {f.title}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Dots Pattern */}
                <div className="absolute top-0 right-0 p-8 opacity-20">
                    <div className="grid grid-cols-6 gap-2">
                        {Array.from({ length: 36 }).map((_, i) => (
                            <div key={i} className="w-1 h-1 bg-white rounded-full" />
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes progress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
            `}</style>
        </div>
    );
}
