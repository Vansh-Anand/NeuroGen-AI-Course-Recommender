"""
Course History-Based Elective Recommendation Engine
====================================================

Hybrid AI system combining:
  1. Feature Engineering from 6–7 course history
  2. Multi-model Ensemble (LR, RF, GB, MLP)
  3. Fuzzy Logic Readiness Score (Mamdani-type)
  4. Genetic Algorithm Optimization for elective selection
  5. Explainability layer with reasoning
  6. Neural Network vs Traditional ML comparison
  7. Soft Computing (Fuzzy Membership scoring)

Expanded to 26 engineering elective subjects across diverse domains.
"""

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler as SkScaler

# ---------------------------------------------------------------------------
# Constants — Expanded 26-Subject Catalog
# ---------------------------------------------------------------------------

GRADE_TO_GPA = {
    "Distinction": 4.0,
    "Pass": 3.0,
    "Fail": 1.0,
    "Withdrawn": 0.0,
}

GPA_TO_GRADE = {4.0: "Distinction", 3.0: "Pass", 1.0: "Fail", 0.0: "Withdrawn"}

COURSE_CATEGORIES = {
    # Original 11
    "AAA": {"category": "Social Sciences",   "tags": ["theory", "writing"]},
    "BBB": {"category": "Programming",       "tags": ["programming", "lab"]},
    "CCC": {"category": "Programming",       "tags": ["programming", "theory"]},
    "DDD": {"category": "Mathematics",       "tags": ["math", "theory"]},
    "EEE": {"category": "AI / Data Science",  "tags": ["programming", "math", "lab"]},
    "FFF": {"category": "Mathematics",       "tags": ["math", "theory"]},
    "GGG": {"category": "Programming",       "tags": ["programming", "theory", "math"]},
    "HHH": {"category": "Programming",       "tags": ["programming", "theory", "lab"]},
    "III": {"category": "Engineering",       "tags": ["programming", "theory", "lab"]},
    "JJJ": {"category": "Engineering",       "tags": ["math", "lab"]},
    "KKK": {"category": "Engineering",       "tags": ["programming", "lab", "math"]},
    # New 15
    "LLL": {"category": "AI / Data Science",  "tags": ["programming", "math", "lab"]},
    "MMM": {"category": "AI / Data Science",  "tags": ["programming", "theory"]},
    "NNN": {"category": "AI / Data Science",  "tags": ["programming", "math", "lab"]},
    "OOO": {"category": "Core CS",           "tags": ["programming", "theory"]},
    "PPP": {"category": "Core CS",           "tags": ["programming", "theory", "math"]},
    "QQQ": {"category": "Software",          "tags": ["programming", "theory"]},
    "RRR": {"category": "Software",          "tags": ["programming", "lab"]},
    "SSS": {"category": "Emerging Tech",     "tags": ["programming", "math"]},
    "TTT": {"category": "Emerging Tech",     "tags": ["programming", "lab"]},
    "UUU": {"category": "Emerging Tech",     "tags": ["programming", "theory"]},
    "VVV": {"category": "Emerging Tech",     "tags": ["programming", "lab"]},
    "WWW": {"category": "Mathematics",       "tags": ["math", "theory"]},
    "XXX": {"category": "Mathematics",       "tags": ["math", "theory"]},
    "YYY": {"category": "Core CS",           "tags": ["programming", "lab", "theory"]},
    "ZZZ": {"category": "Engineering",       "tags": ["theory", "lab", "math"]},
}

COURSE_NAMES = {
    # Original 11
    "AAA": "Introductory Sociology",
    "BBB": "Introductory Programming",
    "CCC": "Data Structures",
    "DDD": "Foundation Mathematics",
    "EEE": "Machine Learning",
    "FFF": "Applied Statistics",
    "GGG": "Advanced Algorithms",
    "HHH": "Database Systems",
    "III": "Computer Networks",
    "JJJ": "Digital Signal Processing",
    "KKK": "Embedded Systems",
    # New 15
    "LLL": "Deep Learning",
    "MMM": "Natural Language Processing",
    "NNN": "Computer Vision",
    "OOO": "Operating Systems",
    "PPP": "Compiler Design",
    "QQQ": "Software Engineering",
    "RRR": "DevOps & CI/CD",
    "SSS": "Blockchain Technology",
    "TTT": "Internet of Things",
    "UUU": "Cybersecurity",
    "VVV": "Cloud Computing",
    "WWW": "Discrete Mathematics",
    "XXX": "Optimization Techniques",
    "YYY": "Advanced DBMS",
    "ZZZ": "Computer Architecture",
}

DIFFICULTY_CLASSIFICATION = {
    "AAA": "Easy",    "BBB": "Easy",     "CCC": "Moderate",
    "DDD": "Easy",    "EEE": "Hard",     "FFF": "Moderate",
    "GGG": "Hard",    "HHH": "Moderate", "III": "Moderate",
    "JJJ": "Hard",    "KKK": "Hard",
    "LLL": "Hard",    "MMM": "Hard",     "NNN": "Hard",
    "OOO": "Moderate","PPP": "Hard",     "QQQ": "Moderate",
    "RRR": "Moderate","SSS": "Hard",     "TTT": "Moderate",
    "UUU": "Hard",    "VVV": "Moderate", "WWW": "Moderate",
    "XXX": "Hard",    "YYY": "Moderate", "ZZZ": "Hard",
}

CAREER_ALIGNMENT = {
    "AAA": "Research", "BBB": "Software", "CCC": "Software",
    "DDD": "Research", "EEE": "AI",       "FFF": "Research",
    "GGG": "Software", "HHH": "Software", "III": "Core",
    "JJJ": "Core",    "KKK": "Core",
    "LLL": "AI",      "MMM": "AI",       "NNN": "AI",
    "OOO": "Core",    "PPP": "Core",     "QQQ": "Software",
    "RRR": "Software","SSS": "Research", "TTT": "Software",
    "UUU": "Core",    "VVV": "Software", "WWW": "Research",
    "XXX": "Research","YYY": "Core",     "ZZZ": "Core",
}

DIFFICULTY_MAP = {
    "Easy": 1.0,
    "Medium": 2.0,
    "Hard": 3.0,
}

ENGAGEMENT_MAP = {
    "Low": 1.0,
    "Medium": 2.0,
    "High": 3.0,
}

