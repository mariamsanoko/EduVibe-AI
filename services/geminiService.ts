
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, QuizQuestion } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Fix: Always use named parameter for apiKey and use process.env.API_KEY directly as per guidelines.
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getTutorResponse(history: ChatMessage[], context: string): Promise<string> {
    // Fix: Proper multi-turn content structure with roles and parts, and use systemInstruction in config.
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      config: {
        systemInstruction: `Tu es un tuteur expert amical pour la plateforme EduVibe. Tu réponds TOUJOURS en Français. L'utilisateur étudie : "${context}". Aide-le à comprendre, donne des exemples concrets et sois encourageant.`,
      },
    });

    // Fix: Access .text property directly (not a method).
    return response.text || "Désolé, je n'ai pas pu générer de réponse pour le moment.";
  }

  async generateQuiz(lessonContent: string): Promise<QuizQuestion[]> {
    // Fix: Structural content definition and response.text property access.
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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
      // Fix: Access .text property.
      return JSON.parse(response.text?.trim() || "[]");
    } catch (e) {
      console.error("Failed to parse quiz JSON", e);
      return [];
    }
  }
}

export const geminiService = new GeminiService();
