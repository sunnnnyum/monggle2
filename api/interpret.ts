
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { nightmareText } = req.body;
  if (!nightmareText) {
    return res.status(400).json({ error: 'nightmareText is required' });
  }

  // 시스템 지침에 따라 process.env.API_KEY 사용
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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

    // GenerateContentResponse.text 속성 사용
    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Server Error:", error);
    return res.status(500).json({ error: "AI 해석 중 오류가 발생했습니다." });
  }
}
