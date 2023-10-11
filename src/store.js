import { configureStore } from "@reduxjs/toolkit";

import bookReducer from "./features/book/bookSlice";
import userReducer from "./features/user/userSlice";
import cartReducer from "./features/cart/cartSlice";
import orderReducer from "./features/order/orderSlice";

const store = configureStore({
  reducer: {
    book: bookReducer,
    user: userReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});

export default store;
