import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import styles from "./CartItem.module.css";
import { addToCart, removeFromCart } from "./cartSlice";

function CartItem({ id, title, quantity, price }) {
  const dispatch = useDispatch();

  const totalBookPrice = quantity * price;

  return (
    <li className={styles["cart-item"]}>
      <div className={styles["cart-item-title"]}>
        <h1>{title}</h1>
        <div className={styles["remove-item-action"]}>
          <Button
            onClick={() => {
              dispatch(removeFromCart({ type: "remove", id }));
            }}
            type="secondary"
          >
            Remove
          </Button>
        </div>
      </div>
      <div className={styles["cart-item-details"]}>
        <p className={styles["cart-item-price"]}>
          Rs. {totalBookPrice.toFixed(2)}
        </p>
        <div className={styles["cart-item-action"]}>
          <button
            onClick={() => {
              dispatch(removeFromCart({ type: "decrement", id }));
            }}
          >
            -
          </button>
          <p className={styles["cart-item-quantity"]}>{quantity}</p>
          <button
            onClick={() => {
              dispatch(addToCart({ id, title, quantity: 1, price }));
            }}
          >
            +
          </button>
        </div>
      </div>
    </li>
  );
}

export default CartItem;
