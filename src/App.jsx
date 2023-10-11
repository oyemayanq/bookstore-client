import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./ui/AppLayout";
import ProtectedRoute from "./ui/ProtectedRoute";

//import SearchPage from "./pages/SearchPage";
// import LoginPage from "./pages/LoginPage";
// import SignupPage from "./pages/SignupPage";
// import CartPage from "./pages/CartPage";
// import BookDetailPage from "./pages/BookDetailPage";
// import PageNotFound from "./pages/PageNotFound";
// import HomePage from "./pages/HomePage";
// import UserPage from "./pages/UserPage";
// import CreateEditBookPage from "./pages/CreateEditBookPage";
// import OrderPage from "./pages/OrderPage";
// import OrderDetailPage from "./pages/OrderDetailPage";

import { Toaster } from "react-hot-toast";
import SpinnerFullPage from "./ui/SpinnerFullPage";

const UserPage = React.lazy(() => import("./pages/UserPage"));
const SearchPage = React.lazy(() => import("./pages/SearchPage"));
const SignupPage = React.lazy(() => import("./pages/SignupPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const CartPage = React.lazy(() => import("./pages/CartPage"));
const BookDetailPage = React.lazy(() => import("./pages/BookDetailPage"));
const PageNotFound = React.lazy(() => import("./pages/PageNotFound"));
const HomePage = React.lazy(() => import("./pages/HomePage"));
const CreateEditBookPage = React.lazy(() =>
  import("./pages/CreateEditBookPage")
);
const OrderPage = React.lazy(() => import("./pages/OrderPage"));
const OrderDetailPage = React.lazy(() => import("./pages/OrderDetailPage"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<SpinnerFullPage />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/my/profile" element={<UserPage />} />
              <Route path="/books/create" element={<CreateEditBookPage />} />
              <Route path="/my/orders" element={<OrderPage />} />
              <Route path="/my/orders/:orderId" element={<OrderDetailPage />} />
            </Route>
            <Route path="/" element={<HomePage />} />
            <Route path="/books/search" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/books/:bookId" element={<BookDetailPage />} />
            <Route path="/my/cart" element={<CartPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: { duration: 3000 },
          error: { duration: 5000 },
          style: {
            fontSize: "14px",
            fontWeight: "600",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "var(--color-light--2)",
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
