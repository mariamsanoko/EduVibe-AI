
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, QuizQuestion } from "../types";

export class GeminiService {
  // Fix: Instantiation is now handled inside each method to follow SDK guidelines:
  // "Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key from the dialog."

  async getTutorResponse(history: ChatMessage[], context: string): Promise<string> {
    // Fix: Always use new GoogleGenAI({apiKey: process.env.API_KEY}) right before generateContent calls.
    // Switched to gemini-3-pro-preview for advanced reasoning required by the technical curriculum.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      config: {
        systemInstruction: `Tu es un tuteur expert amical pour la plateforme EduVibe. Tu réponds TOUJOURS en Français. L'utilisateur étudie : "${context}". Aide-le à comprendre, donne des exemples concrets et sois encourageant.`,
      },
    });

    // Fix: Access .text property directly (not a method) as per SDK instructions.
    return response.text || "Désolé, je n'ai pas pu générer de réponse pour le moment.";
  }

  async generateQuiz(lessonContent: string): Promise<QuizQuestion[]> {
    // Fix: Always use new GoogleGenAI({apiKey: process.env.API_KEY}) right before generateContent calls.
    // gemini-3-pro-preview is best suited for generating high-quality educational material in STEM/coding.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: `Génère 3 questions de quiz en FRANÇAIS basées sur : "${lessonContent}"` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctIndex", "explanation"]
          }
        }
      }
    });

    try {
      // Fix: Direct access to the .text property of GenerateContentResponse.
      return JSON.parse(response.text?.trim() || "[]");
    } catch (e) {
      console.error("Failed to parse quiz JSON", e);
      return [];
    }
  }
}

export const geminiService = new GeminiService();
