# APPENDIX: CORE SOURCE CODE (MediCheck AI)

This appendix contains the core source code implementations for the **MediCheck AI** platform. These excerpts represent the most critical architectural components across the Machine Learning model, Backend Generative AI integration, API Controllers, Database Schemas, and Frontend UI components. This document is structured specifically for inclusion in project reports and academic documentation.

---

## 1. Machine Learning Prediction Engine (`ml-model/predict.py`)
This module handles real-time symptom mapping, demographic conversion (including feet-to-centimeter normalization), and Random Forest classifier inference.

```python
import joblib
import pandas as pd
import numpy as np
import os

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
    patient_data: dict containing age, gender, height (ft or cm), weight, temp, bp, sugar
    patient_symptoms: list of symptom strings e.g. ["fever", "cough"]
    """
    if model is None or model_columns is None:
        if not load_model():
            raise Exception("Model not trained yet. Run train.py first.")
            
    # Format gender (Male = 1, Female/Other = 0)
    gender = 1 if patient_data.get('gender') == 'Male' else 0
    
    # Normalization: If height is provided in feet (< 10), convert to centimeters
    raw_height = patient_data.get('height', 170)
    height_cm = raw_height * 30.48 if raw_height < 10 else raw_height
    
    # Construct base demographic feature vector
    input_dict = {
        'age': patient_data.get('age', 30),
        'gender': gender,
        'height': height_cm,
        'weight': patient_data.get('weight', 70),
        'temp': patient_data.get('temp', 98.6),
        'bp': patient_data.get('bp', 120),
        'sugar': patient_data.get('sugar', 90)
    }
    
    # Initialize all possible 28 symptom feature columns to 0
    for col in model_columns:
        if col not in input_dict:
            input_dict[col] = 0
            
    # Activate present symptoms (One-Hot Encoding)
    for sym in patient_symptoms:
        sym_formatted = sym.lower().replace(" ", "_")
        if sym_formatted in input_dict:
            input_dict[sym_formatted] = 1
            
    input_df = pd.DataFrame([input_dict], columns=model_columns)
    
    # Execute inference and calculate prediction probabilities
    prediction = model.predict(input_df)[0]
    probabilities = model.predict_proba(input_df)[0]
    max_prob = max(probabilities)
    
    # Risk Stratification based on confidence score and temperature
    risk_level = "Low"
    if max_prob > 0.85 or patient_data.get('temp', 98.6) > 102.5:
        risk_level = "High"
    elif max_prob > 0.60 or patient_data.get('temp', 98.6) > 100.5:
        risk_level = "Moderate"
        
    return {
        "predicted_disease": prediction,
        "confidence_score": round(float(max_prob) * 100, 2),
        "risk_level": risk_level
    }
```

---

## 2. Generative AI Triage & NLP Service (`server/services/groqService.js`)
This backend service interfaces with the Llama-3.3-70B model via Groq SDK. It enforces strict Urdu language retention, imperial height measurement prompts (`ft/in`), and structured JSON extraction for automated symptom discovery.

```javascript
const Groq = require('groq-sdk');
const dotenv = require('dotenv');
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_INSTRUCTION = `
You are an intelligent, empathetic AI Healthcare Assistant for the "MediCheck AI" platform.
Your primary role is to act as a triage symptom analyzer.
YOU ARE NOT A DOCTOR. Never provide a final diagnosis. 

Your goals & critical rules:
1. Understand the patient's messages naturally.
2. GET STRAIGHT TO THE POINT: Do NOT interrogate the patient endlessly. If the patient's initial statement is very vague, you may ask AT MOST ONE targeted follow-up question (e.g., "How long has this fever been happening?"). If you already have 1 or 2 clear symptoms, DO NOT ask any more questions. Immediately CONCLUDE the interview.
3. MEASUREMENTS RULE: If you ever need to ask about the patient's height during history taking or triage, ALWAYS ask for height in FEET / INCHES (ft/in), NEVER in centimeters (cm).
4. STRICT LANGUAGE RETENTION RULE: If the patient starts talking or writes in Urdu (whether in Nastaliq script or Roman Urdu), you MUST stay in Urdu and reply ONLY in pure Urdu using the exact same script (Roman Urdu or Nastaliq). NEVER switch to Hindi or English. Do NOT use Hindi-exclusive vocabulary (e.g., avoid words like "chinta", "swasthya", "chikitsak", "upchar"). Use proper Urdu medical terms (e.g., "fikr", "sehat", "doctor/muallij", "ilaj").

