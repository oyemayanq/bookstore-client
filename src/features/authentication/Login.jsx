import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../ui/Button";
import styles from "./Login.module.css";
import Spinner from "../../ui/Spinner";
import Input from "../../ui/Input";
import Validator from "../../utils/validator";
import { EmailRegex } from "../../utils/constants";
import { loginUser } from "../user/userSlice";

const initialErrorValues = {
  email: "",
  password: "",
  isValid: true,
};

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(initialErrorValues);

  const dispatch = useDispatch();
  const { isLoading, isAuthenticated } = useSelector((state) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  function handleSubmit(e) {
    e.preventDefault();

    const validator = new Validator();

    validator.match(EmailRegex, "email", email, "Enter valid email");
    validator.minLength(
      "password",
      password,
      6,
      "Password should be at least 6 characters long."
    );
    validator.maxLength(
      "password",
      password,
      10,
      "Password should be at most 10 characters long."
    );

    if (validator.hasErrors()) {
      console.log(validator);
      setErrors({ ...validator.getErrors(), isValid: false });
      return;
    } else {
      setErrors(initialErrorValues);
    }

    console.log(email, password);

    dispatch(loginUser({ email: email.trim(), password: password.trim() }));
    //navigate("/", { replace: true });
  }

  return (
    <main className={styles.login}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prevState) => ({ ...prevState, isValid: true }));
          }}
          error={errors.email}
        />

        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prevState) => ({ ...prevState, isValid: true }));
          }}
          error={errors.password}
        />

        <div>
          {!isLoading ? (
            <Button
              onClick={handleSubmit}
              type="primary"
              buttonType="submit"
              disabled={isLoading || !errors.isValid}
            >
              Login
            </Button>
          ) : (
            <Spinner />
          )}
        </div>
      </form>
    </main>
  );
}
