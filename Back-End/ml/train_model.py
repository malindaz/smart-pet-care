import pandas as pd
import pickle
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import os

# Set paths relative to the script location
script_dir = os.path.dirname(os.path.abspath(__file__))
DISEASE_DATA_PATH = os.path.join(script_dir, 'disease_data.csv')
MODEL_PATH = os.path.join(script_dir, 'trained_model.pkl')

def train_model():
    print("Loading disease data...")
    # Load disease data
    try:
        disease_data = pd.read_csv(DISEASE_DATA_PATH)
    except Exception as e:
        print(f"Error loading data: {e}")
        return
    
    print("Preparing data...")
    # Prepare data
    X = disease_data['symptoms'].values
    y = disease_data['disease'].values
    
    print("Training model...")
    # Create and train the vectorizer
    vectorizer = CountVectorizer()
    X_vectorized = vectorizer.fit_transform(X)
    
    # Train model
    model = MultinomialNB()
    model.fit(X_vectorized, y)
    
    print("Saving model...")
    # Save model
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump({'vectorizer': vectorizer, 'model': model}, f)
    
    print(f"Model trained and saved to {MODEL_PATH}")

if __name__ == "__main__":
    train_model()