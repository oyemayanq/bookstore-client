import { Link, useParams } from "react-router-dom";

import styles from "./OrderDetail.module.css";
import { useDispatch, useSelector } from "react-redux";
import SpinnerFullPage from "../../ui/SpinnerFullPage";
import { useEffect } from "react";
import { fetchOrderById } from "./orderSlice";
import { formatDate } from "../../utils/helpers";
import PageNotFound from "../../pages/PageNotFound";

function OrderDetail() {
  const { orderId } = useParams();
  const {
    isLoading,
    currentOrder: order,
    error,
  } = useSelector((state) => state.order);
  const { token, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated && orderId)
      dispatch(fetchOrderById({ token: token, orderId: orderId }));
  }, [dispatch, orderId, token, isAuthenticated]);

  if (error) {
    return <PageNotFound errorMessage={error} />;
  }

  if (isLoading || !order) {
    return <SpinnerFullPage />;
  }

  return (
    <div className={styles["order-detail"]}>
      <div className={styles["detail-container"]}>
        <h1>Order: {order._id}</h1>
        <section className={styles["order-section"]}>
          <h2 className={styles["section-title"]}>Customer Details</h2>
          <div className={styles.row}>
            <p className={styles["row-tag"]}>Name: </p>
            <p className={styles["row-value"]}>{order.user.name}</p>
          </div>
          <div className={styles.row}>
            <p className={styles["row-tag"]}>Email: </p>
            <p className={styles["row-value"]}>{order.user.email}</p>
          </div>
          <div className={styles.row}>
            <p className={styles["row-tag"]}>Order Date: </p>
            <p className={styles["row-value"]}>{formatDate(order.createdAt)}</p>
          </div>
        </section>
        <section
          className={`${styles["order-section"]} ${styles["section-with-border"]}`}
        >
          <h2 className={styles["section-title"]}>Order Items</h2>

          {order.orderItems.map((item) => {
            return (
              <div key={item.title} className={styles["item-row"]}>
                <Link to={`/books/${item.book}`} className={styles["row-tag"]}>
                  {item.title}
                </Link>
                <p className={styles["row-value"]}>
                  {item.quantity} x Rs. {item.price} = Rs.{" "}
                  {item.quantity * item.price}
                </p>
              </div>
            );
          })}

          {/* <div className={styles["item-row"]}>
            <Link className={styles["row-tag"]}>Book title </Link>
            <p className={styles["row-value"]}>1 x 49 = 49</p>
          </div>
          <div className={styles["item-row"]}>
            <Link className={styles["row-tag"]}>Book title </Link>
            <p className={styles["row-value"]}>1 x 49 = 49</p>
          </div>
          <div className={styles["item-row"]}>
            <Link className={styles["row-tag"]}>Book title </Link>
            <p className={styles["row-value"]}>1 x 49 = 49</p>
          </div> */}
          <div className={`${styles["item-row"]} ${styles["item-total"]}`}>
            <p>Total</p>
            <p>Rs. {order.totalPrice.toFixed(2)}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default OrderDetail;
