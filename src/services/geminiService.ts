import { GoogleGenAI } from "@google/genai";

// Initialize AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: number;
}

const SYSTEM_INSTRUCTION = `Você é o "Especialista do Teclado", um assistente especializado em hardware de computador, especificamente teclados (mecânicos, membrana, layouts ABNT/ANSI) e atalhos de produtividade para Windows, Mac e Linux.
Sua missão é ajudar alunos a digitar melhor, entender seus equipamentos e dominar atalhos que facilitam a vida.
Sempre que possível, use a ferramenta de busca para fornecer informações atualizadas sobre modelos de teclados ou atalhos específicos de softwares modernos.
Responda de forma clara, técnica porém acessível, e incentive boas práticas de digitação (ergonomia).`;

export async function getAiResponse(message: string, history: ChatMessage[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }] // Enable internet search
      }
    });

    return response.text || "Desculpe, não consegui processar sua resposta no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro ao consultar o Especialista do Teclado. Por favor, tente novamente mais tarde.";
  }
}
