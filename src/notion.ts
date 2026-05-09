import { Client } from "@notionhq/client";
import type { NewsItem } from "./rss";
import type { Summary } from "./summarize";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DB_ID = process.env.NOTION_DB_ID!;

export async function saveToNotion(item: NewsItem, summary: Summary): Promise<void> {
  await notion.pages.create({
    parent: { database_id: DB_ID },
    properties: {
      Title: {
        title: [{ text: { content: summary.titleKo } }],
      },
      Summary: {
        rich_text: [{ text: { content: summary.summary } }],
      },
      Tags: {
        multi_select: summary.tags.map((tag) => ({ name: tag })),
      },
      Importance: {
        select: { name: summary.importance },
      },
      Source: {
        select: { name: item.source },
      },
      URL: {
        url: item.url,
      },
      "Published At": {
        date: { start: new Date(item.publishedAt).toISOString() },
      },
    },
  });
}
