import { GoogleGenerativeAI } from "@google/generative-ai";
import { Project, Opportunity, AnalysisResult, NewsItem } from "../types";

const API_KEY = "AIzaSyAETzNC-_aCCglnUfUpzT-1XL3T8Dtq87o";
const MODEL_NAME = "gemini-2.0-flash";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

export const hasApiKey = (): boolean => true;

const cleanJsonString = (text: string): string => {
  if (!text) return "[]";
  let clean = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
  const firstBracket = clean.indexOf('[');
  const firstBrace = clean.indexOf('{');
  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
     clean = clean.substring(firstBracket);
     const lastBracket = clean.lastIndexOf(']');
     if (lastBracket !== -1) clean = clean.substring(0, lastBracket + 1);
  } else if (firstBrace !== -1) {
     clean = clean.substring(firstBrace);
     const lastBrace = clean.lastIndexOf('}');
     if (lastBrace !== -1) clean = clean.substring(0, lastBrace + 1);
  }
  return clean;
};

export const fetchWeeklyRussianNews = async (): Promise<NewsItem[]> => {
  const today = new Date().toISOString().split('T')[0];
  const prompt = `
    You are a Market Intelligence Analyst. Today is ${today}.
    List 3-5 latest industrial projects in Russia/Central Asia (last 7 days).
    Focus on: Power Plants, Petrochemical, Data Centers.
    Strictly return a JSON Array.
  `;
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data = JSON.parse(cleanJsonString(text));
    if (Array.isArray(data)) {
        return data.map((item: any, idx: number) => ({ ...item, id: `news_${idx}`, isRead: false }));
    }
    return [];
  } catch (error) {
    return [{ id: 'err', title: 'Error', summary: error.message, date: today, source: 'System', url: '#', sector: 'Other', isRead: false }];
  }
};

export const analyzeProjectRisk = async (project: Project | Opportunity, contextStr: string): Promise<AnalysisResult> => {
  const prompt = `Analyze risk. Context: ${contextStr} Project: ${JSON.stringify(project)} Return JSON.`;
  try {
    const result = await model.generateContent(prompt);
    return JSON.parse(cleanJsonString(result.response.text())) as AnalysisResult;
  } catch (e) {
    return { riskLevel: 'Medium', summary: 'Error', strategySuggestions: [], missingInfo: [] };
  }
};

export const createResearchChat = () => {
  const chat = model.startChat({ history: [] });
  return {
    sendMessage: async (msgObj: { message: string }) => {
      try {
        const result = await chat.sendMessage(msgObj.message);
        return { text: result.response.text(), functionCalls: [] };
      } catch (e) { return { text: "Error: " + e.message }; }
    },
    sendToolResponse: async () => { return { text: "Saved." }; }
  };
};
export class MockChat {}
