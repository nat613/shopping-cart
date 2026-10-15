import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import { catalogApi, ordersApi } from "./api";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [catalogApi.reducerPath]: catalogApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(catalogApi.middleware, ordersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
