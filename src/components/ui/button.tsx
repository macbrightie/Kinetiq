import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default: "bg-foreground text-background hover:bg-foreground/85",
                destructive: "bg-destructive text-white hover:bg-destructive/90",
                outline: "border border-border bg-transparent text-foreground hover:bg-muted",
                secondary: "bg-muted text-foreground hover:bg-muted/70",
                ghost: "text-foreground hover:bg-muted",
                link: "text-foreground underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-8", // "use the large button, but fully rounded" (h-11 px-8 is Shadcn's lg)
                xs: "h-7 px-2 text-[12px]",
                "icon-xs": "h-7 w-7",
                sm: "h-9 px-3",
                "icon-sm": "h-9 w-9",
                lg: "h-12 px-10 text-base", // even larger for an explicit lg
                "icon-lg": "h-12 w-12",
                icon: "h-11 w-11", // matching default height
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
