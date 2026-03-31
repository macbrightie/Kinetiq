import * as React from "react"
import { cn } from "@/lib/utils"

const CreditCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
    )
)
CreditCard.displayName = "CreditCard"

const CreditCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
    )
)
CreditCardHeader.displayName = "CreditCardHeader"

const CreditCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3 ref={ref} className={cn("text-2xl font-medium leading-none tracking-tight", className)} {...props} />
    )
)
CreditCardTitle.displayName = "CreditCardTitle"

const CreditCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn("text-sm text-neutral-400", className)} {...props} />
    )
)
CreditCardDescription.displayName = "CreditCardDescription"

const CreditCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
    )
)
CreditCardContent.displayName = "CreditCardContent"

const CreditCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
    )
)
CreditCardFooter.displayName = "CreditCardFooter"

export { CreditCard, CreditCardHeader, CreditCardFooter, CreditCardTitle, CreditCardDescription, CreditCardContent }
