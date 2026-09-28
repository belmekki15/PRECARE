"use client";

import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ModelType = "bio" | "angio";

type FormState = {
  // Shared / Bio
  gest_age_weeks: string;
  gest_age_days: string;
  batch: string;
  tube_type: string;
  gest_age_birth: string;
  birth_term_category: string;
  bmi: string;
  gravida: string;
  race: string;
  sex: string;
  aspirin: string;
  fertility_treatment: string;
  iugr: boolean;
  rupture_of_membranes: boolean;
  severity: string;
  onset: string;
  group: string;
  // Angio
  maternal_age: string;
  maternal_bmi: string;
  maternal_blood_type: string;
  maternal_ethnicity: string;
  previous_nulliparity: string;
  previous_miscarriage: string;
  previous_hypertensive_pregnancy: string;
  maximum_systolic_bp: string;
  maximum_diastolic_bp: string;
  mode_proteinuria: string;
  mean_uterine_pi: string;
  mean_umbilical_pi: string;
  hellp_diagnosis: string;
  iugr_diagnosis: string;
  chorioamnionitis_diagnosis: string;
  ga_week: string;
  ga_day: string;
  attempted_vaginal_delivery: string;
  mode_of_delivery: string;
  infant_gender: string;
  newborn_weight_z_score: string;
  apgar_score_1min: string;
  apgar_score_5min: string;
  nicu_transfer: string;
  placental_weight_z_score: string;
  umbilical_cord_diameter: string;
};

type Probability = { label: string; probability: number };

type PredictionResult = {
  predicted_label: "High" | "Low";
  predicted_class: number;
  clinical_alert: boolean;
  probabilities: Probability[];
  model_used?: string;
  map_mmhg?: number;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

const ENDPOINTS: Record<ModelType, string> = {
  bio:   `${API_BASE}/predict/bio/`,
  angio: `${API_BASE}/predict/angio/`,
};

const INITIAL: FormState = {
  gest_age_weeks: "",
  gest_age_days: "0",
  batch: "7",
  tube_type: "EDTA",
  gest_age_birth: "",
  birth_term_category: "TERM",
  bmi: "",
  gravida: "",
  race: "White",
  sex: "Female",
  aspirin: "False",
  fertility_treatment: "FALSE",
  iugr: false,
  rupture_of_membranes: false,
  severity: "0",
  onset: "0",
  group: "0",
  maternal_age: "33",
  maternal_bmi: "23.2",
  maternal_blood_type: "O",
  maternal_ethnicity: "Caucasian",
  previous_nulliparity: "Yes",
  previous_miscarriage: "No",
  previous_hypertensive_pregnancy: "No",
  maximum_systolic_bp: "118",
  maximum_diastolic_bp: "76",
  mode_proteinuria: "0",
  mean_uterine_pi: "0.9",
  mean_umbilical_pi: "0.85",
  hellp_diagnosis: "No",
  iugr_diagnosis: "No",
  chorioamnionitis_diagnosis: "No",
  ga_week: "39",
  ga_day: "2",
  attempted_vaginal_delivery: "Yes",
  mode_of_delivery: "Vaginal",
  infant_gender: "M",
  newborn_weight_z_score: "0.3",
  apgar_score_1min: "9",
  apgar_score_5min: "9",
  nicu_transfer: "No",
  placental_weight_z_score: "0.1",
  umbilical_cord_diameter: "1.3",
};

// ─── Payload builders ─────────────────────────────────────────────────────────

function buildBioPayload(f: FormState) {
  return {
    batch: parseInt(f.batch),
    gest_age_weeks: parseInt(f.gest_age_weeks),
    gest_age_days: parseInt(f.gest_age_days) || 0,
    gravida: parseInt(f.gravida) || 1,
    bmi: parseFloat(f.bmi) || 23.0,
    gest_age_birth: parseFloat(f.gest_age_birth) || 39.0,
    tube_type: f.tube_type,
    severity: parseInt(f.severity) || 0,
    onset: parseInt(f.onset) || 0,
    aspirin: f.aspirin,
    fertility_treatment: f.fertility_treatment,
    race: f.race,
    birth_term_category: f.birth_term_category,
    sex: f.sex,
    iugr: f.iugr ? "True" : "False",
    rupture_of_membranes: f.rupture_of_membranes ? "True" : "False",
    group: parseInt(f.group) || 0,
  };
}

function buildAngioPayload(f: FormState) {
  return {
    maternal_age: parseInt(f.maternal_age),
    maternal_bmi: parseFloat(f.maternal_bmi),
    maternal_blood_type: f.maternal_blood_type,
    maternal_ethnicity: f.maternal_ethnicity,
    previous_nulliparity: f.previous_nulliparity,
    previous_miscarriage: f.previous_miscarriage,
    previous_hypertensive_pregnancy: f.previous_hypertensive_pregnancy,
    maximum_systolic_bp: parseInt(f.maximum_systolic_bp),
    maximum_diastolic_bp: parseInt(f.maximum_diastolic_bp),
    mode_proteinuria: parseFloat(f.mode_proteinuria) || 0,
    hellp_diagnosis: f.hellp_diagnosis,
    iugr_diagnosis: f.iugr_diagnosis,
    chorioamnionitis_diagnosis: f.chorioamnionitis_diagnosis,
    ga_week: parseInt(f.ga_week),
    ga_day: parseInt(f.ga_day) || 0,
    attempted_vaginal_delivery: f.attempted_vaginal_delivery,
    mode_of_delivery: f.mode_of_delivery,
    infant_gender: f.infant_gender,
    newborn_weight_z_score: parseFloat(f.newborn_weight_z_score) || 0,
    apgar_score_1min: parseInt(f.apgar_score_1min) || 8,
    apgar_score_5min: parseInt(f.apgar_score_5min) || 9,
    nicu_transfer: f.nicu_transfer,
    placental_weight_z_score: parseFloat(f.placental_weight_z_score) || 0,
    umbilical_cord_diameter: parseFloat(f.umbilical_cord_diameter) || 1.3,
    mean_uterine_pi: parseFloat(f.mean_uterine_pi) || 1.0,
    mean_umbilical_pi: parseFloat(f.mean_umbilical_pi) || 0.9,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.05em] text-on-surface-variant mb-xs block">
      {children}
    </label>
  );
}

