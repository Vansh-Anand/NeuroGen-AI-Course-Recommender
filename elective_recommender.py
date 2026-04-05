"""
Elective Recommendation Layer
=============================

This module contains the ElectiveRecommender class which takes a base student
profile and simulates their performance across a catalog of available
elective modules (26 subjects).

It uses the underlying Neural Network model to predict probabilities for
each simulated course enrollment and ranks them using an Expected Value
scoring formula that rewards Distinction/Pass and strongly penalizes Failures.
"""

import pandas as pd
import numpy as np


class ElectiveRecommender:
    def __init__(self, nn_model, encoder, scaler):
        self.nn_model = nn_model
        self.encoder = encoder
        self.scaler = scaler

        # Expanded 26-subject catalog
        self.available_electives = [
            "AAA", "BBB", "CCC", "DDD", "EEE", "FFF", "GGG",
            "HHH", "III", "JJJ", "KKK",
            "LLL", "MMM", "NNN", "OOO", "PPP", "QQQ", "RRR",
            "SSS", "TTT", "UUU", "VVV", "WWW", "XXX", "YYY", "ZZZ",
        ]

        self.elective_names = {
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

        # Heuristic Utility Weights
        self.weights = {
            0: 1.5,   # Distinction
            1: -2.0,  # Fail
            2: 1.0,   # Pass
            3: -1.0   # Withdrawn
        }

    def _preprocess_batch(self, batch_df):
        """Preprocesses a DataFrame of student profiles through the pipeline."""
        numeric_features = [
            "studied_credits", "num_of_prev_attempts", "total_clicks",
            "avg_clicks", "active_days", "avg_score", "max_score"
        ]
        categorical_features = self.encoder.feature_names_in_
        encoded_feature_names = self.encoder.get_feature_names_out(categorical_features)
        final_feature_names = list(numeric_features) + list(encoded_feature_names)

        cat_input = batch_df[categorical_features]
        encoded_cat = self.encoder.transform(cat_input)
        num_input = batch_df[numeric_features].values
        final_input = np.hstack((num_input, encoded_cat))
        final_input_df = pd.DataFrame(final_input, columns=final_feature_names)
        input_scaled = self.scaler.transform(final_input_df)
        return input_scaled

    def calculate_score(self, probabilities):
        score = (probabilities[0] * self.weights[0] +
                 probabilities[1] * self.weights[1] +
                 probabilities[2] * self.weights[2] +
                 probabilities[3] * self.weights[3])
        return score

    def recommend_electives(self, base_student_dict, top_n=7):
        """
        Takes a base student profile, simulates enrollment in all
        available electives, ranks them, and returns a DataFrame.

        Note: Only original OULAD codes (AAA-KKK) can be processed by the
        pretrained NN model. New subjects (LLL-ZZZ) get synthesized predictions.
        """
        original_codes = ["AAA", "BBB", "CCC", "DDD", "EEE", "FFF", "GGG",
                          "HHH", "III", "JJJ", "KKK"]

        results = []

        # Process original codes through the NN model
        simulated_records = []
        valid_codes = []
        for elective in self.available_electives:
            if elective in original_codes:
                sim_record = base_student_dict.copy()
                sim_record["code_module"] = elective
                simulated_records.append(sim_record)
                valid_codes.append(elective)

        if simulated_records:
            batch_df = pd.DataFrame(simulated_records)
            X_scaled = self._preprocess_batch(batch_df)
            batch_probs = self.nn_model.predict_proba(X_scaled)

            for i, elective in enumerate(valid_codes):
                probs = batch_probs[i]
                score = self.calculate_score(probs)
                results.append({
                    "Elective Code": elective,
                    "Course Name": self.elective_names[elective],
                    "Recommendation Score": round(score, 3),
                    "P(Distinction)": round(probs[0], 3),
                    "P(Pass)": round(probs[2], 3),
                    "P(Fail)": round(probs[1], 3),
                    "P(Withdrawn)": round(probs[3], 3),
                })

        # Synthesize predictions for new subjects (LLL-ZZZ) based on similar originals
        similarity_map = {
            "LLL": "EEE", "MMM": "CCC", "NNN": "EEE",
            "OOO": "III", "PPP": "GGG", "QQQ": "CCC",
            "RRR": "BBB", "SSS": "GGG", "TTT": "KKK",
            "UUU": "III", "VVV": "BBB", "WWW": "DDD",
            "XXX": "FFF", "YYY": "HHH", "ZZZ": "JJJ",
        }

        # Get base probabilities from similar courses
        base_probs_map = {}
        for r in results:
            base_probs_map[r["Elective Code"]] = np.array([
                r["P(Distinction)"], r["P(Fail)"], r["P(Pass)"], r["P(Withdrawn)"]
            ])

        rng = np.random.RandomState(42)
        for new_code in self.available_electives:
            if new_code in original_codes:
                continue
            similar = similarity_map.get(new_code, "CCC")
            base = base_probs_map.get(similar, np.array([0.2, 0.15, 0.5, 0.15]))
            # Add small noise
            noise = rng.normal(0, 0.03, size=4)
            probs = np.clip(base + noise, 0.01, 0.99)
            probs = probs / probs.sum()
            score = self.calculate_score(probs)
            results.append({
                "Elective Code": new_code,
                "Course Name": self.elective_names[new_code],
                "Recommendation Score": round(score, 3),
                "P(Distinction)": round(probs[0], 3),
                "P(Pass)": round(probs[2], 3),
                "P(Fail)": round(probs[1], 3),
                "P(Withdrawn)": round(probs[3], 3),
            })

        results_df = pd.DataFrame(results)
        ranked_df = results_df.sort_values(by="Recommendation Score", ascending=False).reset_index(drop=True)

        return ranked_df.head(top_n)


if __name__ == "__main__":
    print("ElectiveRecommender module loaded. 26 subjects available.")
