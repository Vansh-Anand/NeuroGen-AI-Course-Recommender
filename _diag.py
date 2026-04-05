import sys

out = open("diag_result.txt", "w")
out.write("Python: " + sys.version + "\n")

libs = ["flask", "flask_cors", "numpy", "pandas", "joblib", "sklearn", "skfuzzy"]
for lib in libs:
    try:
        __import__(lib)
        out.write(f"{lib} OK\n")
    except Exception as e:
        out.write(f"{lib} FAIL: {e}\n")

try:
    from neuro_fuzzy_system import NeuroFuzzyRiskClassifier
    out.write("neuro_fuzzy_system OK\n")
except Exception as e:
    out.write(f"neuro_fuzzy_system FAIL: {e}\n")

out.write("--- Done ---\n")
out.close()
