# MEDICA AI

MEDICA AI is a comprehensive AI-powered healthcare web application designed to integrate advanced machine learning models and generative AI into medical workflows. 

The system consists of three main components: a modern React frontend, an Express.js backend server, and a Python-based machine learning service.

## 🏗️ Project Structure

The repository is organized into three primary directories:

- `/client` - The frontend web application.
- `/server` - The backend API server.
- `/ml-model` - Machine learning models and Python APIs.

---

## 💻 Client (Frontend)

The frontend is a modern single-page application (SPA) built for performance and responsive design.

### Tech Stack
- **Framework:** React 18, Vite
- **Styling:** Tailwind CSS, Framer Motion
- **Routing:** React Router v6
- **Data Fetching:** TanStack React Query, Axios
- **Form Handling:** React Hook Form, Zod (Validation)
- **UI Libraries:** Chart.js, Lucide React, React Markdown

### Getting Started
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## ⚙️ Server (Backend)

The backend is a robust RESTful API that handles user authentication, database operations, and acts as a gateway to both the local ML model and external LLM services.

### Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **AI Integrations:** Google GenAI SDK, Groq SDK
- **Utilities:** Multer (File uploads), Helmet (Security), Cors

### Getting Started
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables by creating a `.env` file (ensure MongoDB URIs and AI API keys are configured).
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🧠 ML Model (Machine Learning Service)

This directory contains the core machine learning logic, dataset handling, and model serving scripts.

### Tech Stack
- **Language:** Python
- **Components:** 
  - `app.py`: Model serving endpoint
  - `train.py`: Model training script
  - `predict.py`: Inference script
  - `dataset_generator.py`: Script to generate or parse the dataset

### Getting Started
1. Navigate to the ML model directory:
   ```bash
   cd ml-model
   ```
2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the model server (depending on the framework used in `app.py`, usually Flask or FastAPI):
   ```bash
   python app.py
   ```

---

## 🚀 Automated Setup (Windows)

If you are setting this up on a new Windows machine, you can simply double-click the `setup.bat` file in the root directory. 

This script will automatically:
1. Verify Node.js and Python are installed.
2. Install all frontend dependencies (`npm install` in `/client`).
3. Install all backend dependencies (`npm install` in `/server`).
4. Create a Python virtual environment and install ML dependencies (`pip install -r requirements.txt` in `/ml-model`).

## 🚀 Running the Full Application

To run the entire stack locally, you will need three separate terminal windows running simultaneously:
1. One for the **Client** (`npm run dev` in `/client`)
2. One for the **Server** (`npm run dev` in `/server`)
3. One for the **ML Service** (`python app.py` in `/ml-model`)

## 📝 License

ISC License
