import sys
import json
import pandas as pd
import numpy as np
import pickle
import re
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import os

# Set paths relative to the script location
script_dir = os.path.dirname(os.path.abspath(__file__))
DISEASE_DATA_PATH = os.path.join(script_dir, 'disease_data.csv')
DISEASE_INFO_PATH = os.path.join(script_dir, 'disease_info.csv')
CONVERSATION_DATA_PATH = os.path.join(script_dir, 'conversation_data.csv')
MODEL_PATH = os.path.join(script_dir, 'trained_model.pkl')

# Check if model exists, if not train a new one
def load_or_train_model():
    try:
        # Try to load the model
        with open(MODEL_PATH, 'rb') as f:
            model_data = pickle.load(f)
            vectorizer = model_data['vectorizer']
            model = model_data['model']
            print("Model loaded successfully", file=sys.stderr)
            return vectorizer, model
    except:
        print("Training new model...", file=sys.stderr)
        # Load disease data
        disease_data = pd.read_csv(DISEASE_DATA_PATH)
        
        # Prepare data
        X = disease_data['symptoms'].values
        y = disease_data['disease'].values
        
        # Create and train the vectorizer
        vectorizer = CountVectorizer()
        X_vectorized = vectorizer.fit_transform(X)
        
        # Train model
        model = MultinomialNB()
        model.fit(X_vectorized, y)
        
        # Save model
        with open(MODEL_PATH, 'wb') as f:
            pickle.dump({'vectorizer': vectorizer, 'model': model}, f)
        
        print("Model trained and saved", file=sys.stderr)
        return vectorizer, model

# Load conversation data for greetings and small talk
def load_conversation_data():
    try:
        conversation_data = pd.read_csv(CONVERSATION_DATA_PATH)
        # Create a dictionary mapping intents to responses
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
        # Provide default conversation data if file not found
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
        # Create a dictionary mapping disease names to information
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
        # Provide a basic default response if file not found
        return {"default": {
            'description': "I couldn't find detailed information about this condition.",
            'causes': "Various factors could cause these symptoms.",
            'care': "Please monitor your pet closely and provide water and rest.",
            'vet_visit': "If symptoms persist for more than 24 hours, please consult a veterinarian."
        }}

# Determine if the input is a greeting or small talk
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

# Get a response for greetings
def get_greeting_response(intent, conversation_dict):
    if intent in conversation_dict:
        responses = conversation_dict[intent]
        return np.random.choice(responses)
    return np.random.choice(conversation_dict["default"])

# Predict disease based on symptoms
def predict_disease(input_text, vectorizer, model):
    # Clean and prepare the input
    input_processed = input_text.lower()
    
    # Vectorize the input
    input_vectorized = vectorizer.transform([input_processed])
    
    # Predict the disease
    disease = model.predict(input_vectorized)[0]
    
    # Get prediction probabilities
    probabilities = model.predict_proba(input_vectorized)[0]
    max_prob = max(probabilities)
    
    return disease, max_prob

# Format the chatbot response
def format_response(disease, confidence, disease_info):
    # If confidence is low, give a more general response
    if confidence < 0.5:
        return {
            "disease": "uncertain",
            "message": "I'm not completely sure based on these symptoms. It could be several conditions. Please provide more details or consult your veterinarian.",
            "confidence": round(confidence * 100)
        }
    
    # Get disease information
    if disease in disease_info:
        info = disease_info[disease]
    else:
        info = disease_info.get("default", {
            'description': "I couldn't find detailed information about this condition.",
            'causes': "Various factors could cause these symptoms.",
            'care': "Please monitor your pet closely and provide water and rest.",
            'vet_visit': "If symptoms persist for more than 24 hours, please consult a veterinarian."
        })
    
    # Format the response
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

def main():
    # Load or train model
    vectorizer, model = load_or_train_model()
    
    # Load conversation data
    conversation_dict = load_conversation_data()
    
    # Load disease information
    disease_info = load_disease_info()
    
    # Read input from stdin or command line
    if len(sys.argv) > 1:
        input_text = " ".join(sys.argv[1:])
    else:
        input_text = sys.stdin.read().strip()
    
    # Check if input is a greeting
    greeting_intent = is_greeting(input_text)
    
    if greeting_intent:
        # Respond to greeting
        response = {
            "type": "greeting",
            "message": get_greeting_response(greeting_intent, conversation_dict)
        }
    else:
        # Predict disease
        disease, confidence = predict_disease(input_text, vectorizer, model)
        
        # Format response
        response = format_response(disease, confidence, disease_info)
        response["type"] = "prediction"
    
    # Print response as JSON
    print(json.dumps(response))

if __name__ == "__main__":
    main()