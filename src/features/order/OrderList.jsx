import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect } from "react";

import OrderItem from "./OrderItem";
import styles from "./OrderList.module.css";
import { fetchOrders } from "./orderSlice";
import SpinnerFullPage from "../../ui/SpinnerFullPage";
import Button from "../../ui/Button";
import PageNotFound from "../../pages/PageNotFound";

function OrderList() {
  const dispatch = useDispatch();
  const { isLoading, orders, error } = useSelector((state) => state.order);
  const { token, isAuthenticated } = useSelector((state) => state.user);
  //console.log(orders);

  useEffect(() => {
    //console.log("sending dispatch");
    if (isAuthenticated) {
      dispatch(fetchOrders({ token: token }));
    }
  }, [dispatch, token, isAuthenticated]);

  if (error) {
    return <PageNotFound errorMessage={error} />;
  }

  if (isLoading || !orders) return <SpinnerFullPage />;

  return (
    <div className={styles["order-list"]}>
      {orders.length === 0 ? (
        <div className={styles.column}>
          <p>{"You haven't ordered any books yet!"}</p>
          <Link to="/">
            <Button>Browse books</Button>
          </Link>
        </div>
      ) : (
        <>
          <h1>
            Your orders, <span>Mayank Mishra</span>
          </h1>
          {orders.map((order) => (
            <OrderItem
              key={order._id}
              orderId={order._id}
              totalPrice={order.totalPrice}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default OrderList;
