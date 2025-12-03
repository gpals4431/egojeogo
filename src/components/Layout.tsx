import { ReactNode } from "react";
import { PixelNav } from "./PixelNav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background pixel-grid relative">
      {/* Scanline overlay */}
      <div className="fixed inset-0 scanlines pointer-events-none z-50" />
      
      <PixelNav />
      
      <main className="container mx-auto px-4 pb-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-border bg-primary text-primary-foreground py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[10px] mb-2">
            ═══════════════════════════════════
          </p>
          <p className="text-[10px]">
            ★ PIXEL HOME © 2024 ★
          </p>
          <p className="text-[8px] mt-2 text-primary-foreground/70">
            Made with ♥ and lots of pixels
          </p>
          <p className="text-[10px] mt-2">
            ═══════════════════════════════════
          </p>
        </div>
      </footer>
    </div>
  );
}
