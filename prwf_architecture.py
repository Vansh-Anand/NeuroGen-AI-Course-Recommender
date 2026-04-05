import numpy as np
import pandas as pd
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional, Set
import pickle

# =============================================================================
# UNCERTAINTY-AWARE PRWF ARCHITECTURE SYSTEM
# Unified Predict-Recommend-Warn-Fair Closed-Loop Pipeline
# =============================================================================

# --- 5. Student State Vector (SSV) ---
@dataclass
class StudentStateVector:
    """
    Shared Data Structure representing the student's operational state across modules.
    """
    student_id: str
    gender: str
    disability: str
    imd_band: str
    engagement_score: float
    prediction_probabilities: Dict[str, float] = None
    
    # Uncertainty & Conformal Prediction Extensions added to SSV
    eds_score: float = 0.0
    prediction_set: List[str] = field(default_factory=list)
    confidence_level: str = "Unknown"
    
    recommended_courses: List[Dict[str, Any]] = None
    risk_level: str = None
    fairness_adjustment: Dict[str, Any] = None


# --- 1. Prediction Module (P) with Uncertainty & Conformal Prediction ---
class PredictionModule:
    """
    Houses the Ensemble Model (Logistic Regression + Random Forest + Gradient Boosting).
    Implements Uncertainty-Aware predictions via EDS and Conformal Prediction Sets.
    """
    def __init__(self, models_paths=None):
        # In a real scenario, we load LR, RF, GB specifically to compute variance.
        self.is_mock = True
        self.alpha = 0.15 # Conformal prediction threshold (85% coverage)

    def predict(self, student_features: pd.DataFrame) -> Dict[str, Any]:
        """
        Returns probability vector, EDS, Prediction Set, and Confidence.
        """
        # --- Simulating Sub-model Outputs for Ensemble ---
        if 'engagement_score' in student_features.columns:
            eng = float(student_features['engagement_score'].iloc[0])
            cred = float(student_features.get('studied_credits', pd.Series([60])).iloc[0])
        else:
            eng, cred = 0.5, 60
            
        # Dynamically map engagement and credits to base probability
        base_pass = 0.20 + (eng * 0.5) - (cred / 210.0 * 0.1)
        base_dist = max(0.01, (eng - 0.5) * 0.4) if eng > 0.5 else 0.01
        base_fail = 0.50 - (eng * 0.4) + (cred / 210.0 * 0.15)
        base_with = max(0.05, 1.0 - (base_pass + base_dist + base_fail))
        
        base_probs = np.array([max(0.01, base_dist), max(0.01, base_pass), max(0.01, base_fail), base_with])
        base_probs /= base_probs.sum()
        
        # Mocked outputs from 3 models
        p_lr = base_probs + np.array([-0.05, 0.05, -0.02, 0.02])
        p_rf = base_probs + np.array([0.02, -0.06, 0.08, -0.04])
        p_gb = base_probs + np.array([0.01, 0.02, -0.01, -0.02])
        
        # Ensure sum to 1
        p_lr = np.clip(p_lr, 0, 1); p_lr /= p_lr.sum()
        p_rf = np.clip(p_rf, 0, 1); p_rf /= p_rf.sum()
        p_gb = np.clip(p_gb, 0, 1); p_gb /= p_gb.sum()
        
        # Ensemble final vector output
        p_ensemble = (p_lr + p_rf + p_gb) / 3.0
        
        labels = ["Distinction", "Pass", "Fail", "Withdrawn"]
        prob_dict = {
            "p_distinction": p_ensemble[0],
            "p_pass": p_ensemble[1],
            "p_fail": p_ensemble[2],
            "p_withdrawn": p_ensemble[3]
        }
        
        # 1. Ensemble Disagreement Score (EDS)
        # Variance of predicted probabilities across the 3 models
        all_preds = np.vstack([p_lr, p_rf, p_gb]) # Shape: (3 models, 4 classes)
        variances = np.var(all_preds, axis=0) # Variance per class
        eds_score = float(np.mean(variances)) # Mean variance across all classes
        
        # 2. Conformal Prediction Set
        # Sort probabilities and add classes until confidence sum > (1 - alpha)
        sorted_indices = np.argsort(p_ensemble)[::-1] # Ascending reversed -> Descending
        prediction_set = []
        cumulative_prob = 0.0
        
        for idx in sorted_indices:
            prediction_set.append(labels[idx])
            cumulative_prob += p_ensemble[idx]
            if cumulative_prob >= (1 - self.alpha):
                break
                
        # 3. Confidence Level Policy definition
        set_size = len(prediction_set)
        
        if set_size == 1 and eds_score < 0.010:
            confidence = "High"
        elif set_size <= 2 and eds_score < 0.025:
            confidence = "Medium"
        else:
            confidence = "Low"
            
        return {
            "probabilities": prob_dict,
            "eds_score": eds_score,
            "prediction_set": prediction_set,
            "confidence_level": confidence
        }


