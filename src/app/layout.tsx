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
                        }
                    }}
                >
                    {children}
                </ClerkProvider>
            </body>
        </html>
    )
}
