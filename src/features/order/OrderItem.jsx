import { Link } from "react-router-dom";
import styles from "./OrderItem.module.css";

function OrderItem({ orderId, totalPrice }) {
  return (
    <Link to={`/my/orders/${orderId}`} className={styles["order-item-link"]}>
      <div className={styles["order-item"]}>
        <div className={styles.row}>
          <p className={styles["item-tag"]}>Order ID</p>
          <p className={styles["item-value"]}>{orderId}</p>
        </div>
        <div className={styles.row}>
          <p className={styles["item-tag"]}>Total Amount</p>
          <p className={styles["item-value"]}>Rs. {totalPrice}</p>
        </div>
      </div>
    </Link>
  );
}

export default OrderItem;
