"""
Neuro-Fuzzy Inference System for Academic Risk Classification
=============================================================

This module implements a Mamdani-type Fuzzy Inference System that takes
neural network probability outputs (for Distinction, Fail, Pass, Withdrawn)
and classifies students into Low, Medium, or High academic risk categories.

Architecture:
    Neural Network → [P(Dist), P(Fail), P(Pass), P(With)] → Fuzzy Inference → Risk Level

Dependencies:
    - numpy
    - scikit-fuzzy (pip install scikit-fuzzy)

Usage:
    from neuro_fuzzy_system import NeuroFuzzyRiskClassifier

    classifier = NeuroFuzzyRiskClassifier()
    probabilities = [0.05, 0.60, 0.10, 0.25]  # [Distinction, Fail, Pass, Withdrawn]
    risk_label, risk_score = classifier.classify(probabilities)
"""

import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl


class NeuroFuzzyRiskClassifier:
    """
    A Mamdani-type Fuzzy Inference System for academic risk classification.

    The system takes 4-class probability outputs from a neural network
    (Distinction, Fail, Pass, Withdrawn) and produces a risk classification
    (Low, Medium, High) with a numeric risk score (0-100).

    Attributes:
        simulation: The compiled fuzzy control system simulation.
    """

    # Class-level constants for risk thresholds
    LOW_RISK_THRESHOLD = 35.0
    HIGH_RISK_THRESHOLD = 65.0

    def __init__(self):
        """Initialize the fuzzy inference system with variables, MFs, and rules."""
        self._build_system()

    def _build_system(self):
        """
        Build the complete fuzzy inference system:
        1. Define input/output universe & membership functions
        2. Define fuzzy rules
        3. Compile the control system
        """
        # ============================================================
        # Step 1: Define fuzzy input and output variables
        # ============================================================

        # --- Input 1: Positive Probability (Distinction + Pass) ---
        self.positive_prob = ctrl.Antecedent(
            np.arange(0.0, 1.01, 0.01), 'positive_prob'
        )
        # --- Input 2: Negative Probability (Fail + Withdrawn) ---
        self.negative_prob = ctrl.Antecedent(
            np.arange(0.0, 1.01, 0.01), 'negative_prob'
        )
        # --- Input 3: Confidence (max class probability) ---
        self.confidence = ctrl.Antecedent(
            np.arange(0.25, 1.01, 0.01), 'confidence'
        )
        # --- Output: Risk Level (0 to 100) ---
        self.risk_level = ctrl.Consequent(
            np.arange(0, 101, 1), 'risk_level'
        )

        # ============================================================
        # Step 2: Define membership functions
        # ============================================================
        self._define_membership_functions()

        # ============================================================
        # Step 3: Define fuzzy rules
        # ============================================================
        rules = self._define_rules()

        # ============================================================
        # Step 4: Build & compile the control system
        # ============================================================
        self.control_system = ctrl.ControlSystem(rules)
        self.simulation = ctrl.ControlSystemSimulation(self.control_system)

    def _define_membership_functions(self):
        """Define triangular and trapezoidal membership functions for all variables."""

        # --- positive_prob membership functions ---
        self.positive_prob['low'] = fuzz.trapmf(
            self.positive_prob.universe, [0.0, 0.0, 0.15, 0.35]
        )
        self.positive_prob['medium'] = fuzz.trimf(
            self.positive_prob.universe, [0.2, 0.5, 0.8]
        )
        self.positive_prob['high'] = fuzz.trapmf(
            self.positive_prob.universe, [0.65, 0.85, 1.0, 1.0]
        )

        # --- negative_prob membership functions ---
        self.negative_prob['low'] = fuzz.trapmf(
            self.negative_prob.universe, [0.0, 0.0, 0.15, 0.35]
        )
        self.negative_prob['medium'] = fuzz.trimf(
            self.negative_prob.universe, [0.2, 0.5, 0.8]
        )
        self.negative_prob['high'] = fuzz.trapmf(
            self.negative_prob.universe, [0.65, 0.85, 1.0, 1.0]
        )

        # --- confidence membership functions ---
        self.confidence['low'] = fuzz.trapmf(
            self.confidence.universe, [0.25, 0.25, 0.35, 0.50]
        )
        self.confidence['medium'] = fuzz.trimf(
            self.confidence.universe, [0.35, 0.55, 0.75]
        )
        self.confidence['high'] = fuzz.trapmf(
            self.confidence.universe, [0.65, 0.80, 1.0, 1.0]
        )

        # --- risk_level membership functions ---
        self.risk_level['low'] = fuzz.trapmf(
            self.risk_level.universe, [0, 0, 15, 35]
        )
        self.risk_level['medium'] = fuzz.trimf(
            self.risk_level.universe, [25, 50, 75]
        )
        self.risk_level['high'] = fuzz.trapmf(
            self.risk_level.universe, [65, 85, 100, 100]
        )

    def _define_rules(self):
        """
        Define the 27 fuzzy IF-THEN rules for risk classification.

        Rules encode expert knowledge about academic risk:
        - High negative probability + high confidence → High risk
        - High positive probability + high confidence → Low risk
        - Low confidence → Medium risk (uncertain predictions need caution)
        - Balanced probabilities → Medium risk (ambiguous students need monitoring)
        """
        pp = self.positive_prob
        np_ = self.negative_prob
        cf = self.confidence
        rl = self.risk_level

        rules = [
            # positive_prob=High
            ctrl.Rule(pp['high'] & np_['low'] & cf['high'], rl['low']),       # R1
            ctrl.Rule(pp['high'] & np_['low'] & cf['medium'], rl['low']),     # R2
            ctrl.Rule(pp['high'] & np_['low'] & cf['low'], rl['medium']),     # R3
            ctrl.Rule(pp['high'] & np_['medium'] & cf['high'], rl['medium']), # R4
            ctrl.Rule(pp['high'] & np_['medium'] & cf['medium'], rl['medium']),# R5
            ctrl.Rule(pp['high'] & np_['medium'] & cf['low'], rl['medium']),  # R6
            ctrl.Rule(pp['high'] & np_['high'] & cf['high'], rl['medium']),   # R7
            ctrl.Rule(pp['high'] & np_['high'] & cf['medium'], rl['medium']), # R8
            ctrl.Rule(pp['high'] & np_['high'] & cf['low'], rl['medium']),    # R9

            # positive_prob=Medium
            ctrl.Rule(pp['medium'] & np_['low'] & cf['high'], rl['low']),     # R10
            ctrl.Rule(pp['medium'] & np_['low'] & cf['medium'], rl['medium']),# R11
            ctrl.Rule(pp['medium'] & np_['low'] & cf['low'], rl['medium']),   # R12
            ctrl.Rule(pp['medium'] & np_['medium'] & cf['high'], rl['medium']),# R13
            ctrl.Rule(pp['medium'] & np_['medium'] & cf['medium'], rl['medium']),# R14
            ctrl.Rule(pp['medium'] & np_['medium'] & cf['low'], rl['medium']),# R15
            ctrl.Rule(pp['medium'] & np_['high'] & cf['high'], rl['high']),   # R16
            ctrl.Rule(pp['medium'] & np_['high'] & cf['medium'], rl['high']), # R17
            ctrl.Rule(pp['medium'] & np_['high'] & cf['low'], rl['medium']),  # R18

            # positive_prob=Low
            ctrl.Rule(pp['low'] & np_['low'] & cf['high'], rl['medium']),     # R19
            ctrl.Rule(pp['low'] & np_['low'] & cf['medium'], rl['medium']),   # R20
            ctrl.Rule(pp['low'] & np_['low'] & cf['low'], rl['medium']),      # R21
            ctrl.Rule(pp['low'] & np_['medium'] & cf['high'], rl['high']),    # R22
            ctrl.Rule(pp['low'] & np_['medium'] & cf['medium'], rl['medium']),# R23
            ctrl.Rule(pp['low'] & np_['medium'] & cf['low'], rl['medium']),   # R24
            ctrl.Rule(pp['low'] & np_['high'] & cf['high'], rl['high']),      # R25
            ctrl.Rule(pp['low'] & np_['high'] & cf['medium'], rl['high']),    # R26
            ctrl.Rule(pp['low'] & np_['high'] & cf['low'], rl['high']),       # R27
        ]

        return rules

    def _compute_inputs(self, probabilities):
        """
        Derive the three fuzzy input values from the 4-class probability array.

        Args:
            probabilities: array-like of shape (4,) —
                [P(Distinction), P(Fail), P(Pass), P(Withdrawn)]
                (indices 0=Distinction, 1=Fail, 2=Pass, 3=Withdrawn)

        Returns:
            tuple: (positive_prob, negative_prob, confidence)
        """
        probs = np.asarray(probabilities, dtype=float)

        positive = float(probs[0] + probs[2])   # Distinction + Pass
        negative = float(probs[1] + probs[3])    # Fail + Withdrawn
        conf = float(np.max(probs))              # max class probability

        # Clamp values to the valid universe ranges
        positive = np.clip(positive, 0.0, 1.0)
        negative = np.clip(negative, 0.0, 1.0)
        conf = np.clip(conf, 0.25, 1.0)

        return positive, negative, conf

    def _score_to_label(self, score):
        """
        Convert a numeric risk score (0-100) to a linguistic label.

        Args:
            score: float in [0, 100]

        Returns:
            str: "Low Risk", "Medium Risk", or "High Risk"
        """
        if score < self.LOW_RISK_THRESHOLD:
            return "Low Risk"
        elif score < self.HIGH_RISK_THRESHOLD:
            return "Medium Risk"
        else:
            return "High Risk"

    def classify(self, probabilities):
        """
        Classify a single student's academic risk.

        Args:
            probabilities: array-like of shape (4,) —
                [P(Distinction), P(Fail), P(Pass), P(Withdrawn)]

        Returns:
            tuple: (risk_label: str, risk_score: float)
                risk_label: "Low Risk", "Medium Risk", or "High Risk"
                risk_score: numeric score in [0, 100]
        """
        positive, negative, conf = self._compute_inputs(probabilities)

        # Feed inputs into the fuzzy simulation
        self.simulation.input['positive_prob'] = positive
        self.simulation.input['negative_prob'] = negative
        self.simulation.input['confidence'] = conf

        # Compute the fuzzy inference
        self.simulation.compute()

        # Extract the defuzzified output
        risk_score = float(self.simulation.output['risk_level'])
        risk_label = self._score_to_label(risk_score)

        return risk_label, round(risk_score, 2)

    def classify_batch(self, probabilities_array):
        """
        Classify risk for a batch of students.

        Args:
            probabilities_array: array-like of shape (n_students, 4)

        Returns:
            list of tuples: [(risk_label, risk_score), ...]
        """
        results = []
        for probs in probabilities_array:
            results.append(self.classify(probs))
        return results

    def get_input_summary(self, probabilities):
        """
        Get a human-readable summary of the fuzzy input derivation.

        Args:
            probabilities: array-like of shape (4,)

        Returns:
            dict with keys: positive_prob, negative_prob, confidence,
                            and the component probabilities
        """
        probs = np.asarray(probabilities, dtype=float)
        positive, negative, conf = self._compute_inputs(probs)

        return {
            "P(Distinction)": round(float(probs[0]), 4),
            "P(Fail)": round(float(probs[1]), 4),
            "P(Pass)": round(float(probs[2]), 4),
            "P(Withdrawn)": round(float(probs[3]), 4),
            "Positive Probability (Dist+Pass)": round(positive, 4),
            "Negative Probability (Fail+With)": round(negative, 4),
            "Model Confidence": round(conf, 4),
        }


