
import { GoogleGenAI } from "@google/genai";

// Initialize with the API key from process.env.API_KEY exclusively
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIInterpretation = async (nightmareText: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `사용자가 꾼 악몽 내용: "${nightmareText}". 
      
      이 내용을 분석하여 다음 형식을 반드시 지켜서 답해줘:
      
      [꿈의 의미]
      (꿈에 대한 심리학적/상징적 해석을 2~3줄로 작성)
      
      [심리 키워드]
      #키워드1 #키워드2 #키워드3
      
      [몽글의 마음 케어]
      (사용자를 향한 따뜻한 위로나 현실적인 주의점 한 문장)
      
      답변은 너무 길지 않게, 하지만 충분히 공감되도록 작성해줘.`,
      config: {
        systemInstruction: "당신은 몽글(Monggle)의 AI 악몽 해석 전문가입니다. 사용자의 무의식을 분석하여 불안의 원인을 짚어주고, 마음을 편안하게 해주는 가이드를 제공합니다.",
        temperature: 0.7,
      },
    });
    // Access response.text directly (not a method)
    return response.text || "분석 실패. 잠시 후 다시 시도해줘.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "연결이 원활하지 않아. 나중에 다시 알려줘.";
  }
};
