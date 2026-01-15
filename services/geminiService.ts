
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, QuizQuestion } from "../types";

export class GeminiService {
  async getTutorResponse(history: ChatMessage[], context: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      config: {
        systemInstruction: `Tu es "VibeBot", le tuteur IA d'élite d'EduVibe. 
        Ton style est : pédagogique, encourageant, moderne et direct. 
        CONTEXTE ACTUEL : L'étudiant suit la leçon "${context}".
        RÈGLES :
        1. Réponds toujours en Français.
        2. Utilise le formatage Markdown pour la clarté (gras, listes).
        3. Si l'étudiant semble perdu, propose une analogie simple.
        4. Ne donne jamais la réponse directement à un exercice, aide-le à la trouver.
        5. Termine souvent par une question pour maintenir l'engagement.`,
      },
    });

    return response.text || "Oups, ma connexion a eu un petit souci. Peux-tu reformuler ?";
  }

  async generateQuiz(lessonContent: string): Promise<QuizQuestion[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: `Génère 3 questions de quiz de haut niveau basées sur : "${lessonContent}"` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctIndex", "explanation"]
          }
        }
      }
    });

    try {
      return JSON.parse(response.text?.trim() || "[]");
    } catch (e) {
      return [];
    }
  }
}

export const geminiService = new GeminiService();
