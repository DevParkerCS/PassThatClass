import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./Authentication.module.scss";
import { createClient } from "@supabase/supabase-js";
import { Nav } from "../../components/Nav/Nav";
import { useAuthContext } from "../../context/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

export const Authentication = () => {
  const [loggingIn, setLoggingIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        <p className={styles.authTitle}>
          {auth.needsVerify
            ? "Check Your Email"
            : loggingIn
            ? "Log In"
            : "Sign Up"}
        </p>

        {auth.needsVerify ? (
          <ConfirmEmail email={email} />
        ) : (
          <AuthForm
            loggingIn={loggingIn}
            setLoggingIn={setLoggingIn}
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
          />
        )}
      </div>
    </div>
  );
};

type ConfirmEmailProps = {
  email: string;
};

const ConfirmEmail = ({ email }: ConfirmEmailProps) => {
  const auth = useAuthContext();
  const nav = useNavigate();
  const [disabled, setDisabled] = useState(false);

  const handleClick = async () => {
    try {
      setDisabled(true);
      await auth.resendVerification(email);

      setTimeout(() => {
        setDisabled(false);
      }, 30000);
    } catch (e) {
      console.error(e);
      setDisabled(false); // <- important
    }
  };

  useEffect(() => {
    if (auth.session) {
      nav("/dashboard");
    }
  }, [auth.session]);

  return (
    <div>
      <p className={styles.confirmTxt}>
        Please check your email for a verification link to complete your sign
        in.
      </p>
      <p className={styles.confirmSub}>Not seeing your email?</p>
      <button
        onClick={handleClick}
        className={`${styles.inputBtn} ${styles.confirmBtn} ${
          disabled && styles.disabled
        }`}
        disabled={disabled}
      >
        Resend Email
      </button>
    </div>
  );
};

type AuthFormProps = {
  loggingIn: boolean;
  setLoggingIn: Dispatch<SetStateAction<boolean>>;
  email: string;
  password: string;
  setEmail: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
};

export const AuthForm = ({
  loggingIn,
  setLoggingIn,
  email,
  password,
  setEmail,
  setPassword,
}: AuthFormProps) => {
  const [verifiedPassword, setVerifiedPassword] = useState("");
  const auth = useAuthContext();

  const ctaText = loggingIn
    ? "Don't have an account? "
    : "Already have an account? ";

  const ctaAction = loggingIn ? "Sign Up" : "Log In";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (loggingIn) await auth.handleLogin(email, password);
      else await auth.handleSignup(email, password);
    } catch (e) {
      console.log(e);
    }
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

      <button disabled={auth.loading} className={styles.inputBtn} type="submit">
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
