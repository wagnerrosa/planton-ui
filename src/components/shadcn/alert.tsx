import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-none border px-4 py-3 text-sm flex flex-row items-start gap-x-3 [&>svg]:mt-0.5 [&>svg]:shrink-0 [&>svg]:text-current [&>svg~div]:flex-1",
  {
    variants: {
      variant: {
        default: "bg-card text-foreground",
        destructive:
          "bg-destructive-surface border-destructive-border text-destructive [&>svg]:text-destructive",
        success:
          "bg-success-surface border-success-border text-success [&>svg]:text-success",
        warning:
          "bg-warning-surface border-warning-border text-warning [&>svg]:text-warning",
        info:
          "bg-info-surface border-info-border text-info [&>svg]:text-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

const AlertBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-y-0.5", className)} {...props} />
))
AlertBody.displayName = "AlertBody"

export { Alert, AlertBody, AlertTitle, AlertDescription }
