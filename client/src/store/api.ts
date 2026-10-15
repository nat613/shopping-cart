import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Category, OrderRequest } from "./types";

const catalogUrl = import.meta.env.VITE_CATALOG_URL ?? "http://localhost:5249";
const ordersUrl = import.meta.env.VITE_ORDERS_URL ?? "http://localhost:4000";

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery: fetchBaseQuery({ baseUrl: catalogUrl }),
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({ query: () => "/api/categories" }),
  }),
});

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({ baseUrl: ordersUrl }),
  endpoints: (builder) => ({
    createOrder: builder.mutation<{ orderId: string }, OrderRequest>({
      query: (body) => ({ url: "/api/orders", method: "POST", body }),
    }),
  }),
});

export const { useGetCategoriesQuery } = catalogApi;
export const { useCreateOrderMutation } = ordersApi;
