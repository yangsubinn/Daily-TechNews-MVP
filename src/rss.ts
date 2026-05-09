import Parser from "rss-parser";

const parser = new Parser();

// 키워드 필터링 적용하는 일반 피드
const FILTERED_FEEDS = [
  { name: "Hacker News", url: "https://hnrss.org/frontpage" },
  { name: "TechCrunch AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/" },
];

// iOS/Swift 전문 피드 (키워드 필터 없이 전부 수집)
const IOS_FEEDS = [
  { name: "SwiftLee", url: "https://www.avanderlee.com/feed" },
  { name: "Hacking with Swift", url: "https://www.hackingwithswift.com/articles/rss" },
  { name: "NSHipster", url: "https://nshipster.com/feed.xml" },
  { name: "Apple Developer News", url: "https://developer.apple.com/news/rss/news.rss" },
];

const MAX_PER_FEED = 5;

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

async function fetchFromFeeds(feeds: { name: string; url: string }[], filterKeywords: boolean): Promise<NewsItem[]> {
  const results: NewsItem[] = [];

  for (const feed of feeds) {
    try {
      const parsed = await parser.parseURL(feed.url);

      let count = 0;
      for (const item of parsed.items) {
        if (count >= MAX_PER_FEED) break;

        const title = item.title ?? "";
        const content = item.contentSnippet ?? item.content ?? "";

        if (filterKeywords && !matchesKeyword(title) && !matchesKeyword(content)) continue;

        results.push({
          title,
          url: item.link ?? "",
          source: feed.name,
          publishedAt: item.pubDate ?? new Date().toISOString(),
          content: content.slice(0, 500),
        });
        count++;
      }
    } catch (e) {
      console.error(`[RSS] ${feed.name} 수집 실패:`, e);
    }
  }

  return results;
}

export async function fetchNews(): Promise<NewsItem[]> {
  const [filtered, ios] = await Promise.all([
    fetchFromFeeds(FILTERED_FEEDS, true),
    fetchFromFeeds(IOS_FEEDS, false),
  ]);

  return [...filtered, ...ios];
}
