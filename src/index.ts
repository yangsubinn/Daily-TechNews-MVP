import "dotenv/config";
import { fetchNews } from "./rss";
import { summarize } from "./summarize";

async function main() {
  console.log("뉴스 수집 시작...\n");

  const news = await fetchNews();
  console.log(`총 ${news.length}개 기사 수집됨\n`);

  for (const item of news) {
    console.log(`[${item.source}] ${item.title}`);
    console.log(`  URL: ${item.url}`);

    try {
      const result = await summarize(item.title, item.content);
      console.log(`  중요도: ${result.importance}`);
      console.log(`  요약: ${result.summary}`);
      console.log(`  왜 중요한가: ${result.whyImportant}`);
    } catch (e) {
      console.error(`  요약 실패:`, e);
    }

    console.log("");
  }
}

main().catch(console.error);
