import { SignIn } from "@clerk/nextjs";
import { AuthLayout } from "@/components/AuthLayout";

export default function SignInPage() {
    return (
        <AuthLayout 
            title="Elite Coaching Logic" 
            subtitle="Access your predictive client intelligence dashboard"
        >
            <SignIn
                appearance={{
                    elements: {
                        rootBox: "w-full",
                        card: "bg-transparent border-none shadow-none p-0 w-full",
                        header: "hidden",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800 h-12 rounded-2xl transition-all",
                        socialButtonsBlockButtonText: "font-medium",
                        formButtonPrimary: "bg-white text-black hover:bg-neutral-200 text-sm font-medium h-12 rounded-2xl transition-all normal-case",
                        dividerLine: "bg-neutral-800",
                        dividerText: "text-neutral-500 font-medium uppercase tracking-widest text-[12px]",
                        formFieldLabel: "text-neutral-500 font-medium uppercase tracking-widest text-[12px] mb-2",
                        formFieldInput: "bg-neutral-900 border-neutral-800 text-white focus:ring-fuchsia-500 h-10 px-4 rounded-xl",
                        footer: "hidden",
                        identityPreview: "bg-neutral-900 border-neutral-800",
                        identityPreviewText: "text-white",
                        formResendCodeLink: "text-fuchsia-400 hover:text-fuchsia-300",
                    }
                }}
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
            />
            
            <p className="text-center text-xs text-neutral-500 mt-8 font-medium">
                Don't have an account? <a href="/sign-up" className="text-white hover:underline">Get started for free</a>
            </p>
        </AuthLayout>
    );
}
