import "dotenv/config";
import { fetchNews } from "./rss";
import { summarize } from "./summarize";

const PREVIEW_COUNT = 3;

async function preview() {
  console.log("=".repeat(60));
  console.log("  Daily TechNews Preview");
  console.log("=".repeat(60));
  console.log();

  const news = await fetchNews();
  const targets = news.slice(0, PREVIEW_COUNT);

  console.log(`전체 ${news.length}개 수집 → 상위 ${PREVIEW_COUNT}개 요약\n`);

  for (let i = 0; i < targets.length; i++) {
    const item = targets[i]!;
    console.log(`[${i + 1}/${PREVIEW_COUNT}] 요약 중... ${item.title.slice(0, 40)}...`);

    try {
      const result = await summarize(item.title, item.content);

      const badge = result.importance === "HIGH" ? "🔴" : result.importance === "MID" ? "🟡" : "🟢";

      console.log();
      console.log(`${badge} [${result.importance}] ${item.title}`);
      console.log(`- 출처: ${item.source}`);
      console.log(`- URL: ${item.url}`);
      console.log(`- 요약: ${result.summary}`);
      console.log(`- 왜 중요한가: ${result.whyImportant}`);
      console.log("-".repeat(60));
    } catch (e) {
      console.error(`  요약 실패:`, e);
    }

    console.log();
  }

  console.log("Preview 완료!");
}

preview().catch(console.error);
