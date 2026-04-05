# Neuro-Fuzzy Inference System for Academic Risk Classification

## 1. Theoretical Explanation of Neuro-Fuzzy Systems

### 1.1 What Is a Neuro-Fuzzy System?

A **Neuro-Fuzzy System** is a hybrid intelligent approach that combines the **learning capabilities of neural networks** with the **human-interpretable reasoning of fuzzy logic**. It bridges two paradigms:

| Component | Strength | Weakness |
|---|---|---|
| **Neural Networks** | Learn complex patterns from data; produce accurate probability scores | "Black box" — hard to interpret decisions |
| **Fuzzy Logic** | Mimics human reasoning with linguistic rules (e.g., "IF risk is high THEN recommend remedial courses") | Requires manual rule design; cannot learn from data |

By combining them, a Neuro-Fuzzy system leverages the neural network's ability to **learn from data** while using fuzzy logic to provide **explainable, linguistically meaningful outputs**.

### 1.2 Architecture Overview

In our system, the pipeline works as follows:

```
┌─────────────────────────────────────────────────────────────────┐
│                    INPUT: Student Features                       │
│  (studied_credits, avg_score, total_clicks, demographics, ...)  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              NEURAL NETWORK LAYER (MLPClassifier)               │
│                                                                  │
│  Trained on OULAD dataset to produce probability scores:        │
│    P(Distinction), P(Pass), P(Fail), P(Withdrawn)               │
│                                                                  │
│  These 4 probabilities sum to 1.0                               │
└──────────────────────────┬──────────────────────────────────────┘
                           │  4 probability scores
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              FUZZY INFERENCE SYSTEM (FIS)                        │
│                                                                  │
│  Step 1: FUZZIFICATION                                          │
│    Convert crisp probabilities → fuzzy membership degrees        │
│    using triangular/trapezoidal membership functions              │
│                                                                  │
│  Step 2: RULE EVALUATION                                        │
│    Apply fuzzy IF-THEN rules (e.g.,                             │
│    "IF negative_prob is HIGH AND confidence is HIGH              │
│     THEN risk is HIGH")                                         │
│                                                                  │
│  Step 3: AGGREGATION                                            │
│    Combine fired rule outputs into a single fuzzy set            │
│                                                                  │
│  Step 4: DEFUZZIFICATION (Centroid method)                      │
│    Convert fuzzy output → crisp risk score (0-100)              │
└──────────────────────────┬──────────────────────────────────────┘
                           │  Risk Score (0-100)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    OUTPUT: Risk Classification                   │
│                                                                  │
│   0–35  →  LOW RISK    (Recommend advanced courses)             │
│  35–65  →  MEDIUM RISK (Recommend intermediate courses)         │
│  65–100 →  HIGH RISK   (Recommend foundational/remedial courses)│
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Key Concepts

- **Fuzzification**: Converting crisp numeric values (e.g., `P(Fail) = 0.45`) into degrees of membership in linguistic categories (e.g., "Medium" with degree 0.7, "High" with degree 0.3).

- **Fuzzy Rules**: Human-readable IF-THEN rules that capture expert knowledge. Example:  
  *IF negative_prob is HIGH AND positive_prob is LOW THEN risk is HIGH*

- **Inference Engine**: Evaluates all rules simultaneously, computing the contribution of each rule to the output.

- **Defuzzification**: Converts the aggregated fuzzy output back into a single crisp number using methods like **centroid** (center of gravity).

---

## 2. Design of Fuzzy Membership Functions

### 2.1 Input Variables

Our fuzzy system uses **three derived input variables** computed from the neural network's 4-class probability output:

#### Input 1: `positive_prob` — Probability of positive outcome
**Formula**: `P(Distinction) + P(Pass)`  
**Universe**: [0.0, 1.0]

| Linguistic Term | Type | Parameters | Interpretation |
|---|---|---|---|
| **Low** | Trapezoidal | [0.0, 0.0, 0.15, 0.35] | Student very unlikely to pass |
| **Medium** | Triangular | [0.2, 0.5, 0.8] | Moderate chance of passing |
| **High** | Trapezoidal | [0.65, 0.85, 1.0, 1.0] | Student very likely to pass |

```
1.0 ┤  Low        Medium         High
    │ ████                        ████
    │ █████                     ██████
    │ ██████  ▲              ▲ ███████
    │ ███████/ \            / \████████
    │ ██████/   \          /   \███████
    │ █████/     \        /     \██████
    │ ████/       \      /       \█████
0.0 ┼────┴────┴────┴────┴────┴────┴───
    0.0  0.15 0.35  0.5  0.65 0.85 1.0
