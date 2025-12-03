import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { path: "/", label: "홈", icon: "⌂" },
  { path: "/about", label: "내소개", icon: "☺" },
  { path: "/dev-notes", label: "개발노트", icon: "▣" },
  { path: "/japanese", label: "일본어공부", icon: "本" },
  { path: "/economy", label: "경제", icon: "▲" },
  { path: "/diet", label: "식단", icon: "◉" },
];

export function PixelNav() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-primary text-primary-foreground pixel-border mb-8">
      <div className="container mx-auto px-4">
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center justify-between py-4">
          <Link to="/" className="text-sm pixel-text-shadow hover:animate-pixel-bounce">
            ★ MY PIXEL HOME ★
          </Link>
          <ul className="flex gap-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "px-3 py-2 text-[10px] uppercase tracking-wider transition-none",
                    "hover:bg-secondary",
                    location.pathname === item.path && "bg-secondary pixel-inset"
                  )}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="text-xs pixel-text-shadow">
              ★ PIXEL HOME ★
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-lg"
              aria-label="메뉴 토글"
            >
              {mobileMenuOpen ? "✕" : "≡"}
            </button>
          </div>
          
          {mobileMenuOpen && (
            <ul className="pb-4 space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block px-3 py-2 text-[10px] uppercase tracking-wider",
                      "hover:bg-secondary",
                      location.pathname === item.path && "bg-secondary"
                    )}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
