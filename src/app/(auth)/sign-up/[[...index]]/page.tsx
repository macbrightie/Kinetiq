import { SignUp } from "@clerk/nextjs";
import { AuthLayout } from "@/components/AuthLayout";

export default function SignUpPage() {
    return (
        <AuthLayout 
            title="Join the Elite" 
            subtitle="Start monitoring and predicting client performance with Kinetiq AI"
        >
            <SignUp
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
                        footer: "hidden"
                    }
                }}
                routing="path"
                path="/sign-up"
                signInUrl="/sign-in"
                fallbackRedirectUrl="/onboarding"
            />
            
            <p className="text-center text-xs text-neutral-500 mt-8 font-medium">
                Already have an account? <a href="/sign-in" className="text-white hover:underline">Sign in</a>
            </p>
        </AuthLayout>
    );
}
