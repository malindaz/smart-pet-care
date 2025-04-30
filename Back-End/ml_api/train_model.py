import pandas as pd
import numpy as np
import pickle
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import os

def train_from_csv(disease_csv=None, conversation_csv=None, disease_info_csv=None):
    """
    Train models from CSV files
    
    Parameters:
    - disease_csv: Path to CSV with symptoms and diseases
      Expected columns: 'symptoms', 'disease'
    - conversation_csv: Path to CSV with conversation intents
      Expected columns: 'text', 'intent'
    - disease_info_csv: Path to CSV with disease information
      Expected columns: 'disease', 'description', 'common_causes', 'home_care', 'vet_visit'
    """
    # =========== DISEASE PREDICTION MODEL ===========
    if disease_csv and os.path.exists(disease_csv):
        print(f"Loading disease data from {disease_csv}")
        df_disease = pd.read_csv(disease_csv)
        
        # Validate columns
        required_cols = ['symptoms', 'disease']
        if not all(col in df_disease.columns for col in required_cols):
            print(f"Error: {disease_csv} must contain columns: {required_cols}")
            print(f"Found columns: {df_disease.columns.tolist()}")
            return False
    else:
        print("Using default disease dataset")
        # Default dataset with pet diseases and symptoms
        disease_data = {
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
        df_disease = pd.DataFrame(disease_data)

    # =========== CONVERSATIONAL INTENTS MODEL ===========
    if conversation_csv and os.path.exists(conversation_csv):
        print(f"Loading conversation data from {conversation_csv}")
        df_conversation = pd.read_csv(conversation_csv)
        
        # Validate columns
        required_cols = ['text', 'intent']
        if not all(col in df_conversation.columns for col in required_cols):
            print(f"Error: {conversation_csv} must contain columns: {required_cols}")
            print(f"Found columns: {df_conversation.columns.tolist()}")
            return False
    else:
        print("Using default conversation dataset")
        # Dataset for conversational intents
        conversation_data = {
            "text": [
                "hi", "hello", "hey there", "good morning", "good afternoon", "howdy", "greetings",
                "how are you", "how's it going", "what's up", "how do you do", "how are things",
                "goodbye", "bye", "see you later", "until next time", "farewell", "take care",
                "thank you", "thanks", "appreciate it", "thanks a lot", "thank you so much",
                "help", "help me", "I need assistance", "can you help me", "support",
                "what can you do", "what are your capabilities", "tell me what you can do", "features",
                "my pet is sick", "my dog is ill", "my cat is not feeling well", "pet health problem"
            ],
            "intent": [
                "greeting", "greeting", "greeting", "greeting", "greeting", "greeting", "greeting",
                "how_are_you", "how_are_you", "how_are_you", "how_are_you", "how_are_you",
                "goodbye", "goodbye", "goodbye", "goodbye", "goodbye", "goodbye",
                "thanks", "thanks", "thanks", "thanks", "thanks",
                "help", "help", "help", "help", "help",
                "capabilities", "capabilities", "capabilities", "capabilities",
                "health_concern", "health_concern", "health_concern", "health_concern"
            ]
        }
        df_conversation = pd.DataFrame(conversation_data)

    # =========== DISEASE INFORMATION ===========
    if disease_info_csv and os.path.exists(disease_info_csv):
        print(f"Loading disease information from {disease_info_csv}")
        df_disease_info = pd.read_csv(disease_info_csv)
        
        # Validate columns
        required_cols = ['disease', 'description', 'common_causes', 'home_care', 'vet_visit']
        if not all(col in df_disease_info.columns for col in required_cols):
            print(f"Error: {disease_info_csv} must contain columns: {required_cols}")
            print(f"Found columns: {df_disease_info.columns.tolist()}")
            return False
        
        # Convert to dictionary format
        disease_info = {}
        for _, row in df_disease_info.iterrows():
            disease_info[row['disease']] = {
                'description': row['description'],
                'common_causes': row['common_causes'],
                'home_care': row['home_care'],
                'vet_visit': row['vet_visit']
            }
    else:
        print("Using default disease information")
        # Define more detailed disease information
        disease_info = {
            "Gastroenteritis": {
                "description": "Inflammation of the stomach and intestines.",
                "common_causes": "Dietary indiscretion, viral or bacterial infections, parasites.",
                "home_care": "Ensure access to fresh water, offer small bland meals, monitor for dehydration.",
                "vet_visit": "If symptoms persist more than 24 hours, blood in stool, or signs of dehydration."
            },
            "Parvovirus": {
                "description": "Highly contagious viral infection affecting mainly puppies.",
                "common_causes": "Exposure to infected dogs or contaminated environments.",
                "home_care": "None - immediate veterinary care required.",
                "vet_visit": "EMERGENCY - seek immediate veterinary care."
            },
            # Add more diseases with detailed information
        }

    print("\n=== Training Disease Model ===")
    # Train disease prediction model
    disease_vectorizer = CountVectorizer()
    X_disease = disease_vectorizer.fit_transform(df_disease["symptoms"])
    y_disease = df_disease["disease"]
    disease_model = MultinomialNB()
    disease_model.fit(X_disease, y_disease)

    print("\n=== Training Conversation Model ===")
    # Train conversational intent model
    conversation_vectorizer = CountVectorizer()
    X_conversation = conversation_vectorizer.fit_transform(df_conversation["text"])
    y_conversation = df_conversation["intent"]
    conversation_model = MultinomialNB()
    conversation_model.fit(X_conversation, y_conversation)

    print("\n=== Saving Models and Data ===")
    # Save all models and vectorizers
    pickle.dump(disease_model, open("disease_model.pkl", "wb"))
    pickle.dump(disease_vectorizer, open("disease_vectorizer.pkl", "wb"))
    pickle.dump(conversation_model, open("conversation_model.pkl", "wb"))
    pickle.dump(conversation_vectorizer, open("conversation_vectorizer.pkl", "wb"))
    
    # Save disease info
    pickle.dump(disease_info, open("disease_info.pkl", "wb"))

    print("Models and data saved successfully.")
    
    # Test the models
    test_models(disease_model, disease_vectorizer, conversation_model, conversation_vectorizer, disease_info)
    
    return True

def test_models(disease_model, disease_vectorizer, conversation_model, conversation_vectorizer, disease_info):
    """Test the trained models with sample inputs"""
    print("\n=== Testing Trained Models ===")
    
    # Test conversation model
    print("\nTesting conversation model:")
    conversation_tests = [
        "hello there",
        "how are you doing today",
        "thank you so much",
        "what can you do for me",
        "my dog is not feeling well"
    ]
    
    for text in conversation_tests:
        transformed = conversation_vectorizer.transform([text])
        intent = conversation_model.predict(transformed)[0]
        print(f"Text: '{text}' → Intent: '{intent}'")
    
    # Test disease model
    print("\nTesting disease model:")
    symptom_tests = [
        "my dog is vomiting and has diarrhea",
        "my cat keeps coughing and sneezing",
        "my pet is scratching constantly and losing fur"
    ]
    
    for symptom in symptom_tests:
        transformed = disease_vectorizer.transform([symptom])
        disease = disease_model.predict(transformed)[0]
        print(f"Symptoms: '{symptom}' → Disease: '{disease}'")
        
        if disease in disease_info:
            print(f"  Description: {disease_info[disease]['description']}")
            print(f"  Vet advice: {disease_info[disease]['vet_visit']}")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Train pet health chatbot models')
    parser.add_argument('--disease', type=str, help='Path to CSV with symptoms and diseases')
    parser.add_argument('--conversation', type=str, help='Path to CSV with conversation intents')
    parser.add_argument('--info', type=str, help='Path to CSV with disease information')
    
    args = parser.parse_args()
    
    print("Pet Health Chatbot - Model Training")
    print("==================================")
    
    success = train_from_csv(
        disease_csv=args.disease,
        conversation_csv=args.conversation,
        disease_info_csv=args.info
    )
    
    if success:
        print("\nTraining completed successfully! You can now run chatbot.py to start the chatbot.")
    else:
        print("\nTraining failed. Please check the CSV files and try again.")