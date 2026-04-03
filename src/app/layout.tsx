import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import './globals.css'

export const metadata = {
    title: 'Kinetiq | Client Health Intelligence',
    description: 'AI-powered motivation and risk detection for fitness coaches.',
    icons: {
        icon: [
            { url: "/Icon-logo-light.svg", media: "(prefers-color-scheme: dark)" },
            { url: "/Icon-logo-dark.svg", media: "(prefers-color-scheme: light)" }
        ],
        apple: "/Icon-logo-light.svg",
    }
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="bg-black text-white antialiased">
                <ClerkProvider
                    appearance={{
                        baseTheme: dark,
                        variables: {
                            colorPrimary: '#c026d3',
                            colorBackground: '#0C0C0C',
                        },
                        elements: {
                            formButtonPrimary: 'h-10 rounded-full text-sm font-medium',
                            formButtonSecondary: 'h-10 rounded-full text-sm font-medium',
                            formFieldInput: 'h-10 rounded-full px-4 border-border/50 bg-muted/30 focus:ring-2 focus:ring-primary/20',
                            socialButtonsBlockButton: 'h-10 rounded-full border-border/50 hover:bg-muted/30 transition-all',
                            card: 'rounded-[32px] border border-border/50 shadow-2xl',
                        }
                    }}
                >
                    {children}
                </ClerkProvider>
            </body>
        </html>
    )
}
