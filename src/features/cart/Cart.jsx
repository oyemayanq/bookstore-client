import styles from "./Cart.module.css";
import CartList from "./CartList";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearCart } from "./cartSlice";
import { createOrder } from "../order/orderSlice";

function Cart() {
  const { cartItems, totalPrice } = useSelector((state) => state.cart);
  const { token, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className={styles.cart}>
      {cartItems.length === 0 ? (
        <div className={styles["empty-cart"]}>
          <p>You cart is empty!</p>
          <Link to="/">
            <Button>Browse Books</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className={styles["header-row"]}>
            <h1 className={styles["cart-header"]}>
              {cartItems.length === 1
                ? "1 Book added"
                : `${cartItems.length} Books added`}
            </h1>
            <Button
              onClick={() => {
                dispatch(clearCart());
              }}
            >
              Clear Cart
            </Button>
          </div>
          <div className={styles["cart-detail"]}>
            <div className={styles["cart-list"]}>
              <CartList cartItems={cartItems} />
            </div>
            <div className={styles["order-summary"]}>
              <h1>Order Summary</h1>
              <div className={styles["order-detail"]}>
                <p className={styles["order-price-tag"]}>Item total(MRP)</p>
                <p className={styles["order-price"]}>Rs. {totalPrice}</p>
              </div>
              {isAuthenticated ? (
                <Button
                  onClick={() => {
                    dispatch(
                      createOrder({
                        token: token,
                        order: {
                          orderItems: cartItems,
                          totalPrice: totalPrice,
                        },
                        callback: (orderId) => {
                          navigate(`/my/orders/${orderId}`, { replace: true });
                        },
                      })
                    );
                    dispatch(clearCart());
                  }}
                >
                  Order
                </Button>
              ) : (
                <Link to="/login">
                  <Button type="secondary">Login to order</Button>
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
