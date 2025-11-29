import { useNavigate } from "react-router-dom";
import { Nav } from "../../components/Nav/Nav";
import { useAuthContext } from "../../context/AuthContext/AuthContext";
import styles from "./EmailVerified.module.scss";

export const EmailVerified = () => {
  const auth = useAuthContext();
  const nav = useNavigate();

  const handleClick = () => {
    if (auth.session) nav("/dashboard");
    else nav("/login");
  };

  return (
    <div>
      <Nav />
      <div className={styles.contentWrapper}>
        <p className={styles.title}>Email Verified 🎉</p>
        <p className={styles.txt}>
          Your email has been confirmed and your PassThatClass account is ready
          to go.
        </p>

        <button className={styles.ctaBtn} onClick={handleClick}>
          {auth.session ? "Dashboard" : "Log In"}
        </button>
      </div>
    </div>
  );
};
