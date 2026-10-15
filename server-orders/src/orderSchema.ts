import { z } from "zod";

const requiredText = (max: number) =>
  z.string().trim().min(1, "Required").max(max, `Must be at most ${max} characters`);

export const orderSchema = z.object({
  customer: z.object({
    fullName: requiredText(100),
    address: requiredText(200),
    email: z.email("Invalid email address").max(254, "Must be at most 254 characters"),
  }),
  items: z
    .array(
      z.object({
        productId: z.int().positive(),
        productName: requiredText(200),
        categoryId: z.int().positive(),
        categoryName: requiredText(200),
        quantity: z
          .int("Quantity must be a whole number")
          .min(1, "Quantity must be at least 1")
          .max(99, "Quantity must be at most 99"),
      }),
    )
    .min(1, "Order must contain at least one item")
    .refine((items) => new Set(items.map((i) => i.productId)).size === items.length, {
      message: "Duplicate productId in items",
    }),
});

export type OrderInput = z.infer<typeof orderSchema>;
