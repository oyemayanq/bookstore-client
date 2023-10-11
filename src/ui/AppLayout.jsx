import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";

import styles from "./AppLayout.module.css";
import AppNav from "./AppNav";
import { autoLoginUser } from "../features/user/userSlice";
import SpinnerFullPage from "./SpinnerFullPage";

function AppLayout() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(autoLoginUser(token));
    }
    setIsLoading(false);
  }, [dispatch]);

  if (isLoading) {
    return <SpinnerFullPage />;
  }

  return (
    <>
      <AppNav />
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}

export default AppLayout;
