# MEDICHECK AI - Project Specification & Documentation

## 1. Project Overview
**MediCheck AI** is an advanced, AI-driven healthcare platform designed to bridge the gap between patients, medical AI diagnostics, and healthcare professionals. The system provides users with preliminary disease detection based on symptoms and vitals, connects them with relevant doctors, and offers a comprehensive management dashboard for administrators and medical staff.

---

## 2. System Architecture
The platform is built using a modern microservices-inspired architecture, divided into three core components:

1. **Frontend (Client):** A responsive, dynamic user interface built with React.
2. **Backend (Server):** A robust Node.js/Express REST API that handles business logic, database operations, and authentication.
3. **Machine Learning Engine (ML-Model):** A dedicated Python/Flask microservice that hosts the trained AI models for disease prediction.

---

## 3. Technology Stack

### Frontend (Client)
*   **Framework:** React.js (Vite)
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **State Management:** React Context API
*   **Routing:** React Router DOM
*   **HTTP Client:** Axios

### Backend (Server)
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (Mongoose ODM)
*   **Authentication:** JSON Web Tokens (JWT) & bcryptjs
*   **AI Chatbot Integration:** Groq SDK (LLM integration)

### Machine Learning Engine (ML-Model)
*   **Language:** Python (3.9+)
*   **Framework:** Flask
*   **Machine Learning:** Scikit-Learn (RandomForestClassifier)
*   **Data Processing:** Pandas, NumPy
*   **Model Serialization:** Joblib

---

## 4. Core Features & Modules

### 4.1. Patient Portal
*   **Authentication:** Secure user registration and login.
*   **Detection Wizard:** A multi-step form capturing patient demographics, vitals (Temperature, Blood Pressure, BMI), and symptoms.
*   **AI Disease Detection:** Analyzes patient inputs against a trained Random Forest model to predict potential diseases with a confidence score and risk level.
*   **Doctor Referral:** Automatically suggests relevant specialists based on the predicted disease.
*   **Healthcare Chatbot:** An intelligent, Groq-powered conversational agent capable of providing medical triage and guidance (includes strict medical disclaimers).
*   **Profile Management:** Users can view their medical history and upcoming doctor appointments.

### 4.2. Admin Dashboard
*   **Role-Based Access Control:** Secure routes restricted strictly to users with the 'admin' role.
*   **Analytics Overview:** High-level metrics showing total users, active doctors, recent detections, and system health.
*   **User Management:** CRUD operations for managing registered patients.
*   **Doctor Management:** Interface to onboard, verify, and manage healthcare professionals.
*   **Disease Database:** Management of the disease knowledge base (linking diseases to specific recommended tests and precautions).
*   **ML Model Management:** Dashboard to view model accuracy and trigger model retraining.

### 4.3. Machine Learning Pipeline
*   **Synthetic Data Generation:** Automated scripts to generate robust medical datasets linking specific symptoms and vital sign ranges to 40+ distinct diseases.
*   **Model Training:** Scikit-Learn pipeline to train, validate, and serialize a Random Forest classifier.
*   **Inference API:** A Flask REST endpoint that receives patient data, processes one-hot encoded symptoms, and returns a prediction alongside dynamic medical precautions.

---

## 5. Security & Compliance
*   **Authentication:** Stateless JWT authentication stored securely in HTTP cookies/headers.
*   **Password Hashing:** All user passwords are salted and hashed using bcrypt before database insertion.
*   **Medical Disclaimers:** Strict UI and Chatbot instructions ensuring users understand the AI is for informational purposes and not a substitute for professional medical diagnosis.

---

## 6. Setup & Installation Instructions

### Prerequisites
*   Node.js (v18+)
*   Python (v3.9+)
*   MongoDB (Local or Atlas)
*   Git

### Quick Setup (Windows)
A `setup.bat` script is provided in the root directory to automate the installation process for Windows users.
```bash
# 1. Clone the repository
git clone https://github.com/drclinitech-hue/Medica_AI.git
cd Medica_AI

# 2. Run the automated setup script
setup.bat
```

### Manual Setup

**1. Frontend**
```bash
cd client
npm install
npm run dev
```

**2. Backend**
```bash
cd server
npm install
# Create a .env file based on the environment variables section below
npm run dev
```

**3. ML Model**
```bash
cd ml-model
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python train.py
python app.py
```

---

## 7. Environment Variables
To run the backend server, a `.env` file must be created in the `/server` directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/medica_ai
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
FLASK_API_URL=http://127.0.0.1:5001
GROQ_API_KEY=your_groq_api_key_here
```

---

## 8. Database Seeding
To populate a fresh database with essential initial data:
```bash
cd server
node seed-admin.js        # Creates the master admin account
node seeder/seedDoctors.js # Populates the doctor directory
```