ALL_TAGS = ["programming", "math", "theory", "writing", "lab"]

LABEL_MAP = {0: "Distinction", 1: "Fail", 2: "Pass", 3: "Withdrawn"}
LABEL_INDEX = {"Distinction": 0, "Fail": 1, "Pass": 2, "Withdrawn": 3}

UTILITY_WEIGHTS = {
    "Distinction": 1.5,
    "Fail": -2.0,
    "Pass": 1.0,
    "Withdrawn": -1.0,
}


# ===========================================================================
# Fuzzy Logic Readiness Score
# ===========================================================================

def _trimf(x, a, b, c):
    """Triangular membership function."""
    return np.maximum(0, np.minimum((x - a) / max(b - a, 1e-9),
                                    (c - x) / max(c - b, 1e-9)))

def _trapmf(x, a, b, c, d):
    """Trapezoidal membership function."""
    return np.maximum(0, np.minimum(
        np.minimum((x - a) / max(b - a, 1e-9), 1.0),
        (d - x) / max(d - c, 1e-9)
    ))


class FuzzyReadinessEvaluator:
    """
    Mamdani-type fuzzy inference system that computes an Academic Readiness
    Score (0–1) from four inputs:
        - avg_gpa (0–4)
        - engagement_level (0–3)
        - avg_difficulty (1–3)
        - study_consistency (0–1)
    """

    def __init__(self):
        self.membership_data = {}  # store for visualization

    def _fuzzify(self, avg_gpa, engagement, difficulty, consistency):
        """Compute membership degrees for all fuzzy sets."""
        # GPA membership
        gpa_low  = _trapmf(avg_gpa, 0, 0, 1.5, 2.5)
        gpa_mid  = _trimf(avg_gpa, 1.5, 2.5, 3.5)
        gpa_high = _trapmf(avg_gpa, 2.5, 3.5, 4.0, 4.0)

        # Engagement membership
        eng_low  = _trapmf(engagement, 0, 0, 0.8, 1.5)
        eng_mid  = _trimf(engagement, 0.8, 1.5, 2.5)
        eng_high = _trapmf(engagement, 1.5, 2.5, 3.0, 3.0)

        # Difficulty membership
        diff_easy = _trapmf(difficulty, 1.0, 1.0, 1.3, 2.0)
        diff_mid  = _trimf(difficulty, 1.3, 2.0, 2.7)
        diff_hard = _trapmf(difficulty, 2.0, 2.7, 3.0, 3.0)

        # Consistency membership
        cons_low  = _trapmf(consistency, 0, 0, 0.2, 0.5)
        cons_mid  = _trimf(consistency, 0.2, 0.5, 0.8)
        cons_high = _trapmf(consistency, 0.5, 0.8, 1.0, 1.0)

        self.membership_data = {
            "gpa": {"low": float(gpa_low), "medium": float(gpa_mid), "high": float(gpa_high)},
            "engagement": {"low": float(eng_low), "medium": float(eng_mid), "high": float(eng_high)},
            "difficulty": {"easy": float(diff_easy), "medium": float(diff_mid), "hard": float(diff_hard)},
            "consistency": {"low": float(cons_low), "medium": float(cons_mid), "high": float(cons_high)},
        }

        return {
            "gpa": (gpa_low, gpa_mid, gpa_high),
            "eng": (eng_low, eng_mid, eng_high),
            "diff": (diff_easy, diff_mid, diff_hard),
            "cons": (cons_low, cons_mid, cons_high),
        }

    def evaluate(self, avg_gpa, engagement, difficulty, consistency):
        """
        Evaluate readiness using fuzzy rules.
        Returns (readiness_score: float 0-1, readiness_label: str, membership_data: dict)
        """
        m = self._fuzzify(avg_gpa, engagement, difficulty, consistency)
        gpa_L, gpa_M, gpa_H = m["gpa"]
        eng_L, eng_M, eng_H = m["eng"]
        diff_E, diff_M, diff_H = m["diff"]
        cons_L, cons_M, cons_H = m["cons"]

        # --- Fuzzy rules (output: Low / Medium / High readiness) ---
        rules_high = [
            min(gpa_H, eng_H, cons_H),
            min(gpa_H, eng_H, diff_E),
            min(gpa_H, eng_M, cons_H),
            min(gpa_M, eng_H, cons_H, diff_E),
            min(gpa_H, eng_H, diff_M, cons_M),
        ]
        rules_medium = [
            min(gpa_M, eng_M, cons_M),
            min(gpa_H, eng_L, cons_M),
            min(gpa_M, eng_H, diff_H),
            min(gpa_L, eng_H, cons_H),
            min(gpa_M, eng_M, diff_M),
            min(gpa_H, eng_L, diff_H),
            min(gpa_M, cons_H, diff_E),
        ]
        rules_low = [
            min(gpa_L, eng_L, cons_L),
            min(gpa_L, eng_L),
            min(gpa_L, cons_L),
            min(gpa_L, eng_M, diff_H),
            min(gpa_M, eng_L, cons_L, diff_H),
        ]

        agg_high = max(rules_high) if rules_high else 0
        agg_mid  = max(rules_medium) if rules_medium else 0
        agg_low  = max(rules_low) if rules_low else 0

        # Centroid defuzzification
        numerator = agg_low * 0.2 + agg_mid * 0.5 + agg_high * 0.85
        denominator = agg_low + agg_mid + agg_high
        readiness = numerator / denominator if denominator > 0 else 0.5

        readiness = float(np.clip(readiness, 0, 1))

        if readiness >= 0.7:
            label = "High"
        elif readiness >= 0.4:
            label = "Medium"
        else:
            label = "Low"

        return readiness, label, self.membership_data


# ===========================================================================
# Fuzzy Suitability Scorer (Soft Computing)
# ===========================================================================

