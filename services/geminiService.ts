
import { GoogleGenAI, Type } from "@google/genai";
import { Task } from "../types";

// Helper to get the AI instance safely in browser environments
const getAI = () => {
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const refineTaskDescription = async (task: Partial<Task>): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as a professional project manager. Refine this task title and description into a concise, actionable instruction: 
    Title: ${task.title}
    Description: ${task.description}`,
    config: {
      temperature: 0.7,
    }
  });
  return response.text || "";
};

export const suggestSubtasks = async (task: Task): Promise<string[]> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on this task: "${task.title} - ${task.description}", suggest exactly 3-5 concrete subtasks. Return ONLY a JSON array of strings.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  
  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return [];
  }
};

export const getDailyBriefing = async (tasks: Task[]): Promise<any> => {
  const ai = getAI();
  const pendingTasks = tasks.filter(t => t.status !== 'Done');
  const taskSummary = pendingTasks.map(t => `${t.title} (Priority: ${t.priority})`).join(", ");
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze these tasks and provide a short motivating daily briefing.
    Tasks: ${taskSummary}
    Include:
    1. A summary of the day's outlook.
    2. Which 3 tasks should be prioritized and why.
    3. A brief productivity tip.
    Return JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          priorityTasks: { type: Type.ARRAY, items: { type: Type.STRING } },
          productivityTip: { type: Type.STRING }
        },
        required: ["summary", "priorityTasks", "productivityTip"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return null;
  }
};
