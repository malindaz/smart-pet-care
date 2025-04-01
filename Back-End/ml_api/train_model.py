import pandas as pd
import numpy as np
import pickle
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# Enhanced dataset with pet diseases and symptoms
data = {
    "symptoms": [
        "vomiting diarrhea lethargy",
        "bloody diarrhea vomiting dehydration",
        "coughing sneezing nasal discharge",
        "sneezing watery eyes nasal discharge",
        "loss of appetite weight loss lethargy",
        "increased thirst urination weight loss",
        "itching scratching hair loss redness",
        "red inflamed ears head shaking",
        "limping joint pain difficulty moving",
        "seizures disorientation collapse",
        "bad breath difficulty eating",
        "sores on skin hair loss redness",
        "swollen abdomen difficulty breathing",
        "lethargy pale gums weakness",
        "difficulty breathing coughing wheezing",
        "fever lethargy loss of appetite",
        "redness irritation discharge eyes",
        "wounds bleeding swelling",
        "excessive barking pacing anxiety",
        "swollen joints lameness fever"
    ],
    "disease": [
        "Gastroenteritis",
        "Parvovirus",
        "Kennel Cough",
        "Upper Respiratory Infection",
        "Malnutrition",
        "Diabetes",
        "Skin Allergy",
        "Ear Infection",
        "Arthritis",
        "Epilepsy",
        "Dental Disease",
        "Hotspot",
        "Bloat",
        "Anemia",
        "Asthma",
        "Viral Infection",
        "Conjunctivitis",
        "Wound Infection",
        "Anxiety Disorder",
        "Lyme Disease"
    ]
}

df = pd.DataFrame(data)

# Train on the full dataset instead of splitting
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(df["symptoms"])
y = df["disease"]

# Train the model
model = MultinomialNB()
model.fit(X, y)

# Save the trained model and vectorizer
pickle.dump(model, open("model.pkl", "wb"))
pickle.dump(vectorizer, open("vectorizer.pkl", "wb"))

print("Model training complete. Files saved as model.pkl and vectorizer.pkl")

# Test some example inputs
test_symptoms = [
    "vomiting and diarrhea",
    "coughing a lot",
    "scratching and hair loss",
    "limping and joint pain"
]

print("\nPrediction Examples:")
for symptom in test_symptoms:
    transformed = vectorizer.transform([symptom])
    prediction = model.predict(transformed)[0]
    print(f"Symptoms: '{symptom}' → Predicted Disease: '{prediction}'")