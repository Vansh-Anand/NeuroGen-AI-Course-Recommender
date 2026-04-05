# Elective Recommendation Layer: Mathematical Foundation & Scoring Formula

## 1. Objective
The Elective Recommendation Layer is designed to simulate a student's performance across all available elective modules and rank them based on the maximum probability of academic success while heavily penalizing the probability of failure or withdrawal. The ultimate goal is to provide a Top-N list of electives that align with the student's historical performance trajectory.

## 2. Expected Value Formulation
The traditional Expected Value (EV) in decision theory is calculated by multiplying each possible outcome by its probability of occurrence and summing the results. 

In our context, the outcomes are categorical: $\{Distinction, Pass, Fail, Withdrawn\}$. We map these linguistic outcomes to specific utility weights (rewards or penalties) to construct a continuous ranking metric.

Let $U(C)$ denote the utility weight matrix for the classes:
* $U_{Distinction} = +w_d$ (Highest reward)
* $U_{Pass} = +w_p$ (Moderate reward)
* $U_{Fail} = -w_f$ (High penalty)
* $U_{Withdrawn} = -w_w$ (Moderate penalty)

For a given student vector $\mathbf{x}$ and an elective course $E_i$, the Neural Network generates a probability distribution:
$$ P(c | \mathbf{x}, E_i) = \{ P(Distinction), P(Pass), P(Fail), P(Withdrawn) \} $$

## 3. The Recommendation Scoring Formula
The Recommendation Score $S(E_i)$ for elective $E_i$ is computed as the expected utility:

$$ S(E_i) = \sum_{c \in C} P(c | \mathbf{x}, E_i) \cdot U_c $$

Expanding the formula with our chosen heuristic weights:
Let:
* $w_d = 1.5$ (Extra incentive for distinction)
* $w_p = 1.0$ (Base success weight)
* $w_w = 1.0$ (Penalty for withdrawal)
* $w_f = 2.0$ (Heavy penalty for failure)

The concrete scoring formula becomes:
$$ S(E_i) = 1.5 \cdot P(Distinction) + 1.0 \cdot P(Pass) - 2.0 \cdot P(Fail) - 1.0 \cdot P(Withdrawn) $$

### 3.1 Score Interpretation
* **Positive Score ($S > 0$)**: The expected outcome is skewed towards success. Higher scores indicate stronger confidence in passing or distinction.
* **Negative Score ($S < 0$)**: The expected outcome is skewed towards failure or withdrawal. The course poses a significant academic risk.
* **Maximum Possible Score**: $1.5$ (if $P(Distinction) = 1.0$)
* **Minimum Possible Score**: $-2.0$ (if $P(Fail) = 1.0$)

## 4. Simulation Mechanism
The OULAD dataset contains modules categorized by domain. To simulate a student taking a different elective than their original one, the recommendation engine creates $N$ copies of the student's base feature vector $\mathbf{x}$. 

For each copy $i \in \{1 \ldots N\}$:
1. The `code_module` feature is artificially replaced with $E_i$.
2. (Optional) Difficulty multipliers are applied to numerical features (like `avg_score` or `active_days`) based on historical domain difficulty matrices.
3. The modified vector $\mathbf{x}_i'$ is passed through the pre-processing pipeline (`encoder`, `scaler`).
4. The Neural Network model evaluates $\mathbf{x}_i'$ and outputs the probability vector.
5. The Scoring Formula calculates $S(E_i)$.
6. The list of electives is sorted descending by $S(E_i)$, and the Top-3 are presented to the user.

## 5. Summary
By bridging the probabilistic outputs of a multilayer perceptron with a risk-adjusted decision theoretic formula, this recommendation layer enables prescriptive analytics—moving beyond mere prediction to actionable academic advising.
