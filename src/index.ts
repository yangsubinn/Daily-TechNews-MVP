import "dotenv/config";
import { fetchNews } from "./rss";
import { summarize } from "./summarize";
import { saveToNotion } from "./notion";

async function main() {
  console.log("뉴스 수집 시작...\n");

  const news = await fetchNews();
  console.log(`총 ${news.length}개 기사 수집됨\n`);

  let saved = 0;

  for (const item of news) {
    console.log(`[${item.source}] ${item.title}`);

    try {
      const result = await summarize(item.title, item.content);
      await saveToNotion(item, result);
      console.log(`  ✓ Notion 저장 완료 (${result.importance})`);
      saved++;
    } catch (e) {
      console.error(`  ✗ 실패:`, e);
    }
  }

  console.log(`\n완료: ${saved}/${news.length}개 저장됨`);
}

main().catch(console.error);
