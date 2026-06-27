import pandas as pd
import numpy as np
import random
import os

# List of 40 diseases
diseases = [
    "Flu", "COVID-19", "Malaria", "Dengue", "Typhoid", "Diabetes", "Hypertension", 
    "Migraine", "Asthma", "Pneumonia", "Tuberculosis", "Food Poisoning", "Kidney Infection", 
    "Urinary Tract Infection", "Allergy", "Anemia", "Appendicitis", "Gastritis", "Hepatitis", 
    "Heart Disease", "Arthritis", "Bronchitis", "Chickenpox", "Cholera", "Conjunctivitis",
    "Depression", "Eczema", "Epilepsy", "Gastroenteritis", "Glaucoma", "Gout",
    "Hypothyroidism", "Insomnia", "Jaundice", "Measles", "Mumps", "Osteoporosis",
    "Rabies", "Scabies", "Tetanus"
]

# Symptoms list
symptoms = [
    "fever", "cough", "fatigue", "headache", "nausea", "vomiting", "diarrhea",
    "muscle_pain", "joint_pain", "shortness_of_breath", "chest_pain", "dizziness",
    "sore_throat", "runny_nose", "loss_of_taste", "loss_of_smell", "rash", "itching",
    "weight_loss", "sweating", "chills", "frequent_urination", "excessive_thirst",
    "abdominal_pain", "constipation", "blurred_vision", "swelling", "yellowing_of_skin"
]

# Disease to symptom probability mapping (rough approximations for synthetic data)
disease_symptom_mapping = {
    "Flu": ["fever", "cough", "fatigue", "headache", "muscle_pain", "sore_throat", "runny_nose", "chills"],
    "COVID-19": ["fever", "cough", "fatigue", "shortness_of_breath", "loss_of_taste", "loss_of_smell", "muscle_pain"],
    "Malaria": ["fever", "chills", "sweating", "headache", "nausea", "vomiting", "muscle_pain"],
    "Dengue": ["fever", "headache", "joint_pain", "muscle_pain", "rash", "nausea", "vomiting"],
    "Typhoid": ["fever", "headache", "abdominal_pain", "constipation", "diarrhea", "fatigue"],
    "Diabetes": ["frequent_urination", "excessive_thirst", "fatigue", "weight_loss", "blurred_vision"],
    "Hypertension": ["headache", "dizziness", "chest_pain", "shortness_of_breath"],
    "Migraine": ["headache", "nausea", "vomiting", "dizziness", "blurred_vision"],
    "Asthma": ["shortness_of_breath", "chest_pain", "cough"],
    "Pneumonia": ["fever", "cough", "shortness_of_breath", "chest_pain", "fatigue", "chills"],
    "Tuberculosis": ["cough", "chest_pain", "weight_loss", "fatigue", "fever", "sweating"],
    "Food Poisoning": ["nausea", "vomiting", "diarrhea", "abdominal_pain", "fever"],
    "Kidney Infection": ["fever", "chills", "abdominal_pain", "frequent_urination", "nausea", "vomiting"],
    "Urinary Tract Infection": ["frequent_urination", "abdominal_pain", "fever"],
    "Allergy": ["runny_nose", "itching", "rash", "sore_throat"],
    "Anemia": ["fatigue", "dizziness", "chest_pain"],
    "Appendicitis": ["abdominal_pain", "nausea", "vomiting", "fever"],
    "Gastritis": ["abdominal_pain", "nausea", "vomiting"],
    "Hepatitis": ["fatigue", "nausea", "vomiting", "abdominal_pain", "yellowing_of_skin"],
    "Heart Disease": ["chest_pain", "shortness_of_breath", "fatigue", "dizziness"],
    "Arthritis": ["joint_pain", "swelling"],
    "Bronchitis": ["cough", "fatigue", "shortness_of_breath", "chest_pain"],
    "Chickenpox": ["fever", "fatigue", "itching", "rash"],
    "Cholera": ["diarrhea", "vomiting", "muscle_pain"],
    "Conjunctivitis": ["itching", "blurred_vision"],
    "Depression": ["fatigue", "weight_loss"],
    "Eczema": ["itching", "rash"],
    "Epilepsy": ["dizziness", "fatigue"],
    "Gastroenteritis": ["diarrhea", "vomiting", "abdominal_pain", "fever", "nausea"],
    "Glaucoma": ["blurred_vision", "headache", "nausea", "vomiting"],
    "Gout": ["joint_pain", "swelling"],
    "Hypothyroidism": ["fatigue", "weight_loss"],
    "Insomnia": ["fatigue"],
    "Jaundice": ["yellowing_of_skin", "fatigue", "nausea", "vomiting", "abdominal_pain"],
    "Measles": ["fever", "cough", "runny_nose", "rash"],
    "Mumps": ["fever", "headache", "muscle_pain", "fatigue", "swelling"],
    "Osteoporosis": ["joint_pain"],
    "Rabies": ["fever", "headache", "nausea", "vomiting", "fatigue"],
    "Scabies": ["itching", "rash"],
    "Tetanus": ["muscle_pain", "fever", "sweating"]
}

def generate_dataset(num_samples=2000):
    data = []
    
    for _ in range(num_samples):
        # Pick a random disease
        disease = random.choice(diseases)
        
        # Base demographics
        age = random.randint(18, 90)
        gender = random.choice(['M', 'F'])
        height = random.randint(150, 190)
        weight = random.randint(50, 120)
        temp = round(random.uniform(97.0, 104.0), 1)
        bp = random.randint(90, 160)
        sugar = random.randint(70, 200)
        
        # Initialize symptoms as 0
        row_symptoms = {sym: 0 for sym in symptoms}
        
        # Determine symptoms based on disease with some randomness
        if disease in disease_symptom_mapping:
            core_symptoms = disease_symptom_mapping[disease]
            for sym in core_symptoms:
                if random.random() > 0.15: # 85% chance to have the core symptom
                    row_symptoms[sym] = 1
                    
        # Add some random noise (false positives)
        for sym in symptoms:
            if row_symptoms[sym] == 0 and random.random() < 0.05:
                row_symptoms[sym] = 1
                
        # Create row
        row = {
            'age': age,
            'gender': gender,
            'height': height,
            'weight': weight,
            'temp': temp,
            'bp': bp,
            'sugar': sugar
        }
        
        # Add symptoms to row
        row.update(row_symptoms)
        
        # Add target
        row['disease'] = disease
        
        data.append(row)
        
    df = pd.DataFrame(data)
    
    # Ensure all columns are present and ordered
    cols = ['age', 'gender', 'height', 'weight', 'temp', 'bp', 'sugar'] + symptoms + ['disease']
    df = df[cols]
    
    return df

if __name__ == "__main__":
    print("Generating synthetic dataset with 40 diseases...")
    df = generate_dataset(3000) # Generate 3000 rows
    df.to_csv('dataset.csv', index=False)
    print(f"Dataset generated successfully with {len(df)} rows and {len(df.columns)} columns.")
    print(f"Shape: {df.shape}")
