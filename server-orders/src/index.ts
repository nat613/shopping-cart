import express from "express";
import cors from "cors";
import { ensureOrdersIndex } from "./elastic";
import { ordersRouter } from "./ordersRouter";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"] }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

//routes
app.use("/api/orders", ordersRouter);

// Error handling middleware - should be defined after all other routes and middleware
app.use((err: Error & { status?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err.status === 400) {
    res.status(400).json({ errors: [{ field: "body", message: "Malformed JSON" }] });
    return;
  }
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
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
