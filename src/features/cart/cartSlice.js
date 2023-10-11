import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], totalPrice: 0 };

// cartItem -> id, title, quantity, price

function changeCartItemQuantity(cartItems, itemId, changeNumber) {
  return cartItems.map((cartItem) => {
    if (cartItem.id !== itemId) {
      return cartItem;
    }

    cartItem = { ...cartItem, quantity: cartItem.quantity + changeNumber };
    return cartItem;
  });
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const itemAlreadyInCart = state.cartItems.find(
        (cartItem) => cartItem.id === item.id
      );

      if (itemAlreadyInCart) {
        state.cartItems = changeCartItemQuantity(
          state.cartItems,
          item.id,
          item.quantity
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      state.totalPrice = state.totalPrice + item.price;

      localStorage.setItem("cart", JSON.stringify(state));
      toast.success("Book added to cart");
    },

    removeFromCart: (state, action) => {
      const { type, id } = action.payload;
      const existingCartItem = state.cartItems.find((item) => item.id === id);
      if (!existingCartItem) {
        return;
      }

      if (type === "remove") {
        state.totalPrice =
          state.totalPrice - existingCartItem.quantity * existingCartItem.price;
        state.cartItems = state.cartItems.filter((item) => item.id !== id);
      } else {
        state.totalPrice = state.totalPrice - existingCartItem.price;
        if (existingCartItem.quantity === 1) {
          state.cartItems = state.cartItems.filter((item) => item.id !== id);
        } else {
          state.cartItems = changeCartItemQuantity(state.cartItems, id, -1);
        }
      }

      localStorage.setItem("cart", JSON.stringify(state));
      //      toast.success("Book removed from cart");
    },
    clearCart: (state) => {
      localStorage.removeItem("cart");
      state.cartItems = [];
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
