import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const variantClasses = {
      default: "bg-card text-foreground border-4 border-border",
      primary: "bg-primary text-primary-foreground border-4 border-border",
      secondary: "bg-secondary text-secondary-foreground border-4 border-border",
      ghost: "bg-transparent text-foreground hover:bg-muted",
    };

    const sizeClasses = {
      sm: "px-2 py-1 text-[8px]",
      md: "px-4 py-2 text-[10px]",
      lg: "px-6 py-3 text-xs",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "pixel-btn font-pixel uppercase tracking-wider transition-none",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PixelButton.displayName = "PixelButton";