BEHAVIOR:
- Respond concisely, naturally, and empathetically without unnecessary conversational padding.
- Once you are confident you have gathered enough information to extract the core symptoms, duration, and severity, you must CONCLUDE the interview.
- To conclude the interview, you MUST output ONLY a JSON object exactly matching the structure below.

FINAL OUTPUT FORMAT (Use this ONLY when you are ready to conclude):
{
  "status": "complete",
  "symptoms": ["fever", "headache", "vomiting"],
  "duration": "3 days",
  "severity": "moderate"
}`;

const analyzeSymptoms = async (chatHistory) => {
  try {
    const messages = [
      { role: 'system', content: SYSTEM_INSTRUCTION },
      ...chatHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }))
    ];

    const response = await groq.chat.completions.create({
      messages: messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2, // Deterministic extraction
      max_tokens: 500,
    });

    const replyText = response.choices[0]?.message?.content || "";

    // Parse structured JSON block if interview is concluded
    try {
      let cleanText = replyText.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.substring(7, cleanText.length - 3).trim();
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.substring(3, cleanText.length - 3).trim();
      }

      const jsonObj = JSON.parse(cleanText);
      if (jsonObj.status === 'complete' && jsonObj.symptoms) {
        return { type: 'complete', data: jsonObj };
      }
    } catch (e) {
      // Conversational turn continues
    }

    return { type: 'chat', text: replyText };
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error('Failed to analyze symptoms with AI');
  }
};

module.exports = { analyzeSymptoms };
```

---

## 3. Multi-Phase Diagnostic API Controller (`server/controllers/detectionController.js`)
This controller bridges user demographics, natural language interview results from Llama-3.3, Machine Learning classification from the Python Flask microservice, and MongoDB persistent storage.

```javascript
const Detection = require('../models/Detection');
const User = require('../models/User');
const groqService = require('../services/groqService');
const axios = require('axios');

// Phase 5: Execute ML Prediction and Persist Diagnosis
const runDetection = async (req, res) => {
  try {
    const { detectionId, symptoms, duration, severity, patientDescription } = req.body;
    
    const detection = await Detection.findById(detectionId);
    if (!detection) return res.status(404).json({ message: 'Detection record not found' });

    // Populate Phase 3/4 NLP extracted data
    detection.symptoms = symptoms;
    detection.duration = duration;
    detection.severity = severity;
    detection.patientDescription = patientDescription;

    // Assemble patient demographic payload for ML Inference Engine
    const patient_data = {
      age: detection.demographics?.age || req.user.age || 30,
      gender: detection.demographics?.gender || req.user.gender || 'Other',
      height: detection.demographics?.height || req.user.height || 170,
      weight: detection.demographics?.weight || req.user.weight || 70,
      temp: detection.demographics?.temp || 98.6,
      bp: detection.demographics?.bp || 120,
      sugar: detection.demographics?.sugar || 90
    };

    const mlApiUrl = process.env.FLASK_API_URL || 'http://127.0.0.1:5001';

    // Dispatch asynchronous HTTP request to Python ML Microservice
    const mlResponse = await axios.post(`${mlApiUrl}/api/detect`, {
      patient_data,
      symptoms
    });

    const mlData = mlResponse.data;
    if (mlData.error) {
      return res.status(500).json({ message: 'ML Service Error', details: mlData.error });
    }

    // Persist AI/ML evaluation into MongoDB
    detection.detectedDisease = mlData.predicted_disease;
    detection.confidenceScore = mlData.confidence_score;
    detection.riskLevel = mlData.risk_level;
    
    detection.recommendations = {
      immediatePrecautions: mlData.precautions || [],
      recommendedTests: mlData.recommended_tests || [],
      suggestedMedicines: mlData.suggested_medicines || [],
      dietaryAdvice: "Stay hydrated, eat a balanced diet, and avoid heavy oily foods.",
      lifestyleChanges: "Rest adequately and monitor symptoms closely.",
      whenToSeeDoctor: mlData.emergency_warning 
        ? "IMMEDIATELY - Your risk level is high or critical." 
        : "If symptoms persist for more than 3 days or worsen significantly."
    };

    detection.status = 'completed';
    await detection.save();

    res.json({ success: true, data: detection });
  } catch (error) {
    res.status(500).json({ message: 'Error running ML detection', error: error.message });
  }
};

module.exports = { runDetection };
```