class FuzzySuitabilityScorer:
    """
    Computes a fuzzy membership-based suitability score for each elective
    based on skill alignment, difficulty tolerance, and engagement level.
    """

    @staticmethod
    def compute(features, elective_code, probs):
        """Return (suitability_score 0-1, confidence_score 0-1, membership_details)."""
        info = COURSE_CATEGORIES.get(elective_code, {"tags": ["theory"]})
        tags = info["tags"]

        # Skill alignment membership
        relevant_skills = [features.get(f"skill_{t}", 2.0) for t in tags]
        avg_skill = float(np.mean(relevant_skills)) if relevant_skills else 2.0
        skill_membership = float(np.clip(avg_skill / 4.0, 0, 1))

        # Difficulty tolerance
        avg_diff = features.get("avg_difficulty", 2.0)
        subj_diff = {"Easy": 1.0, "Moderate": 2.0, "Hard": 3.0}.get(
            DIFFICULTY_CLASSIFICATION.get(elective_code, "Moderate"), 2.0
        )
        diff_gap = abs(avg_diff - subj_diff)
        diff_tolerance = float(np.clip(1.0 - diff_gap / 2.0, 0, 1))

        # Performance confidence
        p_positive = float(probs[0] + probs[2])  # Dist + Pass
        p_negative = float(probs[1] + probs[3])  # Fail + With
        performance_confidence = float(np.clip(p_positive, 0, 1))

        # Engagement alignment
        eng = features.get("avg_engagement", 2.0)
        engagement_score = float(np.clip(eng / 3.0, 0, 1))

        # Composite suitability (weighted fuzzy aggregation)
        suitability = (
            skill_membership * 0.35 +
            diff_tolerance * 0.20 +
            performance_confidence * 0.30 +
            engagement_score * 0.15
        )
        suitability = float(np.clip(suitability, 0, 1))

        confidence = float(np.max(probs))

        membership_details = {
            "skill_alignment": round(skill_membership, 3),
            "difficulty_tolerance": round(diff_tolerance, 3),
            "performance_confidence": round(performance_confidence, 3),
            "engagement_fit": round(engagement_score, 3),
        }

        return round(suitability, 4), round(confidence, 4), membership_details


# ===========================================================================
# Genetic Algorithm Optimizer
# ===========================================================================

class GeneticAlgorithmOptimizer:
    """
    Uses a genetic algorithm to determine the best elective recommendation
    by evolving candidate solutions and optimizing a fitness function.
    """

    def __init__(self, population_size=30, generations=20, mutation_rate=0.15,
                 crossover_rate=0.7, seed=42):
        self.pop_size = population_size
        self.generations = generations
        self.mutation_rate = mutation_rate
        self.crossover_rate = crossover_rate
        self.rng = np.random.RandomState(seed)
        self.evolution_history = []

    def _fitness(self, expected_gpa, fail_risk, readiness_score, gpa_impact):
        return (
            gpa_impact * 1.5 +
            expected_gpa * 0.3 +
            readiness_score * 0.8 -
            fail_risk * 2.0
        )

    def optimize(self, candidate_scores):
        n_candidates = len(candidate_scores)
        if n_candidates == 0:
            return None, 0, []

        self.evolution_history = []
        population = self.rng.randint(0, n_candidates, size=self.pop_size)

        for gen in range(self.generations):
            fitnesses = np.array([
                self._fitness(
                    candidate_scores[idx]["expected_gpa"],
                    candidate_scores[idx]["fail_risk"],
                    candidate_scores[idx]["readiness_score"],
                    candidate_scores[idx]["gpa_impact"],
                ) for idx in population
            ])

            min_f = fitnesses.min()
            shifted = fitnesses - min_f + 1e-6
            probs = shifted / shifted.sum()

            self.evolution_history.append({
                "generation": gen + 1,
                "best_fitness": round(float(fitnesses.max()), 4),
                "avg_fitness": round(float(fitnesses.mean()), 4),
                "worst_fitness": round(float(fitnesses.min()), 4),
                "best_elective": candidate_scores[population[np.argmax(fitnesses)]]["code"],
            })

            new_pop = []
            for _ in range(self.pop_size):
                if self.rng.random() < self.crossover_rate and len(new_pop) >= 2:
                    idx1, idx2 = self.rng.choice(self.pop_size, 2, replace=False, p=probs)
                    parent1, parent2 = population[idx1], population[idx2]
                    child = parent1 if fitnesses[idx1] > fitnesses[idx2] else parent2
                else:
                    child = self.rng.choice(population, p=probs)

                if self.rng.random() < self.mutation_rate:
                    child = self.rng.randint(0, n_candidates)

                new_pop.append(child)

            population = np.array(new_pop)

        final_fitnesses = np.array([
            self._fitness(
                candidate_scores[idx]["expected_gpa"],
                candidate_scores[idx]["fail_risk"],
                candidate_scores[idx]["readiness_score"],
                candidate_scores[idx]["gpa_impact"],
            ) for idx in population
        ])
        best_idx = population[np.argmax(final_fitnesses)]
        best_code = candidate_scores[best_idx]["code"]
        best_fitness = float(final_fitnesses.max())

        return best_code, best_fitness, self.evolution_history


# ===========================================================================
# Feature Engineering
# ===========================================================================

def _grade_to_gpa(grade_str: str) -> float:
    return GRADE_TO_GPA.get(grade_str, 2.0)


