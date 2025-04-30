from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Check if model files exist
model_path = "model.pkl"
vectorizer_path = "vectorizer.pkl"

if not os.path.exists(model_path) or not os.path.exists(vectorizer_path):
    print("Error: Model files not found. Run train_model.py first.")
    exit(1)

# Load the model and vectorizer
model = pickle.load(open(model_path, "rb"))
vectorizer = pickle.load(open(vectorizer_path, "rb"))

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json["symptoms"]
    transformed_data = vectorizer.transform([data])
    prediction = model.predict(transformed_data)[0]
    return jsonify({"disease": prediction})

# Add the endpoint that matches your frontend
@app.route("/api/chatbot/predict", methods=["POST"])
def chatbot_predict():
    data = request.json["symptoms"]
    transformed_data = vectorizer.transform([data])
    prediction = model.predict(transformed_data)[0]
    return jsonify({"disease": prediction})

if __name__ == "__main__":
    print("Pet Disease Prediction API running on http://localhost:5000")
    app.run(debug=True, port=5000)