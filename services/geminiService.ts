
import { GoogleGenAI } from "@google/genai";

// Helper to get the AI instance safely
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export async function generateMarketingContent(productName: string, productDescription: string, platform: 'X' | 'Instagram' | 'Facebook' | 'Email') {
  const ai = getAIClient();
  if (!ai) return "Error: API Key missing. Please configure NOON_API_KEY in Vercel.";

  const prompt = `Act as an expert digital marketer for an e-commerce brand selling on Noon.com. 
  Create a high-converting ${platform} post for the following product:
  Product Name: ${productName}
  Product Details: ${productDescription}
  
  Guidelines:
  - Tone: Professional, engaging, and persuasive.
  - Include relevant hashtags.
  - Add a strong Call to Action to buy on Noon.com.
  - For Email, provide a Subject line and Body.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });
    return response.text;
  } catch (error) {
    console.error('Error generating AI content:', error);
    return 'Failed to generate content. Please check your AI configuration.';
  }
}

export async function suggestPromotionStrategy(productName: string, stockLevel: number) {
  const ai = getAIClient();
  if (!ai) return "Error: API Key missing.";

  const prompt = `Suggest a marketing promotion strategy for "${productName}" which currently has ${stockLevel} units in stock. 
  The goal is to optimize ROI while managing inventory. Suggest 3 clear steps.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return 'Unable to suggest strategy at this time.';
  }
}
