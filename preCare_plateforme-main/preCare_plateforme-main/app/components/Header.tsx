"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/#modes", label: "Modes" },
  { href: "/analyze", label: "Tester" },
  { href: "/#contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname.startsWith(href);
  };

  const close = () => setOpen(false);

  return (
    <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200/60 shadow-[0_8px_30px_rgb(0,26,51,0.04)]">
      <div className="flex justify-between items-center w-full px-4 sm:px-8 h-16 max-w-[1440px] mx-auto">
        <Link
          href="/"
          onClick={close}
          className="text-xl font-bold tracking-tighter text-brand-navy font-headline-md"
        >
          PreCare AI
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-medium text-sm tracking-tight">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "text-brand-navy font-semibold border-b-2 border-brand-navy pb-1"
                    : "text-slate-600 hover:text-brand-navy transition-colors"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden sm:inline-flex bg-brand-navy text-white px-4 sm:px-6 py-2 rounded-lg font-medium text-sm active:scale-95 duration-200 ease-in-out hover:opacity-90 transition-all"
          >
            Connexion
          </Link>

          <button
            type="button"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">
              {open ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="flex flex-col px-4 py-4 gap-1 max-w-[1440px] mx-auto">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className={
                    "px-4 py-3 rounded-lg font-medium text-sm transition-colors " +
                    (active
                      ? "bg-brand-navy/10 text-brand-navy"
                      : "text-slate-700 hover:bg-slate-100")
                  }
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/login"
              onClick={close}
              className="mt-2 text-center bg-brand-navy text-white px-4 py-3 rounded-lg font-medium text-sm hover:opacity-90 transition-all"
            >
              Connexion
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