---

## 4. Medical Database Schemas (`server/models/Detection.js` & `server/models/Disease.js`)

### Detection Report Schema
```javascript
const mongoose = require('mongoose');

const detectionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  demographics: {
    age: Number,
    gender: String,
    height: Number, // Stored as entered (ft or cm)
    weight: Number, // In kg
    bmi: Number,
    bloodGroup: String,
    temp: Number,
    bp: Number,
    sugar: Number,
    lifestyle: { smoking: String, alcohol: String, physicalActivity: String }
  },
  symptoms: [{ type: String }],
  duration: String,
  severity: { type: String, enum: ['mild', 'moderate', 'severe', 'Not specified'], default: 'Not specified' },
  detectedDisease: { type: String, required: true },
  confidenceScore: { type: Number, required: true },
  riskLevel: { type: String, enum: ['Low', 'Moderate', 'High', 'Critical'], default: 'Low' },
  recommendations: {
    immediatePrecautions: [String],
    recommendedTests: [String],
    suggestedMedicines: [String],
    dietaryAdvice: String,
    lifestyleChanges: String,
    whenToSeeDoctor: String
  },
  status: { type: String, enum: ['draft', 'completed'], default: 'draft' }
}, { timestamps: true });

module.exports = mongoose.model('Detection', detectionSchema);
```

### Disease Management Schema
```javascript
const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please add a disease name'], unique: true },
  description: { type: String, required: [true, 'Please add a description'] },
  symptoms: [{ type: String }],
  precautions: [{ type: String }],
  preventionTips: [{ type: String }],
  suggestedMedicines: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Disease', diseaseSchema);
```

---

## 5. Printable Doctor Prescription Pad UI (`client/src/components/PrescriptionPad.jsx`)
This component formats diagnostic reports into a professional, printable doctor letterhead format. It dynamically formats height units based on numerical value (feet vs. centimeters) and displays hospital credentials.

