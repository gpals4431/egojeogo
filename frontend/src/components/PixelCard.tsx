import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PixelCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "primary" | "accent";
  titleAction?: ReactNode;
}

export function PixelCard({ title, children, className, variant = "default", titleAction }: PixelCardProps) {
  const variantClasses = {
    default: "bg-card",
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent text-accent-foreground",
  };

  return (
    <div className={cn("pixel-card p-4", variantClasses[variant], className)}>
      <div className="border-b-4 border-border pb-2 mb-4 flex items-center justify-between">
        <h3 className="text-sm uppercase tracking-wider">
          {">"} {title}
        </h3>
        {titleAction && <div>{titleAction}</div>}
      </div>
      <div className="text-[10px] leading-relaxed">
        {children}
      </div>
    </div>
  );
}