def engineer_features(course_history: list[dict]) -> dict:
    """Engineer rich feature vector from 6–7 course dicts."""
    n = len(course_history)
    if n == 0:
        raise ValueError("Course history must contain at least one course.")

    gpas = [_grade_to_gpa(c.get("grade", "Pass")) for c in course_history]
    credits = [int(c.get("credits", 60)) for c in course_history]
    clicks = [int(c.get("clicks", 100)) for c in course_history]
    active_days = [int(c.get("active_days", 30)) for c in course_history]
    difficulties = [DIFFICULTY_MAP.get(c.get("difficulty", "Medium"), 2.0) for c in course_history]
    attendance = [int(c.get("attendance", 75)) for c in course_history]
    engagement_levels = [ENGAGEMENT_MAP.get(c.get("engagement", "Medium"), 2.0) for c in course_history]

    avg_gpa = float(np.mean(gpas))
    weighted_gpa = float(np.average(gpas, weights=credits))

    if n >= 2:
        x = np.arange(n, dtype=float)
        coeffs = np.polyfit(x, gpas, 1)
        grade_trend = float(coeffs[0])
    else:
        grade_trend = 0.0

    avg_clicks = float(np.mean(clicks))
    avg_active_days = float(np.mean(active_days))
    avg_attendance = float(np.mean(attendance))
    total_credits = int(np.sum(credits))
    avg_difficulty = float(np.mean(difficulties))
    avg_engagement = float(np.mean(engagement_levels))

    gpa_std = float(np.std(gpas)) if n >= 2 else 0.5
    study_consistency = float(np.clip(1.0 - gpa_std / 2.0, 0, 1))

    tag_scores = {tag: [] for tag in ALL_TAGS}
    category_scores = {}
    for c in course_history:
        code = c.get("course_code", "CCC")
        info = COURSE_CATEGORIES.get(code, {"category": "General", "tags": ["theory"]})
        gpa = _grade_to_gpa(c.get("grade", "Pass"))
        cat = info["category"]
        category_scores.setdefault(cat, []).append(gpa)
        for tag in info.get("tags", []):
            tag_scores[tag].append(gpa)

    skill_profile = {}
    for tag in ALL_TAGS:
        scores = tag_scores[tag]
        skill_profile[f"skill_{tag}"] = float(np.mean(scores)) if scores else 2.0

    all_categories = [
        "Social Sciences", "Programming", "Mathematics",
        "AI / Data Science", "Engineering", "Core CS",
        "Software", "Emerging Tech",
    ]
    cat_profile = {}
    for cat_name in all_categories:
        scores = category_scores.get(cat_name, [])
        key = f"cat_{cat_name.lower().replace(' ', '_').replace('/', '')}"
        cat_profile[key] = float(np.mean(scores)) if scores else 2.0

    distinctions = sum(1 for g in gpas if g == 4.0)
    passes = sum(1 for g in gpas if g == 3.0)
    fails = sum(1 for g in gpas if g == 1.0)
    withdrawns = sum(1 for g in gpas if g == 0.0)

    features = {
        "avg_gpa": round(avg_gpa, 4),
        "weighted_gpa": round(weighted_gpa, 4),
        "grade_trend": round(grade_trend, 4),
        "avg_clicks": round(avg_clicks, 2),
        "avg_active_days": round(avg_active_days, 2),
        "avg_attendance": round(avg_attendance, 2),
        "total_credits": total_credits,
        "avg_difficulty": round(avg_difficulty, 2),
        "avg_engagement": round(avg_engagement, 2),
        "study_consistency": round(study_consistency, 4),
        "num_courses": n,
        "distinctions": distinctions,
        "passes": passes,
        "fails": fails,
        "withdrawns": withdrawns,
        "distinction_rate": round(distinctions / n, 4),
        "fail_rate": round(fails / n, 4),
        **skill_profile,
        **cat_profile,
    }
    return features


# ===========================================================================
# Synthetic Training Data
# ===========================================================================

def _generate_training_data(n_samples=2000, seed=42):
    rng = np.random.RandomState(seed)
    records, labels = [], []

    for _ in range(n_samples):
        avg_gpa = rng.uniform(0.5, 4.0)
        weighted_gpa = np.clip(avg_gpa + rng.normal(0, 0.2), 0, 4.0)
        grade_trend = rng.normal(0, 0.5)
        avg_clicks = rng.uniform(10, 500)
        avg_active_days = rng.uniform(5, 60)
        avg_attendance = rng.uniform(20, 100)
        total_credits = rng.choice([120, 180, 240, 300, 360, 420])
        avg_difficulty = rng.uniform(1.0, 3.0)
        num_courses = rng.randint(3, 8)
        distinctions = rng.randint(0, num_courses + 1)
        fails = rng.randint(0, max(num_courses - distinctions + 1, 1))
        passes = max(0, num_courses - distinctions - fails)
        withdrawns = 0
        distinction_rate = distinctions / num_courses
        fail_rate = fails / num_courses
        skills = {tag: rng.uniform(0.5, 4.0) for tag in ALL_TAGS}
        cats = {cat: rng.uniform(0.5, 4.0) for cat in
                ["social_sciences", "programming", "mathematics", "ai__data_science",
                 "engineering", "core_cs", "software", "emerging_tech"]}

        score = (avg_gpa * 0.3 + weighted_gpa * 0.2 + grade_trend * 0.15 +
                 (avg_clicks / 500) * 0.1 + (avg_active_days / 60) * 0.1 +
                 (avg_attendance / 100) * 0.1 + distinction_rate * 0.05)
        score += rng.normal(0, 0.12)

        if score > 0.75:
            label = 0
        elif score > 0.50:
            label = 2
        elif score > 0.30:
            label = 1
        else:
            label = 3

        row = [
            avg_gpa, weighted_gpa, grade_trend, avg_clicks, avg_active_days,
            avg_attendance, total_credits, avg_difficulty, num_courses,
            distinctions, passes, fails, withdrawns, distinction_rate, fail_rate,
            skills["programming"], skills["math"], skills["theory"],
            skills["writing"], skills["lab"],
            cats["social_sciences"], cats["programming"],
            cats["mathematics"], cats["ai__data_science"],
            cats["engineering"], cats["core_cs"],
            cats["software"], cats["emerging_tech"],
        ]
        records.append(row)
        labels.append(label)

    feature_names = [
        "avg_gpa", "weighted_gpa", "grade_trend", "avg_clicks", "avg_active_days",
        "avg_attendance", "total_credits", "avg_difficulty", "num_courses",
        "distinctions", "passes", "fails", "withdrawns", "distinction_rate", "fail_rate",
        "skill_programming", "skill_math", "skill_theory", "skill_writing", "skill_lab",
        "cat_social_sciences", "cat_programming", "cat_mathematics", "cat_ai__data_science",
        "cat_engineering", "cat_core_cs", "cat_software", "cat_emerging_tech",
    ]
    return np.array(records), np.array(labels), feature_names


# ===========================================================================
# CourseHistoryRecommender
# ===========================================================================

