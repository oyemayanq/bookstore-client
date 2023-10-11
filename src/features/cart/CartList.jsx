import styles from "./CartList.module.css";
import CartItem from "./CartItem";

function CartList({ cartItems }) {
  return (
    <ul className={styles["cart-list"]}>
      {cartItems.map((item) => (
        <CartItem
          key={item.id}
          id={item.id}
          title={item.title}
          quantity={item.quantity}
          price={item.price}
        />
      ))}
    </ul>
  );
}

export default CartList;
