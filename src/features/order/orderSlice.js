import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async function (data, { rejectWithValue }) {
    try {
      const response = await fetch(`${BACKEND_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify(data.order),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Please login");
        } else {
          toast.error(responseData.message);
        }
        return rejectWithValue(responseData.message);
      }

      //console.log(responseData);

      toast.success("Order placed successfully.");

      data.callback(responseData.order._id);

      return responseData;
    } catch (err) {
      console.log(err);
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async function (data, { rejectWithValue }) {
    try {
      const response = await fetch(`${BACKEND_URL}/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      //console.log("fetching orders");

      const responseData = await response.json();

      if (!response.ok) {
        toast.error(responseData.message);
        return rejectWithValue(responseData.message);
      }

      //      console.log(responseData);
      return responseData;
    } catch (err) {
      console.log(err);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "order/fetchOrderById",
  async function (data, { rejectWithValue }) {
    try {
      const response = await fetch(`${BACKEND_URL}/orders/${data.orderId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        toast.error(responseData.message);
        return rejectWithValue(responseData.message);
      }

      //      console.log(responseData);
      return responseData;
    } catch (err) {
      console.log(err);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builders) =>
    builders
      .addCase(createOrder.pending, function (state) {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, function (state, action) {
        state.isLoading = false;
        state.error = "";
      })
      .addCase(createOrder.rejected, function (state, action) {
        (state.orders = []), (state.isLoading = false);
        state.error = "";
      }) // createOrder
      .addCase(fetchOrders.pending, function (state) {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, function (state, action) {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.error = "";
      })
      .addCase(fetchOrders.rejected, function (state, action) {
        state.isLoading = false;

        state.error = action.payload;
      }) // fetchOrders
      .addCase(fetchOrderById.pending, function (state) {
        state.isLoading = true;
      })
      .addCase(fetchOrderById.fulfilled, function (state, action) {
        state.isLoading = false;
        state.currentOrder = action.payload.order;
        state.error = "";
      })
      .addCase(fetchOrderById.rejected, function (state, action) {
        state.isLoading = false;
        state.error = action.payload;
        state.currentOrder = null;
      }), // fetchOrderById
});

export default orderSlice.reducer;