class CourseHistoryRecommender:
    """
    Hybrid AI system: Ensemble ML + Fuzzy Logic + Genetic Algorithm
    """

    def __init__(self, nn_model=None, encoder=None, scaler=None):
        self.nn_model = nn_model
        self.encoder = encoder
        self.scaler = scaler

        self.lr_model = None
        self.rf_model = None
        self.gb_model = None
        self.mlp_model = None
        self.ensemble_scaler = None
        self._feature_names = None
        self._is_trained = False

        self.fuzzy_evaluator = FuzzyReadinessEvaluator()
        self.fuzzy_scorer = FuzzySuitabilityScorer()
        self.ga_optimizer = GeneticAlgorithmOptimizer()

        self._train_ensemble()

    def _train_ensemble(self):
        X, y, feature_names = _generate_training_data(n_samples=3000, seed=42)
        self._feature_names = feature_names
        self.ensemble_scaler = SkScaler()
        X_scaled = self.ensemble_scaler.fit_transform(X)

        self.lr_model = LogisticRegression(
            max_iter=1000, solver="lbfgs", random_state=42)
        self.lr_model.fit(X_scaled, y)

        self.rf_model = RandomForestClassifier(
            n_estimators=100, max_depth=8, random_state=42, n_jobs=-1)
        self.rf_model.fit(X_scaled, y)

        self.gb_model = GradientBoostingClassifier(
            n_estimators=100, max_depth=4, learning_rate=0.1, random_state=42)
        self.gb_model.fit(X_scaled, y)

        self.mlp_model = MLPClassifier(
            hidden_layer_sizes=(64, 32), activation="relu", max_iter=500,
            random_state=42, early_stopping=True, validation_fraction=0.15)
        self.mlp_model.fit(X_scaled, y)
        self._is_trained = True

    def _features_to_array(self, features):
        row = [features.get(name, 0.0) for name in self._feature_names]
        return np.array([row])

    def _predict_ensemble_proba(self, features):
        X = self._features_to_array(features)
        X_scaled = self.ensemble_scaler.transform(X)
        probs = []
        for model in [self.lr_model, self.rf_model, self.gb_model, self.mlp_model]:
            p = model.predict_proba(X_scaled)[0]
            full_p = np.zeros(4)
            for idx, cls in enumerate(model.classes_):
                full_p[cls] = p[idx]
            probs.append(full_p)
        return np.mean(probs, axis=0)

    def _predict_ml_only(self, features):
        """Traditional ML prediction (RF + GB average)."""
        X = self._features_to_array(features)
        X_scaled = self.ensemble_scaler.transform(X)
        probs = []
        for model in [self.rf_model, self.gb_model]:
            p = model.predict_proba(X_scaled)[0]
            full_p = np.zeros(4)
            for idx, cls in enumerate(model.classes_):
                full_p[cls] = p[idx]
            probs.append(full_p)
        return np.mean(probs, axis=0)

    def _predict_nn_only(self, features):
        """Neural Network (MLP) prediction."""
        X = self._features_to_array(features)
        X_scaled = self.ensemble_scaler.transform(X)
        p = self.mlp_model.predict_proba(X_scaled)[0]
        full_p = np.zeros(4)
        for idx, cls in enumerate(self.mlp_model.classes_):
            full_p[cls] = p[idx]
        return full_p

    def _predict_existing_nn(self, base_student_dict, elective_code):
        if self.nn_model is None:
            return None
        try:
            numeric_features = [
                "studied_credits", "num_of_prev_attempts", "total_clicks",
                "avg_clicks", "active_days", "avg_score", "max_score"]
            categorical_features = list(self.encoder.feature_names_in_)
            sim_record = base_student_dict.copy()
            sim_record["code_module"] = elective_code
            input_df = pd.DataFrame([sim_record])
            cat_input = input_df[categorical_features]
            encoded_cat = self.encoder.transform(cat_input)
            num_input = input_df[numeric_features].values
            final_input = np.hstack((num_input, encoded_cat))
            encoded_feature_names = list(self.encoder.get_feature_names_out(categorical_features))
            final_feature_names = numeric_features + list(encoded_feature_names)
            final_df = pd.DataFrame(final_input, columns=final_feature_names)
            input_scaled = self.scaler.transform(final_df)
            return self.nn_model.predict_proba(input_scaled)[0]
        except Exception:
            return None

    def _compute_recommendation_score(self, probs):
        return float(
            probs[0] * UTILITY_WEIGHTS["Distinction"] +
            probs[1] * UTILITY_WEIGHTS["Fail"] +
            probs[2] * UTILITY_WEIGHTS["Pass"] +
            probs[3] * UTILITY_WEIGHTS["Withdrawn"])

    def _compute_expected_gpa(self, probs):
        return float(
            probs[0] * GRADE_TO_GPA["Distinction"] +
            probs[1] * GRADE_TO_GPA["Fail"] +
            probs[2] * GRADE_TO_GPA["Pass"] +
            probs[3] * GRADE_TO_GPA["Withdrawn"])

    def _determine_risk_profile(self, elective_code, fail_risk, expected_gpa):
        """Determine if an elective is Safe Choice or High Risk High Reward."""
        difficulty = DIFFICULTY_CLASSIFICATION.get(elective_code, "Moderate")
        if difficulty == "Hard" and expected_gpa >= 3.0:
            return "High Risk High Reward"
        elif difficulty == "Hard" and fail_risk > 30:
            return "High Risk"
        elif difficulty == "Easy" or fail_risk < 15:
            return "Safe Choice"
        elif fail_risk < 25:
            return "Safe Choice"
        else:
            return "Moderate"

    def _generate_explanation(self, elective_code, features, probs, expected_gpa, current_gpa, readiness_score):
        explanations = []
        info = COURSE_CATEGORIES.get(elective_code, {"category": "General", "tags": ["theory"]})
        tags = info["tags"]

        relevant_skills = [features.get(f"skill_{t}", 2.0) for t in tags]
        avg_skill = np.mean(relevant_skills) if relevant_skills else 2.0

        # Reason 1: Strength/Skill alignment
        if avg_skill >= 3.0:
            explanations.append({
                "title": "Strong Skill Match",
                "text": f"Your performance in {', '.join(tags)} areas averages {avg_skill:.1f}/4.0 — excellent alignment with {COURSE_NAMES.get(elective_code, elective_code)}.",
                "type": "strength"
            })
        elif avg_skill >= 2.0:
            explanations.append({
                "title": "Good Fit Based on Skills",
                "text": f"Your {', '.join(tags)} proficiency ({avg_skill:.1f}/4.0) shows a solid foundation for this course.",
                "type": "strength"
            })
        else:
            explanations.append({
                "title": "Skill Development Opportunity",
                "text": f"Your {', '.join(tags)} scores ({avg_skill:.1f}/4.0) are lower, but this course builds these skills.",
                "type": "pattern"
            })

        # Reason 2: Performance pattern
        fail_prob = probs[1] + probs[3]
        if fail_prob < 0.15:
            explanations.append({
                "title": "Strong Predicted Performance",
                "text": f"Only {fail_prob*100:.1f}% failure/withdrawal probability based on your academic patterns.",
                "type": "pattern"
            })
        elif fail_prob < 0.35:
            explanations.append({
                "title": "Achievable with Effort",
                "text": f"Your predicted risk is {fail_prob*100:.1f}% — manageable with consistent study.",
                "type": "pattern"
            })
        else:
            explanations.append({
                "title": "Consider Additional Support",
                "text": f"Predicted failure/withdrawal probability is {fail_prob*100:.1f}%. Extra preparation recommended.",
                "type": "pattern"
            })

        # Reason 3: CGPA impact
        gpa_diff = expected_gpa - current_gpa
        if gpa_diff > 0:
            explanations.append({
                "title": "Positive CGPA Impact",
                "text": f"Expected to improve your CGPA by +{gpa_diff:.2f} (from {current_gpa:.2f} → ~{expected_gpa:.2f}).",
                "type": "alignment"
            })
        else:
            explanations.append({
                "title": "CGPA Consideration",
                "text": f"Expected GPA ({expected_gpa:.2f}) may slightly reduce your current average ({current_gpa:.2f}).",
                "type": "alignment"
            })

        # Reason 4: Readiness
        if readiness_score >= 0.7:
            explanations.append({
                "title": "High Academic Readiness",
                "text": f"Fuzzy readiness score of {readiness_score:.0%} — you are well-prepared.",
                "type": "alignment"
            })
        elif readiness_score >= 0.4:
            explanations.append({
                "title": "Moderate Readiness",
                "text": f"Readiness score: {readiness_score:.0%} — achievable with consistent effort.",
                "type": "alignment"
            })

        # Reason 5: Grade trend
        trend = features.get("grade_trend", 0.0)
        if trend > 0.1:
            explanations.append({
                "title": "Positive Academic Momentum",
                "text": f"Your grades show an upward trend (+{trend:.2f}/course), favoring success.",
                "type": "pattern"
            })

        # Influencing parameters
        influencing = [
            {"param": "Skill Match", "value": round(avg_skill, 2), "impact": "high" if avg_skill >= 3.0 else "medium" if avg_skill >= 2.0 else "low"},
            {"param": "Grade Trend", "value": round(trend, 3), "impact": "positive" if trend > 0.1 else "negative" if trend < -0.1 else "neutral"},
            {"param": "Study Consistency", "value": round(features.get("study_consistency", 0.5), 3), "impact": "high" if features.get("study_consistency", 0.5) >= 0.7 else "medium" if features.get("study_consistency", 0.5) >= 0.4 else "low"},
            {"param": "Avg Engagement", "value": round(features.get("avg_engagement", 2.0), 2), "impact": "high" if features.get("avg_engagement", 2.0) >= 2.5 else "medium" if features.get("avg_engagement", 2.0) >= 1.5 else "low"},
            {"param": "Course Difficulty", "value": round(features.get("avg_difficulty", 2.0), 2), "impact": "easy" if features.get("avg_difficulty", 2.0) < 1.5 else "hard" if features.get("avg_difficulty", 2.0) > 2.5 else "moderate"},
            {"param": "Academic Readiness", "value": round(readiness_score, 3), "impact": "high" if readiness_score >= 0.7 else "medium" if readiness_score >= 0.4 else "low"},
        ]

        return explanations, influencing

    def _generate_alternative_reason(self, current_rec, better_rec, cgpa_improvement, risk_reduction, features):
        reasons = []

        if cgpa_improvement > 0:
            reasons.append(
                f"{better_rec['name']} ({better_rec['code']}) is expected to yield a {cgpa_improvement:.2f} "
                f"higher GPA ({better_rec['expected_gpa']:.2f} vs {current_rec['expected_gpa']:.2f}), "
                f"potentially boosting your overall CGPA."
            )

        if risk_reduction > 0:
            reasons.append(
                f"It also carries {risk_reduction:.1f}% lower failure/withdrawal risk "
                f"({better_rec['fail_risk']:.1f}% vs {current_rec['fail_risk']:.1f}%)."
            )

        better_info = COURSE_CATEGORIES.get(better_rec["code"], {"tags": []})
        current_info = COURSE_CATEGORIES.get(current_rec["code"], {"tags": []})
        better_skill = np.mean([features.get(f"skill_{t}", 2.0) for t in better_info.get("tags", ["theory"])])
        current_skill = np.mean([features.get(f"skill_{t}", 2.0) for t in current_info.get("tags", ["theory"])])

        if better_skill > current_skill:
            reasons.append(
                f"Your skill profile aligns better with {better_rec['name']} "
                f"(skill match: {better_skill:.1f}/4.0 vs {current_skill:.1f}/4.0)."
            )

        if not reasons:
            reasons.append(
                f"{better_rec['name']} has a higher overall recommendation score "
                f"({better_rec['recommendation_score']:.3f} vs {current_rec['recommendation_score']:.3f})."
            )

        return " ".join(reasons)

    def _compute_model_comparison(self, features):
        X = self._features_to_array(features)
        X_scaled = self.ensemble_scaler.transform(X)
        comparisons = []
        for name, model in [("Logistic Regression", self.lr_model),
                            ("Random Forest", self.rf_model),
                            ("Gradient Boosting", self.gb_model),
                            ("Neural Network (MLP)", self.mlp_model)]:
            p = model.predict_proba(X_scaled)[0]
            full_p = np.zeros(4)
            for idx, cls in enumerate(model.classes_):
                full_p[cls] = p[idx]
            pred_class = int(np.argmax(full_p))
            comparisons.append({
                "model": name,
                "prediction": LABEL_MAP[pred_class],
                "confidence": round(float(np.max(full_p)) * 100, 1),
                "p_distinction": round(float(full_p[0]), 4),
                "p_fail": round(float(full_p[1]), 4),
                "p_pass": round(float(full_p[2]), 4),
                "p_withdrawn": round(float(full_p[3]), 4),
            })
        return comparisons

    def _compute_nn_vs_ml(self, features):
        """Compute Neural Network vs Traditional ML comparison."""
        ml_probs = self._predict_ml_only(features)
        nn_probs = self._predict_nn_only(features)

        ml_pred = LABEL_MAP[int(np.argmax(ml_probs))]
        nn_pred = LABEL_MAP[int(np.argmax(nn_probs))]

        return {
            "ml": {
                "prediction": ml_pred,
                "confidence": round(float(np.max(ml_probs)) * 100, 1),
                "p_distinction": round(float(ml_probs[0]), 4),
                "p_fail": round(float(ml_probs[1]), 4),
                "p_pass": round(float(ml_probs[2]), 4),
                "p_withdrawn": round(float(ml_probs[3]), 4),
            },
            "nn": {
                "prediction": nn_pred,
                "confidence": round(float(np.max(nn_probs)) * 100, 1),
                "p_distinction": round(float(nn_probs[0]), 4),
                "p_fail": round(float(nn_probs[1]), 4),
                "p_pass": round(float(nn_probs[2]), 4),
                "p_withdrawn": round(float(nn_probs[3]), 4),
            },
            "agreement": ml_pred == nn_pred,
            "confidence_delta": round(abs(float(np.max(ml_probs)) - float(np.max(nn_probs))) * 100, 1),
        }

    def _compute_feature_importance(self):
        """Get RF feature importance."""
        if self.rf_model is None:
            return []
        importances = self.rf_model.feature_importances_
        pairs = sorted(
            zip(self._feature_names, importances),
            key=lambda x: x[1], reverse=True
        )
        return [
            {"feature": name.replace("_", " ").title(), "importance": round(float(imp), 4)}
            for name, imp in pairs[:10]
        ]

    def recommend(self, course_history, demographics=None, top_n=11,
                  behaviour=None, selected_electives=None):
        """Main recommendation method."""
        if not self._is_trained:
            raise RuntimeError("Ensemble models not trained.")

        features = engineer_features(course_history)
        current_gpa = features["avg_gpa"]

        # --- Fuzzy logic readiness ---
        engagement_val = features.get("avg_engagement", 2.0)
        difficulty_val = features.get("avg_difficulty", 2.0)
        consistency_val = features.get("study_consistency", 0.5)

        readiness_score, readiness_label, membership_data = self.fuzzy_evaluator.evaluate(
            current_gpa, engagement_val, difficulty_val, consistency_val
        )

        # --- Candidate electives ---
        taken_codes = {c.get("course_code", "") for c in course_history}
        if selected_electives:
            candidate_electives = [code for code in selected_electives
                                   if code in COURSE_CATEGORIES]
        else:
            candidate_electives = [code for code in COURSE_CATEGORIES if code not in taken_codes]
        if not candidate_electives:
            candidate_electives = list(COURSE_CATEGORIES.keys())

        # --- Build base student dict for existing NN ---
        base_student_dict = None
        if demographics and self.nn_model is not None:
            base_student_dict = {
                "gender": demographics.get("gender", "M"),
                "age_band": demographics.get("age_band", "0-35"),
                "highest_education": demographics.get("highest_education", "A Level or Equivalent"),
                "region": demographics.get("region", "South East"),
                "imd_band": demographics.get("imd_band", "20-30%"),
                "disability": demographics.get("disability", "N"),
                "code_module": "CCC",
                "code_presentation": demographics.get("code_presentation", "2014J"),
                "studied_credits": features["total_credits"] // features["num_courses"],
                "num_of_prev_attempts": features["num_courses"],
                "total_clicks": int(features["avg_clicks"] * 10),
                "avg_clicks": int(features["avg_clicks"]),
                "active_days": int(features["avg_active_days"]),
                "avg_score": int(features["avg_gpa"] / 4.0 * 100),
                "max_score": int(features["avg_gpa"] / 4.0 * 100),
            }

        # --- Predict for each elective ---
        recommendations = []
        ga_candidates = []
        for elective_code in candidate_electives:
            ensemble_probs = self._predict_ensemble_proba(features)
            nn_probs = None
            if base_student_dict is not None:
                nn_probs = self._predict_existing_nn(base_student_dict, elective_code)
            combined_probs = (0.6 * ensemble_probs + 0.4 * nn_probs
                              if nn_probs is not None else ensemble_probs)
            combined_probs = combined_probs / combined_probs.sum()

            rec_score = self._compute_recommendation_score(combined_probs)
            expected_gpa = self._compute_expected_gpa(combined_probs)
            gpa_impact = expected_gpa - current_gpa
            fail_risk = float(combined_probs[1] + combined_probs[3])

            explanations, influencing = self._generate_explanation(
                elective_code, features, combined_probs, expected_gpa, current_gpa, readiness_score)

            pred_class = int(np.argmax(combined_probs))
            predicted_outcome = LABEL_MAP[pred_class]

            expected_marks_low = max(0, int(expected_gpa / 4.0 * 100 - 8))
            expected_marks_high = min(100, int(expected_gpa / 4.0 * 100 + 8))

            # Fuzzy suitability scoring
            suitability, confidence, suit_membership = self.fuzzy_scorer.compute(
                features, elective_code, combined_probs
            )

            # Risk profile
            risk_profile = self._determine_risk_profile(elective_code, fail_risk * 100, expected_gpa)

            # Per-elective NN vs ML comparison
            ml_probs_only = self._predict_ml_only(features)
            nn_probs_only = self._predict_nn_only(features)
            ml_pred_class = int(np.argmax(ml_probs_only))
            nn_pred_class = int(np.argmax(nn_probs_only))

            rec_entry = {
                "code": elective_code,
                "name": COURSE_NAMES.get(elective_code, elective_code),
                "category": COURSE_CATEGORIES.get(elective_code, {}).get("category", "General"),
                "recommendation_score": round(rec_score, 3),
                "expected_gpa": round(expected_gpa, 2),
                "gpa_impact": round(gpa_impact, 2),
                "predicted_outcome": predicted_outcome,
                "fail_risk": round(fail_risk * 100, 1),
                "expected_marks": f"{expected_marks_low}–{expected_marks_high}",
                "difficulty_level": DIFFICULTY_CLASSIFICATION.get(elective_code, "Moderate"),
                "career_tag": CAREER_ALIGNMENT.get(elective_code, "Software"),
                "risk_profile": risk_profile,
                "fuzzy_suitability": suitability,
                "fuzzy_confidence": confidence,
                "fuzzy_membership": suit_membership,
                "probabilities": {
                    "distinction": round(float(combined_probs[0]), 4),
                    "fail": round(float(combined_probs[1]), 4),
                    "pass": round(float(combined_probs[2]), 4),
                    "withdrawn": round(float(combined_probs[3]), 4),
                },
                "nn_vs_ml": {
                    "ml_prediction": LABEL_MAP[ml_pred_class],
                    "ml_confidence": round(float(np.max(ml_probs_only)) * 100, 1),
                    "nn_prediction": LABEL_MAP[nn_pred_class],
                    "nn_confidence": round(float(np.max(nn_probs_only)) * 100, 1),
                    "agreement": LABEL_MAP[ml_pred_class] == LABEL_MAP[nn_pred_class],
                },
                "explanations": explanations,
                "influencing_params": influencing,
            }
            recommendations.append(rec_entry)
            ga_candidates.append({
                "code": elective_code,
                "expected_gpa": expected_gpa,
                "fail_risk": fail_risk,
                "readiness_score": readiness_score,
                "gpa_impact": gpa_impact,
            })

        recommendations.sort(key=lambda x: x["recommendation_score"], reverse=True)

        # --- Generate "Better Alternative" suggestions ---
        if len(recommendations) >= 2:
            best_rec = recommendations[0]
            for i, rec in enumerate(recommendations):
                if i == 0:
                    rec["better_alternative"] = None
                else:
                    cgpa_improvement = round(best_rec["expected_gpa"] - rec["expected_gpa"], 2)
                    risk_reduction = round(rec["fail_risk"] - best_rec["fail_risk"], 1)
                    rec["better_alternative"] = {
                        "suggested_code": best_rec["code"],
                        "suggested_name": best_rec["name"],
                        "cgpa_improvement": cgpa_improvement,
                        "risk_reduction": risk_reduction,
                        "reason": self._generate_alternative_reason(
                            rec, best_rec, cgpa_improvement, risk_reduction, features
                        ),
                    }

        # --- Genetic Algorithm optimization ---
        ga_best_code, ga_best_fitness, ga_evolution = self.ga_optimizer.optimize(ga_candidates)

        for rec in recommendations:
            rec["ga_recommended"] = (rec["code"] == ga_best_code)

        model_comparison = self._compute_model_comparison(features)
        nn_vs_ml_global = self._compute_nn_vs_ml(features)
        feature_importance = self._compute_feature_importance()

        # Skill profile for radar chart
        skill_profile = {tag: round(features.get(f"skill_{tag}", 2.0), 2) for tag in ALL_TAGS}

        student_profile = {
            "current_cgpa": round(current_gpa, 2),
            "weighted_cgpa": round(features["weighted_gpa"], 2),
            "grade_trend": "Improving" if features["grade_trend"] > 0.1 else (
                "Declining" if features["grade_trend"] < -0.1 else "Stable"),
            "grade_trend_value": round(features["grade_trend"], 3),
            "total_credits": features["total_credits"],
            "courses_taken": features["num_courses"],
            "distinction_rate": round(features["distinction_rate"] * 100, 1),
            "fail_rate": round(features["fail_rate"] * 100, 1),
            "strongest_skill": max(ALL_TAGS, key=lambda t: features.get(f"skill_{t}", 0)),
            "avg_engagement": round(features["avg_clicks"], 0),
            "skill_profile": skill_profile,
        }

        return {
            "features": features,
            "recommendations": recommendations[:top_n],
            "model_comparison": model_comparison,
            "nn_vs_ml": nn_vs_ml_global,
            "feature_importance": feature_importance,
            "student_profile": student_profile,
            "readiness": {
                "score": round(readiness_score, 4),
                "label": readiness_label,
                "membership": membership_data,
            },
            "ga_evolution": ga_evolution,
            "ga_best": {
                "code": ga_best_code,
                "fitness": round(ga_best_fitness, 4),
            },
        }


