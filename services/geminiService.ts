
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, QuizQuestion } from "../types";

const API_KEY = process.env.API_KEY || "";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  async getTutorResponse(history: ChatMessage[], context: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { text: `System Context: You are a friendly and expert AI tutor for an online platform called EduVibe. The user is currently studying the following content: "${context}". Help them understand the concepts, answer questions, and provide examples. Keep it concise but educational.` },
        ...history.map(msg => ({ text: `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.text}` }))
      ],
    });

    return response.text || "I'm sorry, I couldn't generate a response right now.";
  }

  async generateQuiz(lessonContent: string): Promise<QuizQuestion[]> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on the following lesson content, generate 3 multiple-choice questions for a quiz. Content: "${lessonContent}"`,
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
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Failed to parse quiz JSON", e);
      return [];
    }
  }
}

export const geminiService = new GeminiService();
