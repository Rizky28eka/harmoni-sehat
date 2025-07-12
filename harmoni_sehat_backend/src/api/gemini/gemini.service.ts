import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../../config/env";
import { AppError } from "../../utils/AppError";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const analyzeSymptoms = async (symptoms: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new AppError("Gemini API key is not configured.", 500);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Analyze the following symptoms and provide potential conditions or advice. This is NOT a diagnosis and should not be taken as medical advice. Always consult a healthcare professional. Symptoms: ${symptoms}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error: any) {
    console.error("Error analyzing symptoms with Gemini API:", error);
    throw new AppError(`Failed to analyze symptoms: ${error.message || "Unknown error"}`, 500);
  }
};

export const analyzeSentiment = async (text: string): Promise<'positive' | 'negative' | 'neutral'> => {
  if (!GEMINI_API_KEY) {
    throw new AppError("Gemini API key is not configured.", 500);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Analyze the sentiment of the following text and return only 'positive', 'negative', or 'neutral'. Text: ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const sentiment = response.text().trim().toLowerCase();

    if (['positive', 'negative', 'neutral'].includes(sentiment)) {
      return sentiment as 'positive' | 'negative' | 'neutral';
    } else {
      return 'neutral'; // Default to neutral if sentiment is not recognized
    }
  } catch (error: any) {
    console.error("Error analyzing sentiment with Gemini API:", error);
    return 'neutral'; // Default to neutral on error
  }
};