function InputField({
  id, label, type = "number", placeholder, value, onChange, hint, min, max, step, required,
}: {
  id: string; label: React.ReactNode; type?: string; placeholder?: string;
  value: string; onChange: (v: string) => void; hint?: string;
  min?: string; max?: string; step?: string; required?: boolean;
}) {
  return (
    <div>
      <Label>{label}{required && <span className="text-error"> *</span>}</Label>
      <input
        id={id} type={type} placeholder={placeholder} value={value}
        min={min} max={max} step={step}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-outline-variant focus:border-primary-container focus:ring-0 rounded-lg font-body-md h-12 bg-white px-3 outline-none"
      />
      {hint && <p className="text-xs text-on-surface-variant mt-1">{hint}</p>}
    </div>
  );
}

function SelectField({
  id, label, value, onChange, children,
}: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; children: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <select
        id={id} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full border border-outline-variant focus:border-primary-container focus:ring-0 rounded-lg font-body-md h-12 bg-white px-3 outline-none"
      >
        {children}
      </select>
    </div>
  );
}

function CheckTile({
  label, sublabel, checked, onChange,
}: {
  label: string; sublabel: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-3 p-3 border rounded cursor-pointer transition-all select-none
        ${checked ? "border-primary-container bg-[#f0f4fa]" : "border-outline-variant bg-white hover:border-primary-container hover:bg-surface-container-low"}`}
    >
      <div className={`w-5 h-5 flex-shrink-0 border-2 rounded flex items-center justify-center transition-all
        ${checked ? "bg-primary-container border-primary-container" : "border-outline-variant"}`}>
        {checked && (
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
            <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-on-surface">{label}</p>
        <p className="text-xs text-on-surface-variant">{sublabel}</p>
      </div>
    </div>
  );
}

function SectionToggle({
  title, isNew, open, onToggle, children,
}: {
  title: string; isNew?: boolean; open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <section>
      <div
        onClick={onToggle}
        className="flex items-center justify-between cursor-pointer select-none border-b border-outline-variant pb-xs mb-lg"
      >
        <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-primary-container flex items-center gap-2">
          {title}
          {isNew && (
            <span className="inline-flex items-center text-[10px] font-bold tracking-[0.06em] px-2 py-0.5 rounded-full bg-secondary-container text-primary-container uppercase">
              nouveau
            </span>
          )}
        </h3>
        <span className="material-symbols-outlined text-on-surface-variant transition-transform duration-300"
          style={{ transform: open ? "rotate(0deg)" : "rotate(180deg)" }}>
          expand_less
        </span>
      </div>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "2000px" : "0px" }}
      >
        {children}
      </div>
    </section>
  );
}

function ProbBar({ pct, color }: { pct: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 60);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div className="h-2 bg-surface-container rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

// ─── Model selector tiles ────────────────────────────────────────────────────

function ModelTile({
  active, icon, title, subtitle, onClick,
}: {
  active: boolean; icon: string; title: string; subtitle: string; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex-1 flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left cursor-pointer
        ${active
          ? "border-primary-container bg-[#f0f4fa] shadow-md"
          : "border-outline-variant bg-white hover:border-primary-container/60 hover:bg-surface-container-low"
        }`}
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors
        ${active ? "bg-primary-container text-white" : "bg-slate-100 text-primary-container group-hover:bg-secondary-container"}`}>
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          {icon}
        </span>
      </div>
      <div className="flex-1">
        <p className={`font-['Plus_Jakarta_Sans'] text-lg font-bold ${active ? "text-primary-container" : "text-on-surface"}`}>
          {title}
        </p>
        <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>
      </div>
      {active && (
        <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
          check_circle
        </span>
      )}
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AnalyzePage() {
  const [model, setModel] = useState<ModelType>("bio");
  const [form, setForm] = useState<FormState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Section open states
  const [sections, setSections] = useState({
    prelevement: true,
    maternal: true,
    traitements: true,
    bio_extra: true,
    profil: true,
    hemodynamique: true,
    diagnostics: true,
    accouchement: true,
    neonatal: true,
    placenta: true,
  });

  const toggleSection = (key: keyof typeof sections) =>
    setSections((s) => ({ ...s, [key]: !s[key] }));

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const switchModel = (m: ModelType) => {
    setModel(m);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (model === "bio") {
      const weeks = parseInt(form.gest_age_weeks);
      if (!form.gest_age_weeks || isNaN(weeks) || weeks < 10 || weeks > 42) {
        showToast("⚠ Veuillez saisir l'âge gestationnel (10–42 semaines)");
        return;
      }
    } else {
      if (!form.maternal_age || !form.maximum_systolic_bp || !form.maximum_diastolic_bp) {
        showToast("⚠ Âge maternel et tension artérielle requis");
        return;
      }
    }

    setLoading(true);
    setResult(null);
    setError(null);

    const payload = model === "bio" ? buildBioPayload(form) : buildAngioPayload(form);

    try {
      const res = await fetch(ENDPOINTS[model], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { detail?: string }).detail ?? `HTTP ${res.status}`);
      }
      const data: PredictionResult = await res.json();
      setResult(data);
    } catch (err) {
      const msg = String((err as Error).message).slice(0, 120);
      showToast("Erreur API : " + msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const isHigh = result?.predicted_label === "High";
  const probHigh = result?.probabilities.find((p) => p.label === "High")?.probability ?? 0;
  const probLow = result?.probabilities.find((p) => p.label === "Low")?.probability ?? 0;

  return (
    <>
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          vertical-align: middle;
        }
      `}</style>

      {/* ── Header ── */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] sticky top-0 z-50">
        <nav className="flex justify-between items-center h-16 px-8 max-w-[1440px] mx-auto w-full font-['Plus_Jakarta_Sans'] antialiased">
          <div className="text-xl font-bold tracking-tight text-primary-container flex items-center gap-2">
            <span className="material-symbols-outlined">biotech</span>
            PreCare AI
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Accueil", "Contact"].map((l) => (
              <a key={l} href="#" className="text-slate-500 hover:text-slate-700 transition-colors text-sm font-medium">{l}</a>
            ))}
            <a href="#" className="text-primary-container border-b-2 border-primary-container pb-1 font-semibold text-sm">Analyse</a>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-slate-500 cursor-pointer hover:bg-surface-container-low p-2 rounded-lg transition-all">notifications</span>
            <span className="material-symbols-outlined text-slate-500 cursor-pointer hover:bg-surface-container-low p-2 rounded-lg transition-all">settings</span>
          </div>
        </nav>
      </header>

      {/* ── Main ── */}
      <main className="max-w-[1440px] mx-auto px-8 py-xl">

        {/* Page header */}
        <div className="mb-lg">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[40px] font-bold leading-tight tracking-tight text-primary-container mb-xs">
            Évaluation Clinique du Risque
          </h1>
          <p className="font-body-md text-on-surface-variant max-w-3xl">
            Choisissez le type d&apos;évaluation puis renseignez les paramètres cliniques de la patiente.
            Les champs non remplis sont imputés automatiquement.
          </p>
        </div>

        {/* ── Model selector tiles ── */}
        <div className="mb-lg">
          <p className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.05em] text-on-surface-variant mb-sm">
            Type d&apos;évaluation
          </p>
          <div className="flex flex-col md:flex-row gap-md">
            <ModelTile
              active={model === "bio"}
              icon="biotech"
              title="Features Biologiques"
              subtitle="Évaluation à partir du prélèvement sanguin et du profil de grossesse"
              onClick={() => switchModel("bio")}
            />
            <ModelTile
              active={model === "angio"}
              icon="bloodtype"
              title="Features Angiogéniques"
              subtitle="Évaluation à partir des paramètres cliniques étendus et hémodynamiques"
              onClick={() => switchModel("angio")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">

          {/* ── Left : Form ── */}
          <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant p-lg shadow-sm space-y-lg">

            {/* ─────── BIO FIELDS ─────── */}
            {model === "bio" && (
              <>
                <SectionToggle title="Contexte du Prélèvement" open={sections.prelevement} onToggle={() => toggleSection("prelevement")}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                    <InputField
                      id="gest_age_weeks" label="Âge gestationnel (sem)" required
                      placeholder="Ex: 28" value={form.gest_age_weeks} onChange={(v) => update("gest_age_weeks", v)}
                      min="10" max="42" hint="Semaines au prélèvement (10–42)"
                    />
                    <InputField
                      id="gest_age_days" label="Jours supplémentaires"
                      placeholder="0" value={form.gest_age_days} onChange={(v) => update("gest_age_days", v)}
                      min="0" max="6"
                    />
                    <SelectField id="batch" label="Lot d'analyse (Batch)" value={form.batch} onChange={(v) => update("batch", v)}>
                      {[2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>Batch {n}</option>)}
                    </SelectField>
                    <SelectField id="tube_type" label="Type de tube" value={form.tube_type} onChange={(v) => update("tube_type", v)}>
                      <option value="EDTA">EDTA</option>
                      <option value="PAXgene DNA">PAXgene DNA</option>
                    </SelectField>
                    <InputField
                      id="gest_age_birth" label="Âge gestationnel à la naissance"
                      placeholder="Ex: 39" value={form.gest_age_birth} onChange={(v) => update("gest_age_birth", v)}
                      min="22" max="42" step="0.5"
                    />
                    <SelectField id="birth_term_category" label="Terme de naissance" value={form.birth_term_category} onChange={(v) => update("birth_term_category", v)}>
                      <option value="TERM">Terme</option>
                      <option value="PRETERM 34-37">Prématuré 34–37 sem</option>
                      <option value="PRETERM 32-34">Prématuré 32–34 sem</option>
                      <option value="PRETERM 28-32">Prématuré 28–32 sem</option>
                      <option value="PRETERM <28">Prématuré &lt;28 sem</option>
                    </SelectField>
                  </div>
                </SectionToggle>

                <SectionToggle title="Données Maternelles" open={sections.maternal} onToggle={() => toggleSection("maternal")}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                    <InputField id="bmi" label="IMC (BMI)" placeholder="kg/m²" value={form.bmi} onChange={(v) => update("bmi", v)} step="0.1" />
                    <InputField id="gravida" label="Nombre de grossesses (Gravida)" placeholder="Ex: 2" value={form.gravida} onChange={(v) => update("gravida", v)} min="1" max="10" />
                    <SelectField id="race" label="Ethnie" value={form.race} onChange={(v) => update("race", v)}>
                      <option value="White">Blanche (White)</option>
                      <option value="Black">Noire (Black)</option>
                      <option value="Asian">Asiatique (Asian)</option>
                      <option value="Other">Autre (Other)</option>
                    </SelectField>
                    <SelectField id="sex" label="Sexe du nourrisson" value={form.sex} onChange={(v) => update("sex", v)}>
                      <option value="Female">Féminin</option>
                      <option value="Male">Masculin</option>
                    </SelectField>
                  </div>
                </SectionToggle>

                <SectionToggle title="Traitements & Complications" open={sections.traitements} onToggle={() => toggleSection("traitements")}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-lg">
                    <SelectField id="aspirin" label="Traitement aspirine" value={form.aspirin} onChange={(v) => update("aspirin", v)}>
                      <option value="False">Non</option>
                      <option value="True">Oui</option>
                    </SelectField>
                    <SelectField id="fertility_treatment" label="Traitement fertilité" value={form.fertility_treatment} onChange={(v) => update("fertility_treatment", v)}>
                      <option value="FALSE">Aucun</option>
                      <option value="ICSI/IVF">ICSI / FIV</option>
                      <option value="IUI">IAC (IUI)</option>
                      <option value="KID">KID</option>
                      <option value="Ovulation induction">Induction de l&apos;ovulation</option>
                    </SelectField>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <CheckTile label="RCIU (IUGR)" sublabel="Retard de croissance intra-utérin" checked={form.iugr} onChange={(v) => update("iugr", v)} />
                    <CheckTile label="Rupture des membranes" sublabel="Rupture prématurée des membranes" checked={form.rupture_of_membranes} onChange={(v) => update("rupture_of_membranes", v)} />
                  </div>
                </SectionToggle>

                <SectionToggle title="Sévérité & Évolution Clinique" open={sections.bio_extra} onToggle={() => toggleSection("bio_extra")}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                    <SelectField id="severity" label="Sévérité" value={form.severity} onChange={(v) => update("severity", v)}>
                      <option value="0">Aucune / Légère</option>
                      <option value="1">Modérée</option>
                      <option value="2">Sévère</option>
                    </SelectField>
                    <SelectField id="onset" label="Apparition (Onset)" value={form.onset} onChange={(v) => update("onset", v)}>
                      <option value="0">Précoce (EOPE)</option>
                      <option value="1">Tardive (LOPE)</option>
                    </SelectField>
                    <SelectField id="group" label="Groupe d'étude" value={form.group} onChange={(v) => update("group", v)}>
                      <option value="0">Contrôle</option>
                      <option value="1">Cas</option>
                    </SelectField>
                  </div>
                </SectionToggle>
              </>
            )}

            {/* ─────── ANGIO FIELDS ─────── */}
            {model === "angio" && (
              <>
                <SectionToggle title="Profil Maternel" open={sections.profil} onToggle={() => toggleSection("profil")}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                    <InputField id="maternal_age" label="Âge maternel (ans)" required value={form.maternal_age} onChange={(v) => update("maternal_age", v)} min="15" max="55" />
                    <InputField id="maternal_bmi" label="IMC maternel" value={form.maternal_bmi} onChange={(v) => update("maternal_bmi", v)} step="0.1" />
                    <SelectField id="maternal_blood_type" label="Groupe sanguin" value={form.maternal_blood_type} onChange={(v) => update("maternal_blood_type", v)}>
                      <option value="O">O</option><option value="A">A</option>
                      <option value="B">B</option><option value="AB">AB</option>
                    </SelectField>
                    <SelectField id="maternal_ethnicity" label="Ethnie maternelle" value={form.maternal_ethnicity} onChange={(v) => update("maternal_ethnicity", v)}>
                      <option value="Caucasian">Caucasienne</option>
                      <option value="African">Africaine</option>
                      <option value="Asian">Asiatique</option>
                      <option value="Hispanic">Hispanique</option>
                      <option value="Other">Autre</option>
                    </SelectField>
                    <SelectField id="previous_nulliparity" label="Nulliparité antérieure" value={form.previous_nulliparity} onChange={(v) => update("previous_nulliparity", v)}>
                      <option value="Yes">Oui</option><option value="No">Non</option>
                    </SelectField>
                    <SelectField id="previous_miscarriage" label="Fausse couche antérieure" value={form.previous_miscarriage} onChange={(v) => update("previous_miscarriage", v)}>
                      <option value="No">Non</option><option value="Yes">Oui</option>
                    </SelectField>
                    <SelectField id="previous_hypertensive_pregnancy" label="ATCD grossesse hypertensive" value={form.previous_hypertensive_pregnancy} onChange={(v) => update("previous_hypertensive_pregnancy", v)}>
                      <option value="No">Non</option><option value="Yes">Oui</option>
                    </SelectField>
                  </div>
                </SectionToggle>

                <SectionToggle title="Paramètres Hémodynamiques" open={sections.hemodynamique} onToggle={() => toggleSection("hemodynamique")}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                    <InputField id="maximum_systolic_bp" label="TA systolique max (mmHg)" required value={form.maximum_systolic_bp} onChange={(v) => update("maximum_systolic_bp", v)} min="80" max="220" />
                    <InputField id="maximum_diastolic_bp" label="TA diastolique max (mmHg)" required value={form.maximum_diastolic_bp} onChange={(v) => update("maximum_diastolic_bp", v)} min="40" max="150" />
                    <InputField id="mode_proteinuria" label="Protéinurie (mode)" value={form.mode_proteinuria} onChange={(v) => update("mode_proteinuria", v)} min="0" step="0.1" hint="g/L" />
                    <InputField id="mean_uterine_pi" label="IP moyen utérin (Doppler)" value={form.mean_uterine_pi} onChange={(v) => update("mean_uterine_pi", v)} step="0.01" min="0" />
                    <InputField id="mean_umbilical_pi" label="IP moyen ombilical (Doppler)" value={form.mean_umbilical_pi} onChange={(v) => update("mean_umbilical_pi", v)} step="0.01" min="0" />
                  </div>
                </SectionToggle>

                <SectionToggle title="Diagnostics Associés" open={sections.diagnostics} onToggle={() => toggleSection("diagnostics")}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                    <SelectField id="hellp_diagnosis" label="Diagnostic HELLP" value={form.hellp_diagnosis} onChange={(v) => update("hellp_diagnosis", v)}>
                      <option value="No">Non</option><option value="Yes">Oui</option>
                    </SelectField>
                    <SelectField id="iugr_diagnosis" label="Diagnostic RCIU (IUGR)" value={form.iugr_diagnosis} onChange={(v) => update("iugr_diagnosis", v)}>
                      <option value="No">Non</option><option value="Yes">Oui</option>
                    </SelectField>
                    <SelectField id="chorioamnionitis_diagnosis" label="Diagnostic Chorioamnionite" value={form.chorioamnionitis_diagnosis} onChange={(v) => update("chorioamnionitis_diagnosis", v)}>
                      <option value="No">Non</option><option value="Yes">Oui</option>
                    </SelectField>
                  </div>
                </SectionToggle>

                <SectionToggle title="Accouchement & Issue" open={sections.accouchement} onToggle={() => toggleSection("accouchement")}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                    <InputField id="ga_week" label="AG à l'accouchement (sem)" value={form.ga_week} onChange={(v) => update("ga_week", v)} min="22" max="44" />
                    <InputField id="ga_day" label="Jours supplémentaires" value={form.ga_day} onChange={(v) => update("ga_day", v)} min="0" max="6" />
                    <SelectField id="attempted_vaginal_delivery" label="Tentative voie basse" value={form.attempted_vaginal_delivery} onChange={(v) => update("attempted_vaginal_delivery", v)}>
                      <option value="Yes">Oui</option><option value="No">Non</option>
                    </SelectField>
                    <SelectField id="mode_of_delivery" label="Mode d'accouchement" value={form.mode_of_delivery} onChange={(v) => update("mode_of_delivery", v)}>
                      <option value="Vaginal">Voie basse (Vaginal)</option>
                      <option value="C-section">Césarienne</option>
                      <option value="Instrumental">Instrumental</option>
                    </SelectField>
                  </div>
                </SectionToggle>

                <SectionToggle title="Données Néonatales" open={sections.neonatal} onToggle={() => toggleSection("neonatal")}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                    <SelectField id="infant_gender" label="Sexe du nouveau-né" value={form.infant_gender} onChange={(v) => update("infant_gender", v)}>
                      <option value="M">Masculin (M)</option>
                      <option value="F">Féminin (F)</option>
                    </SelectField>
                    <InputField id="newborn_weight_z_score" label="Z-score poids de naissance" value={form.newborn_weight_z_score} onChange={(v) => update("newborn_weight_z_score", v)} step="0.1" />
                    <InputField id="apgar_score_1min" label="Score Apgar 1 min" value={form.apgar_score_1min} onChange={(v) => update("apgar_score_1min", v)} min="0" max="10" />
                    <InputField id="apgar_score_5min" label="Score Apgar 5 min" value={form.apgar_score_5min} onChange={(v) => update("apgar_score_5min", v)} min="0" max="10" />
                    <SelectField id="nicu_transfer" label="Transfert en NICU" value={form.nicu_transfer} onChange={(v) => update("nicu_transfer", v)}>
                      <option value="No">Non</option><option value="Yes">Oui</option>
                    </SelectField>
                  </div>
                </SectionToggle>

                <SectionToggle title="Données Placentaires & Cordon" open={sections.placenta} onToggle={() => toggleSection("placenta")}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                    <InputField id="placental_weight_z_score" label="Z-score poids placenta" value={form.placental_weight_z_score} onChange={(v) => update("placental_weight_z_score", v)} step="0.1" />
                    <InputField id="umbilical_cord_diameter" label="Diamètre cordon ombilical (cm)" value={form.umbilical_cord_diameter} onChange={(v) => update("umbilical_cord_diameter", v)} step="0.01" min="0" />
                  </div>
                </SectionToggle>
              </>
            )}

          </div>

          {/* ── Right : Panel ── */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-lg">

            <div className="bg-surface-container-lowest border border-outline-variant p-lg shadow-sm">
              <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-primary-container mb-md">
                Analyse Prédictive
              </h3>
              <p className="font-body-sm text-on-surface-variant mb-lg">
                {model === "bio"
                  ? "Évaluation à partir des marqueurs biologiques et du profil de prélèvement de la patiente."
                  : "Évaluation à partir des paramètres cliniques étendus et hémodynamiques de la patiente."}
              </p>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-primary-container text-white py-md font-['Plus_Jakarta_Sans'] text-lg font-semibold rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-md cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Analyse en cours…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">analytics</span>
                    Lancer l&apos;analyse
                  </>
                )}
              </button>

              {/* Result card */}
              {result && (
                <div className="mt-lg transition-all duration-300">
                  <div className={`p-lg rounded-t-lg border border-b-0 ${isHigh ? "bg-error-container border-error/30" : "bg-success-container border-on-tertiary-container/30"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-['Inter'] text-xs font-semibold uppercase tracking-[0.05em] mb-1 ${isHigh ? "text-error" : "text-on-tertiary-container"}`}>
                          {isHigh ? "RISQUE ÉLEVÉ ⚠" : "RISQUE FAIBLE ✓"}
                        </p>
                        <p className={`font-['Plus_Jakarta_Sans'] text-3xl font-bold leading-tight ${isHigh ? "text-error" : "text-on-tertiary-container"}`}>
                          {isHigh ? "Prééclampsie" : "Non PE"}
                        </p>
                      </div>
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${isHigh ? "bg-error/10 animate-pulse" : "bg-on-tertiary-container/10"}`}>
                        {isHigh ? "🚨" : "✅"}
                      </div>
                    </div>
                  </div>

                  <div className={`p-lg border border-t-0 rounded-b-lg space-y-lg ${isHigh ? "border-error/20 bg-error-container/30" : "border-on-tertiary-container/20 bg-success-container/30"}`}>
                    <div>
                      <p className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.05em] text-on-surface-variant mb-sm">Probabilités</p>
                      <div className="space-y-sm">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-on-surface-variant">Risque Faible (Low)</span>
                            <span className="font-mono text-sm font-semibold text-on-success-container">{(probLow * 100).toFixed(1)}%</span>
                          </div>
                          <ProbBar pct={probLow * 100} color="bg-on-tertiary-container" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-on-surface-variant">Risque Élevé (High)</span>
                            <span className="font-mono text-sm font-semibold text-error">{(probHigh * 100).toFixed(1)}%</span>
                          </div>
                          <ProbBar pct={probHigh * 100} color="bg-error" />
                        </div>
                      </div>
                    </div>

                    <div className={`p-sm rounded-lg flex gap-sm items-start ${isHigh ? "bg-error-container border border-error/20" : "bg-success-container border border-on-tertiary-container/20"}`}>
                      <span className={`material-symbols-outlined text-base flex-shrink-0 mt-0.5 ${isHigh ? "text-error" : "text-on-tertiary-container"}`}>
                        {isHigh ? "warning" : "check_circle"}
                      </span>
                      <p className={`text-sm leading-relaxed ${isHigh ? "text-on-error-container" : "text-on-success-container"}`}>
                        {isHigh
                          ? "Profil compatible avec un risque de prééclampsie. Surveillance rapprochée recommandée : tension artérielle, protéinurie, croissance fœtale."
                          : "Profil à faible risque. Suivi obstétrical standard recommandé."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* HIPAA badge */}
              <div className="mt-lg pt-lg border-t border-outline-variant">
                <div className="flex items-center gap-md text-on-surface-variant">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                  <span className="font-body-sm">Certifié HIPAA &amp; GDPR</span>
                </div>
                <p className="font-body-sm text-outline mt-sm">Données chiffrées de bout en bout et traitées localement.</p>
              </div>
            </div>

            {/* Guide card */}
            <div className="bg-primary-container text-white p-lg rounded-lg">
              <h4 className="font-['Plus_Jakarta_Sans'] text-lg font-semibold mb-sm">Guide de Saisie</h4>
              <ul className="font-body-sm space-y-sm opacity-90">
                {(model === "bio"
                  ? [
                      ["info", "L'âge gestationnel est en semaines révolues au moment du prélèvement."],
                      ["info", "Les champs vides sont imputés par la valeur médiane."],
                      ["error", "Seul l'âge gestationnel * est obligatoire."],
                    ]
                  : [
                      ["info", "TA systolique et diastolique mesurent les pics maximums durant la grossesse."],
                      ["info", "Les indices Doppler utérin/ombilical sont des indicateurs forts du risque vasculaire."],
                      ["error", "Âge maternel et tensions * sont obligatoires."],
                    ]
                ).map(([icon, text]) => (
                  <li key={text} className="flex items-start gap-sm">
                    <span className="material-symbols-outlined text-sm pt-0.5 flex-shrink-0">{icon}</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-slate-50 w-full py-8 mt-xl border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-[1440px] mx-auto font-['Plus_Jakarta_Sans'] text-xs text-slate-600">
          <div className="mb-md md:mb-0">© 2024 PreCare AI. HIPAA Compliant.</div>
          <div className="flex gap-lg">
            {["Privacy Policy", "Terms of Service", "Security", "Status"].map((l) => (
              <a key={l} href="#" className="text-slate-500 hover:text-primary-container transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] max-w-sm px-4 py-3 bg-error-container border border-error rounded text-on-error-container text-sm font-['Inter'] shadow-lg animate-in slide-in-from-bottom-4">
          {toast}
        </div>
      )}
    </>
  );
}
