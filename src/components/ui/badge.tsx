import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Icon } from "@iconify/react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border-transparent text-[12px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 [&>svg]:size-[12px] [&>svg]:shrink-0 pl-[12px] pr-[10px] py-[4px]",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-100 text-zinc-600 dark:bg-[#1C1C1E] dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-[#2A2A2D]",
        secondary:
          "bg-indigo-50 text-indigo-600 dark:bg-[rgba(99,102,241,0.15)] dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-[rgba(99,102,241,0.25)]",
        destructive:
          "bg-rose-50 text-rose-600 dark:bg-[rgba(235,59,90,0.15)] dark:text-[#EB3B5A] hover:bg-rose-100 dark:hover:bg-[rgba(235,59,90,0.25)]",
        success:
          "bg-emerald-50 text-emerald-600 dark:bg-[rgba(29,190,82,0.15)] dark:text-[#1DBE52] hover:bg-emerald-100 dark:hover:bg-[rgba(29,190,82,0.25)]",
        warning:
          "bg-amber-50 text-amber-600 dark:bg-[rgba(243,156,18,0.15)] dark:text-[#F39C12] hover:bg-amber-100 dark:hover:bg-[rgba(243,156,18,0.25)]",
        info:
          "bg-sky-50 text-sky-600 dark:bg-[rgba(0,145,213,0.15)] dark:text-[#0091D5] hover:bg-sky-100 dark:hover:bg-[rgba(0,145,213,0.25)]",
        purple:
          "bg-purple-50 text-purple-600 dark:bg-[rgba(134,55,243,0.15)] dark:text-[#8637F3] hover:bg-purple-100 dark:hover:bg-[rgba(134,55,243,0.25)]",
        orange:
          "bg-orange-50 text-orange-600 dark:bg-[rgba(237,120,59,0.15)] dark:text-[#ED783B] hover:bg-orange-100 dark:hover:bg-[rgba(237,120,59,0.25)]",
        outline: 
          "border border-border text-foreground dark:text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  variant?: "default" | "secondary" | "destructive" | "success" | "warning" | "info" | "purple" | "orange" | "outline" | null
  showClose?: boolean
}

function Badge({ className, variant, showClose = true, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {showClose && <Icon icon="solar:close-circle-bold" width="12" height="12" className="mr-0.5 opacity-60 hover:opacity-100 cursor-pointer transition-opacity shrink-0" />}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
