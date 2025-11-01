import { configureStore } from "@reduxjs/toolkit";
import { Cartslice } from "./Cartslice";

export const Cartstore = configureStore({
  reducer: {
    cart: Cartslice.reducer,
  },
});