```jsx
import React from 'react';
import { ShieldAlert, Activity, CheckCircle, Clock } from 'lucide-react';

const PrescriptionPad = ({ detection, user }) => {
  if (!detection) return null;
  const { detectedDisease, confidenceScore, riskLevel, recommendations, symptoms } = detection;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white text-black p-8 max-w-4xl mx-auto rounded-xl shadow-2xl print:shadow-none print:p-0 print:max-w-full">
      {/* Print Action Bar */}
      <div className="flex justify-end mb-6 print:hidden">
        <button 
          onClick={handlePrint}
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:opacity-90 transition flex items-center gap-2"
        >
          🖨️ Print / Download Prescription Pad
        </button>
      </div>

      {/* Hospital Letterhead Header */}
      <div className="border-b-4 border-primary pb-6 mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">MediCheck AI Hospital</h1>
          <p className="text-sm text-gray-600 font-medium">Advanced AI Diagnostic & Clinical Triage Center</p>
          <p className="text-xs text-gray-500 mt-1">123 Health Avenue, Medical District • Contact: +1 (800) MEDI-CHK</p>
        </div>
        <div className="text-right">
          <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Official Medical Record
          </span>
          <p className="text-sm font-semibold text-gray-700 mt-2">Date: {new Date().toLocaleDateString()}</p>
          <p className="text-xs text-gray-500 font-mono">ID: {detection._id || 'CHK-' + Math.floor(100000 + Math.random() * 900000)}</p>
        </div>
      </div>

      {/* Patient Demographic Credentials */}
      <div className="border border-gray-300 p-5 mb-8 rounded-xl flex justify-between bg-gray-50 text-sm">
        <div className="space-y-1">
          <p><span className="font-bold text-gray-700">Patient Name:</span> {user?.name || 'Unknown Patient'}</p>
          <p><span className="font-bold text-gray-700">Email Contact:</span> {user?.email || 'N/A'}</p>
        </div>
        <div className="text-right space-y-1">
          <p>
            <span className="font-bold text-gray-700">Gender:</span> {user?.gender || 'N/A'} &nbsp;|&nbsp; 
            <span className="font-bold text-gray-700">Age:</span> {user?.age || 'N/A'} yrs
          </p>
          <p>
            <span className="font-bold text-gray-700">Height:</span> {user?.height ? `${user.height} ${user.height < 10 ? 'ft' : 'cm'}` : 'N/A'} &nbsp;|&nbsp; 
            <span className="font-bold text-gray-700">Weight:</span> {user?.weight ? `${user.weight} kg` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Diagnostic Findings */}
      <div className="mb-8 bg-blue-50/50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" /> Preliminary AI Diagnostic Assessment
        </h2>
        <div className="flex items-baseline justify-between">
          <p className="text-3xl font-extrabold text-blue-950">{detectedDisease || 'Analysis Pending'}</p>
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
            riskLevel === 'High' || riskLevel === 'Critical' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-green-100 text-green-800 border border-green-300'
          }`}>
            Risk Level: {riskLevel || 'Low'} ({confidenceScore}% Confidence)
          </span>
        </div>
      </div>

      {/* Clinical Recommendations Table */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="border border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-3 border-b pb-2 flex items-center gap-2 text-sm">
            🛡️ Immediate Clinical Precautions
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-700">
            {recommendations?.immediatePrecautions?.map((precaution, idx) => (
              <li key={idx}>{precaution}</li>
            ))}
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-3 border-b pb-2 flex items-center gap-2 text-sm">
            🔬 Recommended Diagnostic Tests
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-700">
            {recommendations?.recommendedTests?.map((test, idx) => (
              <li key={idx}>{test}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Doctor Sign-off & Footer */}
      <div className="border-t-2 border-gray-300 pt-8 mt-12 flex justify-between items-end">
        <div className="text-xs text-gray-500 max-w-md">
          <p className="font-semibold text-gray-700">Legal Medical Disclaimer:</p>
          <p>This prescription pad is generated by MediCheck AI's diagnostic assistant. It does not replace formal clinical diagnosis by a certified medical practitioner.</p>
        </div>
        <div className="text-center">
          <div className="w-48 border-b-2 border-gray-800 mb-2 pb-6"></div>
          <p className="font-bold text-sm text-gray-800">Attending Doctor Signature</p>
          <p className="text-xs text-gray-500">MediCheck AI Medical Board</p>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPad;
```

---

## 6. Voice & Chat Diagnostic Interface (`client/src/pages/DetectionWizard.jsx` snippet)
Demonstrates real-time browser SpeechRecognition (Voice-to-Text) integrated directly into the diagnostic triage phase.

```jsx
// Speech Recognition Initialization
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

const toggleListen = () => {
  if (!recognition) {
    toast.error("Your browser does not support Voice Recognition.");
    return;
  }

  if (isListening) {
    recognition.stop();
    setIsListening(false);
  } else {
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(prev => prev ? prev + ' ' + transcript : transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  }
};
```
