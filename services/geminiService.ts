
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

export const extractBackground = async (base64Image: string, mimeType: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Clean up base64 string if it contains the data prefix
  const base64Data = base64Image.replace(/^data:image\/(png|jpeg|webp);base64,/, "");

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: "Identify all foreground subjects, people, text overlays, and floating objects in this image. Remove them and reconstruct the background perfectly, filling in the holes with a seamless texture that matches the existing background pattern (e.g., corkboard, wall, sky). Only return the final reconstructed background image.",
        },
      ],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("The model did not return an image part in its response.");
};
