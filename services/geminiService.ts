
import { GoogleGenAI, Type } from "@google/genai";
import { CategoryType, QuestionCard } from "../types";

export const generateMoreQuestions = async (category: CategoryType): Promise<QuestionCard[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `یک سوال جدید در دسته "${category}" برای یک بازی آموزشی طراحی کن. 
      سوال باید به زبان فارسی باشد. اگر سوال تستی است، ۴ گزینه بده. 
      اگر در دسته بازی است، یک چالش عملی کوتاه باشد.
      حتماً یک راهنمایی (hint) کوتاه هم اضافه کن.`,
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
              hint: { type: Type.STRING }
            },
            required: ["question", "hint"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    return data.map((q: any) => ({
      ...q,
      id: Math.random().toString(36).substr(2, 9),
      category
    }));
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
};

export const generateImage = async (prompt: string, size: "1K" | "2K" | "4K"): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: `Create a vibrant 3D animated style vector illustration of: ${prompt}. Theme: Pirate Treasure Island, high detail, masterpiece.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: size
        }
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error: any) {
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_EXPIRED");
    }
    console.error("Error generating image:", error);
    return null;
  }
};
