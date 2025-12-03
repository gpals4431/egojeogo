import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PixelCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "primary" | "accent";
}

export function PixelCard({ title, children, className, variant = "default" }: PixelCardProps) {
  const variantClasses = {
    default: "bg-card",
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent text-accent-foreground",
  };

  return (
    <div className={cn("pixel-card p-4", variantClasses[variant], className)}>
      <div className="border-b-4 border-border pb-2 mb-4">
        <h3 className="text-xs uppercase tracking-wider pixel-text-shadow">
          {">"} {title}
        </h3>
      </div>
      <div className="text-[10px] leading-relaxed">
        {children}
      </div>
    </div>
  );
}
