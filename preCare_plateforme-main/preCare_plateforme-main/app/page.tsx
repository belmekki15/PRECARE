import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-fixed/20 to-transparent opacity-50"></div>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-fixed rounded-full text-on-secondary-fixed-variant mb-6">
              <span className="material-symbols-outlined text-[18px]">
                neurology
              </span>
              <span className="font-label-md text-label-md">
                IA MÉDICALE AVANCÉE
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg text-brand-navy mb-8 leading-tight">
              Prédiction précoce de la{" "}
              <span className="text-on-tertiary-container">prééclampsie</span>{" "}
              par intelligence artificielle
            </h1>
            <p className="font-body-lg text-body-lg text-secondary mb-10 max-w-[36rem]">
              Une plateforme clinique de pointe utilisant le Deep Learning pour
              identifier les risques maternels avant l&apos;apparition des
              premiers symptômes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/login"
                className="bg-brand-navy text-white px-8 py-4 rounded-xl font-headline-md text-body-md shadow-lg shadow-brand-navy/20 hover:-translate-y-0.5 transition-all"
              >
                Démarrer l&apos;analyse
              </Link>
              <a
                href="#objectif"
                className="border-2 border-brand-navy text-brand-navy px-8 py-4 rounded-xl font-headline-md text-body-md hover:bg-slate-50 transition-all"
              >
                En savoir plus
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 glass-panel rounded-3xl p-4 overflow-hidden shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Clinicienne utilisant une tablette d'analyse médicale IA"
                className="rounded-2xl w-full h-[280px] sm:h-[400px] md:h-[500px] object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKRdmGbSbRlm9rT7osOGTZg63mCvN4Q7uLPWi5vDCjytQJnOs3JHiBVtCWmjUEzrpkNcNmnpjDho8WdsvkhOKi7SXiScZN7M22rNEiZ9NwBFQJ70XmnUfu4_qrbVu2ubwf8RD10XYe03iv8lZM0iLIPDmCwn6MJH8wdasi47Td_EXXn_EsW37Y6nXrSS1H1anYii94s-8_zGjGQbJA6Mtme39g_K0udYPuju3wP0lwS00FyIk0ii7EmVwQLe1XHpEZotx_0CMTxg0"
              />
            </div>
            <div className="hidden sm:block absolute -top-8 -left-8 lg:-top-12 lg:-left-12 w-32 h-32 lg:w-48 lg:h-48 z-20 animate-pulse">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Hélice ADN 3D"
                className="w-full h-full object-contain drop-shadow-2xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXVKB02kVHjm8Xb-iy3e7SaUaArM22CpM_WSiDrhRHa2iTcvImUQxGzew50tMzf5UsldJ4yce2v1ovaCBRt-YvuUSHYId3aqmCo2UV-q5g9iy7eGnn7ObzcmqQ5G2-YkZgeHlGiYPudUva_QZQFUDbP4DVrObvhMG4_YjTJ_U31RO8qTzPQocIsgwR7oc06fbT3wWX0pMXWiouL86jXbu6DVxxKr6kii5LUdvzxVlxMttRYIxZXB4IecBbchAt0EnPlFUMq7fL8Yg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-brand-navy mb-4">
              Pourquoi la prééclampsie ?
            </h2>
            <p className="font-body-md text-body-md text-secondary max-w-[42rem] mx-auto">
              Une urgence médicale qui nécessite une surveillance proactive et
              technologique.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary-fixed rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-brand-navy text-3xl">
                  monitoring
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-4">2-8%</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Des grossesses dans le monde sont touchées par cette
                complication grave.
              </p>
            </div>
            <div className="bg-white p-10 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-secondary-fixed rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-brand-navy text-3xl">
                  vital_signs
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-4">
                1ère Cause
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                De mortalité maternelle et néonatale par hypertension
                artérielle.
              </p>
            </div>
            <div className="bg-white p-10 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-tertiary-fixed rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-brand-navy text-3xl">
                  speed
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-4">Précoce</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                L&apos;IA permet une détection jusqu&apos;à 4 semaines avant les
                signes cliniques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Objectif */}
      <section id="objectif" className="py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 flex flex-col justify-center">
              <h2 className="font-headline-lg text-headline-lg text-brand-navy mb-6">
                Notre objectif clinique
              </h2>
              <p className="font-body-lg text-body-lg text-secondary mb-8">
                Fournir aux praticiens un outil d&apos;aide à la décision
                fiable, réduisant l&apos;incertitude et améliorant les résultats
                de santé pour la mère et l&apos;enfant.
              </p>
              <div className="space-y-4">
                {[
                  "Précision prédictive supérieure à 92%",
                  "Réduction des hospitalisations inutiles",
                  "Intégration transparente aux workflows EHR",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-on-tertiary-container mt-1">
                      check_circle
                    </span>
                    <p className="font-body-md text-body-md text-on-surface">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 gap-6">
              <div className="bg-surface-container-high rounded-3xl p-8 aspect-square flex flex-col justify-end overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Équipement de laboratoire"
                  className="absolute inset-0 w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwkh95DKpxbaI_eV9OH2I6AI5-QZ-7fw3nkk5akvKHYmp1wvVWKomYqHKm9lAtqIOpkzvDm_HnlcpXwsTCbskU-QAU45jOCuVpff0AtELpSsjtiuNPZMN6N3Kg0-Uwt-tRm0-dhbEjiA-M_nYwY_TSIMypJn85U-f2ZcEubJk2Sjvq16u_Ykym-nSfkpdTT5E_69VtF9Iyk5ADpKWeosHzl-enuBKQb3hzZf3qQFdZGaxwe1m4TkF7SU59tl_Wxj6fRhvI5qpi73w"
                />
                <div className="relative z-10 text-white">
                  <p className="font-headline-md text-headline-md">
                    Analyse Sanguine
                  </p>
                </div>
              </div>
              <div className="rounded-3xl p-8 aspect-square flex flex-col justify-end overflow-hidden relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Biomarqueurs sanguins"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/30 via-brand-navy/50 to-brand-navy/85"></div>
                <div className="relative z-10 text-white">
                  <span
                    className="material-symbols-outlined text-white text-5xl mb-3 block"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    biotech
                  </span>
                  <p className="font-headline-md text-headline-md text-white">
                    Biomarqueurs
                  </p>
                </div>
              </div>
              <div className="rounded-3xl p-8 aspect-square flex flex-col justify-end overflow-hidden relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Soins centrés sur la patiente"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=800&q=80"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/20 via-brand-navy/40 to-brand-navy/80"></div>
                <div className="relative z-10 text-white">
                  <span
                    className="material-symbols-outlined text-white text-5xl mb-3 block"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    group
                  </span>
                  <p className="font-headline-md text-headline-md text-white">
                    Soins Centrés Patient
                  </p>
                </div>
              </div>
              <div className="bg-surface-container rounded-3xl p-8 aspect-square flex flex-col justify-end overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Réseau de neurones"
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4w3GymyqjyfEc-y6sEU31-Q377CiepHUe91KcMzHz2qIHI3BvwDx6E6jYU9QcbWyyJt1iI0cQcLHW2CFnfBj5dK_pGaGYyh-9HHHnKJep7JENY-wCXvpGTQp26F7xwtarZp8w7s60RYYYCj6q_MIHF1ruHigEPupxtnnilhdpKaBB0nkySG7iGe6czCd4gVov4ELOdmW8he70-kDRglKUQg-aIV46q_A6yYMTbaHXc-jOifWMOmQoNSxIgOSeL2NjoJOC8KfeQdE"
                />
                <div className="relative z-10">
                  <p className="font-headline-md text-headline-md text-brand-navy">
                    Deep Learning
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-headline-lg text-headline-lg text-brand-navy mb-4">
              Comment ça marche
            </h2>
            <p className="font-body-md text-body-md text-secondary">
              Un processus rigoureux en trois étapes clés.
            </p>
          </div>
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-outline-variant -translate-y-1/2 z-0"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
              <div className="flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-white border-4 border-primary-fixed rounded-full flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-4xl text-brand-navy">
                    edit_note
                  </span>
                </div>
                <h4 className="font-headline-md text-headline-md mb-4 text-brand-navy">
                  1. Saisie
                </h4>
                <p className="font-body-sm text-body-sm text-secondary px-4">
                  Collecte des paramètres cliniques et biomarqueurs sériques du
                  premier trimestre.
                </p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-white border-4 border-on-tertiary-container rounded-full flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-4xl text-on-tertiary-container">
                    psychology
                  </span>
                </div>
                <h4 className="font-headline-md text-headline-md mb-4 text-brand-navy">
                  2. Modèle
                </h4>
                <p className="font-body-sm text-body-sm text-secondary px-4">
                  Traitement instantané par nos algorithmes de Machine Learning
                  haute précision.
                </p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-white border-4 border-error rounded-full flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-4xl text-error">
                    report_problem
                  </span>
                </div>
                <h4 className="font-headline-md text-headline-md mb-4 text-brand-navy">
                  3. Risque
                </h4>
                <p className="font-body-sm text-body-sm text-secondary px-4">
                  Génération d&apos;un score de risque détaillé et
                  recommandations d&apos;actions cliniques.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modes d'analyse */}
      <section id="modes" className="py-16 md:py-24 scroll-mt-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-brand-navy mb-4">
              Deux Modes d&apos;Évaluation
            </h2>
            <p className="font-body-md text-body-md text-secondary max-w-[42rem] mx-auto">
              Le clinicien choisit le type d&apos;évaluation selon les données disponibles ;
              la plateforme sélectionne automatiquement le modèle le plus adapté.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="glass-panel p-10 rounded-3xl border border-slate-200 flex flex-col hover:border-on-tertiary-container transition-colors">
              <div className="mb-6 p-4 bg-primary-fixed w-fit rounded-2xl">
                <span
                  className="material-symbols-outlined text-brand-navy text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  biotech
                </span>
              </div>
              <h5 className="font-headline-md text-headline-md mb-3 text-brand-navy">
                Évaluation Biologique
              </h5>
              <p className="font-body-sm text-body-sm text-secondary mb-6 flex-grow">
                S&apos;appuie sur le profil de prélèvement sanguin et les paramètres
                de grossesse de la patiente pour estimer le risque dès les premiers
                trimestres.
              </p>
              <div className="pt-6 border-t border-slate-100 flex items-center gap-2 text-on-tertiary-container">
                <span className="material-symbols-outlined">verified</span>
                <span className="text-sm font-semibold">Validation clinique</span>
              </div>
            </div>
            <div className="glass-panel p-10 rounded-3xl border border-slate-200 flex flex-col hover:border-on-tertiary-container transition-colors">
              <div className="mb-6 p-4 bg-secondary-fixed w-fit rounded-2xl">
                <span
                  className="material-symbols-outlined text-brand-navy text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  bloodtype
                </span>
              </div>
              <h5 className="font-headline-md text-headline-md mb-3 text-brand-navy">
                Évaluation Angiogénique
              </h5>
              <p className="font-body-sm text-body-sm text-secondary mb-6 flex-grow">
                Mobilise les paramètres cliniques étendus (hémodynamiques, Doppler,
                diagnostics associés) pour une évaluation fine du risque vasculaire.
              </p>
              <div className="pt-6 border-t border-slate-100 flex items-center gap-2 text-on-tertiary-container">
                <span className="material-symbols-outlined">verified</span>
                <span className="text-sm font-semibold">Validation clinique</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="py-16 md:py-24 bg-brand-navy overflow-hidden relative scroll-mt-20"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="font-headline-lg text-headline-lg text-white mb-6">
            Prêt à transformer le suivi prénatal ?
          </h2>
          <p className="font-body-lg text-body-lg text-slate-300 mb-10 max-w-[42rem] mx-auto">
            Rejoignez les centres hospitaliers universitaires qui utilisent déjà
            PreCare AI pour sauver des vies.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/login"
              className="bg-white text-brand-navy px-10 py-4 rounded-xl font-headline-md hover:bg-white/90 hover:shadow-xl transition-all"
            >
              Démarrer un essai clinique
            </Link>
            <button className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-xl font-headline-md hover:bg-white/20 transition-all cursor-pointer">
              Demander une démo
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
