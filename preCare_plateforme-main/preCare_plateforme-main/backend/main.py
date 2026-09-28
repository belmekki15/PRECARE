import pickle
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

# ─────────────────────────────────────────────────────────────────────────────
#  API — Détection du Risque de Prééclampsie
#  Deux modèles :
#    • /predict/bio/    → Random Forest sur features biologiques (17)
#    • /predict/angio/  → Random Forest sur features angiogéniques (27)
#    • /predict/        → Alias de /predict/angio/ (rétro-compatibilité)
# ─────────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Preeclampsia Risk Detection API",
    description="Prédit le niveau de risque de prééclampsie (High / Low).",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Chargement des artefacts (Angio) ─────────────────────────────────────────

with open("preprocessors/num_imputer.pkl", "rb") as f:
    num_imputer = pickle.load(f)

with open("preprocessors/cat_imputer.pkl", "rb") as f:
    cat_imputer = pickle.load(f)

with open("preprocessors/scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

with open("preprocessors/label_encoders.pkl", "rb") as f:
    label_encoders = pickle.load(f)

with open("preprocessors/target_encoder.pkl", "rb") as f:
    target_encoder = pickle.load(f)

with open("preprocessors/feature_names.pkl", "rb") as f:
    feature_names = pickle.load(f)

with open("models/model.pkl", "rb") as f:
    model_angio = pickle.load(f)

# ─── Chargement du modèle Bio ─────────────────────────────────────────────────

with open("models/rf_dataset1.pkl", "rb") as f:
    bio_bundle = pickle.load(f)

model_bio          = bio_bundle["model"]
bio_feature_names  = bio_bundle["feature_names"]
bio_label_encoder  = bio_bundle["label_encoder"]

# ─── Encodages manuels pour le modèle Bio ─────────────────────────────────────
# NB: les valeurs sont déduites par ordre alphabétique (ordre par défaut de
# sklearn.LabelEncoder). À valider avec le data scientist si performance étrange.

BIO_ENCODINGS = {
    "Tube_type": {"EDTA": 0, "PAXgene DNA": 1},
    "Aspirin":   {"False": 0, "True": 1, "FALSE": 0, "TRUE": 1, False: 0, True: 1},
    "Fertility_treatment": {
        "FALSE": 0, "ICSI/IVF": 1, "IUI": 2, "KID": 3, "Ovulation induction": 4,
    },
    "Race": {"Asian": 0, "Black": 1, "Other": 2, "White": 3},
    "Birth_term_category": {
        "PRETERM <28": 0, "PRETERM 28-32": 1,
        "PRETERM 32-34": 2, "PRETERM 34-37": 3, "TERM": 4,
    },
    "Sex":   {"Female": 0, "Male": 1, "F": 0, "M": 1},
    "IUGR":  {"False": 0, "True": 1, "FALSE": 0, "TRUE": 1, False: 0, True: 1},
    "Rupture_of_membranes": {
        "False": 0, "True": 1, "FALSE": 0, "TRUE": 1, False: 0, True: 1,
    },
}


def encode_bio(col: str, value):
    """Encode une valeur catégorielle pour le modèle Bio. Retourne 0 si inconnu."""
    if col not in BIO_ENCODINGS:
        return value
    mapping = BIO_ENCODINGS[col]
    if value in mapping:
        return mapping[value]
    return 0  # fallback

# ─── Schémas d'entrée ─────────────────────────────────────────────────────────

class BioInput(BaseModel):
    """Entrée pour le modèle biologique (17 features)."""
    batch:                  int           = 7
    gest_age_weeks:         int
    gest_age_days:          int           = 0
    gravida:                Optional[int] = 1
    bmi:                    Optional[float] = 23.0
    gest_age_birth:         Optional[float] = 39.0
    tube_type:              str           = "EDTA"
    severity:               Optional[int] = 0   # 0=None/Mild, 1=Moderate, 2=Severe
    onset:                  Optional[int] = 0   # 0=Early (EOPE), 1=Late (LOPE)
    aspirin:                str           = "False"
    fertility_treatment:    str           = "FALSE"
    race:                   str           = "White"
    birth_term_category:    str           = "TERM"
    sex:                    str           = "Female"
    iugr:                   str           = "False"
    rupture_of_membranes:   str           = "False"
    group:                  Optional[int] = 0   # importance ≈ 0, sans impact


class AngioInput(BaseModel):
    """Entrée pour le modèle angiogénique (27 features cliniques étendues)."""
    maternal_age:                    float
    maternal_bmi:                    float
    maternal_ethnicity:              Optional[str] = "Caucasian"
    maternal_blood_type:             Optional[str] = "O"
    previous_nulliparity:            Optional[str] = "No"
    previous_miscarriage:            Optional[str] = "No"
    previous_hypertensive_pregnancy: Optional[str] = "No"
    maximum_systolic_bp:             float
    maximum_diastolic_bp:            float
    mode_proteinuria:                Optional[int]   = 0
    hellp_diagnosis:                 Optional[str]   = "No"
    iugr_diagnosis:                  Optional[str]   = "No"
    chorioamnionitis_diagnosis:      Optional[str]   = "No"
    ga_week:                         Optional[float] = 39.0
    ga_day:                          Optional[float] = 0.0
    attempted_vaginal_delivery:      Optional[str]   = "No"
    mode_of_delivery:                Optional[str]   = "C-Section"
    infant_gender:                   Optional[str]   = "F"
    newborn_weight_z_score:          Optional[float] = 0.0
    apgar_score_1min:                Optional[float] = 8.0
    apgar_score_5min:                Optional[float] = 9.0
    nicu_transfer:                   Optional[str]   = "No"
    placental_weight_z_score:        Optional[float] = 0.0
    umbilical_cord_diameter:         Optional[float] = 1.3
    mean_uterine_pi:                 Optional[float] = 1.0
    mean_umbilical_pi:               Optional[float] = 0.9


# ─── Préprocessing ────────────────────────────────────────────────────────────

def preprocess_bio(raw: BioInput) -> np.ndarray:
    """Construit le vecteur de features pour le modèle Bio (17 colonnes, numériques)."""
    row = {
        "Batch":                int(raw.batch),
        "Gest_age_weeks":       int(raw.gest_age_weeks),
        "Gest_age_days":        int(raw.gest_age_days),
        "Gravida":              int(raw.gravida or 1),
        "BMI":                  float(raw.bmi or 23.0),
        "Gest_age_birth":       float(raw.gest_age_birth or 39.0),
        "Tube_type":            encode_bio("Tube_type", raw.tube_type),
        "Severity":             int(raw.severity or 0),
        "Onset":                int(raw.onset or 0),
        "Aspirin":              encode_bio("Aspirin", raw.aspirin),
        "Fertility_treatment":  encode_bio("Fertility_treatment", raw.fertility_treatment),
        "Race":                 encode_bio("Race", raw.race),
        "Birth_term_category":  encode_bio("Birth_term_category", raw.birth_term_category),
        "Sex":                  encode_bio("Sex", raw.sex),
        "IUGR":                 encode_bio("IUGR", raw.iugr),
        "Rupture_of_membranes": encode_bio("Rupture_of_membranes", raw.rupture_of_membranes),
        "Group":                int(raw.group or 0),
    }
    df = pd.DataFrame([row])
    # Réordonner selon ce que le modèle attend
    return df[bio_feature_names].values


def preprocess_angio(raw: AngioInput) -> np.ndarray:
    """Reproduit le pipeline angio (imputation → encodage → standardisation)."""
    row = {
        "maternal age":                    raw.maternal_age,
        "maternal bmi":                    raw.maternal_bmi,
        "maternal ethnicity":              raw.maternal_ethnicity,
        "maternal blood type":             raw.maternal_blood_type,
        "previous nulliparity":            raw.previous_nulliparity,
        "previous miscarriage":            raw.previous_miscarriage,
        "previous hypertensive pregnancy": raw.previous_hypertensive_pregnancy,
        "maximum systolic bp":             raw.maximum_systolic_bp,
        "maximum diastolic bp":            raw.maximum_diastolic_bp,
        "mode proteinuria":                raw.mode_proteinuria,
        "hellp diagnosis":                 raw.hellp_diagnosis,
        "iugr diagnosis":                  raw.iugr_diagnosis,
        "chorioamnionitis diagnosis":      raw.chorioamnionitis_diagnosis,
        "ga (week)":                       raw.ga_week,
        "ga (day)":                        raw.ga_day,
        "attempted vaginal delivery":      raw.attempted_vaginal_delivery,
        "mode of delivery":                raw.mode_of_delivery,
        "infant gender":                   raw.infant_gender,
        "newborn weight z-score":          raw.newborn_weight_z_score,
        "apgar score (1 min)":             raw.apgar_score_1min,
        "apgar score (5 min)":             raw.apgar_score_5min,
        "nicu transfer":                   raw.nicu_transfer,
        "placental weight z-score":        raw.placental_weight_z_score,
        "umbilical cord diameter":         raw.umbilical_cord_diameter,
        "mean uterine pi":                 raw.mean_uterine_pi,
        "mean umbilical pi":               raw.mean_umbilical_pi,
    }
    data = pd.DataFrame([row])
    data["MAP"] = (data["maximum systolic bp"] + 2 * data["maximum diastolic bp"]) / 3

    num_cols = list(num_imputer.feature_names_in_)
    cat_cols = list(cat_imputer.feature_names_in_)

    for col in num_cols:
        if col not in data.columns:
            data[col] = float("nan")
    for col in cat_cols:
        if col not in data.columns:
            data[col] = "nan"

    X_num = pd.DataFrame(num_imputer.transform(data[num_cols]), columns=num_cols)
    X_cat = pd.DataFrame(cat_imputer.transform(data[cat_cols].astype(str)), columns=cat_cols)
    for col in cat_cols:
        enc   = label_encoders[col]
        known = set(enc.classes_)
        X_cat[col] = X_cat[col].apply(lambda v: v if v in known else enc.classes_[0])
        X_cat[col] = enc.transform(X_cat[col])

    X_num_scaled = pd.DataFrame(scaler.transform(X_num), columns=num_cols)
    X_all = pd.concat([X_num_scaled, X_cat.reset_index(drop=True)], axis=1)
    return X_all[feature_names].values


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/", summary="Santé de l'API")
def root():
    return {
        "status": "ok",
        "message": "Preeclampsia Risk Detection API v2.0 opérationnelle",
        "endpoints": ["/predict/bio/", "/predict/angio/", "/predict/"],
    }


def _format_response(prediction, proba, encoder, model_name: str):
    """Met en forme la réponse pour les deux modèles."""
    predicted_idx   = int(prediction[0])
    predicted_label = encoder.inverse_transform([predicted_idx])[0]

    probabilities = [
        {"label": encoder.inverse_transform([i])[0], "probability": round(float(p), 6)}
        for i, p in enumerate(proba)
    ]
    probabilities.sort(key=lambda x: x["probability"], reverse=True)

    return {
        "predicted_class": predicted_idx,
        "predicted_label": predicted_label,
        "clinical_alert":  predicted_label == "High",
        "probabilities":   probabilities,
        "model_used":      model_name,
    }


@app.post("/predict/bio/", summary="Prédiction sur features biologiques")
def predict_bio(patient: BioInput):
    try:
        X = preprocess_bio(patient)
    except Exception as e:
        raise HTTPException(500, f"Erreur de prétraitement bio : {e}")

    try:
        pred  = model_bio.predict(X)
        proba = model_bio.predict_proba(X)[0]
    except Exception as e:
        raise HTTPException(500, f"Erreur modèle bio : {e}")

    return _format_response(pred, proba, bio_label_encoder, "bio")


@app.post("/predict/angio/", summary="Prédiction sur features angiogéniques")
def predict_angio(patient: AngioInput):
    try:
        X = preprocess_angio(patient)
    except Exception as e:
        raise HTTPException(500, f"Erreur de prétraitement angio : {e}")

    try:
        pred  = model_angio.predict(X)
        proba = model_angio.predict_proba(X)[0]
    except Exception as e:
        raise HTTPException(500, f"Erreur modèle angio : {e}")

    map_val = (patient.maximum_systolic_bp + 2 * patient.maximum_diastolic_bp) / 3
    response = _format_response(pred, proba, target_encoder, "angio")
    response["map_mmhg"] = round(map_val, 2)
    return response


# Alias rétro-compatibilité
@app.post("/predict/", summary="Alias de /predict/angio/")
def predict(patient: AngioInput):
    return predict_angio(patient)