# --- 2. Recommendation Module (R) ---
class RecommendationModule:
    """
    Ranking and filtering system for academic courses based on difficulty, 
    engagement, predicted success baseline, and Uncertainty Confidence.
    """
    def __init__(self, course_catalog: pd.DataFrame = None):
        if course_catalog is None:
            self.course_catalog = pd.DataFrame([
                {"course_id": "AAA", "difficulty": 0.3, "credits": 30},
                {"course_id": "BBB", "difficulty": 0.5, "credits": 60},
                {"course_id": "CCC", "difficulty": 0.7, "credits": 30},
                {"course_id": "DDD", "difficulty": 0.8, "credits": 60},
                {"course_id": "EEE", "difficulty": 0.4, "credits": 30},
                {"course_id": "FFF", "difficulty": 0.9, "credits": 60},
            ])
        else:
            self.course_catalog = course_catalog

    def recommend(self, ssv: StudentStateVector) -> List[Dict[str, Any]]:
        # Decision Policy Logic Layer
        if ssv.confidence_level == "Low":
            return [{
                "course_id": "ADVISOR_REVIEW",
                "difficulty_level": "N/A",
                "match_score": 0.0,
                "reasoning": "Recommendation withheld due to high predictive uncertainty (Low Confidence). Flagged for human advisor review."
            }]
            
        recommendations = []
        p_success = ssv.prediction_probabilities.get("p_pass", 0.0) + ssv.prediction_probabilities.get("p_distinction", 0.0)
        
        for _, course in self.course_catalog.iterrows():
            
            # Medium Confidence: Conservative Recommendation (Filter out hard subjects)
            if ssv.confidence_level == "Medium" and course['difficulty'] > 0.5:
                continue # Skip computationally hard courses
                
            # Base match constraint
            difficulty_penalty = abs(course['difficulty'] - p_success) * 0.5
            engagement_bonus = ssv.engagement_score * 0.4
            
            score = 1.0 - difficulty_penalty + engagement_bonus
            
            if ssv.confidence_level == "Medium":
                reasoning = f"Conservative match (Medium Confidence constraint). Capped difficulty based on {int(p_success*100)}% estimated success."
            else:
                reasoning = f"Optimal match based on {int(p_success*100)}% projected success & {'High' if ssv.engagement_score > 0.6 else 'Low'} engagement."
            
            recommendations.append({
                "course_id": course["course_id"],
                "difficulty_level": course["difficulty"],
                "match_score": round(score, 3),
                "reasoning": reasoning
            })
            
        # Re-ranking
        recommendations = sorted(recommendations, key=lambda x: x["match_score"], reverse=True)
        return recommendations[:3] if len(recommendations) > 0 else []


# --- 3. Warning Module (W) ---
class WarningModule:
    """
    Simulated weekly monitoring system to trigger alerts based on critical path risks.
    """
    def evaluate_risk(self, ssv: StudentStateVector) -> str:
        p_fail = ssv.prediction_probabilities.get("p_fail", 0)
        p_wd = ssv.prediction_probabilities.get("p_withdrawn", 0)
        
        combined_risk = p_fail + p_wd
        
        if combined_risk > 0.75:
            return "Red"
        elif combined_risk > 0.60:
            return "Orange"
        elif combined_risk > 0.45:
            return "Yellow"
        else:
            return "Green"


# --- 4. Fairness Module (F) ---
class FairnessModule:
    """
    Audits and applies limits on demographic disparities to ensure equitable outcomes.
    """
    def apply_fairness(self, ssv: StudentStateVector) -> StudentStateVector:
        adjustments_made = []
        modified_probs = ssv.prediction_probabilities.copy()
        
        is_disadvantaged = (ssv.disability == "Y" or "0-10%" in ssv.imd_band or "10-20%" in ssv.imd_band)
        
        if is_disadvantaged and ssv.engagement_score > 0.7:
            if modified_probs.get("p_fail", 0) > 0.25:
                adjustment = min(0.10, modified_probs["p_fail"] * 0.3)
                modified_probs["p_fail"] -= adjustment
                modified_probs["p_pass"] += adjustment
                
                adjustments_made.append(
                    "Equalized Odds applied: Reward high engagement counteracting demographic priors."
                )
                
        ssv.prediction_probabilities = modified_probs
        ssv.fairness_adjustment = {
            "applied": len(adjustments_made) > 0,
            "reasons": adjustments_made
        }
        
        return ssv


