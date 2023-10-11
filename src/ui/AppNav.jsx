import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./AppNav.module.css";
import Button from "./Button";
import { logOut } from "../features/user/userSlice";
import { CartIcon, CloseIcon, MenuIcon, SearchIcon } from "./Icons";
import { SideModal } from "./Modal";

function NavCartIcon({ extraStyle = "" }) {
  const cartQuantity = useSelector((state) => state.cart.cartItems.length);
  const navigate = useNavigate();

  function handleClick(e) {
    e.preventDefault();

    navigate("/my/cart");
  }

  return (
    <div
      onClick={handleClick}
      className={`${styles["cart"]} ${extraStyle ? styles[extraStyle] : ""}`}
    >
      <CartIcon size={26} />
      <p>{cartQuantity ? cartQuantity : ""}</p>
    </div>
  );
}

function MobileMenu({ onClose, isAuthenticated, handleLogout }) {
  return (
    <div className={styles["mobile-menu-list"]}>
      <div className={styles["mobile-menu-header"]}>
        <Link to="/my/cart">
          <NavCartIcon />
        </Link>
        <div onClick={onClose} className={styles["mobile-menu-icon"]}>
          <CloseIcon size={28} />
        </div>
      </div>

      <div className={styles.column}>
        {!isAuthenticated ? (
          <>
            <Link onClick={onClose} to="/login">
              <Button type="secondary">Login</Button>
            </Link>
            <Link onClick={onClose} to="/signup">
              <Button>Signup</Button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/books/create">
              <Button>Add Book</Button>
            </Link>
            <Link
              to="/my/profile"
              onClick={onClose}
              className={styles["menu-link"]}
            >
              Dashboard
            </Link>
            <Link
              to="/my/orders"
              onClick={onClose}
              className={styles["menu-link"]}
            >
              Orders
            </Link>
            <Button
              onClick={() => {
                onClose();
                handleLogout();
              }}
              type="secondary"
            >
              Logout
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function AppNav() {
  const [showNavMenu, setNavMenu] = useState(false);
  const [showMobileMenu, setMobileMenu] = useState(false);
  const [showMobileSearchForm, setMobileSearchForm] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const { isAuthenticated } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    setNavMenu(false);
    dispatch(logOut());
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    setMobileSearchForm(false);
    if (searchKey.trim().length === 0) {
      navigate("/");
      return;
    }

    //dispatch(fetchBooks({ searchKey: searchKey }));
    navigate(`/books/search?searchKey=${searchKey}`);
  }

  return (
    <>
      <nav className={styles.nav}>
        <NavLink className={styles["home-link"]} to="/">
          BookStore
        </NavLink>

        <div className={styles["nav-form"]}>
          <form onSubmit={handleSearchSubmit} className={styles["nav-search"]}>
            <input
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="Search books by Title or Author or Genre"
            />
            <Button buttonType="submit" onClick={handleSearchSubmit}>
              Search
            </Button>
          </form>
        </div>

        <div className={`${styles.row} ${styles["mobile-menu"]}`}>
          <div
            onClick={() => setMobileSearchForm((prevState) => !prevState)}
            className={styles["search-icon"]}
          >
            {!showMobileSearchForm ? (
              <SearchIcon size={24} />
            ) : (
              <CloseIcon size={30} />
            )}
          </div>
          <NavCartIcon />
          <div
            onClick={() => setMobileMenu(true)}
            className={styles["mobile-menu-icon"]}
          >
            <MenuIcon size={30} />
          </div>
          {showMobileMenu && (
            <SideModal onClose={() => setMobileMenu(false)}>
              <MobileMenu
                isAuthenticated={isAuthenticated}
                onClose={() => setMobileMenu(false)}
                handleLogout={handleLogout}
              />
            </SideModal>
          )}
        </div>

        <div className={`${styles.row} ${styles["nav-wide-screen-menu"]}`}>
          <NavCartIcon />
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <Button type="secondary">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Signup</Button>
              </Link>
            </>
          ) : (
            <>
              <div
                onMouseOver={() => setNavMenu(true)}
                onMouseOut={() => setNavMenu(false)}
                className={styles["nav-menu"]}
              >
                <p className={styles["menu-title"]}>Profile &darr;</p>
                {showNavMenu && (
                  <div
                    onMouseOver={() => setNavMenu(true)}
                    onMouseOut={() => setNavMenu(false)}
                    className={styles.menu}
                  >
                    <Link
                      to="/my/profile"
                      onClick={() => setNavMenu(false)}
                      className={styles["menu-link"]}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/my/orders"
                      onClick={() => setNavMenu(false)}
                      className={styles["menu-link"]}
                    >
                      Orders
                    </Link>
                    <Button onClick={handleLogout} type="secondary">
                      Logout
                    </Button>
                  </div>
                )}
              </div>
              <Link to="/books/create">
                <Button>Add Book</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
      {showMobileSearchForm && (
        <div className={styles["mobile-search-form"]}>
          <form onSubmit={handleSearchSubmit} className={styles["nav-search"]}>
            <input
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="Search books by Title or Author or Genre"
            />
            <Button buttonType="submit" onClick={handleSearchSubmit}>
              Search
            </Button>
          </form>
        </div>
      )}
    </>
  );
}

export default AppNav;
