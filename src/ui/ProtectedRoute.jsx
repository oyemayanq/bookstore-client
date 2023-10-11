import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import SpinnerFullPage from "./SpinnerFullPage";

function ProtectedRoute() {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return <Outlet />;
}

export default ProtectedRoute;
