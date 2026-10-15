import { Client } from "@elastic/elasticsearch";
import { readFileSync } from "node:fs";
import path from "node:path";

export const ORDERS_INDEX = "orders";

export const es = new Client({
  node: process.env.ELASTICSEARCH_URL ?? "http://localhost:9200",
});

export async function ensureOrdersIndex(): Promise<void> {
  const exists = await es.indices.exists({ index: ORDERS_INDEX });
  if (exists) return;

  const mapping = JSON.parse(
    readFileSync(path.join(__dirname, "..", "mapping.json"), "utf-8"),
  );
  await es.indices.create({ index: ORDERS_INDEX, ...mapping });
}
