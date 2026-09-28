export default function Footer() {
  return (
    <footer className="bg-slate-50 w-full py-12 border-t border-slate-200">
      <div className="flex flex-col items-center justify-center gap-6 px-4 sm:px-8 text-center max-w-[1440px] mx-auto">
        <div className="text-brand-navy font-bold text-xl tracking-tighter mb-4">
          PreCare AI
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-xs uppercase tracking-widest text-slate-500">
          <a className="hover:text-brand-cyan transition-colors" href="#">
            Medical Disclaimer
          </a>
          <a className="hover:text-brand-cyan transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="hover:text-brand-cyan transition-colors" href="#">
            Institutional Partners
          </a>
        </div>
        <p className="text-xs uppercase tracking-widest text-slate-400 opacity-80">
          © 2026 PreCare AI. Academic Research Project.
        </p>
      </div>
    </footer>
  );
}
