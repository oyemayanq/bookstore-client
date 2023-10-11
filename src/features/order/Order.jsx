import OrderList from "./OrderList";
import styles from "./Order.module.css";

function Order() {
  return (
    <div className={styles.order}>
      <OrderList />
    </div>
  );
}

export default Order;
