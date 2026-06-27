const Groq = require('groq-sdk');
const dotenv = require('dotenv');
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_INSTRUCTION = `
You are an intelligent, empathetic AI Healthcare Assistant for the "Medica AI" platform.
Your primary role is to act as a triage symptom analyzer.
YOU ARE NOT A DOCTOR. Never provide a final diagnosis. 

Your goals:
1. Understand the patient's messages naturally.
2. Extract the specific symptoms they are experiencing.
3. Extract the duration of these symptoms.
4. Extract the severity (mild, moderate, severe) if possible.
5. Ask intelligent follow-up questions to gather missing information (e.g., "Do you also have a fever?", "How old are you?").

BEHAVIOR:
- You will receive a single description of a health problem.
- You must extract the symptoms, duration, and severity as best as you can.
- DO NOT ask follow up questions. You are no longer in a conversational interface.

FINAL OUTPUT FORMAT:
You MUST output ONLY a JSON object exactly matching the structure below. Do not include markdown formatting or extra text.
{
  "status": "complete",
  "symptoms": ["fever", "headache", "vomiting"],
  "duration": "3 days",
  "severity": "moderate"
}
If duration or severity is not mentioned, use "Not specified".`;

const analyzeSymptoms = async (chatHistory) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not set in environment variables");
    }

    // Format chat history for Groq API
    // Groq expects { role: 'system' | 'user' | 'assistant', content: '...' }
    const messages = [
      { role: 'system', content: SYSTEM_INSTRUCTION },
      ...chatHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }))
    ];

    const response = await groq.chat.completions.create({
      messages: messages,
      model: 'llama-3.3-70b-versatile', // Fast, intelligent model
      temperature: 0.2, // Low temperature for more deterministic/factual extraction
      max_tokens: 500,
    });

    const replyText = response.choices[0]?.message?.content || "";

    // Check if the response is the JSON completion block
    try {
      let cleanText = replyText.trim();
      if (cleanText.startsWith('\`\`\`json')) {
        cleanText = cleanText.substring(7, cleanText.length - 3).trim();
      } else if (cleanText.startsWith('\`\`\`')) {
        cleanText = cleanText.substring(3, cleanText.length - 3).trim();
      }

      const jsonObj = JSON.parse(cleanText);
      
      if (jsonObj.status === 'complete' && jsonObj.symptoms) {
        return {
          type: 'complete',
          data: jsonObj
        };
      }
    } catch (e) {
      // It's normal conversational text, not JSON
    }

    return {
      type: 'chat',
      text: replyText
    };

  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error('Failed to analyze symptoms with AI (Groq)');
  }
};

const generalChat = async (chatHistory) => {
  try {
    const SYSTEM_INSTRUCTION = `
You are an advanced medical diagnostic AI assistant for "Medica AI". 
When a user describes their symptoms, you MUST analyze them and provide a potential diagnosis or a list of possible diseases they might have.
Act as a virtual doctor. Ask follow-up questions if you need more details to make a diagnosis (like duration, severity, age).
Once you have enough information, explicitly state your diagnosis (e.g., "Based on your symptoms, it is highly likely you have Dengue Fever").
ALWAYS INCLUDE THIS DISCLAIMER at the very end of your diagnosis: "Disclaimer: I am an AI, not a doctor. Please consult a qualified professional for a final medical diagnosis."
Keep your answers professional, empathetic, and conversational.
`;
    
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
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || "I'm sorry, I cannot respond right now.";
  } catch (error) {
    console.error('Groq Chat Error:', error);
    throw new Error('Failed to communicate with AI Chatbot');
  }
};

module.exports = {
  analyzeSymptoms,
  generalChat
};
