import express from "express";
import cors from "cors";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"] }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Orders API listening on port ${port}`);
});
