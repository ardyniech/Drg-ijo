import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 select-none ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.96] active:translate-y-0.5 whitespace-nowrap shrink-0 max-w-full [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-manipulation",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 active:bg-primary/95 active:translate-y-0.5 active:shadow-xs",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 hover:shadow-md hover:-translate-y-0.5 active:bg-destructive/95 active:translate-y-0.5 active:shadow-xs",
        outline:
          "border border-border/80 bg-background/80 shadow-2xs hover:bg-accent/60 hover:border-border hover:text-accent-foreground hover:shadow-xs hover:-translate-y-0.5 active:bg-accent active:translate-y-0.5 active:shadow-none",
        secondary:
          "bg-secondary text-secondary-foreground shadow-2xs hover:bg-secondary/80 hover:shadow-xs hover:-translate-y-0.5 active:bg-secondary/90 active:translate-y-0.5 active:shadow-none",
        ghost:
          "hover:bg-accent/70 hover:text-accent-foreground active:bg-accent active:scale-[0.96]",
        link: "text-primary underline-offset-4 hover:underline active:opacity-80 active:scale-100 active:translate-y-0",
      },
      size: {
        default: "h-9 min-h-[36px] px-3.5 py-2 text-xs sm:text-sm",
        sm: "h-8 min-h-[32px] rounded-lg px-2.5 py-1 text-xs",
        lg: "h-11 min-h-[44px] px-6 py-2.5 text-sm font-semibold",
        icon: "h-9 w-9 min-h-[36px] min-w-[36px] rounded-xl p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        try {
          if (variant === "destructive") {
            navigator.vibrate([15, 30, 15]);
          } else {
            navigator.vibrate(8);
          }
        } catch {
          // ignore error on unsupported devices
        }
      }
      onClick?.(e);
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