```

#### Input 2: `negative_prob` — Probability of negative outcome
**Formula**: `P(Fail) + P(Withdrawn)`  
**Universe**: [0.0, 1.0]

| Linguistic Term | Type | Parameters | Interpretation |
|---|---|---|---|
| **Low** | Trapezoidal | [0.0, 0.0, 0.15, 0.35] | Unlikely to fail/withdraw |
| **Medium** | Triangular | [0.2, 0.5, 0.8] | Moderate risk of failure |
| **High** | Trapezoidal | [0.65, 0.85, 1.0, 1.0] | Very likely to fail/withdraw |

#### Input 3: `confidence` — Maximum class probability
**Formula**: `max(P(Distinction), P(Pass), P(Fail), P(Withdrawn))`  
**Universe**: [0.25, 1.0]  (minimum when all 4 classes are equally likely)

| Linguistic Term | Type | Parameters | Interpretation |
|---|---|---|---|
| **Low** | Trapezoidal | [0.25, 0.25, 0.35, 0.50] | Model is very uncertain |
| **Medium** | Triangular | [0.35, 0.55, 0.75] | Model is moderately confident |
| **High** | Trapezoidal | [0.65, 0.80, 1.0, 1.0] | Model is very confident |

### 2.2 Output Variable

#### Output: `risk_level` — Academic Risk Score
**Universe**: [0, 100]

| Linguistic Term | Type | Parameters | Interpretation |
|---|---|---|---|
| **Low** | Trapezoidal | [0, 0, 15, 35] | Student on track — low risk |
| **Medium** | Triangular | [25, 50, 75] | Student needs monitoring |
| **High** | Trapezoidal | [65, 85, 100, 100] | Student at serious risk |

---

## 3. Rule Base Design for Academic Risk Classification

### 3.1 Rule Design Philosophy

The rules are designed to capture these domain insights:
1. **High negative probability → High risk**, especially when confidence is high
2. **High positive probability → Low risk**, especially when confidence is high
3. **Low confidence → Medium risk**, regardless of other factors (uncertain predictions need attention)
4. **Balanced probabilities → Medium risk** (ambiguous students need monitoring)

### 3.2 Complete Rule Table

| # | IF `positive_prob` | AND `negative_prob` | AND `confidence` | THEN `risk_level` |
|---|---|---|---|---|
| 1 | High | Low | High | **Low** |
| 2 | High | Low | Medium | **Low** |
| 3 | High | Low | Low | **Medium** |
| 4 | High | Medium | High | **Medium** |
| 5 | High | Medium | Medium | **Medium** |
| 6 | High | Medium | Low | **Medium** |
| 7 | High | High | High | **Medium** |
| 8 | High | High | Medium | **Medium** |
| 9 | High | High | Low | **Medium** |
| 10 | Medium | Low | High | **Low** |
| 11 | Medium | Low | Medium | **Medium** |
| 12 | Medium | Low | Low | **Medium** |
| 13 | Medium | Medium | High | **Medium** |
| 14 | Medium | Medium | Medium | **Medium** |
| 15 | Medium | Medium | Low | **Medium** |
| 16 | Medium | High | High | **High** |
| 17 | Medium | High | Medium | **High** |
| 18 | Medium | High | Low | **Medium** |
| 19 | Low | Low | High | **Medium** |
| 20 | Low | Low | Medium | **Medium** |
| 21 | Low | Low | Low | **Medium** |
| 22 | Low | Medium | High | **High** |
| 23 | Low | Medium | Medium | **Medium** |
| 24 | Low | Medium | Low | **Medium** |
| 25 | Low | High | High | **High** |
| 26 | Low | High | Medium | **High** |
| 27 | Low | High | Low | **High** |

### 3.3 Key Rule Explanations

- **Rules 1–2**: Student is very likely to pass/get distinction with high confidence → **Low Risk**
- **Rules 25–27**: Student is very unlikely to pass and very likely to fail/withdraw → **High Risk** regardless of confidence
- **Rules 3, 6, 9, 12, 15, 18, 21, 24**: Low confidence makes predictions unreliable → generally **Medium Risk** to err on the side of caution
- **Rule 16–17**: Even with medium positive probability, high negative probability with confidence → **High Risk**

---

## 4. Integration with Existing Pipeline

### 4.1 Data Flow

```python
# 1. Neural network predicts class probabilities
probabilities = nn_model.predict_proba(input_scaled)[0]
# probabilities = [P(Distinction), P(Fail), P(Pass), P(Withdrawn)]

# 2. Fuzzy system classifies risk
classifier = NeuroFuzzyRiskClassifier()
risk_label, risk_score = classifier.classify(probabilities)
# risk_label = "Low Risk" | "Medium Risk" | "High Risk"
# risk_score = 0.0 to 100.0
```

### 4.2 Label Mapping

The neural network uses this class ordering (from LabelEncoder):
- Index 0 → Distinction
- Index 1 → Fail  
- Index 2 → Pass
- Index 3 → Withdrawn

The fuzzy system computes:
- `positive_prob = probabilities[0] + probabilities[2]`  (Distinction + Pass)
- `negative_prob = probabilities[1] + probabilities[3]`  (Fail + Withdrawn)
- `confidence = max(probabilities)`

---

## 5. References

1. Jang, J.-S.R. (1993). *ANFIS: Adaptive-Network-Based Fuzzy Inference System*. IEEE Trans. on Systems, Man, and Cybernetics.
2. Zadeh, L.A. (1965). *Fuzzy Sets*. Information and Control.
3. Mamdani, E.H. & Assilian, S. (1975). *An experiment in linguistic synthesis with a fuzzy logic controller*. International Journal of Man-Machine Studies.
4. scikit-fuzzy documentation: https://pythonhosted.org/scikit-fuzzy/
