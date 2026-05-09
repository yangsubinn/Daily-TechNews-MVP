import Parser from "rss-parser";

const parser = new Parser();

const RSS_FEEDS = [
  {
    name: "Hacker News",
    url: "https://hnrss.org/frontpage",
  },
  {
    name: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
  },
];

const KEYWORDS = [
  "swiftui",
  "ios",
  "openai",
  "llm",
  "ai",
  "gpt",
  "apple",
  "swift",
  "xcode",
  "machine learning",
  "claude",
  "gemini",
  "agent",
];

export interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  content: string;
}

function matchesKeyword(text: string): boolean {
  const lower = text.toLowerCase();
  return KEYWORDS.some((keyword) => lower.includes(keyword));
}

export async function fetchNews(): Promise<NewsItem[]> {
  const results: NewsItem[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url);

      for (const item of parsed.items) {
        const title = item.title ?? "";
        const content = item.contentSnippet ?? item.content ?? "";

        if (!matchesKeyword(title) && !matchesKeyword(content)) continue;

        results.push({
          title,
          url: item.link ?? "",
          source: feed.name,
          publishedAt: item.pubDate ?? new Date().toISOString(),
          content: content.slice(0, 500),
        });
      }
    } catch (e) {
      console.error(`[RSS] ${feed.name} 수집 실패:`, e);
    }
  }

  return results;
}
