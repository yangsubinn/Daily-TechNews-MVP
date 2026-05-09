import "dotenv/config";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DB_ID = process.env.NOTION_DB_ID!;

async function setupDatabase() {
  console.log("Notion DB 컬럼 세팅 중...\n");

  // 기존 title 컬럼 이름 확인
  const db = await notion.databases.retrieve({ database_id: DB_ID });
  const titleKey = Object.keys(db.properties).find(
    (key) => db.properties[key]?.type === "title"
  ) ?? "Name";

  await notion.databases.update({
    database_id: DB_ID,
    title: [{ text: { content: "Daily Brief" } }],
    properties: {
      [titleKey]: { name: "Title", title: {} },
      Summary: { rich_text: {} },
      Tags: { multi_select: {} },
      Importance: {
        select: {
          options: [
            { name: "HIGH", color: "red" },
            { name: "MID", color: "yellow" },
            { name: "LOW", color: "green" },
          ],
        },
      },
      Source: {
        select: {
          options: [
            { name: "Hacker News", color: "orange" },
            { name: "TechCrunch AI", color: "blue" },
          ],
        },
      },
      URL: { url: {} },
      "Published At": { date: {} },
      "Briefed At": { date: {} },
    },
  });

  console.log("✓ DB 세팅 완료!");
}

setupDatabase().catch(console.error);
