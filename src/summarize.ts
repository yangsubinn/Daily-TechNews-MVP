import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface Summary {
  titleKo: string;
  summary: string;
  importance: "LOW" | "MID" | "HIGH";
  tags: string[];
}

export async function summarize(title: string, content: string): Promise<Summary> {
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: `너는 개발자용 뉴스 브리핑 에디터다.
다음 뉴스를:
- 제목을 한국어로 번역하고
- 3줄로 요약하고
- 중요도를 LOW/MID/HIGH 로 판단하고
- 관련 분야 태그를 최대 3개 골라라. 태그는 반드시 아래 목록에서만 선택해라:
  iOS, Swift, SwiftUI, Xcode, Apple, AI, LLM, OpenAI, Gemini, Claude, MCP, Agent, Firebase, Android, Web, Security, Career, Business
대상 독자는 iOS/AI 개발자다.

제목: ${title}
내용: ${content}

반드시 아래 JSON 형식으로만 응답해라. 다른 텍스트 없이 JSON만:
{"titleKo":"...","summary":"...","importance":"HIGH","tags":["AI","LLM"]}`,
      },
    ],
    temperature: 0.3,
  });

  const text = response.choices[0]?.message?.content?.trim() ?? "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`JSON 파싱 실패: ${text}`);

  return JSON.parse(jsonMatch[0]) as Summary;
}