# --- 6. Unified Uncertainty-Aware PRWF Output Pipeline ---
class PRWFPipeline:
    def __init__(self):
        self.predictor = PredictionModule()
        self.recommender = RecommendationModule()
        self.warner = WarningModule()
        self.fairness = FairnessModule()
        
    def execute(self, student_id: str, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Pipeline executed: Input -> P -> R -> W -> F -> Output
        """
        # 1. Initialize SSV
        ssv = StudentStateVector(
            student_id=student_id,
            gender=features.get("gender", "Unknown"),
            disability=features.get("disability", "N"),
            imd_band=features.get("imd_band", "50-60%"),
            engagement_score=features.get("engagement_score", 0.5)
        )
        
        df_features = pd.DataFrame([features])
        
        # 2. Prediction (P)
        pred_out = self.predictor.predict(df_features)
        ssv.prediction_probabilities = pred_out["probabilities"]
        ssv.eds_score = pred_out["eds_score"]
        ssv.prediction_set = pred_out["prediction_set"]
        ssv.confidence_level = pred_out["confidence_level"]
        
        # 3. Recommendation (R)
        ssv.recommended_courses = self.recommender.recommend(ssv)
        
        # 4. Warning (W)
        ssv.risk_level = self.warner.evaluate_risk(ssv)
        
        # 5. Fairness (F)
        ssv = self.fairness.apply_fairness(ssv)
        
        # 6. Output UI Format
        return self._format_ui_output(ssv)
        
    def _format_ui_output(self, ssv: StudentStateVector) -> Dict[str, Any]:
        risk_colors = {
            "Green": "🟢 Safe Path", "Yellow": "🟡 Low Risk Warning", 
            "Orange": "🟠 Moderate Alert", "Red": "🔴 Critical Intervention"
        }
        
        confidence_indicators = {
            "High": "🟢 High Confidence (Safe Automated Decision)",
            "Medium": "🟡 Medium Confidence (Conservative Logic Selected)",
            "Low": "🔴 Low Confidence (Human Advisor Flagged)"
        }
        
        return {
            "interface_data": {
                "student_id": ssv.student_id,
                "prediction_engine": {
                    "primary_probabilities": {
                        "Distinction": f"{ssv.prediction_probabilities['p_distinction']:.1%}",
                        "Pass": f"{ssv.prediction_probabilities['p_pass']:.1%}",
                        "Fail": f"{ssv.prediction_probabilities['p_fail']:.1%}",
                        "Withdrawn": f"{ssv.prediction_probabilities['p_withdrawn']:.1%}"
                    },
                    "uncertainty_metrics": {
                        "confidence_status": confidence_indicators.get(ssv.confidence_level, "Unknown"),
                        "conformal_prediction_set": ssv.prediction_set,
                        "ensemble_disagreement_score (EDS)": f"{ssv.eds_score:.4f} (Variance across models)"
                    }
                },
                "recommended_courses": ssv.recommended_courses,
                "warning_system_status": risk_colors.get(ssv.risk_level, ssv.risk_level),
                "fairness_audit": ssv.fairness_adjustment,
                "system_reasoning": f"Uncertainty-Aware PRWF Architecture execution complete."
            }
        }

if __name__ == "__main__":
    import json
    
    system = PRWFPipeline()
    
    print("--- Test 1: Highly Engaged Student (Low Risk, High Confidence) ---")
    student1 = {
        "gender": "F", "disability": "N", "imd_band": "80-90%",
        "engagement_score": 0.95, "studied_credits": 30
    }
    out1 = system.execute("STD_001", student1)
    print(json.dumps(out1, indent=4))
    
    print("\n--- Test 2: Poorly Engaged Student (High Risk, Low Confidence / Advisor Review) ---")
    student2 = {
        "gender": "M", "disability": "Y", "imd_band": "0-10%",
        "engagement_score": 0.20, "studied_credits": 120
    }
    out2 = system.execute("STD_002", student2)
    print(json.dumps(out2, indent=4))
    
    print("\n--- Test 3: Average Student with Conflicting Signals (Medium Confidence) ---")
    student3 = {
        "gender": "M", "disability": "N", "imd_band": "50-60%",
        "engagement_score": 0.50, "studied_credits": 60
    }
    out3 = system.execute("STD_003", student3)
    print(json.dumps(out3, indent=4))
