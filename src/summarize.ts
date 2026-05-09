import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface Summary {
  summary: string;
  whyImportant: string;
  importance: "LOW" | "MID" | "HIGH";
}

export async function summarize(title: string, content: string): Promise<Summary> {
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: `너는 개발자용 뉴스 브리핑 에디터다.
다음 뉴스를:
- 3줄로 요약하고
- 왜 중요한지 설명하고
- 중요도를 LOW/MID/HIGH 로 판단해라.
대상 독자는 iOS/AI 개발자다.

제목: ${title}
내용: ${content}

반드시 아래 JSON 형식으로만 응답해라. 다른 텍스트 없이 JSON만:
{"summary":"...","whyImportant":"...","importance":"HIGH"}`,
      },
    ],
    temperature: 0.3,
  });

  const text = response.choices[0]?.message?.content?.trim() ?? "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`JSON 파싱 실패: ${text}`);

  return JSON.parse(jsonMatch[0]) as Summary;
}
