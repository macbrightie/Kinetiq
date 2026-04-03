import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { AuthLayout } from "@/components/AuthLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default async function LandingPage() {
    const { userId } = await auth();

    return (
        <AuthLayout 
            title="Predict client burnout before it happens" 
            subtitle="Join the inner circle of data-driven fitness coaches. Save money by reducing churn and preventing departures before they start."
        >
            <div className="space-y-8">
                {!userId ? (
                    <>
                        <SignUp
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "bg-transparent border-none shadow-none p-0 w-full",
                                    header: "hidden",
                                    headerTitle: "hidden",
                                    headerSubtitle: "hidden",
                                    socialButtonsBlockButton: "bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800 h-10 rounded-full transition-all shadow-xl shadow-fuchsia-600/5",
                                    socialButtonsBlockButtonText: "font-medium text-sm",
                                    formButtonPrimary: "bg-white text-black hover:bg-neutral-200 text-xs font-medium uppercase tracking-[0.2em] h-10 rounded-full transition-all normal-case shadow-2xl shadow-indigo-500/10",
                                    dividerLine: "bg-neutral-800",
                                    dividerText: "text-neutral-500 font-medium uppercase tracking-widest text-[12px]",
                                    formFieldLabel: "text-neutral-500 font-medium uppercase tracking-widest text-[9px] mb-2.5 ml-1",
                                    formFieldInput: "bg-neutral-900 border-neutral-800 text-white focus:ring-fuchsia-500 h-10 px-4 rounded-full transition-all",
                                    footer: "hidden",
                                    identityPreview: "bg-neutral-900 border-neutral-800",
                                    identityPreviewText: "text-white",
                                    formResendCodeLink: "text-fuchsia-400 hover:text-fuchsia-300",
                                }
                            }}
                            routing="path"
                            path="/"
                            signInUrl="/sign-in"
                        />

                        <div className="pt-8 border-t border-white/5 space-y-4">
                            <p className="text-center text-[12px] text-neutral-500 font-medium uppercase tracking-widest">
                                Already in the circle? 
                            </p>
                            <Link href="/sign-in" className="block">
                                <Button variant="outline" className="w-full h-10 rounded-full border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900 font-medium transition-all">
                                    Sign in to Dashboard
                                </Button>
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="text-center lg:text-left space-y-6">
                        <div className="p-8 rounded-[32px] bg-neutral-900 border border-white/5 shadow-2xl">
                            <h3 className="text-2xl font-medium mb-3">Welcome Back, Coach.</h3>
                            <p className="text-neutral-400 font-medium mb-8 leading-relaxed">
                                You are already signed in and authenticated. Your dashboard and predictive models are ready.
                            </p>
                            <Link href="/dashboard" className="block">
                                <Button className="w-full h-10 rounded-full bg-white text-black hover:bg-neutral-200 font-medium uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                                    Open Dashboard <ChevronRight size={16} />
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </AuthLayout>
    );
}
