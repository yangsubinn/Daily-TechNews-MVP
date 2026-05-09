import "dotenv/config";
import { fetchNews } from "./rss";

async function main() {
  console.log("뉴스 수집 시작...\n");

  const news = await fetchNews();

  console.log(`총 ${news.length}개 기사 수집됨\n`);

  for (const item of news) {
    console.log(`[${item.source}] ${item.title}`);
    console.log(`  URL: ${item.url}`);
    console.log(`  날짜: ${item.publishedAt}`);
    console.log("");
  }
}

main().catch(console.error);
