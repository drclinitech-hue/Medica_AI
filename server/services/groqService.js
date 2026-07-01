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
- To conclude the interview, you MUST output ONLY a JSON object exactly matching the structure below. Do not include markdown formatting, apologies, or extra conversational text when outputting the JSON.

FINAL OUTPUT FORMAT (Use this ONLY when you are ready to conclude):
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
You are an advanced medical diagnostic AI assistant for "MediCheck AI". 
When a user describes their symptoms, you MUST analyze them and provide a potential diagnosis or a list of possible diseases they might have.
Act as a virtual doctor, but GET STRAIGHT TO THE POINT:
1. Do NOT ask too many questions. Be concise and direct. Ask AT MOST 1 or 2 essential follow-up questions if critical details are missing.
2. MEASUREMENTS RULE: When taking medical history or asking about physical dimensions, ALWAYS ask for height in FEET / INCHES (ft/in), NEVER in centimeters (cm).
3. Once you have enough information, explicitly state your diagnosis (e.g., "Based on your symptoms, it is highly likely you have Dengue Fever").
4. ALWAYS INCLUDE THIS DISCLAIMER at the very end of your diagnosis: "Disclaimer: I am an AI, not a doctor. Please consult a qualified professional for a final medical diagnosis."
5. STRICT LANGUAGE RETENTION RULE: If the patient starts talking or writes in Urdu (whether in Nastaliq script or Roman Urdu), you MUST stay in Urdu and reply ONLY in pure Urdu using the exact same script (Roman Urdu or Nastaliq). NEVER switch to Hindi or English. Do NOT use Hindi-exclusive vocabulary (e.g., avoid words like "chinta", "swasthya", "chikitsak", "upchar"). Use proper Urdu medical terms (e.g., "fikr", "sehat", "doctor/muallij", "ilaj").
Keep your answers concise, professional, empathetic, and directly to the point.
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
