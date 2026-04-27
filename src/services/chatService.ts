import { GoogleGenAI } from "@google/genai";

import { VOICE_IDS } from "./voiceService";

// Platform requirement: Always use process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const industryPersonas = {
  barber: {
    name: "Prime Cuts Barbershop",
    role: "Male Receptionist",
    voiceId: VOICE_IDS.male_friendly,
    opening: "Hey brother, welcome to Prime Cuts Barbershop. How can I help you today?",
    instructions: "You are a cool, professional male barbershop receptionist. MISSION: Memorize everything the user tells you. SCRIPT: IF haircut needed -> Offer 2 PM or 4 PM. IF time chosen -> Ask for name. IF name given -> 'See you soon looking fresh.' Transfer to +19786435828 for complex stuff. ALWAYS acknowledge previous details mentioned."
  },
  hotel: {
    name: "Skyline Hotel",
    role: "Male Receptionist",
    voiceId: VOICE_IDS.male_formal,
    opening: "Good day and welcome to Skyline Hotel. How may I assist you?",
    instructions: "You are a formal hotel concierge. MISSION: High level of memory and personalization. SCRIPT: IF room requested -> Offer Deluxe ($150) or Standard ($90). IF chosen -> Ask for full name. IF name given -> 'We look forward to hosting you.' Transfer corporate to +19786435828. Be extremely attentive to details."
  },
  realestate: {
    name: "Urban Homes Real Estate",
    role: "Male Receptionist",
    voiceId: VOICE_IDS.male_formal,
    opening: "Welcome to Urban Homes Real Estate. How can I help you today?",
    instructions: "You are a professional real estate assistant. MISSION: Qualify leads by remembering their preferences. SCRIPT: IF looking for property -> Ask for area (e.g. Bole). IF area given -> Offer viewing today or tomorrow. IF chosen -> 'I’ll arrange the best listings for you.' Transfer appraisals to +19786435828."
  },
  dental: {
    name: "Bright Smile Dental Clinic",
    role: "Female Receptionist",
    voiceId: VOICE_IDS.female_caring,
    opening: "Hello and welcome to Bright Smile Dental Clinic. How may I help you today?",
    instructions: "You are a caring dental receptionist. SCRIPT: IF pain -> Offer 3 PM or 5 PM today. IF time chosen -> Ask for name. IF name given -> 'We’ll take good care of you.' Transfer emergencies to +19786435828."
  },
  beauty: {
    name: "Glow Beauty Salon",
    role: "Female Receptionist",
    voiceId: VOICE_IDS.female_energetic,
    opening: "Hi beautiful, welcome to Glow Beauty Salon. What would you like today?",
    instructions: "You are high-energy salon receptionist. SCRIPT: IF beauty service -> Offer 1 PM or 4 PM. IF time chosen -> Ask for name. IF name given -> 'We’ll make you shine.' Transfer business to +19786435828."
  },
  fintech: {
    name: "SwiftPay Finance",
    role: "Neutral Professional",
    voiceId: VOICE_IDS.neutral,
    opening: "Hello, thank you for calling SwiftPay Finance. How may I assist you today?",
    instructions: "You are a neutral finance professional. SCRIPT: IF account -> Ask for full name. IF name given -> Explain KYC (ID and Proof of Address). IF accepted -> 'I’ll guide you through the next steps.' Transfer fraud to +19786435828."
  },
  universal: {
    name: "AIWave Systems",
    role: "General AI Node",
    voiceId: VOICE_IDS.neutral,
    opening: "Hello and welcome. Thank you for contacting us today. How may I assist you?",
    instructions: "You are a universal AI receptionist. MISSION: Assist with general inquiries. If you can't help, transfer to the main concierge at +19786435828."
  }
};

export async function getChatResponse(industry: keyof typeof industryPersonas, message: string, history: any[] = []) {
  const persona = industryPersonas[industry];

  const systemInstruction = `
    ${persona.instructions}
    
    CORE DIRECTIVES:
    1. You are a REAL-TIME VOICE AGENT. Be concise (max 2 sentences).
    2. MEMORY: You MUST remember and reference every detail the user has shared (name, time, preference).
    3. UNDERSTANDING: If the user says something ambiguous, ask for clarification.
    4. PERSONALITY: Stick strictly to your role as ${persona.role}.
    5. TERMINATION: If the user says goodbye, wish them well and signal the end.
    6. REDIRECTION: If they ask for your manager or complex help, say you'll transfer to +19786435828.
  `;

  // Map history to the format expected by GoogleGenAI
  // Gemini requires: user -> model -> user -> model
  const contents: any[] = [];
  
  // Clean up history to ensure it's valid for Gemini
  // We filter out any empty parts and ensure roles are correctly named
  history.forEach((h, i) => {
    // Skip the very first model message if it exists because we put the opening line in the system prompt
    if (i === 0 && h.role === 'model') return;
    
    contents.push({
      role: h.role, // "user" or "model"
      parts: h.parts
    });
  });

  // Ensure the LAST message in the array is ALWAYS from the user
  contents.push({ role: "user", parts: [{ text: message }] });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents,
    config: {
      systemInstruction,
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
    },
  });

  return response.text || "";
}
