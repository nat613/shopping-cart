import express from "express";
import cors from "cors";
import { ensureOrdersIndex } from "./elastic";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"] }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

async function main() {
  await ensureOrdersIndex();
  app.listen(port, () => {
    console.log(`Orders API listening on port ${port}`);
  });
}

main().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
