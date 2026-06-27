import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib

def train_model():
    print("Loading dataset...")
    try:
        df = pd.read_csv('dataset.csv')
    except FileNotFoundError:
        print("dataset.csv not found! Please run dataset_generator.py first.")
        return
        
    print("Preprocessing data...")
    # Map Gender 'M' -> 1, 'F' -> 0
    df['gender'] = df['gender'].map({'M': 1, 'F': 0})
    
    # Separate features and target
    X = df.drop('disease', axis=1)
    y = df['disease']
    
    # Train test split (optional, just for evaluating inside training script)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest model (this might take a few seconds)...")
    rf = RandomForestClassifier(n_estimators=100, max_depth=15, random_state=42)
    rf.fit(X_train, y_train)
    
    accuracy = rf.score(X_test, y_test)
    print(f"Model trained with validation accuracy: {accuracy:.4f}")
    
    print("Saving model to model.pkl...")
    joblib.dump(rf, 'model.pkl')
    
    # Also save the columns so we know exactly what format to pass during prediction
    joblib.dump(X.columns.tolist(), 'model_columns.pkl')
    print("Training complete.")

if __name__ == "__main__":
    train_model()
