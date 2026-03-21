import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-black px-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
                    <p className="text-neutral-400">Join Kinetiq and start monitoring your clients.</p>
                </div>
                <SignUp
                    appearance={{
                        elements: {
                            rootBox: "w-full",
                            card: "bg-neutral-900 border border-neutral-800 shadow-2xl",
                            headerTitle: "hidden",
                            headerSubtitle: "hidden",
                            socialButtonsBlockButton: "bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700",
                            formButtonPrimary: "bg-fuchsia-600 hover:bg-fuchsia-700 text-sm normal-case",
                            dividerLine: "bg-neutral-800",
                            dividerText: "text-neutral-500",
                            formFieldLabel: "text-neutral-400",
                            formFieldInput: "bg-neutral-800 border-neutral-700 text-white focus:ring-fuchsia-500",
                            footer: "hidden"
                        }
                    }}
                    routing="path"
                    path="/sign-up"
                    signInUrl="/sign-in"
                    fallbackRedirectUrl="/onboarding"
                />
            </div>
        </div>
    );
}