# ===========================================================================
# Quick test
# ===========================================================================
if __name__ == "__main__":
    print("=" * 60)
    print("  CourseHistoryRecommender — Full Hybrid Test")
    print("=" * 60)

    recommender = CourseHistoryRecommender()

    sample_history = [
        {"course_code": "BBB", "grade": "Pass", "credits": 60, "difficulty": "Medium", "clicks": 150, "active_days": 35, "engagement": "Medium"},
        {"course_code": "CCC", "grade": "Distinction", "credits": 60, "difficulty": "Hard", "clicks": 200, "active_days": 40, "engagement": "High"},
        {"course_code": "DDD", "grade": "Pass", "credits": 30, "difficulty": "Easy", "clicks": 80, "active_days": 20, "engagement": "Low"},
        {"course_code": "BBB", "grade": "Pass", "credits": 60, "difficulty": "Medium", "clicks": 120, "active_days": 30, "engagement": "Medium"},
        {"course_code": "FFF", "grade": "Fail", "credits": 60, "difficulty": "Hard", "clicks": 50, "active_days": 15, "engagement": "Low"},
        {"course_code": "AAA", "grade": "Distinction", "credits": 30, "difficulty": "Easy", "clicks": 180, "active_days": 45, "engagement": "High"},
    ]

    result = recommender.recommend(sample_history, top_n=7)

    print(f"\n🧠 Fuzzy Readiness: {result['readiness']['label']} ({result['readiness']['score']:.4f})")
    print(f"🧬 GA Best: {result['ga_best']['code']} (fitness: {result['ga_best']['fitness']:.4f})")

    print("\n📊 Student Profile:")
    for k, v in result["student_profile"].items():
        print(f"  {k}: {v}")

    print("\n🏆 Top Recommendations:")
    for i, rec in enumerate(result["recommendations"], 1):
        ga_tag = " 🧬" if rec.get("ga_recommended") else ""
        print(f"  #{i} {rec['code']} ({rec['name']}) — Score: {rec['recommendation_score']}, "
              f"GPA Impact: {rec['gpa_impact']:+.2f}, "
              f"Difficulty: {rec['difficulty_level']}, "
              f"Career: {rec['career_tag']}, "
              f"Risk: {rec['risk_profile']}{ga_tag}")

    print(f"\n🔬 NN vs ML: {result['nn_vs_ml']}")
    print(f"📊 Feature Importance (top 5): {result['feature_importance'][:5]}")

    print("\n" + "=" * 60)
    print("  Test completed!")
    print("=" * 60)