# =============================================================
# Module-level convenience functions
# =============================================================

def create_classifier():
    """Factory function to create a configured NeuroFuzzyRiskClassifier."""
    return NeuroFuzzyRiskClassifier()


# =============================================================
# Quick test when run directly
# =============================================================
if __name__ == "__main__":
    print("=" * 60)
    print("  Neuro-Fuzzy Risk Classifier — Quick Test")
    print("=" * 60)

    classifier = NeuroFuzzyRiskClassifier()

    test_cases = [
        ("High performer",   [0.60, 0.05, 0.30, 0.05]),
        ("Average student",  [0.10, 0.25, 0.40, 0.25]),
        ("At-risk student",  [0.02, 0.55, 0.08, 0.35]),
        ("Likely withdrawn", [0.03, 0.15, 0.07, 0.75]),
        ("Uncertain model",  [0.25, 0.25, 0.25, 0.25]),
    ]

    for label, probs in test_cases:
        risk_label, risk_score = classifier.classify(probs)
        summary = classifier.get_input_summary(probs)
        print(f"\n--- {label} ---")
        print(f"  Probabilities: {probs}")
        print(f"  Positive prob: {summary['Positive Probability (Dist+Pass)']:.2f}")
        print(f"  Negative prob: {summary['Negative Probability (Fail+With)']:.2f}")
        print(f"  Confidence:    {summary['Model Confidence']:.2f}")
        print(f"  → Risk Score:  {risk_score:.1f}")
        print(f"  → Risk Label:  {risk_label}")

    print("\n" + "=" * 60)
    print("  All tests completed successfully!")
    print("=" * 60)
