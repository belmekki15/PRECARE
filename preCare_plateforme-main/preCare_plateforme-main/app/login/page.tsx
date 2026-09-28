"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    // Simulation: aucune vérification — tout numéro est accepté.
    setTimeout(() => {
      router.push("/analyze");
    }, 800);
  };

  return (
    <main className="flex-1 flex items-center justify-center px-8 py-16 bg-gradient-to-br from-white via-surface to-surface-container-low">
      <div className="w-full max-w-[28rem]">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-brand-navy rounded-2xl flex items-center justify-center mb-4">
              <span
                className="material-symbols-outlined text-white text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
            </div>
            <h1 className="font-headline-md text-headline-md text-brand-navy text-center">
              Accès clinicien
            </h1>
            <p className="font-body-sm text-body-sm text-secondary text-center mt-2">
              Authentification par numéro d&apos;inscription à l&apos;Ordre des
              Médecins.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="order"
                className="font-label-caps text-label-caps text-on-surface-variant mb-2 block"
              >
                NUMÉRO D&apos;INSCRIPTION À L&apos;ORDRE
              </label>
              <input
                id="order"
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Ex: 75/12345"
                className="w-full border border-outline-variant focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10 outline-none rounded-lg font-body-md h-12 px-4 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="pwd"
                className="font-label-caps text-label-caps text-on-surface-variant mb-2 block"
              >
                MOT DE PASSE
              </label>
              <input
                id="pwd"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-outline-variant focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10 outline-none rounded-lg font-body-md h-12 px-4 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !orderNumber.trim()}
              className="w-full bg-brand-navy text-white py-3 font-headline-md rounded-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-3 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">
                    progress_activity
                  </span>
                  Vérification...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">login</span>
                  Se connecter
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-outline-variant">
            <div className="flex items-center gap-2 text-on-surface-variant mb-2">
              <span
                className="material-symbols-outlined text-base"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                lock
              </span>
              <span className="font-body-sm text-body-sm">
                Connexion sécurisée — Certifiée HIPAA &amp; RGPD
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-outline">
              Vos identifiants sont chiffrés et vérifiés via le registre
              national de l&apos;Ordre.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-secondary hover:text-brand-navy text-sm transition-colors inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
