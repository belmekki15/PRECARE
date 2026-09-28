"use client";

import Link from "next/link";

const RISK_PERCENT = 72;
const CIRCUMFERENCE = 2 * Math.PI * 88;

const BIOMARKERS = [
  {
    name: "Glycémie à jeun (HbA1c)",
    value: "7.2%",
    weight: "24.5%",
    trend: "up" as const,
    danger: true,
  },
  {
    name: "LDL Cholestérol",
    value: "1.8 g/L",
    weight: "18.2%",
    trend: "up" as const,
    danger: true,
  },
  {
    name: "Indice de Masse Corporelle",
    value: "31.4",
    weight: "12.1%",
    trend: "flat" as const,
    danger: false,
  },
  {
    name: "Protéine C Réactive",
    value: "4.8 mg/L",
    weight: "9.4%",
    trend: "up" as const,
    danger: true,
  },
];

export default function ResultsPage() {
  const dashOffset = CIRCUMFERENCE * (1 - RISK_PERCENT / 100);

  return (
    <main className="flex-grow max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-lg lg:py-2xl">
      {/* Header Section */}
      <div className="mb-2xl flex flex-col md:flex-row md:items-end justify-between gap-lg">
        <div>
          <span className="font-label-caps text-label-caps text-on-primary-container mb-xs block uppercase">
            Clinical Intelligence Unit
          </span>
          <h1 className="font-h1 text-h1 text-primary-container">
            Rapport d&apos;Analyse Prédictive
          </h1>
          <p className="text-secondary font-body-md text-body-md mt-xs">
            ID Patient: #PX-99284 • {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex gap-md">
          <button className="bg-secondary-container text-on-secondary-container px-lg py-sm font-label-caps text-label-caps flex items-center gap-xs border border-outline-variant hover:bg-slate-200 transition-colors rounded-lg cursor-pointer">
            <span className="material-symbols-outlined text-sm">print</span>
            Imprimer le rapport PDF
          </button>
          <Link
            href="/analyze"
            className="bg-primary-container text-on-primary px-lg py-sm font-label-caps text-label-caps flex items-center gap-xs hover:opacity-90 transition-opacity rounded-lg"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Nouvelle analyse
          </Link>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="w-full bg-error text-on-error py-md px-lg mb-2xl flex items-center gap-md rounded-lg">
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          warning
        </span>
        <p className="font-label-caps text-label-caps uppercase">
          Attention: Risque élevé identifié nécessitant une intervention
          prioritaire.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-gutter">
        {/* Main Score Card */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant p-lg shadow-sm rounded-xl">
          <div className="flex justify-between items-start mb-lg">
            <h2 className="font-h2 text-h2 text-primary-container">
              Score de Risque Global
            </h2>
            <div className="bg-error-container text-on-error-container px-md py-xs font-label-caps text-label-caps rounded-full border border-error/20">
              HIGH RISK
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2xl py-2xl">
            {/* Gauge */}
            <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 192 192">
                <circle
                  className="text-slate-100"
                  cx="96"
                  cy="96"
                  fill="transparent"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                />
                <circle
                  className="text-error"
                  cx="96"
                  cy="96"
                  fill="transparent"
                  r="88"
                  stroke="currentColor"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={dashOffset}
                  strokeWidth="12"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-data-display text-[48px] text-primary-container font-semibold">
                  {RISK_PERCENT}%
                </span>
                <span className="font-label-caps text-label-caps text-secondary">
                  PROBABILITÉ
                </span>
              </div>
            </div>

            <div className="flex-grow w-full">
              <div className="mb-lg">
                <div className="flex justify-between mb-xs">
                  <span className="font-label-caps text-label-caps text-secondary">
                    DISTRIBUTION DU RISQUE
                  </span>
                  <span className="font-label-caps text-label-caps text-secondary">
                    {RISK_PERCENT} / 100
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 overflow-hidden relative rounded-full">
                  <div className="absolute inset-0 linear-gauge-gradient opacity-20"></div>
                  <div
                    className="h-full bg-error relative z-10 rounded-full"
                    style={{ width: `${RISK_PERCENT}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-xs font-label-caps text-[10px] text-slate-400">
                  <span>BAS</span>
                  <span>MODÉRÉ</span>
                  <span>ÉLEVÉ</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div className="p-md bg-surface-container-low border border-outline-variant rounded-lg">
                  <span className="block font-label-caps text-[10px] text-secondary uppercase mb-xs">
                    Indice de Confiance
                  </span>
                  <span className="font-h3 text-h3">94.8%</span>
                </div>
                <div className="p-md bg-surface-container-low border border-outline-variant rounded-lg">
                  <span className="block font-label-caps text-[10px] text-secondary uppercase mb-xs">
                    Percentile Global
                  </span>
                  <span className="font-h3 text-h3">89th</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Model Info */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant p-lg flex flex-col justify-between shadow-sm rounded-xl">
          <div>
            <h3 className="font-h3 text-h3 text-primary-container mb-md flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary-container">
                memory
              </span>
              Paramètres IA
            </h3>
            <div className="space-y-md">
              <div>
                <span className="block font-label-caps text-[10px] text-secondary uppercase">
                  Modèle Utilisé
                </span>
                <span className="font-body-md text-body-md font-semibold">
                  Random Forest Classifier v4.2
                </span>
              </div>
              <div>
                <span className="block font-label-caps text-[10px] text-secondary uppercase">
                  Dernière Mise à Jour
                </span>
                <span className="font-body-md text-body-md">12/04/2026</span>
              </div>
              <div>
                <span className="block font-label-caps text-[10px] text-secondary uppercase">
                  Entrées de données
                </span>
                <span className="font-body-md text-body-md">
                  42 Biomarqueurs + Historique EHR
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2xl pt-md border-t border-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Visualisation algorithmique"
              className="w-full h-24 opacity-20 grayscale object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJXTi5GPt_tHZ-wUQavRvuQasI6pIli9fsxhnOL7KYMtHRXllnL3Tjonh5g4dphKzi3mjsjrA5na7iW0e5GfYLcpgmToENGZ3HHKRW7Lo9QvICNCzzkl8rM8NwdgmwcCquQa8WfdpPfRjJdXGa8NjlApm5gZ5kl_7K6Hk6uYYb_kNq8sXwIeIGG1A3MOuRcJRY589MfdPemeTRSErRmYabQKBzOHycpmeTzB1rJUw9XYRchf9QTdaqlfuGKC8cKj0sJBnBKXgu0AY"
            />
          </div>
        </div>

        {/* Biomarkers Table */}
        <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest border border-outline-variant shadow-sm overflow-hidden rounded-xl">
          <div className="p-lg border-b border-outline-variant">
            <h3 className="font-h3 text-h3 text-primary-container">
              Facteurs de Risque Identifiés
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-lg py-md font-label-caps text-label-caps text-secondary">
                    BIOMARQUEUR
                  </th>
                  <th className="px-lg py-md font-label-caps text-label-caps text-secondary">
                    VALEUR
                  </th>
                  <th className="px-lg py-md font-label-caps text-label-caps text-secondary">
                    POIDS (%)
                  </th>
                  <th className="px-lg py-md font-label-caps text-label-caps text-secondary">
                    TENDANCE
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {BIOMARKERS.map((b) => (
                  <tr
                    key={b.name}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-lg py-md font-body-md text-body-md font-medium">
                      {b.name}
                    </td>
                    <td
                      className={`px-lg py-md font-semibold ${
                        b.danger ? "text-error" : ""
                      }`}
                    >
                      {b.value}
                    </td>
                    <td className="px-lg py-md">{b.weight}</td>
                    <td
                      className={`px-lg py-md ${
                        b.trend === "up" ? "text-error" : "text-slate-400"
                      }`}
                    >
                      <span className="material-symbols-outlined">
                        {b.trend === "up" ? "trending_up" : "trending_flat"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
        <div className="col-span-12 lg:col-span-5 bg-surface-container-lowest border border-outline-variant p-lg shadow-sm rounded-xl">
          <h3 className="font-h3 text-h3 text-primary-container mb-lg">
            Recommandations de Surveillance
          </h3>
          <div className="space-y-md">
            <Recommendation
              priority="high"
              icon="emergency"
              title="Consultation Cardiologique Immédiate"
              description="Planifier un ECG de repos et une épreuve d'effort sous 48h."
            />
            <Recommendation
              priority="normal"
              icon="biotech"
              title="Bilan Lipidique Approfondi"
              description="Analyse des sous-fractions LDL et Lp(a) à jeun."
            />
            <Recommendation
              priority="normal"
              icon="monitor_heart"
              title="Auto-surveillance Tensionnelle"
              description="Mesure biquotidienne sur une période de 7 jours."
            />
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-2xl py-lg border-t border-outline-variant flex flex-col md:flex-row items-center justify-between gap-md">
        <div className="flex items-center gap-xs text-secondary opacity-70">
          <span className="material-symbols-outlined text-sm">info</span>
          <p className="font-body-sm text-body-sm italic">
            Cet outil est un support à la décision et ne remplace pas
            l&apos;expertise clinique.
          </p>
        </div>
        <div className="flex gap-md items-center">
          <span className="font-label-caps text-label-caps text-secondary uppercase">
            © 2026 PreCare AI. HIPAA Compliant.
          </span>
        </div>
      </div>
    </main>
  );
}

function Recommendation({
  priority,
  icon,
  title,
  description,
}: {
  priority: "high" | "normal";
  icon: string;
  title: string;
  description: string;
}) {
  const isHigh = priority === "high";
  return (
    <div
      className={`flex gap-md p-md border-l-4 ${
        isHigh
          ? "border-error bg-error-container/10"
          : "border-secondary-container bg-surface-container-low"
      } rounded-r-lg`}
    >
      <span
        className={`material-symbols-outlined ${
          isHigh ? "text-error" : "text-primary-container"
        }`}
      >
        {icon}
      </span>
      <div>
        <span className="block font-body-md text-body-md font-bold text-primary-container">
          {title}
        </span>
        <p className="font-body-sm text-body-sm text-secondary">{description}</p>
      </div>
    </div>
  );
}
