import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Activity, Shield, Zap, ArrowRight } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            {/* Navigation */}
            <nav className="flex items-center justify-between px-6 py-4 glass sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-fuchsia-600 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Kinetiq</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/sign-in">
 <Button variant="ghost" className="text-neutral-400 hover:text-white">Sign In</Button>
                    </Link>
                    <Link href="/sign-up">
 <Button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white">Start Free Trial</Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1">
                <section className="relative pt-20 pb-32 overflow-hidden">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-fuchsia-600/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full" />

                    <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs font-medium mb-8">
                            <Zap className="w-3 h-3" />
                            <span>Next-Gen Client Intelligence</span>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
                            Predict Client <span className="bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">Burnout</span> Before It Happens.
                        </h1>

                        <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                            Kinetiq monitors engagement, adherence, and progress signals to alert fitness coaches when clients are at risk of dropping off.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/sign-up">
 <Button size="lg" className="h-14 px-8 text-lg bg-fuchsia-600 hover:bg-fuchsia-700 text-white gap-2">
                                    Get Started for Free <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/dashboard">
 <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-neutral-800 bg-neutral-900/50 text-white hover:bg-neutral-800">
                                    View Demo
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Preview */}
                <section className="py-24 border-t border-neutral-800 bg-neutral-900/20">
                    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                        <FeatureCard
                            icon={<Activity className="text-fuchsia-500" />}
                            title="Behavior Analysis"
                            description="Track workout adherence and engagement patterns automatically."
                        />
                        <FeatureCard
                            icon={<Shield className="text-cyan-400" />}
                            title="Risk Detection"
                            description="AI-driven signals identify clients losing motivation in real-time."
                        />
                        <FeatureCard
                            icon={<Zap className="text-yellow-400" />}
                            title="Instant Alerts"
                            description="Get notified immediately when a client passes a critical risk threshold."
                        />
                    </div>
                </section>
            </main>

            <footer className="py-12 border-t border-neutral-900 text-center text-neutral-500 text-sm">
                <p>© 2026 Kinetiq Platform. Built for Elite Coaches.</p>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-8 rounded-2xl glass border-neutral-800/50 hover:border-fuchsia-500/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
            <p className="text-neutral-400 leading-relaxed">{description}</p>
        </div>
    );
}
