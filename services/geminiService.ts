import { GoogleGenAI, Type, Schema } from "@google/genai";
import { InvoiceData, LineItem } from "../types";

// Define the schema for structured output
const invoiceSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    senderName: { type: Type.STRING },
    clientName: { type: Type.STRING },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          price: { type: Type.NUMBER },
          quantity: { type: Type.INTEGER },
        },
        required: ["name", "description", "price", "quantity"]
      }
    }
  },
  required: ["senderName", "clientName", "items"]
};

export const generateInvoiceData = async (prompt: string): Promise<Partial<InvoiceData>> => {
  if (!process.env.API_KEY) {
    throw new Error("Chave de API não encontrada");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Gere dados de fatura para o seguinte cenário: "${prompt}". 
      Crie nomes de empresas realistas, descrições de itens, preços e quantidades.
      Todo o conteúdo de texto deve estar em Português do Brasil (pt-BR).
      Garanta que os preços sejam números realistas.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: invoiceSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Sem resposta do Gemini");
    }

    const data = JSON.parse(text);
    
    // Transform to match our internal types (adding IDs)
    const items: LineItem[] = data.items.map((item: any) => ({
      ...item,
      id: Math.random().toString(36).substring(7)
    }));

    return {
      senderName: data.senderName,
      clientName: data.clientName,
      items: items
    };

  } catch (error) {
    console.error("Erro ao gerar fatura:", error);
    throw error;
  }
};