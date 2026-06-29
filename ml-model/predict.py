import joblib
import pandas as pd
import numpy as np
import os

# Load globally to save time during requests
model = None
model_columns = None

def load_model():
    global model, model_columns
    if os.path.exists('model.pkl') and os.path.exists('model_columns.pkl'):
        model = joblib.load('model.pkl')
        model_columns = joblib.load('model_columns.pkl')
        return True
    return False

def make_prediction(patient_data, patient_symptoms):
    """
    patient_data: dict containing age, gender, height, weight, temp, bp, sugar
    patient_symptoms: list of symptom strings e.g. ["fever", "cough"]
    """
    if model is None or model_columns is None:
        if not load_model():
            raise Exception("Model not trained yet. Run train.py first.")
            
    # Format gender
    gender = 1 if patient_data.get('gender') == 'Male' else 0
    
    # Handle height conversion (if passed in feet, convert to cm)
    raw_height = patient_data.get('height', 170)
    height_cm = raw_height * 30.48 if raw_height < 10 else raw_height
    
    # Create input dictionary
    input_dict = {
        'age': patient_data.get('age', 30),
        'gender': gender,
        'height': height_cm,
        'weight': patient_data.get('weight', 70),
        'temp': patient_data.get('temp', 98.6),
        'bp': patient_data.get('bp', 120),
        'sugar': patient_data.get('sugar', 90)
    }
    
    # Initialize all possible symptoms to 0
    for col in model_columns:
        if col not in input_dict:
            input_dict[col] = 0
            
    # Set active symptoms to 1
    for sym in patient_symptoms:
        # Replace spaces with underscores and make lowercase to match columns
        sym_formatted = sym.lower().replace(" ", "_")
        if sym_formatted in input_dict:
            input_dict[sym_formatted] = 1
            
    # Create dataframe in correct order
    input_df = pd.DataFrame([input_dict], columns=model_columns)
    
    # Make prediction
    prediction = model.predict(input_df)[0]
    
    # Get probabilities
    probabilities = model.predict_proba(input_df)[0]
    confidence = float(np.max(probabilities))
    
    # Determine risk level based on some logic (e.g., confidence or specific diseases)
    high_risk_diseases = ['COVID-19', 'Heart Disease', 'Tuberculosis', 'Cholera', 'Rabies', 'Tetanus']
    if prediction in high_risk_diseases:
        risk_level = "High"
    elif confidence > 0.8:
        risk_level = "Moderate"
    else:
        risk_level = "Low"
        
    return {
        "predicted_disease": prediction,
        "confidence_score": confidence,
        "risk_level": risk_level
    }
