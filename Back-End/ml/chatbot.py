import sys
import json
import pandas as pd
import numpy as np
import pickle
import re
import os
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# Set paths relative to the script location
script_dir = os.path.dirname(os.path.abspath(__file__))
DISEASE_DATA_PATH = os.path.join(script_dir, 'disease_data.csv')
DISEASE_INFO_PATH = os.path.join(script_dir, 'disease_info.csv')
CONVERSATION_DATA_PATH = os.path.join(script_dir, 'conversation_data.csv')
MODEL_PATH = os.path.join(script_dir, 'trained_model.pkl')

# Check if model exists, if not train a new one
def load_or_train_model():
    try:
        with open(MODEL_PATH, 'rb') as f:
            model_data = pickle.load(f)
            vectorizer = model_data['vectorizer']
            model = model_data['model']
            print("Model loaded successfully", file=sys.stderr)
            return vectorizer, model
    except:
        print("Training new model...", file=sys.stderr)
        disease_data = pd.read_csv(DISEASE_DATA_PATH)
        X = disease_data['symptoms'].values
        y = disease_data['disease'].values
        vectorizer = CountVectorizer()
        X_vectorized = vectorizer.fit_transform(X)
        model = MultinomialNB()
        model.fit(X_vectorized, y)
        with open(MODEL_PATH, 'wb') as f:
            pickle.dump({'vectorizer': vectorizer, 'model': model}, f)
        print("Model trained and saved", file=sys.stderr)
        return vectorizer, model

# Load conversation data for greetings and small talk
def load_conversation_data():
    try:
        conversation_data = pd.read_csv(CONVERSATION_DATA_PATH)
        conversation_dict = {}
        for _, row in conversation_data.iterrows():
            intent = row['intent']
            response = row['response']
            if intent in conversation_dict:
                conversation_dict[intent].append(response)
            else:
                conversation_dict[intent] = [response]
        return conversation_dict
    except Exception as e:
        print(f"Error loading conversation data: {e}", file=sys.stderr)
        return {
            "greeting": ["Hello! How can I help your pet today?", "Hi there! What symptoms is your pet showing?"],
            "goodbye": ["Goodbye! Take care of your pet!", "Bye! Hope your pet feels better soon!"],
            "thanks": ["You're welcome!", "Happy to help!"],
            "default": ["I'm not sure I understand. Could you describe your pet's symptoms?"]
        }

# Load disease information
def load_disease_info():
    try:
        disease_info = pd.read_csv(DISEASE_INFO_PATH)
        disease_dict = {}
        for _, row in disease_info.iterrows():
            disease_dict[row['disease']] = {
                'description': row['description'],
                'causes': row['causes'],
                'care': row['care'],
                'vet_visit': row['vet_visit']
            }
        return disease_dict
    except Exception as e:
        print(f"Error loading disease info: {e}", file=sys.stderr)
        return {"default": {
            'description': "I couldn't find detailed information about this condition.",
            'causes': "Various factors could cause these symptoms.",
            'care': "Please monitor your pet closely and provide water and rest.",
            'vet_visit': "If symptoms persist for more than 24 hours, please consult a veterinarian."
        }}

# Load known symptoms from training data
def load_known_symptoms():
    disease_data = pd.read_csv(DISEASE_DATA_PATH)
    all_symptoms = set()
    for row in disease_data['symptoms']:
        for s in row.split(','):
            all_symptoms.add(s.strip().lower())
    return list(all_symptoms)

# Extract known symptoms from user input
def extract_symptoms(user_input, known_symptoms):
    user_input = re.sub(r'[^a-zA-Z\s]', '', user_input.lower())
    words = user_input.split()
    matched = [symptom for symptom in known_symptoms if symptom in words]
    return ', '.join(matched) if matched else ''

# Predict disease based on symptoms
def predict_disease(input_text, vectorizer, model, known_symptoms):
    extracted = extract_symptoms(input_text, known_symptoms)
    if not extracted:
        return "unknown", 0.0
    input_vectorized = vectorizer.transform([extracted])
    disease = model.predict(input_vectorized)[0]
    probabilities = model.predict_proba(input_vectorized)[0]
    max_prob = max(probabilities)
    return disease, max_prob

# Format chatbot response
def format_response(disease, confidence, disease_info):
# Always provide a prediction, even if confidence is low
    if disease in disease_info:
        info = disease_info[disease]
    else:
        info = disease_info.get("default", {
            'description': "I couldn't find detailed information about this condition.",
            'causes': "Various factors could cause these symptoms.",
            'care': "Please monitor your pet closely and provide water and rest.",
            'vet_visit': "If symptoms persist for more than 24 hours, please consult a veterinarian."
        })

    response = {
        "disease": disease,
        "message": f"Based on the symptoms, your pet might have {disease}.",
        "description": info['description'],
        "causes": info['causes'],
        "care": info['care'],
        "vet_visit": info['vet_visit'],
        "confidence": round(confidence * 100)
    }
    return response


# Greeting intent check
def is_greeting(input_text):
    greeting_patterns = [
        r'\b(hi|hello|hey|greetings|howdy)\b',
        r'\bhow are you\b',
        r'\bgood (morning|afternoon|evening|day)\b',
        r'\bthanks|thank you\b',
        r'\bbye|goodbye|see you\b'
    ]
    for pattern in greeting_patterns:
        if re.search(pattern, input_text.lower()):
            if 'thank' in input_text.lower():
                return "thanks"
            elif any(word in input_text.lower() for word in ['bye', 'goodbye', 'see you']):
                return "goodbye"
            else:
                return "greeting"
    return None

# Greeting response
def get_greeting_response(intent, conversation_dict):
    if intent in conversation_dict:
        return np.random.choice(conversation_dict[intent])
    return np.random.choice(conversation_dict["default"])

# Main entry point
def main():
    vectorizer, model = load_or_train_model()
    conversation_dict = load_conversation_data()
    disease_info = load_disease_info()
    known_symptoms = load_known_symptoms()

    if len(sys.argv) > 1:
        input_text = " ".join(sys.argv[1:])
    else:
        input_text = sys.stdin.read().strip()

    greeting_intent = is_greeting(input_text)

    if greeting_intent:
        response = {
            "type": "greeting",
            "message": get_greeting_response(greeting_intent, conversation_dict)
        }
    else:
        disease, confidence = predict_disease(input_text, vectorizer, model, known_symptoms)
        response = format_response(disease, confidence, disease_info)
        response["type"] = "prediction"

    print(json.dumps(response))

if __name__ == "__main__":
    main()
