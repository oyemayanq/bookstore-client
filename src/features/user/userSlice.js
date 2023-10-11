import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  userBooks: [],
  userName: "",
  isLoading: false,
  token: "",
  isAuthenticated: false,
  error: null,
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function addToLocaStorage(token) {
  localStorage.setItem("token", token);
}

export const loginUser = createAsyncThunk(
  "user/login",
  async function (user, { rejectWithValue }) {
    try {
      const response = await fetch(`${BACKEND_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return rejectWithValue(data.message);
      }

      toast.success("Logged in successfully");

      addToLocaStorage(data.token);

      return data.token;
    } catch (err) {
      console.log(err);
    }
  }
);

export const signupUser = createAsyncThunk(
  "user/signup",
  async function (user, { rejectWithValue }) {
    try {
      const response = await fetch(`${BACKEND_URL}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return rejectWithValue(data.message);
      }

      toast.success("Signed up successfully");

      addToLocaStorage(data.token);

      return data.token;
    } catch (err) {
      console.log(err);
    }
  }
);

export const fetchBooksByUser = createAsyncThunk(
  "user/fetchBooksByUser",
  async function (data, { rejectWithValue }) {
    try {
      const response = await fetch(`${BACKEND_URL}/users/books`, {
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

      //console.log(responseData);

      return responseData;
    } catch (err) {
      console.log(err);
    }
  }
);

export const deleteBookById = createAsyncThunk(
  "user/deleteBookById",
  async function (data, { rejectWithValue }) {
    try {
      const response = await fetch(`${BACKEND_URL}/books/${data.bookId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        toast.error(responseData.message);
        return rejectWithValue(responseData.message);
      }

      toast.success("Book deleted");

      //console.log(responseData);

      return responseData;
    } catch (err) {
      console.log(err);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logOut(state) {
      localStorage.removeItem("token");
      state.isAuthenticated = false;
      state.isLoading = false;
      state.token = "";
      state.error = null;
    },
    autoLoginUser(state, action) {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builders) =>
    builders
      .addCase(fetchBooksByUser.pending, function (state) {
        state.isLoading = true;
      })
      .addCase(fetchBooksByUser.fulfilled, function (state, action) {
        state.userBooks = action.payload.books;
        state.userName = action.payload.user.name;
        state.isLoading = false;
        state.error = "";
      })
      .addCase(fetchBooksByUser.rejected, function (state, action) {
        state.isLoading = false;
        state.error = action.payload;
      }) // fetchBooksByUser
      .addCase(deleteBookById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBookById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userBooks = state.userBooks.filter(
          (book) => book._id !== action.payload.bookId
        );
        state.error = "";
      })
      .addCase(deleteBookById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.error = "";
      }) // deleteBookById
      .addCase(loginUser.pending, function (state) {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, function (state, action) {
        state.token = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = "";
      })
      .addCase(loginUser.rejected, function (state) {
        state.isAuthenticated = false;
        state.token = "";
        state.isLoading = false;
        state.error = "";
      }) // loginUser
      .addCase(signupUser.pending, function (state) {
        state.isLoading = true;
      })
      .addCase(signupUser.fulfilled, function (state, action) {
        state.token = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = "";
      })
      .addCase(signupUser.rejected, function (state) {
        state.isAuthenticated = false;
        state.token = "";
        state.isLoading = false;
        state.error = "";
      }), // signupUser
});

export const { logOut, autoLoginUser } = userSlice.actions;

export default userSlice.reducer;
