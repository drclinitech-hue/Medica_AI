from flask import Flask, request, jsonify
from flask_cors import CORS
from predict import make_prediction, load_model
import os

app = Flask(__name__)
CORS(app)

# Load model on startup if available
load_model()

@app.route('/api/detect', methods=['POST'])
def detect():
    try:
        data = request.json
        
        # Expected payload:
        # {
        #   "patient_data": {"age": 25, "gender": "Male", ...},
        #   "symptoms": ["fever", "cough"]
        # }
        
        patient_data = data.get('patient_data', {})
        symptoms = data.get('symptoms', [])
        
        result = make_prediction(patient_data, symptoms)
        
        # Medical knowledge base for mapping predictions to specific recommendations
        DISEASE_INFO = {
            "COVID-19": {
                "tests": ["RT-PCR Test", "Chest X-ray", "CT Scan", "D-dimer"],
                "precautions": ["Isolate immediately", "Wear an N95 mask", "Monitor oxygen levels", "Rest and hydrate"],
                "medicines": ["Paracetamol", "Antiviral drugs (if prescribed)"]
            },
            "Dengue": {
                "tests": ["NS1 Antigen Test", "Complete Blood Count (CBC)", "Dengue Antibody Test"],
                "precautions": ["Rest in bed", "Drink plenty of fluids", "Avoid aspirin and ibuprofen", "Use mosquito repellent"],
                "medicines": ["Acetaminophen (Paracetamol)"]
            },
            "Typhoid": {
                "tests": ["Widal Test", "Blood Culture", "Stool Culture"],
                "precautions": ["Drink boiled/purified water", "Eat fully cooked food", "Wash hands frequently", "Strict bed rest"],
                "medicines": ["Antibiotics (e.g., Ciprofloxacin, Azithromycin)"]
            },
            "Diabetes": {
                "tests": ["Fasting Blood Sugar (FBS)", "HbA1c", "Oral Glucose Tolerance Test"],
                "precautions": ["Monitor blood sugar daily", "Eat a low-carb diet", "Exercise regularly", "Check feet for wounds"],
                "medicines": ["Metformin", "Insulin (if prescribed)"]
            },
            "Tuberculosis": {
                "tests": ["Sputum Smear Microscopy", "Chest X-ray", "IGRA Blood Test", "Mantoux Tuberculin Skin Test"],
                "precautions": ["Isolate in a well-ventilated room", "Wear a mask", "Cover mouth when coughing", "Complete full antibiotic course"],
                "medicines": ["Isoniazid", "Rifampin", "Pyrazinamide", "Ethambutol"]
            },
            "Heart Disease": {
                "tests": ["Electrocardiogram (ECG/EKG)", "Echocardiogram", "Lipid Profile", "Stress Test"],
                "precautions": ["Reduce salt intake", "Avoid fatty foods", "Avoid smoking", "Manage stress"],
                "medicines": ["Statins", "Beta-blockers", "Aspirin (if prescribed)"]
            },
            "Malaria": {
                "tests": ["Peripheral Blood Smear", "Rapid Diagnostic Test (RDT)", "Polymerase Chain Reaction (PCR)"],
                "precautions": ["Use mosquito nets", "Avoid mosquito bites", "Take plenty of fluids", "Rest completely"],
                "medicines": ["Artemisinin-based combination therapies (ACTs)", "Chloroquine"]
            },
            "Urinary Tract Infection": {
                "tests": ["Urinalysis", "Urine Culture", "Ultrasound of urinary tract"],
                "precautions": ["Drink plenty of water", "Drink cranberry juice", "Wipe from front to back", "Empty bladder fully"],
                "medicines": ["Antibiotics (e.g., Nitrofurantoin, Ciprofloxacin)"]
            },
            "Pneumonia": {
                "tests": ["Chest X-ray", "Sputum Culture", "Pulse Oximetry", "Blood Test"],
                "precautions": ["Get plenty of rest", "Drink warm fluids", "Avoid smoking", "Stay away from cold environments"],
                "medicines": ["Antibiotics (if bacterial)", "Cough medicine", "Fever reducers"]
            }
        }
        
        predicted = result["predicted_disease"]
        
        info = DISEASE_INFO.get(predicted, {
            "tests": ["Complete Blood Count (CBC)", "Basic Metabolic Panel"],
            "precautions": ["Consult a doctor", "Rest adequately", "Drink fluids", "Monitor symptoms closely"],
            "medicines": ["Consult physician for specific medication"]
        })
        
        result["recommended_tests"] = info["tests"]
        result["precautions"] = info["precautions"]
        result["suggested_medicines"] = info["medicines"]
        result["emergency_warning"] = result["risk_level"] in ["High", "Critical"]
        
        return jsonify(result)
    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
