
/**
 * 프론트엔드에서 서버리스 API를 호출하기 위한 함수입니다.
 * @google/genai SDK를 사용하지 않고 표준 fetch를 사용합니다.
 */
export const getAIInterpretation = async (nightmareText: string): Promise<string> => {
  try {
    const response = await fetch('/api/interpret', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nightmareText }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API request failed');
    }

    const data = await response.json();
    return data.text || "해석 결과가 없습니다.";
  } catch (error) {
    console.error("Fetch Error:", error);
    return "연결이 원활하지 않아. 나중에 다시 알려줘.";
  }
};
