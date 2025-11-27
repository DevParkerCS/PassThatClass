import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./Authentication.module.scss";
import { createClient } from "@supabase/supabase-js";
import { Nav } from "../../components/Nav/Nav";
import { useAuthContext } from "../../context/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

export const Authentication = () => {
  const [loggingIn, setLoggingIn] = useState(true);
  const auth = useAuthContext();
  const nav = useNavigate();

  useEffect(() => {
    if (!auth.loading && auth.session) {
      nav("/dashboard");
    }
  }, [auth.loading, auth.session]);

  return (
    <div>
      <Nav />
      <div className={styles.authWrapper}>
        <p className={styles.authTitle}>{loggingIn ? "Log In" : "Sign Up"}</p>

        <AuthForm loggingIn={loggingIn} setLoggingIn={setLoggingIn} />
      </div>
    </div>
  );
};

type AuthFormProps = {
  loggingIn: boolean;
  setLoggingIn: Dispatch<SetStateAction<boolean>>;
};

export const AuthForm = ({ loggingIn, setLoggingIn }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifiedPassword, setVerifiedPassword] = useState("");
  const auth = useAuthContext();

  const ctaText = loggingIn
    ? "Don't have an account? "
    : "Already have an account? ";

  const ctaAction = loggingIn ? "Sign Up" : "Log In";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loggingIn) auth.handleLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.inputForm}>
      <div className={styles.inputsWrapper}>
        <Input
          placeholder="Enter Email"
          setValue={setEmail}
          title="Email"
          type="email"
          value={email}
        />

        <Input
          setValue={setPassword}
          placeholder="Enter Password"
          title="Password"
          type="password"
          value={password}
        />

        {!loggingIn && (
          <Input
            setValue={setVerifiedPassword}
            title="Verify Password"
            placeholder="Reenter Password"
            type="password"
            value={verifiedPassword}
          />
        )}
      </div>

      <button className={styles.inputBtn} type="submit">
        {loggingIn ? "Log In" : "Create Account"}
      </button>

      <p className={styles.ctaTxt}>
        {ctaText}
        <span className={styles.cta} onClick={() => setLoggingIn(!loggingIn)}>
          {ctaAction}
        </span>
      </p>
    </form>
  );
};

type InputProps = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  type: "email" | "password";
  title: string;
  placeholder: string;
};

const Input = ({ value, setValue, type, title, placeholder }: InputProps) => {
  return (
    <div className={styles.inputWrapper}>
      <label className={styles.inputLabel}>{title}</label>
      <input
        type={type}
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        required
      />
    </div>
  );
};
