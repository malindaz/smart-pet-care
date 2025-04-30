import pickle
import random
import re

class PetHealthChatbot:
    def __init__(self):
        # Load all saved models and vectorizers
        self.disease_model = pickle.load(open("disease_model.pkl", "rb"))
        self.disease_vectorizer = pickle.load(open("disease_vectorizer.pkl", "rb"))
        self.conversation_model = pickle.load(open("conversation_model.pkl", "rb"))
        self.conversation_vectorizer = pickle.load(open("conversation_vectorizer.pkl", "rb"))
        
        # Response templates for different conversation intents
        self.intent_responses = {
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
        
        # Disease information database
        self.disease_info = {
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
            # Add more as needed
        }
        
        # Initialize state
        self.conversation_history = []
        
    def process_input(self, user_input):
        """Process user input and generate appropriate response"""
        # Add to conversation history
        self.conversation_history.append({"user": user_input})
        
        # Check for symptoms (look for symptom-related words)
        symptom_words = ["vomit", "diarrhea", "cough", "sneez", "itch", "scratch", "limp", 
                         "fever", "pain", "tired", "letharg", "appetite", "drink", "thirst", 
                         "breathe", "breath", "discharge", "swelling", "swollen"]
        
        contains_symptoms = any(word in user_input.lower() for word in symptom_words)
        
        # First, determine if this is a symptom description or general conversation
        if contains_symptoms:
            # Process as symptom query
            response = self.process_symptoms(user_input)
        else:
            # Process as conversational query
            response = self.process_conversation(user_input)
        
        # Add to conversation history
        self.conversation_history.append({"bot": response})
        return response
    
    def process_symptoms(self, symptom_text):
        """Process symptom description and return disease prediction"""
        transformed = self.disease_vectorizer.transform([symptom_text])
        predicted_disease = self.disease_model.predict(transformed)[0]
        
        # Construct response with disease information if available
        if predicted_disease in self.disease_info:
            info = self.disease_info[predicted_disease]
            response = (
                f"Based on the symptoms you've described, your pet might be experiencing {predicted_disease}.\n\n"
                f"This is {info['description']}\n"
                f"Common causes include {info['common_causes']}\n\n"
                f"Home care: {info['home_care']}\n\n"
                f"When to see a vet: {info['vet_visit']}\n\n"
                f"Note: This is not a substitute for professional veterinary advice. If you're concerned about your pet's health, please consult a veterinarian."
            )
        else:
            response = (
                f"Based on the symptoms you've described, your pet might be experiencing {predicted_disease}.\n\n"
                f"Please consult with a veterinarian for proper diagnosis and treatment options.\n\n"
                f"Note: This is not a substitute for professional veterinary advice."
            )
        
        return response
    
    def process_conversation(self, text):
        """Process conversational input and return appropriate response"""
        transformed = self.conversation_vectorizer.transform([text])
        predicted_intent = self.conversation_model.predict(transformed)[0]
        
        # Get a random response for the predicted intent
        if predicted_intent in self.intent_responses:
            return random.choice(self.intent_responses[predicted_intent])
        else:
            return "I'm not sure I understand. Could you please tell me more about your pet's condition?"

# Interactive chat loop
def chat():
    print("Loading Pet Health Assistant...")
    bot = PetHealthChatbot()
    print("Pet Health Assistant is ready to help!")
    print("Type 'exit' or 'quit' to end the conversation.")
    
    while True:
        user_input = input("\nYou: ")
        if user_input.lower() in ['exit', 'quit', 'bye']:
            print("\nPet Health Assistant: Goodbye! Take care of your pet!")
            break
        
        response = bot.process_input(user_input)
        print(f"\nPet Health Assistant: {response}")

if __name__ == "__main__":
    chat()