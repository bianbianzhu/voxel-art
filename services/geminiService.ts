import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const generateNaturePoetry = async (context: string): Promise<string> => {
  if (!API_KEY) {
    return "Please configure your API Key to hear the whispers of nature.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    // Using flash for speed
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a very short, haiku-style or poetic sentence about this scene: ${context}. Keep it under 20 words. Do not include quotes.`,
      config: {
        temperature: 0.8,
      }
    });

    return response.text || "The leaves rustle silently...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The wind is too loud to hear the spirits today.";
  }
};