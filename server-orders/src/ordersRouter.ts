import { Router } from "express";
import { randomUUID } from "node:crypto";
import { es, ORDERS_INDEX } from "./elastic";
import { orderSchema } from "./orderSchema";

export const ordersRouter = Router();

ordersRouter.post("/", async (req, res) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    res.status(400).json({ errors });
    return;
  }

  const orderId = randomUUID();
  try {
    await es.index({
      index: ORDERS_INDEX,
      id: orderId,
      document: { createdAt: new Date().toISOString(), ...parsed.data },
      refresh: "wait_for",
    });
  } catch (err) {
    console.error("Failed to save order:", err);
    res.status(500).json({ message: "Failed to save order" });
    return;
  }

  res.status(201).json({ orderId });
});
