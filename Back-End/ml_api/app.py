from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os
import sys

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Check if required model files exist
required_files = [
    "disease_model.pkl", 
    "disease_vectorizer.pkl", 
    "conversation_model.pkl", 
    "conversation_vectorizer.pkl",
    "disease_info.pkl"
]

missing_files = [f for f in required_files if not os.path.exists(f)]

if missing_files:
    print(f"Error: Missing required model files: {', '.join(missing_files)}")
    print("Please run train_model.py first to generate these files.")
    sys.exit(1)

# Load models and data
disease_model = pickle.load(open("disease_model.pkl", "rb"))
disease_vectorizer = pickle.load(open("disease_vectorizer.pkl", "rb"))
conversation_model = pickle.load(open("conversation_model.pkl", "rb"))
conversation_vectorizer = pickle.load(open("conversation_vectorizer.pkl", "rb"))
disease_info = pickle.load(open("disease_info.pkl", "rb"))

# Import the chatbot class
from chatbot import PetHealthChatbot

# Initialize chatbot
chatbot = PetHealthChatbot()

@app.route("/api/chatbot/message", methods=["POST"])
def process_message():
    """Process user message and return chatbot response"""
    data = request.json
    user_message = data.get("message", "")
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400
    
    response = chatbot.process_input(user_message)
    return jsonify(response)

@app.route("/api/chatbot/predict", methods=["POST"])
def predict_disease():
    """Legacy endpoint for direct symptom-to-disease prediction"""
    data = request.json
    symptoms = data.get("symptoms", "")
    
    if not symptoms:
        return jsonify({"error": "No symptoms provided"}), 400
    
    transformed = disease_vectorizer.transform([symptoms])
    prediction = disease_model.predict(transformed)[0]
    
    if prediction in disease_info:
        info = disease_info[prediction]
        return jsonify({
            "disease": prediction,
            "description": info['description'],
            "causes": info['common_causes'],
            "home_care": info['home_care'],
            "vet_advice": info['vet_visit']
        })
    else:
        return jsonify({
            "disease": prediction,
            "message": "Please consult with a veterinarian for proper diagnosis and treatment."
        })

# Add the original /predict endpoint for backwards compatibility
@app.route("/predict", methods=["POST"])
def predict_original():
    """Original endpoint for direct symptom-to-disease prediction"""
    data = request.json
    symptoms = data.get("symptoms", "")
    
    if not symptoms:
        return jsonify({"error": "No symptoms provided"}), 400
    
    transformed = disease_vectorizer.transform([symptoms])
    prediction = disease_model.predict(transformed)[0]
    
    return jsonify({"disease": prediction})

@app.route("/health", methods=["GET"])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    print("Pet Disease Prediction API running on http://localhost:5000")
    app.run(debug=True, port=5000)