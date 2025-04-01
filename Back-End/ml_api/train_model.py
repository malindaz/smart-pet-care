import pandas as pd
import numpy as np
import pickle
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# =========== DISEASE PREDICTION MODEL ===========
# Enhanced dataset with pet diseases and symptoms
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

# Train disease prediction model
disease_vectorizer = CountVectorizer()
X_disease = disease_vectorizer.fit_transform(df_disease["symptoms"])
y_disease = df_disease["disease"]
disease_model = MultinomialNB()
disease_model.fit(X_disease, y_disease)

# Train conversational intent model
conversation_vectorizer = CountVectorizer()
X_conversation = conversation_vectorizer.fit_transform(df_conversation["text"])
y_conversation = df_conversation["intent"]
conversation_model = MultinomialNB()
conversation_model.fit(X_conversation, y_conversation)

# Save all models and vectorizers
pickle.dump(disease_model, open("disease_model.pkl", "wb"))
pickle.dump(disease_vectorizer, open("disease_vectorizer.pkl", "wb"))
pickle.dump(conversation_model, open("conversation_model.pkl", "wb"))
pickle.dump(conversation_vectorizer, open("conversation_vectorizer.pkl", "wb"))

print("Models training complete. All models saved successfully.")

# Define response templates for different conversation intents
intent_responses = {
    "greeting": [
        "Hello! Welcome to the Pet Health Assistant. How can I help your pet today?",
        "Hi there! I'm your Pet Health Assistant. How may I assist you with your pet's health?",
        "Greetings! I'm here to help with any pet health concerns. What's going on with your furry friend?"
    ],
    "how_are_you": [
        "I'm functioning well and ready to help with your pet's health concerns. How is your pet doing?",
        "I'm here and ready to assist! More importantly, how is your pet feeling today?"
    ],
    "goodbye": [
        "Goodbye! Take good care of your pet. Come back anytime you need assistance.",
        "Farewell! Don't hesitate to return if your pet needs help. Have a great day!"
    ],
    "thanks": [
        "You're welcome! Pet health is important, and I'm glad I could help.",
        "Happy to be of service! Your pet's wellbeing is a priority."
    ],
    "help": [
        "I can help identify potential pet health issues based on symptoms. Just describe what you're observing with your pet.",
        "Sure! Tell me what symptoms your pet is showing, and I'll try to provide some guidance."
    ],
    "capabilities": [
        "I can help identify possible pet diseases based on symptoms, provide basic pet care advice, and answer common pet health questions.",
        "I'm designed to recognize pet health issues from symptoms and offer guidance. What would you like to know?"
    ],
    "health_concern": [
        "I'm sorry to hear that. Could you describe the symptoms your pet is experiencing?",
        "I understand your concern. Please tell me what symptoms you've noticed in your pet."
    ]
}

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

# Test function for the complete system
def test_chatbot():
    print("\n=== Pet Health Chatbot Testing ===\n")
    
    # Test conversation responses
    conversation_tests = [
        "hello there",
        "how are you doing today",
        "thank you so much",
        "what can you do for me",
        "my dog is not feeling well"
    ]
    
    print("Testing conversational responses:")
    for text in conversation_tests:
        transformed = conversation_vectorizer.transform([text])
        predicted_intent = conversation_model.predict(transformed)[0]
        
        import random
        response = random.choice(intent_responses[predicted_intent])
        
        print(f"\nUser: '{text}'")
        print(f"Intent: '{predicted_intent}'")
        print(f"Response: '{response}'")
    
    # Test symptom analysis
    symptom_tests = [
        "my dog is vomiting and has diarrhea",
        "my cat keeps coughing and sneezing",
        "my pet is scratching constantly and losing fur"
    ]
    
    print("\nTesting symptom analysis:")
    for symptom in symptom_tests:
        transformed = disease_vectorizer.transform([symptom])
        predicted_disease = disease_model.predict(transformed)[0]
        
        print(f"\nUser symptoms: '{symptom}'")
        print(f"Predicted condition: '{predicted_disease}'")
        if predicted_disease in disease_info:
            print(f"Description: {disease_info[predicted_disease]['description']}")
            print(f"When to see a vet: {disease_info[predicted_disease]['vet_visit']}")

# Run the test
test_chatbot()