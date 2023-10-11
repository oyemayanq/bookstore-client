import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  books: [],
  bookCount: 0,
  searchBooks: [],
  currentBook: null,
  editBook: null,
  isLoading: false,
  error: null,
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchBooks = createAsyncThunk(
  "book/fetchBooks",
  async function (data, { rejectWithValue }) {
    try {
      let searchQuery = data?.searchKey ? `?searchKey=${data.searchKey}` : "";
      searchQuery = `${searchQuery ? `${searchQuery}&` : "?"}page=${data.page}`;

      const response = await fetch(`${BACKEND_URL}/books${searchQuery}`);

      const responseData = await response.json();

      if (!response.ok) {
        toast.error("Books not found.");
        return rejectWithValue(responseData.message);
      }

      //console.log(responseData);
      return {
        books: responseData.books,
        isBookSearch: data?.searchKey ? true : false,
        count: responseData.count,
      };
    } catch (err) {
      console.log(err);
    }
  }
);

export const fetchBookById = createAsyncThunk(
  "book/fetchBookById",
  async function (bookId, { rejectWithValue }) {
    try {
      const response = await fetch(`${BACKEND_URL}/books/${bookId}`);

      const data = await response.json();

      console.log("fetching book");

      if (!response.ok) {
        toast.error("Could not get book details");
        console.log(data);
        return rejectWithValue(data.message);
      }

      //console.log(data);
      return data;
    } catch (err) {
      console.log(err);
    }
  }
);

export const fetchEditBookById = createAsyncThunk(
  "book/fetchEditBookById",
  async function (data, { rejectWithValue }) {
    try {
      const response = await fetch(`${BACKEND_URL}/books/edit/${data.bookId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      const responseData = await response.json();

      console.log("fetching book");

      if (!response.ok) {
        toast.error("Could not get book details");
        return rejectWithValue(responseData.message);
      }

      //console.log(responseData);
      return responseData;
    } catch (err) {
      console.log(err);
    }
  }
);

export const updateBookById = createAsyncThunk(
  "book/updateBookById",
  async function (data, { rejectWithValue }) {
    try {
      const response = await fetch(`${BACKEND_URL}/books/${data.bookId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        body: data.formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        toast.error("Could not update book");
        return rejectWithValue(data.message);
      }

      //      console.log(responseData);
      toast.success("Book updated succesfully");

      data.callback(responseData.book._id);

      return responseData;
    } catch (err) {
      console.log(err);
    }
  }
);

export const createBook = createAsyncThunk(
  "book/createBook",
  async function (data, { rejectWithValue }) {
    try {
      const response = await fetch(`${BACKEND_URL}/books`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        body: data.formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        toast.error("Could not add new book");
        return rejectWithValue(data.message);
      }

      //console.log(responseData);

      toast.success("Book added succesfully.");

      data.callback(responseData.book._id);

      return responseData;
    } catch (err) {
      console.log(err);
    }
  }
);

export const createReview = createAsyncThunk(
  "book/createReview",
  async function (data, { rejectWithValue }) {
    try {
      const response = await fetch(
        `${BACKEND_URL}/books/${data.bookId}/reviews`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${data.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data.reviewData),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        toast.error(responseData.message);
        return rejectWithValue(responseData.message);
      }

      //console.log(responseData);

      toast.success("Review added succesfully.");

      return responseData;
    } catch (err) {
      console.log(err);
    }
  }
);

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {},
  extraReducers: (builders) =>
    builders
      .addCase(fetchBooks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.isBookSearch)
          state.searchBooks = action.payload.books;
        else {
          state.books = action.payload.books;
        }
        state.bookCount = action.payload.count;
        state.error = "";
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      }) // fetch books
      .addCase(fetchBookById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBook = action.payload.book;
        state.error = "";
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.isLoading = false;
        state.currentBook = null;
        state.error = action.payload;
      }) // fetchBookById
      .addCase(fetchEditBookById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEditBookById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editBook = action.payload.book;
        state.error = "";
      })
      .addCase(fetchEditBookById.rejected, (state, action) => {
        state.isLoading = false;
        state.editBook = null;
        state.error = "";
      }) // fetchBookById
      .addCase(updateBookById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBookById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = action.payload;
        state.error = "";
      })
      .addCase(updateBookById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = "";
      }) // updateBookById
      .addCase(createBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = action.payload;
        state.error = "";
      })
      .addCase(createBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = "";
      }) // createBook
      .addCase(createReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.isLoading = false;
        //state.books = action.payload;
        state.currentBook = action.payload.book;
        state.error = "";
      })
      .addCase(createReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = "";
      }), // addReview
});

//export const {} = bookSlice.actions;

export default bookSlice.reducer;
