import streamlit as st
import pandas as pd
import numpy as np
import joblib
from neuro_fuzzy_system import NeuroFuzzyRiskClassifier
from elective_recommender import ElectiveRecommender

# =========================
# 1. LOAD MODEL OBJECTS
# =========================
nn_model = joblib.load("nn_model.pkl")
scaler = joblib.load("scaler.pkl")
encoder = joblib.load("encoder.pkl")

# =========================
# 1b. INITIALIZE CLASSIFIERS & RECOMMENDERS
# =========================
fuzzy_classifier = NeuroFuzzyRiskClassifier()
elective_recommender = ElectiveRecommender(nn_model, encoder, scaler)

# =========================
# 2. FEATURE DEFINITIONS (FROM TRAINING)
# =========================

# Numeric features used during training
numeric_features = [
    "studied_credits",
    "num_of_prev_attempts",
    "total_clicks",
    "avg_clicks",
    "active_days",
    "avg_score",
    "max_score"
]

# Categorical features in training order
categorical_features = encoder.feature_names_in_

# One-hot encoded feature names
encoded_feature_names = encoder.get_feature_names_out(categorical_features)

# Final feature order used for scaler
final_feature_names = list(numeric_features) + list(encoded_feature_names)

# =========================
# 3. STREAMLIT UI
# =========================
st.title("Intelligent Course Recommendation System")
st.write("Predict student performance, assess risk, and recommend electives based on expected utility.")

gender = st.selectbox("Gender", ["M", "F"])
age_band = st.selectbox("Age Band", ["0-35", "35-55", "55+"])
education = st.selectbox(
    "Highest Education",
    ["Lower Than A Level", "A Level or Equivalent", "HE Qualification"]
)

studied_credits = st.slider("Studied Credits", 0, 120, 60)
avg_clicks = st.slider("Average Clicks", 0, 500, 100)
avg_score = st.slider("Average Score", 0, 100, 60)
num_of_prev_attempts = 0
total_clicks = avg_clicks * 10
active_days = 30
max_score = avg_score


# =========================
# 4. DEFAULT VALUES (NON-UI)
# =========================
region = "South East"
imd_band = "20-30%"
disability = "N"
code_module = "CCC"
code_presentation = "2014J"
# Default numeric values (not taken from UI)
num_of_prev_attempts = 0
total_clicks = avg_clicks * 10
active_days = 30
max_score = avg_score


# =========================
# 5. INPUT DATAFRAME DICT
# =========================
base_student_data = {
    "gender": gender,
    "age_band": age_band,
    "highest_education": education,
    "region": region,
    "imd_band": imd_band,
    "disability": disability,
    "code_module": code_module,
    "code_presentation": code_presentation,
    "studied_credits": studied_credits,
    "num_of_prev_attempts": num_of_prev_attempts,
    "total_clicks": total_clicks,
    "avg_clicks": avg_clicks,
    "active_days": active_days,
    "avg_score": avg_score,
    "max_score": max_score
}
input_df = pd.DataFrame([base_student_data])

# =========================
# 6. PREPROCESSING
# =========================

# Encode categorical features
cat_input = input_df[categorical_features]
encoded_cat = encoder.transform(cat_input)

# Numeric features
num_input = input_df[numeric_features].values

# Combine numeric + encoded
final_input = np.hstack((num_input, encoded_cat))

# Convert to DataFrame with correct feature names
final_input_df = pd.DataFrame(final_input, columns=final_feature_names)

# Scale
input_scaled = scaler.transform(final_input_df)

# =========================
# 7. PREDICTION & NEURO-FUZZY RISK ASSESSMENT
# =========================
if st.button("Predict Outcome & Recommend Electives"):

    prediction = nn_model.predict(input_scaled)[0]
    probabilities = nn_model.predict_proba(input_scaled)[0]

    label_map = {
        0: "Distinction",
        1: "Fail",
        2: "Pass",
        3: "Withdrawn"
    }

    predicted_label = label_map[prediction]

    # --- Neuro-Fuzzy Risk Classification ---
    risk_label, risk_score = fuzzy_classifier.classify(probabilities)
    input_summary = fuzzy_classifier.get_input_summary(probabilities)

    # --- Display Prediction Result ---
    st.header("1. Baseline Outcome Prediction")
    st.subheader(f"Current Module ({code_module}) Predicted Outcome: **{predicted_label}**")

    # --- Display Probability Breakdown ---
    prob_df = pd.DataFrame({
        "Class": ["Distinction", "Fail", "Pass", "Withdrawn"],
        "Probability": [
            f"{probabilities[0]:.4f}",
            f"{probabilities[1]:.4f}",
            f"{probabilities[2]:.4f}",
            f"{probabilities[3]:.4f}"
        ]
    })
    st.table(prob_df)

    # --- Display Risk Assessment ---
    st.header("2. Neuro-Fuzzy Risk Assessment")
    st.write(f"**Positive Probability (Distinction + Pass):** {input_summary['Positive Probability (Dist+Pass)']:.4f}")
    st.write(f"**Negative Probability (Fail + Withdrawn):** {input_summary['Negative Probability (Fail+With)']:.4f}")
    st.write(f"**Model Confidence:** {input_summary['Model Confidence']:.4f}")
    st.write(f"### Overall Risk Score: **{risk_score:.1f} / 100**")
    
    if risk_label == "High Risk":
        st.error(f"Student Risk Level: **{risk_label}**. Close monitoring and intervention required.")
    elif risk_label == "Medium Risk":
        st.warning(f"Student Risk Level: **{risk_label}**. Potential difficulty indicated.")
    else:
        st.success(f"Student Risk Level: **{risk_label}**. Student is on track.")

    # --- Elective Recommendations ---
    st.header("3. Top Elective Recommendations")
    st.write("Simulating student performance across all available elective modules (using Expected Value scoring with risk penalty)...")
    
    # Generate recommendations
    ranked_electives_df = elective_recommender.recommend_electives(base_student_data, top_n=3)
    
    st.dataframe(
        ranked_electives_df, 
        use_container_width=True, 
        hide_index=True
    )
    
    st.info("💡 **Recommendation Score Interpretation**: Higher scores strongly favor Pass/Distinction probabilities, while aggressively penalizing Failure probabilities.")

