import "dotenv/config";
import { fetchNews } from "./rss";
import { summarize } from "./summarize";
import { saveToNotion, isDuplicate } from "./notion";

async function main() {
  console.log("뉴스 수집 시작...\n");

  const news = await fetchNews();
  console.log(`총 ${news.length}개 기사 수집됨\n`);

  let saved = 0;
  let skipped = 0;

  for (const item of news) {
    console.log(`[${item.source}] ${item.title}`);

    try {
      if (await isDuplicate(item.url)) {
        console.log(`  - 중복 스킵`);
        skipped++;
        continue;
      }

      const result = await summarize(item.title, item.content);
      await saveToNotion(item, result);
      console.log(`  ✓ Notion 저장 완료 (${result.importance})`);
      saved++;
    } catch (e) {
      console.error(`  ✗ 실패:`, e);
    }
  }

  console.log(`\n완료: ${saved}개 저장, ${skipped}개 중복 스킵`);
}

main().catch(console.error);
